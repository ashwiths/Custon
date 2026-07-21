use crate::platform::PlatformSystemManager;

pub struct MacosSystemManager;

impl PlatformSystemManager for MacosSystemManager {
    fn new() -> Self {
        Self
    }

    fn set_autostart(&self, _enable: bool) -> Result<bool, String> {
        // TODO: Generate or delete ~/Library/LaunchAgents/com.infan.custon.plist to run on user login.
        Ok(false)
    }

    fn is_autostart_enabled(&self) -> bool {
        // TODO: Check if ~/Library/LaunchAgents/com.infan.custon.plist exists and is loaded.
        false
    }
}
