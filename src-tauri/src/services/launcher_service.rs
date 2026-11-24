use std::path::Path;
use std::process::{Child, Command};

use crate::error::{AppError, AppResult};
use crate::models::game::Game;
use crate::models::running_game::RunningGame;
use crate::services::game_service::GameService;
use crate::state::AppState;
use crate::utils::time::now_unix;

pub struct LauncherService;

impl LauncherService {
    pub fn launch(state: &AppState, id: i64) -> AppResult<()> {
        let game = GameService::get(state, id)?;
        let mut running = state.running()?;

        if running.contains_key(&id) {
            return Err(AppError::Validation(format!("{} đang chạy rồi", game.name)));
        }

        let child = Self::spawn(&game)?;
        running.insert(id, RunningGame { child, started_at: now_unix() });
        Ok(())
    }

    pub fn stop(state: &AppState, id: i64) -> AppResult<()> {
        let mut running = state.running()?;
        let session = running
            .get_mut(&id)
            .ok_or_else(|| AppError::Validation("Game này không đang chạy".into()))?;
        session.child.kill()?;
        Ok(())
    }

    pub fn running_ids(state: &AppState) -> AppResult<Vec<i64>> {
        Ok(state.running()?.keys().copied().collect())
    }

    fn spawn(game: &Game) -> AppResult<Child> {
        let exe = Path::new(&game.exe_path);
        if !exe.is_file() {
            return Err(AppError::Validation(format!("Không tìm thấy file: {}", game.exe_path)));
        }

        let mut command = Command::new(exe);
        if let Some(dir) = exe.parent() {
            command.current_dir(dir);
        }
        Self::apply_args(&mut command, &game.launch_args);

        Ok(command.spawn()?)
    }

    #[cfg(windows)]
    fn apply_args(command: &mut Command, args: &str) {
        use std::os::windows::process::CommandExt;
        if !args.trim().is_empty() {
            command.raw_arg(args);
        }
    }

    #[cfg(not(windows))]
    fn apply_args(command: &mut Command, args: &str) {
        command.args(args.split_whitespace());
    }
}