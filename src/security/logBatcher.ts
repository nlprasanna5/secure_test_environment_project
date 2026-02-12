import type { SecureEvent } from "./eventTypes";

/**
 * LogBatcher - Manages event batching for localStorage
 * Since we're using localStorage exclusively, this class just manages
 * periodic console logging for monitoring purposes
 */
export class LogBatcher {
  private intervalId: number | null = null;
  private lastLogCount: number = 0;

  constructor() {
    this.startMonitoring();
  }

  private startMonitoring() {
    // Monitor and log statistics every 30 seconds for debugging
    this.intervalId = window.setInterval(() => {
      const logs = this.getLogsFromStorage();
      const newEventCount = logs.length - this.lastLogCount;
      
      if (newEventCount > 0) {
        console.log(`[LogBatcher] ${newEventCount} new events logged (Total: ${logs.length})`);
        this.lastLogCount = logs.length;
      }
    }, 30000);
  }

  private getLogsFromStorage(): SecureEvent[] {
    try {
      return JSON.parse(localStorage.getItem('secure_test_logs') || '[]');
    } catch {
      return [];
    }
  }

  addToQueue(logs: SecureEvent[]) {
    // No queue needed - logs are already in localStorage
    // Just update the count for monitoring
    this.lastLogCount = logs.length;
  }

  async flushQueue(): Promise<boolean> {
    // No network calls - logs are already persisted in localStorage
    console.log('[LogBatcher] All logs persisted in localStorage');
    return true;
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async finalFlush(): Promise<boolean> {
    this.stop();
    const logs = this.getLogsFromStorage();
    console.log(`[LogBatcher] Final flush - ${logs.length} total events in localStorage`);
    return true;
  }
}
