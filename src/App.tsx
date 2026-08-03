import { useState, useEffect } from "react"
import { MainLayout } from "@/layouts/MainLayout"
import { Dashboard } from "@/pages/Dashboard"
import { TargetShortcuts } from "@/pages/TargetShortcuts"
import { CreateAppShortcut } from "@/pages/CreateAppShortcut"
import { CreateFullClose } from "@/pages/CreateFullClose"
import { CustomizeAllKeys } from "@/pages/CustomizeAllKeys"
import { Settings } from "@/pages/Settings"
import { HelpPage } from "@/pages/Help"
import { type ActivePage } from "@/components/Sidebar"
import { SplashScreen } from "@/components/SplashScreen"

function App() {
  const [isLoading, setIsLoading] = useState(() => {
    try {
      return localStorage.getItem("startup_show_splash") !== "false"
    } catch {
      return true
    }
  })
  const [currentPage, setCurrentPage] = useState<ActivePage>("dashboard")
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.add("dark")
    try {
      localStorage.setItem("settings_dark_mode", "true")
    } catch {
      // Ignore
    }
  }, [])

  // Start minimized & startup session initialization
  useEffect(() => {
    async function initStartupSettings() {
      try {
        const { getCurrentWindow } = await import("@tauri-apps/api/window")
        const currentWindow = getCurrentWindow()

        // 1. Start Minimized Check
        const startMinimized = localStorage.getItem("startup_start_minimized") === "true"
        if (startMinimized) {
          await currentWindow.hide()
        }

        // 2. Restore Session Check
        const restoreSession = localStorage.getItem("startup_restore_session") !== "false"
        if (restoreSession) {
          const saved = localStorage.getItem("custom_workspace_shortcuts")
          if (saved) {
            try {
              const shortcuts = JSON.parse(saved)
              const { invoke } = await import("@tauri-apps/api/core")
              await invoke("sync_shortcuts", { shortcuts })
            } catch {}
          }
        }

        // 3. Check Updates Check
        const checkUpdates = localStorage.getItem("startup_check_updates") !== "false"
        if (checkUpdates) {
          // Log or query client updater readiness
          console.log("[Custon] Checking client updates database on system launch...")
        }
      } catch (e) {
        // Non-Tauri fallback
      }
    }
    initStartupSettings()
  }, [])

  // Window closure behavior & background execution
  useEffect(() => {
    let unlisten: (() => void) | undefined
    async function listenToClose() {
      try {
        const { getCurrentWindow } = await import("@tauri-apps/api/window")
        const currentWindow = getCurrentWindow()

        unlisten = await currentWindow.onCloseRequested(async (event) => {
          const closeBehavior = localStorage.getItem("startup_close_behavior") || "tray"
          const runInBackground = localStorage.getItem("startup_run_background") !== "false"

          if (closeBehavior === "tray" || runInBackground) {
            event.preventDefault()
            try {
              await currentWindow.hide()
            } catch (e) {
              console.error("Failed to hide window to tray", e)
            }
          } else {
            try {
              const { invoke } = await import("@tauri-apps/api/core")
              await invoke("restore_all_hidden")
            } catch (e) {
              console.error("Failed to restore windows on exit", e)
            }
            try {
              await currentWindow.destroy()
            } catch {
              // Non-Tauri fallback
            }
          }
        })
      } catch (e) {
        console.warn("Not in Tauri environment, window close handler skipped", e)
      }
    }
    listenToClose()

    return () => {
      if (unlisten) {
        unlisten()
      }
    }
  }, [])


  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />
      case "create-app-shortcut":
        return (
          <CreateAppShortcut
            onBack={() => setCurrentPage("dashboard")}
            onSave={(shortcutName, selectedApps, keys, mode) => {
              try {
                const saved = localStorage.getItem("custom_workspace_shortcuts")
                const existing = saved ? JSON.parse(saved) : []
                const newShortcut = {
                  id: Date.now().toString(),
                  name: shortcutName.trim() || selectedApps.join(" • "),
                  apps: selectedApps,
                  keys,
                  status: "Enabled",
                  lastUsed: "Just now",
                  executionMode: mode || "stealth"
                }
                const updated = [newShortcut, ...existing]
                localStorage.setItem("custom_workspace_shortcuts", JSON.stringify(updated))
                import("@tauri-apps/api/core").then(({ invoke }) => {
                  invoke("sync_shortcuts", { shortcuts: updated }).catch(() => {})
                })
              } catch {}
              setCurrentPage("target-shortcuts")
            }}
          />
        )
      case "close-all-windows":
        return (
          <CreateFullClose
            onBack={() => setCurrentPage("dashboard")}
            onSave={(keys) => {
              try {
                localStorage.setItem("custom_full_close_shortcut", JSON.stringify(keys))
              } catch {}
              setCurrentPage("target-shortcuts")
            }}
          />
        )
      case "customize-keys":
        return <CustomizeAllKeys onBack={() => setCurrentPage("dashboard")} />
      case "target-shortcuts":
        return <TargetShortcuts />
      case "settings":
        return <Settings darkMode={darkMode} setDarkMode={setDarkMode} onBack={() => setCurrentPage("dashboard")} />
      case "help":
        return <HelpPage />
      default:
        return <Dashboard />
    }
  }

  return (
    <>
      {isLoading && <SplashScreen onComplete={() => setIsLoading(false)} />}
      <MainLayout
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      >
        {renderPage()}
      </MainLayout>
    </>
  )
}

export default App;
