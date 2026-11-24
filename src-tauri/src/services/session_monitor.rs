use std::thread;
use std::time::Duration;

use tauri::{AppHandle, Emitter, Manager};

use crate::models::game_exited::GameExited;
use crate::services::game_service::GameService;
use crate::state::AppState;
use crate::utils::time::now_unix;

const POLL_INTERVAL: Duration = Duration::from_secs(2);
const EVENT_GAME_EXITED: &str = "game-exited";

pub struct SessionMonitor;

impl SessionMonitor {
    pub fn start(app: AppHandle) {
        thread::spawn(move || loop {
            thread::sleep(POLL_INTERVAL);
            Self::tick(&app);
        });
    }

    fn tick(app: &AppHandle) {
        let state = app.state::<AppState>();

        for (game_id, started_at) in Self::take_finished(&state) {
            let ended_at = now_unix();
            let seconds = (ended_at - started_at).max(0);

            if let Err(e) = GameService::record_session(&state, game_id, seconds, ended_at) {
                eprintln!("Không lưu được giờ chơi của game {game_id}: {e}");
            }
            let _ = app.emit(EVENT_GAME_EXITED, GameExited { game_id, session_seconds: seconds });
        }
    }

    /// Lấy ra các game đã đóng và gỡ chúng khỏi danh sách đang chạy.
    fn take_finished(state: &AppState) -> Vec<(i64, i64)> {
        let Ok(mut running) = state.running() else {
            return Vec::new();
        };

        let finished: Vec<i64> = running
            .iter_mut()
            .filter_map(|(id, session)| match session.child.try_wait() {
                Ok(None) => None,
                _ => Some(*id),
            })
            .collect();

        finished
            .into_iter()
            .filter_map(|id| running.remove(&id).map(|s| (id, s.started_at)))
            .collect()
    }
}