import { useEffect, useState } from "react";

function currentTime(): string {
  return new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

export function useClock(): string {
  const [time, setTime] = useState(currentTime);

  useEffect(() => {
    const id = window.setInterval(() => setTime(currentTime()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}