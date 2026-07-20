import * as React from "react"
import { 
  Keyboard, 
  Search, 
  CheckCircle2, 
  Check, 
  ArrowLeft 
} from "lucide-react"

// Handcrafted SVG Icons for Application Logos
const ChromeIcon: React.FC = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#ECEFF1"/>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#F4B400"/>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 9.27364 20.9069 6.80236 19.1292 5L12 12V22Z" fill="#0F9D58"/>
    <path d="M12 2C9.40428 2 7.03923 2.98636 5.25012 4.6062L9.25012 11.5344L12 2Z" fill="#DB4437"/>
    <circle cx="12" cy="12" r="4.5" fill="#FFFFFF"/>
    <circle cx="12" cy="12" r="3.5" fill="#4285F4"/>
  </svg>
)

const VSCodeIcon: React.FC = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 18V6L9 2L22 7V17L9 22L2 18Z" fill="#007ACC" opacity="0.1" />
    <path d="M17.5 4.5L14 8L3.5 5.5V18.5L14 16L17.5 19.5L21 17.5V6.5L17.5 4.5Z" fill="#007ACC" />
    <path d="M17.5 4.5L3.5 16.5L1.5 15V9L3.5 7.5L17.5 19.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const DiscordIcon: React.FC = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="#5865F2" />
    <path d="M17.5 8.5C17.5 8.5 16.5 7.5 14.5 7.5L14.2 8C15.8 8.5 16.5 9.5 16.5 9.5C15.5 9 14.5 8.7 13.5 8.5C12.5 8.3 11.5 8.3 10.5 8.5C9.5 8.7 8.5 9 7.5 9.5C7.5 9.5 8.2 8.5 9.8 8L9.5 7.5C7.5 7.5 6.5 8.5 6.5 8.5C6.5 8.5 5.5 12 6.5 15.5C7.5 16.5 9 17 9 17L9.8 15.7C8.5 15.3 8 14.5 8 14.5C8.5 14.7 9 15 10 15.3C11 15.5 12 15.5 13 15.3C14 15 14.5 14.7 15 14.5C15 14.5 14.5 15.3 13.2 15.7L14 17C14 17 15.5 16.5 16.5 15.5C17.5 12 17.5 8.5 17.5 8.5Z" fill="white" />
    <circle cx="9.5" cy="12" r="0.8" fill="#5865F2" />
    <circle cx="13.5" cy="12" r="0.8" fill="#5865F2" />
  </svg>
)

const SpotifyIcon: React.FC = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#1DB954" />
    <path d="M16.5 8.5C14.2 7.2 10.3 7 8 7.7C7.6 7.8 7.3 7.6 7.2 7.2C7.1 6.8 7.3 6.5 7.7 6.4C10.4 5.6 14.7 5.8 17.3 7.3C17.7 7.5 17.8 8 17.6 8.3C17.3 8.6 16.9 8.7 16.5 8.5ZM16.4 10.8C14.4 9.6 11.2 9.2 8.8 10C8.4 10.1 8 9.9 7.9 9.5C7.8 9.1 8 8.7 8.4 8.6C11.2 7.8 14.7 8.2 17 9.6C17.4 9.8 17.5 10.3 17.3 10.6C17.1 11 16.7 11.1 16.4 10.8ZM15.2 13C13.5 12 11.3 11.8 9 12.5C8.6 12.6 8.2 12.4 8.1 12C8 11.6 8.2 11.2 8.6 11.1C11.2 10.3 13.6 10.6 15.5 11.8C15.9 12 16 12.5 15.8 12.8C15.6 13.1 15.2 13.2 15.2 13Z" fill="white" />
  </svg>
)

const EdgeIcon: React.FC = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="url(#edgeGrad)" />
    <path d="M12 5C8.5 5 5.5 8 5.5 12C5.5 17 9.5 18 12.5 18C16.5 18 18.5 15 18.5 12C18.5 9 16.5 7 14.5 7C13 7 12 8 12 9.5C12 11 13.5 11.5 13.5 13C13.5 14.5 11.5 15.5 10 15.5C8.5 15.5 7 14.5 7 12.5C7 10.5 8.5 9 11.5 9V5Z" fill="white" />
    <defs>
      <linearGradient id="edgeGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0078D7" />
        <stop offset="0.5" stopColor="#00B7F3" />
        <stop offset="1" stopColor="#3FE085" />
      </linearGradient>
    </defs>
  </svg>
)

interface CreateAppShortcutProps {
  onBack: () => void
  onSave: (shortcutName: string, selectedApps: string[], keys: string[]) => void
}

export const CreateAppShortcut: React.FC<CreateAppShortcutProps> = ({ onBack, onSave }) => {
  const [shortcutName, setShortcutName] = React.useState("")
  const [selectedApps, setSelectedApps] = React.useState<string[]>([])
  const [keyCombo, setKeyCombo] = React.useState("")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isRecording, setIsRecording] = React.useState(false)
  const [customAppName, setCustomAppName] = React.useState("")
  const [customApps, setCustomApps] = React.useState<{ id: string, name: string, desc: string, icon: React.ReactNode }[]>([])

  const defaultApps = [
    { id: "chrome", name: "Google Chrome", desc: "Web Browser", icon: <ChromeIcon /> },
    { id: "vscode", name: "VS Code", desc: "Code Editor", icon: <VSCodeIcon /> },
    { id: "discord", name: "Discord", desc: "Voice & Text Chat", icon: <DiscordIcon /> },
    { id: "spotify", name: "Spotify", desc: "Music Streaming", icon: <SpotifyIcon /> },
    { id: "edge", name: "Microsoft Edge", desc: "Web Browser", icon: <EdgeIcon /> },
  ]

  const allApps = [...defaultApps, ...customApps]

  const filteredApps = allApps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.desc.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleKeyRecorder = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const keys: string[] = []
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
      setKeyCombo(keys.join(" + "))
    }
  }

  const handleToggleApp = (appId: string) => {
    if (selectedApps.includes(appId)) {
      setSelectedApps(selectedApps.filter(id => id !== appId))
    } else {
      setSelectedApps([...selectedApps, appId])
    }
  }

  const handleAddCustomApp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customAppName.trim()) return
    const formattedId = customAppName.trim().toLowerCase().replace(/\s+/g, "-")
    
    if (allApps.some(app => app.id === formattedId)) {
      setSelectedApps([...selectedApps, formattedId])
      setCustomAppName("")
      return
    }

    const newApp = {
      id: formattedId,
      name: customAppName.trim(),
      desc: "Custom Application",
      icon: (
        <div className="w-5 h-5 rounded bg-gradient-to-tr from-[#A67165] to-[#734E46] flex items-center justify-center text-[10px] font-black text-white uppercase">
          {customAppName.trim().substring(0, 2)}
        </div>
      )
    }

    setCustomApps([...customApps, newApp])
    setSelectedApps([...selectedApps, formattedId])
    setCustomAppName("")
  }

  const handleSave = () => {
    if (selectedApps.length === 0) return
    const keys = keyCombo.trim() ? keyCombo.split("+").map(k => k.trim()) : ["Ctrl", "Shift", "S"]
    onSave(shortcutName, selectedApps, keys)
  }

  return (
    <div className="space-y-8 animate-fade-up select-none pb-8 relative text-left">
      <div className="flex items-center gap-4 border-b border-white/10 pb-4">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-white/20 dark:bg-white/5 border border-white/15 hover:bg-white/40 dark:hover:bg-white/10 flex items-center justify-center text-[#252326] dark:text-[#F2D8C2] cursor-pointer transition-all duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-[26px] font-black text-[#252326] dark:text-[#F2D8C2]">
            Create Workspace Shortcut
          </h1>
          <p className="text-sm font-semibold text-[#6B5B54] dark:text-[#A69281]">
            Add selectable applications and assign custom keyboard trigger bounds.
          </p>
        </div>
      </div>

      <div className="glass-card p-8 border-[rgba(255,255,255,0.28)]" style={{ borderRadius: "24px" }}>
        <div className="space-y-2 max-w-[600px]">
          <label className="text-xs font-bold text-[#A67165] dark:text-[#C98D74] uppercase tracking-wider block">
            Shortcut Name (Optional)
          </label>
          <input 
            type="text"
            value={shortcutName}
            onChange={(e) => setShortcutName(e.target.value)}
            placeholder="e.g. Workspace Clean, Study Setup, Social Hub"
            className="w-full text-base px-5 py-3.5 rounded-xl border border-white/20 bg-white/20 dark:bg-white/5 backdrop-blur-md outline-none text-[#252326] dark:text-[#F2D8C2] placeholder:text-[#9B8179]/50 focus:border-[#A67165] font-semibold"
          />
        </div>
      </div>

      <div className="glass-card p-8 border-[rgba(255,255,255,0.28)]" style={{ borderRadius: "24px" }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#252326] dark:text-[#F2D8C2]">Select Applications</h3>
            <p className="text-xs text-[#6B5B54] dark:text-[#A69281] font-semibold">Click cards to select target applications.</p>
          </div>
          <div className="relative w-full max-w-[280px]">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PC apps..."
              className="w-full text-xs px-4 py-2.5 pl-10 rounded-xl border border-white/20 bg-white/20 dark:bg-white/5 outline-none text-[#252326] dark:text-[#F2D8C2]"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9B8179]" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
          {filteredApps.map((app) => {
            const isSelected = selectedApps.includes(app.id)
            return (
              <div
                key={app.id}
                onClick={() => handleToggleApp(app.id)}
                className={`relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between text-left select-none ${
                  isSelected 
                    ? "bg-[rgba(166,113,101,0.08)] border-[#A67165] scale-[1.02]" 
                    : "bg-white/10 dark:bg-white/5 border-white/12 hover:border-white/30"
                }`}
              >
                {isSelected && <CheckCircle2 className="absolute top-3 right-3 h-4 w-4 text-[#A67165]" />}
                <div className="w-10 h-10 rounded-xl bg-white/50 dark:bg-white/10 flex items-center justify-center border border-white/20 mb-3">
                  {app.icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#252326] dark:text-[#F2D8C2] truncate">{app.name}</div>
                  <div className="text-[10px] text-[#9B8179] dark:text-[#8C7B6E] font-medium truncate">{app.desc}</div>
                </div>
              </div>
            )
          })}
        </div>

        <form onSubmit={handleAddCustomApp} className="flex gap-2 max-w-[500px] border-t border-white/10 pt-4">
          <input
            type="text"
            value={customAppName}
            onChange={(e) => setCustomAppName(e.target.value)}
            placeholder="App not listed? Type custom application name..."
            className="flex-1 text-xs px-4 py-2.5 rounded-xl border border-white/15 bg-white/20 dark:bg-white/5 outline-none text-[#252326] dark:text-[#F2D8C2]"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#A67165] hover:bg-[#734E46] transition-all border-none cursor-pointer"
          >
            + Add App
          </button>
        </form>
      </div>

      <div className="glass-card p-8 border-[rgba(255,255,255,0.28)]" style={{ borderRadius: "24px" }}>
        <div className="space-y-2 max-w-[600px]">
          <label className="text-xs font-bold text-[#A67165] dark:text-[#C98D74] uppercase tracking-wider block">
            Assign Custom Shortcut (Keyboard Input)
          </label>
          <div className="relative">
            <input 
              type="text"
              value={keyCombo}
              onKeyDown={handleKeyRecorder}
              onFocus={() => setIsRecording(true)}
              onBlur={() => setIsRecording(false)}
              readOnly
              placeholder={isRecording ? "Press your shortcut keys..." : "Type key combination (e.g. Ctrl + Shift + P)"}
              className="w-full text-base px-5 py-3.5 pl-12 rounded-xl border border-white/20 bg-white/20 dark:bg-white/5 outline-none text-[#252326] dark:text-[#F2D8C2] font-mono font-semibold"
            />
            <Keyboard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9B8179]" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3.5 border-t border-white/10 pt-6">
        <button onClick={onBack} className="btn-secondary py-3 px-8 text-sm font-semibold rounded-xl">
          Cancel
        </button>
        <button 
          onClick={handleSave}
          disabled={selectedApps.length === 0}
          className={`btn-primary py-3 px-8 text-sm font-semibold rounded-xl flex items-center gap-1.5 ${
            selectedApps.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Check className="h-4 w-4" />
          <span>Apply & Save</span>
        </button>
      </div>
    </div>
  )
}
