const HINTS = [
  { keys: "A / Enter", label: "Chọn / Chơi" },
  { keys: "B / Esc", label: "Quay lại" },
  { keys: "X / F1", label: "Menu nhanh" },
  { keys: "Y / Ctrl+F", label: "Tìm kiếm" },
  { keys: "LB RB / PgUp PgDn", label: "Đổi tab" },
];

interface HintBarProps {
  runningName: string | null;
}

export function HintBar({ runningName }: HintBarProps) {
  return (
    <footer className="g-hints">
      {HINTS.map((hint) => (
        <div className="g-hint" key={hint.keys}>
          <span className="g-key">{hint.keys}</span>
          {hint.label}
        </div>
      ))}
      {runningName && <div className="g-hints__running">Đang chạy: {runningName}</div>}
    </footer>
  );
}