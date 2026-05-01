import { useEffect, useState } from "react";
import time from "@/utils/timeClient";

export default function useTime() {
  const [currentTime, setCurrentTime] = useState(() => time.now());

  useEffect(() => {
    let mounted = true;

    time.initTimeSync().catch((error) => {
      console.warn("[useTime] Failed to initialize server time sync", error);
    });

    const timer = setInterval(() => {
      if (mounted) {
        setCurrentTime(time.now());
      }
    }, 1000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  return currentTime;
}
