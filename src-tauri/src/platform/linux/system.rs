use std::fs;
use std::path::PathBuf;
use crate::platform::PlatformSystemManager;

pub struct LinuxSystemManager;

impl LinuxSystemManager {
  fn get_autostart_desktop_path() -> Option<PathBuf> {
    if let Some(home) = std::env::var_os("HOME") {
      let mut path = PathBuf::from(home);
      path.push(".config");
      path.push("autostart");
      path.push("custon.desktop");
      Some(path)
    } else {
      None
    }
  }
}

impl PlatformSystemManager for LinuxSystemManager {
  fn new() -> Self {
    Self
  }

  fn set_autostart(&self, enable: bool) -> Result<bool, String> {
    let path = match Self::get_autostart_desktop_path() {
      Some(p) => p,
      None => return Err("Could not determine user HOME directory".to_string()),
    };

    if enable {
      if let Some(parent) = path.parent() {
        let _ = fs::create_dir_all(parent);
      }

      let exe_path = std::env::current_exe().map_err(|e| e.to_string())?;

      let desktop_content = format!(
        r#"[Desktop Entry]
Type=Application
Name=Custon
Comment=High-performance desktop shortcut engine
Exec={}
Icon=custon
Terminal=false
Categories=Utility;
X-GNOME-Autostart-enabled=true
"#,
        exe_path.to_string_lossy()
      );

      fs::write(&path, desktop_content).map_err(|e| e.to_string())?;
      Ok(true)
    } else {
      if path.exists() {
        fs::remove_file(&path).map_err(|e| e.to_string())?;
      }
      Ok(false)
    }
  }

  fn is_autostart_enabled(&self) -> bool {
    if let Some(path) = Self::get_autostart_desktop_path() {
      path.exists()
    } else {
      false
    }
  }
}
