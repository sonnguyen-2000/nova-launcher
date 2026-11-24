import { formatPlaytime } from "../../../utils/format";

interface StatusBarProps {
  shown: number;
  total: number;
  totalPlaytimeSeconds: number;
  runningName: string | null;
}

export function StatusBar({ shown, total, totalPlaytimeSeconds, runningName }: StatusBarProps) {
  return (
    <footer className="statusbar">
      <span>
        Hiển thị {shown} / {total} game
      </span>
      <span>Tổng thời gian chơi: {formatPlaytime(totalPlaytimeSeconds)}</span>
      <span className="statusbar__spacer" />
      {runningName && <span className="statusbar__running">Đang chạy: {runningName}</span>}
    </footer>
  );
}