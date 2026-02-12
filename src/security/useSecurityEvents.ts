import { useEffect } from "react";
import { EventLogger } from "./eventLogger";

export const useSecurityEvents = (logger: EventLogger) => {
  useEffect(() => {
    // Tab visibility
    const handleVisibility = () => {
      if (document.hidden) {
        logger.log({ eventType: "TAB_HIDDEN" });
      } else {
        logger.log({ eventType: "TAB_VISIBLE" });
      }
    };

    // Focus
    const handleBlur = () => {
      logger.log({ eventType: "FOCUS_LOST" });
    };

    const handleFocus = () => {
      logger.log({ eventType: "FOCUS_GAINED" });
    };

    // Copy / Paste / Cut
    const handleCopy = () => {
      logger.log({ 
        eventType: "COPY_ATTEMPT",
        metadata: { 
          selection: window.getSelection()?.toString().substring(0, 100) 
        }
      });
    };

    const handlePaste = () => {
      logger.log({ eventType: "PASTE_ATTEMPT" });
    };

    const handleCut = () => {
      logger.log({ 
        eventType: "CUT_ATTEMPT",
        metadata: { 
          selection: window.getSelection()?.toString().substring(0, 100) 
        }
      });
    };

    // Context Menu (Right Click)
    const handleContextMenu = (e: MouseEvent) => {
      logger.log({ 
        eventType: "CONTEXT_MENU_BLOCKED",
        metadata: { x: e.clientX, y: e.clientY }
      });
      e.preventDefault();
    };

    // Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block common shortcuts
      const blockedShortcuts = [
        // Developer tools
        { key: 'I', ctrl: true, shift: true }, // Ctrl+Shift+I
        { key: 'J', ctrl: true, shift: true }, // Ctrl+Shift+J
        { key: 'C', ctrl: true, shift: true }, // Ctrl+Shift+C
        { key: 'F12', ctrl: false, shift: false }, // F12
        // View source
        { key: 'U', ctrl: true, shift: false }, // Ctrl+U
        // Print
        { key: 'P', ctrl: true, shift: false }, // Ctrl+P
        // Save
        { key: 'S', ctrl: true, shift: false }, // Ctrl+S
      ];

      const isBlocked = blockedShortcuts.some(shortcut => {
        const keyMatch = shortcut.key === e.key.toUpperCase();
        const ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : true;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        return keyMatch && ctrlMatch && shiftMatch;
      });

      if (isBlocked) {
        logger.log({ 
          eventType: "KEYBOARD_SHORTCUT_BLOCKED",
          metadata: { 
            key: e.key, 
            ctrl: e.ctrlKey, 
            shift: e.shiftKey, 
            alt: e.altKey,
            meta: e.metaKey 
          }
        });
        e.preventDefault();
      }
    };

    // Fullscreen
    const handleFullscreen = () => {
      if (document.fullscreenElement) {
        logger.log({ eventType: "FULLSCREEN_ENTER" });
      } else {
        logger.log({ eventType: "FULLSCREEN_EXIT" });
      }
    };

    // DevTools detection (simple heuristic)
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        logger.log({ 
          eventType: "DEVTOOLS_DETECTED",
          metadata: { 
            outerWidth: window.outerWidth,
            innerWidth: window.innerWidth,
            outerHeight: window.outerHeight,
            innerHeight: window.innerHeight
          }
        });
      }
    };

    // Network status
    const handleOnline = () => {
      logger.log({ eventType: "NETWORK_ONLINE" });
    };

    const handleOffline = () => {
      logger.log({ eventType: "NETWORK_OFFLINE" });
    };

    // Page refresh/unload
    const handleBeforeUnload = () => {
      logger.log({ eventType: "PAGE_UNLOAD" });
    };

    // Attach listeners
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("cut", handleCut);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreen);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // DevTools detection interval
    const devToolsInterval = setInterval(detectDevTools, 1000);

    // Session start
    logger.log({ eventType: "SESSION_START" });

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreen);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(devToolsInterval);
    };
  }, [logger]);
};
