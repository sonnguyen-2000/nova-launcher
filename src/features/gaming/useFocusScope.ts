import { useEffect, useRef } from "react";
import { FOCUSABLE } from "./spatialNav";

/** Khi menu/overlay mở: focus vào nút đầu tiên, khi đóng thì trả focus về chỗ cũ. */
export function useFocusScope<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const previous = document.activeElement;
    ref.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true });

    return () => {
      if (previous instanceof HTMLElement) previous.focus({ preventScroll: true });
    };
  }, []);

  return ref;
}