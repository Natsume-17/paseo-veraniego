/**
 * Paseo veraniego
 * ----------------
 * Ajusta el tamaño visual (CSS) del canvas al tamaño de la ventana,
 * manteniendo siempre la relación de aspecto fija del proyecto.
 *
 * Responsabilidades:
 * - Calcular las dimensiones CSS del canvas según la ventana disponible.
 * - Aplicar letterboxing quedando bandas vacías cuando la ventana
 *   no coincide con la relación de aspecto deseada.
 */

/**
 * @param {THREE.WebGLRenderer} renderer - Renderer cuyo elemento canvas se redimensiona.
 * @param {number} ASPECT_RATIO - Relación de aspecto fija que debe mantener el canvas.
 */

export function updateCanvasSize(renderer, ASPECT_RATIO) {
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
