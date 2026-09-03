/**
 * Paseo veraniego
 * ----------------
 * Crea el personaje «Cat» como grupo de piezas geométricas.
 *
 * Responsabilidades:
 * - Construir y devolver un THREE.Group con las piezas del personaje.
 */

import * as THREE from "three";

export function createCatCharacter(colorsCat, gradientMap) {
  const catCharacter = new THREE.Group();

  // --- cuerpo ---
  // ancho, alto, profundidad (más ancho que alto, orientado horizontalmente)
  const bodyGeometry = new THREE.BoxGeometry(0.5, 0.25, 0.25);
  const bodyMaterial = new THREE.MeshToonMaterial({
    color: colorsCat.fur,
    gradientMap: gradientMap,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);

  catCharacter.add(body);

  // --- cabeza ---
  // ancho, alto, profundidad
  const headGeometry = new THREE.BoxGeometry(0.22, 0.22, 0.22);
  const headMaterial = new THREE.MeshToonMaterial({
    color: colorsCat.fur,
    gradientMap: gradientMap,
  });
  const head = new THREE.Mesh(headGeometry, headMaterial);

  // x: la cabeza se coloca al frente del cuerpo (borde frontal, x = 0.25),
  // desplazada medio «headGeometry» más hacia fuera
  // y: ligeramente por encima del centro del cuerpo, ya que el cuello del gato eleva la cabeza un poco
  head.position.set(0.36, 0.08, 0);
  catCharacter.add(head);

  // --- orejas ---
  // radio, altura, segmentos radiales (4 = base cuadrada, aspecto de pirámide/triángulo)
  const earGeometry = new THREE.ConeGeometry(0.06, 0.12, 4);
  const earMaterial = new THREE.MeshToonMaterial({
    color: colorsCat.fur,
    gradientMap: gradientMap,
  });

  const earLeft = new THREE.Mesh(earGeometry, earMaterial);
  // x: misma posición que la cabeza (las orejas están arriba, no desplazadas en X)
  // y: sobre el borde superior de la cabeza (cabeza y=0.08, mitad altura=0.11 -> borde=0.19),
  //    más medio alto de la oreja (0.12/2=0.06)
  // z: hacia uno de los lados de la cabeza
  earLeft.position.set(0.36, 0.25, 0.07);
  catCharacter.add(earLeft);

  const earRight = new THREE.Mesh(earGeometry, earMaterial);
  earRight.position.set(0.36, 0.25, -0.07);
  catCharacter.add(earRight);

  // --- patas ---
  // ancho, alto, profundidad
  const legGeometry = new THREE.BoxGeometry(0.08, 0.2, 0.08);
  const legMaterial = new THREE.MeshToonMaterial({
    color: colorsCat.fur,
    gradientMap: gradientMap,
  });

  // pata delantera izquierda
  const legFrontLeft = new THREE.Mesh(legGeometry, legMaterial);
  // x: hacia el frente del cuerpo (mismo signo que la cabeza), algo por dentro del borde
  // y: cuelga desde la base del cuerpo hacia abajo
  // z: hacia un lado
  legFrontLeft.position.set(0.18, -0.225, 0.08);
  catCharacter.add(legFrontLeft);

  // pata delantera derecha
  const legFrontRight = new THREE.Mesh(legGeometry, legMaterial);
  legFrontRight.position.set(0.18, -0.225, -0.08);
  catCharacter.add(legFrontRight);

  // pata trasera izquierda
  const legBackLeft = new THREE.Mesh(legGeometry, legMaterial);
  legBackLeft.position.set(-0.18, -0.225, 0.08);
  catCharacter.add(legBackLeft);

  // pata trasera derecha
  const legBackRight = new THREE.Mesh(legGeometry, legMaterial);
  legBackRight.position.set(-0.18, -0.225, -0.08);
  catCharacter.add(legBackRight);

  // --- cola ---
  // ancho, alto, profundidad (alargada en el eje X antes de rotar)
  const tailGeometry = new THREE.BoxGeometry(0.3, 0.06, 0.06);
  const tailMaterial = new THREE.MeshToonMaterial({
    color: colorsCat.fur,
    gradientMap: gradientMap,
  });
  const tail = new THREE.Mesh(tailGeometry, tailMaterial);

  // x: pegada al borde trasero del cuerpo (cálculo exacto: -0.25 - 0.15 = -0.4);
  // se ajustó a -0.385 para un ligero solape visual con el cuerpo
  tail.position.set(-0.385, 0.175, 0);
  tail.rotation.z = -Math.PI / 6; // inclinación sutil hacia arriba
  catCharacter.add(tail);

  // --- ojos ---
  const eyeGeometry = new THREE.PlaneGeometry(0.04, 0.04);
  const eyeMaterial = new THREE.MeshToonMaterial({
    color: colorsCat.eyes,
    gradientMap: gradientMap,
  });

  const eyeLeft = new THREE.Mesh(eyeGeometry, eyeMaterial);
  // x: pegado a la cara frontal de la cabeza, ligeramente por delante para evitar z-fighting
  // y: a la altura de la cabeza (0.08), un poco por encima de su centro
  // z: separación pequeña a cada lado
  eyeLeft.position.set(0.49, 0.13, 0.06);
  // los planos por defecto miran hacia +Z; aquí la cara mira hacia +X,
  // así que hay que rotar el plano 90° sobre el eje Y para que quede orientado correctamente
  eyeLeft.rotation.y = Math.PI / 2;
  catCharacter.add(eyeLeft);

  const eyeRight = new THREE.Mesh(eyeGeometry, eyeMaterial);
  eyeRight.position.set(0.49, 0.13, -0.06);
  eyeRight.rotation.y = Math.PI / 2;
  catCharacter.add(eyeRight);

  // --- nariz ---
  const noseGeometry = new THREE.PlaneGeometry(0.03, 0.03);
  const noseMaterial = new THREE.MeshToonMaterial({
    color: colorsCat.nose,
    gradientMap: gradientMap,
  });
  const nose = new THREE.Mesh(noseGeometry, noseMaterial);

  // x: mismo criterio que los ojos (pegada a la cara, ligeramente por delante)
  // y: por debajo de los ojos (0.13)
  // z: centrada
  nose.position.set(0.49, 0.08, 0);
  nose.rotation.y = Math.PI / 2; // misma rotación que los ojos
  catCharacter.add(nose);

  return catCharacter;
}
