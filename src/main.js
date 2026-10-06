/**
 * Paseo veraniego
 * ----------------
 * Punto de entrada de la aplicación. Muestra la pantalla de título y,
 * al elegir personaje, configura la escena 3D y arranca el bucle de animación.
 *
 * Responsabilidades:
 * - Mostrar la pantalla de título y recibir el personaje elegido (titleScreen.js).
 * - Inicializar Scene, Camera y Renderer.
 * - Crear el personaje elegido, y los objetos de la escena y sus materiales.
 * - Configurar la iluminación.
 * - Delegar el ajuste de tamaño del canvas en sizing.js.
 * - Consultar las acciones del jugador mediante input.js.
 * - Decidir a quién y cuándo llamar, dejando a player.js aplicar el cómo y gestionar los límites de la escena.
 * - Delegar todas las animaciones de los personajes a animations.js.
 */

import "./style.css";
import * as THREE from "three";
import { colors, colorsPerson, colorsCat, colorsDrone } from "./colors.js";
import { updateCanvasSize } from "./sizing.js";
import { createPersonCharacter } from "./characters/person.js";
import { createCatCharacter } from "./characters/cat.js";
import { createDroneCharacter } from "./characters/drone.js";
import { isActionKey } from "./input.js";
import { showTitleScreen } from "./titleScreen.js";
import {
  moveHorizontally,
  applyGravity,
  jump,
  moveVertically,
  crouch,
  initPhysics,
  applyLimits,
} from "./player.js";
import { animateCat, animateDrone, animatePerson } from "./animations.js";

// Textura de gradiente: cada valor representa un «escalón» de tono (de oscuro a claro)
const gradientColors = new Uint8Array([0, 100, 180, 255]); // 4 bandas
const gradientMap = new THREE.DataTexture(
  gradientColors,
  gradientColors.length,
  1,
  THREE.RedFormat,
);
gradientMap.magFilter = THREE.NearestFilter; // filtro que evita el suavizado entre píxeles de la textura
gradientMap.needsUpdate = true; // avisa a Three.js de que la textura tiene datos nuevos que procesar

// mapeo de personajes a sus funciones de creación y colores
const characterFactories = {
  person: createPersonCharacter,
  cat: createCatCharacter,
  drone: createDroneCharacter,
};

// colores de cada personaje
const characterColors = {
  person: colorsPerson,
  cat: colorsCat,
  drone: colorsDrone,
};

// altura inicial (eje y) de cada personaje
const characterStartY = {
  person: 0.9,
  cat: 0.325,
  drone: 1.5,
};

// velocidad de movimiento de cada personaje
const characterMoveSpeed = {
  person: 0.02,
  cat: 0.02,
  drone: 0.02,
};

// ===== FUNCIÓN PRINCIPAL =====
// inicializa la primera escena con el personaje elegido
function startExploration(chosenCharacter) {
  const app = document.getElementById("app");
  // impide que la pantalla de título se cuele en la primera escena
  app.innerHTML = "";

  // ===== ESCENA Y CÁMARA =====
  const scene = new THREE.Scene();
  const fovHorizontalDeseado = 75; // en grados, el que se quiere mantener estable
  const ASPECT_RATIO = 16 / 9; // relación de aspecto deseada (16:9)
  const fovHorizontalRad = fovHorizontalDeseado * (Math.PI / 180); // convertir a radianes
  const fovVerticalRad =
    2 * Math.atan(Math.tan(fovHorizontalRad / 2) / ASPECT_RATIO); // calcular el fov vertical en radianes
  // Parámetros: fov, aspect ratio, near, far
  const camera = new THREE.PerspectiveCamera(
    fovHorizontalDeseado,
    ASPECT_RATIO,
    0.1,
    1000,
  );

  camera.fov = fovVerticalRad * (180 / Math.PI); // volver a grados
  camera.aspect = ASPECT_RATIO;
  camera.position.set(0, 3, 8); // colocar la cámara un poco elevada y alejada
  camera.lookAt(0, 0, 0); // mirar al origen de coordenadas (donde está el personaje y el suelo)
  camera.updateProjectionMatrix();

  // ===== MUNDO =====
  // --- datos ---
  const gravity = -0.01; // negativa, pequeña
  const minX = -5.5; // límite inferior de la escena
  const maxX = 5.5; // límite superior de la escena

  // --- geometría y material del suelo ---
  // ancho, alto
  const groundGeometry = new THREE.PlaneGeometry(30, 30);
  // Reutilizamos MeshToonMaterial, igual que en el cubo, pero con el color «sand» de la paleta
  const groundMaterial = new THREE.MeshToonMaterial({
    color: colors.sand,
    gradientMap: gradientMap, // la misma textura de gradiente que ya tenemos
  });

  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  // eje a rotar para que el plano quede horizontal
  ground.rotation.x = -Math.PI / 2; // 90 grados en radianes
  scene.add(ground);

  // --- fondo de la escena ---
  // añadimos un color de fondo al cielo, que se verá en las zonas donde no haya geometría
  scene.background = new THREE.Color(colors.sky);

  // --- luces ---
  const light = new THREE.DirectionalLight(colors.sun, 0.85); // luz principal (simula el sol)
  light.position.set(1, 1, 1);
  scene.add(light);
  const ambientLight = new THREE.AmbientLight(colors.foam, 0.35); // suaviza zonas en sombra total
  scene.add(ambientLight);

  // ===== PERSONAJE =====
  const moveSpeed = characterMoveSpeed[chosenCharacter];
  const startY = characterStartY[chosenCharacter];
  // usa characterFactories y characterColors para crear solo el elegido
  const activeCharacter = characterFactories[chosenCharacter](
    characterColors[chosenCharacter],
    gradientMap,
  );

  // --- inicialización ---
  initPhysics(activeCharacter, startY, chosenCharacter);
  scene.add(activeCharacter);

  // --- salto ---
  window.addEventListener("keydown", (event) => {
    if (isActionKey(event.code, "up")) {
      jump(activeCharacter, chosenCharacter);
    }
  });

  // ===== RENDERIZADO =====
  // --- dibujado del canvas ---
  const renderer = new THREE.WebGLRenderer();
  const RENDER_WIDTH = 640;
  const RENDER_HEIGHT = 360;

  renderer.setSize(RENDER_WIDTH, RENDER_HEIGHT, false); // tamaño fijo para mantener el efecto pixel art
  document.body.appendChild(renderer.domElement);

  // llamada directa, se aplica al cargar la página
  updateCanvasSize(renderer, ASPECT_RATIO);

  // la misma función se reutiliza como callback del evento
  window.addEventListener("resize", () =>
    updateCanvasSize(renderer, ASPECT_RATIO),
  );

  // === BUCLE ===
  function animate() {
    requestAnimationFrame(animate);

    // aplica la gravedad al personaje activo
    applyGravity(activeCharacter, gravity);

    // movimiento lateral del personaje activo
    moveHorizontally(activeCharacter, moveSpeed);

    // aplica los límites de la escena
    applyLimits(activeCharacter, minX, maxX);

    // agachado y animaciones de la persona según su estado
    if (chosenCharacter === "person") {
      crouch(activeCharacter);
      animatePerson(activeCharacter);
    }

    // animaciones del gato según su estado
    if (chosenCharacter === "cat") {
      animateCat(activeCharacter);
    }

    // movimiento vertical y animaciones del dron
    if (chosenCharacter === "drone") {
      moveVertically(activeCharacter, moveSpeed);
      animateDrone(activeCharacter);
    }

    renderer.render(scene, camera);
  }

  animate();
}

// la inicialización se pasa como callback a showTitleScreen
showTitleScreen(startExploration);
