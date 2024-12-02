export interface AuditEvent {
  id: string;
  timestamp: number;
  eventType: 'generation' | 'policy_change' | 'access' | 'error';
  actor: string;
  action: string;
  details: Record<string, any>;
  severity: 'info' | 'warning' | 'error';
}

export class AuditService {
  private static instance: AuditService;
  private events: AuditEvent[] = [];

  static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>) {
    const auditEvent: AuditEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    this.events.push(auditEvent);
    this.persistEvent(auditEvent);
  }

  private persistEvent(event: AuditEvent) {
    // In a real implementation, this would send to a secure audit log service
    console.log('Audit event:', event);
  }

  getEvents(filters?: {
    startDate?: Date;
    endDate?: Date;
    eventType?: AuditEvent['eventType'];
    severity?: AuditEvent['severity'];
  }): AuditEvent[] {
    let filtered = this.events;

    if (filters?.startDate) {
      filtered = filtered.filter(e => e.timestamp >= filters.startDate!.getTime());
    }
    if (filters?.endDate) {
      filtered = filtered.filter(e => e.timestamp <= filters.endDate!.getTime());
    }
    if (filters?.eventType) {
      filtered = filtered.filter(e => e.eventType === filters.eventType);
    }
    if (filters?.severity) {
      filtered = filtered.filter(e => e.severity === filters.severity);
    }

    return filtered;
  }

  generateReport(startDate: Date, endDate: Date): string {
    const events = this.getEvents({ startDate, endDate });
    // Generate CSV or other report format
    return events.map(e => JSON.stringify(e)).join('\n');
  }
} 