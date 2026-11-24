use tauri::State;

use crate::error::AppResult;
use crate::models::game::{Game, GameInput};
use crate::services::game_service::GameService;
use crate::state::AppState;

#[tauri::command]
pub fn list_games(state: State<'_, AppState>) -> AppResult<Vec<Game>> {
    GameService::list(&state)
}

#[tauri::command]
pub fn get_game(state: State<'_, AppState>, id: i64) -> AppResult<Game> {
    GameService::get(&state, id)
}

#[tauri::command]
pub fn create_game(state: State<'_, AppState>, input: GameInput) -> AppResult<Game> {
    GameService::create(&state, input)
}

#[tauri::command]
pub fn update_game(state: State<'_, AppState>, id: i64, input: GameInput) -> AppResult<Game> {
    GameService::update(&state, id, input)
}

#[tauri::command]
pub fn delete_game(state: State<'_, AppState>, id: i64) -> AppResult<()> {
    GameService::delete(&state, id)
}

#[tauri::command]
pub fn set_game_favorite(state: State<'_, AppState>, id: i64, value: bool) -> AppResult<Game> {
    GameService::set_favorite(&state, id, value)
}

#[tauri::command]
pub fn set_game_hidden(state: State<'_, AppState>, id: i64, value: bool) -> AppResult<Game> {
    GameService::set_hidden(&state, id, value)
}