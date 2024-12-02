export interface OfflineConfig {
  maxStorageSize: number; // in bytes
  syncInterval: number; // in milliseconds
  priorityFeatures: ('password' | 'pin' | 'secret' | 'id')[];
}

export interface OfflineData {
  timestamp: number;
  feature: string;
  data: any;
  synced: boolean;
}

export class OfflineModeService {
  private static instance: OfflineModeService;
  private readonly storage: Map<string, OfflineData> = new Map();
  private readonly config: OfflineConfig;
  private isOnline: boolean = true;
  private syncTimer?: ReturnType<typeof setInterval>;

  private constructor(config: OfflineConfig) {
    this.config = config;
    this.initializeOfflineSupport();
  }

  static getInstance(config?: OfflineConfig): OfflineModeService {
    if (!OfflineModeService.instance) {
      if (!config) {
        throw new Error('Config required for first initialization');
      }
      OfflineModeService.instance = new OfflineModeService(config);
    }
    return OfflineModeService.instance;
  }

  private initializeOfflineSupport() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => this.handleOffline());
      
      // Load cached data
      this.loadFromCache();
      
      // Start sync timer
      this.startSyncTimer();
    }
  }

  private async loadFromCache() {
    try {
      const cached = localStorage.getItem('offline_data');
      if (cached) {
        const data = JSON.parse(cached);
        Object.entries(data).forEach(([key, value]) => {
          this.storage.set(key, value as OfflineData);
        });
      }
    } catch (error) {
      console.error('Failed to load cached data:', error);
    }
  }

  private startSyncTimer() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
    this.syncTimer = setInterval(() => {
      this.syncData();
    }, this.config.syncInterval);
  }

  private async handleOnline() {
    this.isOnline = true;
    await this.syncData();
  }

  private handleOffline() {
    this.isOnline = false;
  }

  async storeData(feature: string, data: any): Promise<void> {
    const entry: OfflineData = {
      timestamp: Date.now(),
      feature,
      data,
      synced: this.isOnline
    };

    // Check storage limits
    if (this.getCurrentStorageSize() > this.config.maxStorageSize) {
      await this.cleanupOldData();
    }

    const key = `${feature}_${entry.timestamp}`;
    this.storage.set(key, entry);
    await this.persistToCache();

    if (this.isOnline) {
      await this.syncEntry(key, entry);
    }
  }

  private getCurrentStorageSize(): number {
    return new TextEncoder().encode(
      JSON.stringify(Array.from(this.storage.entries()))
    ).length;
  }

  private async cleanupOldData() {
    // Keep only priority features and recent data
    const entries = Array.from(this.storage.entries())
      .sort(([, a], [, b]) => b.timestamp - a.timestamp);

    const priorityEntries = entries
      .filter(([, data]) => this.config.priorityFeatures.includes(data.feature as any));
    
    const otherEntries = entries
      .filter(([, data]) => !this.config.priorityFeatures.includes(data.feature as any))
      .slice(0, 100); // Keep last 100 non-priority entries

    this.storage.clear();
    [...priorityEntries, ...otherEntries].forEach(([key, value]) => {
      this.storage.set(key, value);
    });
  }

  private async persistToCache() {
    try {
      const data = Object.fromEntries(this.storage.entries());
      localStorage.setItem('offline_data', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to persist to cache:', error);
    }
  }

  private async syncData() {
    if (!this.isOnline) return;

    const unsyncedEntries = Array.from(this.storage.entries())
      .filter(([, data]) => !data.synced);

    for (const [key, data] of unsyncedEntries) {
      await this.syncEntry(key, data);
    }
  }

  private async syncEntry(key: string, data: OfflineData) {
    try {
      // Implement actual sync logic here
      await this.sendToServer(data);
      
      data.synced = true;
      this.storage.set(key, data);
      await this.persistToCache();
    } catch (error) {
      console.error('Failed to sync entry:', error);
    }
  }

  private async sendToServer(data: OfflineData): Promise<void> {
    // Implement actual server communication
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  getOfflineData(feature?: string): OfflineData[] {
    return Array.from(this.storage.values())
      .filter(data => !feature || data.feature === feature)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  isOfflineAvailable(): boolean {
    return !this.isOnline && this.storage.size > 0;
  }

  clearOfflineData(): void {
    this.storage.clear();
    localStorage.removeItem('offline_data');
  }
} 