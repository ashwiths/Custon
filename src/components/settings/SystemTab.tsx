import * as React from "react"
import { RefreshCw, Trash2, HelpCircle } from "lucide-react"

interface SystemTabProps {
  setDarkMode: (dark: boolean) => void
}

export const SystemTab: React.FC<SystemTabProps> = ({ setDarkMode }) => {
  const [feedback, setFeedback] = React.useState<string | null>(null)

  const handleRestoreAllHidden = async () => {
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      const count = await invoke<number>("restore_all_hidden")
      setFeedback(`✓ Restored ${count} hidden window(s) successfully.`)
      setTimeout(() => setFeedback(null), 3000)
    } catch (e) {
      setFeedback("⚠ Restore failed (requires active Tauri environment).")
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  const handleFactoryReset = () => {
    if (window.confirm("Are you sure you want to delete all settings, hotkeys, and active target shortcuts? This action is permanent and cannot be undone.")) {
      localStorage.clear()
      try {
        import("@tauri-apps/api/core").then(async ({ invoke }) => {
          await invoke("set_autostart", { enable: false })
        }).catch(() => {})
      } catch {
        // Ignore
      }
      
      setDarkMode(true)
      setFeedback("✓ All settings and shortcuts have been factory reset.")
      setTimeout(() => {
        setFeedback(null)
        window.location.reload()
      }, 1500)
    }
  }

  return (
    <div className="space-y-5 text-left">
      {/* Action status notification */}
      {feedback && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-[#A67165] text-white px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs shadow-lg animate-fade-in border border-white/10">
          <span>{feedback}</span>
        </div>
      )}

      {/* Title block */}
      <div className="space-y-1">
        <label className="text-xs font-bold uppercase tracking-wider text-white">System Operations</label>
        <p className="text-[10px] text-[#9B8179] font-medium leading-relaxed">
          Manage core system behaviors, force-restore window parameters, or clean workspace databases.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Restore All Windows */}
        <div className="p-4 rounded-xl border border-white/5 bg-black/10 dark:bg-black/25 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-[#F2D8C2] uppercase">Restore Hidden Windows</span>
            <p className="text-[9px] text-[#9B8179] font-semibold">Force-rescue all application windows hidden by the background trigger engine.</p>
          </div>
          <button
            onClick={handleRestoreAllHidden}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase rounded-lg border-none cursor-pointer text-[10px] tracking-wider font-mono flex items-center gap-1.5 transition-all shadow-md shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Restore Windows</span>
          </button>
        </div>

        {/* Factory Reset */}
        <div className="p-4 rounded-xl border border-white/5 bg-black/10 dark:bg-black/25 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-[#F2D8C2] uppercase">Factory Reset Application</span>
            <p className="text-[9px] text-[#9B8179] font-semibold">Wipe all stored shortcuts, configurations, theme selections, and boot rules.</p>
          </div>
          <button
            onClick={handleFactoryReset}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold uppercase rounded-lg border-none cursor-pointer text-[10px] tracking-wider font-mono flex items-center gap-1.5 transition-all shadow-md shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Settings</span>
          </button>
        </div>
      </div>

      <div className="text-[10px] text-[#9B8179] font-medium leading-relaxed bg-white/5 p-3.5 rounded-xl border border-white/5 flex gap-2">
        <HelpCircle className="w-4 h-4 text-[#A67165] shrink-0 mt-0.5" />
        <div>
          If any target application fails to reappear after triggering a hide shortcut, use the "Restore Windows" trigger to force its visibility parameters back to active display space. Factory resetting deletes settings instantly and restarts the application frame.
        </div>
      </div>
    </div>
  )
}
