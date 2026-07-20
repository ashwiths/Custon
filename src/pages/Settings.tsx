import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Card"
import { ToggleSwitch } from "@/components/ToggleSwitch"
import { ShortcutInput } from "@/components/ShortcutInput"

interface SettingsProps {
  darkMode: boolean
  setDarkMode: (dark: boolean) => void
}

export const Settings: React.FC<SettingsProps> = ({ darkMode, setDarkMode }) => {
  const [globalShortcut, setGlobalShortcut] = React.useState("Ctrl + Shift + S")
  const [minimizeOnClose, setMinimizeOnClose] = React.useState(true)
  const [startAtLogin, setStartAtLogin] = React.useState(false)

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page Title */}
      <div className="flex flex-col gap-2">
        <h2 className="page-title">Settings</h2>
        <p className="body-text">Configure application behavior, appearance, and global hotkeys.</p>
      </div>

      <div className="grid gap-6">
        {/* Appearance Card */}
        <Card style={{ borderRadius: "20px" }}>
          <CardHeader>
            <CardTitle style={{ fontSize: "18px" }}>Appearance & Theme</CardTitle>
            <CardDescription>Customize how the interface looks on your desktop.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4" style={{ padding: "20px 24px" }}>
            <div className="flex items-center justify-between border-b border-[rgba(166,113,101,0.15)] pb-4">
              <div>
                <div className="font-semibold text-[#252326]" style={{ fontSize: "15px" }}>Dark Mode</div>
                <div className="text-xs text-[#9B8179]" style={{ marginTop: "2px" }}>Switch between light and dark themes.</div>
              </div>
              <ToggleSwitch checked={darkMode} onChange={setDarkMode} />
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="font-semibold text-[#252326]" style={{ fontSize: "15px" }}>Minimize to System Tray</div>
                <div className="text-xs text-[#9B8179]" style={{ marginTop: "2px" }}>Keep the app running in the tray when closing.</div>
              </div>
              <ToggleSwitch checked={minimizeOnClose} onChange={setMinimizeOnClose} />
            </div>
          </CardContent>
        </Card>

        {/* Hotkeys Card */}
        <Card style={{ borderRadius: "20px" }}>
          <CardHeader>
            <CardTitle style={{ fontSize: "18px" }}>System Hotkeys</CardTitle>
            <CardDescription>Define custom keyboard combinations to summon the utility.</CardDescription>
          </CardHeader>
          <CardContent style={{ padding: "20px 24px" }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-semibold text-[#252326]" style={{ fontSize: "15px" }}>Global Overlay Trigger</div>
                <div className="text-xs text-[#9B8179]">Click input box and press keys to capture hotkey.</div>
              </div>
              <div className="w-full md:w-72">
                <ShortcutInput value={globalShortcut} onChange={setGlobalShortcut} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Startup Card */}
        <Card style={{ borderRadius: "20px" }}>
          <CardHeader>
            <CardTitle style={{ fontSize: "18px" }}>Startup Options</CardTitle>
            <CardDescription>Manage how Custom initializes on boot.</CardDescription>
          </CardHeader>
          <CardContent style={{ padding: "20px 24px" }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#252326]" style={{ fontSize: "15px" }}>Start with Windows</div>
                <div className="text-xs text-[#9B8179]" style={{ marginTop: "2px" }}>Automatically launch the app on user login.</div>
              </div>
              <ToggleSwitch checked={startAtLogin} onChange={setStartAtLogin} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
