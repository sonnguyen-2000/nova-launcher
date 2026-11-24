use rusqlite::{params, Connection, OptionalExtension, Row};

use crate::error::AppResult;
use crate::models::game::{Game, GameInput};

pub struct GameRepository;

impl GameRepository {
    const COLUMNS: &'static str = "id, name, developer, genre, description, release_year, \
        source, exe_path, launch_args, is_favorite, is_hidden, playtime_seconds, \
        last_played_at, created_at";

    fn map_row(row: &Row<'_>) -> rusqlite::Result<Game> {
        Ok(Game {
            id: row.get("id")?,
            name: row.get("name")?,
            developer: row.get("developer")?,
            genre: row.get("genre")?,
            description: row.get("description")?,
            release_year: row.get("release_year")?,
            source: row.get("source")?,
            exe_path: row.get("exe_path")?,
            launch_args: row.get("launch_args")?,
            is_favorite: row.get("is_favorite")?,
            is_hidden: row.get("is_hidden")?,
            playtime_seconds: row.get("playtime_seconds")?,
            last_played_at: row.get("last_played_at")?,
            created_at: row.get("created_at")?,
        })
    }

    pub fn find_all(conn: &Connection) -> AppResult<Vec<Game>> {
        let sql = format!("SELECT {} FROM games ORDER BY name COLLATE NOCASE", Self::COLUMNS);
        let mut stmt = conn.prepare(&sql)?;
        let games = stmt
            .query_map([], Self::map_row)?
            .collect::<Result<Vec<_>, _>>()?;
        Ok(games)
    }

    pub fn find_by_id(conn: &Connection, id: i64) -> AppResult<Option<Game>> {
        let sql = format!("SELECT {} FROM games WHERE id = ?1", Self::COLUMNS);
        let game = conn.query_row(&sql, params![id], Self::map_row).optional()?;
        Ok(game)
    }

    pub fn insert(conn: &Connection, input: &GameInput, created_at: i64) -> AppResult<i64> {
        conn.execute(
            "INSERT INTO games
                (name, developer, genre, description, release_year, source, exe_path, launch_args, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
            params![
                input.name.trim(),
                input.developer,
                input.genre,
                input.description,
                input.release_year,
                input.source,
                input.exe_path.trim(),
                input.launch_args,
                created_at
            ],
        )?;
        Ok(conn.last_insert_rowid())
    }

    /// Trả về số dòng bị ảnh hưởng (0 nghĩa là không có game với id này).
    pub fn update(conn: &Connection, id: i64, input: &GameInput) -> AppResult<usize> {
        let rows = conn.execute(
            "UPDATE games SET
                name = ?1, developer = ?2, genre = ?3, description = ?4,
                release_year = ?5, source = ?6, exe_path = ?7, launch_args = ?8
             WHERE id = ?9",
            params![
                input.name.trim(),
                input.developer,
                input.genre,
                input.description,
                input.release_year,
                input.source,
                input.exe_path.trim(),
                input.launch_args,
                id
            ],
        )?;
        Ok(rows)
    }

    pub fn set_favorite(conn: &Connection, id: i64, value: bool) -> AppResult<usize> {
        let rows = conn.execute("UPDATE games SET is_favorite = ?1 WHERE id = ?2", params![value, id])?;
        Ok(rows)
    }

    pub fn set_hidden(conn: &Connection, id: i64, value: bool) -> AppResult<usize> {
        let rows = conn.execute("UPDATE games SET is_hidden = ?1 WHERE id = ?2", params![value, id])?;
        Ok(rows)
    }

        pub fn add_playtime(conn: &Connection, id: i64, seconds: i64, played_at: i64) -> AppResult<usize> {
        let rows = conn.execute(
            "UPDATE games
             SET playtime_seconds = playtime_seconds + ?1, last_played_at = ?2
             WHERE id = ?3",
            params![seconds, played_at, id],
        )?;
        Ok(rows)
    }

    pub fn delete(conn: &Connection, id: i64) -> AppResult<usize> {
        let rows = conn.execute("DELETE FROM games WHERE id = ?1", params![id])?;
        Ok(rows)
    }

        pub fn all_exe_paths(conn: &Connection) -> AppResult<Vec<String>> {
        let mut stmt = conn.prepare("SELECT exe_path FROM games")?;
        let paths = stmt
            .query_map([], |row| row.get::<_, String>(0))?
            .collect::<Result<Vec<_>, _>>()?;
        Ok(paths)
    }
}