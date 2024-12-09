"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"
import { useToast } from "@/components/ui/use-toast"
import { Moon, Sun, Monitor, Copy, Check, Paintbrush, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { motion, AnimatePresence } from "framer-motion"

type ThemeMode = 'light' | 'dark' | 'system'

interface ColorTheme {
  name: string
  light: {
    background: string
    foreground: string
    primary: string
    muted: string
  }
  dark: {
    background: string
    foreground: string
    primary: string
    muted: string
  }
}

interface PantoneColor {
  year: number
  name: string
  themeKey: keyof typeof colorThemes
  pantone: string
  hex: string
  description: string
}

const colorThemes = {
  default: {
    name: "Default",
    light: {
      background: "#ffffff",
      foreground: "#09090b",
      primary: "#18181b",
      muted: "#27272a"
    },
    dark: {
      background: "#09090b",
      foreground: "#ffffff",
      primary: "#fafafa",
      muted: "#27272a"
    }
  },
  veryPeri: {
    name: "Very Peri",
    light: {
      background: "#ffffff",
      foreground: "#09090b",
      primary: "#6667AB",
      muted: "#8788bd"
    },
    dark: {
      background: "#09090b",
      foreground: "#ffffff",
      primary: "#6667AB",
      muted: "#4a4b8f"
    }
  },
  vivaMagenta: {
    name: "Viva Magenta",
    light: {
      background: "#ffffff",
      foreground: "#09090b",
      primary: "#BB2649",
      muted: "#d14d6d"
    },
    dark: {
      background: "#09090b",
      foreground: "#ffffff",
      primary: "#BB2649",
      muted: "#991f3b"
    }
  },
  peachFuzz: {
    name: "Peach Fuzz",
    light: {
      background: "#ffffff",
      foreground: "#09090b",
      primary: "#F5C3AA",
      muted: "#f8d4c2"
    },
    dark: {
      background: "#09090b",
      foreground: "#ffffff",
      primary: "#F5C3AA",
      muted: "#f2b292"
    }
  },
  mochaMousse: {
    name: "Mocha Mousse",
    light: {
      background: "#ffffff",
      foreground: "#09090b",
      primary: "#A67C5B",
      muted: "#bf9979"
    },
    dark: {
      background: "#09090b",
      foreground: "#ffffff",
      primary: "#A67C5B",
      muted: "#8d643d"
    }
  }
} as const

export function ThemeSettings() {
  const { theme, setTheme, systemTheme } = useTheme()
  const { toast } = useToast()
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const [selectedColorTheme, setSelectedColorTheme] = useState<keyof typeof colorThemes>("default")

  const modes: Array<{
    value: ThemeMode
    label: string
    icon: typeof Sun | typeof Moon | typeof Monitor
  }> = [
    {
      value: "light",
      label: "Light",
      icon: Sun,
    },
    {
      value: "dark",
      label: "Dark",
      icon: Moon,
    },
    {
      value: "system",
      label: "System",
      icon: Monitor,
    },
  ]

  const pantoneColors: PantoneColor[] = [
    {
      year: 2022,
      name: "Very Peri",
      themeKey: "veryPeri",
      pantone: "17-3938",
      hex: "#6667AB",
      description: "Một sắc xanh lam động, kết hợp với tông tím đỏ, thể hiện sự sáng tạo và năng động."
    },
    {
      year: 2023,
      name: "Viva Magenta",
      themeKey: "vivaMagenta",
      pantone: "18-1750",
      hex: "#BB2649",
      description: "Một sắc đỏ đậm, tràn đầy sức sống và năng lượng, khuyến khích sự lạc quan và niềm vui."
    },
    {
      year: 2024,
      name: "Peach Fuzz",
      themeKey: "peachFuzz",
      pantone: "13-1023",
      hex: "#F5C3AA",
      description: "Một sắc đào nhẹ nhàng, ấm áp, tượng trưng cho sự gần gũi và kết nối."
    },
    {
      year: 2025,
      name: "Mocha Mousse",
      themeKey: "mochaMousse",
      pantone: "17-1230",
      hex: "#A67C5B",
      description: "Một sắc nâu ấm áp, gợi nhớ đến cacao, sô cô la và cà phê, mang lại cảm giác thoải mái và sang trọng."
    }
  ]

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme)
    toast({
      title: "Theme mode updated",
      description: `Theme has been changed to ${newTheme} mode.`
    })
  }

  const getCurrentThemeMode = () => {
    return (theme === 'system' ? systemTheme : theme) as 'light' | 'dark'
  }

  const handleColorThemeChange = (colorKey: keyof typeof colorThemes) => {
    setSelectedColorTheme(colorKey)
    const currentMode = getCurrentThemeMode()
    
    // Áp dụng theme màu mới
    document.documentElement.style.setProperty(
      '--theme-primary', 
      colorThemes[colorKey][currentMode].primary
    )
    document.documentElement.style.setProperty(
      '--theme-muted', 
      colorThemes[colorKey][currentMode].muted
    )
    
    toast({
      title: "Color theme updated",
      description: `Theme color has been changed to ${colorThemes[colorKey].name}.`
    })
  }

  const resetTheme = () => {
    setSelectedColorTheme("default")
    const currentMode = getCurrentThemeMode()
    
    document.documentElement.style.setProperty(
      '--theme-primary', 
      colorThemes.default[currentMode].primary
    )
    document.documentElement.style.setProperty(
      '--theme-muted', 
      colorThemes.default[currentMode].muted
    )
    
    toast({
      title: "Theme reset",
      description: "Theme has been reset to default."
    })
  }

  const copyToClipboard = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex)
      setCopiedColor(hex)
      toast({
        title: "Color copied!",
        description: `${hex} has been copied to your clipboard.`
      })
      setTimeout(() => setCopiedColor(null), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <Label>Theme Mode</Label>
            <p className="text-sm text-muted-foreground">
              Choose your preferred theme mode.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetTheme}
            className="h-8 text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset Theme
          </Button>
        </div>
        <RadioGroup 
          defaultValue={theme} 
          onValueChange={handleThemeChange}
          className="grid grid-cols-3 gap-4"
        >
          {modes.map(({ value, label, icon: Icon }) => (
            <div key={value}>
              <RadioGroupItem
                value={value}
                id={value}
                className="peer sr-only"
              />
              <Label
                htmlFor={value}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-md border-2 border-muted p-4",
                  "hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary",
                  "cursor-pointer transition-all"
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm font-medium">{label}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label>Current Theme</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Your current theme settings.
        </p>
        <motion.div 
          layout
          className="p-4 rounded-lg border bg-card"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div 
                layout
                className="w-6 h-6 rounded-full border"
                style={{ 
                  backgroundColor: colorThemes[selectedColorTheme][getCurrentThemeMode()].primary 
                }}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              />
              <span className="text-sm font-medium">
                {colorThemes[selectedColorTheme].name}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {theme === 'system' ? `System (${systemTheme})` : theme} mode
            </span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex gap-2">
              <div className="h-8 flex-1 rounded border bg-background" />
              <div 
                className="h-8 flex-1 rounded" 
                style={{ backgroundColor: colorThemes[selectedColorTheme][getCurrentThemeMode()].primary }}
              />
              <div 
                className="h-8 flex-1 rounded"
                style={{ backgroundColor: colorThemes[selectedColorTheme][getCurrentThemeMode()].muted }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm">Primary Button</Button>
              <Button size="sm" variant="outline">Outline Button</Button>
            </div>
          </div>
        </motion.div>
      </div>

      <div>
        <Label>Pantone Color of the Year</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Khám phá các màu sắc của năm từ Pantone từ 2022 đến 2025.
        </p>
        <div className="grid grid-cols-4 gap-6">
          <AnimatePresence>
            {pantoneColors.map((color) => (
              <motion.div
                key={color.year}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className="group flex flex-col gap-3 cursor-pointer"
                      onClick={() => handleColorThemeChange(color.themeKey)}
                    >
                      <div className="relative">
                        <motion.div 
                          className={cn(
                            "aspect-square rounded-lg shadow-sm border overflow-hidden transition-all duration-200",
                            "group-hover:shadow-lg group-hover:scale-105",
                            selectedColorTheme === color.themeKey && "ring-2 ring-primary"
                          )}
                          style={{ backgroundColor: color.hex }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        />
                        <div className={cn(
                          "absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity",
                          "opacity-0 group-hover:opacity-100"
                        )}>
                          <Paintbrush className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium">{color.name}</p>
                          <p className="text-xs text-muted-foreground">Pantone {color.pantone}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              copyToClipboard(color.hex)
                            }}
                          >
                            <code className="text-[10px] font-mono">
                              {color.hex}
                            </code>
                            {copiedColor === color.hex ? (
                              <Check className="h-3 w-3 ml-1" />
                            ) : (
                              <Copy className="h-3 w-3 ml-1" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-[250px] p-4">
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          {color.name}
                          <span className="text-xs text-muted-foreground">
                            {color.year}
                          </span>
                        </p>
                        <p className="text-xs font-mono text-muted-foreground">
                          Pantone {color.pantone}
                        </p>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: color.hex }}
                          />
                          <code className="text-xs font-mono">
                            {color.hex}
                          </code>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {color.description}
                        </p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
} 