import * as React from "react"
import { 
  Keyboard, 
  Check, 
  ArrowLeft, 
  ShieldCheck 
} from "lucide-react"

interface CreateFullCloseProps {
  onBack: () => void
  onSave: (keys: string[]) => void
}

export const CreateFullClose: React.FC<CreateFullCloseProps> = ({ onBack, onSave }) => {
  const [keyCombo, setKeyCombo] = React.useState("")
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
      setKeyCombo(keys.join(" + "))
    }
  }

  const handleSave = () => {
    const keys = keyCombo.trim() ? keyCombo.split("+").map(k => k.trim()) : ["Ctrl", "Alt", "X"]
    onSave(keys)
  }

  return (
    <div className="space-y-8 animate-fade-up select-none pb-8 relative text-left">
      <div className="flex items-center gap-4 border-b border-white/10 pb-4">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-white/20 dark:bg-white/5 border border-white/15 hover:bg-white/40 dark:hover:bg-white/10 flex items-center justify-center text-[#252326] dark:text-[#F2D8C2] cursor-pointer transition-all duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-[26px] font-black text-[#252326] dark:text-[#F2D8C2] flex items-center gap-2">
            Create Full Close Windows Shortcut
          </h1>
          <p className="text-sm font-semibold text-[#6B5B54] dark:text-[#A69281]">
            Assign custom keyboard trigger to close all open application windows instantly.
          </p>
        </div>
      </div>

      {/* Key Recorder */}
      <div className="glass-card p-8 border-[rgba(255,255,255,0.28)]" style={{ borderRadius: "24px" }}>
        <div className="space-y-3 max-w-[600px]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#A67165] dark:text-[#C98D74] uppercase tracking-wider block">
              Assign Custom Shortcut (Keyboard Input)
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
              placeholder={isRecording ? "Press your shortcut keys..." : "Type key combination (e.g. Ctrl + Alt + X)"}
              className="w-full text-base px-5 py-3.5 pl-12 rounded-xl border border-white/20 bg-white/20 dark:bg-white/5 outline-none text-[#252326] dark:text-[#F2D8C2] font-mono font-semibold"
            />
            <Keyboard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9B8179]" />
          </div>
          
          <div className="p-4 rounded-xl bg-white/20 dark:bg-white/5 border border-white/15 flex items-center gap-3 mt-4">
            <ShieldCheck className="h-5 w-5 text-[#A67165] flex-shrink-0" />
            <p className="text-xs text-[#6B5B54] dark:text-[#A69281] font-semibold leading-relaxed">
              No application selection needed. Pressing this custom key combination will close all open desktop windows instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3.5 border-t border-white/10 pt-6">
        <button onClick={onBack} className="btn-secondary py-3 px-8 text-sm font-semibold rounded-xl">
          Cancel
        </button>
        <button 
          onClick={handleSave}
          className="btn-primary py-3 px-8 text-sm font-semibold rounded-xl flex items-center gap-1.5"
        >
          <Check className="h-4 w-4" />
          <span>Apply All & Save</span>
        </button>
      </div>
    </div>
  )
}
