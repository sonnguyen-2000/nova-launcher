use serde::{Serialize, Serializer};

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("Lỗi cơ sở dữ liệu: {0}")]
    Database(#[from] rusqlite::Error),

    #[error("Lỗi đọc ghi file: {0}")]
    Io(#[from] std::io::Error),

     #[error("Không tìm thấy dữ liệu có id {0}")]
    NotFound(i64),

    #[error("Dữ liệu không hợp lệ: {0}")]
    Validation(String),

    #[error("Lỗi nội bộ: {0}")]
    Internal(String),
}

pub type AppResult<T> = Result<T, AppError>;

// Tauri yêu cầu lỗi trả về cho giao diện phải serialize được.
impl Serialize for AppError {
    fn serialize<S: Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        serializer.serialize_str(&self.to_string())
    }
}