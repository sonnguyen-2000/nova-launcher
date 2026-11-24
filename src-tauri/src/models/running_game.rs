use std::process::Child;

/// Một phiên chơi đang diễn ra.
pub struct RunningGame {
    pub child: Child,
    pub started_at: i64,
}