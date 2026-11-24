use std::collections::HashSet;
use std::path::PathBuf;

use crate::error::AppResult;
use crate::models::scan_candidate::ScanCandidate;
use crate::repositories::game_repository::GameRepository;
use crate::repositories::scan_folder_repository::ScanFolderRepository;
use crate::services::game_scanner::GameScanner;
use crate::state::AppState;
use crate::utils::path::path_key;

/// Dữ liệu cần để quét, lấy từ database trước để không giữ khoá DB trong lúc đọc ổ đĩa.
pub struct ScanPlan {
    roots: Vec<PathBuf>,
    known_exes: HashSet<String>,
}

pub struct ScanService;

impl ScanService {
    pub fn plan(state: &AppState) -> AppResult<ScanPlan> {
        let conn = state.conn()?;
        let roots = ScanFolderRepository::find_all(&conn)?
            .into_iter()
            .map(|folder| PathBuf::from(folder.path))
            .collect();
        let known_exes = GameRepository::all_exe_paths(&conn)?
            .iter()
            .map(|path| path_key(path))
            .collect();
        Ok(ScanPlan { roots, known_exes })
    }

    /// Chạy chậm (đọc ổ đĩa), nên gọi trong luồng nền.
    pub fn execute(plan: ScanPlan) -> Vec<ScanCandidate> {
        let mut seen = HashSet::new();
        let mut candidates = Vec::new();

        for root in &plan.roots {
            for game in GameScanner::scan_root(root) {
                let exe_path = game.exe_path.to_string_lossy().into_owned();
                let key = path_key(&exe_path);
                if !seen.insert(key.clone()) {
                    continue;
                }
                candidates.push(ScanCandidate {
                    name: game.name,
                    already_added: plan.known_exes.contains(&key),
                    exe_path,
                });
            }
        }

        candidates.sort_by_key(|c| c.name.to_lowercase());
        candidates
    }
}