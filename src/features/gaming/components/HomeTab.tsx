import type { Game } from "../../../types/game";
import { formatLastPlayed, formatPlaytime } from "../../../utils/format";
import { getSource } from "../../../utils/sources";
import { GameCover } from "../../library/components/GameCover";

interface HomeTabProps {
  games: Game[];
  focusIndex: number;
  runningIds: number[];
  onFocusIndex: (index: number) => void;
  onPlay: (game: Game) => void;
  onToggleFavorite: (game: Game) => void;
  onOpenQuick: () => void;
  onOpenDesktop: () => void;
}

export function HomeTab({
  games,
  focusIndex,
  runningIds,
  onFocusIndex,
  onPlay,
  onToggleFavorite,
  onOpenQuick,
  onOpenDesktop,
}: HomeTabProps) {
  if (games.length === 0) {
    return (
      <div className="g-empty">
        <p>Thư viện đang trống.</p>
        <button className="g-btn g-btn--primary g-btn--lg" onClick={onOpenDesktop}>
          Mở giao diện máy tính để thêm game
        </button>
      </div>
    );
  }

  const index = Math.min(focusIndex, games.length - 1);
  const game = games[index];
  const running = runningIds.includes(game.id);
  const stats = [
    { label: "Đã chơi", value: formatPlaytime(game.playtimeSeconds) },
    { label: "Lần cuối", value: formatLastPlayed(game.lastPlayedAt) },
    { label: "Nguồn", value: getSource(game.source).label },
  ];

  return (
    <div className="g-home">
      <div className="g-carousel">
        <div className="g-carousel__label">Tiếp tục chơi</div>
        <div className="g-carousel__track">
          {games.map((item, i) => (
            <button
              key={item.id}
              className={`g-tile g-tile--home${i === index ? " is-selected" : ""}`}
              aria-label={item.name}
              onFocus={() => onFocusIndex(i)}
              onMouseEnter={(e) => e.currentTarget.focus({ preventScroll: true })}
              onClick={() => onPlay(item)}
            >
              <GameCover game={item}>
                {runningIds.includes(item.id) && <span className="g-badge">Đang chạy</span>}
              </GameCover>
            </button>
          ))}
        </div>
      </div>

      <div className="g-detail">
        <div className="g-detail__main">
          <div className="g-detail__name">{game.name}</div>
          <div className="g-detail__genre">{game.genre || "Chưa phân loại"}</div>

          <div className="g-stats">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="g-stat__label">{stat.label}</div>
                <div className="g-stat__value">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="g-actions">
            <button
              className={`g-btn g-btn--lg ${running ? "g-btn--white" : "g-btn--primary"}`}
              onClick={() => onPlay(game)}
            >
              {running ? "TRỞ LẠI GAME" : "CHƠI"}
            </button>
            <button className="g-btn g-btn--lg" onClick={() => onToggleFavorite(game)}>
              {game.isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
            </button>
            <button className="g-btn g-btn--lg" onClick={onOpenQuick}>
              Tùy chọn nhanh
            </button>
          </div>
        </div>

        <aside className="g-card">
          <div className="g-stat__label">Giới thiệu</div>
          <p className="g-card__text">{game.description || "Chưa có mô tả."}</p>
        </aside>
      </div>
    </div>
  );
}