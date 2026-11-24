import { useScanFolders } from "../hooks/useScanFolders";
import { useScanner } from "../hooks/useScanner";

interface ScannerPanelProps {
  onImported: () => void;
}

export function ScannerPanel({ onImported }: ScannerPanelProps) {
  const { folders, error, addFromPicker, remove } = useScanFolders();
  const { candidates, selected, scanning, message, scan, toggle, importSelected } =
    useScanner(onImported);

  return (
    <section style={{ marginTop: 32 }}>
      <h2>Quét thư mục</h2>

      <button onClick={addFromPicker}>+ Thêm thư mục</button>{" "}
      <button onClick={scan} disabled={scanning || folders.length === 0}>
        {scanning ? "Đang quét…" : "Quét ngay"}
      </button>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <ul>
        {folders.map((folder) => (
          <li key={folder.id}>
            {folder.path} <button onClick={() => remove(folder.id)}>Xoá</button>
          </li>
        ))}
      </ul>

      {message && <p>{message}</p>}

      {candidates.length > 0 && (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {candidates.map((c) => (
              <li key={c.exePath}>
                <label>
                  <input
                    type="checkbox"
                    checked={selected.has(c.exePath)}
                    disabled={c.alreadyAdded}
                    onChange={() => toggle(c.exePath)}
                  />{" "}
                  <strong>{c.name}</strong> <small>{c.exePath}</small>
                  {c.alreadyAdded && <em> (đã có trong thư viện)</em>}
                </label>
              </li>
            ))}
          </ul>
          <button onClick={importSelected} disabled={selected.size === 0}>
            Thêm {selected.size} game đã chọn
          </button>
        </>
      )}
    </section>
  );
}