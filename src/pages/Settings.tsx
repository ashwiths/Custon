import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Card"
import { ToggleSwitch } from "@/components/ToggleSwitch"
import { ShortcutInput } from "@/components/ShortcutInput"
import { RefreshCw, Trash2 } from "lucide-react"

interface SettingsProps {
  darkMode: boolean
  setDarkMode: (dark: boolean) => void
}

export const Settings: React.FC<SettingsProps> = ({ darkMode, setDarkMode }) => {
  const [globalShortcut, setGlobalShortcut] = React.useState("Ctrl + Shift + S")
  const [minimizeOnClose, setMinimizeOnClose] = React.useState(true)
  const [startAtLogin, setStartAtLogin] = React.useState(false)
  const [showToasts, setShowToasts] = React.useState(true)
  const [defaultExecutionMode, setDefaultExecutionMode] = React.useState<"stealth" | "close">("stealth")
  const [dangerActionFeedback, setDangerActionFeedback] = React.useState<string | null>(null)

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
      setDangerActionFeedback(`✓ Successfully restored ${count} hidden window(s)`)
      setTimeout(() => setDangerActionFeedback(null), 3000)
    } catch (e) {
      setDangerActionFeedback("⚠ Restoring windows failed (or not running in Tauri)")
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

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page Title */}
      <div className="flex flex-col gap-2">
        <h2 className="page-title">Settings</h2>
        <p className="body-text">Configure application behavior, appearance, and global hotkeys.</p>
      </div>

      <div className="grid gap-6">
        {/* Appearance Card */}
        <Card style={{ borderRadius: "20px" }}>
          <CardHeader>
            <CardTitle style={{ fontSize: "18px" }}>Appearance & Theme</CardTitle>
            <CardDescription>Customize how the interface looks on your desktop.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4" style={{ padding: "20px 24px" }}>
            <div className="flex items-center justify-between border-b border-[rgba(166,113,101,0.15)] pb-4">
              <div>
                <div className="font-semibold text-[#252326] dark:text-[#F2D8C2]" style={{ fontSize: "15px" }}>Dark Mode</div>
                <div className="text-xs text-[#9B8179]" style={{ marginTop: "2px" }}>Switch between light and dark themes.</div>
              </div>
              <ToggleSwitch checked={darkMode} onChange={setDarkMode} />
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="font-semibold text-[#252326] dark:text-[#F2D8C2]" style={{ fontSize: "15px" }}>Minimize to System Tray</div>
                <div className="text-xs text-[#9B8179]" style={{ marginTop: "2px" }}>Keep the app running in the tray when closing.</div>
              </div>
              <ToggleSwitch checked={minimizeOnClose} onChange={handleMinimizeChange} />
            </div>
          </CardContent>
        </Card>

        {/* Behavior & Stealth Settings */}
        <Card style={{ borderRadius: "20px" }}>
          <CardHeader>
            <CardTitle style={{ fontSize: "18px" }}>Stealth & Behavior</CardTitle>
            <CardDescription>Customize how shortcuts and panic notifications operate.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4" style={{ padding: "20px 24px" }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(166,113,101,0.15)] pb-4">
              <div>
                <div className="font-semibold text-[#252326] dark:text-[#F2D8C2]" style={{ fontSize: "15px" }}>Default Shortcut Action</div>
                <div className="text-xs text-[#9B8179]" style={{ marginTop: "2px" }}>Choose whether newly created target app shortcuts hide or exit by default.</div>
              </div>
              <div className="flex bg-white/20 dark:bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
                <button
                  onClick={() => handleDefaultModeChange("stealth")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
                    defaultExecutionMode === "stealth"
                      ? "bg-[#A67165] text-white shadow-sm"
                      : "bg-transparent text-[#6B5B54] dark:text-[#A69281] hover:text-[#252326] dark:hover:text-[#F2D8C2]"
                  }`}
                >
                  Stealth Hide
                </button>
                <button
                  onClick={() => handleDefaultModeChange("close")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
                    defaultExecutionMode === "close"
                      ? "bg-rose-600 text-white shadow-sm"
                      : "bg-transparent text-[#6B5B54] dark:text-[#A69281] hover:text-[#252326] dark:hover:text-[#F2D8C2]"
                  }`}
                >
                  Force Close
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="font-semibold text-[#252326] dark:text-[#F2D8C2]" style={{ fontSize: "15px" }}>Show Action Toast Alerts</div>
                <div className="text-xs text-[#9B8179]" style={{ marginTop: "2px" }}>Display visual confirmation toast at the bottom right when hotkey triggers.</div>
              </div>
              <ToggleSwitch checked={showToasts} onChange={handleToastsChange} />
            </div>
          </CardContent>
        </Card>

        {/* Hotkeys Card */}
        <Card style={{ borderRadius: "20px" }}>
          <CardHeader>
            <CardTitle style={{ fontSize: "18px" }}>System Hotkeys</CardTitle>
            <CardDescription>Define custom keyboard combinations to summon the utility.</CardDescription>
          </CardHeader>
          <CardContent style={{ padding: "20px 24px" }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-semibold text-[#252326] dark:text-[#F2D8C2]" style={{ fontSize: "15px" }}>Global Overlay Trigger</div>
                <div className="text-xs text-[#9B8179]">Click input box and press keys to capture hotkey.</div>
              </div>
              <div className="w-full md:w-72">
                <ShortcutInput value={globalShortcut} onChange={handleShortcutChange} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Startup Card */}
        <Card style={{ borderRadius: "20px" }}>
          <CardHeader>
            <CardTitle style={{ fontSize: "18px" }}>Startup Options</CardTitle>
            <CardDescription>Manage how Custun initializes on boot.</CardDescription>
          </CardHeader>
          <CardContent style={{ padding: "20px 24px" }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#252326] dark:text-[#F2D8C2]" style={{ fontSize: "15px" }}>Start with Windows (Auto-Launch like Opera GX)</div>
                <div className="text-xs text-[#9B8179]" style={{ marginTop: "2px" }}>Automatically launch Custon in the background when Windows starts.</div>
              </div>
              <ToggleSwitch checked={startAtLogin} onChange={handleToggleAutostart} />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone Card */}
        <Card style={{ borderRadius: "20px", border: "1px solid rgba(225, 29, 72, 0.3)", background: "rgba(225, 29, 72, 0.02)" }}>
          <CardHeader>
            <CardTitle style={{ fontSize: "18px", color: "#e11d48" }}>Danger Zone</CardTitle>
            <CardDescription>Reset options and emergency panics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4" style={{ padding: "20px 24px" }}>
            {dangerActionFeedback && (
              <div className="p-3 bg-amber-500/15 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-bold animate-fade-in mb-2">
                {dangerActionFeedback}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-red-500/10 pb-4">
              <div className="space-y-0.5">
                <div className="font-semibold text-[#252326] dark:text-[#F2D8C2]" style={{ fontSize: "15px" }}>Restore Hidden Windows</div>
                <div className="text-xs text-[#9B8179]">Instantly rescue and restore all windows hidden by Custon background processes.</div>
              </div>
              <button
                onClick={handleRestoreAllHidden}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all border-none cursor-pointer flex items-center gap-1.5 shadow-md flex-shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restore All Windows</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="space-y-0.5">
                <div className="font-semibold text-[#252326] dark:text-[#F2D8C2]" style={{ fontSize: "15px" }}>Factory Reset Application</div>
                <div className="text-xs text-[#9B8179]">Erase all shortcuts, autostart configurations, and reset to out-of-the-box defaults.</div>
              </div>
              <button
                onClick={handleFactoryReset}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all border-none cursor-pointer flex items-center gap-1.5 shadow-md flex-shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Factory Reset</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
