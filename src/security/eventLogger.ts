import type { SecureEvent, SessionState } from "./eventTypes";

const STORAGE_KEY = "secure_test_logs";
const SESSION_KEY = "secure_test_session";

export class EventLogger {
  private attemptId: string;
  private isSubmitted: boolean = false;

  constructor(attemptId: string) {
    this.attemptId = attemptId;
    this.loadSession();
  }

  private loadSession() {
    const session = this.getSession();
    if (session) {
      this.isSubmitted = session.isSubmitted;
    }
  }

  log(event: Omit<SecureEvent, "timestamp" | "attemptId">) {
    // Prevent logging after submission (immutability)
    if (this.isSubmitted) {
      console.warn("Cannot log events after submission. Logs are immutable.");
      return;
    }

    const fullEvent: SecureEvent = {
      ...event,
      attemptId: this.attemptId,
      timestamp: new Date().toISOString(),
    };

    const existing = this.getLogs();
    existing.push(fullEvent);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch (error) {
      console.error("Failed to persist log:", error);
    }
  }

  getLogs(): SecureEvent[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  }

  clearLogs() {
    if (this.isSubmitted) {
      console.warn("Cannot clear logs after submission.");
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
  }

  markAsSubmitted() {
    this.isSubmitted = true;
    const session = this.getSession();
    if (session) {
      session.isSubmitted = true;
      this.saveSession(session);
    }
    this.log({ eventType: "LOGS_SUBMITTED" });
  }

  getSession(): SessionState | null {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  saveSession(session: SessionState) {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.error("Failed to save session:", error);
    }
  }

  clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  isSessionSubmitted(): boolean {
    return this.isSubmitted;
  }
}
