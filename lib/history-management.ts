import { eventBus } from './event-bus'
import { HistoryMetadata } from './types';

export interface HistoryEntry {
  id: string;
  timestamp: number;
  feature: 'password' | 'pin' | 'secret' | 'id';
  value: string;
  metadata: HistoryMetadata;
}

export interface HistoryFilter {
  feature?: HistoryEntry['feature'];
  startDate?: Date;
  endDate?: Date;
  minStrength?: number;
  tags?: string[];
  favorites?: boolean;
  searchText?: string;
}

export class HistoryManagementService {
  private static instance: HistoryManagementService;
  private readonly history: Map<string, HistoryEntry> = new Map();
  private readonly maxEntries = 1000;

  static getInstance(): HistoryManagementService {
    if (!HistoryManagementService.instance) {
      HistoryManagementService.instance = new HistoryManagementService();
    }
    return HistoryManagementService.instance;
  }

  async addEntry(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): Promise<HistoryEntry> {
    const newEntry: HistoryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    // Check size limit
    if (this.history.size >= this.maxEntries) {
      await this.cleanupOldEntries();
    }

    this.history.set(newEntry.id, newEntry);
    await this.persistHistory();

    // Emit event
    eventBus.emit('history-updated');

    return newEntry;
  }

  private async cleanupOldEntries(): Promise<void> {
    // Keep favorites and recent entries
    const entries = Array.from(this.history.values())
      .sort((a, b) => b.timestamp - a.timestamp);

    const favorites = entries.filter(e => e.metadata.favorite);
    const recent = entries
      .filter(e => !e.metadata.favorite)
      .slice(0, this.maxEntries - favorites.length);

    this.history.clear();
    [...favorites, ...recent].forEach(entry => {
      this.history.set(entry.id, entry);
    });
  }

  private async persistHistory(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const data = Array.from(this.history.values());
      localStorage.setItem('generation_history', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to persist history:', error);
    }
  }

  async loadHistory(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const data = localStorage.getItem('generation_history');
      if (data) {
        const entries = JSON.parse(data) as HistoryEntry[];
        this.history.clear();
        entries.forEach(entry => {
          this.history.set(entry.id, entry);
        });
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  }

  searchHistory(filter: HistoryFilter): HistoryEntry[] {
    return Array.from(this.history.values())
      .filter(entry => {
        if (filter.feature && entry.feature !== filter.feature) return false;
        if (filter.startDate && entry.timestamp < filter.startDate.getTime()) return false;
        if (filter.endDate && entry.timestamp > filter.endDate.getTime()) return false;
        if (filter.minStrength && (entry.metadata.strength || 0) < filter.minStrength) return false;
        if (filter.tags && !filter.tags.every(tag => entry.metadata.tags?.includes(tag))) return false;
        if (filter.favorites && !entry.metadata.favorite) return false;
        if (filter.searchText) {
          const searchLower = filter.searchText.toLowerCase();
          return entry.value.toLowerCase().includes(searchLower) ||
                 entry.metadata.context?.toLowerCase().includes(searchLower) ||
                 entry.metadata.tags?.some(tag => tag.toLowerCase().includes(searchLower));
        }
        return true;
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  async toggleFavorite(id: string): Promise<void> {
    const entry = this.history.get(id);
    if (!entry) return;

    entry.metadata.favorite = !entry.metadata.favorite;
    await this.persistHistory();
  }

  async addTag(id: string, tag: string): Promise<void> {
    const entry = this.history.get(id);
    if (!entry) return;

    entry.metadata.tags = entry.metadata.tags || [];
    if (!entry.metadata.tags.includes(tag)) {
      entry.metadata.tags.push(tag);
      await this.persistHistory();
    }
  }

  async removeTag(id: string, tag: string): Promise<void> {
    const entry = this.history.get(id);
    if (!entry || !entry.metadata.tags) return;

    entry.metadata.tags = entry.metadata.tags.filter((t: string) => t !== tag);
    await this.persistHistory();
  }

  async deleteEntry(id: string): Promise<void> {
    this.history.delete(id);
    await this.persistHistory();
  }

  async clearHistory(): Promise<void> {
    this.history.clear();
    await this.persistHistory();
  }

  getEntry(id: string): HistoryEntry | undefined {
    return this.history.get(id);
  }

  getAllTags(): string[] {
    const tags = new Set<string>();
    this.history.forEach(entry => {
      entry.metadata.tags?.forEach((tag: string) => tags.add(tag));
    });
    return Array.from(tags);
  }

  async exportHistory(): Promise<HistoryEntry[]> {
    return Array.from(this.history.values());
  }

  async importHistory(data: HistoryEntry[]): Promise<void> {
    // Validate data format
    if (!Array.isArray(data)) {
      throw new Error('Invalid import data format');
    }

    // Clear existing history
    this.history.clear();

    // Import new entries
    data.forEach(entry => {
      if (this.validateHistoryEntry(entry)) {
        this.history.set(entry.id, entry);
      }
    });

    await this.persistHistory();
  }

  private validateHistoryEntry(entry: any): entry is HistoryEntry {
    return (
      typeof entry === 'object' &&
      typeof entry.id === 'string' &&
      typeof entry.timestamp === 'number' &&
      typeof entry.value === 'string' &&
      typeof entry.feature === 'string' &&
      ['password', 'pin', 'secret', 'id'].includes(entry.feature) &&
      typeof entry.metadata === 'object'
    );
  }
} 