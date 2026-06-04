# Arquitectura del proyecto Essence

`Essence` es una aplicación de escritorio construida con Tauri y React. Esta documentación describe el diseño general y cómo interactúan las diferentes partes.

## Componentes principales

### Frontend (React)

Ubicación: `src/`

- `App.tsx`
  - Controla el estado global de pestañas, la barra de direcciones y la comunicación con Tauri.
  - Sincroniza el tamaño del child WebView con el layout de la UI.
- `components/`
  - `Toolbar.tsx` - Barra superior con navegación, búsqueda y controles.
  - `TabBar.tsx` - Gestión de pestañas y creación/cierre de pestañas.
  - `BrowserHome.tsx` - Página de inicio personalizada con accesos directos.
  - `Sidebar.tsx` - Panel lateral con caja fuerte y ajustes.
  - `SettingsPanel.tsx` - Configuraciones de temas, nombre de usuario y accesos directos.
  - `SecureVault.tsx` - Interfaz para proteger notas con cifrado.

### Backend nativo (Tauri / Rust)

Ubicación: `src-tauri/`

- `tauri.conf.json` - Configuración de Tauri:
  - Nombre de producto: `Essence`
  - Ventana principal: `Essence`
  - Comandos de build y desarrollo.
  - Configuración de bundle e íconos.
- `src/lib.rs` - Lógica Tauri y comandos expuestos a React.
  - `navigate_browser` - Navega el WebView nativo.
  - `reload_browser` - Recarga el WebView.
  - `open_external` - Abre URLs en el navegador externo.
  - `resize_browser` - Ajusta dimensiones del WebView según la UI.
  - `go_back_browser` / `go_forward_browser` - Control de historial del WebView.
  - `guardar_evidencia` - Cifrado AES-GCM de texto con contraseña.

## Flujo de interacción

1. El usuario escribe una URL o búsqueda.
2. `App.tsx` normaliza la entrada y decide si es una URL directa o búsqueda.
3. React invoca un comando Tauri (`invoke('navigate_browser', { url })`).
4. Tauri hace que el child WebView navegue a la URL.
5. Los controles de la UI actualizan el estado local de pestañas.

## WebView nativo

- Se crea desde `src/lib.rs` en `run()`.
- Se monta como un child de la ventana principal (`main`) con la etiqueta `browser`.
- El WebView se redimensiona según el tamaño de la ventana y el estado del sidebar.

## Cifrado y seguridad

- La caja fuerte usa `Aes256Gcm` de la crate `aes_gcm`.
- La contraseña se transforma en una clave de 32 bytes.
- Se genera un nonce aleatorio con `OsRng`.
- El resultado no se persiste en disco actualmente, pero sí demuestra el flujo de cifrado.

## Mejora futura

- Persistencia de estado: guardar pestañas, temas y accesos directos.
- Autenticación local para la caja fuerte.
- Manejo robusto de errores del WebView.
- Soporte de marcadores y historial nativo.
