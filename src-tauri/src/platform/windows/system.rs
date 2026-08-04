use std::env;
use windows_sys::Win32::System::Registry::*;
use crate::platform::PlatformSystemManager;

const REG_KEY_PATH: &str = "Software\\Microsoft\\Windows\\CurrentVersion\\Run";
const APP_NAME: &str = "Custon";

fn to_pcwstr(s: &str) -> Vec<u16> {
    s.encode_utf16().chain(std::iter::once(0)).collect()
}

pub struct WindowsSystemManager;

impl PlatformSystemManager for WindowsSystemManager {
    fn new() -> Self {
        Self
    }

    fn set_autostart(&self, enable: bool) -> Result<bool, String> {
        let mut hkey: HKEY = 0;

        let path_utf16 = to_pcwstr(REG_KEY_PATH);
        let app_name_utf16 = to_pcwstr(APP_NAME);

        unsafe {
            let status = RegOpenKeyExW(
                HKEY_CURRENT_USER,
                path_utf16.as_ptr(),
                0,
                KEY_SET_VALUE | KEY_QUERY_VALUE,
                &mut hkey,
            );

            if status != 0 {
                return Err("Failed to open registry key".to_string());
            }

            if enable {
                let exe_path = env::current_exe().map_err(|e| e.to_string())?;
                let exe_str = format!("\"{}\"", exe_path.to_string_lossy());
                let exe_utf16 = to_pcwstr(&exe_str);

                let set_status = RegSetValueExW(
                    hkey,
                    app_name_utf16.as_ptr(),
                    0,
                    REG_SZ,
                    exe_utf16.as_ptr() as *const u8,
                    (exe_utf16.len() * 2) as u32,
                );

                RegCloseKey(hkey);

                if set_status == 0 {
                    Ok(true)
                } else {
                    Err("Failed to set registry value".to_string())
                }
            } else {
                let del_status = RegDeleteValueW(hkey, app_name_utf16.as_ptr());
                RegCloseKey(hkey);
                if del_status == 0 || del_status == 2 {
                    Ok(false)
                } else {
                    Err("Failed to delete registry value".to_string())
                }
            }
        }
    }

    fn is_autostart_enabled(&self) -> bool {
        let mut hkey: HKEY = 0;
        let path_utf16 = to_pcwstr(REG_KEY_PATH);
        let app_name_utf16 = to_pcwstr(APP_NAME);

        unsafe {
            let status = RegOpenKeyExW(
                HKEY_CURRENT_USER,
                path_utf16.as_ptr(),
                0,
                KEY_QUERY_VALUE,
                &mut hkey,
            );

            if status != 0 {
                return false;
            }

            let query_status = RegQueryValueExW(
                hkey,
                app_name_utf16.as_ptr(),
                std::ptr::null_mut(),
                std::ptr::null_mut(),
                std::ptr::null_mut(),
                std::ptr::null_mut(),
            );

            RegCloseKey(hkey);
            query_status == 0
        }
    }
}
