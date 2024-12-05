"use client"

import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PasswordGenerator } from "./password-generator"
import { PinGenerator } from "./pin-generator"
import { SecretGenerator } from "./secret-generator"
import { IdGenerator } from "./id-generator"
import { Button } from "./ui/button"
import { History } from "lucide-react"
import { useState } from "react"
import { HistoryDrawer } from "./history-drawer"

export function GeneratorTabs() {
  const t = useTranslations('Tabs');
  const [showHistory, setShowHistory] = useState(false)

  return (
    <div className="relative">
      <Tabs defaultValue="password" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="flex-1 grid grid-cols-4">
            <TabsTrigger value="password">{t('password')}</TabsTrigger>
            <TabsTrigger value="pin">{t('pin')}</TabsTrigger>
            <TabsTrigger value="secret">{t('secret')}</TabsTrigger>
            <TabsTrigger value="id">{t('id')}</TabsTrigger>
          </TabsList>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowHistory(true)}
            className="ml-2"
          >
            <History className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-full max-w-2xl mx-auto">
          <TabsContent value="password">
            <PasswordGenerator />
          </TabsContent>

          <TabsContent value="pin">
            <PinGenerator />
          </TabsContent>

          <TabsContent value="secret">
            <SecretGenerator />
          </TabsContent>

          <TabsContent value="id">
            <IdGenerator />
          </TabsContent>
        </div>
      </Tabs>

      <HistoryDrawer 
        open={showHistory}
        onOpenChange={setShowHistory}
      />
    </div>
  )
} 