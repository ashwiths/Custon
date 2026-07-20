import * as React from "react"
import { Sidebar, type ActivePage } from "@/components/Sidebar"
import { TopNavbar } from "@/components/TopNavbar"
import { FireworksOverlay } from "@/components/FireworksOverlay"
import { BurstButton } from "@/components/BurstButton"

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
      {/* Fullscreen Canvas Fireworks Cracker Animation Layer */}
      <FireworksOverlay />

      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 relative z-10">
        <TopNavbar title={currentPage} darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="flex-1 overflow-y-auto" style={{ padding: "32px" }}>
          <div
            className="mx-auto animate-fade-up pb-24"
            style={{ maxWidth: "900px" }}
          >
            {children}
          </div>
        </main>
      </div>

      {/* Floating FIFA Celebration Burst Button (matching Image 1) */}
      <BurstButton />
    </div>
  )
}

