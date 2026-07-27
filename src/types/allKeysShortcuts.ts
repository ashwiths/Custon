export type ShortcutCategory =
  | "All Shortcuts"
  | "Windows Keys"
  | "General Shortcuts"
  | "File Explorer"
  | "Virtual Desktop"
  | "Custom Actions"
  | "Advanced"

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
  "Win + L",
  "Win + D",
  "Win + E",
  "Win + R",
  "Win + S",
  "Win + I",
  "Win + Tab",
  "Win + A",
  "Win + P",
  "PrtScn"
]

export const DEFAULT_KEY_SHORTCUTS: KeyShortcutItem[] = [
  // Windows Keys
  {
    id: "ks-1",
    action: "Show Desktop",
    defaultShortcut: "Win + D",
    customShortcut: "",
    category: "Windows Keys",
    status: true,
    systemAction: "show_desktop"
  },
  {
    id: "ks-2",
    action: "Open Settings",
    defaultShortcut: "Win + I",
    customShortcut: "",
    category: "Windows Keys",
    status: true,
    systemAction: "open_settings"
  },
  {
    id: "ks-3",
    action: "Open Run",
    defaultShortcut: "Win + R",
    customShortcut: "",
    category: "Windows Keys",
    status: true,
    systemAction: "open_run"
  },
  {
    id: "ks-4",
    action: "Open Search",
    defaultShortcut: "Win + S",
    customShortcut: "",
    category: "Windows Keys",
    status: true,
    systemAction: "open_search"
  },
  {
    id: "ks-5",
    action: "Open Action Center",
    defaultShortcut: "Win + A",
    customShortcut: "",
    category: "Windows Keys",
    status: true,
    systemAction: "open_action_center"
  },
  {
    id: "ks-6",
    action: "Lock PC",
    defaultShortcut: "Win + L",
    customShortcut: "",
    category: "Windows Keys",
    status: true,
    systemAction: "lock_pc"
  },

  // File Explorer
  {
    id: "ks-7",
    action: "Open File Explorer",
    defaultShortcut: "Win + E",
    customShortcut: "",
    category: "File Explorer",
    status: true,
    systemAction: "open_explorer"
  },

  // Virtual Desktop
  {
    id: "ks-8",
    action: "Open Task View",
    defaultShortcut: "Win + Tab",
    customShortcut: "",
    category: "Virtual Desktop",
    status: true,
    systemAction: "open_task_view"
  },
  {
    id: "ks-9",
    action: "New Virtual Desktop",
    defaultShortcut: "Win + Ctrl + D",
    customShortcut: "",
    category: "Virtual Desktop",
    status: true,
    systemAction: "new_virtual_desktop"
  },
  {
    id: "ks-10",
    action: "Close Virtual Desktop",
    defaultShortcut: "Win + Ctrl + F4",
    customShortcut: "",
    category: "Virtual Desktop",
    status: true,
    systemAction: "close_virtual_desktop"
  },

  // General Shortcuts
  {
    id: "ks-11",
    action: "Close Active Window",
    defaultShortcut: "Alt + F4",
    customShortcut: "",
    category: "General Shortcuts",
    status: true,
    systemAction: "close_active_window"
  },
  {
    id: "ks-12",
    action: "Take Screenshot",
    defaultShortcut: "PrtScn",
    customShortcut: "",
    category: "General Shortcuts",
    status: true,
    systemAction: "take_screenshot"
  },
  {
    id: "ks-13",
    action: "Copy",
    defaultShortcut: "Ctrl + C",
    customShortcut: "",
    category: "General Shortcuts",
    status: true,
    systemAction: "copy"
  },
  {
    id: "ks-14",
    action: "Cut",
    defaultShortcut: "Ctrl + X",
    customShortcut: "",
    category: "General Shortcuts",
    status: true,
    systemAction: "cut"
  },
  {
    id: "ks-15",
    action: "Paste",
    defaultShortcut: "Ctrl + V",
    customShortcut: "",
    category: "General Shortcuts",
    status: true,
    systemAction: "paste"
  },
  {
    id: "ks-16",
    action: "Select All",
    defaultShortcut: "Ctrl + A",
    customShortcut: "",
    category: "General Shortcuts",
    status: true,
    systemAction: "select_all"
  },
  {
    id: "ks-17",
    action: "Undo",
    defaultShortcut: "Ctrl + Z",
    customShortcut: "",
    category: "General Shortcuts",
    status: true,
    systemAction: "undo"
  },
  {
    id: "ks-18",
    action: "Redo",
    defaultShortcut: "Ctrl + Y",
    customShortcut: "",
    category: "General Shortcuts",
    status: true,
    systemAction: "redo"
  },
  {
    id: "ks-19",
    action: "Switch Apps",
    defaultShortcut: "Alt + Tab",
    customShortcut: "",
    category: "General Shortcuts",
    status: true,
    systemAction: "switch_apps"
  },

  // Custom Actions
  {
    id: "ks-20",
    action: "Open Task Manager",
    defaultShortcut: "Ctrl + Shift + Esc",
    customShortcut: "",
    category: "Custom Actions",
    status: true,
    systemAction: "task_manager"
  },
  {
    id: "ks-21",
    action: "Open Snipping Tool",
    defaultShortcut: "Win + Shift + S",
    customShortcut: "",
    category: "Custom Actions",
    status: true,
    systemAction: "snipping_tool"
  },

  // Advanced
  {
    id: "ks-22",
    action: "Projection Settings",
    defaultShortcut: "Win + P",
    customShortcut: "",
    category: "Advanced",
    status: true,
    systemAction: "projection_settings"
  }
]
