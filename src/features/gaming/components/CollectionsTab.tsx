import type { Game } from "../../../types/game";
import { COLLECTIONS, countByFilter } from "../gaming.logic";
import type { GameFilterKey } from "../gaming.types";

interface CollectionsTabProps {
  games: Game[];
  onOpen: (key: GameFilterKey) => void;
}

export function CollectionsTab({ games, onOpen }: CollectionsTabProps) {
  return (
    <div className="g-collections">
      {COLLECTIONS.map((collection) => (
        <button
          key={collection.key}
          className="g-collection"
          style={{ background: collection.background }}
          onClick={() => onOpen(collection.key)}
        >
          <div className="g-collection__count">{countByFilter(games, collection.key)}</div>
          <div>
            <div className="g-collection__label">{collection.label}</div>
            <div className="g-collection__sub">{collection.sub}</div>
          </div>
        </button>
      ))}
    </div>
  );
}