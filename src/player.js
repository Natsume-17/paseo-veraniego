/**
 * Paseo veraniego
 * ----------------
 * Gestiona el movimiento y la física del personaje jugador.
 *
 * Responsabilidades:
 * - Mover al personaje en horizontal según las acciones del jugador (input.js).
 * - Aplicar la gravedad durante el salto, la caída y el aterrizaje de persona y gato.
 * - Gestionar el salto (solo persona y gato).
 * - Mover el dron en vertical dentro de sus límites de altura.
 * - Gestionar el agachado en cualquier superficie (solo persona).
 * - Inicializar parámetros del personaje.
 * - Gestionar los límites de la escena.
 */

import { isActionPressed } from "./input.js";

// main.js decide a quién mover y a qué velocidad; esta función solo lo aplica
export function moveHorizontally(character, speed) {
  if (isActionPressed("left")) {
    character.position.x -= speed;
  }
  if (isActionPressed("right")) {
    character.position.x += speed;
  }
}

// --- gravedad ---
export function applyGravity(character, gravity) {
  // evita que el dron sea afectado por la gravedad
  if (character.verticalVelocity === undefined) {
    return;
  }

  // si está por encima de su suelo actual, cuenta como en el aire
  if (character.position.y > character.groundY) {
    character.isJumping = true; // así jump() no permite doble salto mientras cae
  }
  // aplica la gravedad al personaje mientras salta y en la caída
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
}

// --- salto ---
export function jump(character, characterType) {
  // solo saltan persona y gato, y solo si no están ya en el aire ni agachados
  if (
    characterType !== "drone" &&
    !character.isJumping &&
    !isActionPressed("down")
  ) {
    character.verticalVelocity = 0.15; // impulso inicial hacia arriba
    character.isJumping = true;
  }
}

// --- dron ---
// límites de altura del dron (para no subir/bajar sin límite)
const droneMinY = 0.5;
const droneMaxY = 2.5;

export function moveVertically(character, speed) {
  if (isActionPressed("up")) {
    if (character.position.y < droneMaxY) {
      character.position.y += speed;
    }
  }
  if (isActionPressed("down")) {
    if (character.position.y > droneMinY) {
      character.position.y -= speed;
    }
  }
}

// --- inicialización ---
export function initPhysics(character, groundY, characterType) {
  // para que no se hunda en el suelo
  character.groundY = groundY;
  character.position.y = groundY;

  // solo persona y gato saltan
  // el early return de applyGravity() excluye al dron,
  // ya que no tiene verticalVelocity
  if (characterType === "person" || characterType === "cat") {
    character.verticalVelocity = 0;
    character.isJumping = false;
  }
}

// --- agachado ---
const crouchScale = 0.6; // reduce la altura al 60 %

export function crouch(character, startY) {
  // mientras salta no debe cambiar la escala del personaje
  if (character.isJumping) {
    return;
  }

  if (isActionPressed("down")) {
    character.scale.y = crouchScale;
    // los pies deben seguir en el suelo
    character.position.y = character.groundY - startY + startY * crouchScale;
  } else {
    character.scale.y = 1;
    character.position.y = character.groundY;
  }
}

// --- límites de la escena ---
export function applyLimits(character, minX, maxX) {
  // el techo (maxX) se aplica con min y el suelo (minX) con max
  // al combinarlas recortan un rango entre los dos límites
  character.position.x = Math.max(minX, Math.min(maxX, character.position.x));
}
