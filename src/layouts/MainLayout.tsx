import * as React from "react"
import { Sidebar, type ActivePage } from "@/components/Sidebar"
import { TopNavbar } from "@/components/TopNavbar"

interface MainLayoutProps {
  currentPage: ActivePage
  setCurrentPage: (page: ActivePage) => void
  darkMode: boolean
  setDarkMode: (dark: boolean) => void
  children: React.ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  currentPage,
  setCurrentPage,
  darkMode,
  setDarkMode,
  children,
}) => {
  return (
    <div className="app-root flex h-screen w-screen overflow-hidden relative" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 relative z-10">
        <TopNavbar title={currentPage} darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className={`flex-1 ${currentPage === "settings" ? "overflow-hidden p-5" : "overflow-y-auto p-8"}`}>
          <div
            className={`mx-auto animate-fade-up ${
              currentPage === "settings" ? "w-full max-w-none h-full flex flex-col" : "max-w-[900px] pb-24"
            }`}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

