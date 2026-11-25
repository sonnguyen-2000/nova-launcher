mod commands;
mod db;
mod error;
mod models;
mod repositories;
mod services;
mod state;
mod utils;

use tauri::Manager;

use crate::commands::{game_commands, launcher_commands, scan_commands, window_commands};
use crate::services::session_monitor::SessionMonitor;
use crate::state::AppState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let db_path = app.path().app_data_dir()?.join("nova.db");
            let conn = db::open(&db_path)?;
            app.manage(AppState::new(conn));
            SessionMonitor::start(app.handle().clone());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            game_commands::list_games,
            game_commands::get_game,
            game_commands::create_game,
            game_commands::update_game,
            game_commands::delete_game,
            game_commands::set_game_favorite,
            game_commands::set_game_hidden,
            launcher_commands::launch_game,
            launcher_commands::stop_game,
            launcher_commands::list_running_games,
            scan_commands::list_scan_folders,
            scan_commands::add_scan_folder,
            scan_commands::remove_scan_folder,
            scan_commands::scan_games,
            scan_commands::import_games,
            window_commands::set_fullscreen,
            window_commands::focus_window,
            window_commands::exit_app,
        ])
        .run(tauri::generate_context!())
        .expect("Không thể khởi chạy ứng dụng");
}