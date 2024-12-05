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
import { PasswordAnalysis } from '@/lib/types'
import { HistoryManagementService } from '@/lib/history-management'
import { useTranslations } from 'next-intl';

export function IdGenerator() {
  const { toast } = useToast()
  const [id, setId] = useState('')
  const [format, setFormat] = useState<'uuid' | 'nanoid' | 'custom'>('uuid')
  const [prefix, setPrefix] = useState('')
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const historyService = HistoryManagementService.getInstance()
  const t = useTranslations('Components.IdGenerator');

  const handleGenerateId = async () => {
    try {
      setIsGenerating(true);
      const result = await generateId(format, prefix);

      // Create history entry with full metadata
      await historyService.addEntry({
        value: result.id,
        feature: 'id',
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
              'Store securely',
              'Do not share unnecessarily',
              'Use for identification only'
            ]
          },
          tags: ['generated', format],
          context: prefix ? `Prefix: ${prefix}` : undefined
        }
      });

      setId(result.id);
      setAnalysis(result.analysis);
      
    } catch (err) {
      toast({
        variant: "destructive",
        title: t('errorTitle'),
        description: err instanceof Error ? err.message : t('errorDescription')
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!id) return
    await navigator.clipboard.writeText(id)
    toast({
      title: t('copiedTitle'),
      description: t('copiedDescription'),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-4 bg-secondary p-4 rounded-lg">
            <span className="text-xl font-mono flex-1 break-all font-[family-name:var(--font-geist-mono)]">
              {id || t('placeholder')}
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
            <Label>{t('formatLabel')}</Label>
            <Select value={format} onValueChange={(value: 'uuid' | 'nanoid' | 'custom') => setFormat(value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectFormat')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uuid">{t('uuid')}</SelectItem>
                <SelectItem value="nanoid">{t('nanoid')}</SelectItem>
                <SelectItem value="custom">{t('customFormat')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('prefixLabel')}</Label>
            <Input
              type="text"
              placeholder={t('prefixPlaceholder')}
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
            />
          </div>

          <Button 
            className="w-full" 
            onClick={handleGenerateId}
            disabled={isGenerating}
          >
            {isGenerating ? t('generating') : t('generateId')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}