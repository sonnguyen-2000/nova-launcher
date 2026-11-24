use serde::{Deserialize, Serialize};

use crate::error::{AppError, AppResult};

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Game {
    pub id: i64,
    pub name: String,
    pub developer: String,
    pub genre: String,
    pub description: String,
    pub release_year: Option<i32>,
    pub source: String,
    pub exe_path: String,
    pub launch_args: String,
    pub is_favorite: bool,
    pub is_hidden: bool,
    pub playtime_seconds: i64,
    pub last_played_at: Option<i64>,
    pub created_at: i64,
}

/// Dữ liệu giao diện gửi lên khi thêm hoặc sửa game.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GameInput {
    pub name: String,
    pub developer: String,
    pub genre: String,
    pub description: String,
    pub release_year: Option<i32>,
    pub source: String,
    pub exe_path: String,
    pub launch_args: String,
}

impl GameInput {
    pub fn validate(&self) -> AppResult<()> {
        if self.name.trim().is_empty() {
            return Err(AppError::Validation("Tên game không được để trống".into()));
        }
        if self.exe_path.trim().is_empty() {
            return Err(AppError::Validation("Đường dẫn file .exe không được để trống".into()));
        }
        Ok(())
    }
}