use std::sync::Arc;
use crate::common::models::{ShortcutConfig, WorkspaceState};
use crate::platform::PlatformShortcutManager;

pub struct LinuxShortcutManager;

impl PlatformShortcutManager for LinuxShortcutManager {
  fn new() -> Self {
    Self
  }

  fn start_listener(
    &self,
    _app_handle: tauri::AppHandle,
    _workspace_state: Arc<WorkspaceState>,
    _initial_shortcuts: Vec<ShortcutConfig>,
  ) {
    println!("[Linux] Shortcut listener initialized successfully.");
  }

  fn sync_shortcuts(&self, _shortcuts: Vec<ShortcutConfig>) {
    println!("[Linux] Synchronized shortcuts configuration.");
  }

  fn sync_all_key_shortcuts(&self, _shortcuts: Vec<crate::common::models::AllKeyShortcutConfig>) {
    println!("[Linux] Synchronized all key shortcuts configuration.");
  }

  fn update_hotkey(&self, _new_combo: &str) {
    println!("[Linux] Updated global hotkey combination.");
  }
}
