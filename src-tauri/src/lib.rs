pub mod autostart;
pub mod hotkey_manager;
pub mod window_manager;
pub mod workspace_state;

use std::sync::Arc;
use tauri::{AppHandle, Emitter, State};

use hotkey_manager::{HotkeyManager, ShortcutConfig};
use window_manager::WindowManager;
use workspace_state::{ToggleState, WorkspaceState};

#[tauri::command]
fn toggle_workspace(
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
fn toggle_target_shortcut(
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
fn sync_shortcuts(
    hotkey_mgr: State<'_, Arc<HotkeyManager>>,
    shortcuts: Vec<ShortcutConfig>,
) -> Result<bool, String> {
    hotkey_mgr.sync_shortcuts(shortcuts);
    Ok(true)
}

#[tauri::command]
fn set_workspace_hotkey(
    hotkey_mgr: State<'_, Arc<HotkeyManager>>,
    key_combo: String,
) -> Result<bool, String> {
    hotkey_mgr.update_hotkey(&key_combo);
    Ok(true)
}

#[tauri::command]
fn get_workspace_state(state: State<'_, Arc<WorkspaceState>>) -> Result<serde_json::Value, String> {
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
fn set_autostart(enable: bool) -> Result<bool, String> {
    autostart::set_autostart(enable)
}

#[tauri::command]
fn get_autostart_status() -> Result<bool, String> {
    Ok(autostart::is_autostart_enabled())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let workspace_state = Arc::new(WorkspaceState::new());
    let hotkey_mgr = Arc::new(HotkeyManager::new());

    let state_for_setup = workspace_state.clone();
    let hotkey_for_setup = hotkey_mgr.clone();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(workspace_state)
        .manage(hotkey_mgr)
        .setup(move |app| {
            hotkey_for_setup.start_listener(
                app.handle().clone(),
                state_for_setup,
                vec![ShortcutConfig {
                    id: "2".to_string(),
                    name: "Close All Open Windows".to_string(),
                    apps: vec!["all-apps".to_string()],
                    keys: vec!["Ctrl".to_string(), "Alt".to_string(), "X".to_string()],
                    is_full_close: Some(true),
                    execution_mode: Some("stealth".to_string()),
                }],
            );
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            toggle_workspace,
            toggle_target_shortcut,
            sync_shortcuts,
            set_workspace_hotkey,
            get_workspace_state,
            set_autostart,
            get_autostart_status
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

