import * as React from "react"
import { 
  Zap, 
  Trash2, 
  CheckCircle2, 
  X, 
  Power, 
  Edit3, 
  EyeOff, 
  XCircle,
  Search,
  ShieldAlert
} from "lucide-react"
import { CreateAppShortcut } from "@/pages/CreateAppShortcut"
import { CreateFullClose } from "@/pages/CreateFullClose"
import { ShortcutItem } from "@/pages/Dashboard"

// Handcrafted SVG Icons for Application Logos
const ChromeIcon: React.FC = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#ECEFF1"/>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#F4B400"/>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 9.27364 20.9069 6.80236 19.1292 5L12 12V22Z" fill="#0F9D58"/>
    <path d="M12 2C9.40428 2 7.03923 2.98636 5.25012 4.6062L9.25012 11.5344L12 2Z" fill="#DB4437"/>
    <circle cx="12" cy="12" r="4.5" fill="#FFFFFF"/>
    <circle cx="12" cy="12" r="3.5" fill="#4285F4"/>
  </svg>
)

const VSCodeIcon: React.FC = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 18V6L9 2L22 7V17L9 22L2 18Z" fill="#007ACC" opacity="0.1" />
    <path d="M17.5 4.5L14 8L3.5 5.5V18.5L14 16L17.5 19.5L21 17.5V6.5L17.5 4.5Z" fill="#007ACC" />
    <path d="M17.5 4.5L3.5 16.5L1.5 15V9L3.5 7.5L17.5 19.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const DiscordIcon: React.FC = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="#5865F2" />
    <path d="M17.5 8.5C17.5 8.5 16.5 7.5 14.5 7.5L14.2 8C15.8 8.5 16.5 9.5 16.5 9.5C15.5 9 14.5 8.7 13.5 8.5C12.5 8.3 11.5 8.3 10.5 8.5C9.5 8.7 8.5 9 7.5 9.5C7.5 9.5 8.2 8.5 9.8 8L9.5 7.5C7.5 7.5 6.5 8.5 6.5 8.5C6.5 8.5 5.5 12 6.5 15.5C7.5 16.5 9 17 9 17L9.8 15.7C8.5 15.3 8 14.5 8 14.5C8.5 14.7 9 15 10 15.3C11 15.5 12 15.5 13 15.3C14 15 14.5 14.7 15 14.5C15 14.5 14.5 15.3 13.2 15.7L14 17C14 17 15.5 16.5 16.5 15.5C17.5 12 17.5 8.5 17.5 8.5Z" fill="white" />
    <circle cx="9.5" cy="12" r="0.8" fill="#5865F2" />
    <circle cx="13.5" cy="12" r="0.8" fill="#5865F2" />
  </svg>
)

const EdgeIcon: React.FC = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="url(#edgeGrad)" />
    <path d="M12 5C8.5 5 5.5 8 5.5 12C5.5 17 9.5 18 12.5 18C16.5 18 18.5 15 18.5 12C18.5 9 16.5 7 14.5 7C13 7 12 8 12 9.5C12 11 13.5 11.5 13.5 13C13.5 14.5 11.5 15.5 10 15.5C8.5 15.5 7 14.5 7 12.5C7 10.5 8.5 9 11.5 9V5Z" fill="white" />
    <defs>
      <linearGradient id="edgeGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0078D7" />
        <stop offset="0.5" stopColor="#00B7F3" />
        <stop offset="1" stopColor="#3FE085" />
      </linearGradient>
    </defs>
  </svg>
)

const SpotifyIcon: React.FC = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#1DB954" />
    <path d="M16.5 8.5C14.2 7.2 10.3 7 8 7.7C7.6 7.8 7.3 7.6 7.2 7.2C7.1 6.8 7.3 6.5 7.7 6.4C10.4 5.6 14.7 5.8 17.3 7.3C17.7 7.5 17.8 8 17.6 8.3C17.3 8.6 16.9 8.7 16.5 8.5ZM16.4 10.8C14.4 9.6 11.2 9.2 8.8 10C8.4 10.1 8 9.9 7.9 9.5C7.8 9.1 8 8.7 8.4 8.6C11.2 7.8 14.7 8.2 17 9.6C17.4 9.8 17.5 10.3 17.3 10.6C17.1 11 16.7 11.1 16.4 10.8ZM15.2 13C13.5 12 11.3 11.8 9 12.5C8.6 12.6 8.2 12.4 8.1 12C8 11.6 8.2 11.2 8.6 11.1C11.2 10.3 13.6 10.6 15.5 11.8C15.9 12 16 12.5 15.8 12.8C15.6 13.1 15.2 13.2 15.2 13Z" fill="white" />
  </svg>
)

const getAppIcon = (appId: string) => {
  switch (appId.toLowerCase()) {
    case "chrome": return <ChromeIcon />
    case "vscode": return <VSCodeIcon />
    case "discord": return <DiscordIcon />
    case "edge": return <EdgeIcon />
    case "spotify": return <SpotifyIcon />
    default:
      return (
        <div className="w-5 h-5 rounded bg-gradient-to-tr from-[#A67165] to-[#734E46] flex items-center justify-center text-[10px] font-black text-white uppercase">
          {appId.substring(0, 2)}
        </div>
      )
  }
}

const STORAGE_KEY = "custom_workspace_shortcuts"

const DEFAULT_SHORTCUTS: ShortcutItem[] = [
  { id: "1", name: "Chrome • VS Code • Discord", apps: ["chrome", "vscode", "discord"], keys: ["Ctrl", "Shift", "Q"], status: "Enabled", lastUsed: "2 mins ago", executionMode: "stealth" },
  { id: "2", name: "Close All Open Windows", apps: ["all-apps"], keys: ["Ctrl", "Alt", "X"], status: "Enabled", lastUsed: "5 mins ago", isFullClose: true },
]

type ViewMode = "list" | "create-app-shortcut" | "create-full-close"

export const TargetShortcuts: React.FC = () => {
  const [viewMode, setViewMode] = React.useState<ViewMode>("list")
  const [editingShortcutId, setEditingShortcutId] = React.useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<ShortcutItem | null>(null)
  const [actionToast, setActionToast] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  const [shortcuts, setShortcuts] = React.useState<ShortcutItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SHORTCUTS
  })

  // Read active customized system keys from localStorage
  const activeCustomSystemKeys = React.useMemo(() => {
    try {
      const saved = localStorage.getItem("custon_all_key_shortcuts")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          return parsed.filter(s => s.status && s.customShortcut && s.customShortcut.trim().length > 0)
        }
      }
    } catch {
      // Ignore
    }
    return []
  }, [])

  // Save shortcuts to localStorage and update Win32 backend
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shortcuts))
      syncWithBackend(shortcuts)
    } catch {
      // Ignore
    }
  }, [shortcuts])

  const syncWithBackend = async (items: ShortcutItem[]) => {
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      await invoke("sync_target_shortcuts", { shortcutsJson: JSON.stringify(items) })
    } catch {
      // Non-tauri browser environment
    }
  }

  // Trigger Target Shortcut
  const triggerShortcutExecution = async (item: ShortcutItem) => {
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      if (item.isFullClose) {
        await invoke("hide_workspace_windows")
        setActionToast("✓ Master Close Triggered: All open windows hidden!")
      } else {
        const result = await invoke<{ state: string; count: number }>("execute_shortcut_action", {
          shortcutId: item.id,
          apps: item.apps,
          mode: item.executionMode || "stealth"
        })
        if (item.executionMode === "close") {
          setActionToast(`✓ Terminated target app windows (${item.name})`)
        } else if (result.state === "hidden") {
          setActionToast(`✓ Hidden target app windows (${item.name})`)
        } else {
          setActionToast(`✓ Restored target app windows (${item.name})`)
        }
      }
      setTimeout(() => setActionToast(null), 2500)
    } catch {
      setActionToast(`✓ Target shortcut triggered (${item.name})`)
      setTimeout(() => setActionToast(null), 2500)
    }
  }

  const handleDeleteShortcut = (id: string) => {
    const item = shortcuts.find(s => s.id === id)
    if (item) setDeleteTarget(item)
  }

  const confirmDeleteShortcut = () => {
    if (deleteTarget) {
      setShortcuts(shortcuts.filter(s => s.id !== deleteTarget.id))
      setActionToast(`✓ Deleted shortcut (${deleteTarget.name})`)
      setTimeout(() => setActionToast(null), 2000)
      setDeleteTarget(null)
    }
  }

  // Save App Shortcut handler
  const handleSaveAppShortcut = (shortcutName: string, selectedApps: string[], keys: string[], mode?: string) => {
    const getFormattedAppName = (id: string) => {
      switch (id.toLowerCase()) {
        case "chrome": return "Chrome"
        case "vscode": return "VS Code"
        case "discord": return "Discord"
        case "edge": return "Edge"
        case "spotify": return "Spotify"
        case "notepad": return "Notepad"
        default:
          return id.split(/[-_\s]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
      }
    }

    const defaultAppsList = ["chrome", "vscode", "discord"]
    const appsToUse = selectedApps.length > 0 ? selectedApps : defaultAppsList
    const generatedName = shortcutName.trim()
      ? shortcutName.trim()
      : appsToUse.map(getFormattedAppName).join(" • ")

    if (editingShortcutId) {
      setShortcuts(shortcuts.map(s => s.id === editingShortcutId ? {
        ...s,
        name: generatedName,
        apps: appsToUse,
        keys,
        executionMode: (mode as "stealth" | "close") || "stealth",
        lastUsed: "Just now"
      } : s))
      setEditingShortcutId(null)
    } else {
      const newShortcut: ShortcutItem = {
        id: Date.now().toString(),
        name: generatedName,
        apps: appsToUse,
        keys,
        status: "Enabled",
        lastUsed: "Just now",
        executionMode: (mode as "stealth" | "close") || "stealth"
      }
      setShortcuts([newShortcut, ...shortcuts])
    }
    setViewMode("list")
  }

  // Save Full Close Shortcut handler
  const handleSaveFullCloseShortcut = (keys: string[]) => {
    if (editingShortcutId) {
      setShortcuts(shortcuts.map(s => s.id === editingShortcutId ? {
        ...s,
        keys,
        lastUsed: "Just now"
      } : s))
      setEditingShortcutId(null)
    } else {
      const newShortcut: ShortcutItem = {
        id: Date.now().toString(),
        name: "Close All Open Windows",
        apps: ["all-apps"],
        keys,
        status: "Enabled",
        lastUsed: "Just now",
        isFullClose: true,
        executionMode: "stealth"
      }
      setShortcuts([newShortcut, ...shortcuts])
    }
    setViewMode("list")
  }

  const filteredShortcuts = shortcuts.filter(s => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return s.name.toLowerCase().includes(q) || s.keys.join(" ").toLowerCase().includes(q)
  })

  // SUB-VIEW 1: CREATE APP SHORTCUT
  if (viewMode === "create-app-shortcut") {
    const initialItem = editingShortcutId ? shortcuts.find(s => s.id === editingShortcutId) : undefined
    return (
      <CreateAppShortcut
        onBack={() => {
          setViewMode("list")
          setEditingShortcutId(null)
        }}
        onSave={handleSaveAppShortcut}
        initialShortcut={initialItem ? {
          name: initialItem.name,
          apps: initialItem.apps,
          keys: initialItem.keys,
          executionMode: initialItem.executionMode
        } : undefined}
      />
    )
  }

  // SUB-VIEW 2: CREATE FULL CLOSE SHORTCUT
  if (viewMode === "create-full-close") {
    const initialItem = editingShortcutId ? shortcuts.find(s => s.id === editingShortcutId) : undefined
    return (
      <CreateFullClose
        onBack={() => {
          setViewMode("list")
          setEditingShortcutId(null)
        }}
        onSave={handleSaveFullCloseShortcut}
        initialKeys={initialItem?.keys}
      />
    )
  }

  // MAIN LIST VIEW
  return (
    <div className="space-y-8 animate-fade-up select-none pb-20 relative text-left">
      {/* Ambient Glow */}
      <div className="ambient-glow bg-[#A67165] w-[350px] h-[350px] top-[-120px] left-[-150px] opacity-[0.18]"></div>

      {/* Toast Notification */}
      {actionToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#252326] text-[#F2D8C2] border border-[#A67165] p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-up max-w-[420px]">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold leading-relaxed flex-1">{actionToast}</p>
          <button onClick={() => setActionToast(null)} className="text-white/50 hover:text-white border-none bg-transparent cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-card p-6 rounded-2xl max-w-md w-full border border-red-500/30 bg-[#1E1B1A] space-y-4 text-left">
            <div className="flex items-center gap-3 text-red-400">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-white">Delete Target Shortcut?</h3>
            </div>
            <p className="text-xs text-[#A69281] leading-relaxed">
              Are you sure you want to delete <strong className="text-white font-semibold">{deleteTarget.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button 
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteShortcut}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-all border-none cursor-pointer shadow-md"
              >
                Delete Shortcut
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="text-[26px] font-black text-[#252326] dark:text-[#F2D8C2] flex items-center gap-2.5">
            <Zap className="w-7 h-7 text-[#A67165]" />
            <span>Active Shortcuts Manager</span>
          </h1>
          <p className="text-xs font-semibold text-[#6B5B54] dark:text-[#A69281] max-w-[650px] leading-relaxed mt-1">
            Overview of all active custom shortcuts created across target applications, master close triggers, and customized Windows hotkeys.
          </p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="glass-card p-4 rounded-2xl border-[rgba(255,255,255,0.2)] flex items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#A67165]" />
          <input 
            type="text"
            placeholder="Search target shortcuts by name or hotkey..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/50 border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#A67165] transition-colors font-medium"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white border-none bg-transparent cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* TARGET SHORTCUTS CARDS LIST */}
      <div className="glass-card p-6 border-[rgba(255,255,255,0.28)]" style={{ borderRadius: "24px" }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <h3 className="text-[18px] font-bold text-[#252326] dark:text-[#F2D8C2]">
              Active Target Shortcuts
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[rgba(166,113,101,0.12)] text-[#A67165] text-[11px] font-bold">
              {shortcuts.length} Active
            </span>
          </div>
        </div>

        {filteredShortcuts.length === 0 ? (
          <div className="p-12 text-center text-[#A69281] rounded-2xl bg-black/20 border border-white/10">
            No target shortcuts found matching query.
          </div>
        ) : (
          <div className="space-y-5">
            {filteredShortcuts.map((item) => (
              <div 
                key={item.id} 
                className="p-6 rounded-[24px] bg-white/5 hover:bg-white/[0.08] border border-white/12 hover:border-[#A67165]/40 transition-all duration-200 space-y-4 shadow-lg text-left"
              >
                {/* TOP ROW: ICONS, TITLE, ACTION BUTTONS */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {/* App Icon Container */}
                    <div className="p-3 rounded-2xl bg-black/40 border border-white/15 shadow-inner flex items-center gap-2.5 shrink-0">
                      {item.isFullClose ? (
                        <Power className="h-6 w-6 text-[#A67165]" />
                      ) : (
                        item.apps.slice(0, 4).map((appId, index) => (
                          <React.Fragment key={index}>
                            {getAppIcon(appId)}
                          </React.Fragment>
                        ))
                      )}
                    </div>

                    {/* Title & Info */}
                    <div className="min-w-0 text-left">
                      <h4 className="text-base sm:text-lg font-bold text-white truncate leading-tight" title={item.name}>
                        {item.name}
                      </h4>
                      <span className="text-xs font-semibold text-[#A69281] block mt-0.5">
                        {item.isFullClose ? "Master Windows Action" : `${item.apps.length} Target Application${item.apps.length > 1 ? "s" : ""}`}
                      </span>
                    </div>
                  </div>

                  {/* Right Action Buttons */}
                  <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                    <button 
                      type="button"
                      onClick={() => triggerShortcutExecution(item)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#A67165] to-[#734E46] hover:from-[#734E46] hover:to-[#A67165] transition-all shadow-md border-none cursor-pointer flex items-center gap-2"
                      title="Trigger shortcut execution now"
                    >
                      <Zap className="h-4 w-4" />
                      <span>Trigger</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setEditingShortcutId(item.id)
                        if (item.isFullClose) {
                          setViewMode("create-full-close")
                        } else {
                          setViewMode("create-app-shortcut")
                        }
                      }}
                      className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/15 flex items-center justify-center border border-white/15 text-[#A69281] hover:text-white cursor-pointer transition-colors" 
                      title="Edit Shortcut"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleDeleteShortcut(item.id)}
                      className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/20 flex items-center justify-center border border-white/15 text-[#A69281] hover:text-red-400 cursor-pointer transition-colors" 
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* BOTTOM ROW: KEYS & MODE BADGE */}
                <div className="flex items-center gap-3 pt-3.5 border-t border-white/10 flex-wrap">
                  <span className="text-xs font-bold text-[#A69281]">Shortcut Keys:</span>
                  <div className="inline-flex items-center gap-1.5 font-mono text-xs text-white bg-black/50 px-3 py-1.5 rounded-xl border border-white/15 shadow-inner">
                    {item.keys.map((key, index) => (
                      <React.Fragment key={index}>
                        <kbd className="px-2 py-0.5 rounded-md bg-white/15 border border-white/20 text-xs font-bold text-white shadow-sm">
                          {key}
                        </kbd>
                        {index < item.keys.length - 1 && <span className="opacity-50 text-xs font-mono">+</span>}
                      </React.Fragment>
                    ))}
                  </div>

                  {item.executionMode === "close" ? (
                    <span className="px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5 text-rose-400" /> Force Close Mode
                    </span>
                  ) : !item.isFullClose && (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                      <EyeOff className="w-3.5 h-3.5 text-emerald-400" /> Stealth Toggle Mode
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACTIVE CUSTOMIZED WINDOWS HOTKEYS SECTION */}
      {activeCustomSystemKeys.length > 0 && (
        <div className="glass-card p-6 border-[rgba(255,255,255,0.28)] text-left" style={{ borderRadius: "24px" }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <h3 className="text-[18px] font-bold text-[#252326] dark:text-[#F2D8C2]">
                Active Customized Windows Hotkeys
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[rgba(166,113,101,0.12)] text-[#A67165] text-[11px] font-bold">
                {activeCustomSystemKeys.length} Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeCustomSystemKeys.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-white/5 border border-white/12 flex items-center justify-between gap-3 text-left">
                <div>
                  <h5 className="text-sm font-bold text-white">{item.action}</h5>
                  <span className="text-[10px] font-semibold text-[#A69281] uppercase block mt-0.5">{item.category}</span>
                </div>
                <kbd className="px-2.5 py-1 rounded-xl bg-[#A67165]/20 border border-[#A67165]/40 font-mono text-xs font-bold text-[#F2D8C2] shrink-0">
                  {item.customShortcut}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
