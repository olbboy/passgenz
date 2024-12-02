export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  activeUsers: number;
  errorRate: number;
  averageResponseTime: number;
}

export class MonitoringService {
  private static instance: MonitoringService;
  private metrics: SystemMetrics = {
    cpuUsage: 0,
    memoryUsage: 0,
    activeUsers: 0,
    errorRate: 0,
    averageResponseTime: 0
  };

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  updateMetrics(metrics: Partial<SystemMetrics>) {
    this.metrics = { ...this.metrics, ...metrics };
    this.checkThresholds();
  }

  private checkThresholds() {
    if (this.metrics.cpuUsage > 80) {
      this.alertHighCPU();
    }
    if (this.metrics.errorRate > 5) {
      this.alertHighErrorRate();
    }
  }

  private alertHighCPU() {
    console.warn('High CPU Usage Alert');
  }

  private alertHighErrorRate() {
    console.error('High Error Rate Alert');
  }
} 