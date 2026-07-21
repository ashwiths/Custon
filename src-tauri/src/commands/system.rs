use std::sync::Arc;
use tauri::{AppHandle, Emitter, State};
use crate::common::models::{RunningAppInfo, WorkspaceState, ToggleState};
use crate::platform::current_platform::WindowManager;
use crate::platform::PlatformWindowManager;

#[tauri::command]
pub fn toggle_workspace(
    state: State<'_, Arc<WorkspaceState>>,
    app_handle: AppHandle,
) -> Result<serde_json::Value, String> {
    let (new_state, count) = WindowManager::toggle(&state);

    let state_str = match new_state {
        ToggleState::Visible => "visible",
        ToggleState::Hidden => "hidden",
    };

    let payload = serde_json::json!({
        "state": state_str,
        "count": count
    });

    let _ = app_handle.emit("workspace-toggle-event", payload.clone());

    Ok(payload)
}

#[tauri::command]
pub fn toggle_target_shortcut(
    state: State<'_, Arc<WorkspaceState>>,
    app_handle: AppHandle,
    shortcut_id: String,
    target_apps: Vec<String>,
    mode: Option<String>,
) -> Result<serde_json::Value, String> {
    let mode_str = mode.unwrap_or_else(|| "stealth".to_string());
    let (new_state, count) = WindowManager::toggle_target_apps(
        &state,
        &shortcut_id,
        &target_apps,
        &mode_str,
    );

    let state_str = match new_state {
        ToggleState::Visible => "visible",
        ToggleState::Hidden => "hidden",
    };

    let payload = serde_json::json!({
        "id": shortcut_id,
        "state": state_str,
        "count": count,
        "apps": target_apps,
        "mode": mode_str
    });

    let _ = app_handle.emit("shortcut-trigger-event", payload.clone());
    let _ = app_handle.emit("workspace-toggle-event", payload.clone());

    Ok(payload)
}

#[tauri::command]
pub fn get_workspace_state(
    state: State<'_, Arc<WorkspaceState>>,
) -> Result<serde_json::Value, String> {
    let current_state = *state.toggle_state.lock().unwrap();
    let saved_count = state.saved_windows.lock().unwrap().len();

    let state_str = match current_state {
        ToggleState::Visible => "visible",
        ToggleState::Hidden => "hidden",
    };

    Ok(serde_json::json!({
        "state": state_str,
        "count": saved_count
    }))
}

#[tauri::command]
pub fn get_running_apps() -> Result<Vec<RunningAppInfo>, String> {
    Ok(WindowManager::get_running_applications())
}

#[tauri::command]
pub fn restore_all_hidden(
    state: State<'_, Arc<WorkspaceState>>,
    app_handle: AppHandle,
) -> Result<usize, String> {
    let count = WindowManager::restore_all_hidden(&state);
    
    let _ = app_handle.emit("workspace-toggle-event", serde_json::json!({
        "state": "visible",
        "count": 0
    }));

    Ok(count)
}
