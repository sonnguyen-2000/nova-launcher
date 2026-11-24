use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ScanFolder {
    pub id: i64,
    pub path: String,
    pub created_at: i64,
}