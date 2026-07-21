pub mod common;
pub mod platform;
pub mod commands;

use std::sync::Arc;
use crate::common::models::{ShortcutConfig, WorkspaceState};
use crate::platform::current_platform::{ShortcutManager, SystemManager};
use crate::platform::{PlatformShortcutManager, PlatformSystemManager};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let workspace_state = Arc::new(WorkspaceState::new());
    let hotkey_mgr = Arc::new(ShortcutManager::new());
    let system_mgr = SystemManager::new();

    let state_for_setup = workspace_state.clone();
    let hotkey_for_setup = hotkey_mgr.clone();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(workspace_state)
        .manage(hotkey_mgr)
        .manage(system_mgr)
        .setup(move |app| {
            // Build the system tray icon programmatically (cross-platform helper)
            let default_icon = app.default_window_icon().cloned();
            let tray_app_handle = app.handle().clone();
            
            if let Some(icon) = default_icon {
                let _tray = tauri::tray::TrayIconBuilder::new()
                    .icon(icon)
                    .on_tray_icon_event(move |_, event| {
                        if let tauri::tray::TrayIconEvent::Click { .. } = event {
                            use tauri::Manager;
                            if let Some(window) = tray_app_handle.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                    })
                    .build(app)?;
            }

            // Start the global hotkeys listener loop
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
            commands::system::toggle_workspace,
            commands::system::toggle_target_shortcut,
            commands::shortcut::sync_shortcuts,
            commands::shortcut::set_workspace_hotkey,
            commands::system::get_workspace_state,
            commands::system::get_running_apps,
            commands::settings::set_autostart,
            commands::settings::get_autostart_status,
            commands::system::restore_all_hidden
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
