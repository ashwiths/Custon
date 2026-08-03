import * as React from "react"
import * as ReactDOM from "react-dom"
import { invoke } from "@tauri-apps/api/core"
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Sliders, 
  Command, 
  Monitor,
  Folder,
  LayoutGrid,
  ShieldAlert,
  Trash2,
  AlertTriangle,
  X,
  CheckCircle2,
  Keyboard,
  Copy,
  Scissors,
  Clipboard,
  RotateCcw,
  Camera,
  Power,
  Check
} from "lucide-react"
import { ToggleSwitch } from "@/components/ToggleSwitch"
import { 
  KeyShortcutItem, 
  ShortcutCategory, 
  DEFAULT_KEY_SHORTCUTS, 
  COMMON_CONFLICT_SHORTCUTS 
} from "@/types/allKeysShortcuts"
import { checkShortcutConflict, normalizeCombo } from "@/utils/shortcutConflict"

interface CustomizeAllKeysProps {
  onBack: () => void
}

const STORAGE_KEY = "custom_all_key_shortcuts"

const CATEGORIES: { id: ShortcutCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: "All Shortcuts", label: "All Shortcuts", icon: Sliders },
  { id: "General Shortcuts", label: "General Keys", icon: Command },
]

export const CustomizeAllKeys: React.FC<CustomizeAllKeysProps> = ({ onBack }) => {
  const [shortcuts, setShortcuts] = React.useState<KeyShortcutItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return DEFAULT_KEY_SHORTCUTS.map(def => {
            const match = parsed.find((p: KeyShortcutItem) => p.action === def.action || p.id === def.id)
            return match ? { ...def, customShortcut: match.customShortcut || "", status: match.status !== undefined ? match.status : false } : def
          })
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_KEY_SHORTCUTS
  })

  const [activeCategory, setActiveCategory] = React.useState<ShortcutCategory>("All Shortcuts")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)

  // DEDICATED RECORDING PAGE STATE
  const [customizingShortcut, setCustomizingShortcut] = React.useState<KeyShortcutItem | null>(null)
  const [recordedKeys, setRecordedKeys] = React.useState("")
  const [isRecording, setIsRecording] = React.useState(false)
  const [showConflictNotice, setShowConflictNotice] = React.useState(false)
  const [showConfirmModal, setShowConfirmModal] = React.useState(false)

  // Add New Custom Shortcut state
  const [isAddingNew, setIsAddingNew] = React.useState(false)
  const [newActionName, setNewActionName] = React.useState("")
  const [newCategory, setNewCategory] = React.useState<Exclude<ShortcutCategory, "All Shortcuts">>("General Shortcuts")
  const [newDefaultKey, setNewDefaultKey] = React.useState("")
  const [conflictName, setConflictName] = React.useState<string>("")

  const syncWithBackend = async (items: KeyShortcutItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Ignore
    }

    try {
      await invoke("sync_all_key_shortcuts", { shortcuts: items })
    } catch {
      // Browser fallback
    }
  }

  React.useEffect(() => {
    syncWithBackend(shortcuts)
  }, [])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2500)
  }

  const getConflictInfo = (keyCombo: string, currentId?: string) => {
    if (!keyCombo.trim()) return { hasConflict: false }

    const check = checkShortcutConflict(keyCombo, currentId, shortcuts)
    if (check.hasConflict) {
      return check
    }

    const normalized = normalizeCombo(keyCombo)
    if (COMMON_CONFLICT_SHORTCUTS.some(c => normalizeCombo(c) === normalized)) {
      return { hasConflict: true, conflictName: "Windows System Hotkey" }
    }

    return { hasConflict: false }
  }

  // Open dedicated key recording page for a shortcut
  const openRecordingPage = (item: KeyShortcutItem) => {
    setCustomizingShortcut(item)
    setRecordedKeys(item.customShortcut)
    setConflictName("")
    setShowConflictNotice(false)
    setIsRecording(true)

    if (item.customShortcut) {
      const conflict = getConflictInfo(item.customShortcut, item.id)
      if (conflict.hasConflict) {
        setShowConflictNotice(true)
        setConflictName(conflict.conflictName || "another shortcut")
      }
    }
  }

  // Key recorder keydown event handler
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
      else if (key === "CapsLock") friendlyKey = "CapsLock"
      else if (key === "NumLock") friendlyKey = "NumLock"
      else if (key === "Insert") friendlyKey = "Insert"
      else if (key === "PrintScreen") friendlyKey = "PrtScn"
      else if (key.length === 1) friendlyKey = key.toUpperCase()
      
      keys.push(friendlyKey)
    }

    if (keys.length > 0) {
      const comboStr = keys.join(" + ")
      setRecordedKeys(comboStr)

      const isModifierOnly = ["Control", "Shift", "Alt", "Meta"].includes(key)
      if (!isModifierOnly) {
        const conflict = getConflictInfo(comboStr, customizingShortcut?.id)
        if (conflict.hasConflict) {
          setShowConflictNotice(true)
          setConflictName(conflict.conflictName || "another active shortcut")
        } else {
          setShowConflictNotice(false)
          setConflictName("")
        }
      } else {
        setShowConflictNotice(false)
        setConflictName("")
      }
    }
  }

  // Apply & save custom shortcut immediately
  const handleApplyCustomKey = () => {
    if (!customizingShortcut) return

    const trimmed = recordedKeys.trim()
    if (!trimmed) {
      showToast("⚠️ Please press a key combination to assign!")
      return
    }

    // Check if recordedKeys is incomplete (modifier-only without a main key)
    const parts = trimmed.split(" + ").map(p => p.trim())
    const lastPart = parts[parts.length - 1]
    const isModifierOnly = ["Ctrl", "Alt", "Shift", "Win", "Control", "Meta"].includes(lastPart)

    if (isModifierOnly) {
      showToast("⚠️ Incomplete hotkey! Please include a main key (e.g. Ctrl + Shift + C)")
      return
    }

    // Check if hotkey is already in use by another shortcut
    const conflictResult = checkShortcutConflict(trimmed, customizingShortcut.id, shortcuts)
    if (conflictResult.hasConflict) {
      showToast(`⚠️ REPEATED KEY WARNING! "${trimmed}" is already assigned to ${conflictResult.conflictName}. Please do not use repeated keys!`)
      setShowConflictNotice(true)
      setConflictName(conflictResult.conflictName || "another active shortcut")
      return
    }

    confirmAndSaveKey()
  }

  // Save shortcut to state/backend and navigate back
  const confirmAndSaveKey = () => {
    if (!customizingShortcut) return

    const updated = shortcuts.map(s => s.id === customizingShortcut.id ? {
      ...s,
      customShortcut: recordedKeys.trim(),
      status: true
    } : s)

    setShortcuts(updated)
    syncWithBackend(updated)

    showToast(`✓ Custom shortcut for "${customizingShortcut.action}" assigned & enabled!`)
    setShowConfirmModal(false)
    setCustomizingShortcut(null)
    setRecordedKeys("")
    setShowConflictNotice(false)
  }

  // Remove Custom Shortcut
  const handleRemoveCustomKey = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const updated = shortcuts.map(s => s.id === id ? { ...s, customShortcut: "" } : s)
    setShortcuts(updated)
    syncWithBackend(updated)
    showToast(`✓ Custom shortcut removed`)
  }

  // Create & Save New Action
  const handleSaveNewAction = () => {
    if (!newActionName.trim()) {
      showToast("Please enter an action name!")
      return
    }

    const newItem: KeyShortcutItem = {
      id: `custom-ks-${Date.now()}`,
      action: newActionName.trim(),
      category: newCategory,
      defaultShortcut: newDefaultKey.trim() || "None",
      customShortcut: "",
      status: true,
      systemAction: "custom_action"
    }

    const updated = [newItem, ...shortcuts]
    setShortcuts(updated)
    syncWithBackend(updated)
    setIsAddingNew(false)
    setNewActionName("")
    setNewDefaultKey("")
    showToast(`✓ Added new shortcut "${newItem.action}"`)
    
    // Automatically open recording page for new item
    openRecordingPage(newItem)
  }

  const handleToggleStatus = (id: string, newStatus: boolean) => {
    const updated = shortcuts.map(s => s.id === id ? { ...s, status: newStatus } : s)
    setShortcuts(updated)
    syncWithBackend(updated)
    showToast(`✓ Status updated`)
  }

  const handleDeleteShortcut = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const item = shortcuts.find(s => s.id === id)
    const updated = shortcuts.filter(s => s.id !== id)
    setShortcuts(updated)
    syncWithBackend(updated)
    showToast(`✓ Deleted "${item?.action}"`)
  }

  const handleRestoreAllDefaults = () => {
    setShortcuts(DEFAULT_KEY_SHORTCUTS)
    syncWithBackend(DEFAULT_KEY_SHORTCUTS)
    showToast(`✓ Restored all shortcuts to default`)
  }

  // Filtering (Memoized for max performance)
  const filteredShortcuts = React.useMemo(() => {
    return shortcuts.filter(s => {
      const matchesCategory = activeCategory === "All Shortcuts" || s.category === activeCategory
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch = !query || 
        s.action.toLowerCase().includes(query) ||
        s.defaultShortcut.toLowerCase().includes(query) ||
        s.customShortcut.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [shortcuts, activeCategory, searchQuery])

  // Get action icon
  const getActionIcon = (actionName: string) => {
    const lower = actionName.toLowerCase()
    if (lower.includes("desktop")) return <Monitor className="w-5 h-5 text-[#A67165]" />
    if (lower.includes("explorer")) return <Folder className="w-5 h-5 text-[#A67165]" />
    if (lower.includes("settings")) return <Sliders className="w-5 h-5 text-[#A67165]" />
    if (lower.includes("run")) return <Command className="w-5 h-5 text-[#A67165]" />
    if (lower.includes("search")) return <Search className="w-5 h-5 text-[#A67165]" />
    if (lower.includes("task view") || lower.includes("virtual")) return <LayoutGrid className="w-5 h-5 text-[#A67165]" />
    if (lower.includes("lock")) return <Power className="w-5 h-5 text-[#A67165]" />
    if (lower.includes("screenshot") || lower.includes("snip")) return <Camera className="w-5 h-5 text-[#A67165]" />
    if (lower.includes("copy")) return <Copy className="w-5 h-5 text-[#A67165]" />
    if (lower.includes("cut")) return <Scissors className="w-5 h-5 text-[#A67165]" />
    if (lower.includes("paste")) return <Clipboard className="w-5 h-5 text-[#A67165]" />
    if (lower.includes("undo")) return <RotateCcw className="w-5 h-5 text-[#A67165]" />
    return <Keyboard className="w-5 h-5 text-[#A67165]" />
  }

  // =========================================================================
  // VIEW MODE 2: DEDICATED KEY RECORDING PAGE (FOR ASSIGNING / CUSTOMIZING KEY)
  // =========================================================================
  if (customizingShortcut) {
    return (
      <div className="w-full space-y-6 animate-fade-up select-none pb-12 relative text-left">
        {/* Handcrafted Ambient lighting glows */}
        <div className="ambient-glow bg-[#A67165] w-[400px] h-[400px] top-[-100px] left-[-100px] opacity-[0.2]"></div>
        <div className="ambient-glow bg-[#C98D74] w-[400px] h-[400px] top-[20%] right-[-100px] opacity-[0.15]"></div>

        {/* TOP NAV & HEADER */}
        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
          <button 
            onClick={() => setCustomizingShortcut(null)}
            className="w-10 h-10 rounded-xl bg-white/20 dark:bg-white/5 border border-white/15 hover:bg-white/40 dark:hover:bg-white/10 flex items-center justify-center text-[#252326] dark:text-[#F2D8C2] cursor-pointer transition-all duration-200"
            title="Back to Shortcuts List"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-[24px] font-black text-[#252326] dark:text-[#F2D8C2]">
              Customize Key for "{customizingShortcut.action}"
            </h1>
            <p className="text-xs font-semibold text-[#6B5B54] dark:text-[#A69281]">
              Record your custom shortcut. Both original Windows shortcut and your custom shortcut will work simultaneously.
            </p>
          </div>
        </div>

        {/* MAIN DEDICATED RECORDING CARD CONTAINER */}
        <div className="glass-card max-w-xl mx-auto p-8 rounded-[28px] border-[rgba(255,255,255,0.22)] shadow-2xl space-y-6 bg-[#1E1B1A]">
          {/* Action Information Header */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
              {getActionIcon(customizingShortcut.action)}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{customizingShortcut.action}</h3>
                <span className="px-2 py-0.5 rounded-md bg-[#A67165]/20 text-[#F2D8C2] text-[10px] font-bold uppercase">
                  {customizingShortcut.category}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#A69281]">
                <span>Default Windows Key:</span>
                <span className="font-mono text-white font-bold bg-white/10 px-2 py-0.5 rounded border border-white/15">
                  {customizingShortcut.defaultShortcut}
                </span>
              </div>
            </div>
          </div>

          {/* KEY RECORDER BOX */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#A67165] uppercase tracking-wider flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-[#A67165]" />
                <span>Press Desired Key Combination</span>
              </label>
              {isRecording && <span className="text-[11px] text-amber-400 animate-pulse font-bold">RECORDING KEYS...</span>}
            </div>

            <div className="relative">
              <input 
                type="text"
                readOnly
                autoFocus
                value={recordedKeys}
                onKeyDown={handleKeyRecorder}
                onFocus={() => setIsRecording(true)}
                onBlur={() => setIsRecording(false)}
                placeholder="Click here and press key combo (e.g. Ctrl + Alt + E)"
                className="w-full px-5 py-4 rounded-2xl bg-[#A67165]/15 border-2 border-[#A67165] text-base font-mono font-bold text-[#F2D8C2] cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#A67165]/30 transition-all text-center"
              />
              {recordedKeys && (
                <button 
                  onClick={() => setRecordedKeys("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white border-none bg-transparent cursor-pointer"
                  title="Clear Key"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <p className="text-[11px] text-[#A69281] text-center">
              Press any combination of Ctrl, Alt, Shift, Win + letter/number/symbol key.
            </p>
          </div>

          {/* CONFLICT WARNING BANNER */}
          {showConflictNotice && (
            <div className="p-4 rounded-2xl bg-red-500/20 border-2 border-red-500/60 text-red-200 text-xs space-y-2 leading-relaxed animate-fade-up">
              <div className="flex items-center gap-2 font-bold text-red-300 text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
                <span>⚠️ REPEATED KEY WARNING! DO NOT REPEAT KEYS</span>
              </div>
              <p>
                The key combination <strong className="text-white font-mono bg-black/60 px-2 py-0.5 rounded border border-white/20">{recordedKeys}</strong> is already assigned to <strong className="text-red-300 font-bold">{conflictName}</strong>.
              </p>
              <p className="text-red-300 font-bold bg-red-950/40 p-2 rounded-xl border border-red-500/30">
                ⚠️ Repeated shortcut keys are not allowed! Please press a different key combination to avoid conflicts.
              </p>
            </div>
          )}

          {/* ACTION BUTTONS (APPLY & NAVIGATE BACK) */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            {customizingShortcut.customShortcut ? (
              <button
                type="button"
                onClick={() => handleRemoveCustomKey(customizingShortcut.id)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove Custom Key</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCustomizingShortcut(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleApplyCustomKey()}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#A67165] to-[#734E46] hover:from-[#734E46] hover:to-[#A67165] shadow-lg border-none cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Apply Shortcut</span>
              </button>
            </div>
          </div>
        </div>

        {/* TRANSPARENT GLASS CONFLICT & CONFIRMATION POPUP MODAL VIA PORTAL */}
        {showConfirmModal && ReactDOM.createPortal(
          <div className="fixed inset-0 w-screen h-screen z-[999999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto select-none animate-fade-in">
            <div className="glass-card max-w-[460px] w-full p-6 rounded-[24px] border border-white/20 bg-[#181617]/95 shadow-[0_25px_60px_rgba(0,0,0,0.8)] space-y-5 text-left relative overflow-hidden my-auto">
              {/* Ambient Glow */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#A67165]/30 rounded-full blur-2xl pointer-events-none"></div>

              {/* MODAL HEADER */}
              <div className="flex items-center gap-3.5 border-b border-white/10 pb-4">
                <div className="w-11 h-11 rounded-2xl bg-[#A67165]/20 border border-[#A67165]/40 flex items-center justify-center shrink-0 text-[#F2D8C2] shadow-md">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white leading-tight">Shortcut Confirmation</h3>
                  <p className="text-[11px] font-medium text-[#A69281]">Review custom hotkey assignment & conflict status</p>
                </div>
              </div>

              {/* MODAL BODY CONTENT */}
              <div className="space-y-3 text-xs leading-relaxed text-white/90">
                {/* Action Info Row */}
                <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#A69281]">Target Action:</span>
                  <span className="text-xs font-bold text-white">{customizingShortcut.action}</span>
                </div>

                {/* Key Combo Row */}
                <div className="p-3 rounded-xl bg-[#A67165]/20 border border-[#A67165]/40 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F2D8C2]">Custom Shortcut:</span>
                  <kbd className="px-2.5 py-0.5 rounded-lg bg-black/60 border border-[#A67165]/40 font-mono font-bold text-xs text-[#F2D8C2]">
                    {recordedKeys}
                  </kbd>
                </div>

                {/* Conflict Notice */}
                {getConflictInfo(recordedKeys, customizingShortcut?.id).hasConflict ? (
                  <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-200 text-xs space-y-1.5 leading-relaxed">
                    <div className="flex items-center gap-2 font-bold text-amber-400">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Windows Hotkey Conflict Notice</span>
                    </div>
                    <p className="text-[11px] opacity-90">
                      <strong className="font-mono text-amber-100">{recordedKeys}</strong> is a standard Windows shortcut. It may trigger default Windows actions alongside your custom action.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span className="text-[11px] font-semibold">No system hotkey conflict detected. Ready to apply!</span>
                  </div>
                )}

                {/* Dual-Key Notice */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-[#A69281] leading-relaxed">
                  Note: The default Windows key (<strong className="text-white font-mono">{customizingShortcut.defaultShortcut}</strong>) and your custom key will work concurrently.
                </div>
              </div>

              {/* MODAL FOOTER BUTTONS */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <span>Change Key</span>
                </button>
                <button
                  type="button"
                  onClick={confirmAndSaveKey}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#A67165] to-[#734E46] hover:from-[#734E46] hover:to-[#A67165] shadow-lg border-none cursor-pointer flex items-center justify-center gap-2 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm & Apply</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    )
  }

  // =========================================================================
  // VIEW MODE 1: MAIN SHORTCUTS LIST VIEW (WITH 2-COLUMN SPLIT GRID)
  // =========================================================================
  return (
    <div className="w-full space-y-6 animate-fade-up select-none pb-12 relative text-left">
      {/* Handcrafted Ambient lighting glows */}
      <div className="ambient-glow bg-[#A67165] w-[350px] h-[350px] top-[-120px] left-[-150px] opacity-[0.18]"></div>
      <div className="ambient-glow bg-[#C98D74] w-[400px] h-[400px] top-[15%] right-[-100px] opacity-[0.14]"></div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#252326] text-[#F2D8C2] border border-[#A67165] p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-up max-w-[420px]">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold leading-relaxed flex-1">{toastMessage}</p>
          <button onClick={() => setToastMessage(null)} className="text-white/50 hover:text-white border-none bg-transparent cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white/20 dark:bg-white/5 border border-white/15 hover:bg-white/40 dark:hover:bg-white/10 flex items-center justify-center text-[#252326] dark:text-[#F2D8C2] cursor-pointer transition-all duration-200"
            title="Back to Dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-[26px] font-black text-[#252326] dark:text-[#F2D8C2] flex items-center gap-2">
              Customize All Key Shortcuts
            </h1>
            <p className="text-xs font-semibold text-[#6B5B54] dark:text-[#A69281] max-w-[650px] leading-relaxed">
              Customize major Windows shortcuts. Select any shortcut below to assign your custom hotkey combination.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRestoreAllDefaults}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all cursor-pointer flex items-center gap-2 shrink-0 self-start md:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restore All Defaults</span>
        </button>
      </div>

      {/* TOP PROMINENT SEARCH BAR */}
      <div className="glass-card p-4 rounded-2xl border-[rgba(255,255,255,0.2)] flex items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#A67165]" />
          <input 
            type="text"
            placeholder="Search all keyboard shortcuts by action name, default key (e.g. Win + E), or custom key..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/50 border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#A67165] transition-colors font-medium"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white border-none bg-transparent cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* HORIZONTAL CATEGORY FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const count = cat.id === "All Shortcuts" 
            ? shortcuts.length 
            : shortcuts.filter(s => s.category === cat.id).length
          const isActive = activeCategory === cat.id

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer whitespace-nowrap ${
                isActive 
                  ? "bg-[#A67165] border-[#A67165] text-white shadow-md" 
                  : "bg-white/5 border-white/10 text-[#6B5B54] dark:text-[#A69281] hover:bg-white/10 hover:text-white"
              }`}
            >
              <cat.icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "opacity-70"}`} />
              <span>{cat.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                isActive ? "bg-white/25 text-white" : "bg-white/10 text-white/60"
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* INLINE ADD NEW ACTION FORM */}
      {isAddingNew && (
        <div className="glass-card p-6 rounded-2xl border-[#A67165] bg-[#1E1B1A] space-y-4 animate-fade-in text-left">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#A67165]" />
              <span>Add Custom Action</span>
            </h3>
            <button onClick={() => setIsAddingNew(false)} className="text-white/40 hover:text-white border-none bg-transparent cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-[#A69281] uppercase mb-1">Action Name</label>
              <input 
                type="text" 
                placeholder="e.g. Open Calculator"
                value={newActionName}
                onChange={(e) => setNewActionName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-[#A67165]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#A69281] uppercase mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as Exclude<ShortcutCategory, "All Shortcuts">)}
                className="w-full px-3 py-2 rounded-xl bg-[#252326] border border-white/15 text-white focus:outline-none focus:border-[#A67165]"
              >
                <option value="Windows Keys">Windows Keys</option>
                <option value="General Shortcuts">General Shortcuts</option>
                <option value="File Explorer">File Explorer</option>
                <option value="Virtual Desktop">Virtual Desktop</option>
                <option value="Custom Actions">Custom Actions</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#A69281] uppercase mb-1">Default Windows Key (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. Win + C"
                value={newDefaultKey}
                onChange={(e) => setNewDefaultKey(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-[#A67165]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button onClick={() => setIsAddingNew(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-white/60 hover:text-white bg-transparent border-none cursor-pointer">Cancel</button>
            <button onClick={handleSaveNewAction} className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#A67165] hover:bg-[#734E46] border-none cursor-pointer shadow-md">Create & Record Key</button>
          </div>
        </div>
      )}

      {/* COMPACT 3-SPLIT GRID LAYOUT FOR SHORTCUT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        {filteredShortcuts.length === 0 ? (
          <div className="col-span-full glass-card p-12 text-center text-[#A69281] rounded-2xl">
            No shortcuts found matching search query or category filter.
          </div>
        ) : (
          filteredShortcuts.map((item) => {
            const hasConflict = item.customShortcut.trim() ? getConflictInfo(item.customShortcut, item.id).hasConflict : false
            const isAssigned = item.customShortcut.trim().length > 0

            return (
              <div 
                key={item.id}
                onClick={() => openRecordingPage(item)}
                className="p-4 rounded-2xl bg-[#252123]/75 backdrop-blur-xl border border-white/15 hover:border-[#A67165]/60 hover:shadow-[0_12px_32px_rgba(166,113,101,0.22)] transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer group relative overflow-hidden"
              >
                {/* CARD TOP ROW */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#A67165]/15 border border-[#A67165]/30 text-[#F2D8C2] flex items-center justify-center shrink-0 group-hover:bg-[#A67165]/25 group-hover:border-[#A67165] transition-colors shadow-sm">
                      {getActionIcon(item.action)}
                    </div>
                    <div className="min-w-0 text-left">
                      <h4 className="text-sm font-bold text-white truncate group-hover:text-[#F2D8C2] transition-colors">{item.action}</h4>
                      <span className="text-[10px] font-bold text-[#A69281] uppercase tracking-wider block mt-0.5">{item.category}</span>
                    </div>
                  </div>

                  {/* Status Toggle & Delete */}
                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <ToggleSwitch 
                      checked={item.status}
                      onChange={(val) => handleToggleStatus(item.id, val)}
                    />
                    {item.id.startsWith("custom-ks-") && (
                      <button 
                        onClick={(e) => handleDeleteShortcut(item.id, e)}
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-red-400 cursor-pointer transition-colors"
                        title="Delete Shortcut"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* CARD MIDDLE: KEYS COMPARISON */}
                <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs flex items-center justify-between gap-2">
                  <div className="min-w-0 text-left">
                    <span className="text-[9px] font-extrabold text-[#A69281] uppercase tracking-wider block mb-1.5">Default Windows</span>
                    <div className="inline-flex items-center gap-1 font-mono text-[11px] flex-wrap">
                      {item.defaultShortcut.split("+").map((key, i) => (
                        <React.Fragment key={i}>
                          <kbd className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 font-bold text-white shadow-sm text-[10px]">
                            {key.trim()}
                          </kbd>
                          {i < item.defaultShortcut.split("+").length - 1 && <span className="opacity-40 text-[10px]">+</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <div className="shrink-0 text-right flex flex-col items-end">
                    <span className="text-[9px] font-extrabold text-[#C98D74] uppercase tracking-wider block mb-1.5">Custom Shortcut</span>
                    {isAssigned ? (
                      <div className="inline-flex items-center gap-1 font-mono text-[11px] flex-wrap justify-end">
                        {item.customShortcut.split("+").map((key, i) => (
                          <React.Fragment key={i}>
                            <kbd className="px-2.5 py-1 rounded-lg bg-[#A67165]/30 border border-[#A67165]/60 font-bold text-[#F2D8C2] shadow-sm text-[10px]">
                              {key.trim()}
                            </kbd>
                            {i < item.customShortcut.split("+").length - 1 && <span className="opacity-40 text-[10px]">+</span>}
                          </React.Fragment>
                        ))}
                        {hasConflict && (
                          <span title="Common Windows shortcut conflict" className="text-amber-400 ml-0.5">
                            <AlertTriangle className="w-3.5 h-3.5 inline" />
                          </span>
                        )}
                        <button 
                          onClick={(e) => handleRemoveCustomKey(item.id, e)}
                          className="ml-1 text-white/40 hover:text-red-400 border-none bg-transparent cursor-pointer"
                          title="Remove custom shortcut"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          openRecordingPage(item)
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#A67165] to-[#734E46] hover:from-[#734E46] hover:to-[#A67165] text-white text-[11px] font-bold flex items-center gap-1 shadow-md border border-white/10 cursor-pointer transition-all shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Apply Here</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
