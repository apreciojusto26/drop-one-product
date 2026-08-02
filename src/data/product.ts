import type { Product } from '@/types/content';

/**
 * Single source of truth for ALL marketing copy, prices, image references,
 * bundle definitions, comparison rows, specs and badges.
 * Sections/islands MUST read from here — never hardcode strings/prices/images.
 */
export const product = {
  brand: 'Cortto',
  name: 'Cortto — Cizalla de cocina 2 en 1',
  tagline: 'El corte perfecto, sin tabla.',
  subtagline: 'Tijera y cuchillo en uno. Cortá directo sobre la olla.',

  commerce: {
    shopifyHandle:
      'usb-mini-galaxy-star-projector-star-with-24-sliding-projection-films-starry-space-atmosphere-nightlight-kid-car-home-decoration',
    // BXGY discount rule is NOT yet configured in Shopify admin — ship false.
    // Only flip to true once a real cart shows discountCents > 0 (see errors.noDiscount below).
    bundleOfferActive: false,
  },

  // Admin's internal option name is "Emitting Color" — NEVER shown to buyers.
  // The 9 values are slide configurations, not colors.
  variantGroupLabel: 'Tipo de proyección',

  errors: {
    network: 'No pudimos conectar con la tienda. Probá de nuevo en unos segundos.',
    soldOut: 'Esta variante está agotada por el momento.',
    expired: 'Tu carrito expiró. Elegí tu opción de nuevo para continuar.',
    noDiscount: 'El total mostrado es el precio final calculado por la tienda.',
    generic: 'Algo salió mal. Probá de nuevo.',
  },

  ratingAverage: 4.8,
  ratingCount: 1243,
  ratingBreakdown: {
    5: 950,
    4: 220,
    3: 50,
    2: 15,
    1: 8,
  },

  badges: ['Envío 24-48h', 'Acero inoxidable', 'Garantía 30 días'],

  trustTicker: [
    'Envío gratis desde 29€',
    'Pago 100% seguro',
    '+1.200 clientes satisfechos',
    'Garantía de 30 días',
    'Acero inoxidable de calidad',
  ],

  offer: {
    durationMinutes: 15,
    label: 'Oferta de lanzamiento termina en',
    expiredLabel: 'La oferta ha finalizado',
  },

  benefits: [
    {
      id: 'dos-en-uno',
      icon: 'knife',
      title: '2 en 1 real',
      text: 'Cuchillo y mini tabla de corte separables en una sola pieza.',
    },
    {
      id: 'traba-seguridad',
      icon: 'lock',
      title: 'Traba de seguridad',
      text: 'Bloqueo rojo que evita aperturas accidentales al guardarlo.',
    },
    {
      id: 'se-cuelga',
      icon: 'hook',
      title: 'Se cuelga solo',
      text: 'Agujero integrado para guardarlo colgado y ahorrar espacio.',
    },
    {
      id: 'acero-inox',
      icon: 'shield',
      title: 'Acero inoxidable',
      text: 'Hoja resistente a la corrosión, corte limpio y duradero.',
    },
  ],

  heroPills: ['Acero inoxidable', 'Se separa en 2 piezas', 'Traba de seguridad'],

  specs: [
    { label: 'Longitud abierta', value: '24,5 cm' },
    { label: 'Hoja', value: '12 cm' },
    { label: 'Mango', value: '12,5 cm' },
    { label: 'Material', value: 'Acero inoxidable + ABS' },
    { label: 'Traba de seguridad', value: 'Sí, incluida' },
    { label: 'Apto para', value: 'Carne, verduras y frutas' },
  ],

  packs: [
    {
      id: 'x1',
      units: 1,
      freeUnits: 0,
      label: 'Pack 1 unidad',
      sublabel: 'Ideal para probar',
      default: false,
      popular: false,
    },
    {
      id: 'x2free1',
      units: 2,
      freeUnits: 1,
      label: 'Pack 2 + 1 GRATIS',
      sublabel: 'El que más se lleva',
      badge: 'Más popular',
      popular: true,
      freeGift: true,
      default: true,
    },
  ],

  gallery: [
    {
      id: 'g1',
      asset: null,
      alt: '[PLACEHOLDER] Cortto sobre fondo claro, vista frontal completa mostrando cuchillo y tabla unidos',
      ratio: '4/5',
      label: 'Vista frontal',
    },
    {
      id: 'g2',
      asset: null,
      alt: '[PLACEHOLDER] Cortto abierto en ángulo, mostrando la hoja de acero inoxidable y la mini tabla',
      ratio: '4/5',
      label: 'Detalle de hoja',
    },
    {
      id: 'g3',
      asset: null,
      alt: '[PLACEHOLDER] Cortto separado en sus dos piezas sobre una mesada de cocina',
      ratio: '4/5',
      label: 'Piezas separadas',
    },
    {
      id: 'g4',
      asset: null,
      alt: '[PLACEHOLDER] Primer plano de la traba de seguridad roja de Cortto',
      ratio: '1/1',
      label: 'Traba de seguridad',
    },
    {
      id: 'g5',
      asset: null,
      alt: '[PLACEHOLDER] Cortto colgado de un gancho de cocina por su agujero integrado',
      ratio: '4/5',
      label: 'Se cuelga solo',
    },
  ],

  steps: [
    {
      step: 1,
      title: 'Cortá directo sobre la tabla integrada',
      text: 'Uno de los brazos incluye una mini tabla de corte: apoyá el alimento y cortá con precisión, sin ensuciar otra superficie.',
      media: {
        asset: 'step-01',
        alt: 'Cortto cortando una zanahoria sobre su mini tabla integrada y verduras dentro de una olla, mostrando su uso multifuncional en cocina',
        ratio: '4/3',
      },
    },
    {
      step: 2,
      title: 'Separalo en dos piezas cuando lo necesites',
      text: 'Con un solo movimiento, el cuchillo y la tabla se separan: usá el cuchillo solo, como un cuchillo de fruta tradicional.',
      media: {
        asset: 'step-02',
        alt: 'Cortto separado en sus dos piezas: el cuchillo de acero inoxidable y la mini tabla de corte, listos para usarse por separado',
        ratio: '4/3',
      },
    },
    {
      step: 3,
      title: 'Compacto, preciso y fácil de guardar',
      text: '24,5 cm abierta, con una hoja de 12 cm y un mango de 12,5 cm: el tamaño justo para cualquier cajón de cocina.',
      media: {
        asset: 'step-03',
        alt: 'Medidas de Cortto: 24,5 centímetros de longitud abierta, hoja de 12 centímetros y mango de 12,5 centímetros',
        ratio: '4/3',
      },
    },
  ],

  comparison: [
    { feature: '2 en 1: cuchillo y tabla en una sola pieza', cortto: true, rival: false },
    { feature: 'Se separa en dos piezas independientes', cortto: true, rival: false },
    { feature: 'Traba de seguridad integrada', cortto: true, rival: false },
    { feature: 'Agujero para colgar', cortto: true, rival: 'Según el modelo' },
    { feature: 'Espacio que ocupa en el cajón', cortto: 'Mínimo', rival: 'Cuchillo + tabla por separado' },
    { feature: 'Acero inoxidable', cortto: true, rival: true },
  ],

  guarantee: {
    days: 30,
    title: 'Garantía de 30 días',
    text: 'Si Cortto no supera tus expectativas, te devolvemos el dinero. Sin vueltas.',
    points: [
      'Devolución simple dentro de los 30 días',
      'Reembolso completo, sin preguntas',
      'Atención al cliente en español',
    ],
  },

  shipping: {
    etaLabel: 'Envío en 24-48h',
    freeOverCents: 2900,
  },

  ugc: [
    { asset: null, alt: '[PLACEHOLDER] Cliente usando Cortto para cortar verduras en su cocina', ratio: '9/16' },
    { asset: null, alt: '[PLACEHOLDER] Cortto sobre una tabla de madera junto a vegetales recién cortados', ratio: '9/16' },
    { asset: null, alt: '[PLACEHOLDER] Detalle de Cortto separado en dos piezas sobre una mesada', ratio: '9/16' },
    { asset: null, alt: '[PLACEHOLDER] Cliente sosteniendo Cortto mostrando su tamaño compacto', ratio: '9/16' },
    { asset: null, alt: '[PLACEHOLDER] Cortto colgado en un organizador de cocina', ratio: '9/16' },
    { asset: null, alt: '[PLACEHOLDER] Primer plano de la hoja de acero inoxidable de Cortto', ratio: '9/16' },
  ],

  cta: {
    primary: 'Comprar ahora',
    sticky: 'Agregar al carrito',
    checkout: 'Finalizar compra',
    pending: 'Agregando...',
    soldOut: 'Agotado',
  },
} as const satisfies Product;
