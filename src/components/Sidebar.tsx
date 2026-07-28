import { LayoutDashboard, AppWindow, Sliders, Zap, Settings, HelpCircle } from "lucide-react"
import { cn } from "@/utils/cn"
import { InteractiveDial } from "@/components/InteractiveDial"

import logoIcon from "@/assets/logo_icon.png"

export type ActivePage = "dashboard" | "create-app-shortcut" | "customize-keys" | "target-shortcuts" | "settings" | "help"

interface SidebarProps {
  currentPage: ActivePage
  setCurrentPage: (page: ActivePage) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const menuItems = [
    { id: "dashboard" as ActivePage, label: "Dashboard", icon: LayoutDashboard },
    { id: "create-app-shortcut" as ActivePage, label: "Target Apps", icon: AppWindow },
    { id: "customize-keys" as ActivePage, label: "Customize Keys", icon: Sliders },
    { id: "target-shortcuts" as ActivePage, label: "Active Shortcuts", icon: Zap },
    { id: "settings" as ActivePage, label: "Settings", icon: Settings },
    { id: "help" as ActivePage, label: "Help & Support", icon: HelpCircle },
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
        <img src={logoIcon} alt="Custon" style={{ width: "36px", height: "36px" }} />
        <div>
          <span style={{ fontSize: "17px", fontWeight: 900, color: "#F2D8C2", letterSpacing: "1px" }}>CUSTON</span>
          <span style={{ display: "block", fontSize: "10px", fontWeight: 600, color: "rgba(242,216,194,0.35)", letterSpacing: "1.5px" }}>Shortcuts</span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav style={{ padding: "20px 12px", flex: 1 }}>
        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", color: "rgba(242,216,194,0.3)", padding: "0 12px 10px", textTransform: "uppercase" }}>
          Navigation
        </div>
        <div className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={cn(
                  "nav-item flex items-center gap-3 w-full text-left transition-all duration-200 cursor-pointer",
                  isActive && "active"
                )}
                style={{
                  height: "46px",
                  padding: "0 16px",
                  borderRadius: "14px",
                  fontSize: "14px",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#FFFFFF" : "rgba(242,216,194,0.55)",
                  background: isActive
                    ? "var(--accent-color, #A67165)"
                    : "transparent",
                  border: isActive ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
                  boxShadow: isActive ? "0 4px 16px rgba(166,113,101,0.3)" : "none",
                }}
              >
                <item.icon style={{ width: "18px", height: "18px", opacity: isActive ? 1 : 0.7 }} />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
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

      {/* Docked Track Dial Widget */}
      <div className="py-2 flex justify-center border-t border-white/5 bg-black/10">
        <InteractiveDial />
      </div>

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
              background: "rgba(var(--accent-color-rgb, 166,113,101), 0.2)",
              border: "1px solid rgba(var(--accent-color-rgb, 166,113,101), 0.3)"
            }}
          >
            <span style={{ color: "var(--accent-color, #A67165)", fontSize: "13px", fontWeight: 900, fontFamily: "system-ui, sans-serif" }}>c</span>
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
