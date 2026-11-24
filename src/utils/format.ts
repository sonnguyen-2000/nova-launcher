export function formatPlaytime(seconds: number): string {
  if (seconds <= 0) return "Chưa chơi";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) return `${hours} giờ ${minutes} phút`;
  if (minutes > 0) return `${minutes} phút`;
  return "Dưới 1 phút";
}