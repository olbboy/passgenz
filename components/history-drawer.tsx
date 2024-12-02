"use client"

import * as React from "react"
import { Drawer } from "vaul"
import { motion, AnimatePresence } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"
import { X } from "lucide-react"
import { HistoryPanel } from "./history-panel"
import { cn } from "@/lib/utils"

interface HistoryDrawerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function HistoryDrawer({ open, onOpenChange }: HistoryDrawerProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  
  // Memoize content to prevent re-renders
  const drawerContent = React.useMemo(() => (
    <div className="h-full overflow-auto bg-background">
      <Drawer.Title className="sr-only">History Panel</Drawer.Title>
      {isMobile && (
        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted my-4" />
      )}
      <HistoryPanel />
    </div>
  ), [isMobile])

  return (
    <Drawer.Root 
      open={open}
      onOpenChange={onOpenChange}
      direction={isMobile ? "bottom" : "right"}
      modal={true} // Always modal to handle click outside
      dismissible // Enable click outside to close
    >
      <AnimatePresence>
        {open && (
          <Drawer.Portal>
            <Drawer.Overlay 
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => onOpenChange?.(false)} // Handle click outside
            />

            <Drawer.Content 
              className={cn(
                "fixed bg-background z-50",
                isMobile ? 
                  "bottom-0 left-0 right-0 mt-24 flex h-[80vh] flex-col rounded-t-[10px]" :
                  "bottom-0 right-0 top-0 h-full w-[400px] border-l"
              )}
            >
              <motion.div
                initial={isMobile ? { y: "100%" } : { x: "100%" }}
                animate={isMobile ? { y: 0 } : { x: 0 }}
                exit={isMobile ? { y: "100%" } : { x: "100%" }}
                transition={{ 
                  type: "spring", 
                  damping: 30,
                  stiffness: 300
                }}
              >
                {drawerContent}
              </motion.div>
            </Drawer.Content>
          </Drawer.Portal>
        )}
      </AnimatePresence>
    </Drawer.Root>
  )
} 