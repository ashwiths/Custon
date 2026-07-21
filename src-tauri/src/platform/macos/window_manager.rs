use crate::common::models::{RunningAppInfo, ToggleState, WorkspaceState};
use crate::platform::PlatformWindowManager;

pub struct MacosWindowManager;

impl PlatformWindowManager for MacosWindowManager {
    fn get_running_applications() -> Vec<RunningAppInfo> {
        // TODO: Implement macOS running app list querying NSWorkspace / NSRunningApplication.
        Vec::new()
    }

    fn toggle(_state: &WorkspaceState) -> (ToggleState, usize) {
        // TODO: Implement toggle logic using macOS accessibility APIs (AXUIElement / CGWindowList).
        (ToggleState::Visible, 0)
    }

    fn toggle_target_apps(
        _state: &WorkspaceState,
        _shortcut_id: &str,
        _target_apps: &[String],
        _mode: &str,
    ) -> (ToggleState, usize) {
        // TODO: Implement hiding applications by NSRunningApplication hide or accessibility attributes.
        (ToggleState::Visible, 0)
    }

    fn restore_all_hidden(_state: &WorkspaceState) -> usize {
        // TODO: Implement safety NSRunningApplication unhide loop for hidden windows on crash/exit.
        0
    }

    fn close_target_apps(_target_apps: &[String]) -> usize {
        // TODO: Implement sending NSRunningApplication terminate signals or AppleScript quit commands.
        0
    }
}
