"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Slider } from './ui/slider'
import { Button } from './ui/button'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import { Copy, RefreshCw } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { generatePin } from '@/lib/generators'

export function PinGenerator() {
  const { toast } = useToast()
  const [pin, setPin] = useState('')
  const [length, setLength] = useState([4])
  const [pinType, setPinType] = useState<'numeric' | 'alphanumeric' | 'extended'>('numeric')

  const handleGeneratePin = async () => {
    const result = await generatePin(length[0], pinType)
    setPin(result.pin)
  }

  const copyToClipboard = async () => {
    if (!pin) return
    await navigator.clipboard.writeText(pin)
    toast({
      title: 'Copied!',
      description: 'PIN copied to clipboard',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>PIN Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-4 bg-secondary p-4 rounded-lg">
            <span className="text-xl font-mono flex-1 font-[family-name:var(--font-geist-mono)]">
              {pin || 'Click generate'}
            </span>
            <Button variant="outline" size="icon" onClick={handleGeneratePin}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        <div className="space-y-4">
          <div>
            <Label>PIN Length: {length}</Label>
            <Slider
              value={length}
              onValueChange={setLength}
              min={4}
              max={12}
              step={1}
              className="mt-2"
            />
          </div>

          <div className="space-y-2">
            <Label>PIN Type</Label>
            <Select value={pinType} onValueChange={(value: 'numeric' | 'alphanumeric' | 'extended') => setPinType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select PIN type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="numeric">Numeric (0-9)</SelectItem>
                <SelectItem value="alphanumeric">Alphanumeric</SelectItem>
                <SelectItem value="extended">Extended (with symbols)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full" onClick={handleGeneratePin}>
            Generate PIN
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}