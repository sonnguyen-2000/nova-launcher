use std::collections::HashMap;
use std::sync::{Mutex, MutexGuard};

use rusqlite::Connection;

use crate::error::{AppError, AppResult};
use crate::models::running_game::RunningGame;

pub struct AppState {
    db: Mutex<Connection>,
    running: Mutex<HashMap<i64, RunningGame>>,
}

impl AppState {
    pub fn new(conn: Connection) -> Self {
        Self {
            db: Mutex::new(conn),
            running: Mutex::new(HashMap::new()),
        }
    }

    pub fn conn(&self) -> AppResult<MutexGuard<'_, Connection>> {
        Self::lock(&self.db)
    }

    pub fn running(&self) -> AppResult<MutexGuard<'_, HashMap<i64, RunningGame>>> {
        Self::lock(&self.running)
    }

    fn lock<T>(mutex: &Mutex<T>) -> AppResult<MutexGuard<'_, T>> {
        mutex
            .lock()
            .map_err(|_| AppError::Internal("Không thể khoá tài nguyên dùng chung".into()))
    }
}