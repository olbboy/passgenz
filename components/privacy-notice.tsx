"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ShieldCheck } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function PrivacyNotice() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  return (
    <>
      <div className="mb-6 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-2"
          onClick={() => setShowPrivacyModal(true)}
        >
          <ShieldCheck className="h-4 w-4" />
          <span className="text-sm font-medium">Privacy Protected</span>
        </Button>
      </div>

      <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Privacy First Approach
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Our password generation process operates exclusively within your local device environment, ensuring maximum security and privacy. At no point are your passwords transmitted or stored—they remain completely ephemeral, leaving no trace on either your device or our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPrivacyModal(false)}
            >
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 