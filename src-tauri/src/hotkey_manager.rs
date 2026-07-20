use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::thread;
use tauri::{AppHandle, Emitter};
use windows_sys::Win32::UI::Input::KeyboardAndMouse::*;
use windows_sys::Win32::UI::WindowsAndMessaging::*;

use crate::window_manager::WindowManager;
use crate::workspace_state::{ToggleState, WorkspaceState};

const HOTKEY_ID: i32 = 0x9001;

pub struct HotkeyManager {
    current_combo: Mutex<String>,
    is_running: AtomicBool,
}

impl HotkeyManager {
    pub fn new() -> Self {
        Self {
            current_combo: Mutex::new("Ctrl + Alt + X".to_string()),
            is_running: AtomicBool::new(false),
        }
    }

    pub fn parse_key_combo(combo_str: &str) -> (u32, u32) {
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

    pub fn start_listener(
        &self,
        app_handle: AppHandle,
        workspace_state: Arc<WorkspaceState>,
        initial_combo: &str,
    ) {
        if self.is_running.swap(true, Ordering::SeqCst) {
            return;
        }

        *self.current_combo.lock().unwrap() = initial_combo.to_string();
        let combo_str = initial_combo.to_string();

        thread::spawn(move || {
            let (modifiers, vk_code) = Self::parse_key_combo(&combo_str);

            unsafe {
                RegisterHotKey(0, HOTKEY_ID, modifiers, vk_code);
            }

            let mut msg: MSG = unsafe { std::mem::zeroed() };
            loop {
                let res = unsafe { GetMessageW(&mut msg, 0, 0, 0) };
                if res <= 0 {
                    break;
                }

                if msg.message == WM_HOTKEY && msg.wParam == HOTKEY_ID as usize {
                    let (new_state, count) = WindowManager::toggle(&workspace_state);

                    let state_str = match new_state {
                        ToggleState::Visible => "visible",
                        ToggleState::Hidden => "hidden",
                    };

                    let _ = app_handle.emit(
                        "workspace-toggle-event",
                        serde_json::json!({
                            "state": state_str,
                            "count": count
                        }),
                    );
                }

                unsafe {
                    TranslateMessage(&msg);
                    DispatchMessageW(&msg);
                }
            }

            unsafe {
                UnregisterHotKey(0, HOTKEY_ID);
            }
        });
    }

    pub fn update_hotkey(&self, new_combo: &str) {
        *self.current_combo.lock().unwrap() = new_combo.to_string();
        let (modifiers, vk_code) = Self::parse_key_combo(new_combo);

        unsafe {
            UnregisterHotKey(0, HOTKEY_ID);
            RegisterHotKey(0, HOTKEY_ID, modifiers, vk_code);
        }
    }
}
