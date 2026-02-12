import { useEffect, useState } from "react";
import { EventLogger } from "./eventLogger";

export const useFullscreenEnforcement = (logger: EventLogger, enforce: boolean = true) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!enforce) return;

    const requestFullscreen = async () => {
      try {
        logger.log({ eventType: "FULLSCREEN_REQUEST" });
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } catch (error) {
        logger.log({ 
          eventType: "FULLSCREEN_DENIED",
          metadata: { error: String(error) }
        });
        setIsFullscreen(false);
      }
    };

    const handleFullscreenChange = () => {
      const inFullscreen = !!document.fullscreenElement;
      setIsFullscreen(inFullscreen);

      if (!inFullscreen && enforce) {
        // User exited fullscreen - request again
        setTimeout(() => {
          requestFullscreen();
        }, 500);
      }
    };

    // Request fullscreen on mount
    requestFullscreen();

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [logger, enforce]);

  return { isFullscreen };
};
