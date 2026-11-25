import { GamingPage } from "./features/gaming/GamingPage";
import { LibraryPage } from "./features/library/LibraryPage";
import { useUiMode } from "./hooks/useUiMode";

export default function App() {
  const { mode, enterGaming, exitGaming } = useUiMode();

  return mode === "gaming" ? (
    <GamingPage onExit={exitGaming} />
  ) : (
    <LibraryPage onEnterGaming={enterGaming} />
  );
}