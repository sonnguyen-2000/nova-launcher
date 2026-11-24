import { useState, type FormEvent } from "react";
import { ScannerPanel } from "./components/ScannerPanel";
import { useGames } from "./hooks/useGames";
import { useRunningGames } from "./hooks/useRunningGames";
import { createGameInput } from "./utils/gameInput";
import { formatPlaytime } from "./utils/format";

export default function App() {
  const { games, error, reload, add, remove, toggleFavorite } = useGames();
  const { runningIds, error: runError, launch, stop } = useRunningGames(reload);
  const [name, setName] = useState("");
  const [exePath, setExePath] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await add(createGameInput({ name, exePath }));
    setName("");
    setExePath("");
  };

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Nova – kiểm tra dữ liệu</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input placeholder="Tên game" value={name} onChange={(e) => setName(e.target.value)} />
        <input
          placeholder="C:\Windows\System32\notepad.exe"
          value={exePath}
          onChange={(e) => setExePath(e.target.value)}
          style={{ width: 320 }}
        />
        <button type="submit">Thêm</button>
      </form>

      {(error || runError) && <p style={{ color: "crimson" }}>{error ?? runError}</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {games.map((game) => {
          const isRunning = runningIds.includes(game.id);
          return (
            <li key={game.id} style={{ marginBottom: 8 }}>
              <button onClick={() => toggleFavorite(game)}>{game.isFavorite ? "★" : "☆"}</button>{" "}
              <strong>{game.name}</strong> · {formatPlaytime(game.playtimeSeconds)}{" "}
              {isRunning && <span style={{ color: "green" }}>● Đang chạy</span>}{" "}
              {isRunning ? (
                <button onClick={() => stop(game.id)}>Dừng</button>
              ) : (
                <button onClick={() => launch(game.id)}>Chơi</button>
              )}{" "}
              <button onClick={() => remove(game.id)} disabled={isRunning}>Xoá</button>
            </li>
          );
        })}
      </ul>

      <ScannerPanel onImported={reload} />
    </main>
  );
}