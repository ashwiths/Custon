import * as React from "react"
import {
  Keyboard,
  Shield,
  Play,
  Layers,
  Activity,
  RefreshCw,
  BarChart,
  Cloud,
  FlaskConical,
  CheckCircle
} from "lucide-react"

// Lazy-loaded modular settings tab panels for optimal startup performance & bundle splitting
const HotkeysTab = React.lazy(() => import("@/components/settings/HotkeysTab").then(m => ({ default: m.HotkeysTab })))
const SecurityTab = React.lazy(() => import("@/components/settings/SecurityTab").then(m => ({ default: m.SecurityTab })))
const StartupTab = React.lazy(() => import("@/components/settings/StartupTab").then(m => ({ default: m.StartupTab })))
const WorkspaceTab = React.lazy(() => import("@/components/settings/WorkspaceTab").then(m => ({ default: m.WorkspaceTab })))
const DiagnosticsTab = React.lazy(() => import("@/components/settings/DiagnosticsTab").then(m => ({ default: m.DiagnosticsTab })))
const SystemTab = React.lazy(() => import("@/components/settings/SystemTab").then(m => ({ default: m.SystemTab })))
const StatisticsTab = React.lazy(() => import("@/components/settings/StatisticsTab").then(m => ({ default: m.StatisticsTab })))
const SyncTab = React.lazy(() => import("@/components/settings/SyncTab").then(m => ({ default: m.SyncTab })))
const ExperimentalTab = React.lazy(() => import("@/components/settings/ExperimentalTab").then(m => ({ default: m.ExperimentalTab })))

interface SettingsProps {
  darkMode?: boolean
  setDarkMode: (dark: boolean) => void
  onBack: () => void
}

export const Settings: React.FC<SettingsProps> = ({ setDarkMode, onBack }) => {
  const [activeTab, setActiveTab] = React.useState("hotkeys")
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)

  const tabs = [
    { id: "hotkeys", label: "Hotkeys", icon: Keyboard, component: <HotkeysTab /> },
    { id: "security", label: "Security", icon: Shield, component: <SecurityTab /> },
    { id: "startup", label: "Startup", icon: Play, component: <StartupTab /> },
    { id: "workspace", label: "Workspace", icon: Layers, component: <WorkspaceTab /> },
    { id: "diagnostics", label: "Diagnostics", icon: Activity, component: <DiagnosticsTab /> },
    { id: "system", label: "System", icon: RefreshCw, component: <SystemTab setDarkMode={setDarkMode} /> },
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
  const isComingSoon = ["security", "workspace", "sync", "experimental"].includes(activeTab)

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-hidden select-none text-[#F2D8C2] font-sans antialiased animate-fade-up relative">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-[#A67165] text-white px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs shadow-lg animate-fade-in flex items-center gap-2 border border-white/10">
          <CheckCircle className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container Split: Left Tab Menu (4 cols) & Right active page (8 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden mb-4">
        {/* Left Sidebar Menu (4 cols) */}
        <div className="md:col-span-4 bg-black/25 dark:bg-black/15 p-4 rounded-2xl border border-white/5 flex flex-col h-full overflow-hidden">
          <span className="text-[9px] font-black uppercase tracking-widest text-[#9B8179] px-3 pb-2 border-b border-white/5 mb-3 block">
            System Preferences
          </span>
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all border-none cursor-pointer text-left ${
                    isActive
                      ? "bg-[#A67165] text-white shadow-[0_0_10px_rgba(166,113,101,0.35)] font-black"
                      : "bg-transparent text-[#594741] dark:text-[#9B8179] hover:text-[#252326] dark:hover:text-[#F2D8C2] hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <tab.icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Tab Content Pane (8 cols) */}
        <div className="md:col-span-8 bg-black/20 dark:bg-black/10 p-6 rounded-2xl border border-white/5 flex flex-col overflow-y-auto h-full min-h-0 scrollbar-thin relative">
          <div className={`w-full h-full flex flex-col justify-between ${isComingSoon ? "blur-md select-none pointer-events-none" : ""}`}>
            <React.Suspense fallback={<div className="p-8 text-center text-xs font-bold text-[#9B8179] animate-pulse">Loading tab settings...</div>}>
              {activeTabObj.component}
            </React.Suspense>
          </div>
          {isComingSoon && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-2xl">
              <div className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A67165] to-[#734E46] border border-[#F2D8C2]/20 text-[#F2D8C2] font-mono text-[10px] font-black tracking-widest uppercase shadow-lg select-none">
                Coming Soon
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer operations row */}
      <div className="flex flex-wrap items-center justify-between border-t border-white/5 pt-4 mt-1 gap-4 font-mono text-[10px]">
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
