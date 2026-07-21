use std::mem;
use windows_sys::Win32::Foundation::{CloseHandle, BOOL, HWND, LPARAM, RECT};
use windows_sys::Win32::Graphics::Gdi::{MonitorFromWindow, MONITOR_DEFAULTTONEAREST};
use windows_sys::Win32::System::Threading::{
    OpenProcess, QueryFullProcessImageNameW, PROCESS_QUERY_INFORMATION, PROCESS_VM_READ,
};
use windows_sys::Win32::UI::WindowsAndMessaging::*;

use crate::workspace_state::{ToggleState, WindowSnapshot, WorkspaceState};

fn get_process_exe_name(pid: u32) -> String {
    unsafe {
        let handle = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, 0, pid);
        let h = if handle == 0 {
            OpenProcess(0x1000, 0, pid)
        } else {
            handle
        };

        if h == 0 {
            return String::new();
        }

        let mut buf = [0u16; 1024];
        let mut size = 1024u32;
        let res = QueryFullProcessImageNameW(h, 0, buf.as_mut_ptr(), &mut size);
        CloseHandle(h);

        if res != 0 {
            let full_path = String::from_utf16_lossy(&buf[..size as usize]);
            if let Some(filename) = full_path.rsplit('\\').next() {
                return filename.to_lowercase();
            }
        }
        String::new()
    }
}

pub fn matches_target_apps(exe_name: &str, title: &str, target_apps: &[String]) -> bool {
    let exe_lower = exe_name.to_lowercase();
    let title_lower = title.to_lowercase();

    for target in target_apps {
        let t = target.to_lowercase().trim().to_string();
        if t.is_empty() {
            continue;
        }

        if t == "all-apps" {
            return true;
        }

        match t.as_str() {
            "chrome" | "google chrome" => {
                if exe_lower.contains("chrome") || title_lower.contains("chrome") {
                    return true;
                }
            }
            "vscode" | "vs code" | "visual studio code" => {
                if exe_lower.contains("code")
                    || title_lower.contains("visual studio code")
                    || title_lower.contains("vs code")
                {
                    return true;
                }
            }
            "discord" => {
                if exe_lower.contains("discord") || title_lower.contains("discord") {
                    return true;
                }
            }
            "spotify" => {
                if exe_lower.contains("spotify") || title_lower.contains("spotify") {
                    return true;
                }
            }
            "edge" | "microsoft edge" => {
                if exe_lower.contains("msedge") || title_lower.contains("edge") {
                    return true;
                }
            }
            custom => {
                let clean_custom = custom.replace('-', " ");
                if (!exe_lower.is_empty()
                    && (exe_lower.contains(&t) || exe_lower.contains(&clean_custom)))
                    || title_lower.contains(&t)
                    || title_lower.contains(&clean_custom)
                {
                    return true;
                }
            }
        }
    }

    false
}

struct EnumContext {
    snapshots: Vec<WindowSnapshot>,
}

unsafe extern "system" fn enum_windows_callback(hwnd: HWND, lparam: LPARAM) -> BOOL {
    let context = &mut *(lparam as *mut EnumContext);

    // 1. Must be visible
    if IsWindowVisible(hwnd) == 0 {
        return 1;
    }

    // 2. Ignore zero-size or offscreen utility windows
    let mut rect: RECT = mem::zeroed();
    if GetWindowRect(hwnd, &mut rect) == 0 {
        return 1;
    }
    let width = rect.right - rect.left;
    let height = rect.bottom - rect.top;
    if width <= 10 || height <= 10 {
        return 1;
    }

    // 3. Class Name Filtering (Desktop, Taskbar, System UI)
    let mut class_buf = [0u16; 256];
    let class_len = GetClassNameW(hwnd, class_buf.as_mut_ptr(), 256);
    let class_name = String::from_utf16_lossy(&class_buf[..class_len as usize]);

    if class_name == "Progman"
        || class_name == "WorkerW"
        || class_name == "Shell_TrayWnd"
        || class_name == "Shell_SecondaryTrayWnd"
        || class_name == "Windows.UI.Core.CoreWindow"
        || class_name == "MultitaskingViewFrame"
        || class_name == "SideBar_HiddenWindow"
    {
        return 1;
    }

    // 4. Extended style filtering (Tool windows vs App windows)
    let ex_style = GetWindowLongW(hwnd, GWL_EXSTYLE) as u32;
    if (ex_style & WS_EX_TOOLWINDOW != 0) && (ex_style & WS_EX_APPWINDOW == 0) {
        return 1;
    }

    // 5. Window Title
    let mut title_buf = [0u16; 512];
    let title_len = GetWindowTextW(hwnd, title_buf.as_mut_ptr(), 512);
    let title = String::from_utf16_lossy(&title_buf[..title_len as usize]);

    // 6. Capture Window Placement and Monitor
    let mut pid: u32 = 0;
    GetWindowThreadProcessId(hwnd, &mut pid);

    let mut placement: WINDOWPLACEMENT = mem::zeroed();
    placement.length = mem::size_of::<WINDOWPLACEMENT>() as u32;
    if GetWindowPlacement(hwnd, &mut placement) == 0 {
        return 1;
    }

    let monitor = MonitorFromWindow(hwnd, MONITOR_DEFAULTTONEAREST);
    let was_maximized = placement.showCmd == SW_SHOWMAXIMIZED as u32;
    let was_minimized = IsIconic(hwnd) != 0;

    context.snapshots.push(WindowSnapshot {
        hwnd,
        process_id: pid,
        title,
        placement,
        rect,
        z_order_index: context.snapshots.len(),
        monitor: monitor as isize,
        show_cmd: placement.showCmd,
        was_minimized,
        was_maximized,
    });

    1
}

pub struct WindowManager;

impl WindowManager {
    pub fn toggle(state: &WorkspaceState) -> (ToggleState, usize) {
        // Prevent double execution / race conditions if shortcut is spammed
        if !state.acquire_lock() {
            let current = *state.toggle_state.lock().unwrap();
            return (current, 0);
        }

        let current_state = *state.toggle_state.lock().unwrap();
        let result = match current_state {
            ToggleState::Visible => {
                let count = Self::hide_all(state);
                *state.toggle_state.lock().unwrap() = ToggleState::Hidden;
                (ToggleState::Hidden, count)
            }
            ToggleState::Hidden => {
                let count = Self::restore_all(state);
                *state.toggle_state.lock().unwrap() = ToggleState::Visible;
                (ToggleState::Visible, count)
            }
        };

        state.release_lock();
        result
    }

    pub fn toggle_target_apps(
        state: &WorkspaceState,
        shortcut_id: &str,
        target_apps: &[String],
        mode: &str,
    ) -> (ToggleState, usize) {
        if !state.acquire_lock() {
            let current = state.get_shortcut_state(shortcut_id);
            return (current, 0);
        }

        let current_state = state.get_shortcut_state(shortcut_id);
        let result = if mode == "close" {
            let count = Self::close_target_apps(target_apps);
            (ToggleState::Visible, count)
        } else {
            match current_state {
                ToggleState::Visible => {
                    let count = Self::hide_target_apps(state, shortcut_id, target_apps);
                    state.set_shortcut_state(shortcut_id, ToggleState::Hidden);
                    (ToggleState::Hidden, count)
                }
                ToggleState::Hidden => {
                    let count = Self::restore_target_apps(state, shortcut_id);
                    state.set_shortcut_state(shortcut_id, ToggleState::Visible);
                    (ToggleState::Visible, count)
                }
            }
        };

        state.release_lock();
        result
    }

    fn hide_all(state: &WorkspaceState) -> usize {
        let mut context = EnumContext {
            snapshots: Vec::new(),
        };

        unsafe {
            EnumWindows(
                Some(enum_windows_callback),
                &mut context as *mut EnumContext as LPARAM,
            );
        }

        let count = context.snapshots.len();

        for snapshot in &context.snapshots {
            unsafe {
                ShowWindowAsync(snapshot.hwnd, SW_HIDE as i32);
            }
        }

        let mut saved = state.saved_windows.lock().unwrap();
        *saved = context.snapshots;

        count
    }

    fn restore_all(state: &WorkspaceState) -> usize {
        let mut saved = state.saved_windows.lock().unwrap();
        let count = saved.len();

        for snapshot in saved.iter().rev() {
            unsafe {
                if IsWindow(snapshot.hwnd) == 0 {
                    continue;
                }

                SetWindowPlacement(snapshot.hwnd, &snapshot.placement);

                SetWindowPos(
                    snapshot.hwnd,
                    HWND_TOP,
                    snapshot.rect.left,
                    snapshot.rect.top,
                    snapshot.rect.right - snapshot.rect.left,
                    snapshot.rect.bottom - snapshot.rect.top,
                    SWP_NOACTIVATE | SWP_SHOWWINDOW,
                );

                if snapshot.was_maximized {
                    ShowWindowAsync(snapshot.hwnd, SW_SHOWMAXIMIZED as i32);
                } else if snapshot.was_minimized {
                    ShowWindowAsync(snapshot.hwnd, SW_SHOWMINIMIZED as i32);
                } else {
                    ShowWindowAsync(snapshot.hwnd, SW_SHOW as i32);
                }
            }
        }

        saved.clear();
        count
    }

    fn hide_target_apps(
        state: &WorkspaceState,
        shortcut_id: &str,
        target_apps: &[String],
    ) -> usize {
        let mut context = EnumContext {
            snapshots: Vec::new(),
        };

        unsafe {
            EnumWindows(
                Some(enum_windows_callback),
                &mut context as *mut EnumContext as LPARAM,
            );
        }

        let filtered_snapshots: Vec<WindowSnapshot> = context
            .snapshots
            .into_iter()
            .filter(|snapshot| {
                let exe_name = get_process_exe_name(snapshot.process_id);
                matches_target_apps(&exe_name, &snapshot.title, target_apps)
            })
            .collect();

        let count = filtered_snapshots.len();

        for snapshot in &filtered_snapshots {
            unsafe {
                ShowWindowAsync(snapshot.hwnd, SW_HIDE as i32);
            }
        }

        let mut shortcut_windows = state.shortcut_windows.lock().unwrap();
        shortcut_windows.insert(shortcut_id.to_string(), filtered_snapshots);

        count
    }

    fn restore_target_apps(state: &WorkspaceState, shortcut_id: &str) -> usize {
        let mut shortcut_windows = state.shortcut_windows.lock().unwrap();
        let saved_snapshots = match shortcut_windows.remove(shortcut_id) {
            Some(windows) => windows,
            None => return 0,
        };

        let count = saved_snapshots.len();

        for snapshot in saved_snapshots.iter().rev() {
            unsafe {
                if IsWindow(snapshot.hwnd) == 0 {
                    continue;
                }

                SetWindowPlacement(snapshot.hwnd, &snapshot.placement);

                SetWindowPos(
                    snapshot.hwnd,
                    HWND_TOP,
                    snapshot.rect.left,
                    snapshot.rect.top,
                    snapshot.rect.right - snapshot.rect.left,
                    snapshot.rect.bottom - snapshot.rect.top,
                    SWP_NOACTIVATE | SWP_SHOWWINDOW,
                );

                if snapshot.was_maximized {
                    ShowWindowAsync(snapshot.hwnd, SW_SHOWMAXIMIZED as i32);
                } else if snapshot.was_minimized {
                    ShowWindowAsync(snapshot.hwnd, SW_SHOWMINIMIZED as i32);
                } else {
                    ShowWindowAsync(snapshot.hwnd, SW_SHOW as i32);
                }
            }
        }

        count
    }

    pub fn close_target_apps(target_apps: &[String]) -> usize {
        let mut context = EnumContext {
            snapshots: Vec::new(),
        };

        unsafe {
            EnumWindows(
                Some(enum_windows_callback),
                &mut context as *mut EnumContext as LPARAM,
            );
        }

        let filtered_snapshots: Vec<WindowSnapshot> = context
            .snapshots
            .into_iter()
            .filter(|snapshot| {
                let exe_name = get_process_exe_name(snapshot.process_id);
                matches_target_apps(&exe_name, &snapshot.title, target_apps)
            })
            .collect();

        let count = filtered_snapshots.len();

        for snapshot in &filtered_snapshots {
            unsafe {
                PostMessageW(snapshot.hwnd, WM_CLOSE, 0, 0);
            }
        }

        count
    }
}

