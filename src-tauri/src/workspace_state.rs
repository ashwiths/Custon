use serde::{Deserialize, Serialize};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Mutex;
use windows_sys::Win32::Foundation::{HWND, RECT};
use windows_sys::Win32::UI::WindowsAndMessaging::WINDOWPLACEMENT;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ToggleState {
    Visible,
    Hidden,
}

#[derive(Clone)]
pub struct WindowSnapshot {
    pub hwnd: HWND,
    pub process_id: u32,
    pub title: String,
    pub placement: WINDOWPLACEMENT,
    pub rect: RECT,
    pub z_order_index: usize,
    pub monitor: isize,
    pub show_cmd: u32,
    pub was_minimized: bool,
    pub was_maximized: bool,
}

pub struct WorkspaceState {
    pub toggle_state: Mutex<ToggleState>,
    pub saved_windows: Mutex<Vec<WindowSnapshot>>,
    pub is_processing: AtomicBool,
}

impl WorkspaceState {
    pub fn new() -> Self {
        Self {
            toggle_state: Mutex::new(ToggleState::Visible),
            saved_windows: Mutex::new(Vec::new()),
            is_processing: AtomicBool::new(false),
        }
    }

    pub fn acquire_lock(&self) -> bool {
        !self.is_processing.swap(true, Ordering::SeqCst)
    }

    pub fn release_lock(&self) {
        self.is_processing.store(false, Ordering::SeqCst);
    }

    pub fn clear(&self) {
        if let Ok(mut windows) = self.saved_windows.lock() {
            windows.clear();
        }
    }
}
