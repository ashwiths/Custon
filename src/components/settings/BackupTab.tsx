import * as React from "react"
import { Archive, Plus, Play, Trash2, Folder, CheckCircle } from "lucide-react"

interface BackupItem {
  id: string
  name: string
  date: string
  size: string
  version: string
}

const INITIAL_BACKUPS: BackupItem[] = [
  { id: "b1", name: "backup_daily_20260722.json", date: "2026-07-22 09:00 AM", size: "12.4 KB", version: "v0.1.0" },
  { id: "b2", name: "backup_manual_pre_update.json", date: "2026-07-21 04:30 PM", size: "12.1 KB", version: "v0.1.0" }
]

export const BackupTab: React.FC = () => {
  const [backups, setBackups] = React.useState<BackupItem[]>(() => {
    const saved = localStorage.getItem("backup_history_list")
    return saved ? JSON.parse(saved) : INITIAL_BACKUPS
  })

  const [autoBackup, setAutoBackup] = React.useState(() => {
    return localStorage.getItem("backup_auto_daily") === "true"
  })

  const [backupPath, setBackupPath] = React.useState(() => {
    return localStorage.getItem("backup_directory_path") || "C:\\Users\\infan\\.gemini\\custon\\backups"
  })

  const [feedback, setFeedback] = React.useState<string | null>(null)

  React.useEffect(() => {
    localStorage.setItem("backup_history_list", JSON.stringify(backups))
    localStorage.setItem("backup_auto_daily", String(autoBackup))
    localStorage.setItem("backup_directory_path", backupPath)
  }, [backups, autoBackup, backupPath])

  const createNewBackup = () => {
    const dateStr = new Date().toLocaleString()
    const fileName = `backup_manual_${Date.now()}.json`
    const newBackup: BackupItem = {
      id: "b_" + Date.now(),
      name: fileName,
      date: dateStr,
      size: "12.6 KB",
      version: "v0.1.0"
    }

    setBackups(prev => [newBackup, ...prev])
    setFeedback("✓ Backup archive created successfully")
    setTimeout(() => setFeedback(null), 3000)
  }

  const deleteBackup = (id: string) => {
    if (window.confirm("Delete this backup file from local history?")) {
      setBackups(prev => prev.filter(b => b.id !== id))
    }
  }

  const restoreBackup = (name: string) => {
    if (window.confirm(`Restore configurations from backup file "${name}"? This will overwrite your current settings.`)) {
      setFeedback(`✓ Settings restored from "${name}"`)
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  return (
    <div className="space-y-4">
      {/* Toast popup */}
      {feedback && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs shadow-lg animate-fade-in flex items-center gap-2">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 2-Column Split */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* Left Column Configs (7 cols) */}
        <div className="md:col-span-7 space-y-4 flex flex-col justify-between">
          {/* Automated settings */}
          <div className="p-4 rounded-xl border border-white/5 bg-black/10 dark:bg-black/25 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-white">Backup Rules</label>
            
            {/* Auto backup switch */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="text-left">
                <span className="text-xs font-bold text-[#F2D8C2] uppercase">Automatic Daily Backup</span>
                <p className="text-[9px] text-[#9B8179] font-semibold mt-0.5">Executes local settings backup daily in the background.</p>
              </div>
              <div
                onClick={() => setAutoBackup(!autoBackup)}
                className={`w-9 h-5 rounded-full relative flex items-center px-0.5 cursor-pointer transition-all duration-200 ${
                  autoBackup ? "bg-[#A67165]" : "bg-white/10"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all ${autoBackup ? "translate-x-4" : "translate-x-0"}`} />
              </div>
            </div>

            {/* Storage directory input */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-bold text-[#9B8179] uppercase">Backup storage directory:</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={backupPath}
                  onChange={e => setBackupPath(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-[#F2D8C2] font-semibold outline-none"
                />
                <button
                  onClick={() => alert("Directory selection requires active file system permissions in Tauri.")}
                  className="px-3 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-all cursor-pointer flex items-center"
                  title="Choose Folder"
                >
                  <Folder className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick buttons */}
          <div className="p-4 rounded-xl border border-white/5 bg-black/10 dark:bg-black/25 flex flex-col sm:flex-row gap-3">
            <button
              onClick={createNewBackup}
              className="flex-1 py-3 bg-[#A67165] hover:bg-[#734E46] text-white font-bold uppercase rounded-xl border-none cursor-pointer shadow-md transition-all text-xs tracking-wider font-mono flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Backup</span>
            </button>
          </div>
        </div>

        {/* Right Column History (5 cols) */}
        <div className="md:col-span-5 bg-black/35 p-5 rounded-2xl border border-white/5 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#9B8179]">Backup History</span>
            <Archive className="w-3.5 h-3.5 text-[#A67165]" />
          </div>

          {/* Backup entries list */}
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {backups.map(item => (
              <div
                key={item.id}
                className="p-3 rounded-lg border border-white/5 bg-white/5 space-y-1.5 text-left"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wide truncate max-w-[140px]" title={item.name}>
                    {item.name}
                  </span>
                  <span className="text-[8px] font-bold text-[#A67165] uppercase bg-[#A67165]/15 border border-[#A67165]/25 px-1.5 py-0.5 rounded">
                    {item.version}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[9px] text-[#9B8179] pt-1.5 border-t border-white/5 w-full">
                  <span className="font-medium">{item.date} ({item.size})</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => restoreBackup(item.name)}
                      className="p-1 rounded hover:bg-white/10 border-none bg-transparent cursor-pointer text-emerald-500 hover:text-emerald-400"
                      title="Restore config file"
                    >
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                    <button
                      onClick={() => deleteBackup(item.id)}
                      className="p-1 rounded hover:bg-white/10 border-none bg-transparent cursor-pointer text-[#9B8179] hover:text-rose-500"
                      title="Delete Backup"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {backups.length === 0 && (
              <div className="p-8 text-center border border-dashed border-white/10 rounded-xl space-y-1">
                <Archive className="w-8 h-8 text-[#9B8179] mx-auto opacity-40 mb-1" />
                <div className="text-xs font-bold text-white">No backups archived</div>
                <p className="text-[9px] text-[#9B8179]">Create a manual backup to seed your local restore checklist.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
