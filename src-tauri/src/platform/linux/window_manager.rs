use crate::common::models::{RunningAppInfo, ToggleState, WorkspaceState};
use crate::platform::PlatformWindowManager;

pub struct LinuxWindowManager;

impl PlatformWindowManager for LinuxWindowManager {
    fn get_running_applications() -> Vec<RunningAppInfo> {
        // TODO: Implement X11 / Wayland active window enumeration using xcb, x11-dl or similar bindings.
        Vec::new()
    }

    fn toggle(_state: &WorkspaceState) -> (ToggleState, usize) {
        // TODO: Implement workspace unmap/map logic on Linux.
        (ToggleState::Visible, 0)
    }

    fn toggle_target_apps(
        _state: &WorkspaceState,
        _shortcut_id: &str,
        _target_apps: &[String],
        _mode: &str,
    ) -> (ToggleState, usize) {
        // TODO: Implement targeted application window hiding/restoring.
        (ToggleState::Visible, 0)
    }

    fn restore_all_hidden(_state: &WorkspaceState) -> usize {
        // TODO: Implement safety window unmap restoration of any hidden applications on crash/exit.
        0
    }

    fn close_target_apps(_target_apps: &[String]) -> usize {
        // TODO: Implement sending close client messages to corresponding window IDs.
        0
    }
}
