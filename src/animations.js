/**
 * Paseo veraniego
 * ----------------
 * Gestiona las animaciones del personaje jugador.
 *
 * Responsabilidades:
 * - Animar las hélices y el parpadeo de la luz indicadora del dron.
 * - Animar las patas y la cola del gato según su estado.
 * - Animar las extremidades de la persona según su estado.
 */

import { isActionPressed } from "./input.js";

// --- dron ---
// frames entre cada parpadeo de la luz (medio segundo a 60 fps)
const blinkInterval = 30;

export function animateDrone(character) {
  // rotación continua de las hélices sobre su eje vertical
  character.propellerRight.rotation.y += 0.3;
  character.propellerLeft.rotation.y += 0.3;

  // incrementa el contador cada frame
  character.blinkCounter++;
  // si alcanza el intervalo, alterna visibilidad y resetea el contador
  if (character.blinkCounter >= blinkInterval) {
    character.indicatorLight.visible = !character.indicatorLight.visible;
    character.blinkCounter = 0;
  }
}

// --- gato ---
export function animateCat(character) {
  if (character.isJumping) {
    // las cuatro patas recogidas hacia el cuerpo, mismo signo (pose simétrica)
    character.legFrontLeft.rotation.z = 0.25;
    character.legBackRight.rotation.z = 0.25;
    character.legFrontRight.rotation.z = 0.25;
    character.legBackLeft.rotation.z = 0.25;
    // cola elevada respecto a su ángulo base (-Math.PI / 6), fija (sin oscilación)
    character.tail.rotation.y = 0.25;
  } else if (isActionPressed("left") || isActionPressed("right")) {
    character.walkCycle += 0.1;
    character.tailCycle += 0.12;
    // patas en patrón diagonal (delantera-izq + trasera-der en fase; delantera-der + trasera-izq en fase opuesta)
    character.legFrontLeft.rotation.z = Math.sin(character.walkCycle) * 0.25;
    character.legBackRight.rotation.z = Math.sin(character.walkCycle) * 0.25;
    character.legFrontRight.rotation.z = -Math.sin(character.walkCycle) * 0.25;
    character.legBackLeft.rotation.z = -Math.sin(character.walkCycle) * 0.25;
    // cola con oscilación más rápida/amplia al caminar
    character.tail.rotation.y = Math.sin(character.tailCycle) * 0.5;
  } else {
    // neutral cuando Cat está activo pero no se mueve
    character.legFrontLeft.rotation.z = 0;
    character.legFrontRight.rotation.z = 0;
    character.legBackLeft.rotation.z = 0;
    character.legBackRight.rotation.z = 0;
    // cola con oscilación lenta y sutil en reposo
    character.tailCycle += 0.04;
    character.tail.rotation.y = Math.sin(character.tailCycle) * 0.25;
  }
}

// --- persona ---
export function animatePerson(character) {
  if (character.isJumping) {
    // salto: piernas recogidas y brazos elevados
    character.legLeft.rotation.x = 0.65;
    character.legRight.rotation.x = 0.65;
    character.armLeft.rotation.x = -0.5;
    character.armRight.rotation.x = -0.5;
  } else if (isActionPressed("left") || isActionPressed("right")) {
    character.walkCycle += 0.04;
    // aplica la oscilación a piernas en fase opuesta entre sí
    character.legLeft.rotation.x = Math.sin(character.walkCycle) * 0.2;
    character.legRight.rotation.x = -Math.sin(character.walkCycle) * 0.2;
    // aplica la oscilación a brazos en fase opuesta a las piernas del mismo lado
    character.armLeft.rotation.x = -Math.sin(character.walkCycle) * 0.2;
    character.armRight.rotation.x = Math.sin(character.walkCycle) * 0.2;
  } else if (isActionPressed("down")) {
    // brazos ligeramente recogidos hacia el cuerpo y piernas rectas (pose de agachado)
    character.armLeft.rotation.x = -0.5;
    character.armRight.rotation.x = -0.5;
    character.legLeft.rotation.x = 0;
    character.legRight.rotation.x = 0;
  } else {
    // neutral: todo a 0
    character.legLeft.rotation.x = 0;
    character.legRight.rotation.x = 0;
    character.armLeft.rotation.x = 0;
    character.armRight.rotation.x = 0;
  }
}
