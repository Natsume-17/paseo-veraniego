import "./style.css";
import * as THREE from "three";
import colors from "./colors.js";

const scene = new THREE.Scene();
const fovHorizontalDeseado = 75; // en grados, el que se quiere mantener estable

// Parámetros: fov, aspect ratio, near, far
const camera = new THREE.PerspectiveCamera(
  fovHorizontalDeseado,
  16 / 9,
  0.1,
  1000,
);
camera.position.z = 5;

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

// --- luces ---
const light = new THREE.DirectionalLight(colors.sun, 0.85); // luz principal (simula el sol)
light.position.set(1, 1, 1);
scene.add(light);
const ambientLight = new THREE.AmbientLight(colors.foam, 0.35); // suaviza zonas en sombra total
scene.add(ambientLight);

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

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

// Ajustar el tamaño del canvas al tamaño de la ventana manteniendo la relación de aspecto
function updateCanvasSize() {
  const windowAspect = window.innerWidth / window.innerHeight;

  let cssWidth, cssHeight;

  if (windowAspect > ASPECT_RATIO) {
    // la ventana es más ancha que 16:9 → la altura manda
    cssHeight = window.innerHeight;
    cssWidth = cssHeight * ASPECT_RATIO;
  } else {
    // la ventana es más alta/estrecha que 16:9 → el ancho manda
    cssWidth = window.innerWidth;
    cssHeight = cssWidth / ASPECT_RATIO;
  }

  renderer.domElement.style.width = `${cssWidth}px`;
  renderer.domElement.style.height = `${cssHeight}px`;
}

// llamada directa, se aplica al cargar la página
updateCanvasSize();

// la misma función se reutiliza como callback del evento
window.addEventListener("resize", updateCanvasSize);

// --- animación ---
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();
