"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PasswordGenerator } from "./password-generator"
import { PinGenerator } from "./pin-generator"
import { SecretGenerator } from "./secret-generator"
import { IdGenerator } from "./id-generator"
import { HistoryDrawer } from "./history-drawer"
import { Button } from "./ui/button"
import { History } from "lucide-react"
import { useState } from "react"

export function GeneratorTabs() {
  const [showHistory, setShowHistory] = useState(false)

  return (
    <div className="relative">
      <Tabs defaultValue="password" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="pin">PIN</TabsTrigger>
            <TabsTrigger value="secret">Secret</TabsTrigger>
            <TabsTrigger value="id">ID</TabsTrigger>
          </TabsList>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowHistory(true)}
          >
            <History className={`h-4 w-4 ${showHistory ? 'text-primary' : ''}`} />
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