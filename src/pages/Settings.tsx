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
    <div className="space-y-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Configure application behavior and global hotkeys.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance & Theme</CardTitle>
            <CardDescription>Customize how the interface looks on your desktop.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <div className="font-semibold">Dark Mode</div>
                <div className="text-xs text-muted-foreground">Switch between light and dark themes.</div>
              </div>
              <ToggleSwitch checked={darkMode} onChange={setDarkMode} />
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="font-semibold">Minimize to System Tray</div>
                <div className="text-xs text-muted-foreground">Keep the app running in the tray when closing.</div>
              </div>
              <ToggleSwitch checked={minimizeOnClose} onChange={setMinimizeOnClose} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Hotkeys</CardTitle>
            <CardDescription>Define custom keyboard combinations to summon the utility.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="font-semibold">Global Overlay Trigger</div>
                <div className="text-xs text-muted-foreground">Click input box and press keys to capture hotkey.</div>
              </div>
              <div className="w-full md:w-64">
                <ShortcutInput value={globalShortcut} onChange={setGlobalShortcut} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Startup Options</CardTitle>
            <CardDescription>Manage how Custom initializes on boot.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Start with Windows</div>
                <div className="text-xs text-muted-foreground">Automatically launch the app on user login.</div>
              </div>
              <ToggleSwitch checked={startAtLogin} onChange={setStartAtLogin} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
