"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
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
  History
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
import { eventBus } from '@/lib/event-bus'

export function HistoryPanel() {
  const { toast } = useToast()
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [filter, setFilter] = useState<HistoryFilter>({})
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('all')
  const historyService = HistoryManagementService.getInstance()

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
    if (confirm('Are you sure you want to clear all history?')) {
      await historyService.clearHistory()
      loadHistory()
      toast({
        title: 'History Cleared',
        description: 'All history has been cleared'
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>History</CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
          </Button>
          <div className="relative">
            <input
              type="file"
              className="hidden"
              id="import-file"
              accept=".json"
              onChange={handleImport}
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => document.getElementById('import-file')?.click()}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleClearHistory}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search history..."
                className="pl-8"
                onChange={e => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2"
            >
              <Select
                value={selectedType}
                onValueChange={setSelectedType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="password">Passwords</SelectItem>
                  <SelectItem value="pin">PINs</SelectItem>
                  <SelectItem value="secret">Secrets</SelectItem>
                  <SelectItem value="id">IDs</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-1">
                {historyService.getAllTags().map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => handleTagSelect(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={filter.favorites ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('favorites', !filter.favorites)}
                >
                  <Star className="h-4 w-4 mr-1" />
                  Favorites
                </Button>
              </div>
            </motion.div>
          )}

          <ScrollArea className="h-[500px]">
            <AnimatePresence>
              {entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mb-2" />
                  <p>No history found</p>
                </div>
              ) : (
                entries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 border-b last:border-0 hover:bg-accent/50 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-1">
                        <div className="font-mono break-all">{entry.value}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {new Date(entry.timestamp).toLocaleString()}
                          <Badge variant="secondary">{entry.feature}</Badge>
                          {entry.metadata.strength && (
                            <Badge 
                              variant="outline"
                              className={
                                entry.metadata.strength >= 0.8 ? 'bg-green-500/10' :
                                entry.metadata.strength >= 0.6 ? 'bg-blue-500/10' :
                                entry.metadata.strength >= 0.4 ? 'bg-yellow-500/10' :
                                'bg-red-500/10'
                              }
                            >
                              Strength: {Math.round(entry.metadata.strength * 100)}%
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(entry.value)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleFavorite(entry.id)}
                        >
                          <Star
                            className={`h-4 w-4 ${
                              entry.metadata.favorite ? 'fill-yellow-400' : ''
                            }`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {entry.metadata.tags && entry.metadata.tags.length > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <Tag className="h-3 w-3 text-muted-foreground" />
                        <div className="flex flex-wrap gap-1">
                          {entry.metadata.tags.map(tag => (
                            <Badge
                              key={tag}
                              variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                              className="cursor-pointer"
                              onClick={() => handleTagSelect(tag)}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
} 