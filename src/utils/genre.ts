const SEPARATOR = /[·,]/;

export function genreTags(genre: string): string[] {
  return genre
    .split(SEPARATOR)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function genreMain(genre: string): string {
  return genreTags(genre)[0] ?? "Chưa phân loại";
}