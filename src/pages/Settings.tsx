import * as React from "react"
import { ShortcutInput } from "@/components/ShortcutInput"
import { Monitor, Sliders, Keyboard, RefreshCw } from "lucide-react"

interface SettingsProps {
  darkMode: boolean
  setDarkMode: (dark: boolean) => void
  onBack: () => void
}

const SETTING_DETAILS: Record<string, { title: string; desc: string[] }> = {
  dark_mode: {
    title: "DARK MODE",
    desc: [
      "Select the user interface appearance theme.",
      "A dark theme uses less light, helping to reduce eye fatigue and strain during long stealth monitoring sessions.",
      "Switching this setting instantly updates the entire visual presentation of the Custun client desktop suite."
    ]
  },
  minimize_tray: {
    title: "MINIMIZE TO TRAY",
    desc: [
      "Keep the application active in the system tray.",
      "When enabled, clicking the close window button hides the window to the taskbar notification tray instead of exiting.",
      "This is required to keep background hotkeys functioning silently without a visible taskbar tab."
    ]
  },
  default_action: {
    title: "DEFAULT SHORTCUT ACTION",
    desc: [
      "Set the primary mode of operation for app triggers.",
      "Stealth Hide uses native system API calls to minimize and hide active windows completely from task views.",
      "Force Close terminates the process tree of target applications immediately for emergency panic situations."
    ]
  },
  show_toasts: {
    title: "SHOW TOAST NOTIFICATIONS",
    desc: [
      "Enable display alerts for hotkey actions.",
      "A small notification will appear at the bottom corner of your screen when a hotkey is pressed or windows are modified.",
      "Disable this for absolute silent operation without visual traces."
    ]
  },
  start_login: {
    title: "START WITH WINDOWS",
    desc: [
      "Configure auto-launch behavior on startup.",
      "Automatically launches Custun in background service mode when you log into your Windows session.",
      "Highly recommended to ensure all target app panic shortcuts work immediately without manual app boot."
    ]
  },
  global_shortcut: {
    title: "GLOBAL OVERLAY TRIGGER",
    desc: [
      "Define the shortcut to summon the client.",
      "This global key combination brings up the quick configuration panel overlay on top of any active app or game.",
      "Focus the input field on the right and press your keyboard sequence to capture a new trigger."
    ]
  },
  restore_windows: {
    title: "RESTORE HIDDEN WINDOWS",
    desc: [
      "Force-rescue hidden application tasks.",
      "If target applications were hidden by a shortcut trigger and failed to reappear, this command restores them immediately.",
      "This interacts directly with active processes to make their windows visible again."
    ]
  },
  factory_reset: {
    title: "FACTORY RESET APPLICATION",
    desc: [
      "Erase all local memory storage.",
      "Resets hotkeys, active shortcut bindings, autostart registry configurations, and restores out-of-the-box settings.",
      "Warning: This action is permanent and cannot be undone."
    ]
  }
}

export const Settings: React.FC<SettingsProps> = ({ darkMode, setDarkMode, onBack }) => {
  const [globalShortcut, setGlobalShortcut] = React.useState("Ctrl + Shift + S")
  const [minimizeOnClose, setMinimizeOnClose] = React.useState(true)
  const [startAtLogin, setStartAtLogin] = React.useState(false)
  const [showToasts, setShowToasts] = React.useState(true)
  const [defaultExecutionMode, setDefaultExecutionMode] = React.useState<"stealth" | "close">("stealth")
  const [dangerActionFeedback, setDangerActionFeedback] = React.useState<string | null>(null)
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)

  // Tabs structure
  const tabs = [
    { id: "display", label: "Display", icon: Monitor, settings: [
      { key: "dark_mode", label: "Dark Mode Option" },
      { key: "minimize_tray", label: "Minimize to System Tray" }
    ]},
    { id: "control", label: "Behavior", icon: Sliders, settings: [
      { key: "default_action", label: "Default Action Mode" },
      { key: "show_toasts", label: "Show Action Toast Alerts" },
      { key: "start_login", label: "Start with Windows" }
    ]},
    { id: "hotkeys", label: "Hotkeys", icon: Keyboard, settings: [
      { key: "global_shortcut", label: "Global Overlay Trigger" }
    ]},
    { id: "system", label: "System", icon: RefreshCw, settings: [
      { key: "restore_windows", label: "Restore Hidden Windows" },
      { key: "factory_reset", label: "Factory Reset App" }
    ]}
  ]

  const [activeTab, setActiveTab] = React.useState("display")
  const [selectedSetting, setSelectedSetting] = React.useState("dark_mode")

  React.useEffect(() => {
    async function initSettings() {
      try {
        const savedShortcut = localStorage.getItem("settings_global_shortcut") || "Ctrl + Shift + S"
        setGlobalShortcut(savedShortcut)

        const savedMinimize = localStorage.getItem("settings_minimize_to_tray")
        setMinimizeOnClose(savedMinimize !== "false")

        const savedToasts = localStorage.getItem("settings_show_toasts")
        setShowToasts(savedToasts !== "false")

        const savedMode = localStorage.getItem("settings_default_execution_mode")
        setDefaultExecutionMode(savedMode === "close" ? "close" : "stealth")

        // Check autostart status from Rust
        const { invoke } = await import("@tauri-apps/api/core")
        const isEnabled = await invoke<boolean>("get_autostart_status")
        setStartAtLogin(isEnabled)
      } catch {
        // Fallback for non-tauri env
      }
    }
    initSettings()
  }, [])

  const handleShortcutChange = async (value: string) => {
    setGlobalShortcut(value)
    localStorage.setItem("settings_global_shortcut", value)
    if (value) {
      try {
        const { invoke } = await import("@tauri-apps/api/core")
        await invoke("set_workspace_hotkey", { keyCombo: value })
      } catch {
        // Fallback
      }
    }
  }

  const handleMinimizeChange = (value: boolean) => {
    setMinimizeOnClose(value)
    localStorage.setItem("settings_minimize_to_tray", String(value))
  }

  const handleToastsChange = (value: boolean) => {
    setShowToasts(value)
    localStorage.setItem("settings_show_toasts", String(value))
  }

  const handleDefaultModeChange = (mode: "stealth" | "close") => {
    setDefaultExecutionMode(mode)
    localStorage.setItem("settings_default_execution_mode", mode)
  }

  const handleToggleAutostart = async (enable: boolean) => {
    setStartAtLogin(enable)
    localStorage.setItem("autostart_permission_status", enable ? "allowed" : "denied")
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      await invoke("set_autostart", { enable })
    } catch {
      // Fallback
    }
  }

  const handleRestoreAllHidden = async () => {
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      const count = await invoke<number>("restore_all_hidden")
      setDangerActionFeedback(`✓ Restored ${count} hidden window(s)`)
      setTimeout(() => setDangerActionFeedback(null), 3000)
    } catch (e) {
      setDangerActionFeedback("⚠ Restore failed (or not running in Tauri)")
      setTimeout(() => setDangerActionFeedback(null), 3000)
    }
  }

  const handleFactoryReset = () => {
    if (window.confirm("Are you sure you want to delete all settings, hotkeys, and active target shortcuts? This cannot be undone.")) {
      localStorage.clear()
      try {
        import("@tauri-apps/api/core").then(async ({ invoke }) => {
          await invoke("set_autostart", { enable: false })
        }).catch(() => {})
      } catch {
        // Ignore
      }
      
      setGlobalShortcut("Ctrl + Shift + S")
      setMinimizeOnClose(true)
      setShowToasts(true)
      setDefaultExecutionMode("stealth")
      setStartAtLogin(false)
      setDarkMode(true)
      
      setDangerActionFeedback("✓ All settings and shortcuts have been factory reset")
      setTimeout(() => {
        setDangerActionFeedback(null)
        window.location.reload()
      }, 1500)
    }
  }

  const handleApplyChanges = () => {
    setToastMessage("✓ Settings saved and synced successfully")
    setTimeout(() => setToastMessage(null), 3000)
  }

  const activeTabObj = tabs.find(t => t.id === activeTab)
  const details = SETTING_DETAILS[selectedSetting] || { title: "", desc: [] }

  const renderSettingRow = (key: string, label: string) => {
    const isSelected = selectedSetting === key
    
    // Determine right side value element
    let valueElement = null
    if (key === "dark_mode") {
      valueElement = (
        <div className="flex items-center justify-center">
          {darkMode ? (
            <div className="w-[18px] h-[18px] rounded border border-[#A67165] bg-[#A67165]/20 flex items-center justify-center text-[9px] text-[#A67165] font-black">✓</div>
          ) : (
            <div className="w-[18px] h-[18px] rounded border border-white/20 bg-transparent" />
          )}
        </div>
      )
    } else if (key === "minimize_tray") {
      valueElement = (
        <div className="flex items-center justify-center">
          {minimizeOnClose ? (
            <div className="w-[18px] h-[18px] rounded border border-[#A67165] bg-[#A67165]/20 flex items-center justify-center text-[9px] text-[#A67165] font-black">✓</div>
          ) : (
            <div className="w-[18px] h-[18px] rounded border border-white/20 bg-transparent" />
          )}
        </div>
      )
    } else if (key === "show_toasts") {
      valueElement = (
        <div className="flex items-center justify-center">
          {showToasts ? (
            <div className="w-[18px] h-[18px] rounded border border-[#A67165] bg-[#A67165]/20 flex items-center justify-center text-[9px] text-[#A67165] font-black">✓</div>
          ) : (
            <div className="w-[18px] h-[18px] rounded border border-white/20 bg-transparent" />
          )}
        </div>
      )
    } else if (key === "start_login") {
      valueElement = (
        <div className="flex items-center justify-center">
          {startAtLogin ? (
            <div className="w-[18px] h-[18px] rounded border border-[#A67165] bg-[#A67165]/20 flex items-center justify-center text-[9px] text-[#A67165] font-black">✓</div>
          ) : (
            <div className="w-[18px] h-[18px] rounded border border-white/20 bg-transparent" />
          )}
        </div>
      )
    } else if (key === "default_action") {
      valueElement = (
        <div className="flex items-center gap-1.5 font-mono text-[10px] select-none">
          <span className="text-white/40 hover:text-white cursor-pointer px-1 text-xs" onClick={(e) => { e.stopPropagation(); handleDefaultModeChange(defaultExecutionMode === "close" ? "stealth" : "close"); }}>&lt;</span>
          <span className="font-bold text-white uppercase tracking-wider min-w-[64px] text-center">
            {defaultExecutionMode === "stealth" ? "Stealth" : "Close"}
          </span>
          <span className="text-white/40 hover:text-white cursor-pointer px-1 text-xs" onClick={(e) => { e.stopPropagation(); handleDefaultModeChange(defaultExecutionMode === "close" ? "stealth" : "close"); }}>&gt;</span>
        </div>
      )
    } else if (key === "global_shortcut") {
      valueElement = (
        <span className="font-mono text-[10px] text-[#A67165] bg-[#A67165]/10 border border-[#A67165]/20 px-2 py-0.5 rounded">
          {globalShortcut || "EMPTY"}
        </span>
      )
    } else if (key === "restore_windows") {
      valueElement = (
        <span className="text-[9px] uppercase font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
          Action Required
        </span>
      )
    } else if (key === "factory_reset") {
      valueElement = (
        <span className="text-[9px] uppercase font-bold text-[#E11D48] bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
          Danger Action
        </span>
      )
    }

    return (
      <div
        key={key}
        onClick={() => {
          setSelectedSetting(key)
          if (isSelected) {
            // Toggle switch state on clicking an already selected item
            if (key === "dark_mode") setDarkMode(!darkMode)
            else if (key === "minimize_tray") handleMinimizeChange(!minimizeOnClose)
            else if (key === "show_toasts") handleToastsChange(!showToasts)
            else if (key === "start_login") handleToggleAutostart(!startAtLogin)
          }
        }}
        className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
          isSelected
            ? "border-[#A67165] bg-[#A67165]/10 text-white"
            : "border-white/10 bg-white/5 text-[#A69281] hover:bg-white/10 hover:text-[#F2D8C2]"
        }`}
      >
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
        {valueElement}
      </div>
    )
  }

  return (
    <div className="flex flex-col select-none text-[#F2D8C2] font-sans antialiased max-w-[900px] mx-auto p-2 animate-fade-up relative">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-[#A67165] text-white px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs shadow-lg animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Danger Zone / Feedback banner */}
      {dangerActionFeedback && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-amber-600 text-white px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs shadow-lg animate-fade-in">
          {dangerActionFeedback}
        </div>
      )}

      {/* Tab bar header */}
      <div className="flex items-center justify-center gap-3 border-b border-white/5 pb-2.5 mb-4 flex-wrap">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setSelectedSetting(tab.settings[0].key)
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all border-none cursor-pointer ${
                isActive
                  ? "bg-[#A67165] text-white shadow-[0_0_10px_rgba(166,113,101,0.4)]"
                  : "bg-transparent text-[#9B8179] hover:text-[#F2D8C2] hover:bg-white/5"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Main settings panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch min-h-[260px]">
        {/* Left Column (5 cols) */}
        <div className="md:col-span-6 space-y-2.5 flex flex-col justify-start">
          {activeTabObj?.settings.map(s => renderSettingRow(s.key, s.label))}
        </div>

        {/* Center line cursor (1 col) */}
        <div className="md:col-span-1 hidden md:flex items-center justify-center relative">
          <div className="w-[1px] h-full bg-white/5 relative flex justify-center items-center">
            <div className="absolute w-[3px] h-12 rounded bg-[#A67165] shadow-[0_0_6px_rgba(166,113,101,0.5)]" />
          </div>
        </div>

        {/* Right Column details (5 cols) */}
        <div className="md:col-span-5 flex flex-col justify-between bg-black/20 dark:bg-black/15 p-4 rounded-xl border border-white/5 relative">
          <div className="space-y-3">
            <h3 className="font-mono font-bold text-xs text-white tracking-widest uppercase border-b border-white/10 pb-1.5">
              {details.title}
            </h3>
            <div className="space-y-2 text-[10px] text-[#A69281] leading-relaxed font-semibold">
              {details.desc.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
            
            {/* Contextual actions inside the right inspector */}
            {selectedSetting === "global_shortcut" && (
              <div className="mt-4 p-3.5 border border-[#A67165]/20 bg-black/40 rounded-xl space-y-2">
                <div className="text-[9px] font-bold text-[#A67165] uppercase tracking-wider">Record Key Sequence:</div>
                <ShortcutInput value={globalShortcut} onChange={handleShortcutChange} />
              </div>
            )}
            
            {selectedSetting === "restore_windows" && (
              <button
                onClick={handleRestoreAllHidden}
                className="mt-4 w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase rounded-xl border-none cursor-pointer shadow-md transition-all text-[10px] tracking-wider font-mono"
              >
                Restore All Windows
              </button>
            )}

            {selectedSetting === "factory_reset" && (
              <button
                onClick={handleFactoryReset}
                className="mt-4 w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold uppercase rounded-xl border-none cursor-pointer shadow-md transition-all text-[10px] tracking-wider font-mono"
              >
                Reset All Settings
              </button>
            )}
          </div>

          {/* Visual footer details to complete retro-game UI feel */}
          <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-1 select-none pointer-events-none">
            <div className="flex justify-between text-[8px] font-bold tracking-widest text-[#9B8179]/60">
              <span>SYSTEM SIGNAL STRENGTH</span>
              <span>100%</span>
            </div>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-[#A67165] rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons footer footer */}
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
          className="px-4 py-2.5 rounded-xl border border-rose-900/30 hover:border-rose-900/60 bg-rose-950/10 hover:bg-rose-950/20 text-[#E11D48] hover:text-rose-400 font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>↻ RESET TO DEFAULT</span>
        </button>
      </div>
    </div>
  )
}
