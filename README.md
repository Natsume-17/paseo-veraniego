# Paseo veraniego

Proyecto personal de portfolio: una experiencia interactiva de exploración con estética pixel art / retro 2.5D, desarrollada con Three.js.

🚧 En desarrollo.

## Cómo ejecutar el proyecto

```bash
npm install
npm run dev
```

Después, abre `localhost:5173` en el navegador.

## Controles

| Acción    | Teclas    | Personajes     |
| --------- | --------- | -------------- |
| Izquierda | `A` / `←` | Todos          |
| Derecha   | `D` / `→` | Todos          |
| Arriba    | `W` / `↑` | Dron           |
| Abajo     | `S` / `↓` | Dron           |
| Saltar    | `W` / `↑` | Persona y gato |
| Agacharse | `S` / `↓` | Persona        |

## Tecnologías

- Three.js
- Vite
- JavaScript
- HTML5
- CSS3

## Arquitectura / organización del código

- `main.js`: gestiona la inicialización de la exploración con `startExploration`.
- `colors.js`: paleta de colores centralizada, organizada por categorías (entorno, faro, personajes).
- `sizing.js`: gestiona el ajuste del tamaño del canvas a la ventana, manteniendo el aspect ratio fijo.
- `characters/`: un archivo por personaje (`person.js`, `cat.js`, `drone.js`), cada uno con una función `createXCharacter(colors, gradientMap)` que construye y devuelve un `THREE.Group`.
- `input.js`: gestiona el estado de las teclas pulsadas en cada momento.
- `titleScreen.js`: gestiona la pantalla de título para seleccionar a un personaje.

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

### Fase 4 — Personajes

- Tres personajes construidos con geometría simple estilo «Minecraft» (piezas diferenciadas agrupadas en `THREE.Group`):
  - **Person**: torso, cabeza, brazos, piernas, calzado, pelo, ojos y boca
  - **Cat**: cuerpo, cabeza, orejas, patas, cola, ojos y nariz
  - **Drone**: cuerpo, brazos inclinados, hélices y luz indicadora
- Posicionamiento de piezas mediante el patrón «borde + mitad» (edge + mitad de la pieza adyacente)
- Rasgos faciales resueltos con `PlaneGeometry`, orientados según la cara visible de cada personaje
- Los tres personajes coexisten en la escena de prueba, apoyados correctamente sobre el suelo

### Fase 5 — Movimiento

- Teclas definidas para movimiento lateral, salto (en `person` y en `cat`) y agachado (solo en `person`), y `drone` se mueve arriba y abajo (no salta ni se agacha)
- Animaciones de los movimientos, incluyendo las de algunas partes de los personajes por separado
- Gravedad implementada para darle realismo al salto
- Pantalla de título (`titleScreen.js`) para la selección del personaje (`activeCharacter`); solo se elige uno, ya no aparecen los tres en escena
