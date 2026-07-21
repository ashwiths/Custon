use std::env;
use windows_sys::Win32::System::Registry::*;

const REG_KEY_PATH: &str = "Software\\Microsoft\\Windows\\CurrentVersion\\Run\0";
const APP_NAME: &str = "Custon\0";

pub fn set_autostart(enable: bool) -> Result<bool, String> {
    let mut hkey: HKEY = 0;

    let path_utf16: Vec<u16> = REG_KEY_PATH.encode_utf16().collect();
    let app_name_utf16: Vec<u16> = APP_NAME.encode_utf16().collect();

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
            let mut exe_str = exe_path.to_string_lossy().to_string();
            exe_str = format!("\"{}\"", exe_str);
            let mut exe_utf16: Vec<u16> = exe_str.encode_utf16().collect();
            exe_utf16.push(0);

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

pub fn is_autostart_enabled() -> bool {
    let mut hkey: HKEY = 0;
    let path_utf16: Vec<u16> = REG_KEY_PATH.encode_utf16().collect();
    let app_name_utf16: Vec<u16> = APP_NAME.encode_utf16().collect();

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
