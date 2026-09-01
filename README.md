# Paseo veraniego

Proyecto personal de portfolio: una experiencia interactiva de exploración con estética pixel art / retro 2.5D, desarrollada con Three.js.

## Tecnologías

- Three.js
- Vite

## Arquitectura / organización del código

- `colors.js`: gestiona la paleta de colores de los materiales y luces de la escena 3D.
- `sizing.js`: gestiona el ajuste del tamaño del canvas a la ventana, manteniendo el aspect ratio fijo.

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
- Suelo y cielo básicos para dar composición a la escena de prueba

🚧 En desarrollo.
