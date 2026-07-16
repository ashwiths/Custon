import * as React from "react"
import { cn } from "@/utils/cn"

export interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
  label?: string
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  className,
  label,
}) => {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-3 cursor-pointer select-none",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={cn(
            "h-6 w-11 rounded-full bg-[rgba(166,113,101,0.2)] transition-colors duration-200 ease-in-out",
            checked && "bg-[#A67165]"
          )}
        />
        <div
          className={cn(
            "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out",
            checked && "transform translate-x-5"
          )}
        />
      </div>
      {label && <span className="text-sm font-medium text-[#252326]">{label}</span>}
    </label>
  )
}
