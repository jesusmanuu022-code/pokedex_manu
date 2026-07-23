export interface TipoColor {
  bg: string;
  text: string;
  dot: string;
}

const COLORES_POR_TIPO: Record<string, TipoColor> = {
  normal: { bg: '#e8e8d8', text: '#6d6d54', dot: '#a8a878' },
  fuego: { bg: '#fde3d3', text: '#a34f11', dot: '#f08030' },
  agua: { bg: '#dbe7fd', text: '#2c4f9e', dot: '#6890f0' },
  eléctrico: { bg: '#fcf3cf', text: '#8a7311', dot: '#f8d030' },
  planta: { bg: '#e2f2d9', text: '#3c6b28', dot: '#78c850' },
  hielo: { bg: '#e0f4f4', text: '#3f7d7d', dot: '#98d8d8' },
  lucha: { bg: '#f7dbd9', text: '#7a1e17', dot: '#c03028' },
  veneno: { bg: '#eeddee', text: '#63285f', dot: '#a040a0' },
  tierra: { bg: '#f4ecd4', text: '#8a7025', dot: '#e0c068' },
  volador: { bg: '#ebe3fb', text: '#5b3f9e', dot: '#a890f0' },
  psíquico: { bg: '#fce0eb', text: '#9e2f57', dot: '#f85888' },
  bicho: { bg: '#eef1d3', text: '#5f6b13', dot: '#a8b820' },
  roca: { bg: '#ece4cd', text: '#6b5c1f', dot: '#b8a038' },
  fantasma: { bg: '#e3ddec', text: '#42305f', dot: '#705898' },
  dragón: { bg: '#e2d9fc', text: '#43229e', dot: '#7038f8' },
  siniestro: { bg: '#e2ddd8', text: '#453a30', dot: '#705848' },
  acero: { bg: '#e6e6ee', text: '#54546b', dot: '#b8b8d0' },
  hada: { bg: '#fbdfe6', text: '#9e4f5f', dot: '#ee99ac' },
};

const COLOR_DEFECTO: TipoColor = { bg: '#ececec', text: '#5f5f5f', dot: '#9e9e9e' };

export function colorPorTipo(tipo: string): TipoColor {
  return COLORES_POR_TIPO[tipo?.toLowerCase().trim()] ?? COLOR_DEFECTO;
}
