import type { ReactNode } from "react";
import type { Game } from "../../../types/game";
import { coverBackground, initials } from "../../../utils/cover";
import { getSource } from "../../../utils/sources";

interface GameCoverProps {
  game: Game;
  children?: ReactNode;
}

export function GameCover({ game, children }: GameCoverProps) {
  return (
    <div className="cover" style={{ background: coverBackground(game.name) }}>
      <span className="cover__initials">{initials(game.name)}</span>
      <span className="cover__bar" style={{ background: getSource(game.source).color }} />
      {children}
    </div>
  );
}