import * as React from "react"
import { Button } from "@/components/Button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/Card"
import { AppSelector, type AppOption } from "@/components/AppSelector"
import { Play, Activity, Cpu, HardDrive } from "lucide-react"

export const Dashboard: React.FC = () => {
  const [selectedApp, setSelectedApp] = React.useState("app-1")

  const appOptions: AppOption[] = [
    { id: "app-1", name: "Production Console", description: "Main system backend api", icon: <Cpu className="h-4 w-4 text-emerald-500" /> },
    { id: "app-2", name: "Data Warehouse Monitor", description: "Analytical services pipelines", icon: <HardDrive className="h-4 w-4 text-amber-500" /> },
    { id: "app-3", name: "User Auth Portal", description: "Security and authentication layers", icon: <Activity className="h-4 w-4 text-indigo-500" /> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-3xl font-bold tracking-tight">Welcome to Custom</h2>
        <p className="text-muted-foreground">Manage your Tauri, React, and Rust system processes.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Rust Service Status</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">Active</div>
            <p className="text-xs text-muted-foreground mt-1">IPC Bridge Connected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5 MB</div>
            <p className="text-xs text-muted-foreground mt-1">Low Footprint Mode</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Pipelines</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 / 3</div>
            <p className="text-xs text-muted-foreground mt-1">Healthy Node clusters</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Selector Demo</CardTitle>
          <CardDescription>Select an active service pipeline to monitor metrics.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-md">
            <AppSelector
              options={appOptions}
              selectedId={selectedApp}
              onSelect={setSelectedApp}
            />
          </div>
          {selectedApp && (
            <div className="p-4 rounded-lg bg-accent/40 border text-sm space-y-1">
              <span className="font-semibold text-muted-foreground">Currently Configured Pipeline:</span>
              <div className="font-mono text-xs">{selectedApp} ({appOptions.find((a) => a.id === selectedApp)?.name})</div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="gap-2">
            <Play className="h-4 w-4" /> Start Service
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
