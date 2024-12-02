"use client"

import * as React from "react"
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Star, 
  Trash2, 
  Search, 
  SlidersHorizontal,
  Copy,
  Clock,
  Tag,
  Download,
  Upload,
  AlertCircle,
  XCircle,
  CheckCircle,
} from 'lucide-react'
import { HistoryManagementService, HistoryEntry, HistoryFilter } from '@/lib/history-management'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { eventBus } from '@/lib/event-bus'

// Helper function
function formatPatternName(pattern: string): string {
  return pattern
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .replace(/^./, str => str.toUpperCase());
}

export function HistoryPanel() {
  const { toast } = useToast()
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [filter, setFilter] = useState<HistoryFilter>({})
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('all')
  const historyService = HistoryManagementService.getInstance()
  const [sortBy, setSortBy] = useState<'date' | 'strength'>('date')

  useEffect(() => {
    loadHistory()
  }, [])

  useEffect(() => {
    const filtered = historyService.searchHistory({
      ...filter,
      feature: selectedType === 'all' ? undefined : selectedType as any
    })
    setEntries(filtered)
  }, [filter, selectedType])

  useEffect(() => {
    const handleHistoryUpdate = () => {
      loadHistory();
    };

    eventBus.on('history-updated', handleHistoryUpdate);
    return () => {
      eventBus.off('history-updated', handleHistoryUpdate);
    };
  }, []);

  const loadHistory = async () => {
    await historyService.loadHistory()
    setEntries(historyService.searchHistory({}))
  }

  const handleSearch = (text: string) => {
    setFilter(prev => ({ ...prev, searchText: text }))
  }

  const handleTagSelect = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    
    setSelectedTags(newTags)
    setFilter(prev => ({ ...prev, tags: newTags }))
  }

  const handleToggleFavorite = async (id: string) => {
    await historyService.toggleFavorite(id)
    loadHistory()
  }

  const handleDelete = async (id: string) => {
    await historyService.deleteEntry(id)
    loadHistory()
  }

  const copyToClipboard = async (value: string) => {
    await navigator.clipboard.writeText(value)
    toast({
      title: 'Copied!',
      description: 'Value copied to clipboard',
    })
  }

  const handleFilterChange = (key: keyof HistoryFilter, value: any) => {
    setFilter(prev => ({ ...prev, [key]: value }))
  }

  const handleExport = async () => {
    try {
      const data = await historyService.exportHistory()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `password-history-${new Date().toISOString()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export history',
        variant: 'destructive'
      })
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)
      await historyService.importHistory(data)
      loadHistory()
      toast({
        title: 'Import Successful',
        description: 'History imported successfully'
      })
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: 'Failed to import history',
        variant: 'destructive'
      })
    }
  }

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
      await historyService.clearHistory()
      loadHistory()
      toast({
        title: 'History Cleared',
        description: 'All history has been cleared'
      })
    }
  }

  const filteredEntries = React.useMemo(() => {
    let result = entries

    if (selectedType !== 'all') {
      result = result.filter(entry => entry.feature === selectedType)
    }

    if (filter.searchText) {
      const searchLower = filter.searchText.toLowerCase()
      result = result.filter(entry => 
        entry.value.toLowerCase().includes(searchLower) ||
        entry.metadata.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    if (selectedTags.length > 0) {
      result = result.filter(entry => 
        selectedTags.every(tag => entry.metadata.tags?.includes(tag))
      )
    }

    return result.sort((a, b) => {
      if (sortBy === 'date') return b.timestamp - a.timestamp
      return (b.metadata.strength || 0) - (a.metadata.strength || 0)
    })
  }, [entries, selectedType, filter.searchText, selectedTags, sortBy])

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-none space-y-0 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>History</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={(v: 'date' | 'strength') => setSortBy(v)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="strength">Strength</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleExport}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export History</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <input
                      type="file"
                      className="hidden"
                      id="import-file"
                      accept=".json"
                      onChange={handleImport}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => document.getElementById('import-file')?.click()}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Import History</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search history..."
              className="pl-8"
              onChange={e => handleSearch(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-15rem)]">
          <div className="pr-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredEntries.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-8 text-muted-foreground"
                >
                  <AlertCircle className="h-8 w-8 mb-2" />
                  <p>No history found</p>
                  {(filter.searchText || selectedTags.length > 0 || selectedType !== 'all') && (
                    <Button 
                      variant="ghost" 
                      className="mt-2"
                      onClick={() => {
                        setFilter({})
                        setSelectedTags([])
                        setSelectedType('all')
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {filteredEntries.map((entry: HistoryEntry, index: number) => (
                    <motion.div
                      key={entry.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className={cn(
                        "group relative p-4 rounded-lg border bg-card transition-colors",
                        "hover:bg-accent/50"
                      )}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-mono text-sm break-all line-clamp-2">
                            {entry.value}
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    copyToClipboard(entry.value)
                                  }}
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Copy</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleToggleFavorite(entry.id)
                                  }}
                                >
                                  <Star className={cn(
                                    "h-3.5 w-3.5",
                                    entry.metadata.favorite && "fill-yellow-400"
                                  )} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Favorite</TooltipContent>
                            </Tooltip>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(entry.timestamp).toLocaleString()}</span>
                          <Badge variant="secondary" className="text-[10px]">
                            {entry.feature}
                          </Badge>
                          {entry.metadata.strength && (
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px]",
                                entry.metadata.strength >= 0.8 ? 'bg-green-500/10' :
                                entry.metadata.strength >= 0.6 ? 'bg-blue-500/10' :
                                entry.metadata.strength >= 0.4 ? 'bg-yellow-500/10' :
                                'bg-red-500/10'
                              )}
                            >
                              {Math.round(entry.metadata.strength * 100)}%
                            </Badge>
                          )}
                        </div>

                        {entry.metadata.tags && entry.metadata.tags.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap">
                            {entry.metadata.tags?.map((tag: string) => (
                              <Badge
                                key={tag}
                                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                                className="text-[10px] cursor-pointer"
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation()
                                  handleTagSelect(tag)
                                }}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {entry.metadata.analysis.patterns && (
                          <div className="mt-2 space-y-1">
                            <h4 className="text-sm font-medium">Security Checks:</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(entry.metadata.analysis.patterns).map(([pattern, exists]) => (
                                <div key={pattern} className="flex items-center gap-2">
                                  {exists ? (
                                    <XCircle className="h-3 w-3 text-red-500" />
                                  ) : (
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                  )}
                                  <span className="text-xs">{formatPatternName(pattern)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {entry.metadata.analysis.recommendations?.length > 0 && (
                          <div className="mt-2">
                            <h4 className="text-sm font-medium">Recommendations:</h4>
                            <ul className="list-disc pl-4 text-xs space-y-0.5">
                              {entry.metadata.analysis.recommendations.map((rec, i) => (
                                <li key={i}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 