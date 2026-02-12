import type { SessionState } from "./eventTypes";

const SESSION_KEY = "secure_test_session";

export class SessionManager {
  static getOrCreateSession(attemptId?: string): SessionState {
    const existing = this.getSession();
    
    if (existing) {
      return existing;
    }

    const newSession: SessionState = {
      attemptId: attemptId || crypto.randomUUID(),
      startTime: new Date().toISOString(),
      isSubmitted: false,
      lastActivity: new Date().toISOString()
    };

    this.saveSession(newSession);
    return newSession;
  }

  static getSession(): SessionState | null {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static saveSession(session: SessionState): void {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.error("Failed to save session:", error);
    }
  }

  static updateLastActivity(): void {
    const session = this.getSession();
    if (session && !session.isSubmitted) {
      session.lastActivity = new Date().toISOString();
      this.saveSession(session);
    }
  }

  static clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
  }

  static isSessionExpired(maxInactiveMinutes: number = 30): boolean {
    const session = this.getSession();
    if (!session) return true;

    const lastActivity = new Date(session.lastActivity);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastActivity.getTime()) / (1000 * 60);

    return diffMinutes > maxInactiveMinutes;
  }
}
