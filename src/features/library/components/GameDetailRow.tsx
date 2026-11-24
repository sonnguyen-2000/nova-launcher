import type { GameItemProps } from "../../../types/library";
import { formatLastPlayed, formatPlaytime } from "../../../utils/format";
import { getSource } from "../../../utils/sources";
import { GameCover } from "./GameCover";

export function GameDetailRow({ game, selected, running, onSelect, onToggleRun }: GameItemProps) {
  const year = game.releaseYear ?? "—";

  return (
    <div className={`detail-row${selected ? " is-selected" : ""}`}>
      <button className="detail-row__main" onClick={onSelect}>
        <GameCover game={game} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="detail-row__title">{game.name}</div>
          <div className="detail-row__sub">
            {getSource(game.source).label} · {game.genre || "Chưa phân loại"} · {year}
          </div>
          <div className="detail-row__desc">{game.description || "Chưa có mô tả."}</div>
          <div className="detail-row__foot">
            {formatPlaytime(game.playtimeSeconds)} · Lần cuối: {formatLastPlayed(game.lastPlayedAt)}
          </div>
        </div>
      </button>
      <div className="detail-row__act">
        <button className="btn btn--primary" onClick={onToggleRun}>
          {running ? "Dừng" : "Chơi"}
        </button>
      </div>
    </div>
  );
}