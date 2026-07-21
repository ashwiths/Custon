use std::sync::Arc;
use crate::common::models::{ShortcutConfig, RunningAppInfo, ToggleState, WorkspaceState};

// ─── Platform Traits ────────────────────────────────────────────────────────

pub trait PlatformWindowManager {
    fn get_running_applications() -> Vec<RunningAppInfo>;
    fn toggle(state: &WorkspaceState) -> (ToggleState, usize);
    fn toggle_target_apps(
        state: &WorkspaceState,
        shortcut_id: &str,
        target_apps: &[String],
        mode: &str,
    ) -> (ToggleState, usize);
    fn restore_all_hidden(state: &WorkspaceState) -> usize;
    fn close_target_apps(target_apps: &[String]) -> usize;
}

pub trait PlatformShortcutManager {
    fn new() -> Self;
    fn start_listener(
        &self,
        app_handle: tauri::AppHandle,
        workspace_state: Arc<WorkspaceState>,
        initial_shortcuts: Vec<ShortcutConfig>,
    );
    fn sync_shortcuts(&self, shortcuts: Vec<ShortcutConfig>);
    fn update_hotkey(&self, new_combo: &str);
}

pub trait PlatformSystemManager {
    fn new() -> Self;
    fn set_autostart(&self, enable: bool) -> Result<bool, String>;
    fn is_autostart_enabled(&self) -> bool;
}

// ─── Conditional Exports ───────────────────────────────────────────────────

#[cfg(target_os = "windows")]
pub mod windows;
#[cfg(target_os = "windows")]
pub use windows as current_platform;

#[cfg(target_os = "linux")]
pub mod linux;
#[cfg(target_os = "linux")]
pub use linux as current_platform;

#[cfg(target_os = "macos")]
pub mod macos;
#[cfg(target_os = "macos")]
pub use macos as current_platform;
