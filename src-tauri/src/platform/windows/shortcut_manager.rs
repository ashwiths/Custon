use std::collections::HashMap;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{mpsc, Arc, Mutex};
use std::thread;
use tauri::{AppHandle, Emitter};
use windows_sys::Win32::System::Threading::GetCurrentThreadId;
use windows_sys::Win32::UI::Input::KeyboardAndMouse::*;
use windows_sys::Win32::UI::WindowsAndMessaging::*;

use crate::common::models::{ShortcutConfig, AllKeyShortcutConfig, ToggleState, WorkspaceState};
use crate::platform::windows::window_manager::WindowsWindowManager as WindowManager;
use crate::platform::{PlatformShortcutManager, PlatformWindowManager};

const BASE_HOTKEY_ID: i32 = 0x9000;
const BASE_ALL_KEY_HOTKEY_ID: i32 = 0xA000;
const WM_UPDATE_HOTKEYS: u32 = WM_USER + 0x101;
const WM_UPDATE_ALL_KEYS: u32 = WM_USER + 0x102;

pub struct WindowsShortcutManager {
    is_running: AtomicBool,
    tx: Mutex<Option<mpsc::Sender<Vec<ShortcutConfig>>>>,
    all_key_tx: Mutex<Option<mpsc::Sender<Vec<AllKeyShortcutConfig>>>>,
    listener_thread_id: Mutex<u32>,
}

impl WindowsShortcutManager {
    fn parse_key_combo(combo_str: &str) -> (u32, u32) {
        let parts: Vec<&str> = combo_str.split('+').map(|s| s.trim()).collect();
        let mut modifiers: u32 = MOD_NOREPEAT;
        let mut vk_code: u32 = 0;

        for part in parts {
            match part.to_lowercase().as_str() {
                "ctrl" | "control" => modifiers |= MOD_CONTROL,
                "alt" => modifiers |= MOD_ALT,
                "shift" => modifiers |= MOD_SHIFT,
                "win" | "cmd" | "super" => modifiers |= MOD_WIN,
                key => {
                    vk_code = match key {
                        "space" => VK_SPACE as u32,
                        "esc" | "escape" => VK_ESCAPE as u32,
                        "enter" | "return" => VK_RETURN as u32,
                        "tab" => VK_TAB as u32,
                        "backspace" => VK_BACK as u32,
                        "delete" | "del" => VK_DELETE as u32,
                        "end" => VK_END as u32,
                        "home" => VK_HOME as u32,
                        "pageup" | "prior" => VK_PRIOR as u32,
                        "pagedown" | "next" => VK_NEXT as u32,
                        "up" => VK_UP as u32,
                        "down" => VK_DOWN as u32,
                        "left" => VK_LEFT as u32,
                        "right" => VK_RIGHT as u32,
                        "prtscn" | "printscreen" | "snapshot" => VK_SNAPSHOT as u32,
                        "comma" | "," => VK_OEM_COMMA as u32,
                        "period" | "." => VK_OEM_PERIOD as u32,
                        "minus" | "-" => VK_OEM_MINUS as u32,
                        "plus" | "equal" | "=" => VK_OEM_PLUS as u32,
                        "slash" | "/" => VK_OEM_2 as u32,
                        "semicolon" | ";" => VK_OEM_1 as u32,
                        "quote" | "'" => VK_OEM_7 as u32,
                        "bracketleft" | "[" => VK_OEM_4 as u32,
                        "bracketright" | "]" => VK_OEM_6 as u32,
                        "backslash" | "\\" => VK_OEM_5 as u32,
                        "backquote" | "`" => VK_OEM_3 as u32,
                        f if f.starts_with('f') && f.len() > 1 => {
                            if let Ok(num) = f[1..].parse::<u32>() {
                                VK_F1 as u32 + num - 1
                            } else {
                                0
                            }
                        }
                        single if single.len() == 1 => {
                            let ch = single.chars().next().unwrap().to_ascii_uppercase();
                            match ch {
                                'A'..='Z' => ch as u32,
                                '0'..='9' => ch as u32,
                                ',' => VK_OEM_COMMA as u32,
                                '.' => VK_OEM_PERIOD as u32,
                                '-' => VK_OEM_MINUS as u32,
                                '=' | '+' => VK_OEM_PLUS as u32,
                                '/' | '?' => VK_OEM_2 as u32,
                                ';' | ':' => VK_OEM_1 as u32,
                                '\'' | '"' => VK_OEM_7 as u32,
                                '[' | '{' => VK_OEM_4 as u32,
                                ']' | '}' => VK_OEM_6 as u32,
                                '\\' | '|' => VK_OEM_5 as u32,
                                '`' | '~' => VK_OEM_3 as u32,
                                _ => 0,
                            }
                        }
                        _ => 0,
                    };
                }
            }
        }

        (modifiers, vk_code)
    }

    fn send_key_combo(modifier_vks: &[u16], main_vk: u16) {
        unsafe {
            let mut inputs: Vec<INPUT> = Vec::new();

            for &m in modifier_vks {
                let mut input: INPUT = std::mem::zeroed();
                input.r#type = INPUT_KEYBOARD;
                input.Anonymous.ki.wVk = m;
                inputs.push(input);
            }

            if main_vk != 0 {
                let mut input: INPUT = std::mem::zeroed();
                input.r#type = INPUT_KEYBOARD;
                input.Anonymous.ki.wVk = main_vk;
                inputs.push(input);

                let mut input_up: INPUT = std::mem::zeroed();
                input_up.r#type = INPUT_KEYBOARD;
                input_up.Anonymous.ki.wVk = main_vk;
                input_up.Anonymous.ki.dwFlags = KEYEVENTF_KEYUP;
                inputs.push(input_up);
            }

            for &m in modifier_vks.iter().rev() {
                let mut input: INPUT = std::mem::zeroed();
                input.r#type = INPUT_KEYBOARD;
                input.Anonymous.ki.wVk = m;
                input.Anonymous.ki.dwFlags = KEYEVENTF_KEYUP;
                inputs.push(input);
            }

            if !inputs.is_empty() {
                SendInput(inputs.len() as u32, inputs.as_ptr(), std::mem::size_of::<INPUT>() as i32);
            }
        }
    }

    fn execute_system_action(system_action: &str) {
        match system_action {
            "show_desktop" => {
                Self::send_key_combo(&[VK_LWIN], VK_D);
            }
            "open_explorer" => {
                Self::send_key_combo(&[VK_LWIN], VK_E);
            }
            "open_settings" => {
                Self::send_key_combo(&[VK_LWIN], VK_I);
            }
            "open_run" => {
                Self::send_key_combo(&[VK_LWIN], VK_R);
            }
            "open_search" => {
                Self::send_key_combo(&[VK_LWIN], VK_S);
            }
            "lock_pc" => {
                unsafe {
                    windows_sys::Win32::System::Shutdown::LockWorkStation();
                }
            }
            "take_screenshot" | "snipping_tool" => {
                Self::send_key_combo(&[VK_LWIN, VK_SHIFT], VK_S);
            }
            "task_manager" => {
                Self::send_key_combo(&[VK_CONTROL, VK_SHIFT], VK_ESCAPE);
            }
            "projection_settings" => {
                Self::send_key_combo(&[VK_LWIN], VK_P);
            }
            "close_active_window" => {
                unsafe {
                    let hwnd = GetForegroundWindow();
                    if hwnd != 0 {
                        PostMessageW(hwnd, WM_CLOSE, 0, 0);
                    }
                }
            }
            "copy" => {
                Self::send_key_combo(&[VK_CONTROL], VK_C);
            }
            "cut" => {
                Self::send_key_combo(&[VK_CONTROL], VK_X);
            }
            "paste" => {
                Self::send_key_combo(&[VK_CONTROL], VK_V);
            }
            "select_all" => {
                Self::send_key_combo(&[VK_CONTROL], VK_A);
            }
            "undo" => {
                Self::send_key_combo(&[VK_CONTROL], VK_Z);
            }
            "redo" => {
                Self::send_key_combo(&[VK_CONTROL], VK_Y);
            }
            "switch_apps" => {
                Self::send_key_combo(&[VK_MENU], VK_TAB);
            }
            "open_task_view" => {
                Self::send_key_combo(&[VK_LWIN], VK_TAB);
            }
            "new_virtual_desktop" => {
                Self::send_key_combo(&[VK_LWIN, VK_CONTROL], VK_D);
            }
            "close_virtual_desktop" => {
                Self::send_key_combo(&[VK_LWIN, VK_CONTROL], VK_F4);
            }
            _ => {}
        }
    }
}

impl PlatformShortcutManager for WindowsShortcutManager {
    fn new() -> Self {
        Self {
            is_running: AtomicBool::new(false),
            tx: Mutex::new(None),
            all_key_tx: Mutex::new(None),
            listener_thread_id: Mutex::new(0),
        }
    }

    fn start_listener(
        &self,
        app_handle: AppHandle,
        workspace_state: Arc<WorkspaceState>,
        initial_shortcuts: Vec<ShortcutConfig>,
    ) {
        if self.is_running.swap(true, Ordering::SeqCst) {
            return;
        }

        let (tx, rx) = mpsc::channel::<Vec<ShortcutConfig>>();
        *self.tx.lock().unwrap() = Some(tx);

        let (all_tx, all_rx) = mpsc::channel::<Vec<AllKeyShortcutConfig>>();
        *self.all_key_tx.lock().unwrap() = Some(all_tx);

        let (thread_id_tx, thread_id_rx) = mpsc::channel::<u32>();

        thread::spawn(move || {
            let thread_id = unsafe { GetCurrentThreadId() };
            let _ = thread_id_tx.send(thread_id);

            let mut registered_map: HashMap<i32, ShortcutConfig> = HashMap::new();
            let mut registered_all_keys_map: HashMap<i32, AllKeyShortcutConfig> = HashMap::new();

            let register_configs = |configs: &Vec<ShortcutConfig>, map: &mut HashMap<i32, ShortcutConfig>| {
                for (id, _cfg) in map.drain() {
                    unsafe {
                        UnregisterHotKey(0, id);
                    }
                }
                for (idx, cfg) in configs.iter().enumerate() {
                    let hotkey_id = BASE_HOTKEY_ID + idx as i32;
                    let combo_str = cfg.keys.join(" + ");
                    let (modifiers, vk_code) = Self::parse_key_combo(&combo_str);
                    if vk_code != 0 {
                        let ok = unsafe { RegisterHotKey(0, hotkey_id, modifiers, vk_code) };
                        if ok != 0 {
                            map.insert(hotkey_id, cfg.clone());
                        }
                    }
                }
            };

            let register_all_keys = |configs: &Vec<AllKeyShortcutConfig>, map: &mut HashMap<i32, AllKeyShortcutConfig>| {
                for (id, _cfg) in map.drain() {
                    unsafe {
                        UnregisterHotKey(0, id);
                    }
                }
                for (idx, cfg) in configs.iter().enumerate() {
                    if !cfg.status || cfg.custom_shortcut.trim().is_empty() {
                        continue;
                    }
                    let hotkey_id = BASE_ALL_KEY_HOTKEY_ID + idx as i32;
                    let (modifiers, vk_code) = Self::parse_key_combo(&cfg.custom_shortcut);
                    if vk_code != 0 {
                        let ok = unsafe { RegisterHotKey(0, hotkey_id, modifiers, vk_code) };
                        if ok != 0 {
                            map.insert(hotkey_id, cfg.clone());
                        }
                    }
                }
            };

            register_configs(&initial_shortcuts, &mut registered_map);

            let mut msg: MSG = unsafe { std::mem::zeroed() };
            unsafe {
                PeekMessageW(&mut msg, 0, 0, 0, PM_NOREMOVE);
            }

            loop {
                let res = unsafe { GetMessageW(&mut msg, 0, 0, 0) };
                if res <= 0 {
                    break;
                }

                if msg.message == WM_HOTKEY {
                    let hotkey_id = msg.wParam as i32;

                    if hotkey_id >= BASE_ALL_KEY_HOTKEY_ID {
                        if let Some(config) = registered_all_keys_map.get(&hotkey_id).cloned() {
                            Self::execute_system_action(&config.system_action);
                        }
                    } else if let Some(config) = registered_map.get(&hotkey_id).cloned() {
                        let is_full = config.is_full_close.unwrap_or(false)
                            || config.apps.contains(&"all-apps".to_string());

                        if is_full {
                            let (new_state, count) = WindowManager::toggle(&workspace_state);
                            let state_str = match new_state {
                                ToggleState::Visible => "visible",
                                ToggleState::Hidden => "hidden",
                            };
                            let _ = app_handle.emit(
                                "workspace-toggle-event",
                                serde_json::json!({
                                    "id": config.id,
                                    "name": config.name,
                                    "state": state_str,
                                    "count": count
                                }),
                            );
                        } else {
                            let mode = config.execution_mode.as_deref().unwrap_or("stealth");
                            let (new_state, count) = WindowManager::toggle_target_apps(
                                &workspace_state,
                                &config.id,
                                &config.apps,
                                mode,
                            );
                            let state_str = match new_state {
                                ToggleState::Visible => "visible",
                                ToggleState::Hidden => "hidden",
                            };
                            let payload = serde_json::json!({
                                "id": config.id,
                                "name": config.name,
                                "state": state_str,
                                "count": count,
                                "apps": config.apps,
                                "mode": mode
                            });
                            let _ = app_handle.emit("shortcut-trigger-event", payload.clone());
                            let _ = app_handle.emit("workspace-toggle-event", payload);
                        }
                    }
                } else if msg.message == WM_UPDATE_HOTKEYS {
                    while let Ok(new_configs) = rx.try_recv() {
                        register_configs(&new_configs, &mut registered_map);
                    }
                } else if msg.message == WM_UPDATE_ALL_KEYS {
                    while let Ok(new_all_configs) = all_rx.try_recv() {
                        register_all_keys(&new_all_configs, &mut registered_all_keys_map);
                    }
                }

                unsafe {
                    TranslateMessage(&msg);
                    DispatchMessageW(&msg);
                }
            }

            for (id, _) in registered_map.drain() {
                unsafe {
                    UnregisterHotKey(0, id);
                }
            }
            for (id, _) in registered_all_keys_map.drain() {
                unsafe {
                    UnregisterHotKey(0, id);
                }
            }
        });

        if let Ok(tid) = thread_id_rx.recv() {
            *self.listener_thread_id.lock().unwrap() = tid;
        }
    }

    fn sync_shortcuts(&self, shortcuts: Vec<ShortcutConfig>) {
        let tx_guard = self.tx.lock().unwrap();
        let thread_id = *self.listener_thread_id.lock().unwrap();

        if let Some(ref tx) = *tx_guard {
            let _ = tx.send(shortcuts);
            if thread_id != 0 {
                unsafe {
                    PostThreadMessageW(thread_id, WM_UPDATE_HOTKEYS, 0, 0);
                }
            }
        }
    }

    fn sync_all_key_shortcuts(&self, shortcuts: Vec<AllKeyShortcutConfig>) {
        let tx_guard = self.all_key_tx.lock().unwrap();
        let thread_id = *self.listener_thread_id.lock().unwrap();

        if let Some(ref tx) = *tx_guard {
            let _ = tx.send(shortcuts);
            if thread_id != 0 {
                unsafe {
                    PostThreadMessageW(thread_id, WM_UPDATE_ALL_KEYS, 0, 0);
                }
            }
        }
    }

    fn update_hotkey(&self, new_combo: &str) {
        let fallback_config = ShortcutConfig {
            id: "full-close".to_string(),
            name: "Close All Open Windows".to_string(),
            apps: vec!["all-apps".to_string()],
            keys: new_combo.split('+').map(|s| s.trim().to_string()).collect(),
            is_full_close: Some(true),
            execution_mode: Some("stealth".to_string()),
        };
        self.sync_shortcuts(vec![fallback_config]);
    }
}
