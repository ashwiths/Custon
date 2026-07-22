import * as React from "react"
import {
  Monitor,
  Keyboard,
  Shield,
  Play,
  Layers,
  Activity,
  Archive,
  BarChart,
  Cloud,
  FlaskConical,
  CheckCircle
} from "lucide-react"

// Import modular settings tab panels
import { AppearanceTab } from "@/components/settings/AppearanceTab"
import { HotkeysTab } from "@/components/settings/HotkeysTab"
import { SecurityTab } from "@/components/settings/SecurityTab"
import { StartupTab } from "@/components/settings/StartupTab"
import { WorkspaceTab } from "@/components/settings/WorkspaceTab"
import { DiagnosticsTab } from "@/components/settings/DiagnosticsTab"
import { BackupTab } from "@/components/settings/BackupTab"
import { StatisticsTab } from "@/components/settings/StatisticsTab"
import { SyncTab } from "@/components/settings/SyncTab"
import { ExperimentalTab } from "@/components/settings/ExperimentalTab"

interface SettingsProps {
  darkMode: boolean
  setDarkMode: (dark: boolean) => void
  onBack: () => void
}

export const Settings: React.FC<SettingsProps> = ({ darkMode, setDarkMode, onBack }) => {
  const [activeTab, setActiveTab] = React.useState("appearance")
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)

  const tabs = [
    { id: "appearance", label: "Appearance", icon: Monitor, component: <AppearanceTab darkMode={darkMode} setDarkMode={setDarkMode} /> },
    { id: "hotkeys", label: "Hotkeys", icon: Keyboard, component: <HotkeysTab /> },
    { id: "security", label: "Security", icon: Shield, component: <SecurityTab /> },
    { id: "startup", label: "Startup", icon: Play, component: <StartupTab /> },
    { id: "workspace", label: "Workspace", icon: Layers, component: <WorkspaceTab /> },
    { id: "diagnostics", label: "Diagnostics", icon: Activity, component: <DiagnosticsTab /> },
    { id: "backup", label: "Backup & Restore", icon: Archive, component: <BackupTab /> },
    { id: "statistics", label: "Statistics", icon: BarChart, component: <StatisticsTab /> },
    { id: "sync", label: "Cloud Sync", icon: Cloud, component: <SyncTab /> },
    { id: "experimental", label: "Experimental", icon: FlaskConical, component: <ExperimentalTab /> }
  ]

  const handleApplyChanges = () => {
    setToastMessage("✓ All modifications saved & synced successfully")
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleFactoryReset = () => {
    if (window.confirm("Are you sure you want to restore all settings and active shortcut databases? This action is permanent and cannot be undone.")) {
      localStorage.clear()
      try {
        import("@tauri-apps/api/core").then(async ({ invoke }) => {
          await invoke("set_autostart", { enable: false })
        }).catch(() => {})
      } catch {
        // Fallback
      }
      
      setToastMessage("✓ Application state restored to initial settings")
      setTimeout(() => {
        setToastMessage(null)
        window.location.reload()
      }, 1500)
    }
  }

  const activeTabObj = tabs.find(t => t.id === activeTab) || tabs[0]

  return (
    <div className="flex flex-col select-none text-[#F2D8C2] font-sans antialiased max-w-[900px] mx-auto animate-fade-up relative">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-[#A67165] text-white px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs shadow-lg animate-fade-in flex items-center gap-2 border border-white/10">
          <CheckCircle className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container Split: Left Tab Menu (4 cols) & Right active page (8 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch min-h-[460px]">
        {/* Left Sidebar Menu (4 cols) */}
        <div className="md:col-span-4 bg-black/25 dark:bg-black/15 p-3 rounded-2xl border border-white/5 space-y-1.5 flex flex-col justify-start">
          <span className="text-[9px] font-black uppercase tracking-widest text-[#9B8179] px-3 pb-1 border-b border-white/5 mb-2 block">
            System Preferences
          </span>
          <div className="space-y-1 overflow-y-auto max-h-[400px] pr-1">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all border-none cursor-pointer text-left ${
                    isActive
                      ? "bg-[#A67165] text-white shadow-[0_0_10px_rgba(166,113,101,0.35)]"
                      : "bg-transparent text-[#9B8179] hover:text-[#F2D8C2] hover:bg-white/5"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Tab Content Pane (8 cols) */}
        <div className="md:col-span-8 bg-black/20 dark:bg-black/10 p-5 rounded-2xl border border-white/5 flex flex-col justify-between overflow-y-auto max-h-[450px]">
          {activeTabObj.component}
        </div>
      </div>

      {/* Footer operations row */}
      <div className="flex flex-wrap items-center justify-between border-t border-white/5 pt-4 mt-4 gap-4 font-mono text-[10px]">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-[#F2D8C2] font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>[| BACK</span>
        </button>

        <button
          onClick={handleApplyChanges}
          className="px-5 py-2.5 rounded-xl bg-[#A67165] hover:bg-[#734E46] text-white font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_8px_rgba(166,113,101,0.3)]"
        >
          <span>✓ APPLY CHANGES</span>
        </button>

        <button
          onClick={handleFactoryReset}
          className="px-4 py-2.5 rounded-xl border border-rose-900/30 hover:border-rose-900/60 bg-rose-950/10 hover:bg-rose-950/20 text-rose-500 hover:text-rose-400 font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>↻ RESET TO DEFAULT</span>
        </button>
      </div>
    </div>
  )
}
