/**
 * Paseo veraniego
 * ----------------
 * Punto de entrada de la aplicación. Configura la escena 3D y arranca
 * el bucle de animación.
 *
 * Responsabilidades:
 * - Inicializar Scene, Camera y Renderer.
 * - Crear los objetos de la escena (personaje, suelo, cielo) y sus materiales.
 * - Configurar la iluminación.
 * - Delegar el ajuste de tamaño del canvas en sizing.js.
 * - Ejecutar el bucle de animación (animate).
 */

import "./style.css";
import * as THREE from "three";
import { colors, colorsPerson, colorsCat, colorsDrone } from "./colors.js";
import { updateCanvasSize } from "./sizing.js";
import { createPersonCharacter } from "./characters/person.js";
import { createCatCharacter } from "./characters/cat.js";
import { createDroneCharacter } from "./characters/drone.js";
import { keysPressed } from "./input.js";
import { showTitleScreen } from "./titleScreen.js";

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

// Mapeo de personajes a sus funciones de creación y colores
const characterFactories = {
  person: createPersonCharacter,
  cat: createCatCharacter,
  drone: createDroneCharacter,
};

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

// --- FUNCIÓN PRINCIPAL ---
// inicializa la primera escena con el personaje elegido
function startExploration(chosenCharacter) {
  const app = document.getElementById("app");
  // impide que la pantalla de título se cuele en la primera escena
  app.innerHTML = "";
  const scene = new THREE.Scene();
  const fovHorizontalDeseado = 75; // en grados, el que se quiere mantener estable
  const moveSpeed = 0.02;
  const startY = characterStartY[chosenCharacter];

  // Parámetros: fov, aspect ratio, near, far
  const camera = new THREE.PerspectiveCamera(
    fovHorizontalDeseado,
    16 / 9,
    0.1,
    1000,
  );
  camera.position.set(0, 3, 8); // colocar la cámara un poco elevada y alejada
  camera.lookAt(0, 0, 0); // mirar al origen de coordenadas (donde está el personaje y el suelo)

  // --- personaje ---
  // usa characterFactories y characterColors para crear solo el elegido
  const activeCharacter = characterFactories[chosenCharacter](
    characterColors[chosenCharacter],
    gradientMap,
  );
  // eleva el personaje para que pies/patas toquen el suelo (o vuele, en el dron)
  activeCharacter.position.y = startY;
  scene.add(activeCharacter);

  // --- propiedades de salto y gravedad ---
  // altura de suelo del personaje (para saber cuándo ha aterrizado)
  activeCharacter.groundY = startY;
  // velocidad vertical y estado de salto, solo para los personajes que saltan
  // dron no las lleva a propósito: su isJumping queda undefined (falsy),
  // así que el bloque de gravedad lo ignora automáticamente sin necesidad de un guard extra
  if (chosenCharacter === "person" || chosenCharacter === "cat") {
    activeCharacter.verticalVelocity = 0;
    activeCharacter.isJumping = false;
  }

  // --- variables globales ---
  const gravity = -0.01; // negativa, pequeña
  let blinkCounter = 0; // contador de frames para el parpadeo del dron
  const blinkInterval = 30; // frames entre cada parpadeo (medio segundo a 60fps)
  let walkCycle = 0; // controla la fase de la oscilación del caminar
  let tailCycle = 0; // controla la oscilación de la cola, avanza siempre que Cat esté activo

  window.addEventListener("keydown", (event) => {
    if (event.code === "ArrowUp" || event.code === "KeyW") {
      // evita que cuando se elija el dron pueda saltar
      // solo saltan persona y gato, y solo si no están ya en el aire ni agachados
      if (
        chosenCharacter !== "drone" &&
        !activeCharacter.isJumping &&
        !(keysPressed["ArrowDown"] || keysPressed["KeyS"])
      ) {
        activeCharacter.verticalVelocity = 0.15; // impulso inicial hacia arriba
        activeCharacter.isJumping = true;
      }
    }
  });

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

  // --- dibujado del canvas ---
  const renderer = new THREE.WebGLRenderer();
  const RENDER_WIDTH = 640;
  const RENDER_HEIGHT = 360;
  const ASPECT_RATIO = 16 / 9; // relación de aspecto deseada (16:9)

  camera.aspect = ASPECT_RATIO;

  const fovHorizontalRad = fovHorizontalDeseado * (Math.PI / 180); // convertir a radianes
  const fovVerticalRad =
    2 * Math.atan(Math.tan(fovHorizontalRad / 2) / ASPECT_RATIO); // calcular el fov vertical en radianes
  camera.fov = fovVerticalRad * (180 / Math.PI); // volver a grados

  camera.updateProjectionMatrix();

  renderer.setSize(RENDER_WIDTH, RENDER_HEIGHT, false); // tamaño fijo para mantener el efecto pixel art
  document.body.appendChild(renderer.domElement);

  // llamada directa, se aplica al cargar la página
  updateCanvasSize(renderer, ASPECT_RATIO);

  // la misma función se reutiliza como callback del evento
  window.addEventListener("resize", () =>
    updateCanvasSize(renderer, ASPECT_RATIO),
  );

  // --- animación ---
  function animate() {
    requestAnimationFrame(animate);

    // movimiento lateral del personaje activo
    if (keysPressed["KeyA"] || keysPressed["ArrowLeft"]) {
      activeCharacter.position.x -= moveSpeed;
    }

    if (keysPressed["KeyD"] || keysPressed["ArrowRight"]) {
      activeCharacter.position.x += moveSpeed;
    }

    // animaciones del personaje persona (piernas y brazos) según su estado
    if (activeCharacter.isJumping && chosenCharacter === "person") {
      // piernas recogidas (rotación fija hacia atrás)
      activeCharacter.legLeft.rotation.x = 0.65;
      activeCharacter.legRight.rotation.x = 0.65;
      // brazos ligeramente elevados (rotación fija hacia adelante/arriba)
      activeCharacter.armLeft.rotation.x = -0.5;
      activeCharacter.armRight.rotation.x = -0.5;
    } else if (
      chosenCharacter === "person" &&
      (keysPressed["KeyA"] ||
        keysPressed["ArrowLeft"] ||
        keysPressed["KeyD"] ||
        keysPressed["ArrowRight"])
    ) {
      // avanza la fase de la oscilación
      walkCycle += 0.04;
      // aplica la oscilación a piernas en fase opuesta entre sí
      activeCharacter.legLeft.rotation.x = Math.sin(walkCycle) * 0.2;
      activeCharacter.legRight.rotation.x = -Math.sin(walkCycle) * 0.2;
      // aplica la oscilación a brazos en fase opuesta a las piernas del mismo lado
      activeCharacter.armLeft.rotation.x = -Math.sin(walkCycle) * 0.2;
      activeCharacter.armRight.rotation.x = Math.sin(walkCycle) * 0.2;
    } else if (
      chosenCharacter === "person" &&
      (keysPressed["KeyS"] || keysPressed["ArrowDown"])
    ) {
      // brazos ligeramente recogidos hacia el cuerpo y piernas rectas (pose de agachado)
      activeCharacter.armLeft.rotation.x = -0.5;
      activeCharacter.armRight.rotation.x = -0.5;
      activeCharacter.legLeft.rotation.x = 0;
      activeCharacter.legRight.rotation.x = 0;
    } else if (chosenCharacter === "person") {
      // si no se mueve, todo vuelve a su posición neutral (0)
      activeCharacter.legLeft.rotation.x = 0;
      activeCharacter.legRight.rotation.x = 0;
      activeCharacter.armLeft.rotation.x = 0;
      activeCharacter.armRight.rotation.x = 0;
    }

    // escala de agachado para el personaje persona
    const crouchScale = 0.6; // reduce la altura al 60 %

    if (chosenCharacter === "person") {
      if (
        !activeCharacter.isJumping &&
        (keysPressed["KeyS"] || keysPressed["ArrowDown"])
      ) {
        activeCharacter.scale.y = crouchScale;
        // ajusta la posición para que los pies sigan en el suelo
        activeCharacter.position.y = activeCharacter.groundY * crouchScale;
      } else if (!activeCharacter.isJumping) {
        // solo resetea si no está saltando
        activeCharacter.scale.y = 1;
        activeCharacter.position.y = activeCharacter.groundY;
      }
    }

    // animaciones del personaje gato (patas y cola) según su estado
    if (activeCharacter.isJumping && chosenCharacter === "cat") {
      // las cuatro patas recogidas hacia el cuerpo, mismo signo (pose simétrica)
      activeCharacter.legFrontLeft.rotation.z = 0.25;
      activeCharacter.legBackRight.rotation.z = 0.25;
      activeCharacter.legFrontRight.rotation.z = 0.25;
      activeCharacter.legBackLeft.rotation.z = 0.25;
      // cola elevada respecto a su ángulo base (-Math.PI / 6), fija (sin oscilación)
      activeCharacter.tail.rotation.y = 0.25;
    } else if (
      chosenCharacter === "cat" &&
      (keysPressed["KeyA"] ||
        keysPressed["ArrowLeft"] ||
        keysPressed["KeyD"] ||
        keysPressed["ArrowRight"])
    ) {
      walkCycle += 0.1;
      // patas en patrón diagonal (delantera-izq + trasera-der en fase; delantera-der + trasera-izq en fase opuesta)
      activeCharacter.legFrontLeft.rotation.z = Math.sin(walkCycle) * 0.25;
      activeCharacter.legBackRight.rotation.z = Math.sin(walkCycle) * 0.25;
      activeCharacter.legFrontRight.rotation.z = -Math.sin(walkCycle) * 0.25;
      activeCharacter.legBackLeft.rotation.z = -Math.sin(walkCycle) * 0.25;
      // cola con oscilación más rápida/amplia al caminar
      tailCycle += 0.12;
      activeCharacter.tail.rotation.y = Math.sin(tailCycle) * 0.5;
    } else if (chosenCharacter === "cat") {
      // neutral cuando Cat está activo pero no se mueve
      activeCharacter.legFrontLeft.rotation.z = 0;
      activeCharacter.legFrontRight.rotation.z = 0;
      activeCharacter.legBackLeft.rotation.z = 0;
      activeCharacter.legBackRight.rotation.z = 0;
      // cola con oscilación lenta y sutil en reposo
      tailCycle += 0.04;
      activeCharacter.tail.rotation.y = Math.sin(tailCycle) * 0.25;
    }

    // aplica la gravedad al personaje mientras salta
    if (activeCharacter.isJumping) {
      activeCharacter.verticalVelocity += gravity;
      activeCharacter.position.y += activeCharacter.verticalVelocity;

      // si ha llegado o pasado su altura de suelo, aterriza
      if (activeCharacter.position.y <= activeCharacter.groundY) {
        activeCharacter.position.y = activeCharacter.groundY;
        activeCharacter.isJumping = false;
        activeCharacter.verticalVelocity = 0;
      }
    }

    // límites de altura del dron (para no subir/bajar sin límite)
    const droneMinY = 0.8;
    const droneMaxY = 2.5;

    if (chosenCharacter === "drone") {
      if (keysPressed["KeyW"] || keysPressed["ArrowUp"]) {
        if (activeCharacter.position.y < droneMaxY) {
          activeCharacter.position.y += moveSpeed;
        }
      }
      if (keysPressed["KeyS"] || keysPressed["ArrowDown"]) {
        if (activeCharacter.position.y > droneMinY) {
          activeCharacter.position.y -= moveSpeed;
        }
      }
    }

    if (chosenCharacter === "drone") {
      // animación de las hélices y la luz indicadora del dron
      // rotación continua de las hélices sobre su propio eje vertical
      activeCharacter.propellerRight.rotation.y += 0.3;
      activeCharacter.propellerLeft.rotation.y += 0.3;

      // incrementa el contador cada frame
      blinkCounter++;
      // si alcanza el intervalo, alterna visibilidad y resetea el contador
      if (blinkCounter >= blinkInterval) {
        activeCharacter.indicatorLight.visible =
          !activeCharacter.indicatorLight.visible;
        blinkCounter = 0;
      }
    }

    renderer.render(scene, camera);
  }

  animate();
}

// la inicialización se pasa como callback a showTitleScreen
showTitleScreen(startExploration);
