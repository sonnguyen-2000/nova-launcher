import type { Game } from "../../../types/game";
import { formatPlaytime } from "../../../utils/format";
import { GameCover } from "../../library/components/GameCover";
import { FILTERS } from "../gaming.logic";
import type { GameFilterKey } from "../gaming.types";

interface LibraryTabProps {
  games: Game[];
  filter: GameFilterKey;
  onFilter: (key: GameFilterKey) => void;
  query: string;
  onQuery: (query: string) => void;
  searching: boolean;
  selected: Game | null;
  onSelect: (id: number) => void;
  runningIds: number[];
  onPlay: (game: Game) => void;
  onToggleFavorite: (game: Game) => void;
}

export function LibraryTab({
  games,
  filter,
  onFilter,
  query,
  onQuery,
  searching,
  selected,
  onSelect,
  runningIds,
  onPlay,
  onToggleFavorite,
}: LibraryTabProps) {
  const selectedRunning = selected ? runningIds.includes(selected.id) : false;

  return (
    <div className="g-lib">
      <div className="g-chips">
        {FILTERS.map((item) => (
          <button
            key={item.key}
            className={`g-chip${filter === item.key ? " is-active" : ""}`}
            onClick={() => onFilter(item.key)}
          >
            {item.label}
          </button>
        ))}
        {searching && (
          <input
            className="g-search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Nhập tên game"
            aria-label="Tìm game"
            autoFocus
          />
        )}
      </div>

      {games.length === 0 ? (
        <div className="g-empty">Không có game nào trong mục này.</div>
      ) : (
        <div className="g-grid">
          {games.map((game) => (
            <button
              key={game.id}
              className={`g-tile g-tile--lib${game.id === selected?.id ? " is-selected" : ""}`}
              aria-label={game.name}
              onFocus={() => onSelect(game.id)}
              onMouseEnter={(e) => e.currentTarget.focus({ preventScroll: true })}
              onClick={() => onPlay(game)}
            >
              <GameCover game={game}>
                {runningIds.includes(game.id) && <span className="g-badge">Đang chạy</span>}
              </GameCover>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="g-lib__bar">
          <div className="g-lib__bar-info">
            <div className="g-lib__bar-name">{selected.name}</div>
            <div className="g-muted" style={{ fontSize: 13 }}>
              {selected.genre || "Chưa phân loại"} · {formatPlaytime(selected.playtimeSeconds)}
            </div>
          </div>
          <button className="g-btn" onClick={() => onToggleFavorite(selected)}>
            {selected.isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
          </button>
          <button
            className={`g-btn ${selectedRunning ? "g-btn--white" : "g-btn--primary"}`}
            onClick={() => onPlay(selected)}
          >
            {selectedRunning ? "TRỞ LẠI GAME" : "CHƠI"}
          </button>
        </div>
      )}
    </div>
  );
}