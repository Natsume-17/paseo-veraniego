import "./style.css";
import * as THREE from "three";

const scene = new THREE.Scene();

// Parámetros: fov, aspect ratio, near, far
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.z = 5;

// ancho, alto, profundidad
const geometry = new THREE.BoxGeometry(1, 1, 1);

// material básico, no necesita luces para verse
const material = new THREE.MeshBasicMaterial({ color: 0x2a9d8f });

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", () => {
  const aspect = window.innerWidth / window.innerHeight;
  const fovHorizontalDeseado = 75; // en grados, el que se quiere mantener estable

  camera.aspect = aspect;

  const fovHorizontalRad = fovHorizontalDeseado * (Math.PI / 180); // convertir a radianes
  const fovVerticalRad = 2 * Math.atan(Math.tan(fovHorizontalRad / 2) / aspect); // calcular el fov vertical en radianes
  camera.fov = fovVerticalRad * (180 / Math.PI); // volver a grados

  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();
