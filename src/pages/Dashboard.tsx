import * as React from "react"
import { invoke } from "@tauri-apps/api/core"
import { listen } from "@tauri-apps/api/event"
import { 
  Keyboard, 
  Plus, 
  ChevronRight,
  Trash2,
  CheckCircle2,
  X,
  Power,
  Zap,
  Sliders,
  AlertTriangle,
  EyeOff
} from "lucide-react"
import { CreateAppShortcut } from "@/pages/CreateAppShortcut"
import { CreateFullClose } from "@/pages/CreateFullClose"
import { CustomizeAllKeys } from "@/pages/CustomizeAllKeys"
import { AnimatedWelcomeHeader } from "@/components/AnimatedWelcomeHeader"
import { animate, splitText, stagger } from "animejs"

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

type ViewMode = "home" | "create-app-shortcut" | "create-full-close" | "customize-all-keys"
type AutostartState = "prompt" | "warning" | "enabled" | "hidden"

const STORAGE_KEY = "custom_workspace_shortcuts"

const DEFAULT_SHORTCUTS: ShortcutItem[] = [
  { id: "1", name: "Chrome • VS Code • Discord", apps: ["chrome", "vscode", "discord"], keys: ["Ctrl", "Shift", "Q"], status: "Enabled", lastUsed: "2 mins ago", executionMode: "stealth" },
  { id: "2", name: "Close All Open Windows", apps: ["all-apps"], keys: ["Ctrl", "Alt", "X"], status: "Enabled", lastUsed: "5 mins ago", isFullClose: true },
]

export const Dashboard: React.FC = () => {
  const [viewMode, setViewMode] = React.useState<ViewMode>("home")
  const [editingShortcutId, setEditingShortcutId] = React.useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<ShortcutItem | null>(null)
  
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

    invoke("sync_shortcuts", { shortcuts }).catch(() => {})
  }, [shortcuts])

  // Trigger Target App Shortcut Execution
  const triggerShortcutExecution = async (item: ShortcutItem) => {
    try {
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

      {/* SEPARATE PAGE 3 MODULE: CUSTOMIZE ALL KEY SHORTCUTS */}
      {viewMode === "customize-all-keys" && (
        <CustomizeAllKeys 
          onBack={() => setViewMode("home")}
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
          {/* Animated Auto-Typing Welcome Header powered by Anime.js */}
          <AnimatedWelcomeHeader />

          {/* ROW 1: 2 DISTINCT HERO BOXES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* BOX 1: FULL CLOSE ALL WINDOWS SHORTCUT */}
            <div 
              className="glass-card relative overflow-hidden p-8 flex flex-col items-center justify-center text-center transition-all duration-220 hover:border-[#A67165]/50 border-[rgba(255,255,255,0.28)]"
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
              className="glass-card relative overflow-hidden p-8 flex flex-col items-center justify-center text-center transition-all duration-220 hover:border-[#A67165]/50 border-[rgba(255,255,255,0.28)]"
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

          {/* BOX 3: CUSTOMIZE ALL KEY SHORTCUTS */}
          <div 
            className="glass-card relative overflow-hidden p-8 flex flex-col items-center justify-center text-center transition-all duration-220 hover:border-[#A67165]/50 border-[rgba(255,255,255,0.28)]"
            style={{ borderRadius: "24px" }}
          >
            <div className="relative mb-4 flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-white/90 dark:bg-white/10 flex items-center justify-center text-[#A67165] border border-white/50 shadow-md">
                <Sliders className="h-8 w-8" />
              </div>
            </div>

            <h3 className="text-[20px] font-bold text-[#252326] dark:text-[#F2D8C2] mb-1.5 leading-tight">
              Customize All Key Shortcuts
            </h3>

            <p className="text-[13px] font-medium text-[#6B5B54] dark:text-[#A69281] mb-6 max-w-[480px] leading-relaxed">
              Customize major Windows shortcuts and assign your own custom shortcut while keeping the original Windows shortcut working.
            </p>

            <button 
              onClick={() => setViewMode("customize-all-keys")}
              className="w-full max-w-[320px] flex items-center justify-center gap-2 text-[16px] font-semibold text-white bg-gradient-to-r from-[#A67165] to-[#734E46] hover:from-[#734E46] hover:to-[#A67165] transition-all duration-200 shadow-lg border-none cursor-pointer py-3.5 rounded-2xl"
            >
              <Plus className="h-5 w-5" />
              <span>Customize All Keys</span>
            </button>
          </div>

          {/* ROW 2: QUICK ACTIONS */}
          <div className="w-full">
            <div className="glass-card p-6 border-[rgba(255,255,255,0.28)]" style={{ borderRadius: "24px" }}>
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

        </>
      )}

      {/* Confirmation Modal for Destructive Actions */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-card max-w-md w-full p-6 rounded-[24px] border border-rose-500/30 space-y-4 shadow-2xl text-left bg-[#1E1B1A]">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Shortcut?</h3>
                <p className="text-xs text-[#A69281]">This destructive action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-[#F2D8C2] bg-white/5 p-3 rounded-xl border border-white/10 leading-relaxed">
              Are you sure you want to delete <strong>"{deleteTarget.name}"</strong>? The associated key combination <strong>({deleteTarget.keys.join(" + ")})</strong> will be removed.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#A69281] hover:text-white bg-white/5 hover:bg-white/10 transition-all border-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteShortcut}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-all border-none cursor-pointer shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

