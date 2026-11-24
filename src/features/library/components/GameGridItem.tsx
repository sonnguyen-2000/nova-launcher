import type { GameItemProps } from "../../../types/library";
import { formatPlaytime } from "../../../utils/format";
import { GameCover } from "./GameCover";

export function GameGridItem({ game, selected, running, onSelect, onToggleRun }: GameItemProps) {
  return (
    <div className={`grid-item${selected ? " is-selected" : ""}`}>
      <button className="grid-item__btn" onClick={onSelect}>
        <GameCover game={game}>
          {running && <span className="badge badge--running">Đang chạy</span>}
          {!running && game.isHidden && <span className="badge">Đã ẩn</span>}
        </GameCover>
        <div className="grid-item__name">{game.name}</div>
        <div className="grid-item__meta">{formatPlaytime(game.playtimeSeconds)}</div>
      </button>
      {selected && (
        <button className="play-fab" onClick={onToggleRun} aria-label={running ? "Dừng" : "Chơi"}>
          {running ? "■" : "▶"}
        </button>
      )}
    </div>
  );
}