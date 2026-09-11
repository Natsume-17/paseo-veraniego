/**
 * Paseo veraniego
 * ----------------
 * Pantalla de título: selección de personaje antes de iniciar la exploración.
 *
 * Responsabilidades:
 * - Mostrar el menú inicial dentro de #app.
 * - Capturar la elección de personaje del usuario.
 * - Notificar la elección mediante un callback, sin conocer nada de Three.js.
 */

export function showTitleScreen(onCharacterSelected) {
  let selectedCharacter = "person"; // valor por defecto

  // referencia el div donde vive la app
  const app = document.getElementById("app");

  app.innerHTML = `
    <div id="title-screen">
      <h1>Paseo veraniego</h1>
      <div id="character-options">
        <button data-character="person">Persona</button>
        <button data-character="cat">Gato</button>
        <button data-character="drone">Dron</button>
      </div>
      <button id="explore-button">Explora</button>
    </div>
  `;

  // obtiene TODOS los botones de personaje
  const characterButtons = document.querySelectorAll(
    "#character-options button",
  );

  characterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // lee el atributo data-character de este botón concreto
      selectedCharacter = button.getAttribute("data-character");

      // recorre todos los botones para quitar la clase "selected"
      characterButtons.forEach((btn) => btn.classList.remove("selected"));

      // añade la clase solo al botón que disparó el evento (el pulsado)
      button.classList.add("selected");
    });
  });

  document.getElementById("explore-button").addEventListener("click", () => {
    // función a que se llama para iniciar la exploración, pasando el personaje seleccionado
    onCharacterSelected(selectedCharacter);
  });
}
