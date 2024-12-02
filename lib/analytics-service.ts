export interface GenerationMetrics {
  generationType: 'password' | 'pin' | 'secret' | 'id';
  length: number;
  options: Record<string, boolean>;
  strengthScore: number;
  generationTime: number;
  timestamp: number;
}

export class AnalyticsService {
  private metrics: GenerationMetrics[] = [];

  trackGeneration(metric: Omit<GenerationMetrics, 'timestamp'>) {
    const entry = {
      ...metric,
      timestamp: Date.now()
    };
    this.metrics.push(entry);
    this.sendToAnalytics(entry);
  }

  private sendToAnalytics(metric: GenerationMetrics) {
    // Implementation for sending to analytics service
    console.log('Sending to analytics:', metric);
  }

  getAverageStrength(): number {
    if (this.metrics.length === 0) return 0;
    const total = this.metrics.reduce((sum, m) => sum + m.strengthScore, 0);
    return total / this.metrics.length;
  }

  getAverageGenerationTime(): number {
    if (this.metrics.length === 0) return 0;
    const total = this.metrics.reduce((sum, m) => sum + m.generationTime, 0);
    return total / this.metrics.length;
  }
} 