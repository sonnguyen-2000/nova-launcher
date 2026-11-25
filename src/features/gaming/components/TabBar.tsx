import { GAMING_TABS, type GamingTab } from "../gaming.types";

interface TabBarProps {
  tab: GamingTab;
  onChange: (tab: GamingTab) => void;
}

export function TabBar({ tab, onChange }: TabBarProps) {
  return (
    <nav className="g-tabs">
      {GAMING_TABS.map((item) => (
        <button
          key={item.value}
          className={`g-tab${tab === item.value ? " is-active" : ""}`}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}