use crate::platform::PlatformSystemManager;

pub struct LinuxSystemManager;

impl PlatformSystemManager for LinuxSystemManager {
    fn new() -> Self {
        Self
    }

    fn set_autostart(&self, _enable: bool) -> Result<bool, String> {
        // TODO: Write a .desktop entry in ~/.config/autostart/custon.desktop to launch app on desktop startup.
        Ok(false)
    }

    fn is_autostart_enabled(&self) -> bool {
        // TODO: Check if ~/.config/autostart/custon.desktop exists.
        false
    }
}
