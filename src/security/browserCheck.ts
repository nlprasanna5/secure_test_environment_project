export interface BrowserInfo {
  name: string;
  version: string;
  isChrome: boolean;
}

export function detectBrowser(): BrowserInfo {
  const ua = navigator.userAgent;

  let name = "Unknown";
  let version = "Unknown";
  let isChrome = false;

  if (/Chrome/.test(ua) && !/Edg|OPR/.test(ua)) {
    name = "Google Chrome";
    version = ua.match(/Chrome\/([\d.]+)/)?.[1] || "Unknown";
    isChrome = true;
  } else if (/Firefox/.test(ua)) {
    name = "Firefox";
  } else if (/Safari/.test(ua)) {
    name = "Safari";
  } else if (/Edg/.test(ua)) {
    name = "Edge";
  }

  return { name, version, isChrome };
}
