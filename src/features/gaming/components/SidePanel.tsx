import type { ReactNode } from "react";
import { useFocusScope } from "../useFocusScope";

interface SidePanelProps {
  side: "left" | "right";
  title?: string;
  onClose: () => void;
  children: ReactNode;
}

export function SidePanel({ side, title, onClose, children }: SidePanelProps) {
  const ref = useFocusScope<HTMLDivElement>();

  return (
    <>
      <div className="g-backdrop" onClick={onClose} />
      <div ref={ref} className={`g-panel g-panel--${side}`} data-nav-scope>
        {title && <div className="g-panel__title">{title}</div>}
        {children}
      </div>
    </>
  );
}