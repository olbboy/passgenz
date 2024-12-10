"use client"

import { useTheme } from '@/hooks/use-theme'
import { useThemeStore } from '@/lib/stores/theme-store'
import { colorThemes, type ThemeType, type ThemeDefinition } from '@/config/themes'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Moon, Sun, Monitor, Star, History, X, Check } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useState } from "react"
import type { ColorMode } from '@/lib/stores/theme-store'

export function ThemeSettings() {
    const { selectedTheme, mode, setMode, resolvedTheme } = useTheme()
    const { setTheme } = useThemeStore()
    const [showPreview, setShowPreview] = useState(false)

    const modes: { value: ColorMode; label: string; icon: typeof Sun }[] = [
        { value: 'light', label: 'Light', icon: Sun },
        { value: 'system', label: 'System', icon: Monitor },
        { value: 'dark', label: 'Dark', icon: Moon },
    ]

    return (
        <div className="w-full max-w-[400px] mx-auto">
            <div className="flex flex-col space-y-4 p-4">
                <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <h2 className="text-xl font-semibold">Theme Settings</h2>
                                <p className="text-sm text-muted-foreground">
                                    Customize the appearance of your workspace
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Theme Grid */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Theme</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {(Object.entries(colorThemes) as [ThemeType, ThemeDefinition][]).map(([key, theme]) => (
                                        <Card
                                            key={key}
                                            className={cn(
                                                "group relative p-4 cursor-pointer overflow-hidden transition-all duration-200",
                                                "hover:bg-accent/50 hover:shadow-lg",
                                                selectedTheme === key && [
                                                    "ring-2 ring-primary",
                                                    "after:absolute after:inset-0",
                                                    "after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_hsl(var(--primary))]"
                                                ]
                                            )}
                                            onClick={() => setTheme(key)}
                                        >
                                            <div className="space-y-3">
                                                <div className="relative">
                                                    <div
                                                        className={cn(
                                                            "w-full h-12 rounded-lg transition-all duration-200",
                                                            "group-hover:scale-105 group-hover:shadow-md",
                                                            selectedTheme === key && "scale-105"
                                                        )}
                                                        style={{ 
                                                            background: resolvedTheme === 'dark' 
                                                                ? theme.dark.primary 
                                                                : theme.light.primary 
                                                        }}
                                                    />
                                                    {selectedTheme === key && (
                                                        <div 
                                                            className={cn(
                                                                "absolute inset-0 flex items-center justify-center",
                                                                "bg-black/20 rounded-lg backdrop-blur-[1px]",
                                                                "animate-in fade-in-0 zoom-in-95 duration-200"
                                                            )}
                                                        >
                                                            <Check className="w-6 h-6 text-white drop-shadow-lg" strokeWidth={3} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium leading-none">{theme.name}</p>
                                                    {theme.year && (
                                                        <p 
                                                            className={cn(
                                                                "text-xs text-muted-foreground mt-1",
                                                                "group-hover:text-primary transition-colors duration-200",
                                                                selectedTheme === key && "text-primary"
                                                            )}
                                                        >
                                                            Pantone {theme.year}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end text-sm text-muted-foreground">
                                {Object.keys(colorThemes).length} themes available
                            </div>
                        </div>
            </div>
        </div>
    )
} 