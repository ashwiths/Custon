use std::fs::{self, OpenOptions};
use std::io::Write;
use std::path::PathBuf;
use std::time::SystemTime;
use tauri::{AppHandle, Manager};

pub enum LogLevel {
    Debug,
    Info,
    Warning,
    Error,
}

impl LogLevel {
    fn as_str(&self) -> &'static str {
        match self {
            LogLevel::Debug => "DEBUG",
            LogLevel::Info => "INFO",
            LogLevel::Warning => "WARNING",
            LogLevel::Error => "ERROR",
        }
    }
}

pub struct Logger;

impl Logger {
    fn get_log_file_path(app_handle: &AppHandle) -> Result<PathBuf, String> {
        let mut path = app_handle.path().app_log_dir().map_err(|e| e.to_string())?;
        if !path.exists() {
            let _ = fs::create_dir_all(&path);
        }
        path.push("app.log");
        Ok(path)
    }

    pub fn log(app_handle: &AppHandle, level: LogLevel, message: &str) {
        let now = SystemTime::now()
            .duration_since(SystemTime::UNIX_EPOCH)
            .map(|d| d.as_secs())
            .unwrap_or(0);
        let log_line = format!("[unix_time:{}] [{}] {}\n", now, level.as_str(), message);
        
        // Output to console
        print!("{}", log_line);

        // Output to app log file
        if let Ok(path) = Self::get_log_file_path(app_handle) {
            if let Ok(mut file) = OpenOptions::new()
                .create(true)
                .append(true)
                .open(path)
            {
                let _ = file.write_all(log_line.as_bytes());
            }
        }
    }

    pub fn debug(app_handle: &AppHandle, message: &str) {
        Self::log(app_handle, LogLevel::Debug, message);
    }

    pub fn info(app_handle: &AppHandle, message: &str) {
        Self::log(app_handle, LogLevel::Info, message);
    }

    pub fn warn(app_handle: &AppHandle, message: &str) {
        Self::log(app_handle, LogLevel::Warning, message);
    }

    pub fn error(app_handle: &AppHandle, message: &str) {
        Self::log(app_handle, LogLevel::Error, message);
    }
}
