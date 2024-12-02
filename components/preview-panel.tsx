"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Label } from './ui/label'
import { Progress } from './ui/progress'
import { PreviewService, PreviewResult } from '@/lib/preview-service'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react'

interface PreviewPanelProps {
  feature: 'password' | 'pin' | 'secret' | 'id'
  options: Record<string, any>
  updateInterval?: number
}

export function PreviewPanel({ feature, options, updateInterval }: PreviewPanelProps) {
  const [preview, setPreview] = useState<PreviewResult | null>(null)
  const previewService = PreviewService.getInstance()

  useEffect(() => {
    const previewId = crypto.randomUUID()
    
    previewService.startPreview(
      previewId,
      {
        feature,
        options,
        updateInterval
      },
      setPreview
    )

    return () => {
      previewService.stopPreview(previewId)
    }
  }, [feature, options, updateInterval])

  if (!preview) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label>Preview</Label>
              <span className="text-sm text-muted-foreground">
                {preview.value}
              </span>
            </div>

            {preview.strength !== undefined && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Strength: {(preview.strength * 100).toFixed(0)}%
                  </span>
                  {preview.strength >= 0.8 ? (
                    <Shield className="w-4 h-4 text-green-500" />
                  ) : preview.strength >= 0.5 ? (
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <Progress value={preview.strength * 100} className="h-2" />
              </div>
            )}

            {preview.analysis && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Entropy: {preview.analysis.entropy.toFixed(2)} bits</span>
                  <span>Time to crack: {preview.analysis.timeToCrack}</span>
                </div>

                {preview.analysis.weaknesses.length > 0 && (
                  <div className="text-sm text-red-500">
                    <span>Weaknesses:</span>
                    <ul className="list-disc list-inside">
                      {preview.analysis.weaknesses.map((weakness, i) => (
                        <li key={i}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {preview.metadata && (
              <div className="text-sm text-muted-foreground">
                {Object.entries(preview.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize">{key}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
} 