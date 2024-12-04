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
import { HistoryManagementService } from '@/lib/history-management'
import { PasswordAnalysis } from '@/lib/types'

export function PinGenerator() {
  const { toast } = useToast()
  const [pin, setPin] = useState('')
  const [pinType, setPinType] = useState<'numeric' | 'alphanumeric' | 'extended'>('numeric')
  const [length, setLength] = useState([6])
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const historyService = HistoryManagementService.getInstance()

  const handleGeneratePin = async () => {
    try {
      setIsGenerating(true);
      const result = await generatePin(length[0], pinType);

      // Create history entry with full metadata
      await historyService.addEntry({
        value: result.pin,
        feature: 'pin',
        metadata: {
          strength: result.analysis.entropy / 100, // Convert entropy to 0-1 scale
          analysis: {
            entropy: result.analysis.entropy,
            timeToCrack: result.analysis.timeToCrack,
            weaknesses: result.analysis.weaknesses,
            breached: false,
            characterDistribution: result.analysis.characterDistribution,
            patterns: result.analysis.patterns,
            recommendations: [
              'Use only once',
              'Do not share with others',
              'Change regularly',
              `Use ${pinType} format for better security`
            ]
          },
          tags: ['generated', pinType],
          context: `Length: ${length[0]}, Type: ${pinType}`
        }
      });

      setPin(result.pin);
      setAnalysis(result.analysis);

    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to generate PIN'
      });
    } finally {
      setIsGenerating(false);
    }
  };

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

          <Button 
            className="w-full" 
            onClick={handleGeneratePin}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate PIN'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}