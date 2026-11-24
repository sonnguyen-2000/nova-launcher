import type { Game } from "../../../types/game";
import { formatDate, formatLastPlayed, formatPlaytime } from "../../../utils/format";
import { genreTags } from "../../../utils/genre";
import { getSource } from "../../../utils/sources";
import { GameCover } from "./GameCover";

interface DetailPanelProps {
  game: Game | null;
  running: boolean;
  onToggleRun: () => void;
  onToggleFavorite: () => void;
  onEdit: () => void;
  onToggleHidden: () => void;
  onDelete: () => void;
}

export function DetailPanel({
  game,
  running,
  onToggleRun,
  onToggleFavorite,
  onEdit,
  onToggleHidden,
  onDelete,
}: DetailPanelProps) {
  if (!game) {
    return <aside className="panel panel--empty">Chọn một game để xem chi tiết</aside>;
  }

  const source = getSource(game.source);
  const meta: [string, string][] = [
    ["Thể loại", game.genre || "—"],
    ["Thời gian chơi", formatPlaytime(game.playtimeSeconds)],
    ["Lần cuối", formatLastPlayed(game.lastPlayedAt)],
    ["Thêm vào", formatDate(game.createdAt)],
    ["Đường dẫn", game.exePath],
  ];

  return (
    <aside className="panel">
      <div className="panel__top">
        <GameCover game={game} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="panel__name">{game.name}</div>
          <div className="panel__sub">
            {game.developer || "Chưa rõ nhà phát triển"} · {game.releaseYear ?? "—"}
          </div>
          <div className="panel__src">
            <i className="dot" style={{ background: source.color }} />
            {source.label}
          </div>
        </div>
      </div>

      <div className="panel__row">
        <button className={`panel__play${running ? " is-running" : ""}`} onClick={onToggleRun}>
          {running ? "■ Dừng" : "▶ Chơi"}
        </button>
        <button
          className={`panel__fav${game.isFavorite ? " is-on" : ""}`}
          onClick={onToggleFavorite}
          aria-label={game.isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
        >
          {game.isFavorite ? "★" : "☆"}
        </button>
      </div>

      <div className="panel__row">
        <button className="btn" onClick={onEdit}>
          Sửa thông tin
        </button>
        <button className="btn" onClick={onToggleHidden}>
          {game.isHidden ? "Bỏ ẩn" : "Ẩn game"}
        </button>
        <button className="btn btn--danger" onClick={onDelete}>
          Xoá
        </button>
      </div>

      <div className="meta">
        {meta.map(([label, value]) => (
          <div className="meta__row" key={label}>
            <span className="meta__label">{label}</span>
            <span className="meta__value">{value}</span>
          </div>
        ))}
      </div>

      <div className="tags">
        {genreTags(game.genre).map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>

      <p className="panel__desc" style={{ margin: 0 }}>
        {game.description || "Chưa có mô tả."}
      </p>
    </aside>
  );
}