/**
 * Paseo veraniego
 * ----------------
 * Crea el personaje «Person» como grupo de piezas geométricas.
 *
 * Responsabilidades:
 * - Construir y devolver un THREE.Group con las piezas del personaje.
 */

import * as THREE from "three";

export function createPersonCharacter(colorsPerson, gradientMap) {
  // contenedor vacío que agrupará las piezas del personaje
  const personCharacter = new THREE.Group();
  // personCharacter.scale.set(0.5, 0.5, 0.5); // escalar el personaje a la mitad de su tamaño original

  // --- torso ---
  // ancho, alto, profundidad
  const torsoGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.3);
  const torsoMaterial = new THREE.MeshToonMaterial({
    color: colorsPerson.clothes,
    gradientMap: gradientMap,
  });
  const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);

  // añade el torso como hijo del grupo, no directamente a la escena
  personCharacter.add(torso);

  // --- cabeza ---
  // ancho, alto, profundidad
  const headGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  const headMaterial = new THREE.MeshToonMaterial({
    color: colorsPerson.skin,
    gradientMap: gradientMap,
  });
  const head = new THREE.Mesh(headGeometry, headMaterial);

  // la parte superior del torso está en y = 0.3 (mitad de su altura de 0.6)
  // la cabeza mide 0.3 de alto, así que su centro debe quedar medio hueco por encima de ese borde
  head.position.set(0, 0.45, 0);

  personCharacter.add(head);

  // --- pelo ---
  // ancho, alto, profundidad (un poco más ancho que la cabeza para que sobresalga)
  const hairGeometry = new THREE.BoxGeometry(0.32, 0.1, 0.32);
  const hairMaterial = new THREE.MeshToonMaterial({
    color: colorsPerson.hair,
    gradientMap: gradientMap,
  });

  const hair = new THREE.Mesh(hairGeometry, hairMaterial);
  // y: se apoya sobre el borde superior de la cabeza (0.45 + 0.15 = 0.6) hacia arriba
  hair.position.set(0, 0.65, 0);
  personCharacter.add(hair);

  // --- ojos ---
  // ancho, alto (no lleva profundidad, es un plano 2D)
  const eyeGeometry = new THREE.PlaneGeometry(0.05, 0.05);
  const eyeMaterial = new THREE.MeshToonMaterial({
    color: colorsPerson.eyes,
    gradientMap: gradientMap,
  });

  const eyeLeft = new THREE.Mesh(eyeGeometry, eyeMaterial);
  // x: separación pequeña a cada lado del centro de la cara
  // y: altura dentro de la cabeza (prueba un valor positivo pequeño, por encima del centro de la cabeza)
  // z: pegado a la cara frontal, ligeramente por delante para evitar z-fighting
  eyeLeft.position.set(0.05, 0.52, 0.16);
  personCharacter.add(eyeLeft);

  const eyeRight = new THREE.Mesh(eyeGeometry, eyeMaterial);
  eyeRight.position.set(-0.05, 0.52, 0.16);
  personCharacter.add(eyeRight);

  // --- boca ---
  // ancho, alto (no lleva profundidad, es un plano 2D)
  const mouthGeometry = new THREE.PlaneGeometry(0.1, 0.03);
  const mouthMaterial = new THREE.MeshToonMaterial({
    color: colorsPerson.mouth,
    gradientMap: gradientMap,
  });

  const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
  mouth.position.set(0, 0.4, 0.16); // posición ajustada visualmente, por debajo de los ojos (0.52)
  personCharacter.add(mouth);

  // --- brazos ---
  // ancho, alto, profundidad (más finos y largos que el torso)
  const armGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.1);
  const armMaterial = new THREE.MeshToonMaterial({
    color: colorsPerson.skin,
    gradientMap: gradientMap,
  });

  const armLeft = new THREE.Mesh(armGeometry, armMaterial);
  // el brazo cuelga desde la altura del hombro (borde superior del torso, y = 0.3)
  // hacia abajo. Su centro debe quedar medio «armGeometry» por debajo de ese borde.
  // x: fuera del ancho del torso (mitad de torso + mitad de brazo)
  armLeft.position.set(0.25, 0.05, 0);
  personCharacter.add(armLeft);

  const armRight = new THREE.Mesh(armGeometry, armMaterial);
  armRight.position.set(-0.25, 0.05, 0);
  personCharacter.add(armRight);

  // --- piernas ---
  // ancho, alto, profundidad
  const legGeometry = new THREE.BoxGeometry(0.15, 0.5, 0.15);
  const legMaterial = new THREE.MeshToonMaterial({
    color: colorsPerson.clothes,
    gradientMap: gradientMap,
  });

  const legLeft = new THREE.Mesh(legGeometry, legMaterial);
  // x: separación pequeña respecto al centro (piernas más juntas que los brazos)
  // y: la pierna cuelga desde la base del torso (y = -0.3) hacia abajo.
  // Su centro debe quedar medio «legGeometry» por debajo de ese borde:
  // -0.3 (base del torso) - 0.25 (mitad de altura de la pierna) = -0.55
  legLeft.position.set(0.1, -0.55, 0);
  personCharacter.add(legLeft);

  const legRight = new THREE.Mesh(legGeometry, legMaterial);
  legRight.position.set(-0.1, -0.55, 0);
  personCharacter.add(legRight);

  // --- calzado ---
  // ancho, alto, profundidad
  const shoeGeometry = new THREE.BoxGeometry(0.15, 0.1, 0.15);
  const shoeMaterial = new THREE.MeshToonMaterial({
    color: colorsPerson.shoes,
    gradientMap: gradientMap,
  });

  const shoeLeft = new THREE.Mesh(shoeGeometry, shoeMaterial);
  // el calzado es relativo a la pierna
  // y: mitad de la altura de la pierna (-0.25) - mitad de la altura del calzado (0.05) = -0.3
  shoeLeft.position.set(0, -0.3, 0);
  legLeft.add(shoeLeft);

  const shoeRight = new THREE.Mesh(shoeGeometry, shoeMaterial);
  shoeRight.position.set(0, -0.3, 0);
  legRight.add(shoeRight);

  // piernas y brazos como propiedades del grupo para poder animarlas desde fuera
  personCharacter.legLeft = legLeft;
  personCharacter.legRight = legRight;
  personCharacter.armLeft = armLeft;
  personCharacter.armRight = armRight;
  personCharacter.walkCycle = 0; // controla la fase de la oscilación del caminar

  return personCharacter;
}
