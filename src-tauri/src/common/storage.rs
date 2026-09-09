use std::fs;
use std::io::Write;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};
use crate::common::config::AppConfig;

pub struct ConfigStorage;

impl ConfigStorage {
    fn get_base_dir(app_handle: &AppHandle) -> Result<PathBuf, String> {
        let path = app_handle
            .path()
            .app_data_dir()
            .or_else(|_| app_handle.path().app_config_dir())
            .map_err(|e| e.to_string())?;

        if !path.exists() {
            let _ = fs::create_dir_all(&path);
        }
        Ok(path)
    }

    pub fn get_config_path(app_handle: &AppHandle) -> Result<PathBuf, String> {
        let mut path = Self::get_base_dir(app_handle)?;
        path.push("config.json");
        Ok(path)
    }

    pub fn get_backup_path(app_handle: &AppHandle) -> Result<PathBuf, String> {
        let mut path = Self::get_base_dir(app_handle)?;
        path.push("config.json.bak");
        Ok(path)
    }

    pub fn load_config(app_handle: &AppHandle) -> Result<AppConfig, String> {
        let path = Self::get_config_path(app_handle)?;
        let backup_path = Self::get_backup_path(app_handle)?;
        Self::load_config_from_path(&path, &backup_path)
    }

    pub fn load_config_from_path(path: &PathBuf, backup_path: &PathBuf) -> Result<AppConfig, String> {
        if path.exists() {
            if let Ok(content) = fs::read_to_string(path) {
                if let Ok(config) = serde_json::from_str::<AppConfig>(&content) {
                    return Ok(config);
                }
            }
            eprintln!("[Config] Warning: Primary config file corrupted. Attempting backup recovery.");
        }

        // Attempt recovery from backup if primary config fails or is corrupted
        if backup_path.exists() {
            if let Ok(backup_content) = fs::read_to_string(backup_path) {
                if let Ok(backup_config) = serde_json::from_str::<AppConfig>(&backup_content) {
                    println!("[Config] Successfully restored configuration from backup file.");
                    return Ok(backup_config);
                }
            }
        }

        Ok(AppConfig::default())
    }

    pub fn save_config(app_handle: &AppHandle, config: &AppConfig) -> Result<(), String> {
        let path = Self::get_config_path(app_handle)?;
        let backup_path = Self::get_backup_path(app_handle)?;
        Self::save_config_to_path(&path, &backup_path, config)
    }

    pub fn save_config_to_path(path: &PathBuf, backup_path: &PathBuf, config: &AppConfig) -> Result<(), String> {
        let content = serde_json::to_string_pretty(config).map_err(|e| e.to_string())?;

        // Create atomic backup copy before overwriting configuration
        if path.exists() {
            let _ = fs::copy(path, backup_path);
        }

        // Write to temp file, sync to OS disk storage, and atomically rename
        let temp_path = path.with_extension("tmp");
        {
            let mut file = fs::File::create(&temp_path).map_err(|e| e.to_string())?;
            file.write_all(content.as_bytes()).map_err(|e| e.to_string())?;
            file.sync_all().map_err(|e| e.to_string())?;
        }

        if fs::rename(&temp_path, path).is_err() {
            // Fallback for filesystem edge cases
            let mut file = fs::File::create(path).map_err(|e| e.to_string())?;
            file.write_all(content.as_bytes()).map_err(|e| e.to_string())?;
            file.sync_all().map_err(|e| e.to_string())?;
            let _ = fs::remove_file(temp_path);
        }

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::common::models::ShortcutConfig;

    #[test]
    fn test_save_and_load_persistence() {
        let temp_dir = std::env::temp_dir().join("custon_test_persistence");
        let _ = fs::create_dir_all(&temp_dir);
        let path = temp_dir.join("config.json");
        let backup_path = temp_dir.join("config.json.bak");

        let mut config = AppConfig::default();
        config.shortcuts.push(ShortcutConfig {
            id: "test-shortcut-123".to_string(),
            name: "Test Chrome Shortcut".to_string(),
            apps: vec!["chrome".to_string()],
            keys: vec!["Ctrl".to_string(), "Shift".to_string(), "K".to_string()],
            status: Some("Enabled".to_string()),
            last_used: Some("Just now".to_string()),
            is_full_close: Some(false),
            execution_mode: Some("stealth".to_string()),
        });

        // 1. Save to disk with fsync
        ConfigStorage::save_config_to_path(&path, &backup_path, &config).expect("Save failed");
        assert!(path.exists());

        // 2. Load from disk (simulating process restart)
        let loaded = ConfigStorage::load_config_from_path(&path, &backup_path).expect("Load failed");
        assert_eq!(loaded.shortcuts.len(), config.shortcuts.len());
        assert_eq!(loaded.shortcuts.last().unwrap().id, "test-shortcut-123");
        assert_eq!(loaded.shortcuts.last().unwrap().name, "Test Chrome Shortcut");

        // 3. Clean up
        let _ = fs::remove_file(&path);
        let _ = fs::remove_file(&backup_path);
        let _ = fs::remove_dir(&temp_dir);
    }
}
