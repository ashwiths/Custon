export type ShortcutCategory =
  | "All Shortcuts"
  | "General Shortcuts"

export interface KeyShortcutItem {
  id: string
  action: string
  defaultShortcut: string
  customShortcut: string // Empty string by default
  category: Exclude<ShortcutCategory, "All Shortcuts">
  status: boolean
  systemAction: string
  icon?: string
}

export const COMMON_CONFLICT_SHORTCUTS = [
  "Ctrl + C",
  "Ctrl + V",
  "Ctrl + X",
  "Ctrl + A",
  "Ctrl + Z",
  "Ctrl + Y",
  "Alt + Tab",
  "Alt + F4",
  "F5",
  "Win + Shift + S",
  "PrtScn"
]

export const DEFAULT_KEY_SHORTCUTS: KeyShortcutItem[] = [
  {
    id: "gen-1",
    action: "Select All",
    defaultShortcut: "Ctrl + A",
    customShortcut: "",
    category: "General Shortcuts",
    status: false,
    systemAction: "select_all"
  },
  {
    id: "gen-2",
    action: "Copy",
    defaultShortcut: "Ctrl + C",
    customShortcut: "",
    category: "General Shortcuts",
    status: false,
    systemAction: "copy"
  },
  {
    id: "gen-3",
    action: "Cut",
    defaultShortcut: "Ctrl + X",
    customShortcut: "",
    category: "General Shortcuts",
    status: false,
    systemAction: "cut"
  },
  {
    id: "gen-4",
    action: "Paste",
    defaultShortcut: "Ctrl + V",
    customShortcut: "",
    category: "General Shortcuts",
    status: false,
    systemAction: "paste"
  },
  {
    id: "gen-5",
    action: "Undo",
    defaultShortcut: "Ctrl + Z",
    customShortcut: "",
    category: "General Shortcuts",
    status: false,
    systemAction: "undo"
  },
  {
    id: "gen-6",
    action: "Redo",
    defaultShortcut: "Ctrl + Y",
    customShortcut: "",
    category: "General Shortcuts",
    status: false,
    systemAction: "redo"
  },
  {
    id: "gen-7",
    action: "Switch Apps",
    defaultShortcut: "Alt + Tab",
    customShortcut: "",
    category: "General Shortcuts",
    status: false,
    systemAction: "switch_apps"
  },
  {
    id: "gen-8",
    action: "Close Active Window",
    defaultShortcut: "Alt + F4",
    customShortcut: "",
    category: "General Shortcuts",
    status: false,
    systemAction: "close_active_window"
  },
  {
    id: "gen-9",
    action: "Refresh Window / Webpage",
    defaultShortcut: "F5",
    customShortcut: "",
    category: "General Shortcuts",
    status: false,
    systemAction: "refresh"
  },
  {
    id: "gen-10",
    action: "Take Screenshot",
    defaultShortcut: "Win + Shift + S",
    customShortcut: "",
    category: "General Shortcuts",
    status: false,
    systemAction: "take_screenshot"
  }
]
