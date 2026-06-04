# Comandos Tauri expuestos a React

En `src-tauri/src/lib.rs` se definen los comandos que React puede invocar mediante `@tauri-apps/api/core`.

## Comandos disponibles

### `navigate_browser`

- Firma:
  - `async fn navigate_browser(app: tauri::AppHandle, url: String) -> Result<(), String>`
- Qué hace:
  - Busca el WebView con la etiqueta `browser`.
  - Invoca `navigate()` en ese WebView con la URL proporcionada.
- Uso común:
  - Navegación desde la barra de direcciones.

### `reload_browser`

- Firma:
  - `async fn reload_browser(app: tauri::AppHandle) -> Result<(), String>`
- Qué hace:
  - Recarga la página actual del WebView.

### `open_external`

- Firma:
  - `async fn open_external(app: tauri::AppHandle, url: String) -> Result<(), String>`
- Qué hace:
  - Abre una URL en el navegador nativo del sistema.
- Uso secundario:
  - Se usa cuando se quiere evitar interrumpir la reproducción de audio en el WebView.

### `resize_browser`

- Firma:
  - `async fn resize_browser(app: tauri::AppHandle, x: f64, y: f64, width: f64, height: f64) -> Result<(), String>`
- Qué hace:
  - Ajusta posición y tamaño del WebView nativo.
- Uso:
  - `App.tsx` calcula el espacio disponible según la barra de pestañas, la toolbar y el sidebar.

### `go_back_browser`

- Firma:
  - `async fn go_back_browser(app: tauri::AppHandle) -> Result<(), String>`
- Qué hace:
  - Ejecuta `window.history.back()` en el WebView.

### `go_forward_browser`

- Firma:
  - `async fn go_forward_browser(app: tauri::AppHandle) -> Result<(), String>`
- Qué hace:
  - Ejecuta `window.history.forward()` en el WebView.

### `guardar_evidencia`

- Firma:
  - `fn guardar_evidencia(data: String, password: String) -> Result<String, String>`
- Qué hace:
  - Crea una clave AES-256 a partir de la contraseña.
  - Genera un nonce aleatorio.
  - Cifra el texto con AES-GCM.
  - Retorna un mensaje de éxito con la longitud del bloque cifrado.
- Nota:
  - Actualmente no persiste el bloque cifrado en disco.

## Integración con React

En `App.tsx`, el frontend usa `invoke()` de `@tauri-apps/api/core` para llamar a estos comandos:

```ts
await invoke('navigate_browser', { url: finalUrl });
```

Otros ejemplos:

- `invoke('reload_browser')`
- `invoke('open_external', { url: finalUrl })`
- `invoke('resize_browser', { x, y, width, height })`

---

Estos comandos facilitan la comunicación entre la UI React y el runtime nativo de Tauri, manteniendo la lógica de navegación y seguridad en el backend Rust.