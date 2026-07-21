use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    pub theme: String,
    pub language: String,
    pub shortcuts: Vec<crate::common::models::ShortcutConfig>,
    pub recent_apps: Vec<String>,
    pub window_layout: WindowLayoutConfig,
    pub startup: StartupConfig,
    pub os_preferences: HashMap<String, String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WindowLayoutConfig {
    pub width: u32,
    pub height: u32,
    pub maximized: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StartupConfig {
    pub run_on_boot: bool,
    pub start_minimized: bool,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            theme: "dark".to_string(),
            language: "en".to_string(),
            shortcuts: Vec::new(),
            recent_apps: Vec::new(),
            window_layout: WindowLayoutConfig {
                width: 1024,
                height: 768,
                maximized: false,
            },
            startup: StartupConfig {
                run_on_boot: false,
                start_minimized: false,
            },
            os_preferences: HashMap::new(),
        }
    }
}
