use serde::Serialize;

/// Một game tìm thấy khi quét, chưa nằm trong thư viện (hoặc đã nằm rồi).
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ScanCandidate {
    pub name: String,
    pub exe_path: String,
    pub already_added: bool,
}