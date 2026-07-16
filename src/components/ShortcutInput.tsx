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

    // Skip recording pure modifiers
    if (["Control", "Shift", "Alt", "Meta"].includes(e.key)) {
      return
    }

    const keys: string[] = []

    if (e.ctrlKey) keys.push("Ctrl")
    if (e.shiftKey) keys.push("Shift")
    if (e.altKey) keys.push("Alt")
    if (e.metaKey) keys.push("Win")

    let keyName = e.key
    if (keyName === " ") keyName = "Space"
    if (keyName.length === 1) keyName = keyName.toUpperCase()

    keys.push(keyName)

    const shortcutStr = keys.join(" + ")
    onChange(shortcutStr)
    setIsRecording(false)
  }

  return (
    <div className={cn("relative flex items-center w-full", className)}>
      <Keyboard className="absolute left-4 h-4.5 w-4.5 text-[#734E46] opacity-70" />
      <input
        type="text"
        readOnly
        value={isRecording ? "Recording shortcut..." : value}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsRecording(true)}
        onBlur={() => setIsRecording(false)}
        className={cn(
          "flex h-12 w-full rounded-[12px] border border-[rgba(166,113,101,0.2)] bg-[rgba(255,255,255,0.55)] py-3 pl-11 pr-10 text-sm placeholder:text-[#9B8179] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A67165] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer text-center font-mono font-semibold transition-all duration-200 backdrop-blur-md text-[#252326]",
          isRecording && "border-[#A67165] ring-2 ring-[#A67165] bg-[rgba(166,113,101,0.05)]"
        )}
      />
      {value && !isRecording && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onChange("")
          }}
          className="absolute right-4 text-xs font-semibold text-[#9B8179] hover:text-[#734E46] transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  )
}
