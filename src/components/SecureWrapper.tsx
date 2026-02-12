import React, { useEffect, useMemo, useState } from "react";
import { detectBrowser } from "../security/browserCheck";
import { EventLogger } from "../security/eventLogger";
import { useSecurityEvents } from "../security/useSecurityEvents";
import { useFullscreenEnforcement } from "../security/useFullscreenEnforcement";
import { useTimer } from "../security/useTimer";
import { SessionManager } from "../security/sessionManager";
import {
  exportLogsAsJSON,
  exportLogsAsCSV,
  generateReport,
} from "../security/logExporter";
import BlockedScreen from "./BlockedScreen";

interface SecureWrapperProps {
  children: React.ReactNode;
  enableFullscreen?: boolean;
  timerDurationMinutes?: number;
  onTimerExpire?: () => void;
  onSubmit?: () => void;
}

const SecureWrapper: React.FC<SecureWrapperProps> = ({
  children,
  enableFullscreen = true,
  timerDurationMinutes,
  onTimerExpire,
  onSubmit,
}) => {
  const browser = detectBrowser();

  const [allowed] = useState(() => browser.isChrome);

  // Get or create session
  const session = useMemo(() => SessionManager.getOrCreateSession(), []);

  const [isSubmitted] = useState(() => session.isSubmitted);

  const logger = useMemo(
    () => new EventLogger(session.attemptId),
    [session.attemptId],
  );

  const handleRestart = () => {
    const confirmRestart = window.confirm(
      "Are you sure you want to restart the assessment?",
    );

    if (!confirmRestart) return;

    localStorage.removeItem("secure_test_logs");
    SessionManager.clearSession?.();
    localStorage.removeItem("secure_test_session");

    window.location.href = window.location.origin;
  };

  // Browser enforcement
  useEffect(() => {
    logger.log({
      eventType: "BROWSER_DETECTED",
      metadata: { ...browser },
    });

    if (!browser.isChrome) {
      logger.log({
        eventType: "BROWSER_BLOCKED",
        metadata: { ...browser },
      });
    }
  }, [browser, logger]);

  // Security listeners
  useSecurityEvents(logger);

  // Fullscreen enforcement
  const { isFullscreen } = useFullscreenEnforcement(logger, enableFullscreen);

  // Timer (if enabled)
  const { formattedTime, remainingSeconds } = useTimer(
    logger,
    timerDurationMinutes
      ? {
          durationMinutes: timerDurationMinutes,
          onExpire: () => {
            handleSubmit();
            onTimerExpire?.();
          },
        }
      : undefined,
  );

  const enterFullscreen = async () => {
    const element = document.documentElement;

    try {
      if (!document.fullscreenElement) {
        await element.requestFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen request failed:", err);
    }
  };
  useEffect(() => {
    if (!enableFullscreen) return;

    const requestFS = async () => {
      if (!document.fullscreenElement) {
        try {
          await document.documentElement.requestFullscreen();
        } catch {
          // Browser may block — user gesture required
        }
      }
    };

    requestFS();
  }, [enableFullscreen]);

  // Handle submission
  const handleSubmit = async () => {
    if (isSubmitted) return;

    logger.log({ eventType: "SESSION_END" });
    logger.markAsSubmitted();

    // Reload to show submitted state
    window.location.reload();

    onSubmit?.();
  };

  // Activity tracking
  useEffect(() => {
    const updateActivity = () => {
      if (!isSubmitted) {
        SessionManager.updateLastActivity();
      }
    };

    const activityEvents = ["mousedown", "keydown", "scroll", "touchstart"];
    activityEvents.forEach((event) => {
      window.addEventListener(event, updateActivity);
    });

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, [isSubmitted]);

  if (!allowed) {
    return <BlockedScreen browser={browser.name} />;
  }

  if (isSubmitted) {
    const handleExportJSON = () => {
      const logs = logger.getLogs();
      exportLogsAsJSON(logs);
    };

    const handleExportCSV = () => {
      const logs = logger.getLogs();
      exportLogsAsCSV(logs);
    };

    const handleViewReport = () => {
      const logs = logger.getLogs();
      const report = generateReport(logs);
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(
          `<pre style="font-family: monospace; padding: 20px;">${report}</pre>`,
        );
        newWindow.document.title = "Assessment Report";
      }
    };

    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f5f5",
          padding: 20,
        }}
      >
        <h1>✅ Assessment Submitted</h1>
        <p style={{ marginBottom: 30, color: "#666" }}>
          Your responses have been recorded and logs are ready for export.
        </p>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            onClick={handleExportJSON}
            style={{
              padding: "12px 24px",
              background: "#2196F3",
              color: "#fff",
              border: "none",
              borderRadius: 5,
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            📥 Download Logs (JSON)
          </button>

          <button
            onClick={handleExportCSV}
            style={{
              padding: "12px 24px",
              background: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: 5,
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            📊 Download Logs (CSV)
          </button>

          <button
            onClick={handleViewReport}
            style={{
              padding: "12px 24px",
              background: "#FF9800",
              color: "#fff",
              border: "none",
              borderRadius: 5,
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            📄 View Report
          </button>

          <button
            onClick={handleRestart}
            style={{
              padding: "12px 24px",
              background: "#2196F3",
              color: "#fff",
              border: "none",
              borderRadius: 5,
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Restart
          </button>
        </div>

        <p style={{ marginTop: 30, color: "#999", fontSize: "14px" }}>
          You can also view logs in console:{" "}
          <code
            style={{ background: "#eee", padding: "2px 6px", borderRadius: 3 }}
          >
            JSON.parse(localStorage.getItem('secure_test_logs'))
          </code>
        </p>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* Timer Display */}
      {timerDurationMinutes && (
        <div
          style={{
            position: "fixed",
            top: 10,
            right: 10,
            background:
              remainingSeconds && remainingSeconds < 300 ? "#ff4444" : "#333",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 5,
            fontWeight: "bold",
            zIndex: 1000,
            fontSize: "18px",
          }}
        >
          Time Remaining: {formattedTime}
        </div>
      )}

      {/* Fullscreen Indicator */}
      {enableFullscreen && !isFullscreen && (
        <div
          onClick={enterFullscreen}
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#ff9800",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 5,
            zIndex: 1000,
            textAlign: "center",
            fontSize: 14,
            maxWidth: "90%",
          }}
        >
          Please enter fullscreen mode
        </div>
      )}

      {/* Floating Action Buttons Container */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "flex-end",
          zIndex: 1000,
        }}
      >
        {/* Export Logs Button */}
        <button
          onClick={() => {
            const logs = logger.getLogs();
            exportLogsAsJSON(logs);
          }}
          style={{
            padding: "12px 20px",
            background: "#2196F3",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            fontSize: 14,
            cursor: "pointer",
            minWidth: 140,
          }}
          title="Download current logs (for testing)"
        >
          📥 Export Logs
        </button>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          style={{
            padding: "12px 20px",
            background: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            fontSize: 14,
            cursor: "pointer",
            minWidth: 180,
            fontWeight: "bold",
          }}
        >
          Submit Assessment
        </button>
      </div>

      {/* Main Content */}
      <div style={{ padding: 20, paddingBottom: 80 }}>{children}</div>
    </div>
  );
};

export default SecureWrapper;
