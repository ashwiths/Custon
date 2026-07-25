use std::fs;
use std::path::PathBuf;
use crate::platform::PlatformSystemManager;

pub struct MacosSystemManager;

impl MacosSystemManager {
  fn get_launch_agent_path() -> Option<PathBuf> {
    if let Some(home) = std::env::var_os("HOME") {
      let mut path = PathBuf::from(home);
      path.push("Library");
      path.push("LaunchAgents");
      path.push("com.infan.custon.plist");
      Some(path)
    } else {
      None
    }
  }
}

impl PlatformSystemManager for MacosSystemManager {
  fn new() -> Self {
    Self
  }

  fn set_autostart(&self, enable: bool) -> Result<bool, String> {
    let path = match Self::get_launch_agent_path() {
      Some(p) => p,
      None => return Err("Could not determine user HOME directory".to_string()),
    };

    if enable {
      if let Some(parent) = path.parent() {
        let _ = fs::create_dir_all(parent);
      }

      let exe_path = std::env::current_exe().map_err(|e| e.to_string())?;

      let plist_content = format!(
        r#"<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.infan.custon</string>
    <key>ProgramArguments</key>
    <array>
        <string>{}</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>"#,
        exe_path.to_string_lossy()
      );

      fs::write(&path, plist_content).map_err(|e| e.to_string())?;
      Ok(true)
    } else {
      if path.exists() {
        fs::remove_file(&path).map_err(|e| e.to_string())?;
      }
      Ok(false)
    }
  }

  fn is_autostart_enabled(&self) -> bool {
    if let Some(path) = Self::get_launch_agent_path() {
      path.exists()
    } else {
      false
    }
  }
}
