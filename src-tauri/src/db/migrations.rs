use rusqlite::Connection;

use crate::error::AppResult;

// Mỗi phần tử là một phiên bản schema. Muốn đổi cấu trúc bảng thì THÊM phần tử mới,
// không sửa phần tử cũ.
const MIGRATIONS: &[&str] = &[
    "CREATE TABLE games (
        id               INTEGER PRIMARY KEY AUTOINCREMENT,
        name             TEXT    NOT NULL,
        developer        TEXT    NOT NULL DEFAULT '',
        genre            TEXT    NOT NULL DEFAULT '',
        description      TEXT    NOT NULL DEFAULT '',
        release_year     INTEGER,
        source           TEXT    NOT NULL DEFAULT 'manual',
        exe_path         TEXT    NOT NULL,
        launch_args      TEXT    NOT NULL DEFAULT '',
        is_favorite      INTEGER NOT NULL DEFAULT 0,
        is_hidden        INTEGER NOT NULL DEFAULT 0,
        playtime_seconds INTEGER NOT NULL DEFAULT 0,
        last_played_at   INTEGER,
        created_at       INTEGER NOT NULL
    );
    CREATE INDEX idx_games_name ON games(name);
    CREATE INDEX idx_games_last_played ON games(last_played_at);",

    "CREATE TABLE scan_folders (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        path       TEXT    NOT NULL UNIQUE,
        created_at INTEGER NOT NULL
    );",
];

pub fn run(conn: &mut Connection) -> AppResult<()> {
    let current: i64 = conn.query_row("PRAGMA user_version", [], |row| row.get(0))?;

    for (index, sql) in MIGRATIONS.iter().enumerate().skip(current as usize) {
        let tx = conn.transaction()?;
        tx.execute_batch(sql)?;
        tx.pragma_update(None, "user_version", (index + 1) as i64)?;
        tx.commit()?;
    }
    Ok(())
}