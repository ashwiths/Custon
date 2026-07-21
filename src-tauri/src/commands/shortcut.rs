use std::sync::Arc;
use tauri::State;
use crate::common::models::ShortcutConfig;
use crate::platform::current_platform::ShortcutManager;
use crate::platform::PlatformShortcutManager;

#[tauri::command]
pub fn sync_shortcuts(
    hotkey_mgr: State<'_, Arc<ShortcutManager>>,
    shortcuts: Vec<ShortcutConfig>,
) -> Result<bool, String> {
    hotkey_mgr.sync_shortcuts(shortcuts);
    Ok(true)
}

#[tauri::command]
pub fn set_workspace_hotkey(
    hotkey_mgr: State<'_, Arc<ShortcutManager>>,
    key_combo: String,
) -> Result<bool, String> {
    hotkey_mgr.update_hotkey(&key_combo);
    Ok(true)
}
