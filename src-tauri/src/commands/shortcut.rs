use std::sync::Arc;
use tauri::{AppHandle, State};
use crate::common::models::{ShortcutConfig, AllKeyShortcutConfig};
use crate::common::storage::ConfigStorage;
use crate::platform::current_platform::ShortcutManager;
use crate::platform::PlatformShortcutManager;

#[tauri::command]
pub fn get_saved_shortcuts(app: AppHandle) -> Result<Vec<ShortcutConfig>, String> {
    let config = ConfigStorage::load_config(&app)?;
    Ok(config.shortcuts)
}

#[tauri::command]
pub fn get_saved_all_key_shortcuts(app: AppHandle) -> Result<Vec<AllKeyShortcutConfig>, String> {
    let config = ConfigStorage::load_config(&app)?;
    Ok(config.all_key_shortcuts)
}

#[tauri::command]
pub fn get_saved_full_close_shortcut(app: AppHandle) -> Result<Option<Vec<String>>, String> {
    let config = ConfigStorage::load_config(&app)?;
    Ok(config.full_close_shortcut)
}

#[tauri::command]
pub fn sync_shortcuts(
    app: AppHandle,
    hotkey_mgr: State<'_, Arc<ShortcutManager>>,
    shortcuts: Vec<ShortcutConfig>,
) -> Result<bool, String> {
    hotkey_mgr.sync_shortcuts(shortcuts.clone());
    if let Ok(mut config) = ConfigStorage::load_config(&app) {
        config.shortcuts = shortcuts;
        let _ = ConfigStorage::save_config(&app, &config);
    }
    Ok(true)
}

#[tauri::command]
pub fn sync_all_key_shortcuts(
    app: AppHandle,
    hotkey_mgr: State<'_, Arc<ShortcutManager>>,
    shortcuts: Vec<AllKeyShortcutConfig>,
) -> Result<bool, String> {
    hotkey_mgr.sync_all_key_shortcuts(shortcuts.clone());
    if let Ok(mut config) = ConfigStorage::load_config(&app) {
        config.all_key_shortcuts = shortcuts;
        let _ = ConfigStorage::save_config(&app, &config);
    }
    Ok(true)
}

#[tauri::command]
pub fn set_workspace_hotkey(
    app: AppHandle,
    hotkey_mgr: State<'_, Arc<ShortcutManager>>,
    key_combo: String,
) -> Result<bool, String> {
    if let Ok(mut config) = ConfigStorage::load_config(&app) {
        let keys: Vec<String> = key_combo
            .split('+')
            .map(|s| s.trim().to_string())
            .filter(|s| !s.is_empty())
            .collect();
        config.full_close_shortcut = Some(keys.clone());

        let mut found = false;
        for s in config.shortcuts.iter_mut() {
            if s.is_full_close == Some(true) || s.id == "full-close" || s.id == "full-close-master" || s.apps.contains(&"all-apps".to_string()) {
                s.keys = keys.clone();
                found = true;
                break;
            }
        }
        if !found {
            config.shortcuts.insert(0, ShortcutConfig {
                id: "full-close-master".to_string(),
                name: "Close All Open Windows".to_string(),
                apps: vec!["all-apps".to_string()],
                keys,
                status: Some("Enabled".to_string()),
                last_used: Some("Just now".to_string()),
                is_full_close: Some(true),
                execution_mode: Some("stealth".to_string()),
            });
        }
        let _ = ConfigStorage::save_config(&app, &config);
        hotkey_mgr.sync_shortcuts(config.shortcuts);
    } else {
        hotkey_mgr.update_hotkey(&key_combo);
    }
    Ok(true)
}

