export interface SyncConfig {
  features: {
    name: string;
    priority: number;
    conflictResolution: 'server' | 'client' | 'manual';
  }[];
  syncInterval: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface SyncState {
  lastSync: Date | null;
  inProgress: boolean;
  error?: string;
  progress: {
    total: number;
    completed: number;
    failed: number;
  };
}

export class SynchronizationService {
  private static instance: SynchronizationService;
  private readonly config: SyncConfig;
  private state: SyncState = {
    lastSync: null,
    inProgress: false,
    progress: {
      total: 0,
      completed: 0,
      failed: 0
    }
  };
  private syncTimer?: ReturnType<typeof setInterval>;

  private constructor(config: SyncConfig) {
    this.config = config;
    this.initializeSync();
  }

  static getInstance(config?: SyncConfig): SynchronizationService {
    if (!SynchronizationService.instance) {
      if (!config) {
        throw new Error('Config required for first initialization');
      }
      SynchronizationService.instance = new SynchronizationService(config);
    }
    return SynchronizationService.instance;
  }

  private initializeSync() {
    this.startSyncTimer();
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleOnline());
    }
  }

  private startSyncTimer() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
    this.syncTimer = setInterval(() => {
      this.sync();
    }, this.config.syncInterval);
  }

  private async handleOnline() {
    await this.sync();
  }

  async sync(): Promise<void> {
    if (this.state.inProgress) return;

    this.state.inProgress = true;
    this.state.progress = {
      total: this.config.features.length,
      completed: 0,
      failed: 0
    };

    try {
      // Sort features by priority
      const features = [...this.config.features]
        .sort((a, b) => b.priority - a.priority);

      for (const feature of features) {
        try {
          await this.syncFeature(feature);
          this.state.progress.completed++;
        } catch (error) {
          this.state.progress.failed++;
          console.error(`Failed to sync ${feature.name}:`, error);
        }
      }

      this.state.lastSync = new Date();
      delete this.state.error;
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Unknown error';
    } finally {
      this.state.inProgress = false;
    }
  }

  private async syncFeature(feature: SyncConfig['features'][0]): Promise<void> {
    // Get local data
    const localData = await this.getLocalData(feature.name);
    
    // Get server data
    const serverData = await this.getServerData(feature.name);

    // Detect conflicts
    const conflicts = this.detectConflicts(localData, serverData);

    if (conflicts.length > 0) {
      await this.resolveConflicts(conflicts, feature.conflictResolution);
    }

    // Sync data
    await this.syncData(feature.name, localData, serverData);
  }

  private async getLocalData(feature: string): Promise<any[]> {
    // Implement local data retrieval
    return [];
  }

  private async getServerData(feature: string): Promise<any[]> {
    // Implement server data retrieval
    return [];
  }

  private detectConflicts(local: any[], server: any[]): any[] {
    // Implement conflict detection
    return [];
  }

  private async resolveConflicts(
    conflicts: any[],
    resolution: SyncConfig['features'][0]['conflictResolution']
  ): Promise<void> {
    switch (resolution) {
      case 'server':
        // Use server version
        break;
      case 'client':
        // Use client version
        break;
      case 'manual':
        // Prompt user for resolution
        break;
    }
  }

  private async syncData(feature: string, local: any[], server: any[]): Promise<void> {
    // Implement data synchronization
  }

  getSyncState(): SyncState {
    return { ...this.state };
  }

  async forceSyncFeature(featureName: string): Promise<void> {
    const feature = this.config.features.find(f => f.name === featureName);
    if (!feature) {
      throw new Error(`Unknown feature: ${featureName}`);
    }

    await this.syncFeature(feature);
  }
} 