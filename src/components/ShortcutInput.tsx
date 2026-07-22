import * as React from "react"
import { cn } from "@/utils/cn"
import { Keyboard } from "lucide-react"

export interface ShortcutInputProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
}

export const ShortcutInput: React.FC<ShortcutInputProps> = ({
  value,
  onChange,
  className,
  placeholder = "Press key combination...",
}) => {
  const [isRecording, setIsRecording] = React.useState(false)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const keys: string[] = []

    // Check modifiers in standard sequence: Ctrl, Alt, Shift, Win
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
      onChange(keys.join(" + "))
    }
  }

  return (
    <div className={cn("relative flex items-center w-full", className)}>
      <Keyboard className={cn(
        "absolute left-4 h-4.5 w-4.5 transition-colors duration-200",
        isRecording ? "text-[#A67165]" : "text-[#734E46] opacity-70"
      )} />
      <input
        type="text"
        readOnly
        value={value}
        placeholder={isRecording ? "Press shortcut keys..." : placeholder}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsRecording(true)}
        onBlur={() => setIsRecording(false)}
        className={cn(
          "flex h-12 w-full rounded-[12px] border border-[rgba(166,113,101,0.2)] dark:border-[#A67165]/40 bg-[rgba(255,255,255,0.55)] dark:bg-[#1E1B1A] py-3 pl-11 pr-10 text-sm placeholder:text-[#9B8179] dark:placeholder:text-[#A69281]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A67165] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer text-center font-mono font-semibold transition-all duration-200 backdrop-blur-md text-[#252326] dark:text-[#F2D8C2]",
          isRecording && "border-[#A67165] ring-2 ring-[#A67165]/20 bg-[rgba(166,113,101,0.05)] dark:bg-[#A67165]/10 shadow-[0_0_15px_rgba(166,113,101,0.05)]"
        )}
      />
      {value && (
        <button
          type="button"
          onMouseDown={(e) => {
            // Prevent input from losing focus if clicked
            e.preventDefault()
            onChange("")
          }}
          className="absolute right-4 text-xs font-semibold text-[#9B8179] hover:text-[#734E46] transition-colors cursor-pointer"
          title="Clear shortcut"
        >
          Clear
        </button>
      )}
    </div>
  )
}
