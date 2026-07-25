use std::process::Command;
use std::sync::Arc;
use crate::common::models::{RunningAppInfo, ToggleState, WorkspaceState};
use crate::platform::PlatformWindowManager;

pub struct MacosWindowManager;

impl MacosWindowManager {
  /// Checks if Accessibility permissions (AXIsProcessTrusted) are granted on macOS
  pub fn check_accessibility_permissions() -> bool {
    let output = Command::new("osascript")
      .arg("-e")
      .arg("tell application \"System Events\" to return UI elements enabled")
      .output();

    match output {
      Ok(out) => String::from_utf8_lossy(&out.stdout).trim() == "true",
      Err(_) => false,
    }
  }

  /// Executes AppleScript commands safely
  fn run_applescript(script: &str) -> Result<String, String> {
    let output = Command::new("osascript")
      .arg("-e")
      .arg(script)
      .output()
      .map_err(|e| e.to_string())?;

    if output.status.success() {
      Ok(String::from_utf8_lossy(&output.stdout).trim().to_string())
    } else {
      Err(String::from_utf8_lossy(&output.stderr).trim().to_string())
    }
  }
}

impl PlatformWindowManager for MacosWindowManager {
  fn get_running_applications() -> Vec<RunningAppInfo> {
    let script = r#"
            tell application "System Events"
                set appList to name of every process where background only is false
                set output to ""
                repeat with appName in appList
                    set output to output & appName & "\n"
                end repeat
                return output
            end tell
        "#;

    let mut apps = Vec::new();
    if let Ok(result) = Self::run_applescript(script) {
      for line in result.lines() {
        let name = line.trim();
        if !name.is_empty() && name != "Finder" && name != "Custun" {
          apps.push(RunningAppInfo {
            id: name.to_lowercase().replace(' ', "-"),
            name: name.to_string(),
            desc: format!("macOS Application ({})", name),
            exe_name: name.to_string(),
          });
        }
      }
    }

    if apps.is_empty() {
      // General fallback process list for macOS
      apps = vec![
        RunningAppInfo {
          id: "safari".to_string(),
          name: "Safari".to_string(),
          desc: "Apple Safari Web Browser".to_string(),
          exe_name: "Safari".to_string(),
        },
        RunningAppInfo {
          id: "chrome".to_string(),
          name: "Google Chrome".to_string(),
          desc: "Google Chrome Browser".to_string(),
          exe_name: "Google Chrome".to_string(),
        },
        RunningAppInfo {
          id: "vscode".to_string(),
          name: "Visual Studio Code".to_string(),
          desc: "Code Editor".to_string(),
          exe_name: "Visual Studio Code".to_string(),
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

    let script = match new_state {
      ToggleState::Hidden => {
        r#"
                tell application "System Events"
                    set visible of (every process where background only is false and name is not "Custun" and name is not "Finder") to false
                end tell
                "#
      }
      ToggleState::Visible => {
        r#"
                tell application "System Events"
                    set visible of (every process where background only is false and name is not "Custun") to true
                end tell
                "#
      }
    };

    let count = match Self::run_applescript(script) {
      Ok(_) => 1,
      Err(_) => 0,
    };

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
        let script = format!(
          r#"
                    tell application "System Events"
                        if exists (process "{}") then
                            tell application "{}" to quit
                        end if
                    end tell
                    "#,
          target, target
        );
        let _ = Self::run_applescript(&script);
        count += 1;
      } else {
        let visible_flag = match new_state {
          ToggleState::Hidden => "false",
          ToggleState::Visible => "true",
        };
        let script = format!(
          r#"
                    tell application "System Events"
                        if exists (process "{}") then
                            set visible of process "{}" to {}
                        end if
                    end tell
                    "#,
          target, target, visible_flag
        );
        if Self::run_applescript(&script).is_ok() {
          count += 1;
        }
      }
    }

    state.set_shortcut_state(shortcut_id, new_state);
    (new_state, count)
  }

  fn restore_all_hidden(_state: &WorkspaceState) -> usize {
    let script = r#"
            tell application "System Events"
                set visible of (every process where background only is false) to true
            end tell
        "#;
    match Self::run_applescript(script) {
      Ok(_) => 1,
      Err(_) => 0,
    }
  }

  fn close_target_apps(target_apps: &[String]) -> usize {
    let mut count = 0;
    for target in target_apps {
      let script = format!(
        r#"
                tell application "System Events"
                    if exists (process "{}") then
                        tell application "{}" to quit
                    end if
                end tell
                "#,
        target, target
      );
      if Self::run_applescript(&script).is_ok() {
        count += 1;
      }
    }
    count
  }
}
