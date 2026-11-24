use serde::Serialize;

/// Sự kiện gửi lên giao diện khi một game đóng.
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GameExited {
    pub game_id: i64,
    pub session_seconds: i64,
}