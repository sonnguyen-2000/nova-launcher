use std::path::Path;

use crate::error::{AppError, AppResult};
use crate::models::scan_folder::ScanFolder;
use crate::repositories::scan_folder_repository::ScanFolderRepository;
use crate::state::AppState;
use crate::utils::path::path_key;
use crate::utils::time::now_unix;

pub struct ScanFolderService;

impl ScanFolderService {
    pub fn list(state: &AppState) -> AppResult<Vec<ScanFolder>> {
        let conn = state.conn()?;
        ScanFolderRepository::find_all(&conn)
    }

    pub fn add(state: &AppState, path: String) -> AppResult<ScanFolder> {
        let path = path.trim().to_string();
        if !Path::new(&path).is_dir() {
            return Err(AppError::Validation(format!("Thư mục không tồn tại: {path}")));
        }

        let conn = state.conn()?;
        let key = path_key(&path);
        let exists = ScanFolderRepository::find_all(&conn)?
            .iter()
            .any(|folder| path_key(&folder.path) == key);
        if exists {
            return Err(AppError::Validation("Thư mục này đã được thêm".into()));
        }

        let id = ScanFolderRepository::insert(&conn, &path, now_unix())?;
        ScanFolderRepository::find_by_id(&conn, id)?.ok_or(AppError::NotFound(id))
    }

    pub fn remove(state: &AppState, id: i64) -> AppResult<()> {
        let conn = state.conn()?;
        if ScanFolderRepository::delete(&conn, id)? == 0 {
            return Err(AppError::NotFound(id));
        }
        Ok(())
    }
}