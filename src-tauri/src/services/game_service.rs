use std::collections::HashSet;

use crate::utils::path::path_key;

use rusqlite::Connection;

use crate::error::{AppError, AppResult};
use crate::models::game::{Game, GameInput};
use crate::repositories::game_repository::GameRepository;
use crate::state::AppState;
use crate::utils::time::now_unix;

pub struct GameService;

impl GameService {
        pub fn list(state: &AppState) -> AppResult<Vec<Game>> {
        let conn = state.conn()?;
        GameRepository::find_all(&conn)
    }

    pub fn get(state: &AppState, id: i64) -> AppResult<Game> {
        let conn = state.conn()?;
        Self::require(&conn, id)
    }

    pub fn create(state: &AppState, input: GameInput) -> AppResult<Game> {
        input.validate()?;
        let conn = state.conn()?;
        let id = GameRepository::insert(&conn, &input, now_unix())?;
        Self::require(&conn, id)
    }

    pub fn update(state: &AppState, id: i64, input: GameInput) -> AppResult<Game> {
        input.validate()?;
        let conn = state.conn()?;
        Self::ensure_affected(GameRepository::update(&conn, id, &input)?, id)?;
        Self::require(&conn, id)
    }

    pub fn set_favorite(state: &AppState, id: i64, value: bool) -> AppResult<Game> {
        let conn = state.conn()?;
        Self::ensure_affected(GameRepository::set_favorite(&conn, id, value)?, id)?;
        Self::require(&conn, id)
    }

    pub fn set_hidden(state: &AppState, id: i64, value: bool) -> AppResult<Game> {
        let conn = state.conn()?;
        Self::ensure_affected(GameRepository::set_hidden(&conn, id, value)?, id)?;
        Self::require(&conn, id)
    }

        pub fn record_session(state: &AppState, id: i64, seconds: i64, ended_at: i64) -> AppResult<()> {
        let conn = state.conn()?;
        Self::ensure_affected(GameRepository::add_playtime(&conn, id, seconds, ended_at)?, id)
    }

    pub fn delete(state: &AppState, id: i64) -> AppResult<()> {
        let conn = state.conn()?;
        Self::ensure_affected(GameRepository::delete(&conn, id)?, id)
    }

    fn require(conn: &Connection, id: i64) -> AppResult<Game> {
        GameRepository::find_by_id(conn, id)?.ok_or(AppError::NotFound(id))
    }

    fn ensure_affected(rows: usize, id: i64) -> AppResult<()> {
        if rows == 0 {
            Err(AppError::NotFound(id))
        } else {
            Ok(())
        }
    }

        /// Thêm nhiều game một lượt, bỏ qua game không hợp lệ hoặc đã có (trùng đường dẫn).
    pub fn import(state: &AppState, inputs: Vec<GameInput>) -> AppResult<usize> {
        let conn = state.conn()?;
        let mut known: HashSet<String> = GameRepository::all_exe_paths(&conn)?
            .iter()
            .map(|path| path_key(path))
            .collect();

        let tx = conn.unchecked_transaction()?;
        let now = now_unix();
        let mut added = 0;

        for input in inputs {
            if input.validate().is_err() || !known.insert(path_key(&input.exe_path)) {
                continue;
            }
            GameRepository::insert(&tx, &input, now)?;
            added += 1;
        }

        tx.commit()?;
        Ok(added)
    }
}