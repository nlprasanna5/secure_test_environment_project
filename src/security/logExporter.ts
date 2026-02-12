import type { SecureEvent } from "./eventTypes";

/*
  Export logs to a downloadable JSON file
 */
export function exportLogsAsJSON(logs: SecureEvent[], filename?: string): void {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const defaultFilename = `secure-test-logs-${timestamp}.json`;
  
  const data = {
    exportedAt: new Date().toISOString(),
    totalEvents: logs.length,
    attemptId: logs[0]?.attemptId || 'unknown',
    logs: logs
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || defaultFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export logs to a downloadable CSV file
 */
export function exportLogsAsCSV(logs: SecureEvent[], filename?: string): void {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const defaultFilename = `secure-test-logs-${timestamp}.csv`;

  const headers = ['Event Type', 'Timestamp', 'Attempt ID', 'Question ID', 'Metadata'];
  const rows = logs.map(log => [
    log.eventType,
    log.timestamp,
    log.attemptId,
    log.questionId || '',
    JSON.stringify(log.metadata || {})
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || defaultFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy logs to clipboard
 */
export async function copyLogsToClipboard(logs: SecureEvent[]): Promise<boolean> {
  try {
    const data = {
      exportedAt: new Date().toISOString(),
      totalEvents: logs.length,
      attemptId: logs[0]?.attemptId || 'unknown',
      logs: logs
    };
    
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Email logs (opens email client with logs in body)
 */
export function emailLogs(logs: SecureEvent[], recipientEmail: string): void {
  const data = {
    exportedAt: new Date().toISOString(),
    totalEvents: logs.length,
    attemptId: logs[0]?.attemptId || 'unknown',
    summary: logs.reduce((acc, log) => {
      acc[log.eventType] = (acc[log.eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  const subject = `Secure Test Logs - ${data.attemptId.substring(0, 8)}`;
  const body = `Assessment Logs Export\n\nExported: ${data.exportedAt}\nTotal Events: ${data.totalEvents}\n\nEvent Summary:\n${JSON.stringify(data.summary, null, 2)}\n\nFull logs are attached as JSON.`;
  
  const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
}

/*
  Generate a shareable report
 */
export function generateReport(logs: SecureEvent[]): string {
  const eventCounts = logs.reduce((acc, log) => {
    acc[log.eventType] = (acc[log.eventType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sessionStart = logs.find(l => l.eventType === 'SESSION_START');
  const sessionEnd = logs.find(l => l.eventType === 'SESSION_END');
  const browserInfo = logs.find(l => l.eventType === 'BROWSER_DETECTED');

  const report = `
=================================================
        SECURE TEST ASSESSMENT REPORT
=================================================

Attempt ID: ${logs[0]?.attemptId || 'Unknown'}
Generated: ${new Date().toISOString()}

-------------------------------------------------
SESSION INFORMATION
-------------------------------------------------
Start Time: ${sessionStart?.timestamp || 'N/A'}
End Time: ${sessionEnd?.timestamp || 'N/A'}
Duration: ${sessionStart && sessionEnd ? 
  Math.round((new Date(sessionEnd.timestamp).getTime() - new Date(sessionStart.timestamp).getTime()) / 1000 / 60) + ' minutes' : 
  'N/A'}

-------------------------------------------------
BROWSER INFORMATION
-------------------------------------------------
${browserInfo?.metadata ? JSON.stringify(browserInfo.metadata, null, 2) : 'N/A'}

-------------------------------------------------
EVENT SUMMARY
-------------------------------------------------
Total Events: ${logs.length}

${Object.entries(eventCounts)
  .sort(([, a], [, b]) => b - a)
  .map(([event, count]) => `${event.padEnd(30)} ${count}`)
  .join('\n')}

-------------------------------------------------
SECURITY ALERTS
-------------------------------------------------
Tab Switches: ${eventCounts['TAB_HIDDEN'] || 0}
Focus Lost: ${eventCounts['FOCUS_LOST'] || 0}
Copy Attempts: ${eventCounts['COPY_ATTEMPT'] || 0}
Paste Attempts: ${eventCounts['PASTE_ATTEMPT'] || 0}
Fullscreen Exits: ${eventCounts['FULLSCREEN_EXIT'] || 0}
Blocked Shortcuts: ${eventCounts['KEYBOARD_SHORTCUT_BLOCKED'] || 0}
DevTools Detected: ${eventCounts['DEVTOOLS_DETECTED'] || 0}

-------------------------------------------------
INTEGRITY CHECK
-------------------------------------------------
${logs.some(l => l.eventType === 'LOGS_SUBMITTED') ? '✓' : '✗'} Logs Submitted
${logs.some(l => l.eventType === 'SESSION_END') ? '✓' : '✗'} Session Completed
${logs.some(l => l.eventType === 'TIMER_EXPIRED') ? '⚠' : '✓'} Timer Status

=================================================
`;

  return report;
}
