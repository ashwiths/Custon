import * as React from "react"
import { cn } from "@/utils/cn"
import { Check, ChevronDown, Monitor } from "lucide-react"

export interface AppOption {
  id: string
  name: string
  icon?: React.ReactNode
  description?: string
}

export interface AppSelectorProps {
  options: AppOption[]
  selectedId?: string
  onSelect: (id: string) => void
  placeholder?: string
  className?: string
}

export const AppSelector: React.FC<AppSelectorProps> = ({
  options,
  selectedId,
  onSelect,
  placeholder = "Select application...",
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const selectedOption = options.find((opt) => opt.id === selectedId)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  return (
    <div ref={dropdownRef} className={cn("relative w-full", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="flex h-12 w-full items-center justify-between rounded-[12px] border border-[rgba(166,113,101,0.2)] bg-[rgba(255,255,255,0.55)] px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#A67165] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-left transition-all duration-200 backdrop-blur-md"
      >
        <div className="flex items-center gap-2.5 truncate">
          {selectedOption ? (
            <>
              {selectedOption.icon || <Monitor className="h-4.5 w-4.5 text-[#734E46]" />}
              <span className="font-semibold text-[#252326] truncate">{selectedOption.name}</span>
            </>
          ) : (
            <span className="text-[#9B8179]">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={cn("h-4 w-4 text-[#734E46] opacity-70 transition-transform duration-200", isOpen && "transform rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 max-h-60 overflow-y-auto rounded-[14px] border border-[rgba(166,113,101,0.15)] bg-[rgba(255,252,249,0.95)] backdrop-blur-lg text-[#252326] shadow-lg animate-in fade-in-80 duration-100">
          <div className="p-1.5 space-y-0.5">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onSelect(option.id)
                  setIsOpen(false)
                }}
                className={cn(
                  "relative flex w-full cursor-pointer select-none items-center rounded-[8px] py-2.5 px-3 text-sm outline-none transition-all text-left gap-2.5 hover:bg-[rgba(166,113,101,0.1)] text-[#252326]",
                  option.id === selectedId && "bg-[rgba(166,113,101,0.15)] font-medium"
                )}
              >
                {option.icon || <Monitor className="h-4.5 w-4.5 text-[#734E46]" />}
                <div className="flex-1 truncate">
                  <div className="font-semibold text-[#252326]">{option.name}</div>
                  {option.description && (
                    <div className="text-xs text-[#9B8179] truncate">{option.description}</div>
                  )}
                </div>
                {option.id === selectedId && <Check className="h-4 w-4 text-[#A67165] ml-auto" />}
              </button>
            ))}
            {options.length === 0 && (
              <div className="py-6 text-center text-sm text-[#9B8179]">No options found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
