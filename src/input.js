/**
 * Paseo veraniego
 * ----------------
 * Gestiona el estado de las teclas pulsadas en cada momento.
 *
 * Responsabilidades:
 * - Escuchar eventos de teclado.
 * - Mantener actualizado un registro de qué teclas están activas.
 */

export const keysPressed = {};

window.addEventListener("keydown", (event) => {
  keysPressed[event.code] = true;
});

window.addEventListener("keyup", (event) => {
  keysPressed[event.code] = false;
});
