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
      className="flex items-center justify-between flex-shrink-0"
      style={{
        height: "72px",
        padding: "0 32px",
        background: "rgba(255,252,249,0.7)",
        backdropFilter: "blur(20px) saturate(1.5)",
        WebkitBackdropFilter: "blur(20px) saturate(1.5)",
        borderBottom: "1px solid rgba(166,113,101,0.1)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.8)",
      }}
    >
      <div className="flex items-center gap-3">
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#252326",
            letterSpacing: "-0.02em",
            textTransform: "capitalize",
          }}
        >
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Date pill */}
        <div
          style={{
            fontSize: "12px",
            fontWeight: 500,
            color: "#9B8179",
            background: "rgba(166,113,101,0.08)",
            padding: "5px 12px",
            borderRadius: "99px",
            border: "1px solid rgba(166,113,101,0.12)",
          }}
        >
          {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle theme"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(166,113,101,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background 180ms ease, transform 180ms ease",
            boxShadow: "0 1px 4px rgba(115,78,70,0.08)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.9)"
            ;(e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)"
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.6)"
            ;(e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"
          }}
        >
          {darkMode ? (
            <Sun className="h-4 w-4" style={{ color: "#A67165" }} />
          ) : (
            <Moon className="h-4 w-4" style={{ color: "#734E46" }} />
          )}
        </button>
      </div>
    </header>
  )
}
