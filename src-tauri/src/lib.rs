pub mod hotkey_manager;
pub mod window_manager;
pub mod workspace_state;

use std::sync::Arc;
use tauri::{AppHandle, Emitter, State};

use hotkey_manager::HotkeyManager;
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
                "Ctrl + Alt + X",
            );
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            toggle_workspace,
            set_workspace_hotkey,
            get_workspace_state
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
