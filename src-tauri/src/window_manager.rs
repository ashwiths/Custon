use std::mem;
use windows_sys::Win32::Foundation::{BOOL, HWND, LPARAM, RECT};
use windows_sys::Win32::Graphics::Gdi::{MonitorFromWindow, MONITOR_DEFAULTTONEAREST};
use windows_sys::Win32::System::Threading::GetCurrentProcessId;
use windows_sys::Win32::UI::WindowsAndMessaging::*;

use crate::workspace_state::{ToggleState, WindowSnapshot, WorkspaceState};

struct EnumContext {
    self_pid: u32,
    snapshots: Vec<WindowSnapshot>,
}

unsafe extern "system" fn enum_windows_callback(hwnd: HWND, lparam: LPARAM) -> BOOL {
    let context = &mut *(lparam as *mut EnumContext);

    // 1. Must be visible
    if IsWindowVisible(hwnd) == 0 {
        return 1;
    }

    // 2. Ignore window owned by our own application
    let mut pid: u32 = 0;
    GetWindowThreadProcessId(hwnd, &mut pid);
    if pid == context.self_pid {
        return 1;
    }

    // 3. Ignore zero-size or offscreen utility windows
    let mut rect: RECT = mem::zeroed();
    if GetWindowRect(hwnd, &mut rect) == 0 {
        return 1;
    }
    let width = rect.right - rect.left;
    let height = rect.bottom - rect.top;
    if width <= 10 || height <= 10 {
        return 1;
    }

    // 4. Class Name Filtering (Desktop, Taskbar, System UI)
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

    // 5. Extended style filtering (Tool windows vs App windows)
    let ex_style = GetWindowLongW(hwnd, GWL_EXSTYLE) as u32;
    if (ex_style & WS_EX_TOOLWINDOW != 0) && (ex_style & WS_EX_APPWINDOW == 0) {
        return 1;
    }

    // 6. Window Title
    let mut title_buf = [0u16; 512];
    let title_len = GetWindowTextW(hwnd, title_buf.as_mut_ptr(), 512);
    let title = String::from_utf16_lossy(&title_buf[..title_len as usize]);

    // 7. Capture Window Placement and Monitor
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

    fn hide_all(state: &WorkspaceState) -> usize {
        let self_pid = unsafe { GetCurrentProcessId() };

        let mut context = EnumContext {
            self_pid,
            snapshots: Vec::new(),
        };

        unsafe {
            EnumWindows(
                Some(enum_windows_callback),
                &mut context as *mut EnumContext as LPARAM,
            );
        }

        let count = context.snapshots.len();

        // Perform instant, non-blocking window minimization / hiding
        for snapshot in &context.snapshots {
            unsafe {
                ShowWindowAsync(snapshot.hwnd, SW_MINIMIZE as i32);
            }
        }

        let mut saved = state.saved_windows.lock().unwrap();
        *saved = context.snapshots;

        count
    }

    fn restore_all(state: &WorkspaceState) -> usize {
        let mut saved = state.saved_windows.lock().unwrap();
        let count = saved.len();

        // Restore windows in reverse Z-order to maintain original stacking order
        for snapshot in saved.iter().rev() {
            unsafe {
                // Edge Case: If window was closed by user while hidden, skip it!
                if IsWindow(snapshot.hwnd) == 0 {
                    continue;
                }

                // Restore Placement (Monitor, position, size, state)
                SetWindowPlacement(snapshot.hwnd, &snapshot.placement);

                // Restore Z-Order & Window Flags
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
                    ShowWindowAsync(snapshot.hwnd, SW_RESTORE as i32);
                }
            }
        }

        saved.clear();
        count
    }
}
