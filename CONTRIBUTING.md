# Contribuir a Essence

Gracias por querer contribuir a `Essence`. Esta guía describe cómo colaborar, enviar mejoras y comprender la estructura del proyecto.

## Antes de comenzar

- Asegúrate de tener instalado:
  - Node.js 18+ / 20+
  - Rust toolchain (`rustup`, `cargo`)
  - `npm` o `pnpm`
- Revisa la documentación principal en `README.md`.

## Flujo recomendado

1. Crea una rama nueva basada en `main`:

```bash
git checkout main
git pull

git checkout -b feature/nombre-descriptivo
```

2. Realiza cambios pequeños y enfocados.
3. Asegúrate de que el proyecto compila y funciona localmente.
4. Envía un `pull request` describiendo los cambios.

## Ejecutar el proyecto

Desde la raíz del repositorio:

```bash
npm install
npm run tauri dev
```

Para compilar sin lanzar el desarrollo:

```bash
npm run build
```

## Qué puedes mejorar

- Calidad visual y accesibilidad de la UI.
- Persistencia de configuración y favoritos.
- Manejo de errores del WebView y estados de carga.
- Guardado real cifrado de notas en disco.
- Pruebas unitarias y de integración.

## Estilo de código

- Usa `TypeScript` y `React` para el frontend.
- Mantén los componentes pequeños y reutilizables.
- Selecciona nombres claros para variables y funciones.
- Evita lógicas complejas en JSX. Extrae a hooks o funciones auxiliares.

## Estructura y responsabilidades

- `src/` contiene la aplicación React.
- `src/components/` contiene los componentes UI.
- `src-tauri/` contiene la configuración y comandos de Tauri.
- `README.md` describe el proyecto.
- `CONTRIBUTING.md` describe cómo colaborar.

## Revisiones y pull requests

- Incluye una descripción clara del cambio.
- Si agregas una nueva funcionalidad, describe cómo probarla.
- Añade comentarios sobre cualquier decisión de diseño relevante.

---

Gracias por tu contribución. ¡Hagamos que `Essence` sea un navegador cada vez más robusto y seguro!