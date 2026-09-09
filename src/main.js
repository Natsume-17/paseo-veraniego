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

const scene = new THREE.Scene();
const fovHorizontalDeseado = 75; // en grados, el que se quiere mantener estable
const moveSpeed = 0.02;

// Parámetros: fov, aspect ratio, near, far
const camera = new THREE.PerspectiveCamera(
  fovHorizontalDeseado,
  16 / 9,
  0.1,
  1000,
);
camera.position.set(0, 3, 8); // colocar la cámara un poco elevada y alejada
camera.lookAt(0, 0, 0); // mirar al origen de coordenadas (donde está el personaje y el suelo)

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

// --- personajes ---
const personCharacter = createPersonCharacter(colorsPerson, gradientMap);
personCharacter.position.y = 0.9; // eleva el grupo para que el calzado toque el suelo
scene.add(personCharacter);

const catCharacter = createCatCharacter(colorsCat, gradientMap);
catCharacter.position.set(1, 0.325, 0); // eleva el grupo para que las patas toquen el suelo
scene.add(catCharacter);

const droneCharacter = createDroneCharacter(colorsDrone, gradientMap);
droneCharacter.position.set(-1, 1.5, 0); // el dron está volando, así que se coloca más alto
scene.add(droneCharacter);

// array de personajes y control de personaje activo
const characters = [personCharacter, catCharacter, droneCharacter];
let activeIndex = 0;
let activeCharacter = characters[activeIndex];

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    activeIndex = (activeIndex + 1) % characters.length;
    activeCharacter = characters[activeIndex];
  }
});

// --- propiedades de salto y gravedad ---
// altura de suelo de cada personaje (para saber cuándo ha aterrizado)
personCharacter.groundY = 0.9;
catCharacter.groundY = 0.325;
droneCharacter.groundY = 1.5; // el dron no salta, pero por consistencia
// velocidad vertical y estado de salto, solo para los personajes que saltan
// droneCharacter no las lleva a propósito: su isJumping queda undefined (falsy),
// así que el bloque de gravedad lo ignora automáticamente sin necesidad de un guard extra
personCharacter.verticalVelocity = 0;
personCharacter.isJumping = false;
catCharacter.verticalVelocity = 0;
catCharacter.isJumping = false;

// --- variables globales ---
const gravity = -0.01; // negativa, pequeña
let blinkCounter = 0; // contador de frames para el parpadeo del dron
const blinkInterval = 30; // frames entre cada parpadeo (medio segundo a 60fps)
let walkCycle = 0; // controla la fase de la oscilación del caminar
let tailCycle = 0; // controla la oscilación de la cola, avanza siempre que Cat esté activo

window.addEventListener("keydown", (event) => {
  if (event.code === "ArrowUp" || event.code === "KeyW") {
    if (activeCharacter === droneCharacter) {
      // evita que cuando se elija el dron pueda saltar
    } else if (!isJumping) {
      verticalVelocity = 0.15; // impulso inicial hacia arriba
      isJumping = true;
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
  if (isJumping && activeCharacter === personCharacter) {
    // piernas recogidas (rotación fija hacia atrás)
    personCharacter.legLeft.rotation.x = 0.65;
    personCharacter.legRight.rotation.x = 0.65;
    // brazos ligeramente elevados (rotación fija hacia adelante/arriba)
    personCharacter.armLeft.rotation.x = -0.5;
    personCharacter.armRight.rotation.x = -0.5;
  } else if (
    activeCharacter === personCharacter &&
    (keysPressed["KeyA"] ||
      keysPressed["ArrowLeft"] ||
      keysPressed["KeyD"] ||
      keysPressed["ArrowRight"])
  ) {
    // avanza la fase de la oscilación
    walkCycle += 0.04;
    // aplica la oscilación a piernas en fase opuesta entre sí
    personCharacter.legLeft.rotation.x = Math.sin(walkCycle) * 0.2;
    personCharacter.legRight.rotation.x = -Math.sin(walkCycle) * 0.2;
    // aplica la oscilación a brazos en fase opuesta a las piernas del mismo lado
    personCharacter.armLeft.rotation.x = -Math.sin(walkCycle) * 0.2;
    personCharacter.armRight.rotation.x = Math.sin(walkCycle) * 0.2;
  } else if (
    activeCharacter === personCharacter &&
    (keysPressed["KeyS"] || keysPressed["ArrowDown"])
  ) {
    // brazos ligeramente recogidos hacia el cuerpo (piernas ya se comprimen con scale.y)
    personCharacter.armLeft.rotation.x = -0.5;
    personCharacter.armRight.rotation.x = -0.5;
  } else {
    // si no se mueve, todo vuelve a su posición neutral (0)
    personCharacter.legLeft.rotation.x = 0;
    personCharacter.legRight.rotation.x = 0;
    personCharacter.armLeft.rotation.x = 0;
    personCharacter.armRight.rotation.x = 0;
  }

  // animaciones del personaje gato (patas y cola) según su estado
  if (isJumping && activeCharacter === catCharacter) {
    // las cuatro patas recogidas hacia el cuerpo, mismo signo (pose simétrica)
    catCharacter.legFrontLeft.rotation.z = 0.25;
    catCharacter.legBackRight.rotation.z = 0.25;
    catCharacter.legFrontRight.rotation.z = 0.25;
    catCharacter.legBackLeft.rotation.z = 0.25;
    // cola elevada respecto a su ángulo base (-Math.PI / 6), fija (sin oscilación)
    catCharacter.tail.rotation.y = 0.25;
  } else if (
    activeCharacter === catCharacter &&
    (keysPressed["KeyA"] ||
      keysPressed["ArrowLeft"] ||
      keysPressed["KeyD"] ||
      keysPressed["ArrowRight"])
  ) {
    walkCycle += 0.1;
    // patas en patrón diagonal (delantera-izq + trasera-der en fase; delantera-der + trasera-izq en fase opuesta)
    catCharacter.legFrontLeft.rotation.z = Math.sin(walkCycle) * 0.25;
    catCharacter.legBackRight.rotation.z = Math.sin(walkCycle) * 0.25;
    catCharacter.legFrontRight.rotation.z = -Math.sin(walkCycle) * 0.25;
    catCharacter.legBackLeft.rotation.z = -Math.sin(walkCycle) * 0.25;
    // cola con oscilación más rápida/amplia al caminar
    tailCycle += 0.12;
    catCharacter.tail.rotation.y = Math.sin(tailCycle) * 0.5;
  } else if (activeCharacter === catCharacter) {
    // neutral cuando Cat está activo pero no se mueve
    catCharacter.legFrontLeft.rotation.z = 0;
    catCharacter.legFrontRight.rotation.z = 0;
    catCharacter.legBackLeft.rotation.z = 0;
    catCharacter.legBackRight.rotation.z = 0;
    // cola con oscilación lenta y sutil en reposo
    tailCycle += 0.04;
    catCharacter.tail.rotation.y = Math.sin(tailCycle) * 0.25;
  }

  // límites de altura del dron (para no subir/bajar sin límite)
  const droneMinY = 0.8;
  const droneMaxY = 2.5;

  if (activeCharacter === droneCharacter) {
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

  // escala de agachado para el personaje persona
  const crouchScale = 0.6; // reduce la altura al 60 %

  if (activeCharacter === personCharacter) {
    if (keysPressed["KeyS"] || keysPressed["ArrowDown"]) {
      activeCharacter.scale.y = crouchScale;
      // ajusta la posición para que los pies sigan en el suelo
      activeCharacter.position.y = activeCharacter.groundY * crouchScale;
    } else if (!isJumping) {
      // solo resetea si no está saltando
      activeCharacter.scale.y = 1;
      activeCharacter.position.y = activeCharacter.groundY;
    }
  }

  // aplica la gravedad a cada personaje, esté activo o no
  characters.forEach((character) => {
    if (character.isJumping) {
      character.verticalVelocity += gravity;
      character.position.y += character.verticalVelocity;

      // si ha llegado o pasado su altura de suelo, aterriza
      if (character.position.y <= character.groundY) {
        character.position.y = character.groundY;
        character.isJumping = false;
        character.verticalVelocity = 0;
      }
    }
  });

  // animación de las hélices  y la luz indicadora del dron
  // rotación continua de las hélices sobre su propio eje vertical
  droneCharacter.propellerRight.rotation.y += 0.3;
  droneCharacter.propellerLeft.rotation.y += 0.3;

  // incrementa el contador cada frame
  blinkCounter++;
  // si alcanza el intervalo, alterna visibilidad y resetea el contador
  if (blinkCounter >= blinkInterval) {
    droneCharacter.indicatorLight.visible =
      !droneCharacter.indicatorLight.visible;
    blinkCounter = 0;
  }

  renderer.render(scene, camera);
}

animate();
