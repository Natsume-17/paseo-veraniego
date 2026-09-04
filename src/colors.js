/**
 * Paseo veraniego
 * ----------------
 * Paleta de colores centralizada para personajes, edificios, materiales y luces de la escena 3D.
 */

const colors = {
  // entorno
  sky: 0x7ec8e3, // cielo diurno
  sea: 0x2a9d8f, // verde agua
  seaDeep: 0x1b6f75, // mar profundo/sombra del agua
  // luces
  sun: 0xffb703, // sol, luz ambiental cálida
  sunset: 0xfb8500, // atardecer, acentos de luz
  // vegetación
  leaf: 0x588157, // verde de la vegetación
  leafDark: 0x3a5a40, // sombra de la vegetación
  // materiales
  foam: 0xf1faee, // espuma, nubes, blancos
  sand: 0xedc9a0, // arena de la playa
  stone: 0x6c757d, // piedra, detalles grises - faro, caminos
};

const colorsLighthouse = {
  body: 0xf1faee, // blanco del faro
  roof: 0xe63946, // rojo del tejado
  door: 0x6c757d, // gris de la puerta
  window: 0x264653, // azul oscuro de la ventana
  light: colors.sun, // reutiliza el mismo amarillo cálido del sol
};

const colorsPerson = {
  skin: 0xf4a261,
  hair: 0x264653,
  clothes: 0x2a9d8f,
  shoes: 0x264653,
  eyes: 0x264653,
  mouth: 0xe76f51,
};

const colorsCat = {
  fur: 0x264653, // color principal del pelaje para cuerpo, cabeza, orejas, patas y cola
  furLight: 0x588157, // color secundario del pelaje para detalles
  eyes: 0xe9c46a,
  nose: 0xe76f51,
};

const colorsDrone = {
  body: 0x264653, // color principal del cuerpo/núcleo
  arms: colors.stone, // reutiliza el gris piedra para los brazos
  propeller: 0x2a9d8f, // color de las hélices
  light: colors.sun, // reutiliza el mismo amarillo cálido del sol
};

export { colors, colorsLighthouse, colorsPerson, colorsCat, colorsDrone };
