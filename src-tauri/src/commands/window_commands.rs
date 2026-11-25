use tauri::{AppHandle, WebviewWindow};

use crate::error::{AppError, AppResult};

fn internal(e: tauri::Error) -> AppError {
    AppError::Internal(e.to_string())
}

#[tauri::command]
pub fn set_fullscreen(window: WebviewWindow, enabled: bool) -> AppResult<()> {
    window.set_fullscreen(enabled).map_err(internal)
}

/// Đưa cửa sổ Nova lên trước (dùng khi game đóng để quay về launcher).
#[tauri::command]
pub fn focus_window(window: WebviewWindow) -> AppResult<()> {
    window.unminimize().map_err(internal)?;
    window.set_focus().map_err(internal)
}

#[tauri::command]
pub fn exit_app(app: AppHandle) {
    app.exit(0);
}