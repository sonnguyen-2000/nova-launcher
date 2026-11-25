interface SettingsTabProps {
  scanning: boolean;
  onRescan: () => void;
  onDesktop: () => void;
  onQuit: () => void;
}

export function SettingsTab({ scanning, onRescan, onDesktop, onQuit }: SettingsTabProps) {
  const rows = [
    {
      label: "Giao diện máy tính",
      desc: "Quay về giao diện đầy đủ để thêm, sửa, xoá game",
      action: "Chuyển",
      onClick: onDesktop,
      disabled: false,
    },
    {
      label: "Quét lại thư viện",
      desc: "Tìm game mới trong các thư mục quét đã thêm và tự thêm vào",
      action: scanning ? "Đang quét…" : "Quét ngay",
      onClick: onRescan,
      disabled: scanning,
    },
    {
      label: "Thoát ứng dụng",
      desc: "Đóng Nova hoàn toàn",
      action: "Thoát",
      onClick: onQuit,
      disabled: false,
    },
  ];

  return (
    <div className="g-settings">
      {rows.map((row) => (
        <div className="g-row" key={row.label}>
          <div className="g-row__text">
            <div className="g-row__label">{row.label}</div>
            <div className="g-row__desc">{row.desc}</div>
          </div>
          <button className="g-btn g-btn--white" onClick={row.onClick} disabled={row.disabled}>
            {row.action}
          </button>
        </div>
      ))}
    </div>
  );
}