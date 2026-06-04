# Essence

`Essence` es un navegador de escritorio construido con Tauri, React y TypeScript. Está diseñado como una experiencia moderna y personalizable, con pestañas, un home dinámico, ajustes visuales y una caja fuerte segura.

## 🚀 Descripción

El proyecto combina:
- `React` + `TypeScript` para la interfaz de usuario.
- `Vite` como entorno de desarrollo y bundling.
- `Tauri` para empaquetar la aplicación como un cliente de escritorio nativo.

La aplicación se ejecuta dentro de una ventana Tauri llamada `Essence` y usa un child WebView nativo para cargar páginas web.

## ✨ Características principales

- Navegación por pestañas con apertura y cierre de pestañas.
- Barra de direcciones con soporte para URL directas y búsqueda inteligente.
- Botones de navegación: atrás, adelante, recargar e inicio.
- Página de inicio con accesos directos a sitios populares.
- Sidebar de ajustes con selección de tema y personalización de accesos directos.
- Caja fuerte segura (`Secure Vault`) que cifra notas con AES-GCM.
- Integración nativa Tauri para navegar, recargar, abrir URLs externas y redimensionar el WebView.

## 🧩 Estructura del proyecto

- `src/` - Código frontend de React.
  - `App.tsx` - Lógica principal y estado de pestañas.
  - `components/` - Componentes UI: `Toolbar`, `TabBar`, `Sidebar`, `BrowserHome`, `SettingsPanel`, `SecureVault`, etc.
- `src-tauri/` - Código de Tauri y Rust.
  - `tauri.conf.json` - Configuración de Tauri.
  - `src/lib.rs` - Comandos nativos y setup del WebView.
- `docs/` - Documentación interna adicional.
  - `architecture.md` - Arquitectura del proyecto.
  - `tauri-commands.md` - Descripción de comandos nativos.
- `CONTRIBUTING.md` - Guía para contribuir.

## ⚙️ Instalación y desarrollo

### Requisitos

- Node.js 18+ / 20+.
- Rust toolchain (`rustup`, `cargo`).
- `npm` o `pnpm`.

### Pasos

1. Instala dependencias:

```bash
npm install
```

2. Inicia el modo desarrollo:

```bash
npm run tauri dev
```

3. Compila la aplicación:

```bash
npm run build
```

4. Previsualiza el bundle:

```bash
npm run preview
```

## 🖥 Uso

- Escribe una URL o términos de búsqueda en la barra de direcciones.
- Usa el botón `Inicio` para regresar a la página principal.
- Controla la navegación con los botones `Atrás`, `Adelante` y `Recargar`.
- Abre nuevas pestañas desde la barra de pestañas.
- Accede a los ajustes para cambiar tema, nombre de usuario y ordenar accesos directos.
- Abre la `Caja Fuerte` para cifrar una nota con contraseña.

## 🧪 Integración Tauri / comandos nativos

El backend Rust expone estos comandos a React:

- `navigate_browser` - Navegar a una URL dentro del WebView.
- `reload_browser` - Recargar la página actual.
- `open_external` - Abrir un enlace en el navegador externo.
- `resize_browser` - Ajustar el tamaño y la posición del WebView.
- `go_back_browser` / `go_forward_browser` - Navegación histórica nativa.
- `guardar_evidencia` - Cifrar texto con AES-256-GCM usando contraseña.

## 📝 Notas importantes

- La función de caja fuerte cifra las notas, pero actualmente no guarda el resultado en disco: devuelve un mensaje de éxito con la longitud del bloque cifrado.
- El WebView se monta como un child nativo de la ventana principal, lo que permite que la interfaz React conviva con la vista web.

## 🛠 Mejora sugerida

- Persistencia de configuración y accesos directos.
- Guardado seguro de notas cifradas en archivo local.
- Soporte de historial y favoritos reales.
- Mejor manejo de estados de carga y errores del WebView.

## 📚 Recomendaciones de IDE

- Visual Studio Code.
- Extensiones: `Tauri`, `rust-analyzer`, `ESLint`, `Prettier`.

---

Disfruta desarrollando el navegador y dime si quieres que añadamos documentación de API interna, ejemplos de contribución o un `CHANGELOG`.