import { useEffect, useRef, useState } from "react";
import { EventLogger } from "./eventLogger";

export interface TimerConfig {
  durationMinutes: number;
  onExpire: () => void;
}

export const useTimer = (
  logger: EventLogger,
  config?: TimerConfig
) => {
  const [timerState, setTimerState] = useState<{
    remainingSeconds: number | null;
    isRunning: boolean;
  }>(() => {
    if (!config) {
      return { remainingSeconds: null, isRunning: false };
    }

    // Load existing session
    const session = logger.getSession();
    
    if (session?.remainingTime !== undefined) {
      // Resume existing timer
      logger.log({ 
        eventType: "SESSION_RESUME",
        metadata: { remainingSeconds: session.remainingTime }
      });
      return { remainingSeconds: session.remainingTime, isRunning: true };
    } else {
      // Start new timer
      const totalSeconds = config.durationMinutes * 60;
      
      logger.log({
        eventType: "TIMER_START",
        metadata: { durationMinutes: config.durationMinutes, totalSeconds }
      });

      // Save initial session
      const newSession = {
        attemptId: logger.getSession()?.attemptId || crypto.randomUUID(),
        startTime: new Date().toISOString(),
        timerDuration: totalSeconds,
        remainingTime: totalSeconds,
        isSubmitted: false,
        lastActivity: new Date().toISOString()
      };
      logger.saveSession(newSession);
      
      return { remainingSeconds: totalSeconds, isRunning: true };
    }
  });

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!timerState.isRunning || timerState.remainingSeconds === null) return;

    intervalRef.current = window.setInterval(() => {
      setTimerState((prev) => {
        if (prev.remainingSeconds === null || prev.remainingSeconds <= 0) {
          return { ...prev, remainingSeconds: 0, isRunning: false };
        }

        const newTime = prev.remainingSeconds - 1;

        // Update session storage
        const session = logger.getSession();
        if (session) {
          session.remainingTime = newTime;
          session.lastActivity = new Date().toISOString();
          logger.saveSession(session);
        }

        // Log every minute
        if (newTime % 60 === 0) {
          logger.log({
            eventType: "TIMER_TICK",
            metadata: { remainingSeconds: newTime }
          });
        }

        // Timer expired
        if (newTime === 0) {
          logger.log({ eventType: "TIMER_EXPIRED" });
          config?.onExpire();
          return { remainingSeconds: 0, isRunning: false };
        }

        return { ...prev, remainingSeconds: newTime };
      });
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning, timerState.remainingSeconds, logger, config]);

  const stopTimer = () => {
    setTimerState((prev) => ({ ...prev, isRunning: false }));
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    logger.log({
      eventType: "TIMER_END",
      metadata: { remainingSeconds: timerState.remainingSeconds }
    });
  };

  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return "00:00";
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return {
    remainingSeconds: timerState.remainingSeconds,
    formattedTime: formatTime(timerState.remainingSeconds),
    isRunning: timerState.isRunning,
    stopTimer
  };
};
