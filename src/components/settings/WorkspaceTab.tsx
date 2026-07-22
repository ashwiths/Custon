import * as React from "react"
import { Layers, Plus, Trash2, Copy, Edit2, Check } from "lucide-react"

interface WorkspaceProfile {
  id: string
  name: string
  active: boolean
  shortcutsCount: number
}

const INITIAL_PROFILES: WorkspaceProfile[] = [
  { id: "p1", name: "Stealth Development Mode", active: true, shortcutsCount: 4 },
  { id: "p2", name: "Gaming Focus Preset", active: false, shortcutsCount: 2 },
  { id: "p3", name: "Casual Browse Layout", active: false, shortcutsCount: 1 }
]

export const WorkspaceTab: React.FC = () => {
  const [profiles, setProfiles] = React.useState<WorkspaceProfile[]>(() => {
    const saved = localStorage.getItem("workspace_profiles")
    return saved ? JSON.parse(saved) : INITIAL_PROFILES
  })

  const [autoRestore, setAutoRestore] = React.useState(() => {
    return localStorage.getItem("workspace_auto_restore") !== "false"
  })

  const [rememberPos, setRememberPos] = React.useState(() => {
    return localStorage.getItem("workspace_remember_pos") !== "false"
  })

  const [rememberMonitor, setRememberMonitor] = React.useState(() => {
    return localStorage.getItem("workspace_remember_monitor") !== "false"
  })

  const [rememberVirtualDesktop, setRememberVirtualDesktop] = React.useState(() => {
    return localStorage.getItem("workspace_remember_virtual") === "true"
  })

  const [restoreOrder, setRestoreOrder] = React.useState(() => {
    return localStorage.getItem("workspace_restore_order") !== "false"
  })

  const [restoreSize, setRestoreSize] = React.useState(() => {
    return localStorage.getItem("workspace_restore_size") !== "false"
  })

  const [restoreFocus, setRestoreFocus] = React.useState(() => {
    return localStorage.getItem("workspace_restore_focus") !== "false"
  })

  const [restoreAfterRestart, setRestoreAfterRestart] = React.useState(() => {
    return localStorage.getItem("workspace_restore_after_restart") === "true"
  })

  const [restoreDelay, setRestoreDelay] = React.useState(() => {
    return Number(localStorage.getItem("workspace_restore_delay") || "0.5")
  })

  const [editingProfileId, setEditingProfileId] = React.useState<string | null>(null)
  const [editingProfileName, setEditingProfileName] = React.useState("")

  React.useEffect(() => {
    localStorage.setItem("workspace_profiles", JSON.stringify(profiles))
    localStorage.setItem("workspace_auto_restore", String(autoRestore))
    localStorage.setItem("workspace_remember_pos", String(rememberPos))
    localStorage.setItem("workspace_remember_monitor", String(rememberMonitor))
    localStorage.setItem("workspace_remember_virtual", String(rememberVirtualDesktop))
    localStorage.setItem("workspace_restore_order", String(restoreOrder))
    localStorage.setItem("workspace_restore_size", String(restoreSize))
    localStorage.setItem("workspace_restore_focus", String(restoreFocus))
    localStorage.setItem("workspace_restore_after_restart", String(restoreAfterRestart))
    localStorage.setItem("workspace_restore_delay", String(restoreDelay))
  }, [profiles, autoRestore, rememberPos, rememberMonitor, rememberVirtualDesktop, restoreOrder, restoreSize, restoreFocus, restoreAfterRestart, restoreDelay])

  const selectProfile = (id: string) => {
    setProfiles(prev => prev.map(p => ({ ...p, active: p.id === id })))
  }

  const createProfile = () => {
    const name = prompt("Enter new profile name:")
    if (!name) return
    const newProfile: WorkspaceProfile = {
      id: "p_" + Date.now(),
      name,
      active: false,
      shortcutsCount: 0
    }
    setProfiles(prev => [...prev, newProfile])
  }

  const duplicateProfile = (profile: WorkspaceProfile) => {
    const newProfile: WorkspaceProfile = {
      id: "p_" + Date.now(),
      name: `${profile.name} (Copy)`,
      active: false,
      shortcutsCount: profile.shortcutsCount
    }
    setProfiles(prev => [...prev, newProfile])
  }

  const startRename = (id: string, currentName: string) => {
    setEditingProfileId(id)
    setEditingProfileName(currentName)
  }

  const saveRename = () => {
    if (editingProfileName.trim()) {
      setProfiles(prev => prev.map(p => p.id === editingProfileId ? { ...p, name: editingProfileName } : p))
    }
    setEditingProfileId(null)
  }

  const deleteProfile = (id: string) => {
    const target = profiles.find(p => p.id === id)
    if (target?.active) {
      alert("Cannot delete the active workspace profile. Activate another profile first.")
      return
    }
    if (window.confirm(`Delete profile "${target?.name}"?`)) {
      setProfiles(prev => prev.filter(p => p.id !== id))
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Left Column Behaviors (7 cols) */}
        <div className="md:col-span-7 space-y-3.5">
          {/* Window & Monitor Positioning */}
          <div className="p-4 rounded-xl border border-white/5 bg-black/10 dark:bg-black/25 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-white">Window & Monitor Behaviors</label>
            
            {/* Auto Restore */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="text-left">
                <span className="text-xs font-bold text-[#F2D8C2] uppercase">Auto Restore Workspace</span>
                <p className="text-[9px] text-[#9B8179] font-semibold mt-0.5">Automatically restore previously closed windows on system recovery.</p>
              </div>
              <div
                onClick={() => setAutoRestore(!autoRestore)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  autoRestore ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${autoRestore ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>

            {/* Remember Pos */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="text-left">
                <span className="text-xs font-bold text-[#F2D8C2] uppercase">Remember Window Positions</span>
                <p className="text-[9px] text-[#9B8179] font-semibold mt-0.5">Saves precise coordinate layouts of hidden windows to restore them cleanly.</p>
              </div>
              <div
                onClick={() => setRememberPos(!rememberPos)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  rememberPos ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${rememberPos ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>

            {/* Remember Monitor */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="text-left">
                <span className="text-xs font-bold text-[#F2D8C2] uppercase">Remember Monitors</span>
                <p className="text-[9px] text-[#9B8179] font-semibold mt-0.5">Restores target window windows to their original physical screen monitor.</p>
              </div>
              <div
                onClick={() => setRememberMonitor(!rememberMonitor)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  rememberMonitor ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${rememberMonitor ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>

            {/* Remember Virtual Desktop */}
            <div className="flex items-center justify-between">
              <div className="text-left">
                <span className="text-xs font-bold text-[#F2D8C2] uppercase">Remember Virtual Desktops</span>
                <p className="text-[9px] text-[#9B8179] font-semibold mt-0.5">Allocates restored apps back to their original virtual workspace screens.</p>
              </div>
              <div
                onClick={() => setRememberVirtualDesktop(!rememberVirtualDesktop)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  rememberVirtualDesktop ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${rememberVirtualDesktop ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>
          </div>

          {/* Engine Sizing & Focus Locks */}
          <div className="p-4 rounded-xl border border-white/5 bg-black/10 dark:bg-black/25 space-y-3 font-mono text-[10px]">
            <label className="text-xs font-bold uppercase tracking-wider text-white font-sans">Focus & Sizes</label>
            
            {/* Restore size */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5 font-sans">
              <div className="text-left">
                <span className="text-xs font-bold text-[#F2D8C2] uppercase">Restore Size parameters</span>
                <p className="text-[9px] text-[#9B8179] font-semibold mt-0.5">Forces restored processes back to their saved width/height geometry.</p>
              </div>
              <div
                onClick={() => setRestoreSize(!restoreSize)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  restoreSize ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${restoreSize ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>

            {/* Restore focus */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5 font-sans">
              <div className="text-left">
                <span className="text-xs font-bold text-[#F2D8C2] uppercase">Restore Focus Lock</span>
                <p className="text-[9px] text-[#9B8179] font-semibold mt-0.5">Locks operational system cursor focus directly to the target app on restore.</p>
              </div>
              <div
                onClick={() => setRestoreFocus(!restoreFocus)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  restoreFocus ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${restoreFocus ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>

            {/* Delay Slider */}
            <div className="space-y-1 pt-1.5">
              <div className="flex justify-between text-[#9B8179] font-bold">
                <span>WINDOW RESTORE STAGGER DELAY</span>
                <span>{restoreDelay.toFixed(1)}s</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={restoreDelay}
                onChange={e => setRestoreDelay(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#A67165]"
              />
            </div>
          </div>
        </div>

        {/* Right Column Profiles Manager (5 cols) */}
        <div className="md:col-span-5 bg-black/35 p-5 rounded-2xl border border-white/5 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#9B8179]">Workspace Profiles</span>
            <button
              onClick={createProfile}
              className="p-1 rounded bg-[#A67165] hover:bg-[#734E46] text-white border-none cursor-pointer flex items-center gap-1 text-[8px] uppercase font-bold tracking-wider transition-all"
            >
              <Plus className="w-2.5 h-2.5" />
              <span>Create</span>
            </button>
          </div>

          {/* Profiles grid list */}
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {profiles.map(p => {
              const isEditing = editingProfileId === p.id
              return (
                <div
                  key={p.id}
                  onClick={() => !isEditing && selectProfile(p.id)}
                  className={`p-3 rounded-lg border transition-all flex flex-col justify-between gap-2 select-none cursor-pointer ${
                    p.active
                      ? "border-[#A67165] bg-[#A67165]/10"
                      : "border-white/5 bg-white/5 hover:bg-white/10 text-[#9B8179] hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-[#A67165]" />
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editingProfileName}
                            onChange={e => setEditingProfileName(e.target.value)}
                            onClick={e => e.stopPropagation()}
                            className="bg-black border border-white/20 rounded py-0.5 px-1.5 text-[10px] text-white outline-none font-semibold"
                          />
                          <button
                            onClick={(e) => { e.stopPropagation(); saveRename(); }}
                            className="p-1 bg-emerald-600 rounded text-white border-none cursor-pointer"
                          >
                            <Check className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-white uppercase tracking-wide">{p.name}</span>
                      )}
                    </div>
                    {p.active && <span className="text-[8px] font-bold text-[#A67165] uppercase bg-[#A67165]/20 px-1.5 py-0.5 rounded">ACTIVE</span>}
                  </div>

                  {/* Actions footer */}
                  <div className="flex justify-between items-center text-[9px] pt-1.5 border-t border-white/5 w-full">
                    <span className="font-semibold text-white/50">{p.shortcutsCount} Active Triggers</span>
                    <div className="flex items-center gap-2">
                      {!isEditing && (
                        <button
                          onClick={(e) => { e.stopPropagation(); startRename(p.id, p.name); }}
                          className="p-1 rounded hover:bg-white/10 border-none bg-transparent cursor-pointer text-[#9B8179] hover:text-white"
                          title="Rename Profile"
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); duplicateProfile(p); }}
                        className="p-1 rounded hover:bg-white/10 border-none bg-transparent cursor-pointer text-[#9B8179] hover:text-white"
                        title="Duplicate Profile"
                      >
                        <Copy className="w-2.5 h-2.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteProfile(p.id); }}
                        className="p-1 rounded hover:bg-white/10 border-none bg-transparent cursor-pointer text-[#9B8179] hover:text-rose-500"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
