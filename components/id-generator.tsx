"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import { Copy, RefreshCw } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Input } from './ui/input'
import { generateId } from '@/lib/generators'

export function IdGenerator() {
  const { toast } = useToast()
  const [id, setId] = useState('')
  const [format, setFormat] = useState<'uuid' | 'nanoid' | 'custom'>('uuid')
  const [prefix, setPrefix] = useState('')
  const [analysis, setAnalysis] = useState(null)

  const handleGenerateId = async () => {
    const result = await generateId(format, prefix)
    setId(result.id)
    setAnalysis(result.analysis)
  }

  const copyToClipboard = async () => {
    if (!id) return
    await navigator.clipboard.writeText(id)
    toast({
      title: 'Copied!',
      description: 'ID copied to clipboard',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Random ID Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-4 bg-secondary p-4 rounded-lg">
            <span className="text-xl font-mono flex-1 break-all font-[family-name:var(--font-geist-mono)]">
              {id || 'Click generate'}
            </span>
            <Button variant="outline" size="icon" onClick={handleGenerateId}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>ID Format</Label>
            <Select value={format} onValueChange={(value: 'uuid' | 'nanoid' | 'custom') => setFormat(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uuid">UUID v4</SelectItem>
                <SelectItem value="nanoid">NanoID</SelectItem>
                <SelectItem value="custom">Custom Format</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Prefix (optional)</Label>
            <Input
              type="text"
              placeholder="Enter prefix"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
            />
          </div>

          <Button className="w-full" onClick={handleGenerateId}>
            Generate ID
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}