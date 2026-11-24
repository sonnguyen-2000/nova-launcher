mod migrations;

use std::path::Path;

use rusqlite::Connection;

use crate::error::AppResult;

pub fn open(path: &Path) -> AppResult<Connection> {
    if let Some(dir) = path.parent() {
        std::fs::create_dir_all(dir)?;
    }

    let mut conn = Connection::open(path)?;
    conn.execute_batch("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;")?;
    migrations::run(&mut conn)?;
    Ok(conn)
}