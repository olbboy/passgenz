"use client"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "./ui/button"
import { History } from "lucide-react"
import { HistoryPanel } from "./history-panel"

interface HistoryDrawerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function HistoryDrawer({ open, onOpenChange }: HistoryDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[540px] p-0">
        <HistoryPanel />
      </SheetContent>
    </Sheet>
  )
} 