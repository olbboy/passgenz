"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ShieldCheck } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProductHuntBadge } from './product-hunt-badge'

export function PrivacyNotice() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  return (
    <>
      <div className="flex justify-center items-center h-full">
        <Button
          variant="outline"
          size="icon"
          className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 w-9 rounded-lg flex items-center justify-center transition-colors shadow-sm"
          onClick={() => setShowPrivacyModal(true)}
        >
          <ShieldCheck className="h-5 w-5" />
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