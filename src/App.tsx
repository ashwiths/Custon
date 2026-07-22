import { useState, useEffect } from "react"
import { MainLayout } from "@/layouts/MainLayout"
import { Dashboard } from "@/pages/Dashboard"
import { Settings } from "@/pages/Settings"
import { type ActivePage } from "@/components/Sidebar"

function App() {
  const [currentPage, setCurrentPage] = useState<ActivePage>("dashboard")
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("settings_dark_mode")
      return saved !== "false"
    } catch {
      return true
    }
  })

  useEffect(() => {
    const root = window.document.documentElement
    if (darkMode) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    try {
      localStorage.setItem("settings_dark_mode", String(darkMode))
    } catch {
      // Ignore
    }
  }, [darkMode])

  useEffect(() => {
    let unlisten: (() => void) | undefined
    async function listenToClose() {
      try {
        const { getCurrentWindow } = await import("@tauri-apps/api/window")
        const currentWindow = getCurrentWindow()
        
        unlisten = await currentWindow.onCloseRequested(async (event) => {
          const minimizeToTray = localStorage.getItem("settings_minimize_to_tray") !== "false"
          if (minimizeToTray) {
            event.preventDefault()
            await currentWindow.hide()
          } else {
            // Restore all hidden windows before quitting to ensure no orphan hidden windows
            try {
              const { invoke } = await import("@tauri-apps/api/core")
              await invoke("restore_all_hidden")
            } catch (e) {
              console.error("Failed to restore windows on exit", e)
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
      case "settings":
        return <Settings darkMode={darkMode} setDarkMode={setDarkMode} onBack={() => setCurrentPage("dashboard")} />
      default:
        return <Dashboard />
    }
  }

  return (
    <MainLayout
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
    >
      {renderPage()}
    </MainLayout>
  )
}

export default App;
