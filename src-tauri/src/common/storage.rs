use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};
use crate::common::config::AppConfig;

pub struct ConfigStorage;

impl ConfigStorage {
    fn get_config_path(app_handle: &AppHandle) -> Result<PathBuf, String> {
        let mut path = app_handle.path().app_data_dir().map_err(|e| e.to_string())?;
        if !path.exists() {
            let _ = fs::create_dir_all(&path);
        }
        path.push("config.json");
        Ok(path)
    }

    pub fn load_config(app_handle: &AppHandle) -> Result<AppConfig, String> {
        let path = Self::get_config_path(app_handle)?;
        if !path.exists() {
            return Ok(AppConfig::default());
        }
        let content = fs::read_to_string(path).map_err(|e| e.to_string())?;
        let config: AppConfig = serde_json::from_str(&content).map_err(|e| e.to_string())?;
        Ok(config)
    }

    pub fn save_config(app_handle: &AppHandle, config: &AppConfig) -> Result<(), String> {
        let path = Self::get_config_path(app_handle)?;
        let content = serde_json::to_string_pretty(config).map_err(|e| e.to_string())?;
        fs::write(path, content).map_err(|e| e.to_string())?;
        Ok(())
    }
}
