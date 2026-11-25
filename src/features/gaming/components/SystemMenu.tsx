import { SidePanel } from "./SidePanel";

interface SystemMenuProps {
  onSettings: () => void;
  onDesktop: () => void;
  onQuit: () => void;
  onClose: () => void;
}

export function SystemMenu({ onSettings, onDesktop, onQuit, onClose }: SystemMenuProps) {
  return (
    <SidePanel side="left" onClose={onClose}>
      <div className="g-user">
        <div className="g-user__avatar" />
        <div>
          <div className="g-user__name">Người chơi</div>
          <div className="g-muted" style={{ fontSize: 13 }}>
            Nova
          </div>
        </div>
      </div>
      <button className="g-panel__item" onClick={onSettings}>
        Cài đặt
      </button>
      <button className="g-panel__item" onClick={onDesktop}>
        Giao diện máy tính
      </button>
      <button className="g-panel__item" onClick={onQuit}>
        Thoát ứng dụng
      </button>
      <button className="g-panel__item" onClick={onClose}>
        Đóng menu
      </button>
    </SidePanel>
  );
}