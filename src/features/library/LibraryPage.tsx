import { useEffect, useState } from "react";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { Toast } from "../../components/ui/Toast";
import { useGames } from "../../hooks/useGames";
import { useRunningGames } from "../../hooks/useRunningGames";
import { useToast } from "../../hooks/useToast";
import type { Game } from "../../types/game";
import { DetailPanel } from "./components/DetailPanel";
import { FilterSidebar } from "./components/FilterSidebar";
import { GameFormDialog } from "./components/GameFormDialog";
import { GameGroups } from "./components/GameGroups";
import { ScanDialog } from "./components/ScanDialog";
import { StatusBar } from "./components/StatusBar";
import { Toolbar } from "./components/Toolbar";
import { useLibraryView } from "./useLibraryView";

type DialogState =
  | { kind: "none" }
  | { kind: "add" }
  | { kind: "edit"; game: Game }
  | { kind: "delete"; game: Game }
  | { kind: "scan" };

export function LibraryPage({ onEnterGaming }: { onEnterGaming: () => void }) {
  const library = useGames();
  const running = useRunningGames(library.reload);
  const view = useLibraryView(library.games);
  const { message, show } = useToast();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [dialog, setDialog] = useState<DialogState>({ kind: "none" });

  useEffect(() => {
    if (library.error) show(library.error);
  }, [library.error, show]);

  useEffect(() => {
    if (running.error) show(running.error);
  }, [running.error, show]);

  const selected = view.visible.find((game) => game.id === selectedId) ?? view.visible[0] ?? null;
  const isRunning = (game: Game) => running.runningIds.includes(game.id);
  const toggleRun = (game: Game) =>
    isRunning(game) ? running.stop(game.id) : running.launch(game.id);
  const closeDialog = () => setDialog({ kind: "none" });

  const addGame = async (input: Parameters<typeof library.add>[0]) => {
    const ok = await library.add(input);
    if (ok) show("Đã thêm game");
    return ok;
  };

  const editGame = async (game: Game, input: Parameters<typeof library.update>[1]) => {
    const ok = await library.update(game.id, input);
    if (ok) show("Đã lưu thay đổi");
    return ok;
  };

  const deleteGame = async (game: Game) => {
    closeDialog();
    if (await library.remove(game.id)) show(`Đã xoá “${game.name}”`);
  };

  const runningGame = library.games.find(isRunning);

  return (
    <div className="library">
      <Toolbar
        view={view.view}
        onView={view.setView}
        group={view.group}
        onCycleGroup={view.cycleGroup}
        sort={view.sort}
        onCycleSort={view.cycleSort}
        coverSize={view.coverSize}
        onCoverSize={view.setCoverSize}
        query={view.query}
        onQuery={view.setQuery}
        onAdd={() => setDialog({ kind: "add" })}
        onScan={() => setDialog({ kind: "scan" })}
        onGamingMode={onEnterGaming}
      />

      <div className="library__body">
        <FilterSidebar
          sources={view.sources}
          genres={view.genres}
          filters={view.filters}
          hasFilters={view.hasFilters}
          onToggleSource={view.toggleSource}
          onToggleGenre={view.toggleGenre}
          onToggleFavorites={view.toggleOnlyFavorites}
          onToggleHidden={view.toggleShowHidden}
          onClear={view.clearFilters}
        />

        <GameGroups
          groups={view.groups}
          view={view.view}
          coverSize={view.coverSize}
          selectedId={selected?.id ?? null}
          runningIds={running.runningIds}
          libraryEmpty={library.games.length === 0}
          onSelect={setSelectedId}
          onToggleRun={toggleRun}
        />

        <DetailPanel
          game={selected}
          running={selected ? isRunning(selected) : false}
          onToggleRun={() => selected && toggleRun(selected)}
          onToggleFavorite={() => selected && library.toggleFavorite(selected)}
          onEdit={() => selected && setDialog({ kind: "edit", game: selected })}
          onToggleHidden={() => selected && library.toggleHidden(selected)}
          onDelete={() => selected && setDialog({ kind: "delete", game: selected })}
        />
      </div>

      <StatusBar
        shown={view.visible.length}
        total={library.games.length}
        totalPlaytimeSeconds={library.games.reduce((sum, game) => sum + game.playtimeSeconds, 0)}
        runningName={runningGame?.name ?? null}
      />

      {dialog.kind === "add" && <GameFormDialog onSubmit={addGame} onClose={closeDialog} />}
      {dialog.kind === "edit" && (
        <GameFormDialog
          game={dialog.game}
          onSubmit={(input) => editGame(dialog.game, input)}
          onClose={closeDialog}
        />
      )}
      {dialog.kind === "delete" && (
        <ConfirmDialog
          title="Xoá game khỏi thư viện?"
          message={`“${dialog.game.name}” sẽ bị xoá khỏi thư viện. File cài đặt trên ổ đĩa không bị xoá.`}
          confirmLabel="Xoá khỏi thư viện"
          onConfirm={() => deleteGame(dialog.game)}
          onCancel={closeDialog}
        />
      )}
      {dialog.kind === "scan" && <ScanDialog onImported={library.reload} onClose={closeDialog} />}

      <Toast message={message} />
    </div>
  );
}