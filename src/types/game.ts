export interface Game {
  id: number;
  name: string;
  developer: string;
  genre: string;
  description: string;
  releaseYear: number | null;
  source: string;
  exePath: string;
  launchArgs: string;
  isFavorite: boolean;
  isHidden: boolean;
  playtimeSeconds: number;
  lastPlayedAt: number | null;
  createdAt: number;
}

export type GameInput = Pick<
  Game,
  | "name"
  | "developer"
  | "genre"
  | "description"
  | "releaseYear"
  | "source"
  | "exePath"
  | "launchArgs"
>;

export interface GameExitedEvent {
  gameId: number;
  sessionSeconds: number;
}