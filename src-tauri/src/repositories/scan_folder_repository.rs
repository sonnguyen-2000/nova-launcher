use rusqlite::{params, Connection, OptionalExtension, Row};

use crate::error::AppResult;
use crate::models::scan_folder::ScanFolder;

pub struct ScanFolderRepository;

impl ScanFolderRepository {
    fn map_row(row: &Row<'_>) -> rusqlite::Result<ScanFolder> {
        Ok(ScanFolder {
            id: row.get("id")?,
            path: row.get("path")?,
            created_at: row.get("created_at")?,
        })
    }

    pub fn find_all(conn: &Connection) -> AppResult<Vec<ScanFolder>> {
        let mut stmt = conn
            .prepare("SELECT id, path, created_at FROM scan_folders ORDER BY path COLLATE NOCASE")?;
        let folders = stmt
            .query_map([], Self::map_row)?
            .collect::<Result<Vec<_>, _>>()?;
        Ok(folders)
    }

    pub fn find_by_id(conn: &Connection, id: i64) -> AppResult<Option<ScanFolder>> {
        let folder = conn
            .query_row(
                "SELECT id, path, created_at FROM scan_folders WHERE id = ?1",
                params![id],
                Self::map_row,
            )
            .optional()?;
        Ok(folder)
    }

    pub fn insert(conn: &Connection, path: &str, created_at: i64) -> AppResult<i64> {
        conn.execute(
            "INSERT INTO scan_folders (path, created_at) VALUES (?1, ?2)",
            params![path, created_at],
        )?;
        Ok(conn.last_insert_rowid())
    }

    pub fn delete(conn: &Connection, id: i64) -> AppResult<usize> {
        let rows = conn.execute("DELETE FROM scan_folders WHERE id = ?1", params![id])?;
        Ok(rows)
    }
}