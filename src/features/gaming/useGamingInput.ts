import { useEffect, useRef } from "react";
import type { NavAction } from "./gaming.types";

const KEY_ACTIONS: Record<string, NavAction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  Escape: "back",
  F1: "quick",
  F2: "menu",
  PageUp: "prevTab",
  PageDown: "nextTab",
};

// Bố cục tay cầm chuẩn: 0=A 1=B 2=X 3=Y 4=LB 5=RB 9=Start 12-15=D-pad
const BUTTON_ACTIONS: [number, NavAction][] = [
  [12, "up"], [13, "down"], [14, "left"], [15, "right"],
  [0, "confirm"], [1, "back"], [2, "quick"], [3, "search"],
  [4, "prevTab"], [5, "nextTab"], [9, "menu"],
];

const DIRECTIONS: NavAction[] = ["up", "down", "left", "right"];
const STICK_THRESHOLD = 0.6;
const REPEAT_DELAY_MS = 380;
const REPEAT_RATE_MS = 120;

function pressedActions(pad: Gamepad): Set<NavAction> {
  const pressed = new Set<NavAction>();

  for (const [index, action] of BUTTON_ACTIONS) {
    if (pad.buttons[index]?.pressed) pressed.add(action);
  }

  const x = pad.axes[0] ?? 0;
  const y = pad.axes[1] ?? 0;
  if (x < -STICK_THRESHOLD) pressed.add("left");
  if (x > STICK_THRESHOLD) pressed.add("right");
  if (y < -STICK_THRESHOLD) pressed.add("up");
  if (y > STICK_THRESHOLD) pressed.add("down");

  return pressed;
}

export function useGamingInput(onAction: (action: NavAction) => void) {
  const handler = useRef(onAction);
  useEffect(() => {
    handler.current = onAction;
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        handler.current("search");
        return;
      }

      const action = KEY_ACTIONS[e.key];
      if (!action) return;

      // Đang gõ trong ô tìm kiếm: chỉ Esc được xử lý, các phím khác để ô nhập dùng.
      const typing = e.target instanceof HTMLInputElement;
      if (typing && action !== "back") return;

      e.preventDefault();
      handler.current(action);
    };
    window.addEventListener("keydown", onKeyDown);

    const held = new Map<NavAction, { since: number; last: number }>();
    let frame = 0;

    const poll = (now: number) => {
      const pad = [...navigator.getGamepads()].find((p): p is Gamepad => p !== null);
      const pressed = pad ? pressedActions(pad) : new Set<NavAction>();

      for (const action of held.keys()) {
        if (!pressed.has(action)) held.delete(action);
      }

      for (const action of pressed) {
        const state = held.get(action);
        if (!state) {
          held.set(action, { since: now, last: now });
          handler.current(action);
        } else if (
          DIRECTIONS.includes(action) &&
          now - state.since > REPEAT_DELAY_MS &&
          now - state.last > REPEAT_RATE_MS
        ) {
          state.last = now;
          handler.current(action);
        }
      }

      frame = requestAnimationFrame(poll);
    };
    frame = requestAnimationFrame(poll);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(frame);
    };
  }, []);
}