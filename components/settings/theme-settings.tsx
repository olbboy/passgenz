"use client"

import { useTheme } from '@/hooks/use-theme'
import { useThemeStore } from '@/lib/stores/theme-store'
import { colorThemes, type Theme } from '@/config/themes'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'

export function ThemeSettings() {
  const { selectedTheme } = useTheme()
  const { setTheme, resetTheme } = useThemeStore()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Theme</h3>
        <p className="text-sm text-muted-foreground">
          Customize the appearance of the application
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-3">Color Theme</h4>
          <RadioGroup
            value={selectedTheme}
            onValueChange={(value) => setTheme(value as Theme)}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3"
          >
            {Object.entries(colorThemes).map(([key, theme]) => (
              <Label
                key={key}
                className={`cursor-pointer ${
                  selectedTheme === key ? 'ring-2 ring-primary' : ''
                }`}
              >
                <RadioGroupItem value={key} className="sr-only" />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card className="p-4 space-y-2">
                    <div
                      className="w-full h-10 rounded-md"
                      style={{
                        background: theme.light.primary,
                      }}
                    />
                    <div className="text-sm font-medium">{theme.name}</div>
                  </Card>
                </motion.div>
              </Label>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={resetTheme}
          >
            Reset to Default
          </Button>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Preview</h4>
          <div className="grid gap-4">
            <Card className="p-6">
              <h5 className="text-lg font-medium mb-2">Sample Card</h5>
              <p className="text-muted-foreground">
                This is how content will look with the selected theme.
              </p>
              <div className="flex gap-2 mt-4">
                <Button>Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 