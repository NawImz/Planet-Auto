/**
 * Single source of truth for everything client-specific.
 *
 * To reuse this template for another garage, this is the only file that has to
 * change (plus the photos in src/assets/ and the palette tokens in
 * src/styles/global.css). No component reads a hardcoded phone number, address
 * or opening hour.
 */

export const SITE_URL = 'https://planet-auto-epinay.fr';

export const business = {
  name: 'Planet Auto',
  tagline: 'Réparation automobile & pièces détachées',
  legalName: 'Planet Auto',
  city: 'Épinay-sur-Seine',

  /** Displayed as-is. `tel` is the href, digits only with country code. */
  phone: {
    display: '01 49 98 14 20',
    tel: '+33149981420',
  },

  address: {
    street: '80 avenue de la République',
    postalCode: '93800',
    city: 'Épinay-sur-Seine',
    country: 'FR',
    /** Approximate — see README, to be replaced with the exact Places value. */
    lat: 48.9536,
    lng: 2.3175,
  },

  rating: {
    value: 4.6,
    count: 251,
  },

  /**
   * `opens`/`closes` use 24h HH:MM. A day with two ranges (lunch break) lists
   * two entries. An empty array means closed.
   */
  hours: [
    { day: 'Lundi', dayCode: 'Mo', ranges: [['09:00', '12:30'], ['14:00', '19:00']] },
    { day: 'Mardi', dayCode: 'Tu', ranges: [['09:00', '12:30'], ['14:00', '19:00']] },
    { day: 'Mercredi', dayCode: 'We', ranges: [['09:00', '12:30'], ['14:00', '19:00']] },
    { day: 'Jeudi', dayCode: 'Th', ranges: [['09:00', '12:30'], ['14:00', '19:00']] },
    { day: 'Vendredi', dayCode: 'Fr', ranges: [['09:00', '12:30'], ['14:00', '19:00']] },
    { day: 'Samedi', dayCode: 'Sa', ranges: [['09:00', '18:00']] },
    { day: 'Dimanche', dayCode: 'Su', ranges: [] },
  ],

  paymentAccepted: ['Carte bancaire', 'Sans contact', 'Espèces'],
  currenciesAccepted: 'EUR',
  priceRange: '€€',

  accessibility: {
    parking: true,
    entrance: true,
  },

  /** Left empty until the client confirms they have accounts. */
  social: [],
};

export const services = [
  {
    slug: 'reparation',
    title: 'Réparation',
    description:
      "Mécanique générale, de la petite intervention à la remise en état moteur. Devis avant travaux, aucune surprise à la facture.",
    icon: 'wrench',
  },
  {
    slug: 'entretien',
    title: 'Entretien & révision',
    description:
      'Vidange, filtres, courroie de distribution, contrôle des niveaux. Le suivi qui évite la panne coûteuse.',
    icon: 'oil',
  },
  {
    slug: 'pieces',
    title: 'Pièces détachées',
    description:
      'Stock permanent en freinage, filtration, batteries, amortisseurs, pièces moteur, huiles et accessoires. Particuliers et professionnels.',
    icon: 'gear',
  },
  {
    slug: 'diagnostic',
    title: 'Diagnostic panne',
    description:
      "Lecture de la valise électronique, identification de l'origine réelle du défaut avant d'engager la moindre réparation.",
    icon: 'scan',
  },
  {
    slug: 'freinage',
    title: 'Freinage',
    description:
      'Plaquettes, disques, étriers, liquide de frein. Contrôle complet du circuit et remplacement en atelier le jour même.',
    icon: 'disc',
  },
  {
    slug: 'pneus',
    title: 'Pneus & montage',
    description:
      'Station de montage sur place : montage, équilibrage, permutation et géométrie. Toutes marques.',
    icon: 'tire',
  },
];

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  PLACEHOLDER — NE PAS METTRE EN LIGNE EN L'ÉTAT                           │
 * │                                                                          │
 * │  Les textes ci-dessous sont des EXEMPLES DE MISE EN PAGE. Ils n'ont pas   │
 * │  été écrits par les personnes citées. Les publier tels quels constitue    │
 * │  une pratique commerciale trompeuse (art. L121-2 s. du Code de la         │
 * │  consommation) et expose à une sanction DGCCRF.                           │
 * │                                                                          │
 * │  AVANT PUBLICATION : remplacer chaque `text` par le libellé exact de      │
 * │  l'avis Google correspondant, et chaque `author` par le nom tel qu'il     │
 * │  apparaît sur la fiche. Voir README « Récupérer les vrais avis ».         │
 * │                                                                          │
 * │  Tant que `verified` vaut false, un bandeau d'avertissement s'affiche     │
 * │  sur la section Avis en développement, et le balisage schema.org des      │
 * │  avis est omis (on ne déclare pas de faux avis à Google).                 │
 * └──────────────────────────────────────────────────────────────────────────┘
 */
export const reviewsVerified = false;

export const reviews = [
  {
    author: 'Isma B.',
    rating: 5,
    text: "[TEXTE À REMPLACER PAR L'AVIS GOOGLE RÉEL] Avis mis en avant pour la réactivité de l'équipe.",
    highlight: 'Réactivité',
  },
  {
    author: 'Johanna Correa',
    rating: 5,
    text: "[TEXTE À REMPLACER PAR L'AVIS GOOGLE RÉEL] Avis mis en avant pour la qualité de l'accueil.",
    highlight: 'Accueil',
  },
  {
    author: '[Nom de l’auteur]',
    rating: 5,
    text: '[TEXTE À REMPLACER PAR L’AVIS GOOGLE RÉEL] Avis mis en avant pour les prix et le respect du devis.',
    highlight: 'Prix tenus',
  },
  {
    author: '[Nom de l’auteur]',
    rating: 4,
    text: "[TEXTE À REMPLACER PAR L'AVIS GOOGLE RÉEL] Avis mis en avant pour le stock de pièces et le conseil.",
    highlight: 'Stock & conseil',
  },
];

export const benefits = [
  {
    title: "Votre voiture ne dort pas ici",
    description:
      "La plupart des interventions courantes repartent le jour même. On vous annonce un délai réaliste dès l'accueil, pas une estimation optimiste que vous découvrirez fausse trois jours plus tard.",
    stat: 'Souvent le jour même',
  },
  {
    title: 'Le devis est le prix',
    description:
      "Le montant annoncé avant travaux est celui que vous payez. Si un imprévu apparaît en démontant, on vous appelle avant de toucher à quoi que ce soit.",
    stat: 'Devis avant travaux',
  },
  {
    title: 'On vous explique, en français',
    description:
      "Vous repartez en sachant ce qui a été changé et pourquoi. Et quand une pièce peut encore tenir une saison, on vous le dit au lieu de la remplacer.",
    stat: 'Conseil sans jargon',
  },
  {
    title: 'Accessible à tous',
    description:
      "Parking et entrée de plain-pied, accessibles aux personnes à mobilité réduite. Paiement par carte et sans contact acceptés.",
    stat: 'Parking & entrée PMR',
  },
];
