import type { Game } from "../../../types/game";
import type { GameGroup, ViewMode } from "../../../types/library";
import { GameDetailRow } from "./GameDetailRow";
import { GameGridItem } from "./GameGridItem";
import { GameListRow } from "./GameListRow";

interface GameGroupsProps {
  groups: GameGroup[];
  view: ViewMode;
  coverSize: number;
  selectedId: number | null;
  runningIds: number[];
  libraryEmpty: boolean;
  onSelect: (id: number) => void;
  onToggleRun: (game: Game) => void;
}

const ITEM_COMPONENTS = {
  grid: GameGridItem,
  list: GameListRow,
  details: GameDetailRow,
};

function ListHeader() {
  return (
    <div className="list-head">
      <div style={{ flex: 1 }}>Tên</div>
      <div style={{ width: 110 }}>Nguồn</div>
      <div style={{ width: 100 }}>Thể loại</div>
      <div style={{ width: 84 }}>Thời gian</div>
      <div style={{ width: 100 }}>Lần cuối</div>
    </div>
  );
}

export function GameGroups({
  groups,
  view,
  coverSize,
  selectedId,
  runningIds,
  libraryEmpty,
  onSelect,
  onToggleRun,
}: GameGroupsProps) {
  if (libraryEmpty) {
    return (
      <main className="games">
        <div className="empty">Thư viện đang trống. Bấm “Thêm game” hoặc “Quét thư mục” để bắt đầu.</div>
      </main>
    );
  }
  if (groups.length === 0) {
    return (
      <main className="games">
        <div className="empty">Không có game nào khớp bộ lọc hiện tại.</div>
      </main>
    );
  }

  const Item = ITEM_COMPONENTS[view];
  const gridStyle =
    view === "grid"
      ? { gridTemplateColumns: `repeat(auto-fill, minmax(${coverSize}px, 1fr))` }
      : undefined;

  return (
    <main className="games">
      {groups.map((group) => (
        <section className="group" key={group.key}>
          {group.label && (
            <header className="group__head">
              <span className="group__title">{group.label}</span>
              <span className="group__count">{group.games.length} game</span>
            </header>
          )}
          {view === "list" && <ListHeader />}
          <div className={`items items--${view}`} style={gridStyle}>
            {group.games.map((game) => (
              <Item
                key={game.id}
                game={game}
                selected={game.id === selectedId}
                running={runningIds.includes(game.id)}
                onSelect={() => onSelect(game.id)}
                onToggleRun={() => onToggleRun(game)}
              />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}