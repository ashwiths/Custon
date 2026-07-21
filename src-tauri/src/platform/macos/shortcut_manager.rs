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
        // TODO: Implement macOS Carbon HotKey API global shortcuts registration and run loop.
    }

    fn sync_shortcuts(&self, _shortcuts: Vec<ShortcutConfig>) {
        // TODO: Dynamically update registered carbon hotkeys.
    }

    fn update_hotkey(&self, _new_combo: &str) {
        // TODO: Update overlay summon hotkey.
    }
}
