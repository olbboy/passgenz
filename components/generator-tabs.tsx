"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PasswordGenerator } from '@/components/password-generator'
import { PinGenerator } from '@/components/pin-generator'
import { SecretGenerator } from '@/components/secret-generator'
import { IdGenerator } from '@/components/id-generator'

export function GeneratorTabs() {
  return (
    <Tabs defaultValue="password" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="pin">PIN</TabsTrigger>
        <TabsTrigger value="secret">Secret</TabsTrigger>
        <TabsTrigger value="id">Random ID</TabsTrigger>
      </TabsList>
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
    </Tabs>
  )
} 