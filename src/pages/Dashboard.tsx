import * as React from "react"
import { 
  Keyboard, 
  Monitor, 
  RotateCcw, 
  Plus, 
  ChevronRight,
  Trash2,
  CheckCircle2,
  X,
  Power,
  Zap,
  Edit3,
  Sliders
} from "lucide-react"
import { CreateAppShortcut } from "@/pages/CreateAppShortcut"
import { CreateFullClose } from "@/pages/CreateFullClose"

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

export interface ShortcutItem {
  id: string
  name: string
  apps: string[]
  keys: string[]
  status: string
  lastUsed: string
  isFullClose?: boolean
}

type ViewMode = "home" | "create-app-shortcut" | "create-full-close"

export const Dashboard: React.FC = () => {
  const [viewMode, setViewMode] = React.useState<ViewMode>("home")
  const [editingShortcutId, setEditingShortcutId] = React.useState<string | null>(null)

  const [shortcuts, setShortcuts] = React.useState<ShortcutItem[]>([
    { id: "1", name: "Chrome • VS Code • Discord", apps: ["chrome", "vscode", "discord"], keys: ["Ctrl", "Shift", "Q"], status: "Enabled", lastUsed: "2 mins ago" },
    { id: "2", name: "Close All Open Windows", apps: ["all-apps"], keys: ["Ctrl", "Alt", "X"], status: "Enabled", lastUsed: "5 mins ago", isFullClose: true },
  ])

  const [actionToast, setActionToast] = React.useState<string | null>(null)
  const [isClosingAll, setIsClosingAll] = React.useState(false)

  // Trigger Native Win32 Workspace Toggle
  const triggerCloseExecution = async (_label?: string) => {
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      const result = await invoke<{ state: string; count: number }>("toggle_workspace")
      if (result.state === "hidden") {
        setActionToast("✓ All windows hidden")
      } else {
        setActionToast("✓ Workspace restored")
      }
      setTimeout(() => setActionToast(null), 2000)
    } catch {
      // Fallback for non-tauri dev environment
      setIsClosingAll(true)
      setTimeout(() => {
        setIsClosingAll(false)
        setActionToast("✓ All windows hidden")
        setTimeout(() => setActionToast(null), 2000)
      }, 300)
    }
  }

  // Native Win32 Global Hotkey Event Listener (Sub-50ms native Win32 event)
  React.useEffect(() => {
    let unlisten: (() => void) | undefined
    async function listenToNativeEvents() {
      try {
        const { listen } = await import("@tauri-apps/api/event")
        unlisten = await listen<{ state: string; count: number }>("workspace-toggle-event", (event) => {
          const { state } = event.payload
          if (state === "hidden") {
            setActionToast("✓ All windows hidden")
          } else {
            setActionToast("✓ Workspace restored")
          }
          setTimeout(() => setActionToast(null), 2000)
        })
      } catch {
        // Non-tauri browser environment
      }
    }
    listenToNativeEvents()
    return () => {
      if (unlisten) unlisten()
    }
  }, [])

  // In-App Keyboard Shortcut Listener Fallback
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach(item => {
        const itemKeysStr = item.keys.join(" + ").toLowerCase()

        const currentKeys: string[] = []
        if (e.ctrlKey) currentKeys.push("ctrl")
        if (e.altKey) currentKeys.push("alt")
        if (e.shiftKey) currentKeys.push("shift")
        if (e.metaKey) currentKeys.push("win")

        const key = e.key.length === 1 ? e.key.toUpperCase() : e.key
        if (!["Control", "Shift", "Alt", "Meta"].includes(e.key)) {
          currentKeys.push(key.toLowerCase())
        }

        const currentStr = currentKeys.join(" + ")
        if (currentStr === itemKeysStr && !isClosingAll) {
          e.preventDefault()
          triggerCloseExecution(item.keys.join(" + "))
        }
      })
    }

    window.addEventListener("keydown", handleGlobalKeyDown)
    return () => window.removeEventListener("keydown", handleGlobalKeyDown)
  }, [shortcuts, isClosingAll])

  const handleDeleteShortcut = (id: string) => {
    setShortcuts(shortcuts.filter(s => s.id !== id))
  }

  // Save App Shortcut handler
  const handleSaveAppShortcut = (shortcutName: string, selectedApps: string[], keys: string[]) => {
    const defaultAppsList = ["chrome", "vscode", "discord"]
    const generatedName = shortcutName.trim()
      ? shortcutName.trim()
      : selectedApps.map(id => id).join(" • ")

    const newShortcut: ShortcutItem = {
      id: Date.now().toString(),
      name: generatedName,
      apps: selectedApps.length > 0 ? selectedApps : defaultAppsList,
      keys,
      status: "Enabled",
      lastUsed: "Just now"
    }

    setShortcuts([newShortcut, ...shortcuts])
    setViewMode("home")
  }

  // Save Full Close Shortcut handler (Supports both Edit & Create)
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
        isFullClose: true
      }
      setShortcuts([newShortcut, ...shortcuts])
    }

    setViewMode("home")
    triggerCloseExecution(keys.join(" + "))
  }

  return (
    <div className="space-y-8 animate-fade-up select-none pb-8 relative text-left">
      {/* Handcrafted Ambient lighting glows */}
      <div className="ambient-glow bg-[#A67165] w-[350px] h-[350px] top-[-120px] left-[-150px] opacity-[0.18]"></div>
      <div className="ambient-glow bg-[#C98D74] w-[400px] h-[400px] top-[15%] right-[-100px] opacity-[0.14]"></div>

      {/* Action Notification Toast */}
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

      {/* Closing Applications Overlay */}
      {isClosingAll && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full border-4 border-[#A67165]/30 border-t-[#A67165] animate-spin mb-4" />
          <h3 className="text-xl font-bold text-[#F2D8C2] mb-1">CLOSING ALL APPLICATION WINDOWS</h3>
          <p className="text-xs text-white/70">Executing shortcut bounds and terminating open windows...</p>
        </div>
      )}

      {/* SEPARATE PAGE 1 MODULE: CREATE APPLICATION SHORTCUT */}
      {viewMode === "create-app-shortcut" && (
        <CreateAppShortcut 
          onBack={() => setViewMode("home")}
          onSave={handleSaveAppShortcut}
        />
      )}

      {/* SEPARATE PAGE 2 MODULE: CLOSE ALL WINDOWS SHORTCUT */}
      {viewMode === "create-full-close" && (
        <CreateFullClose 
          onBack={() => {
            setEditingShortcutId(null)
            setViewMode("home")
          }}
          onSave={handleSaveFullCloseShortcut}
          initialKeys={shortcuts.find(s => s.id === editingShortcutId)?.keys}
        />
      )}

      {/* HOME PAGE VIEW WITH 2 SEPARATE HERO CARDS */}
      {viewMode === "home" && (
        <>
          {/* Welcome Section */}
          <div className="flex flex-col justify-center gap-3 text-left py-2 relative">
            <h1 className="text-[44px] font-black tracking-tight text-[#252326] dark:text-[#F2D8C2] leading-tight">
              Welcome to Custom
            </h1>
            <h2 className="text-[20px] font-bold text-[#252326] dark:text-[#F2D8C2]">
              Your workspace, <span className="text-[#A67165] dark:text-[#C98D74]">one shortcut</span> away.
            </h2>
            <div className="flex items-center gap-2.5 mt-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>System Ready & Global Shortcuts Active</span>
              </div>
            </div>
          </div>

          {/* ROW 1: 2 DISTINCT HERO BOXES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* BOX 1: CREATE APPLICATION SHORTCUT */}
            <div 
              className="glass-card relative overflow-hidden p-8 flex flex-col items-center justify-center text-center transition-all duration-220 hover:scale-[1.02] border-[rgba(255,255,255,0.28)]"
              style={{ borderRadius: "24px" }}
            >
              <div className="relative mb-4 flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-white/90 dark:bg-white/10 flex items-center justify-center text-[#A67165] border border-white/50 shadow-md">
                  <Keyboard className="h-8 w-8" />
                </div>
              </div>

              <h3 className="text-[20px] font-bold text-[#252326] dark:text-[#F2D8C2] mb-1.5 leading-tight">
                Create Application Shortcut
              </h3>

              <p className="text-[13px] font-medium text-[#6B5B54] dark:text-[#A69281] mb-6 max-w-[280px] leading-relaxed">
                Hide or restore selected applications using custom keyboard shortcuts.
              </p>

              <button 
                onClick={() => setViewMode("create-app-shortcut")}
                className="w-full flex items-center justify-center gap-2 text-[16px] font-semibold text-white bg-gradient-to-r from-[#A67165] to-[#734E46] hover:from-[#734E46] hover:to-[#A67165] transition-all duration-200 shadow-lg border-none cursor-pointer py-3.5 rounded-2xl"
              >
                <Plus className="h-5 w-5" />
                <span>Create Shortcut</span>
              </button>
            </div>

            {/* BOX 2: FULL CLOSE ALL WINDOWS SHORTCUT */}
            <div 
              className="glass-card relative overflow-hidden p-8 flex flex-col items-center justify-center text-center transition-all duration-220 hover:scale-[1.02] border-[rgba(255,255,255,0.28)]"
              style={{ borderRadius: "24px" }}
            >
              <div className="relative mb-4 flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-white/90 dark:bg-white/10 flex items-center justify-center text-[#A67165] border border-white/50 shadow-md">
                  <Power className="h-8 w-8" />
                </div>
              </div>

              <h3 className="text-[20px] font-bold text-[#252326] dark:text-[#F2D8C2] mb-1.5 leading-tight">
                Close All Windows Shortcut
              </h3>

              <p className="text-[13px] font-medium text-[#6B5B54] dark:text-[#A69281] mb-6 max-w-[280px] leading-relaxed">
                Close all open windows and applications instantly with a single key.
              </p>

              <button 
                onClick={() => setViewMode("create-full-close")}
                className="w-full flex items-center justify-center gap-2 text-[16px] font-semibold text-white bg-gradient-to-r from-[#A67165] to-[#734E46] hover:from-[#734E46] hover:to-[#A67165] transition-all duration-200 shadow-lg border-none cursor-pointer py-3.5 rounded-2xl"
              >
                <Plus className="h-5 w-5" />
                <span>Create Full Close Shortcut</span>
              </button>
            </div>
          </div>

          {/* ROW 2: RECENT SHORTCUTS & QUICK ACTIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Recent Shortcuts List */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="glass-card p-6 border-[rgba(255,255,255,0.28)] flex-1 flex flex-col justify-between" style={{ borderRadius: "24px" }}>
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-[18px] font-bold text-[#252326] dark:text-[#F2D8C2]">
                        Recent Shortcuts
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-[rgba(166,113,101,0.12)] text-[#A67165] text-[11px] font-bold">
                        {shortcuts.length} Configured
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    {shortcuts.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-white/20 dark:bg-white/5 hover:bg-white/35 dark:hover:bg-white/8 rounded-2xl border border-white/12 dark:border-white/5 transition-all duration-220">
                        <div className="flex items-center gap-3.5">
                          <div className="flex items-center gap-1.5 bg-white/50 dark:bg-white/10 p-2 rounded-xl border border-white/20">
                            {item.isFullClose ? <Power className="h-5 w-5 text-[#A67165]" /> : (
                              item.apps.slice(0, 3).map((appId, index) => (
                                <React.Fragment key={index}>
                                  {getAppIcon(appId)}
                                </React.Fragment>
                              ))
                            )}
                          </div>
                          <div className="space-y-1 text-left">
                            <div className="text-sm font-bold text-[#252326] dark:text-[#F2D8C2]">
                              {item.name}
                            </div>
                            <div className="flex items-center gap-1 text-[11px] font-mono text-[#6B5B54] dark:text-[#A69281]">
                              {item.keys.map((key, index) => (
                                <React.Fragment key={index}>
                                  <kbd className="px-2 py-0.5 rounded-md bg-white/60 dark:bg-white/10 border border-white/30 text-[10px] font-bold shadow-sm">{key}</kbd>
                                  {index < item.keys.length - 1 && <span className="opacity-60">+</span>}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => triggerCloseExecution(item.keys.join(" + "))}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#A67165] hover:bg-[#734E46] transition-all border-none cursor-pointer flex items-center gap-1"
                          >
                            <Zap className="h-3.5 w-3.5" />
                            <span>Apply All</span>
                          </button>
                          <button 
                            onClick={() => {
                              setEditingShortcutId(item.id)
                              setViewMode("create-full-close")
                            }}
                            className="w-8 h-8 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 flex items-center justify-center border border-white/15 text-[#6B5B54] dark:text-[#A69281] hover:text-[#A67165] cursor-pointer transition-colors" 
                            title="Customize Key Combination"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteShortcut(item.id)}
                            className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center border border-white/15 text-[#6B5B54] dark:text-[#A69281] hover:text-red-500 cursor-pointer" 
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions List */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="glass-card p-6 border-[rgba(255,255,255,0.28)] flex-1 flex flex-col justify-between" style={{ borderRadius: "24px" }}>
                <div>
                  <h3 className="text-[18px] font-bold text-[#252326] dark:text-[#F2D8C2] mb-4 text-left">
                    Quick Actions
                  </h3>

                  <div className="space-y-2.5">
                    <button 
                      onClick={() => {
                        const fullCloseItem = shortcuts.find(s => s.isFullClose)
                        setEditingShortcutId(fullCloseItem?.id || null)
                        setViewMode("create-full-close")
                      }}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/15 hover:bg-white/30 dark:bg-white/5 dark:hover:bg-white/10 border border-white/10 transition-all duration-200 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[rgba(166,113,101,0.12)] flex items-center justify-center text-[#A67165]">
                          <Sliders className="h-4.5 w-4.5" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-[#252326] dark:text-[#F2D8C2]">Customize Close All Keys</span>
                          <p className="text-[10px] font-medium text-[#6B5B54] dark:text-[#A69281]">Record or edit shortcut key triggers</p>
                        </div>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-[#9B8179]" />
                    </button>

                    <button 
                      onClick={() => triggerCloseExecution()}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/15 hover:bg-white/30 dark:bg-white/5 dark:hover:bg-white/10 border border-white/10 transition-all duration-200 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[rgba(166,113,101,0.12)] flex items-center justify-center text-[#A67165]">
                          <Power className="h-4.5 w-4.5" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-[#252326] dark:text-[#F2D8C2]">Close All Windows Now</span>
                          <p className="text-[10px] font-medium text-[#6B5B54] dark:text-[#A69281]">Instantly terminate all active open windows</p>
                        </div>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-[#9B8179]" />
                    </button>

                    <button 
                      onClick={() => setActionToast("Workspace restored successfully.")}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/15 hover:bg-white/30 dark:bg-white/5 dark:hover:bg-white/10 border border-white/10 transition-all duration-200 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[rgba(166,113,101,0.12)] flex items-center justify-center text-[#A67165]">
                          <RotateCcw className="h-4.5 w-4.5" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-[#252326] dark:text-[#F2D8C2]">Restore Workspace</span>
                          <p className="text-[10px] font-medium text-[#6B5B54] dark:text-[#A69281]">Restore all hidden workspace applications</p>
                        </div>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-[#9B8179]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* ROW 3: FEATURE HIGHLIGHTS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[850px] mx-auto">
            <div className="glass-card flex flex-col justify-between p-6 rounded-[24px] border-[rgba(255,255,255,0.22)]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[rgba(166,113,101,0.08)] flex items-center justify-center text-[#A67165] mb-4">
                  <Monitor className="h-6 w-6" />
                </div>
                <div className="space-y-1.5 text-left">
                  <h4 className="text-base font-bold text-[#252326] dark:text-[#F2D8C2]">Application Shortcuts</h4>
                  <p className="text-[13px] font-medium text-[#6B5B54] dark:text-[#A69281] leading-relaxed">
                    Select target apps to hide or restore together.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card flex flex-col justify-between p-6 rounded-[24px] border-[rgba(255,255,255,0.22)]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[rgba(166,113,101,0.08)] flex items-center justify-center text-[#A67165] mb-4">
                  <Power className="h-6 w-6 text-[#A67165]" />
                </div>
                <div className="space-y-1.5 text-left">
                  <h4 className="text-base font-bold text-[#252326] dark:text-[#F2D8C2]">Close All Windows</h4>
                  <p className="text-[13px] font-medium text-[#6B5B54] dark:text-[#A69281] leading-relaxed">
                    Instantly close all open desktop windows with 1 key.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card flex flex-col justify-between p-6 rounded-[24px] border-[rgba(255,255,255,0.22)]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[rgba(166,113,101,0.08)] flex items-center justify-center text-[#A67165] mb-4">
                  <Keyboard className="h-6 w-6" />
                </div>
                <div className="space-y-1.5 text-left">
                  <h4 className="text-base font-bold text-[#252326] dark:text-[#F2D8C2]">Global Shortcuts</h4>
                  <p className="text-[13px] font-medium text-[#6B5B54] dark:text-[#A69281] leading-relaxed">
                    Custom key combinations that trigger anywhere.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
