"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import { Copy, RefreshCw } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { generateSecret } from '@/lib/generators'
import { PasswordAnalysis } from '@/lib/types'

export function SecretGenerator() {
  const { toast } = useToast()
  const [secret, setSecret] = useState('')
  const [algorithm, setAlgorithm] = useState('sha256')
  const [format, setFormat] = useState<'hex' | 'base64'>('hex')
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null)

  const handleGenerateSecret = async () => {
    try {
      const result = await generateSecret(format)
      setSecret(result.secret)
      setAnalysis(result.analysis)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate secret",
        variant: 'destructive',
      })
    }
  }

  const copyToClipboard = async () => {
    if (!secret) return
    await navigator.clipboard.writeText(secret)
    toast({
      title: "Copied!",
      description: "Secret copied to clipboard",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Secret Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-4 bg-secondary p-4 rounded-lg">
            <span className="text-xl font-mono flex-1 break-all font-[family-name:var(--font-geist-mono)]">
              {secret || "Click generate"}
            </span>
            <Button variant="outline" size="icon" onClick={handleGenerateSecret}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Algorithm</Label>
            <Select value={algorithm} onValueChange={setAlgorithm}>
              <SelectTrigger>
                <SelectValue placeholder="Select algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sha256">SHA-256</SelectItem>
                <SelectItem value="sha3">SHA-3</SelectItem>
                <SelectItem value="blake2">Blake2</SelectItem>
                <SelectItem value="argon2">Argon2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select Format</Label>
            <Select value={format} onValueChange={(value: 'hex' | 'base64') => setFormat(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hex">Hexadecimal</SelectItem>
                <SelectItem value="base64">Base64</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full" onClick={handleGenerateSecret}>
            Generate Secret
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}