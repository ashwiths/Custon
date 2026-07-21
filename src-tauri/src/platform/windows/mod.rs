pub mod window_manager;
pub mod shortcut_manager;
pub mod system;

pub use window_manager::WindowsWindowManager as WindowManager;
pub use shortcut_manager::WindowsShortcutManager as ShortcutManager;
pub use system::WindowsSystemManager as SystemManager;
