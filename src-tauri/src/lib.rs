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

            // Load saved configuration directly from persistent disk storage
            let config = match crate::common::storage::ConfigStorage::load_config(&app.handle()) {
                Ok(cfg) => cfg,
                Err(e) => {
                    eprintln!("[Startup] Error loading config: {}, using defaults", e);
                    crate::common::config::AppConfig::default()
                }
            };

            // Ensure the config file exists on disk
            let _ = crate::common::storage::ConfigStorage::save_config(&app.handle(), &config);

            let initial_shortcuts = if !config.shortcuts.is_empty() {
                config.shortcuts.clone()
            } else {
                vec![ShortcutConfig {
                    id: "2".to_string(),
                    name: "Close All Open Windows".to_string(),
                    apps: vec!["all-apps".to_string()],
                    keys: vec!["Ctrl".to_string(), "Alt".to_string(), "X".to_string()],
                    status: Some("Enabled".to_string()),
                    last_used: Some("Default".to_string()),
                    is_full_close: Some(true),
                    execution_mode: Some("stealth".to_string()),
                }]
            };

            // Start the global hotkeys listener loop with loaded shortcuts
            hotkey_for_setup.start_listener(
                app.handle().clone(),
                state_for_setup,
                initial_shortcuts,
            );

            // Register all saved general key shortcuts
            if !config.all_key_shortcuts.is_empty() {
                hotkey_for_setup.sync_all_key_shortcuts(config.all_key_shortcuts);
            }

            // Set custom workspace hotkey if saved
            if let Some(keys) = config.full_close_shortcut {
                if !keys.is_empty() {
                    hotkey_for_setup.update_hotkey(&keys.join(" + "));
                }
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::system::toggle_workspace,
            commands::system::toggle_target_shortcut,
            commands::shortcut::get_saved_shortcuts,
            commands::shortcut::get_saved_all_key_shortcuts,
            commands::shortcut::get_saved_full_close_shortcut,
            commands::shortcut::sync_shortcuts,
            commands::shortcut::sync_all_key_shortcuts,
            commands::shortcut::set_workspace_hotkey,
            commands::system::get_workspace_state,
            commands::system::get_running_apps,
            commands::settings::set_autostart,
            commands::settings::get_autostart_status,
            commands::system::restore_all_hidden,
            commands::system::send_exam_complaint
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
