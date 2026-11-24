import type { GameInput } from "../types/game";

type RequiredFields = Pick<GameInput, "name" | "exePath">;

/** Tạo GameInput đầy đủ từ vài trường cần thiết. */
export function createGameInput(fields: RequiredFields & Partial<GameInput>): GameInput {
  return {
    developer: "",
    genre: "",
    description: "",
    releaseYear: null,
    source: "manual",
    launchArgs: "",
    ...fields,
  };
}