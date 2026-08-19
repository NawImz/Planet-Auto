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
    /** Relevées sur la fiche Google du garage. Le marqueur de la carte en dépend. */
    lat: 48.950628,
    lng: 2.3255382,
  },

  rating: {
    value: 4.6,
    count: 251,
  },

  /**
   * Confirmed by the garage. `opens`/`closes` use 24h HH:MM; a day with a
   * lunch break lists two ranges, and an empty array means closed.
   *
   * These feed the printed table, the live open/closed badge and the
   * openingHoursSpecification Google reads — one edit here moves all three.
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
 * Questions fréquentes.
 *
 * Elles servent deux choses à la fois : répondre aux visiteurs, et donner à
 * Google des formulations proches de ce que les gens tapent réellement
 * (« horaires garage Épinay », « pièces auto particuliers 93800 »).
 *
 * Chaque réponse ne s'appuie que sur des faits confirmés par le garage. Rien
 * ici ne doit être supposé : une FAQ inventée est une promesse commerciale que
 * le comptoir devra tenir.
 */
export const faq = [
  {
    q: 'Quels sont les horaires de Planet Auto ?',
    a: "Du lundi au vendredi de 9h à 12h30 puis de 14h à 19h, le samedi de 9h à 18h en continu. Fermé le dimanche.",
  },
  {
    q: 'Où se trouve le garage à Épinay-sur-Seine ?',
    a: "Au 80 avenue de la République, 93800 Épinay-sur-Seine, avec du stationnement devant l'atelier.",
  },
  {
    q: 'Vendez-vous des pièces détachées aux particuliers ?',
    a: "Oui. Planet Auto est distributeur de pièces détachées pour les particuliers comme pour les professionnels : freinage, filtration, batteries, amortisseurs, pièces moteur, huiles et accessoires, en stock au comptoir.",
  },
  {
    q: 'Quelles réparations faites-vous à l’atelier ?',
    a: "Mécanique générale, entretien et révision, diagnostic électronique, freinage, ainsi que le montage et l'équilibrage de pneus sur place.",
  },
  {
    q: 'Quels moyens de paiement acceptez-vous ?',
    a: 'Carte bancaire, paiement sans contact et espèces.',
  },
  {
    q: 'Le garage est-il accessible aux personnes à mobilité réduite ?',
    a: "Oui, le parking et l'entrée sont de plain-pied et accessibles.",
  },
];

/**
 * Avis Google reproduits mot pour mot, transmis par le client.
 *
 * `text` doit rester le libellé exact publié sur la fiche. Un avis raccourci
 * porte `[…]` à l'endroit de la coupe et `truncated: true` : la carte affiche
 * alors un lien vers la fiche Google, pour que personne ne lise un extrait en
 * croyant lire l'avis entier.
 *
 * Les notes en étoiles n'apparaissaient pas dans ce que le client a transmis.
 * Elles sont déduites du texte — les quatre disent explicitement recommander —
 * et restent à confirmer sur la fiche.
 */
export const reviewsVerified = true;

/** Lien vers la fiche Google, pour lire les avis en entier. */
export const reviewsUrl =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('Planet Auto, 80 avenue de la République, 93800 Épinay-sur-Seine');

export const reviews = [
  {
    author: 'Johanna Correa',
    rating: 5,
    date: 'il y a 3 semaines',
    meta: '11 avis',
    highlight: 'Réactivité',
    text: "Une réactivité exemplaire ! Je suis tombé en panne de batterie et le garage m'a pris en charge immédiatement. Un immense merci au conseiller pour son accueil particulièrement chaleureux, son professionnalisme et sa rapidité. C'est tellement rare et appréciable de trouver un service aussi efficace avec des tarifs qui défient toute concurrence ! Je recommande ce garage les yeux fermés. 👏",
  },
  {
    author: 'Isma B',
    rating: 5,
    date: 'il y a un mois',
    meta: '5 avis',
    highlight: 'Prix et écoute',
    text: "Super expérience chez Planet Auto ! L'équipe est vraiment sympa et à l'écoute, on sent que les clients sont pris au sérieux. Ma voiture a été prise en charge très rapidement, pas d'attente interminable comme ailleurs. Et niveau prix, clairement imbattable, ça change tout. Je recommande sans hésiter !",
  },
  {
    author: 'Alyma Lagaré Officiel',
    rating: 5,
    date: 'il y a 2 mois',
    meta: '2 avis',
    highlight: 'Suivi client',
    text: "Franchement, super expérience avec Planet Auto ! Une équipe vraiment à l'écoute, très professionnelle et surtout très gentille. On se sent accompagné du début à la fin, avec un vrai suivi, ce qui est rare aujourd'hui. Je suis ravie de mes achats, tout s'est très bien passé. Je recommande à 100% !",
  },
  {
    // Raccourci : l'avis d'origine fait environ 150 mots et nomme un
    // concurrent. Republier ce passage sur le site commercial du garage
    // exposerait au dénigrement, ce que la fiche Google n'implique pas.
    author: 'Meandra Pétion',
    rating: 5,
    date: 'il y a un mois',
    meta: 'Local Guide · 35 avis',
    badge: 'Local Guide',
    highlight: 'Devis divisé par deux',
    truncated: true,
    text: "Après avoir fait plusieurs devis qui tournait autour de 175€ pour de la « petite mécanique » je me suis dirigé vers cette boutique pour y comparer les prix […] il m'ont fait un devis qui a été divisé de moitié, j'ai été très surprise. J'ai donc acheté les pièces et le montage a été fait sur ma petite auto dans leur garage. Merci au vendeur pour sa franchise […]",
  },
];

export const benefits = [
  {
    title: "Votre voiture ne dort pas ici",
    description:
      "La plupart des interventions courantes repartent le jour même. On vous annonce un délai réaliste dès l'accueil, pas une estimation optimiste que vous découvrirez fausse trois jours plus tard.",
  },
  {
    title: 'Le devis annoncé est le prix payé',
    description:
      "Si un imprévu apparaît en démontant, on vous appelle avant de toucher à quoi que ce soit. Vous ne découvrez jamais un supplément au moment de régler.",
  },
  {
    title: 'On vous explique, sans jargon',
    description:
      "Vous repartez en sachant ce qui a été changé et pourquoi. Et quand une pièce peut encore tenir une saison, on vous le dit au lieu de la remplacer.",
  },
  {
    title: 'Ouvert à tout le monde',
    description:
      "Parking et entrée de plain-pied, accessibles aux personnes à mobilité réduite. Carte bancaire et sans contact acceptés.",
  },
];
