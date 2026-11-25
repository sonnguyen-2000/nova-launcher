import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { windowApi } from "../../api/windowApi";
import { Toast } from "../../components/ui/Toast";
import { useGames } from "../../hooks/useGames";
import { useLibraryRescan } from "../../hooks/useLibraryRescan";
import { useRunningGames } from "../../hooks/useRunningGames";
import { useToast } from "../../hooks/useToast";
import type { Game } from "../../types/game";
import { ambientBackground, coverHue } from "../../utils/cover";
import { CollectionsTab } from "./components/CollectionsTab";
import { HintBar } from "./components/HintBar";
import { HomeTab } from "./components/HomeTab";
import { LibraryTab } from "./components/LibraryTab";
import { QuickMenu } from "./components/QuickMenu";
import { RunningScreen } from "./components/RunningScreen";
import { SettingsTab } from "./components/SettingsTab";
import { SystemMenu } from "./components/SystemMenu";
import { TabBar } from "./components/TabBar";
import { TopBar } from "./components/TopBar";
import { filterGames, recentGames } from "./gaming.logic";
import { GAMING_TABS, type GameFilterKey, type GamingTab, type NavAction, type Overlay } from "./gaming.types";
import { clickFocused, focusFirst, moveFocus } from "./spatialNav";
import { useGamingInput } from "./useGamingInput";

interface GamingPageProps {
  onExit: () => void;
}

export function GamingPage({ onExit }: GamingPageProps) {
  const library = useGames();
  const { reload } = library;
  const { message, show } = useToast();

  const [showRunning, setShowRunning] = useState(false);
  const [tab, setTab] = useState<GamingTab>("home");
  const [overlay, setOverlay] = useState<Overlay>("none");
  const [filter, setFilter] = useState<GameFilterKey>("all");
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [homeIndex, setHomeIndex] = useState(0);
  const [libSelId, setLibSelId] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Game đóng thì quay về Nova và cập nhật giờ chơi.
  const handleExited = useCallback(() => {
    void reload();
    setShowRunning(false);
    void windowApi.focus();
  }, [reload]);

  const running = useRunningGames(handleExited);
  const rescan = useLibraryRescan(reload, show);

  useEffect(() => {
    if (library.error) show(library.error);
  }, [library.error, show]);
  useEffect(() => {
    if (running.error) show(running.error);
  }, [running.error, show]);

  // Mỗi lần đổi tab, đưa focus vào nội dung tab.
  useEffect(() => {
    focusFirst(contentRef.current);
  }, [tab]);

  const recent = useMemo(() => recentGames(library.games), [library.games]);
  const libGames = useMemo(
    () => filterGames(library.games, filter, query),
    [library.games, filter, query],
  );

  const homeGame = recent[Math.min(homeIndex, recent.length - 1)] ?? null;
  const libGame = libGames.find((g) => g.id === libSelId) ?? libGames[0] ?? null;
  const contextGame = tab === "library" ? libGame : homeGame;
  const isRunning = (game: Game) => running.runningIds.includes(game.id);
  const runningGame = library.games.find(isRunning) ?? null;

  const play = async (game: Game) => {
    if (!isRunning(game)) await running.launch(game.id);
    setShowRunning(true);
    setOverlay("none");
  };

  const quitApp = () => void windowApi.exit();
  const changeTab = (next: GamingTab) => {
    setSearching(false);
    setTab(next);
  };
  const openCollection = (key: GameFilterKey) => {
    setFilter(key);
    setQuery("");
    setSearching(false);
    setTab("library");
  };
  const shiftTab = (delta: number) => {
    const order = GAMING_TABS.map((t) => t.value);
    changeTab(order[(order.indexOf(tab) + delta + order.length) % order.length]);
  };
  const toggleOverlay = (kind: Exclude<Overlay, "none">) =>
    setOverlay((current) => (current === kind ? "none" : kind));

  const goBack = () => {
    if (overlay !== "none") return setOverlay("none");
    if (showRunning && runningGame) return setShowRunning(false);
    if (searching) {
      setSearching(false);
      setQuery("");
      return;
    }
    if (tab !== "home") setTab("home");
  };

  const handleAction = (action: NavAction) => {
    switch (action) {
      case "up":
      case "down":
      case "left":
      case "right":
        return moveFocus(action);
      case "confirm":
        return clickFocused();
      case "back":
        return goBack();
      case "quick":
        return toggleOverlay("quick");
      case "menu":
        return toggleOverlay("system");
      case "search":
        setTab("library");
        return setSearching(true);
      case "prevTab":
        return shiftTab(-1);
      case "nextTab":
        return shiftTab(1);
    }
  };
  useGamingInput(handleAction);

  const hue = contextGame ? coverHue(contextGame.name) : 220;

  return (
    <div className="gaming" data-nav-scope style={{ background: ambientBackground(hue) }}>
      <TopBar onOpenMenu={() => setOverlay("system")} onExit={onExit} />
      <TabBar tab={tab} onChange={changeTab} />

      <div className="g-content" ref={contentRef}>
        {tab === "home" && (
          <HomeTab
            games={recent}
            focusIndex={homeIndex}
            runningIds={running.runningIds}
            onFocusIndex={setHomeIndex}
            onPlay={play}
            onToggleFavorite={library.toggleFavorite}
            onOpenQuick={() => setOverlay("quick")}
            onOpenDesktop={onExit}
          />
        )}
        {tab === "library" && (
          <LibraryTab
            games={libGames}
            filter={filter}
            onFilter={setFilter}
            query={query}
            onQuery={setQuery}
            searching={searching}
            selected={libGame}
            onSelect={setLibSelId}
            runningIds={running.runningIds}
            onPlay={play}
            onToggleFavorite={library.toggleFavorite}
          />
        )}
        {tab === "collections" && <CollectionsTab games={library.games} onOpen={openCollection} />}
        {tab === "settings" && (
          <SettingsTab
            scanning={rescan.scanning}
            onRescan={rescan.rescan}
            onDesktop={onExit}
            onQuit={quitApp}
          />
        )}
      </div>

      <HintBar runningName={runningGame?.name ?? null} />

      {showRunning && runningGame && (
        <RunningScreen
          game={runningGame}
          onQuick={() => setOverlay("quick")}
          onHide={() => setShowRunning(false)}
          onStop={() => running.stop(runningGame.id)}
        />
      )}

      {overlay === "system" && (
        <SystemMenu
          onSettings={() => {
            setOverlay("none");
            changeTab("settings");
          }}
          onDesktop={onExit}
          onQuit={quitApp}
          onClose={() => setOverlay("none")}
        />
      )}
      {overlay === "quick" && (
        <QuickMenu
          game={runningGame ?? contextGame}
          running={(runningGame ?? contextGame) ? isRunning((runningGame ?? contextGame) as Game) : false}
          onPlay={() => {
            const target = runningGame ?? contextGame;
            if (target) void play(target);
          }}
          onStop={() => {
            if (runningGame) void running.stop(runningGame.id);
            setOverlay("none");
          }}
          onToggleFavorite={() => {
            const target = runningGame ?? contextGame;
            if (target) void library.toggleFavorite(target);
          }}
          onClose={() => setOverlay("none")}
        />
      )}

      <Toast message={message} />
    </div>
  );
}