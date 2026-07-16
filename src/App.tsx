import { useState, useEffect } from "react"
import { MainLayout } from "@/layouts/MainLayout"
import { Dashboard } from "@/pages/Dashboard"
import { Settings } from "@/pages/Settings"
import { About } from "@/pages/About"
import { type ActivePage } from "@/components/Sidebar"

function App() {
  const [currentPage, setCurrentPage] = useState<ActivePage>("dashboard")
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    const root = window.document.documentElement
    if (darkMode) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [darkMode])

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />
      case "settings":
        return <Settings darkMode={darkMode} setDarkMode={setDarkMode} />
      case "about":
        return <About />
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
