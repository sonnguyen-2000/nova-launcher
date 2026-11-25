import { useClock } from "../../../hooks/useClock";

interface TopBarProps {
  onOpenMenu: () => void;
  onExit: () => void;
}

export function TopBar({ onOpenMenu, onExit }: TopBarProps) {
  const time = useClock();

  return (
    <header className="g-top">
      <button className="g-iconbtn" onClick={onOpenMenu} aria-label="Menu hệ thống">
        ☰
      </button>
      <div className="g-top__title">CHẾ ĐỘ GAMING</div>
      <div className="g-top__spacer" />
      <div className="g-top__clock">{time}</div>
      <button className="g-btn g-btn--ghost" onClick={onExit}>
        Giao diện máy tính
      </button>
    </header>
  );
}