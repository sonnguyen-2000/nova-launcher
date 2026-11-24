use std::fs;
use std::path::{Path, PathBuf};

/// Độ sâu tối đa khi tìm .exe bên trong thư mục của một game.
const MAX_DEPTH: usize = 3;

/// File .exe có tên chứa các từ này sẽ bị bỏ qua (gỡ cài đặt, cài thư viện, báo lỗi...).
const IGNORED_KEYWORDS: &[&str] = &[
    "unins", "uninstall", "setup", "install", "vcredist", "redist", "dxsetup", "dotnet",
    "directx", "crashhandler", "crashreport", "crashpad", "updater", "helper",
];

pub struct FoundGame {
    pub name: String,
    pub exe_path: PathBuf,
}

pub struct GameScanner;

impl GameScanner {
    /// Mỗi thư mục con của `root` được coi là một game; file .exe nằm lẻ trong `root` cũng tính.
    pub fn scan_root(root: &Path) -> Vec<FoundGame> {
        let Ok(entries) = fs::read_dir(root) else {
            return Vec::new();
        };

        let mut found = Vec::new();
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                if let Some(exe_path) = Self::best_exe(&path) {
                    found.push(FoundGame { name: Self::folder_name(&path), exe_path });
                }
            } else if Self::is_game_exe(&path) {
                let name = Self::file_stem(&path);
                found.push(FoundGame { name, exe_path: path });
            }
        }
        found
    }

    /// Chọn file .exe dung lượng lớn nhất trong thư mục (thường là file chạy chính).
    fn best_exe(dir: &Path) -> Option<PathBuf> {
        let mut exes = Vec::new();
        Self::collect_exes(dir, 0, &mut exes);
        exes.into_iter()
            .max_by_key(|(_, size)| *size)
            .map(|(path, _)| path)
    }

    fn collect_exes(dir: &Path, depth: usize, out: &mut Vec<(PathBuf, u64)>) {
        if depth > MAX_DEPTH {
            return;
        }
        let Ok(entries) = fs::read_dir(dir) else {
            return;
        };

        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                Self::collect_exes(&path, depth + 1, out);
            } else if Self::is_game_exe(&path) {
                let size = entry.metadata().map(|m| m.len()).unwrap_or(0);
                out.push((path, size));
            }
        }
    }

    fn is_game_exe(path: &Path) -> bool {
        let is_exe = path
            .extension()
            .and_then(|e| e.to_str())
            .is_some_and(|e| e.eq_ignore_ascii_case("exe"));
        if !is_exe {
            return false;
        }

        let name = path
            .file_name()
            .and_then(|n| n.to_str())
            .unwrap_or("")
            .to_lowercase();
        !IGNORED_KEYWORDS.iter().any(|keyword| name.contains(keyword))
    }

    fn folder_name(path: &Path) -> String {
        Self::clean(path.file_name().and_then(|n| n.to_str()).unwrap_or(""))
    }

    fn file_stem(path: &Path) -> String {
        Self::clean(path.file_stem().and_then(|n| n.to_str()).unwrap_or(""))
    }

    fn clean(name: &str) -> String {
        name.replace('_', " ").trim().to_string()
    }
}