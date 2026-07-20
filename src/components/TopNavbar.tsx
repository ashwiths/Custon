import * as React from "react"
import { Sun, Moon } from "lucide-react"

interface TopNavbarProps {
  title: string
  darkMode: boolean
  setDarkMode: (dark: boolean) => void
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ title, darkMode, setDarkMode }) => {
  return (
    <header
      className="flex items-center justify-between flex-shrink-0 px-8 bg-white/20 dark:bg-[#252326]/20 backdrop-blur-[24px] border-b border-white/15 dark:border-white/5"
      style={{ height: "72px" }}
    >
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold tracking-tight text-[#252326] dark:text-[#F2D8C2] capitalize">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Date pill */}
        <div className="text-[12px] font-semibold text-[#9B8179] dark:text-[#A69281] bg-[rgba(166,113,101,0.08)] dark:bg-[rgba(166,113,101,0.18)] px-3.5 py-1.5 rounded-full border border-[rgba(166,113,101,0.12)]">
          {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle theme"
          className="w-9 h-9 rounded-xl bg-white/60 dark:bg-white/10 border border-[rgba(166,113,101,0.15)] flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-[1.05] active:scale-[0.95] hover:bg-white/90 dark:hover:bg-white/20 shadow-[0_1px_4px_rgba(115,78,70,0.08)]"
        >
          {darkMode ? (
            <Sun className="h-4.5 w-4.5 text-[#A67165]" />
          ) : (
            <Moon className="h-4.5 w-4.5 text-[#734E46]" />
          )}
        </button>
      </div>
    </header>
  )
}

