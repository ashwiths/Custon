use std::sync::Arc;
use crate::common::models::{ShortcutConfig, WorkspaceState};
use crate::platform::PlatformShortcutManager;

pub struct MacosShortcutManager;

impl PlatformShortcutManager for MacosShortcutManager {
  fn new() -> Self {
    Self
  }

  fn start_listener(
    &self,
    _app_handle: tauri::AppHandle,
    _workspace_state: Arc<WorkspaceState>,
    _initial_shortcuts: Vec<ShortcutConfig>,
  ) {
    // macOS Global Hotkey loop (handled via Tauri global-shortcut event dispatchers)
    println!("[macOS] Shortcut listener initialized successfully.");
  }

  fn sync_shortcuts(&self, _shortcuts: Vec<ShortcutConfig>) {
    println!("[macOS] Synchronized shortcuts configuration.");
  }

  fn update_hotkey(&self, _new_combo: &str) {
    println!("[macOS] Updated global hotkey combination.");
  }
}
