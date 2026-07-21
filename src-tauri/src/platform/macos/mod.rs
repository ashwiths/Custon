pub mod window_manager;
pub mod shortcut_manager;
pub mod system;

pub use window_manager::MacosWindowManager as WindowManager;
pub use shortcut_manager::MacosShortcutManager as ShortcutManager;
pub use system::MacosSystemManager as SystemManager;
