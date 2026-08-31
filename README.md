# Paseo veraniego

Proyecto personal de portfolio: una experiencia interactiva de exploración con estética pixel art / retro 2.5D, desarrollada con Three.js.

## Tecnologías

- Three.js
- Vite

## Progreso

### Fase 1 — Proyecto mínimo

- Proyecto Vite (vanilla) inicializado
- Three.js instalado
- Escena básica con Scene, Camera y Renderer

### Fase 2 — Escena básica

- Cubo con geometría y material que reacciona a la luz
- Resize responsivo (aspect ratio + fov dinámico)
- Iluminación direccional y ambiental

### Fase 3 — Estética pixel art

- Renderizado a resolución fija (640x360) con letterboxing para mantener 16:9
- CSS `image-rendering: pixelated` para bordes nítidos al escalar
- Material toon (`MeshToonMaterial`) con gradiente de 4 bandas para sombreado por bloques
- Paleta de colores centralizada (`colors.js`) aplicada a materiales y luces

🚧 En desarrollo.
