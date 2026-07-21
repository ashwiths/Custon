import * as React from "react"
import { LayoutDashboard, Settings, Info } from "lucide-react"
import { cn } from "@/utils/cn"

export type ActivePage = "dashboard" | "settings" | "about"

interface SidebarProps {
  currentPage: ActivePage
  setCurrentPage: (page: ActivePage) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const menuItems = [
    { id: "dashboard" as ActivePage, label: "Dashboard", icon: LayoutDashboard },
    { id: "settings" as ActivePage, label: "Settings", icon: Settings },
    { id: "about" as ActivePage, label: "About", icon: Info },
  ]

  return (
    <aside
      className="sidebar-surface flex flex-col h-full select-none"
      style={{ width: "280px", minWidth: "280px" }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3"
        style={{
          height: "72px",
          padding: "0 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: "36px",
            height: "36px",
            background: "linear-gradient(135deg, #A67165 0%, #734E46 100%)",
            boxShadow: "0 2px 10px rgba(166,113,101,0.4)",
          }}
        >
          <span style={{ color: "#fff", fontSize: "16px", fontWeight: 900, fontFamily: "system-ui, sans-serif" }}>C</span>
        </div>
        <div>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "#F2D8C2", letterSpacing: "0.06em" }}>
            CUSTUN
          </div>
          <div style={{ fontSize: "11px", color: "rgba(242,216,194,0.4)", fontWeight: 500 }}>
            Desktop Suite
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1" style={{ padding: "16px 12px" }}>
        <div style={{ marginBottom: "8px", padding: "0 12px" }}>
          <span style={{ fontSize: "10px", fontWeight: 600, color: "rgba(242,216,194,0.3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Navigation
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={cn("nav-item", isActive && "active")}
              >
                <Icon className="h-4 w-4 animate-nav-icon" style={{ flexShrink: 0, opacity: isActive ? 1 : 0.65 }} />
                <span>{item.label}</span>
                {isActive && (
                  <div
                    className="ml-auto rounded-full shadow-glow"
                    style={{ 
                      width: "6px", 
                      height: "6px", 
                      background: "#ffffff",
                      boxShadow: "0 0 8px #ffffff"
                    }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "20px 12px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="rounded-xl flex items-center gap-3"
          style={{
            background: "rgba(255,255,255,0.03)",
            padding: "12px 12px",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            className="rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ 
              width: "28px", 
              height: "28px", 
              background: "rgba(166,113,101,0.2)",
              border: "1px solid rgba(166,113,101,0.25)"
            }}
          >
            <span style={{ color: "#A67165", fontSize: "13px", fontWeight: 900, fontFamily: "system-ui, sans-serif" }}>c</span>
          </div>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "rgba(242,216,194,0.7)" }}>v0.1.0 • Tauri v2</div>
            <div style={{ fontSize: "10px", color: "rgba(242,216,194,0.3)", fontWeight: 400 }}>Build. Control. Optimize.</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
