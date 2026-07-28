import * as React from "react"
import { 
  Keyboard, 
  Check, 
  ArrowLeft, 
  ShieldCheck,
  Sliders,
  XCircle
} from "lucide-react"
import { checkShortcutConflict } from "@/utils/shortcutConflict"

interface CreateFullCloseProps {
  onBack: () => void
  onSave: (keys: string[]) => void
  initialKeys?: string[]
}

export const CreateFullClose: React.FC<CreateFullCloseProps> = ({ onBack, onSave, initialKeys }) => {
  const [errorToast, setErrorToast] = React.useState<string | null>(null)
  const [keyCombo, setKeyCombo] = React.useState<string>(
    initialKeys && initialKeys.length > 0 ? initialKeys.join(" + ") : ""
  )
  const [isRecording, setIsRecording] = React.useState(false)

  const handleKeyRecorder = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const keys: string[] = []
    if (e.ctrlKey) keys.push("Ctrl")
    if (e.altKey) keys.push("Alt")
    if (e.shiftKey) keys.push("Shift")
    if (e.metaKey) keys.push("Win")

    const key = e.key
    const isModifier = ["Control", "Shift", "Alt", "Meta"].includes(key)

    if (!isModifier) {
      let friendlyKey = key
      if (key === " ") friendlyKey = "Space"
      else if (key === "ArrowUp") friendlyKey = "Up"
      else if (key === "ArrowDown") friendlyKey = "Down"
      else if (key === "ArrowLeft") friendlyKey = "Left"
      else if (key === "ArrowRight") friendlyKey = "Right"
      else if (key === "Escape") friendlyKey = "Esc"
      else if (key === "Enter") friendlyKey = "Enter"
      else if (key === "Tab") friendlyKey = "Tab"
      else if (key === "Backspace") friendlyKey = "Backspace"
      else if (key === "Delete") friendlyKey = "Delete"
      else if (key.length === 1) friendlyKey = key.toUpperCase()
      
      keys.push(friendlyKey)
    }

    if (keys.length > 0) {
      const comboStr = keys.join(" + ")
      setKeyCombo(comboStr)

      const isModifierOnly = ["Control", "Shift", "Alt", "Meta"].includes(key)
      if (!isModifierOnly) {
        const conflict = checkShortcutConflict(comboStr)
        if (conflict.hasConflict) {
          setErrorToast(`⚠️ REPEATED KEY WARNING! "${comboStr}" is already assigned to ${conflict.conflictName}. Please do not use repeated keys!`)
          setTimeout(() => setErrorToast(null), 4000)
        }
      }
    }
  }

  const handleSave = async () => {
    const trimmedCombo = keyCombo.trim() ? keyCombo.trim() : "Ctrl + Alt + X"
    const keys = trimmedCombo.split("+").map(k => k.trim())
    const lastPart = keys[keys.length - 1]
    const isModifierOnly = ["Ctrl", "Alt", "Shift", "Win", "Control", "Meta"].includes(lastPart)

    if (isModifierOnly) {
      setErrorToast("⚠️ Incomplete hotkey! Please include a main key (e.g. Ctrl + Alt + X)")
      setTimeout(() => setErrorToast(null), 3000)
      return
    }

    const conflictResult = checkShortcutConflict(trimmedCombo)
    if (conflictResult.hasConflict) {
      const alertMsg = `⚠️ KEY COMBINATION ALREADY USED!\n\nThe key combination "${trimmedCombo}" is already assigned to ${conflictResult.conflictName}.\n\nPlease do not repeat shortcut keys! Choose a different key combination.`
      window.alert(alertMsg)
      setErrorToast(`⚠️ Hotkey Already Used! "${trimmedCombo}" is assigned to ${conflictResult.conflictName}. Please do not repeat keys!`)
      setTimeout(() => setErrorToast(null), 3500)
      return
    }

    try {
      const { invoke } = await import("@tauri-apps/api/core")
      await invoke("set_workspace_hotkey", { keyCombo: keys.join(" + ") })
    } catch {
      // Browser environment guard
    }
    onSave(keys)
  }

  return (
    <div className="max-w-[800px] mx-auto space-y-6 animate-fade-up select-none pb-12 relative text-left">
      {/* Toast Notification */}
      {errorToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#252326] text-[#F2D8C2] border border-amber-500/50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-up max-w-[420px]">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
            <XCircle className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold leading-relaxed flex-1">{errorToast}</p>
          <button onClick={() => setErrorToast(null)} className="text-white/50 hover:text-white border-none bg-transparent cursor-pointer">
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className="flex items-center gap-4 border-b border-white/10 pb-5">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-white/20 dark:bg-white/5 border border-white/15 hover:bg-white/40 dark:hover:bg-white/10 flex items-center justify-center text-[#252326] dark:text-[#F2D8C2] cursor-pointer transition-all duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-[26px] font-black text-[#252326] dark:text-[#F2D8C2]">
            Customize Close All Windows Key
          </h1>
          <p className="text-xs font-semibold text-[#6B5B54] dark:text-[#A69281] leading-relaxed mt-0.5">
            Assign your custom keyboard shortcut combination to terminate all open windows instantly.
          </p>
        </div>
      </div>

      {/* Main Centered Glass Card */}
      <div className="glass-card p-8 border-[rgba(255,255,255,0.25)] space-y-6" style={{ borderRadius: "24px" }}>
        
        {/* Key Recorder Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#A67165] dark:text-[#C98D74] uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#A67165]" />
              <span>Customize Key Binding</span>
            </label>
            {isRecording && (
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#A67165] animate-pulse">
                <span className="h-2 w-2 rounded-full bg-[#A67165]"></span>
                <span>RECORDING KEYS...</span>
              </div>
            )}
          </div>

          <div className="relative">
            <input 
              type="text"
              value={keyCombo}
              onKeyDown={handleKeyRecorder}
              onFocus={() => setIsRecording(true)}
              onBlur={() => setIsRecording(false)}
              readOnly
              placeholder={isRecording ? "Press your custom shortcut keys..." : "Type key combination (e.g. Ctrl + Alt + X)"}
              className="w-full text-base px-5 py-4 pl-12 rounded-xl border border-[rgba(166,113,101,0.3)] dark:border-[#A67165]/50 bg-white/55 dark:bg-[#1E1B1A] outline-none text-[#252326] dark:text-[#F2D8C2] font-mono font-bold text-lg shadow-inner focus:ring-2 focus:ring-[#A67165]/50 transition-all text-left"
            />
            <Keyboard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A67165]" />
          </div>
        </div>

        {/* Quick Presets & System Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quick Presets */}
          <div className="p-4 rounded-2xl bg-black/20 border border-white/10 space-y-2 text-left">
            <span className="text-[11px] font-bold text-[#6B5B54] dark:text-[#A69281] uppercase tracking-wider block">
              Quick Preset Keys
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {["Ctrl + Alt + X", "Ctrl + Shift + Q", "Alt + Shift + W", "Ctrl + Alt + End"].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setKeyCombo(preset)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                    keyCombo === preset
                      ? "bg-[#A67165] border-[#A67165] text-white shadow-md"
                      : "bg-white/10 dark:bg-white/5 hover:bg-[#A67165]/20 border-white/10 text-[#252326] dark:text-[#F2D8C2]"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Security & System Info */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 text-left">
            <ShieldCheck className="h-5 w-5 text-[#A67165] flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold text-[#F2D8C2] uppercase block mb-1">Global Action Notice</span>
              <p className="text-xs text-[#6B5B54] dark:text-[#A69281] font-semibold leading-relaxed">
                Pressing this key combination anywhere on your PC will trigger instant window hiding or closing across all active desktop workspaces.
              </p>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="flex items-center justify-end gap-3.5 border-t border-white/10 pt-5">
          <button 
            type="button"
            onClick={onBack} 
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#A67165] to-[#734E46] hover:from-[#734E46] hover:to-[#A67165] shadow-lg border-none cursor-pointer flex items-center gap-2 transition-all"
          >
            <Check className="h-4 w-4" />
            <span>Save Customized Key</span>
          </button>
        </div>
      </div>
    </div>
  )
}
