/**
 * Paseo veraniego
 * ----------------
 * Gestiona el estado de las teclas pulsadas en cada momento.
 *
 * Responsabilidades:
 * - Escuchar eventos de teclado.
 * - Mantener actualizado un registro de qué teclas están activas.
 * - Asociar las acciones a las teclas que las activan.
 */

const keysPressed = {};

// cada acción se asocia a la lista de teclas (event.code) que la activan
const actionKeys = {
  left: ["KeyA", "ArrowLeft"],
  right: ["KeyD", "ArrowRight"],
  up: ["KeyW", "ArrowUp"],
  down: ["KeyS", "ArrowDown"],
};

export function isActionPressed(action) {
  // basta con que ALGUNA de las teclas de esa acción esté pulsada
  return actionKeys[action].some((code) => keysPressed[code]);
}

export function isActionKey(code, action) {
  // tiene que coincidir la tecla pulsada para desatar la acción
  return actionKeys[action].includes(code);
}

window.addEventListener("keydown", (event) => {
  keysPressed[event.code] = true;
});

window.addEventListener("keyup", (event) => {
  keysPressed[event.code] = false;
});
