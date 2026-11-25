import type { Game } from "../../../types/game";
import { GameCover } from "../../library/components/GameCover";
import { useFocusScope } from "../useFocusScope";

interface RunningScreenProps {
  game: Game;
  onQuick: () => void;
  onHide: () => void;
  onStop: () => void;
}

export function RunningScreen({ game, onQuick, onHide, onStop }: RunningScreenProps) {
  const ref = useFocusScope<HTMLDivElement>();

  return (
    <div ref={ref} className="g-running" data-nav-scope>
      <div className="g-running__inner">
        <div className="g-running__cover">
          <GameCover game={game} />
        </div>
        <div>
          <span className="g-running__tag">ĐANG CHẠY</span>
          <div className="g-running__name">{game.name}</div>
          <p className="g-running__text">
            Game đang chạy ở cửa sổ riêng. Bạn có thể quay về màn hình chính để chọn game khác
            hoặc dừng game này.
          </p>
          <div className="g-actions">
            <button className="g-btn" onClick={onQuick}>
              Menu nhanh
            </button>
            <button className="g-btn" onClick={onHide}>
              Về màn hình chính
            </button>
            <button className="g-btn g-btn--danger" onClick={onStop}>
              Dừng game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}