import * as React from "react"
import { Search, Keyboard, HelpCircle, AlertTriangle, Play, RefreshCw, Upload, Download } from "lucide-react"

interface ActionShortcut {
  id: string
  label: string
  keyCombo: string
  category: string
  reserved?: boolean
}

const INITIAL_SHORTCUTS: ActionShortcut[] = [
  { id: "overlay", label: "Global Overlay Shortcut", keyCombo: "Ctrl + Shift + S", category: "Navigation" },
  { id: "hide_selected", label: "Hide Selected Apps", keyCombo: "Alt + H", category: "Core Operations" },
  { id: "hide_all", label: "Hide All Apps", keyCombo: "Ctrl + Alt + H", category: "Core Operations" },
  { id: "restore_all", label: "Restore Hidden Apps", keyCombo: "Ctrl + Alt + R", category: "Core Operations" },
  { id: "emergency", label: "Emergency Restore", keyCombo: "Ctrl + Alt + Escape", category: "Safety Keys", reserved: true },
  { id: "pause_engine", label: "Pause Shortcut Engine", keyCombo: "ScrollLock", category: "Safety Keys" },
  { id: "open_dash", label: "Open Dashboard", keyCombo: "Ctrl + Alt + D", category: "Navigation" },
  { id: "open_settings", label: "Open Settings", keyCombo: "Ctrl + Alt + P", category: "Navigation" },
  { id: "create_new", label: "Create New Shortcut", keyCombo: "Ctrl + Alt + N", category: "Navigation" }
]

export const HotkeysTab: React.FC = () => {
  const [shortcuts, setShortcuts] = React.useState<ActionShortcut[]>(() => {
    const saved = localStorage.getItem("settings_advanced_shortcuts")
    return saved ? JSON.parse(saved) : INITIAL_SHORTCUTS
  })

  const [searchQuery, setSearchQuery] = React.useState("")
  const [recordingId, setRecordingId] = React.useState<string | null>(null)
  const [testResult, setTestResult] = React.useState<string | null>(null)
  
  // Ref for capturing keyboard input
  const recordingRef = React.useRef<HTMLDivElement>(null)

  // Save changes
  React.useEffect(() => {
    localStorage.setItem("settings_advanced_shortcuts", JSON.stringify(shortcuts))
  }, [shortcuts])

  // Conflict & Reserved Detection Helper
  const checkConflicts = (id: string, newCombo: string) => {
    const duplicate = shortcuts.find(s => s.id !== id && s.keyCombo.toLowerCase() === newCombo.toLowerCase())
    if (duplicate) return { type: "conflict" as const, message: `Conflict: Mapped to "${duplicate.label}"` }

    // Check common OS reserved keys
    const lower = newCombo.toLowerCase()
    if (lower === "ctrl + c" || lower === "ctrl + v" || lower === "alt + tab" || lower === "ctrl + alt + delete") {
      return { type: "reserved" as const, message: "Reserved OS Shortcut: May cause OS overlap issues" }
    }
    return null
  }

  // Handle keyboard recording
  React.useEffect(() => {
    if (!recordingId) return

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      e.stopPropagation()

      // Ignore individual modifier keys from final value, but check for them
      if (["control", "shift", "alt", "meta"].includes(e.key.toLowerCase())) {
        return
      }

      const parts: string[] = []
      if (e.ctrlKey) parts.push("Ctrl")
      if (e.altKey) parts.push("Alt")
      if (e.shiftKey) parts.push("Shift")
      if (e.metaKey) parts.push("Win")

      // Capitalize first character
      let finalKey = e.key
      if (finalKey.length === 1) {
        finalKey = finalKey.toUpperCase()
      } else if (finalKey === " ") {
        finalKey = "Space"
      } else if (finalKey === "Escape") {
        finalKey = "Escape"
      }

      parts.push(finalKey)
      const formatted = parts.join(" + ")

      // Update shortcut
      setShortcuts(prev =>
        prev.map(s => (s.id === recordingId ? { ...s, keyCombo: formatted } : s))
      )
      setRecordingId(null)
    }

    window.addEventListener("keydown", handleKeyDown, true)
    return () => window.removeEventListener("keydown", handleKeyDown, true)
  }, [recordingId])

  const triggerTestShortcut = (label: string, combo: string) => {
    setTestResult(`Testing "${label}" (${combo}) ... OK!`)
    setTimeout(() => setTestResult(null), 3000)
  }

  const resetAllShortcuts = () => {
    if (window.confirm("Restore all Advanced Shortcuts to initial setup defaults?")) {
      setShortcuts(INITIAL_SHORTCUTS)
    }
  }

  const exportShortcuts = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(shortcuts, null, 2))
    const dlAnchorElem = document.createElement("a")
    dlAnchorElem.setAttribute("href", dataStr)
    dlAnchorElem.setAttribute("download", "custun_shortcuts_config.json")
    dlAnchorElem.click()
  }

  const importShortcuts = () => {
    const fileInput = document.createElement("input")
    fileInput.type = "file"
    fileInput.accept = ".json"
    fileInput.onchange = (e: any) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (evt) => {
        try {
          const parsed = JSON.parse(evt.target?.result as string)
          if (Array.isArray(parsed) && parsed.length > 0 && "keyCombo" in parsed[0]) {
            setShortcuts(parsed)
            alert("Shortcuts config imported successfully!")
          } else {
            alert("Invalid JSON format.")
          }
        } catch {
          alert("Error parsing config file.")
        }
      }
      reader.readAsText(file)
    }
    fileInput.click()
  }

  const filteredShortcuts = shortcuts.filter(s =>
    s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.keyCombo.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Toast Alert Mock */}
      {testResult && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs shadow-lg animate-fade-in flex items-center gap-2">
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{testResult}</span>
        </div>
      )}

      {/* Top Filter and Actions Row */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[220px] bg-black/40 border border-white/10 rounded-lg flex items-center px-3 gap-2">
          <Search className="w-4 h-4 text-[#9B8179]" />
          <input
            type="text"
            placeholder="Search action keys or bindings..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none py-2 text-xs text-white placeholder-white/20 font-semibold"
          />
        </div>

        <button
          onClick={importShortcuts}
          className="px-3.5 py-2 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-[#F2D8C2] cursor-pointer transition-all flex items-center gap-1.5"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Import</span>
        </button>

        <button
          onClick={exportShortcuts}
          className="px-3.5 py-2 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-[#F2D8C2] cursor-pointer transition-all flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>

        <button
          onClick={resetAllShortcuts}
          className="px-3.5 py-2 border border-rose-950/20 hover:border-rose-900/40 bg-rose-950/5 hover:bg-rose-950/15 rounded-lg text-xs font-semibold text-rose-500 cursor-pointer transition-all flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Shortcuts List */}
      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
        {filteredShortcuts.map(item => {
          const isRecording = recordingId === item.id
          const issue = checkConflicts(item.id, item.keyCombo)

          return (
            <div
              key={item.id}
              className="flex flex-col md:flex-row md:items-center justify-between p-3.5 rounded-xl border border-white/5 bg-black/10 dark:bg-black/25 gap-3"
            >
              {/* Left Side: Labels & Badges */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-white">{item.label}</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-white/5 text-[#9B8179] font-mono font-bold border border-white/5">
                    {item.category}
                  </span>
                  {item.reserved && (
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-mono font-bold border border-amber-500/20">
                      Reserved Trigger
                    </span>
                  )}
                </div>
                {issue && (
                  <div className="flex items-center gap-1 text-[9px] font-bold uppercase text-amber-500">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{issue.message}</span>
                  </div>
                )}
              </div>

              {/* Right Side: Key Indicator & Capture Trigger */}
              <div className="flex items-center gap-2 justify-end">
                {/* Recorder Box */}
                <div
                  onClick={() => setRecordingId(item.id)}
                  ref={isRecording ? recordingRef : null}
                  className={`px-3 py-1.5 rounded-lg border font-mono text-[10px] text-center font-bold cursor-pointer transition-all min-w-[120px] select-none ${
                    isRecording
                      ? "bg-[#A67165]/20 border-[#A67165] text-white animate-pulse"
                      : issue?.type === "conflict"
                      ? "bg-amber-500/5 border-amber-500/30 text-amber-500 hover:border-amber-500/60"
                      : "bg-white/5 border-white/10 hover:border-white/20 text-[#A67165]"
                  }`}
                >
                  {isRecording ? "Press Key sequence..." : item.keyCombo || "Click to record"}
                </div>

                {/* Test Action Trigger */}
                <button
                  onClick={() => triggerTestShortcut(item.label, item.keyCombo)}
                  className="p-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all cursor-pointer"
                  title="Test Action"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>
          )
        })}

        {filteredShortcuts.length === 0 && (
          <div className="p-8 text-center border border-dashed border-white/10 rounded-xl space-y-2">
            <Keyboard className="w-8 h-8 text-[#9B8179] mx-auto opacity-50" />
            <div className="text-xs font-bold text-[#F2D8C2]">No Bindings Found</div>
            <div className="text-[10px] text-[#9B8179]">Refine your search parameters to find mapped application keys.</div>
          </div>
        )}
      </div>

      <div className="text-[10px] text-[#9B8179] font-medium leading-relaxed bg-white/5 p-3.5 rounded-xl border border-white/5 flex gap-2">
        <HelpCircle className="w-4 h-4 text-[#A67165] shrink-0" />
        <div>
          To assign a new shortcut trigger: Click on the corresponding key binding field (it will pulse to indicate active recording mode) and press your keyboard sequence. Modifier keys (Ctrl, Alt, Shift, Win) are registered automatically. Pressing other sequences updates the value.
        </div>
      </div>
    </div>
  )
}
