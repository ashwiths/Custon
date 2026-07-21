use std::collections::HashMap;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{mpsc, Arc, Mutex};
use std::thread;
use tauri::{AppHandle, Emitter};
use windows_sys::Win32::System::Threading::GetCurrentThreadId;
use windows_sys::Win32::UI::Input::KeyboardAndMouse::*;
use windows_sys::Win32::UI::WindowsAndMessaging::*;

use crate::common::models::{ShortcutConfig, ToggleState, WorkspaceState};
use crate::platform::windows::window_manager::WindowsWindowManager as WindowManager;
use crate::platform::{PlatformShortcutManager, PlatformWindowManager};

const BASE_HOTKEY_ID: i32 = 0x9000;
const WM_UPDATE_HOTKEYS: u32 = WM_USER + 0x101;

pub struct WindowsShortcutManager {
    is_running: AtomicBool,
    tx: Mutex<Option<mpsc::Sender<Vec<ShortcutConfig>>>>,
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
                        "pageup" => VK_PRIOR as u32,
                        "pagedown" => VK_NEXT as u32,
                        "up" => VK_UP as u32,
                        "down" => VK_DOWN as u32,
                        "left" => VK_LEFT as u32,
                        "right" => VK_RIGHT as u32,
                        f if f.starts_with('f') && f.len() > 1 => {
                            if let Ok(num) = f[1..].parse::<u32>() {
                                VK_F1 as u32 + num - 1
                            } else {
                                0
                            }
                        }
                        single if single.len() == 1 => {
                            let ch = single.chars().next().unwrap().to_ascii_uppercase();
                            ch as u32
                        }
                        _ => 0,
                    };
                }
            }
        }

        (modifiers, vk_code)
    }
}

impl PlatformShortcutManager for WindowsShortcutManager {
    fn new() -> Self {
        Self {
            is_running: AtomicBool::new(false),
            tx: Mutex::new(None),
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

        let (thread_id_tx, thread_id_rx) = mpsc::channel::<u32>();

        thread::spawn(move || {
            let thread_id = unsafe { GetCurrentThreadId() };
            let _ = thread_id_tx.send(thread_id);

            let mut registered_map: HashMap<i32, ShortcutConfig> = HashMap::new();

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
                    if let Some(config) = registered_map.get(&hotkey_id).cloned() {
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
                    if let Ok(new_configs) = rx.try_recv() {
                        register_configs(&new_configs, &mut registered_map);
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
