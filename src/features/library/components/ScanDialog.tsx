import { Dialog } from "../../../components/ui/Dialog";
import { useScanFolders } from "../../../hooks/useScanFolders";
import { useScanner } from "../../../hooks/useScanner";

interface ScanDialogProps {
  onImported: () => void;
  onClose: () => void;
}

export function ScanDialog({ onImported, onClose }: ScanDialogProps) {
  const { folders, error, addFromPicker, remove } = useScanFolders();
  const scanner = useScanner(onImported);

  return (
    <Dialog title="Quét thư mục tìm game" onClose={onClose} wide>
      <div className="dialog__body">
        <div className="field-row">
          <button className="btn" onClick={addFromPicker}>
            + Thêm thư mục
          </button>
          <button
            className="btn btn--primary"
            onClick={scanner.scan}
            disabled={scanner.scanning || folders.length === 0}
          >
            {scanner.scanning ? "Đang quét…" : "Quét ngay"}
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        <ul className="plain-list">
          {folders.map((folder) => (
            <li key={folder.id}>
              <span className="plain-list__grow">{folder.path}</span>
              <button className="icon-btn" onClick={() => remove(folder.id)} aria-label="Xoá thư mục">
                ✕
              </button>
            </li>
          ))}
        </ul>

        {scanner.message && <p className="muted" style={{ margin: 0 }}>{scanner.message}</p>}

        {scanner.candidates.length > 0 && (
          <ul className="plain-list">
            {scanner.candidates.map((candidate) => (
              <li key={candidate.exePath}>
                <input
                  type="checkbox"
                  checked={scanner.selected.has(candidate.exePath)}
                  disabled={candidate.alreadyAdded}
                  onChange={() => scanner.toggle(candidate.exePath)}
                />
                <div className="plain-list__grow">
                  <strong>{candidate.name}</strong>
                  {candidate.alreadyAdded && <em className="muted"> (đã có trong thư viện)</em>}
                  <small>{candidate.exePath}</small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="dialog__foot">
        <button className="btn" onClick={onClose}>
          Đóng
        </button>
        {scanner.candidates.length > 0 && (
          <button
            className="btn btn--primary"
            onClick={scanner.importSelected}
            disabled={scanner.selected.size === 0}
          >
            Thêm {scanner.selected.size} game
          </button>
        )}
      </div>
    </Dialog>
  );
}