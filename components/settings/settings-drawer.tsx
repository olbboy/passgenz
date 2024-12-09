"use client"

import * as React from "react"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AISettings } from "@/components/settings/ai-settings"
import { GeneralSettings } from "@/components/settings/general-settings"
import { ThemeSettings } from "@/components/settings/theme-settings"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

interface SettingsDrawerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SettingsDrawer({ open, onOpenChange }: SettingsDrawerProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [activeTab, setActiveTab] = React.useState("general")

  // Memoize content to prevent re-renders
  const drawerContent = React.useMemo(() => (
    <div className="h-full overflow-auto bg-background">
      <SheetTitle className="sr-only">Settings Panel</SheetTitle>
      {isMobile && (
        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted my-4" />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Settings</h2>
        </div>
        <Separator className="my-4" />
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="general" className="flex-1">
              General
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex-1">
              Theme
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex-1">
              AI
            </TabsTrigger>
          </TabsList>
          <div className="mt-4">
            {activeTab === "general" && <GeneralSettings />}
            {activeTab === "theme" && <ThemeSettings />}
            {activeTab === "ai" && <AISettings />}
          </div>
        </Tabs>
      </div>
    </div>
  ), [isMobile, activeTab])

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="w-9 h-9 transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={() => onOpenChange?.(!open)}
            aria-label="Open Settings (Cmd/Ctrl + ,)"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="flex items-center gap-2">
            Settings
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>
              <span className="text-xs">,</span>
            </kbd>
          </p>
        </TooltipContent>
      </Tooltip>

      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent 
          side={isMobile ? "bottom" : "right"}
          className={cn(
            "fixed z-50 bg-background",
            isMobile 
              ? "inset-x-0 bottom-0 mt-24 rounded-t-[10px] border-t"
              : "right-0 top-0 h-full w-[400px] border-l"
          )}
        >
          {drawerContent}
        </SheetContent>
      </Sheet>
    </>
  )
} 