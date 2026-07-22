import * as React from "react"
import { 
  Keyboard, 
  Monitor, 
  Plus, 
  ChevronRight,
  Trash2,
  CheckCircle2,
  X,
  Power,
  Zap,
  Edit3,
  Sliders,
  AlertTriangle,
  EyeOff,
  XCircle
} from "lucide-react"
import { CreateAppShortcut } from "@/pages/CreateAppShortcut"
import { CreateFullClose } from "@/pages/CreateFullClose"
import { InteractiveDial } from "@/components/InteractiveDial"
import { animate, splitText, stagger } from "animejs"

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
  executionMode?: "stealth" | "close"
}

type ViewMode = "home" | "create-app-shortcut" | "create-full-close"
type AutostartState = "prompt" | "warning" | "enabled" | "hidden"

const STORAGE_KEY = "custom_workspace_shortcuts"

const DEFAULT_SHORTCUTS: ShortcutItem[] = [
  { id: "1", name: "Chrome • VS Code • Discord", apps: ["chrome", "vscode", "discord"], keys: ["Ctrl", "Shift", "Q"], status: "Enabled", lastUsed: "2 mins ago", executionMode: "stealth" },
  { id: "2", name: "Close All Open Windows", apps: ["all-apps"], keys: ["Ctrl", "Alt", "X"], status: "Enabled", lastUsed: "5 mins ago", isFullClose: true },
]

export const Dashboard: React.FC = () => {
  const [viewMode, setViewMode] = React.useState<ViewMode>("home")
  const [editingShortcutId, setEditingShortcutId] = React.useState<string | null>(null)
  
  const titleRef = React.useRef<HTMLHeadingElement>(null)

  React.useEffect(() => {
    if (viewMode === "home" && titleRef.current) {
      // Restore plain text content before running splitText
      titleRef.current.innerHTML = "Module imports"
      
      const split = splitText(titleRef.current)
      
      animate(split.words, {
        opacity: [0, 1],
        translateY: [12, 0],
        scale: [0.95, 1],
        delay: stagger(60),
        duration: 500,
        ease: "outQuad"
      })
      
      animate(".subtitle-text", {
        opacity: [0, 1],
        translateY: [8, 0],
        delay: 350,
        duration: 500,
        ease: "outQuad"
      })
    }
  }, [viewMode])

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

  const [actionToast, setActionToast] = React.useState<string | null>(null)
  const [isClosingAll, setIsClosingAll] = React.useState(false)
  const [autostartState, setAutostartState] = React.useState<AutostartState>("prompt")

  // Check autostart status and user preference
  React.useEffect(() => {
    async function checkAutostartPrompt() {
      const promptStatus = localStorage.getItem("autostart_permission_status")
      if (promptStatus === "denied") {
        setAutostartState("warning")
        return
      }
      if (promptStatus === "allowed") {
        setAutostartState("enabled")
        return
      }

      try {
        const { invoke } = await import("@tauri-apps/api/core")
        const isEnabled = await invoke<boolean>("get_autostart_status")
        if (isEnabled) {
          setAutostartState("enabled")
        } else {
          setAutostartState("prompt")
        }
      } catch {
        setAutostartState("prompt")
      }
    }
    checkAutostartPrompt()
  }, [])

  const handleEnableAutostart = async () => {
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      await invoke("set_autostart", { enable: true })
      setActionToast("✓ Custon will now run in background on boot!")
    } catch {
      // Fallback
    }
    setAutostartState("enabled")
    localStorage.setItem("autostart_permission_status", "allowed")
  }

  const handleDenyAutostart = async () => {
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      await invoke("set_autostart", { enable: false })
    } catch {
      // Fallback
    }
    setAutostartState("warning")
    localStorage.setItem("autostart_permission_status", "denied")
  }

  // const handleToggleTestAutostartBanner = () => {
  //   if (autostartState === "prompt") {
  //     handleDenyAutostart()
  //   } else {
  //     setAutostartState("prompt")
  //     localStorage.removeItem("autostart_permission_status")
  //   }
  // }

  // Save shortcuts to localStorage & sync hotkeys with Rust backend
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shortcuts))
    } catch {
      // Ignore
    }

    import("@tauri-apps/api/core").then(({ invoke }) => {
      invoke("sync_shortcuts", { shortcuts }).catch(() => {})
    }).catch(() => {})
  }, [shortcuts])

  // Trigger Target App Shortcut Execution
  const triggerShortcutExecution = async (item: ShortcutItem) => {
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      if (item.isFullClose || item.apps.includes("all-apps")) {
        const result = await invoke<{ state: string; count: number }>("toggle_workspace")
        if (result.state === "hidden") {
          setActionToast("✓ All open windows hidden")
        } else {
          setActionToast("✓ All windows restored")
        }
      } else {
        const result = await invoke<{ state: string; count: number; mode: string }>("toggle_target_shortcut", {
          shortcutId: item.id,
          targetApps: item.apps,
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
      // Fallback for non-tauri dev environment
      setIsClosingAll(true)
      setTimeout(() => {
        setIsClosingAll(false)
        setActionToast(`✓ Target shortcut triggered (${item.name})`)
        setTimeout(() => setActionToast(null), 2500)
      }, 300)
    }
  }

  // Native Win32 Global Hotkey Event Listener
  React.useEffect(() => {
    let unlistenShortcut: (() => void) | undefined
    let unlistenWorkspace: (() => void) | undefined

    async function listenToNativeEvents() {
      try {
        const { listen } = await import("@tauri-apps/api/event")

        unlistenShortcut = await listen<{ name?: string; state: string; count: number; mode?: string }>("shortcut-trigger-event", (event) => {
          const { name, state, mode } = event.payload
          const displayName = name || "Target Shortcut"
          if (mode === "close") {
            setActionToast(`✓ ${displayName}: Terminated target apps`)
          } else if (state === "hidden") {
            setActionToast(`✓ ${displayName}: Hidden target apps`)
          } else {
            setActionToast(`✓ ${displayName}: Restored target apps`)
          }
          setTimeout(() => setActionToast(null), 2500)
        })

        unlistenWorkspace = await listen<{ state: string; count: number }>("workspace-toggle-event", (event) => {
          const { state } = event.payload
          if (state === "hidden") {
            setActionToast("✓ Open windows hidden")
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
      if (unlistenShortcut) unlistenShortcut()
      if (unlistenWorkspace) unlistenWorkspace()
    }
  }, [])

  // In-App Keyboard Shortcut Listener Fallback for non-Tauri browser dev
  React.useEffect(() => {
    if (typeof window !== "undefined" && "__TAURI_INTERNALS__" in window) {
      return
    }

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
          triggerShortcutExecution(item)
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
  const handleSaveAppShortcut = (shortcutName: string, selectedApps: string[], keys: string[], mode?: string) => {
    const defaultAppsList = ["chrome", "vscode", "discord"]
    const generatedName = shortcutName.trim()
      ? shortcutName.trim()
      : selectedApps.map(id => id).join(" • ")

    if (editingShortcutId) {
      setShortcuts(shortcuts.map(s => s.id === editingShortcutId ? {
        ...s,
        name: generatedName,
        apps: selectedApps.length > 0 ? selectedApps : defaultAppsList,
        keys,
        executionMode: (mode as "stealth" | "close") || "stealth",
        lastUsed: "Just now"
      } : s))
      setEditingShortcutId(null)
    } else {
      const newShortcut: ShortcutItem = {
        id: Date.now().toString(),
        name: generatedName,
        apps: selectedApps.length > 0 ? selectedApps : defaultAppsList,
        keys,
        status: "Enabled",
        lastUsed: "Just now",
        executionMode: (mode as "stealth" | "close") || "stealth"
      }
      setShortcuts([newShortcut, ...shortcuts])
    }
    setViewMode("home")
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

    setViewMode("home")
  }

  return (
    <div className="space-y-8 animate-fade-up select-none pb-8 relative text-left">
      {/* Handcrafted Ambient lighting glows */}
      <div className="ambient-glow bg-[#A67165] w-[350px] h-[350px] top-[-120px] left-[-150px] opacity-[0.18]"></div>
      <div className="ambient-glow bg-[#C98D74] w-[400px] h-[400px] top-[15%] right-[-100px] opacity-[0.14]"></div>

      {/* Action Notification Toast */}
      {actionToast && localStorage.getItem("settings_show_toasts") !== "false" && (
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
          <h3 className="text-xl font-bold text-[#F2D8C2] mb-1">EXECUTING TARGET APP SHORTCUT</h3>
          <p className="text-xs text-white/70">Processing target app background hiding & shortcut bounds...</p>
        </div>
      )}

      {/* SEPARATE PAGE 1 MODULE: CREATE APPLICATION SHORTCUT */}
      {viewMode === "create-app-shortcut" && (
        <CreateAppShortcut 
          onBack={() => {
            setEditingShortcutId(null)
            setViewMode("home")
          }}
          onSave={handleSaveAppShortcut}
          initialShortcut={shortcuts.find(s => s.id === editingShortcutId)}
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
          {/* Prompt Banner */}
          {autostartState === "prompt" && (
            <div className="glass-card p-5 rounded-2xl border-[#A67165]/40 bg-gradient-to-r from-[#A67165]/15 to-[#734E46]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-up">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-bold text-[#252326] dark:text-[#F2D8C2]">
                  <Zap className="h-4 w-4 text-[#A67165]" />
                  <span>Start with Windows (Run in Background)</span>
                </div>
                <p className="text-xs font-semibold text-[#6B5B54] dark:text-[#A69281] max-w-[550px]">
                  Allow Custon to start automatically when your laptop boots up so your target app shortcuts work instantly in the background during exams.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button 
                  onClick={handleEnableAutostart}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#A67165] hover:bg-[#734E46] rounded-xl transition-all border-none cursor-pointer shadow-md"
                >
                  Allow Auto-Start
                </button>
                <button 
                  onClick={handleDenyAutostart}
                  className="px-3 py-2 text-xs font-semibold text-[#6B5B54] dark:text-[#A69281] hover:text-[#252326] dark:hover:text-[#F2D8C2] bg-transparent border-none cursor-pointer"
                >
                  Not Now
                </button>
              </div>
            </div>
          )}

          {/* Warning Banner when User Rejects Background Run */}
          {autostartState === "warning" && (
            <div className="glass-card p-5 rounded-2xl border-amber-500/50 bg-gradient-to-r from-amber-500/15 to-red-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-up">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-500">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span>⚠️ WARNING: Background Execution Disabled!</span>
                </div>
                <p className="text-xs font-semibold text-[#252326] dark:text-[#F2D8C2] max-w-[580px] leading-relaxed">
                  Because background auto-start was not allowed, your target app shortcuts will <strong>NOT WORK</strong> after restarting Windows until Custon is opened manually.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button 
                  onClick={handleEnableAutostart}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-[#A67165] hover:from-[#A67165] hover:to-amber-600 rounded-xl transition-all border-none cursor-pointer shadow-lg animate-pulse"
                >
                  Allow Background Execution Now
                </button>
              </div>
            </div>
          )}
          <div className="flex flex-col justify-center gap-3 text-left py-2 relative">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block">
              <InteractiveDial />
            </div>
            <h1 
              ref={titleRef}
              className="text-[44px] font-black tracking-tight text-[#252326] dark:text-[#F2D8C2] leading-tight pr-24"
            >
              Module imports
            </h1>
            <h2 className="text-[15px] font-semibold text-[#6B5B54] dark:text-[#A69281] opacity-0 subtitle-text max-w-[800px] leading-relaxed space-y-3 mt-2">
              <p>
                Anime.js has a very flexible modules-first API and excellent tree shaking support, making it one of the most lightweight JavaScript animation libraries.
              </p>
              <p>
                Anime.js modules can be imported straight from the main 'animejs' module, or more granularly from specific subpaths, either by using a bundler like Vite or esbuild, or natively without a build step using importmap.
              </p>
            </h2>
          </div>

          {/* ROW 1: 2 DISTINCT HERO BOXES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* BOX 1: FULL CLOSE ALL WINDOWS SHORTCUT */}
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
                Close all open windows and applications instantly with a single master key combination.
              </p>

              <button 
                onClick={() => setViewMode("create-full-close")}
                className="w-full flex items-center justify-center gap-2 text-[16px] font-semibold text-white bg-gradient-to-r from-[#A67165] to-[#734E46] hover:from-[#734E46] hover:to-[#A67165] transition-all duration-200 shadow-lg border-none cursor-pointer py-3.5 rounded-2xl"
              >
                <Plus className="h-5 w-5" />
                <span>Create Full Close Shortcut</span>
              </button>
            </div>

            {/* BOX 2: CREATE APPLICATION SHORTCUT */}
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
                Create Target App Shortcut
              </h3>

              <p className="text-[13px] font-medium text-[#6B5B54] dark:text-[#A69281] mb-6 max-w-[280px] leading-relaxed">
                Hide or close specific background target apps (Chrome, VS Code, AI) with custom hotkeys during exams.
              </p>

              <button 
                onClick={() => setViewMode("create-app-shortcut")}
                className="w-full flex items-center justify-center gap-2 text-[16px] font-semibold text-white bg-gradient-to-r from-[#A67165] to-[#734E46] hover:from-[#734E46] hover:to-[#A67165] transition-all duration-200 shadow-lg border-none cursor-pointer py-3.5 rounded-2xl"
              >
                <Plus className="h-5 w-5" />
                <span>Create Target App Shortcut</span>
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
                        Active Target Shortcuts
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-[rgba(166,113,101,0.12)] text-[#A67165] text-[11px] font-bold">
                        {shortcuts.length} Active
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    {shortcuts.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-white/20 dark:bg-white/5 hover:bg-white/35 dark:hover:bg-white/8 rounded-2xl border border-white/12 dark:border-white/5 transition-all duration-220 gap-4 min-w-0">
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 bg-white/50 dark:bg-white/10 p-2 rounded-xl border border-white/20 shrink-0">
                            {item.isFullClose ? <Power className="h-5 w-5 text-[#A67165]" /> : (
                              item.apps.slice(0, 3).map((appId, index) => (
                                <React.Fragment key={index}>
                                  {getAppIcon(appId)}
                                </React.Fragment>
                              ))
                            )}
                          </div>
                          <div className="space-y-1 text-left min-w-0 flex-1">
                            <span 
                              className="text-xs sm:text-sm font-bold text-[#252326] dark:text-[#F2D8C2] truncate max-w-[140px] sm:max-w-[200px] md:max-w-[260px] block"
                              title={item.name}
                            >
                              {item.name}
                            </span>
                            <div className="flex flex-wrap items-center gap-2 mt-1 min-w-0">
                              <div className="flex items-center gap-1 text-[11px] font-mono text-[#6B5B54] dark:text-[#A69281] shrink-0">
                                {item.keys.map((key, index) => (
                                  <React.Fragment key={index}>
                                    <kbd className="px-1.5 py-0.5 rounded-md bg-white/60 dark:bg-white/10 border border-white/30 text-[9px] font-bold shadow-sm">{key}</kbd>
                                    {index < item.keys.length - 1 && <span className="opacity-60">+</span>}
                                  </React.Fragment>
                                ))}
                              </div>
                              {item.executionMode === "close" ? (
                                <span className="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-500 text-[8px] font-bold flex items-center gap-0.5 shrink-0 border border-rose-500/10">
                                  <XCircle className="w-2.5 h-2.5" /> Force Close
                                </span>
                              ) : !item.isFullClose && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500 text-[8px] font-bold flex items-center gap-0.5 shrink-0 border border-emerald-500/10">
                                  <EyeOff className="w-2.5 h-2.5" /> Stealth Toggle
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                          <button 
                            onClick={() => triggerShortcutExecution(item)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#A67165] hover:bg-[#734E46] transition-all border-none cursor-pointer flex items-center gap-1 shadow-sm"
                            title="Trigger shortcut execution now"
                          >
                            <Zap className="h-3.5 w-3.5" />
                            <span>Trigger</span>
                          </button>
                          <button 
                            onClick={() => {
                              setEditingShortcutId(item.id)
                              if (item.isFullClose) {
                                setViewMode("create-full-close")
                              } else {
                                setViewMode("create-app-shortcut")
                              }
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
                      onClick={() => setViewMode("create-app-shortcut")}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/15 hover:bg-white/30 dark:bg-white/5 dark:hover:bg-white/10 border border-white/10 transition-all duration-200 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[rgba(166,113,101,0.12)] flex items-center justify-center text-[#A67165]">
                          <Keyboard className="h-4.5 w-4.5" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-[#252326] dark:text-[#F2D8C2]">Add Target Application Shortcut</span>
                          <p className="text-[10px] font-medium text-[#6B5B54] dark:text-[#A69281]">Target specific apps (Chrome, AI tools, etc.)</p>
                        </div>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-[#9B8179]" />
                    </button>

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
                          <span className="text-xs font-bold text-[#252326] dark:text-[#F2D8C2]">Customize Master Close Keys</span>
                          <p className="text-[10px] font-medium text-[#6B5B54] dark:text-[#A69281]">Record or edit master window close trigger</p>
                        </div>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-[#9B8179]" />
                    </button>

                    <button 
                      onClick={() => {
                        const firstTarget = shortcuts.find(s => !s.isFullClose)
                        if (firstTarget) {
                          triggerShortcutExecution(firstTarget)
                        } else {
                          setActionToast("Please create a target app shortcut first!")
                        }
                      }}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/15 hover:bg-white/30 dark:bg-white/5 dark:hover:bg-white/10 border border-white/10 transition-all duration-200 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[rgba(166,113,101,0.12)] flex items-center justify-center text-[#A67165]">
                          <EyeOff className="h-4.5 w-4.5" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-[#252326] dark:text-[#F2D8C2]">Toggle Target Apps Stealth Mode</span>
                          <p className="text-[10px] font-medium text-[#6B5B54] dark:text-[#A69281]">Instantly hide target background apps</p>
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
                  <h4 className="text-base font-bold text-[#252326] dark:text-[#F2D8C2]">Targeted App Control</h4>
                  <p className="text-[13px] font-medium text-[#6B5B54] dark:text-[#A69281] leading-relaxed">
                    Select target apps to hide or restore together in background.
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
                  <h4 className="text-base font-bold text-[#252326] dark:text-[#F2D8C2]">Global Win32 Hotkeys</h4>
                  <p className="text-[13px] font-medium text-[#6B5B54] dark:text-[#A69281] leading-relaxed">
                    Custom key combinations that trigger anywhere in Windows.
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

