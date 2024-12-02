import { PasswordAnalysis } from './types'

export interface HistoryEntry {
  id: string;
  timestamp: number;
  type: 'password' | 'pin' | 'secret' | 'id';
  value: string;
  analysis: PasswordAnalysis;
  context?: string;
}

export class HistoryManager {
  private readonly STORAGE_KEY = 'generator_history';
  private readonly MAX_ENTRIES = 100;

  getHistory(): HistoryEntry[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  addEntry(entry: Omit<HistoryEntry, 'id' | 'timestamp'>) {
    const history = this.getHistory();
    const newEntry: HistoryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    history.unshift(newEntry);
    if (history.length > this.MAX_ENTRIES) {
      history.pop();
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    return newEntry;
  }

  clearHistory() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  searchHistory(query: string): HistoryEntry[] {
    const history = this.getHistory();
    return history.filter(entry => 
      entry.value.includes(query) || 
      entry.context?.includes(query)
    );
  }
} 