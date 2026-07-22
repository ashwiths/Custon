import * as React from "react"
import { Radio, AlertCircle } from "lucide-react"

export const StartupTab: React.FC = () => {
  const [startAtLogin, setStartAtLogin] = React.useState(false)
  const [startMinimized, setStartMinimized] = React.useState(() => {
    return localStorage.getItem("startup_start_minimized") === "true"
  })
  
  const [minimizeOnClose, setMinimizeOnClose] = React.useState(() => {
    return localStorage.getItem("startup_minimize_on_close") !== "false"
  })

  const [closeBehavior, setCloseBehavior] = React.useState<"tray" | "exit">(() => {
    return (localStorage.getItem("startup_close_behavior") as any) || "tray"
  })

  const [runInBackground, setRunInBackground] = React.useState(() => {
    return localStorage.getItem("startup_run_background") !== "false"
  })

  const [silentStartup, setSilentStartup] = React.useState(() => {
    return localStorage.getItem("startup_silent") === "true"
  })

  const [showSplash, setShowSplash] = React.useState(() => {
    return localStorage.getItem("startup_show_splash") !== "false"
  })

  const [restoreSession, setRestoreSession] = React.useState(() => {
    return localStorage.getItem("startup_restore_session") !== "false"
  })

  const [checkUpdates, setCheckUpdates] = React.useState(() => {
    return localStorage.getItem("startup_check_updates") !== "false"
  })

  const [notificationPref, setNotificationPref] = React.useState(() => {
    return localStorage.getItem("startup_notification_pref") || "action"
  })

  // Load autostart from Tauri backend
  React.useEffect(() => {
    async function initAutostart() {
      try {
        const { invoke } = await import("@tauri-apps/api/core")
        const isEnabled = await invoke<boolean>("get_autostart_status")
        setStartAtLogin(isEnabled)
      } catch {
        // Fallback for non-tauri env
        setStartAtLogin(localStorage.getItem("startup_start_at_login") === "true")
      }
    }
    initAutostart()
  }, [])

  // Sync settings
  React.useEffect(() => {
    localStorage.setItem("startup_start_minimized", String(startMinimized))
    localStorage.setItem("startup_minimize_on_close", String(minimizeOnClose))
    localStorage.setItem("startup_close_behavior", closeBehavior)
    localStorage.setItem("startup_run_background", String(runInBackground))
    localStorage.setItem("startup_silent", String(silentStartup))
    localStorage.setItem("startup_show_splash", String(showSplash))
    localStorage.setItem("startup_restore_session", String(restoreSession))
    localStorage.setItem("startup_check_updates", String(checkUpdates))
    localStorage.setItem("startup_notification_pref", notificationPref)
  }, [startMinimized, minimizeOnClose, closeBehavior, runInBackground, silentStartup, showSplash, restoreSession, checkUpdates, notificationPref])

  const handleToggleAutostart = async (enable: boolean) => {
    setStartAtLogin(enable)
    localStorage.setItem("startup_start_at_login", String(enable))
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      await invoke("set_autostart", { enable })
    } catch {
      // Fallback
    }
  }

  return (
    <div className="space-y-4">
      {/* 2-Column Split */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Left Column Toggles (7 cols) */}
        <div className="md:col-span-7 space-y-3.5">
          {/* Main Boot Options */}
          <div className="p-4 rounded-xl border border-white/5 bg-black/10 dark:bg-black/25 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-white">System Boot Options</label>
            
            {/* Start on login */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="text-left">
                <span className="text-xs font-bold text-[#F2D8C2] uppercase">Launch on System Startup</span>
                <p className="text-[9px] text-[#9B8179] font-semibold mt-0.5">Automatically launch Custun when logging in.</p>
              </div>
              <div
                onClick={() => handleToggleAutostart(!startAtLogin)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  startAtLogin ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${startAtLogin ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>

            {/* Start Minimized */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="text-left">
                <span className="text-xs font-bold text-[#F2D8C2] uppercase">Start Minimized</span>
                <p className="text-[9px] text-[#9B8179] font-semibold mt-0.5">Launch application silently in the tray without showing window.</p>
              </div>
              <div
                onClick={() => setStartMinimized(!startMinimized)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  startMinimized ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${startMinimized ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>

            {/* Show Splash */}
            <div className="flex items-center justify-between">
              <div className="text-left">
                <span className="text-xs font-bold text-[#F2D8C2] uppercase">Show Splash Screen</span>
                <p className="text-[9px] text-[#9B8179] font-semibold mt-0.5">Display visual branding splash screen while engine loads.</p>
              </div>
              <div
                onClick={() => setShowSplash(!showSplash)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  showSplash ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${showSplash ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>
          </div>

          {/* Window Closure Behaviors */}
          <div className="p-4 rounded-xl border border-white/5 bg-black/10 dark:bg-black/25 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-white">Window Closure Behaviors</label>
            
            {/* Close action selector */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="text-left">
                <span className="text-xs font-bold text-[#F2D8C2] uppercase">Close Button Behavior</span>
                <p className="text-[9px] text-[#9B8179] font-semibold mt-0.5">Choose if clicking window exit closes application or hides to tray.</p>
              </div>
              <select
                value={closeBehavior}
                onChange={e => {
                  const val = e.target.value as "tray" | "exit"
                  setCloseBehavior(val)
                  setMinimizeOnClose(val === "tray")
                }}
                className="bg-black/40 border border-white/10 rounded-lg py-1 px-2.5 text-xs text-[#F2D8C2] font-semibold outline-none"
              >
                <option value="tray">Minimize to Tray</option>
                <option value="exit">Exit Application</option>
              </select>
            </div>

            {/* Run Background Execution */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="text-left">
                <span className="text-xs font-bold text-[#F2D8C2] uppercase">Background Execution</span>
                <p className="text-[9px] text-[#9B8179] font-semibold mt-0.5">Allow background thread process monitoring in window tray.</p>
              </div>
              <div
                onClick={() => setRunInBackground(!runInBackground)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  runInBackground ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${runInBackground ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>

            {/* Silent startup */}
            <div className="flex items-center justify-between">
              <div className="text-left">
                <span className="text-xs font-bold text-[#F2D8C2] uppercase">Silent Boot Mode</span>
                <p className="text-[9px] text-[#9B8179] font-semibold mt-0.5">Suppress confirmation toast notifications on system startup.</p>
              </div>
              <div
                onClick={() => setSilentStartup(!silentStartup)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  silentStartup ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${silentStartup ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>
          </div>

          {/* Sessions & Updates */}
          <div className="p-4 rounded-xl border border-white/5 bg-black/10 dark:bg-black/25 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-white">Sessions & Updates</label>
            
            {/* Restore Session */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="text-left">
                <span className="text-xs font-bold text-[#F2D8C2] uppercase">Restore previous session applications</span>
                <p className="text-[9px] text-[#9B8179] font-semibold mt-0.5">Keep track and restore previously hidden shortcuts on boot.</p>
              </div>
              <div
                onClick={() => setRestoreSession(!restoreSession)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  restoreSession ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${restoreSession ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>

            {/* Check Updates */}
            <div className="flex items-center justify-between">
              <div className="text-left">
                <span className="text-xs font-bold text-[#F2D8C2] uppercase">Check updates at startup</span>
                <p className="text-[9px] text-[#9B8179] font-semibold mt-0.5">Queries client updater database on system launch.</p>
              </div>
              <div
                onClick={() => setCheckUpdates(!checkUpdates)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  checkUpdates ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${checkUpdates ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Alerts & Preferences (5 cols) */}
        <div className="md:col-span-5 bg-black/35 p-5 rounded-2xl border border-white/5 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#9B8179]">System Alerts Preference</span>
            <Radio className="w-3.5 h-3.5 text-[#A67165] animate-pulse" />
          </div>

          {/* Dropdown config */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-[#9B8179] uppercase">Client Alerts Level:</span>
            <select
              value={notificationPref}
              onChange={e => setNotificationPref(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-xs text-[#F2D8C2] font-semibold outline-none"
            >
              <option value="all">Display All Toast Alerts</option>
              <option value="action">Shortcut Actions Alerts Only</option>
              <option value="critical">Critical System Errors Only</option>
              <option value="mute">Mute All UI Audio/Visual Alerts</option>
            </select>
          </div>

          <div className="text-[9px] text-[#9B8179] font-medium leading-relaxed bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-2 text-left">
            <div className="flex items-center gap-1.5 font-bold text-[#A67165] uppercase">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Background Alert</span>
            </div>
            <p>
              If "Minimize to System Tray" and "Background Execution" are disabled, closing this client will completely stop the trigger engine, which will immediately restore all hidden windows.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
