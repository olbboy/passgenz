"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { 
  Star, 
  Tags, 
  Trash2, 
  Search, 
  Filter,
  Copy,
  Clock,
  Tag
} from 'lucide-react'
import { HistoryManagementService, HistoryEntry, HistoryFilter } from '@/lib/history-management'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'

export function HistoryPanel() {
  const { toast } = useToast()
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [filter, setFilter] = useState<HistoryFilter>({})
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const historyService = HistoryManagementService.getInstance()

  useEffect(() => {
    loadHistory()
  }, [])

  useEffect(() => {
    const filtered = historyService.searchHistory(filter)
    setEntries(filtered)
  }, [filter])

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
            <Filter className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => historyService.clearHistory()}
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
                
                {/* Add more filter buttons as needed */}
              </div>
            </motion.div>
          )}

          <ScrollArea className="h-[500px]">
            <AnimatePresence>
              {entries.map((entry, index) => (
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
              ))}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
} 