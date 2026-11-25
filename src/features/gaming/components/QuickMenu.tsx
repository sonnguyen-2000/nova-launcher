import type { Game } from "../../../types/game";
import { SidePanel } from "./SidePanel";

interface QuickMenuProps {
  game: Game | null;
  running: boolean;
  onPlay: () => void;
  onStop: () => void;
  onToggleFavorite: () => void;
  onClose: () => void;
}

export function QuickMenu({ game, running, onPlay, onStop, onToggleFavorite, onClose }: QuickMenuProps) {
  return (
    <SidePanel side="right" title="Menu nhanh" onClose={onClose}>
      {game && (
        <>
          <button className="g-panel__item" onClick={onPlay}>
            {running ? "Trở lại game" : `Chơi ${game.name}`}
          </button>
          {running && (
            <button className="g-panel__item" onClick={onStop}>
              Dừng game
            </button>
          )}
          <button className="g-panel__item" onClick={onToggleFavorite}>
            {game.isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
          </button>
        </>
      )}
      <button className="g-panel__item" onClick={onClose}>
        Đóng
      </button>
    </SidePanel>
  );
}