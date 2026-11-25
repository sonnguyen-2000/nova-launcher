function hashString(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function coverHue(name: string): number {
  return hashString(name) % 360;
}

export function coverBackground(name: string): string {
  const hue = coverHue(name);
  return `linear-gradient(160deg, hsl(${hue} 55% 42%), hsl(${(hue + 40) % 360} 55% 16%))`;
}

/** Nền loang màu theo tông màu của game đang chọn (Chế độ Gaming). */
export function ambientBackground(hue: number): string {
  return (
    `radial-gradient(900px 620px at 72% 8%, hsl(${hue} 70% 34% / 0.6), transparent 62%), ` +
    `radial-gradient(760px 520px at 8% 100%, hsl(${(hue + 40) % 360} 70% 30% / 0.5), transparent 62%), #0b0d1a`
  );
}

export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const letters =
    words.length > 1 ? `${words[0][0]}${words[1][0]}` : (words[0] ?? "?").slice(0, 2);
  return letters.toUpperCase();
}