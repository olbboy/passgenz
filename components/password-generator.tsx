"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Slider } from './ui/slider'
import { Switch } from './ui/switch'
import { Button } from './ui/button'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import { Copy, RefreshCw } from 'lucide-react'
import { generatePassword } from '@/lib/generators'

interface PasswordOptions {
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
}

export function PasswordGenerator() {
  const { toast } = useToast()
  const [password, setPassword] = useState('')
  const [length, setLength] = useState([12])
  const [options, setOptions] = useState<PasswordOptions>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  })

  const handleGeneratePassword = () => {
    try {
      const newPassword = generatePassword(length[0], options)
      setPassword(newPassword)
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        })
      }
    }
  }

  const copyToClipboard = async () => {
    if (!password) return
    await navigator.clipboard.writeText(password)
    toast({
      title: 'Copied!',
      description: 'Password copied to clipboard',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-4 bg-secondary p-4 rounded-lg">
            <span className="text-xl font-mono flex-1 font-[family-name:var(--font-geist-mono)]">
              {password || 'Click generate'}
            </span>
            <Button variant="outline" size="icon" onClick={handleGeneratePassword}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        <div className="space-y-4">
          <div>
            <Label>Password Length: {length}</Label>
            <Slider
              value={length}
              onValueChange={setLength}
              min={4}
              max={32}
              step={1}
              className="mt-2"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="uppercase">Uppercase Letters</Label>
              <Switch
                id="uppercase"
                checked={options.uppercase}
                onCheckedChange={(checked: boolean) =>
                  setOptions((prev) => ({ ...prev, uppercase: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="lowercase">Lowercase Letters</Label>
              <Switch
                id="lowercase"
                checked={options.lowercase}
                onCheckedChange={(checked: boolean) =>
                  setOptions((prev) => ({ ...prev, lowercase: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="numbers">Numbers</Label>
              <Switch
                id="numbers"
                checked={options.numbers}
                onCheckedChange={(checked: boolean) =>
                  setOptions((prev) => ({ ...prev, numbers: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="symbols">Special Characters</Label>
              <Switch
                id="symbols"
                checked={options.symbols}
                onCheckedChange={(checked: boolean) =>
                  setOptions((prev) => ({ ...prev, symbols: checked }))
                }
              />
            </div>
          </div>

          <Button className="w-full" onClick={handleGeneratePassword}>
            Generate Password
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}