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

    fn get_backup_path(app_handle: &AppHandle) -> Result<PathBuf, String> {
        let mut path = app_handle.path().app_data_dir().map_err(|e| e.to_string())?;
        path.push("config.json.bak");
        Ok(path)
    }

    pub fn load_config(app_handle: &AppHandle) -> Result<AppConfig, String> {
        let path = Self::get_config_path(app_handle)?;
        
        if path.exists() {
            if let Ok(content) = fs::read_to_string(&path) {
                if let Ok(config) = serde_json::from_str::<AppConfig>(&content) {
                    return Ok(config);
                }
            }
            eprintln!("[Config] Warning: Primary config file corrupted. Attempting backup recovery.");
        }

        // Attempt recovery from backup if primary config fails or is corrupted
        if let Ok(backup_path) = Self::get_backup_path(app_handle) {
            if backup_path.exists() {
                if let Ok(backup_content) = fs::read_to_string(&backup_path) {
                    if let Ok(backup_config) = serde_json::from_str::<AppConfig>(&backup_content) {
                        println!("[Config] Successfully restored configuration from backup file.");
                        return Ok(backup_config);
                    }
                }
            }
        }

        Ok(AppConfig::default())
    }

    pub fn save_config(app_handle: &AppHandle, config: &AppConfig) -> Result<(), String> {
        let path = Self::get_config_path(app_handle)?;
        let backup_path = Self::get_backup_path(app_handle)?;
        let content = serde_json::to_string_pretty(config).map_err(|e| e.to_string())?;

        // Create atomic backup copy before overwriting configuration
        if path.exists() {
            let _ = fs::copy(&path, &backup_path);
        }

        fs::write(path, content).map_err(|e| e.to_string())?;
        Ok(())
    }
}
