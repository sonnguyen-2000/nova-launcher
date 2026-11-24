use tauri::State;

use crate::error::AppResult;
use crate::services::launcher_service::LauncherService;
use crate::state::AppState;

#[tauri::command]
pub fn launch_game(state: State<'_, AppState>, id: i64) -> AppResult<()> {
    LauncherService::launch(&state, id)
}

#[tauri::command]
pub fn stop_game(state: State<'_, AppState>, id: i64) -> AppResult<()> {
    LauncherService::stop(&state, id)
}

#[tauri::command]
pub fn list_running_games(state: State<'_, AppState>) -> AppResult<Vec<i64>> {
    LauncherService::running_ids(&state)
}