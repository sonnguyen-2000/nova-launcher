/// Chuẩn hoá đường dẫn để so sánh (Windows không phân biệt hoa thường).
pub fn path_key(path: &str) -> String {
    path.trim().replace('/', "\\").to_lowercase()
}