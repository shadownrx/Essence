use aes_gcm::{Aes256Gcm, Key, aead::{Aead, KeyInit, OsRng}, aead::generic_array::GenericArray};
use rand::RngCore;
use tauri::{Emitter, Manager, WebviewUrl, webview::WebviewBuilder};
use tauri::command;
use tauri_plugin_opener::OpenerExt;

type Nonce = GenericArray<u8, aes_gcm::aes::cipher::typenum::U12>;

#[command]
fn guardar_evidencia(data: String, password: String) -> Result<String, String> {
    let mut key_bytes = [0u8; 32];
    let input = password.as_bytes();
    for i in 0..32 { 
        key_bytes[i] = *input.get(i % input.len()).unwrap_or(&0); 
    }
    
    let key = Key::<Aes256Gcm>::from_slice(&key_bytes);
    let cipher = Aes256Gcm::new(key);
    
    let mut nonce_bytes = [0u8; 12];
    OsRng.fill_bytes(&mut nonce_bytes);
    let nonce = Nonce::from_slice(&nonce_bytes);

    let ciphertext = cipher.encrypt(nonce, data.as_bytes())
        .map_err(|e| e.to_string())?;

    Ok(format!("Cifrado exitoso. Longitud del bloque: {}", ciphertext.len()))
}

#[command]
async fn navigate_browser(app: tauri::AppHandle, url: String) -> Result<(), String> {
    if let Some(webview) = app.get_webview("browser") {
        webview.navigate(url.parse().map_err(|e: url::ParseError| e.to_string())?)
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[command]
async fn reload_browser(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(webview) = app.get_webview("browser") {
        webview.reload().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[command]
async fn open_external(app: tauri::AppHandle, url: String) -> Result<(), String> {
    app.opener()
        .open_url(url, Option::<String>::None)
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
async fn resize_browser(
    app: tauri::AppHandle,
    x: f64,
    y: f64,
    width: f64,
    height: f64,
) -> Result<(), String> {
    if let Some(webview) = app.get_webview("browser") {
        webview.set_bounds(tauri::Rect {
            position: tauri::LogicalPosition::new(x, y).into(),
            size: tauri::LogicalSize::new(width, height).into(),
        }).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            guardar_evidencia,
            navigate_browser,
            reload_browser,
            open_external,
            resize_browser,
            go_back_browser,
            go_forward_browser,
        ])
        .setup(|app| {
    let main_window = app.get_webview_window("main").unwrap();
    let window = main_window.as_ref().window();

    let browser_window = WebviewBuilder::new(
            "browser",
            WebviewUrl::External("about:blank".parse().unwrap()),
        )
        .on_navigation(move |url| {
            let href = url.to_string();
            let _ = main_window.emit_str("browser-url-changed", href);
            true
        });

    window.add_child(
        browser_window,
        tauri::LogicalPosition::new(0.0, 88.0),
        tauri::LogicalSize::new(1280.0, 712.0),
    )?;

    Ok(())
})
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[command]
async fn go_back_browser(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(webview) = app.get_webview("browser") {
        webview.eval("window.history.back()").map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[command]
async fn go_forward_browser(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(webview) = app.get_webview("browser") {
        webview.eval("window.history.forward()").map_err(|e| e.to_string())?;
    }
    Ok(())
}