export type Direction = "up" | "down" | "left" | "right";

export const FOCUSABLE = "button:not([disabled]), input:not([disabled])";

/** Vùng điều hướng trên cùng (menu/overlay mở sau thì nằm sau trong DOM). */
function activeScope(): HTMLElement | null {
  const scopes = document.querySelectorAll<HTMLElement>("[data-nav-scope]");
  return scopes.length > 0 ? scopes[scopes.length - 1] : null;
}

function isVisible(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function center(rect: DOMRect) {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function focusElement(el: HTMLElement): void {
  el.focus({ preventScroll: true });
  el.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
}

export function moveFocus(direction: Direction): void {
  const scope = activeScope();
  if (!scope) return;

  const items = [...scope.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(isVisible);
  if (items.length === 0) return;

  const active = document.activeElement;
  const current = active instanceof HTMLElement && scope.contains(active) ? active : null;
  if (!current) {
    focusElement(items[0]);
    return;
  }

  const from = center(current.getBoundingClientRect());
  let best: HTMLElement | null = null;
  let bestScore = Infinity;

  for (const item of items) {
    if (item === current) continue;

    const to = center(item.getBoundingClientRect());
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const horizontal = direction === "left" || direction === "right";
    const main = horizontal ? dx : dy;
    const cross = horizontal ? dy : dx;
    const forward = direction === "right" || direction === "down" ? main : -main;

    if (forward <= 4) continue;

    const score = forward + Math.abs(cross) * 2.5;
    if (score < bestScore) {
      best = item;
      bestScore = score;
    }
  }

  if (best) focusElement(best);
}

/** Bấm vào phần tử đang được focus (nút A trên tay cầm). */
export function clickFocused(): void {
  const active = document.activeElement;
  if (active instanceof HTMLElement && active !== document.body) active.click();
}

/** Focus phần tử đầu tiên trong vùng, trừ khi focus đã nằm sẵn trong đó. */
export function focusFirst(container: HTMLElement | null): void {
  if (!container || container.contains(document.activeElement)) return;
  const first = [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].find(isVisible);
  first?.focus({ preventScroll: true });
}