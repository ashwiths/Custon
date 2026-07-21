use tauri::State;
use crate::platform::current_platform::SystemManager;
use crate::platform::PlatformSystemManager;

#[tauri::command]
pub fn set_autostart(
    system_mgr: State<'_, SystemManager>,
    enable: bool,
) -> Result<bool, String> {
    system_mgr.set_autostart(enable)
}

#[tauri::command]
pub fn get_autostart_status(
    system_mgr: State<'_, SystemManager>,
) -> Result<bool, String> {
    Ok(system_mgr.is_autostart_enabled())
}
