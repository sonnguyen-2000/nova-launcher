interface SourceInfo {
  label: string;
  color: string;
}

const SOURCES: Record<string, SourceInfo> = {
  manual: { label: "Tự thêm", color: "#5fd068" },
  scan: { label: "Quét tự động", color: "#4c9df0" },
  emulator: { label: "Giả lập", color: "#f0a43a" },
};

const FALLBACK: SourceInfo = { label: "Khác", color: "#9a9ca6" };

export function getSource(key: string): SourceInfo {
  return SOURCES[key] ?? FALLBACK;
}