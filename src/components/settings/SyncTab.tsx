import * as React from "react"
import { Cloud, CloudLightning, RefreshCw, LogIn, LogOut, CheckCircle, Database } from "lucide-react"

export const SyncTab: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(() => {
    return localStorage.getItem("sync_logged_in") === "true"
  })

  const [autoSync, setAutoSync] = React.useState(() => {
    return localStorage.getItem("sync_auto") !== "false"
  })

  const [syncShortcuts, setSyncShortcuts] = React.useState(() => {
    return localStorage.getItem("sync_shortcuts") !== "false"
  })

  const [syncProfiles, setSyncProfiles] = React.useState(() => {
    return localStorage.getItem("sync_profiles") !== "false"
  })

  const [conflictMode, setConflictMode] = React.useState(() => {
    return localStorage.getItem("sync_conflict_resolution") || "ask"
  })

  const [syncing, setSyncing] = React.useState(false)
  const [lastSynced, setLastSynced] = React.useState(() => {
    return localStorage.getItem("sync_last_timestamp") || "2026-07-22 17:42"
  })

  React.useEffect(() => {
    localStorage.setItem("sync_logged_in", String(isLoggedIn))
    localStorage.setItem("sync_auto", String(autoSync))
    localStorage.setItem("sync_shortcuts", String(syncShortcuts))
    localStorage.setItem("sync_profiles", String(syncProfiles))
    localStorage.setItem("sync_conflict_resolution", conflictMode)
    localStorage.setItem("sync_last_timestamp", lastSynced)
  }, [isLoggedIn, autoSync, syncShortcuts, syncProfiles, conflictMode, lastSynced])

  const handleManualSync = () => {
    if (!isLoggedIn) {
      alert("Please login to activate cloud sync services.")
      return
    }
    setSyncing(true)
    setTimeout(() => {
      const now = new Date().toLocaleString()
      setLastSynced(now)
      localStorage.setItem("sync_last_timestamp", now)
      setSyncing(false)
    }, 2000)
  }

  const handleAuthAction = () => {
    if (isLoggedIn) {
      if (window.confirm("Logout of your Custun Cloud sync profile?")) {
        setIsLoggedIn(false)
      }
    } else {
      const email = prompt("Enter your Custun Cloud email:", "sync@custun.app")
      if (email) {
        setIsLoggedIn(true)
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* 2-Column Split */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* Left Column Profile Login & Sync configs (7 cols) */}
        <div className="md:col-span-7 space-y-4 flex flex-col justify-between">
          {/* Cloud Account Card */}
          <div className="p-4 rounded-xl border border-white/5 bg-black/10 dark:bg-black/25 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                {isLoggedIn ? (
                  <Cloud className="w-5 h-5 text-[#A67165]" />
                ) : (
                  <CloudLightning className="w-5 h-5 text-[#9B8179] opacity-40" />
                )}
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-white uppercase tracking-wide">
                  {isLoggedIn ? "Cloud Synchronizer Profile" : "Cloud Account Offline"}
                </span>
                <p className="text-[9px] text-[#9B8179] font-mono mt-0.5">
                  {isLoggedIn ? "sync@custun.app • Connected" : "Create or log in to sync triggers"}
                </p>
              </div>
            </div>

            <button
              onClick={handleAuthAction}
              className={`px-3 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                isLoggedIn
                  ? "border-rose-900/30 hover:border-rose-900/60 bg-rose-950/10 hover:bg-rose-950/20 text-rose-500"
                  : "border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white"
              }`}
            >
              {isLoggedIn ? (
                <>
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </>
              )}
            </button>
          </div>

          {/* Sync Toggles */}
          <div className="p-4 rounded-xl border border-white/5 bg-black/10 dark:bg-black/25 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-white">Synchronization Preferences</label>

            {/* Auto sync */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="text-left">
                <span className="text-xs font-bold text-[#F2D8C2] uppercase">Automatic background sync</span>
                <p className="text-[9px] text-[#9B8179] font-semibold mt-0.5">Quietly syncs local edits with your cloud profile.</p>
              </div>
              <div
                onClick={() => setAutoSync(!autoSync)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  autoSync ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${autoSync ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>

            {/* Sync Shortcuts */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="text-left">
                <span className="text-xs font-bold text-[#F2D8C2] uppercase">Sync Shortcut Bindings</span>
                <p className="text-[9px] text-[#9B8179] font-semibold mt-0.5">Propagates captured hotkey configurations to other clients.</p>
              </div>
              <div
                onClick={() => setSyncShortcuts(!syncShortcuts)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  syncShortcuts ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${syncShortcuts ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>

            {/* Sync Profiles */}
            <div className="flex items-center justify-between">
              <div className="text-left">
                <span className="text-xs font-bold text-[#F2D8C2] uppercase">Sync Workspace Profiles</span>
                <p className="text-[9px] text-[#9B8179] font-semibold mt-0.5">Propagates layout environments and workspace targets.</p>
              </div>
              <div
                onClick={() => setSyncProfiles(!syncProfiles)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  syncProfiles ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${syncProfiles ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Sync Status & Action (5 cols) */}
        <div className="md:col-span-5 bg-black/35 p-5 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#9B8179]">Sync Status Tracker</span>
            <RefreshCw className={`w-3.5 h-3.5 text-[#A67165] ${syncing ? "animate-spin" : ""}`} />
          </div>

          <div className="space-y-3.5 text-left font-mono">
            {/* Sync connection status */}
            <div>
              <span className="text-[9px] text-[#9B8179] font-bold uppercase">Socket Connection:</span>
              <div className="text-xs font-bold uppercase mt-0.5 flex items-center gap-1.5">
                {isLoggedIn ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-emerald-500">Synced & Protected</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9B8179]/40" />
                    <span className="text-[#9B8179]/60">Offline Backup Mode</span>
                  </>
                )}
              </div>
            </div>

            {/* Last synced timestamp */}
            <div>
              <span className="text-[9px] text-[#9B8179] font-bold uppercase">Last Synchronization:</span>
              <div className="text-xs font-bold text-white mt-0.5">{isLoggedIn ? lastSynced : "NEVER"}</div>
            </div>

            {/* Storage usage */}
            <div className="space-y-1 select-none pointer-events-none">
              <div className="flex justify-between text-[8px] font-bold tracking-widest text-[#9B8179]/60">
                <span>CLOUD DATA LIMITS</span>
                <span>4.2 KB / 100 KB</span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[4.2%] bg-[#A67165] rounded-full" />
              </div>
            </div>
          </div>

          <button
            onClick={handleManualSync}
            disabled={syncing || !isLoggedIn}
            className={`w-full py-3 bg-[#A67165] hover:bg-[#734E46] text-white font-bold uppercase rounded-xl border-none cursor-pointer shadow-md transition-all text-xs tracking-wider font-mono ${
              syncing || !isLoggedIn ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {syncing ? "Synching profiles..." : "Force Sync Now"}
          </button>
        </div>
      </div>
    </div>
  )
}
