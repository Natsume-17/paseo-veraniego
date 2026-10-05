/**
 * Paseo veraniego
 * ----------------
 * Crea el personaje «Drone» como grupo de piezas geométricas.
 *
 * Responsabilidades:
 * - Construir y devolver un THREE.Group con las piezas del personaje.
 */

import * as THREE from "three";

export function createDroneCharacter(colorsDrone, gradientMap) {
  const droneCharacter = new THREE.Group();

  // --- cuerpo ---
  // radio superior, radio inferior, altura, segmentos radiales
  const bodyGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 8);
  const bodyMaterial = new THREE.MeshToonMaterial({
    color: colorsDrone.body,
    gradientMap: gradientMap,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);

  droneCharacter.add(body);

  // --- brazos ---
  // ancho, alto, profundidad (finos y alargados en X)
  const armGeometry = new THREE.BoxGeometry(0.3, 0.03, 0.03);
  const armMaterial = new THREE.MeshToonMaterial({
    color: colorsDrone.arms,
    gradientMap: gradientMap,
  });

  const armRight = new THREE.Mesh(armGeometry, armMaterial);
  // x: el brazo se centra a partir del cuerpo, extendiéndose hacia +X
  // (su propio centro debe quedar desplazado la mitad de su longitud)
  armRight.position.set(0.15, 0, 0);
  armRight.rotation.z = Math.PI / 12; // rotación ligera para que no quede completamente horizontal
  droneCharacter.add(armRight);

  const armLeft = new THREE.Mesh(armGeometry, armMaterial);
  armLeft.position.set(-0.15, 0, 0);
  armLeft.rotation.z = -Math.PI / 12;
  droneCharacter.add(armLeft);

  // --- hélices ---
  // radio superior, radio inferior, altura, segmentos radiales
  const propellerGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.02, 12);
  const propellerMaterial = new THREE.MeshToonMaterial({
    color: colorsDrone.propeller,
    gradientMap: gradientMap,
  });

  const propellerRight = new THREE.Mesh(propellerGeometry, propellerMaterial);
  // x: en el extremo exterior de armRight
  // y: ajustado visualmente para acompañar la inclinación del brazo (rotation.z)
  propellerRight.position.set(0.3, 0.07, 0);
  propellerRight.rotation.z = 0.05; // inclinación fija para que el giro en Y sea perceptible
  droneCharacter.add(propellerRight);

  const propellerLeft = new THREE.Mesh(propellerGeometry, propellerMaterial);
  propellerLeft.position.set(-0.3, 0.07, 0);
  propellerLeft.rotation.z = 0.05;
  droneCharacter.add(propellerLeft);

  // --- luz indicadora ---
  const lightGeometry = new THREE.SphereGeometry(0.03, 8, 8);
  const lightMaterial = new THREE.MeshToonMaterial({
    color: colorsDrone.light,
    gradientMap: gradientMap,
  });
  const indicatorLight = new THREE.Mesh(lightGeometry, lightMaterial);

  // y: bajo el cuerpo, medio «lightGeometry» por debajo de su borde inferior
  indicatorLight.position.set(0, -0.065, 0);
  droneCharacter.add(indicatorLight);

  // hélices y luz indicadora como propiedades del grupo para poder animarlas desde fuera
  droneCharacter.propellerRight = propellerRight;
  droneCharacter.propellerLeft = propellerLeft;
  droneCharacter.indicatorLight = indicatorLight;
  droneCharacter.blinkCounter = 0; // contador de frames para el parpadeo del dron

  return droneCharacter;
}
