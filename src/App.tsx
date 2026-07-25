import { useState, useEffect } from "react"
import { MainLayout } from "@/layouts/MainLayout"
import { Dashboard } from "@/pages/Dashboard"
import { Settings } from "@/pages/Settings"
import { HelpPage } from "@/pages/Help"
import { type ActivePage } from "@/components/Sidebar"
import { SplashScreen } from "@/components/SplashScreen"

function App() {
  const [isLoading, setIsLoading] = useState(true)
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
