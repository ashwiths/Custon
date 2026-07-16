import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card"
import { Box, Code2, Globe, Heart } from "lucide-react"

export const About: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-3xl font-bold tracking-tight">About Custom</h2>
        <p className="text-muted-foreground">Learn more about the systems powering this desktop application.</p>
      </div>

      <div className="grid gap-6">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 flex flex-col items-center justify-center text-center border-b select-none">
            <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg mb-4">
              <Box className="h-8 w-8 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold">Custom Desktop</h3>
            <p className="text-sm text-muted-foreground mt-1">A production-ready Tauri + React application boilerplate.</p>
            <div className="mt-4 px-3 py-1 rounded-full bg-accent text-xs font-mono font-semibold">v0.1.0-alpha</div>
          </div>
          <CardContent className="p-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Framework Core</div>
                <div className="text-sm font-medium flex items-center gap-2">
                  <Box className="h-4 w-4 text-primary" /> Tauri v2 (Rust Backend)
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Frontend Interface</div>
                <div className="text-sm font-medium flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-primary" /> React 19 + TypeScript + Vite
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Design System</div>
                <div className="text-sm font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" /> Tailwind CSS & shadcn/ui styles
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Platform support</div>
                <div className="text-sm font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" /> Microsoft Windows Desktop
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>License & Open Source</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Custom is built on open-source technologies under standard permissive developer licensing. It utilizes rust-safe system hooks to interact natively with Windows.
            </p>
            <div className="flex items-center gap-1.5 pt-4 text-xs text-primary font-medium">
              Made with <Heart className="h-3.5 w-3.5 fill-current text-rose-500" /> by the DeepMind Antigravity developer agent.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
