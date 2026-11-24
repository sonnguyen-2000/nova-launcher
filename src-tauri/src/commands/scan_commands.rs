use tauri::State;

use crate::error::{AppError, AppResult};
use crate::models::game::GameInput;
use crate::models::scan_candidate::ScanCandidate;
use crate::models::scan_folder::ScanFolder;
use crate::services::game_service::GameService;
use crate::services::scan_folder_service::ScanFolderService;
use crate::services::scan_service::ScanService;
use crate::state::AppState;

#[tauri::command]
pub fn list_scan_folders(state: State<'_, AppState>) -> AppResult<Vec<ScanFolder>> {
    ScanFolderService::list(&state)
}

#[tauri::command]
pub fn add_scan_folder(state: State<'_, AppState>, path: String) -> AppResult<ScanFolder> {
    ScanFolderService::add(&state, path)
}

#[tauri::command]
pub fn remove_scan_folder(state: State<'_, AppState>, id: i64) -> AppResult<()> {
    ScanFolderService::remove(&state, id)
}

/// Quét đọc ổ đĩa nên chạy ở luồng nền để giao diện không bị đứng.
#[tauri::command]
pub async fn scan_games(state: State<'_, AppState>) -> AppResult<Vec<ScanCandidate>> {
    let plan = ScanService::plan(&state)?;
    tauri::async_runtime::spawn_blocking(move || ScanService::execute(plan))
        .await
        .map_err(|e| AppError::Internal(e.to_string()))
}

#[tauri::command]
pub fn import_games(state: State<'_, AppState>, inputs: Vec<GameInput>) -> AppResult<usize> {
    GameService::import(&state, inputs)
}