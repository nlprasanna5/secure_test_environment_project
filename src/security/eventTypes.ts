export type EventType =
  | "BROWSER_DETECTED"
  | "BROWSER_BLOCKED"
  | "FULLSCREEN_ENTER"
  | "FULLSCREEN_EXIT"
  | "FULLSCREEN_DENIED"
  | "FULLSCREEN_REQUEST"
  | "TAB_HIDDEN"
  | "TAB_VISIBLE"
  | "COPY_ATTEMPT"
  | "PASTE_ATTEMPT"
  | "CUT_ATTEMPT"
  | "FOCUS_LOST"
  | "FOCUS_GAINED"
  | "TIMER_START"
  | "TIMER_TICK"
  | "TIMER_END"
  | "TIMER_EXPIRED"
  | "SESSION_START"
  | "SESSION_END"
  | "SESSION_RESUME"
  | "CONTEXT_MENU_BLOCKED"
  | "KEYBOARD_SHORTCUT_BLOCKED"
  | "DEVTOOLS_DETECTED"
  | "LOGS_SUBMITTED"
  | "LOGS_BATCH_SENT"
  | "LOGS_BATCH_FAILED"
  | "NETWORK_ONLINE"
  | "NETWORK_OFFLINE"
  | "PAGE_REFRESH"
  | "PAGE_UNLOAD";

export interface SecureEvent {
  eventType: EventType;
  timestamp: string;
  attemptId: string;
  questionId?: string;
  metadata?: Record<string, unknown>;
}

export interface SessionState {
  attemptId: string;
  startTime: string;
  timerDuration?: number;
  remainingTime?: number;
  isSubmitted: boolean;
  lastActivity: string;
}
