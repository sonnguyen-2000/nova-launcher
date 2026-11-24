import type { GameItemProps } from "../../../types/library";
import { formatLastPlayed, formatPlaytimeShort } from "../../../utils/format";
import { genreMain } from "../../../utils/genre";
import { getSource } from "../../../utils/sources";
import { GameCover } from "./GameCover";

export function GameListRow({ game, selected, running, onSelect, onToggleRun }: GameItemProps) {
  const source = getSource(game.source);

  return (
    <div className={`list-row${selected ? " is-selected" : ""}`}>
      <button className="list-row__main" onClick={onSelect}>
        <GameCover game={game} />
        <span className="col-name">{game.name}</span>
        <span className="col-source">
          <i className="dot" style={{ background: source.color }} />
          {source.label}
        </span>
        <span className="col-genre">{genreMain(game.genre)}</span>
        <span className="col-time">{formatPlaytimeShort(game.playtimeSeconds)}</span>
        <span className="col-last">{formatLastPlayed(game.lastPlayedAt)}</span>
      </button>
      <button className="list-row__act" onClick={onToggleRun}>
        {running ? "Dừng" : "Chơi"}
      </button>
    </div>
  );
}