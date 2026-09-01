/**
 * Paseo veraniego
 * ----------------
 * Punto de entrada de la aplicación. Configura la escena 3D y arranca
 * el bucle de animación.
 *
 * Responsabilidades:
 * - Inicializar Scene, Camera y Renderer.
 * - Crear los objetos de la escena de prueba (cubo, suelo) y sus materiales.
 * - Configurar la iluminación.
 * - Delegar el ajuste de tamaño del canvas en sizing.js.
 * - Ejecutar el bucle de animación (animate).
 */

import "./style.css";
import * as THREE from "three";
import colors from "./colors.js";
import { updateCanvasSize } from "./sizing.js";

const scene = new THREE.Scene();
const fovHorizontalDeseado = 75; // en grados, el que se quiere mantener estable

// Parámetros: fov, aspect ratio, near, far
const camera = new THREE.PerspectiveCamera(
  fovHorizontalDeseado,
  16 / 9,
  0.1,
  1000,
);
camera.position.set(0, 2, 5); // colocar la cámara un poco elevada y alejada del cubo
camera.lookAt(0, 0, 0); // mirar al origen de coordenadas (donde está el cubo y el suelo)

// --- geometría y material del cubo ---
// ancho, alto, profundidad
const geometry = new THREE.BoxGeometry(1, 1, 1);

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

// material que divide en bandas discretas la iluminación
const material = new THREE.MeshToonMaterial({
  color: colors.sea,
  gradientMap: gradientMap,
});

// --- geometría y material del suelo ---
// geometría de plano, ancho x alto
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
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();
