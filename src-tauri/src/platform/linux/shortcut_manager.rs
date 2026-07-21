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
        // TODO: Implement global key grabbing loop (e.g. XGrabKey on X11 or global shortcuts portal on Wayland).
    }

    fn sync_shortcuts(&self, _shortcuts: Vec<ShortcutConfig>) {
        // TODO: Dynamically update grabbed key combinations.
    }

    fn update_hotkey(&self, _new_combo: &str) {
        // TODO: Update overlay summon hotkey.
    }
}
