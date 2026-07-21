use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{mpsc, Arc, Mutex};
use std::thread;
use tauri::{AppHandle, Emitter};
use windows_sys::Win32::System::Threading::GetCurrentThreadId;
use windows_sys::Win32::UI::Input::KeyboardAndMouse::*;
use windows_sys::Win32::UI::WindowsAndMessaging::*;

use crate::window_manager::WindowManager;
use crate::workspace_state::{ToggleState, WorkspaceState};

const HOTKEY_ID: i32 = 0x9001;
const WM_UPDATE_HOTKEY: u32 = WM_USER + 0x101;

pub struct HotkeyManager {
    current_combo: Mutex<String>,
    is_running: AtomicBool,
    tx: Mutex<Option<mpsc::Sender<String>>>,
    listener_thread_id: Mutex<u32>,
}

impl HotkeyManager {
    pub fn new() -> Self {
        Self {
            current_combo: Mutex::new("Ctrl + Alt + X".to_string()),
            is_running: AtomicBool::new(false),
            tx: Mutex::new(None),
            listener_thread_id: Mutex::new(0),
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

        let (tx, rx) = mpsc::channel::<String>();
        *self.tx.lock().unwrap() = Some(tx);

        let (thread_id_tx, thread_id_rx) = mpsc::channel::<u32>();

        thread::spawn(move || {
            let thread_id = unsafe { GetCurrentThreadId() };
            let _ = thread_id_tx.send(thread_id);

            let mut current_registered_combo = combo_str.clone();
            let (mut modifiers, mut vk_code) = Self::parse_key_combo(&current_registered_combo);

            if vk_code != 0 {
                unsafe {
                    RegisterHotKey(0, HOTKEY_ID, modifiers, vk_code);
                }
            }

            let mut msg: MSG = unsafe { std::mem::zeroed() };
            unsafe {
                PeekMessageW(&mut msg, 0, 0, 0, PM_NOREMOVE);
            }

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
                } else if msg.message == WM_UPDATE_HOTKEY {
                    if let Ok(new_combo) = rx.try_recv() {
                        unsafe {
                            UnregisterHotKey(0, HOTKEY_ID);
                        }
                        current_registered_combo = new_combo;
                        let (new_mods, new_vk) = Self::parse_key_combo(&current_registered_combo);
                        modifiers = new_mods;
                        vk_code = new_vk;
                        if vk_code != 0 {
                            unsafe {
                                RegisterHotKey(0, HOTKEY_ID, modifiers, vk_code);
                            }
                        }
                    }
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

        if let Ok(tid) = thread_id_rx.recv() {
            *self.listener_thread_id.lock().unwrap() = tid;
        }
    }

    pub fn update_hotkey(&self, new_combo: &str) {
        *self.current_combo.lock().unwrap() = new_combo.to_string();

        let tx_guard = self.tx.lock().unwrap();
        let thread_id = *self.listener_thread_id.lock().unwrap();

        if let Some(ref tx) = *tx_guard {
            let _ = tx.send(new_combo.to_string());
            if thread_id != 0 {
                unsafe {
                    PostThreadMessageW(thread_id, WM_UPDATE_HOTKEY, 0, 0);
                }
            }
        }
    }
}
