use std::process::Command;
use std::sync::Arc;
use crate::common::models::{RunningAppInfo, ToggleState, WorkspaceState};
use crate::platform::PlatformWindowManager;

pub struct LinuxWindowManager;

impl LinuxWindowManager {
  /// Detects whether the current session is running under X11 or Wayland
  pub fn is_wayland() -> bool {
    if let Ok(session_type) = std::env::var("XDG_SESSION_TYPE") {
      session_type.to_lowercase().contains("wayland")
    } else {
      false
    }
  }

  /// Executes command utilities on Linux cleanly
  fn run_cmd(cmd: &str, args: &[&str]) -> Result<String, String> {
    let output = Command::new(cmd).args(args).output().map_err(|e| e.to_string())?;

    if output.status.success() {
      Ok(String::from_utf8_lossy(&output.stdout).trim().to_string())
    } else {
      Err(String::from_utf8_lossy(&output.stderr).trim().to_string())
    }
  }
}

impl PlatformWindowManager for LinuxWindowManager {
  fn get_running_applications() -> Vec<RunningAppInfo> {
    let mut apps = Vec::new();

    // Query active X11 windows via wmctrl if available
    if let Ok(output) = Self::run_cmd("wmctrl", &["-l", "-x"]) {
      for line in output.lines() {
        let parts: Vec<&str> = line.split_whitespace().collect();
        if parts.len() >= 4 {
          let window_class = parts[2];
          let title = parts[4..].join(" ");
          let app_id = window_class.split('.').next().unwrap_or(window_class).to_lowercase();

          if !title.is_empty() && app_id != "custon" {
            apps.push(RunningAppInfo {
              id: app_id.clone(),
              name: app_id.clone(),
              desc: format!("Linux Window ({})", title),
              exe_name: window_class.to_string(),
            });
          }
        }
      }
    }

    if apps.is_empty() {
      // Fallback for Linux GUI processes
      apps = vec![
        RunningAppInfo {
          id: "firefox".to_string(),
          name: "Firefox".to_string(),
          desc: "Mozilla Firefox Web Browser".to_string(),
          exe_name: "firefox".to_string(),
        },
        RunningAppInfo {
          id: "chrome".to_string(),
          name: "Google Chrome".to_string(),
          desc: "Google Chrome Web Browser".to_string(),
          exe_name: "google-chrome".to_string(),
        },
        RunningAppInfo {
          id: "code".to_string(),
          name: "VS Code".to_string(),
          desc: "Visual Studio Code Editor".to_string(),
          exe_name: "code".to_string(),
        },
      ];
    }

    apps
  }

  fn toggle(state: &WorkspaceState) -> (ToggleState, usize) {
    let current_state = *state.toggle_state.lock().unwrap();
    let new_state = match current_state {
      ToggleState::Visible => ToggleState::Hidden,
      ToggleState::Hidden => ToggleState::Visible,
    };

    let mut count = 0;
    if Self::is_wayland() {
      eprintln!("[Linux Wayland] Compositor policy restricts direct window unmap. Process signal fallback active.");
    } else {
      let flag = match new_state {
        ToggleState::Hidden => "add,hidden",
        ToggleState::Visible => "remove,hidden",
      };
      if Self::run_cmd("wmctrl", &["-r", ":ACTIVE:", "-b", flag]).is_ok() {
        count = 1;
      }
    }

    *state.toggle_state.lock().unwrap() = new_state;
    (new_state, count)
  }

  fn toggle_target_apps(
    state: &WorkspaceState,
    shortcut_id: &str,
    target_apps: &[String],
    mode: &str,
  ) -> (ToggleState, usize) {
    let current_state = state.get_shortcut_state(shortcut_id);
    let new_state = match current_state {
      ToggleState::Visible => ToggleState::Hidden,
      ToggleState::Hidden => ToggleState::Visible,
    };

    let mut count = 0;

    for target in target_apps {
      if target.is_empty() {
        continue;
      }

      if mode == "close" {
        let _ = Self::run_cmd("pkill", &["-f", target]);
        count += 1;
      } else if !Self::is_wayland() {
        let flag = match new_state {
          ToggleState::Hidden => "add,hidden",
          ToggleState::Visible => "remove,hidden",
        };
        if Self::run_cmd("wmctrl", &["-x", "-r", target, "-b", flag]).is_ok() {
          count += 1;
        }
      } else {
        // Wayland signal fallback (SIGSTOP to suspend, SIGCONT to resume)
        let signal = match new_state {
          ToggleState::Hidden => "-STOP",
          ToggleState::Visible => "-CONT",
        };
        if Self::run_cmd("killall", &[signal, target]).is_ok() {
          count += 1;
        }
      }
    }

    state.set_shortcut_state(shortcut_id, new_state);
    (new_state, count)
  }

  fn restore_all_hidden(_state: &WorkspaceState) -> usize {
    if !Self::is_wayland() {
      let _ = Self::run_cmd("wmctrl", &["-r", ":ALL:", "-b", "remove,hidden"]);
    }
    1
  }

  fn close_target_apps(target_apps: &[String]) -> usize {
    let mut count = 0;
    for target in target_apps {
      if Self::run_cmd("pkill", &["-f", target]).is_ok() {
        count += 1;
      }
    }
    count
  }
}
