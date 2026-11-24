export function formatPlaytime(seconds: number): string {
  if (seconds <= 0) return "Chưa chơi";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) return `${hours} giờ ${minutes} phút`;
  if (minutes > 0) return `${minutes} phút`;
  return "Dưới 1 phút";
}

export function formatPlaytimeShort(seconds: number): string {
  if (seconds <= 0) return "—";
  const hours = Math.floor(seconds / 3600);
  if (hours > 0) return `${hours} giờ`;
  return `${Math.max(1, Math.floor(seconds / 60))} phút`;
}

export function formatLastPlayed(timestamp: number | null): string {
  if (timestamp === null) return "Chưa chơi";

  const days = Math.floor((Date.now() / 1000 - timestamp) / 86400);
  if (days <= 0) return "Hôm nay";
  if (days === 1) return "Hôm qua";
  if (days < 30) return `${days} ngày trước`;
  if (days < 365) return `${Math.floor(days / 30)} tháng trước`;
  return `${Math.floor(days / 365)} năm trước`;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("vi-VN");
}