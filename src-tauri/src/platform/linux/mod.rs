pub mod window_manager;
pub mod shortcut_manager;
pub mod system;

pub use window_manager::LinuxWindowManager as WindowManager;
pub use shortcut_manager::LinuxShortcutManager as ShortcutManager;
pub use system::LinuxSystemManager as SystemManager;
