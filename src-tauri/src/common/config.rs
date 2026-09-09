use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    #[serde(default = "default_theme")]
    pub theme: String,
    #[serde(default = "default_language")]
    pub language: String,
    #[serde(default)]
    pub shortcuts: Vec<crate::common::models::ShortcutConfig>,
    #[serde(default)]
    pub all_key_shortcuts: Vec<crate::common::models::AllKeyShortcutConfig>,
    #[serde(default)]
    pub full_close_shortcut: Option<Vec<String>>,
    #[serde(default)]
    pub recent_apps: Vec<String>,
    #[serde(default)]
    pub window_layout: WindowLayoutConfig,
    #[serde(default)]
    pub startup: StartupConfig,
    #[serde(default)]
    pub os_preferences: HashMap<String, String>,
}

fn default_theme() -> String {
    "dark".to_string()
}

fn default_language() -> String {
    "en".to_string()
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WindowLayoutConfig {
    pub width: u32,
    pub height: u32,
    pub maximized: bool,
}

impl Default for WindowLayoutConfig {
    fn default() -> Self {
        Self {
            width: 1024,
            height: 768,
            maximized: false,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StartupConfig {
    pub run_on_boot: bool,
    pub start_minimized: bool,
}

impl Default for StartupConfig {
    fn default() -> Self {
        Self {
            run_on_boot: false,
            start_minimized: false,
        }
    }
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            theme: default_theme(),
            language: default_language(),
            shortcuts: vec![
                crate::common::models::ShortcutConfig {
                    id: "1".to_string(),
                    name: "Chrome • VS Code • Discord".to_string(),
                    apps: vec!["chrome".to_string(), "vscode".to_string(), "discord".to_string()],
                    keys: vec!["Ctrl".to_string(), "Shift".to_string(), "Q".to_string()],
                    status: Some("Enabled".to_string()),
                    last_used: Some("Default".to_string()),
                    is_full_close: Some(false),
                    execution_mode: Some("stealth".to_string()),
                },
                crate::common::models::ShortcutConfig {
                    id: "2".to_string(),
                    name: "Close All Open Windows".to_string(),
                    apps: vec!["all-apps".to_string()],
                    keys: vec!["Ctrl".to_string(), "Alt".to_string(), "X".to_string()],
                    status: Some("Enabled".to_string()),
                    last_used: Some("Default".to_string()),
                    is_full_close: Some(true),
                    execution_mode: Some("stealth".to_string()),
                },
            ],
            all_key_shortcuts: Vec::new(),
            full_close_shortcut: Some(vec!["Ctrl".to_string(), "Alt".to_string(), "X".to_string()]),
            recent_apps: Vec::new(),
            window_layout: WindowLayoutConfig::default(),
            startup: StartupConfig::default(),
            os_preferences: HashMap::new(),
        }
    }
}
