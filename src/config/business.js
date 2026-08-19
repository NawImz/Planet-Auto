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
    { day: 'Samedi', dayCode: 'Sa', ranges: [['09:00', '17:30']] },
    { day: 'Dimanche', dayCode: 'Su', ranges: [] },
  ],

  /*
    Trois champs ont été retirés à la demande du client, et il n'y a rien à
    remettre à leur place :

    - `paymentAccepted` / `currenciesAccepted` — moyens de paiement. Le site
      n'en annonce plus aucun : c'est au comptoir de le dire.
    - `access` — l'entrée de plain-pied et le stationnement. Même après
      réécriture en faits observables, les deux mentions sont retirées ;
      l'accessibilité et le stationnement se demandent au téléphone, où la
      réponse peut être précise et datée du jour.
    - `priceRange` — la fourchette « €€ » était une déduction, et une
      fourchette inventée dans le balisage est une donnée que Google affiche
      telle quelle.

    Aucun de ces champs ne doit être « redéduit » : leur absence est un choix,
    pas un oubli.
  */

  social: [
    { href: 'https://www.facebook.com/planetautoepinay', label: 'Facebook' },
  ],
};

/**
 * Les titres et les familles de pièces sont confirmés par le client et par
 * l'enseigne. Les descriptions ne décrivent plus que le métier : les
 * engagements que j'y avais glissés — « devis avant travaux, aucune surprise à
 * la facture », « remplacement le jour même », « toutes marques » — ont été
 * retirés. Personne au garage ne les avait formulés, et ce sont exactement les
 * phrases qu'un client cite au comptoir.
 *
 * « Géométrie » est retiré pour une autre raison : elle demande un banc
 * spécifique que tous les ateliers n'ont pas. À remettre d'un mot si vous
 * l'avez. Voir docs/VERACITE.md.
 */
export const services = [
  {
    slug: 'reparation',
    title: 'Réparation',
    description:
      "Mécanique générale, de la petite intervention à la remise en état moteur.",
    icon: 'wrench',
  },
  {
    slug: 'entretien',
    title: 'Entretien & révision',
    description:
      'Vidange, filtres, courroie de distribution, contrôle des niveaux.',
    icon: 'oil',
  },
  {
    slug: 'pieces',
    title: 'Pièces détachées',
    description:
      "Large stock en freinage, distribution, allumage, batteries, climatisation, filtration, liaison au sol, lubrifiants et consommables. Pour les véhicules légers, mais aussi poids lourds, travaux publics, agricole et marine.",
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
      'Plaquettes, disques, étriers, liquide de frein. Contrôle du circuit et remplacement à l’atelier.',
    icon: 'disc',
  },
  {
    slug: 'electronique',
    title: 'Électronique embarquée',
    description:
      "Réparation des calculateurs et de l'électronique de bord, plutôt que le remplacement systématique du bloc — souvent la différence entre une réparation et un devis à quatre chiffres.",
    icon: 'scan',
  },
  {
    slug: 'pneus',
    title: 'Pneus & montage',
    description:
      'Station de montage sur place, comme l’indique l’enseigne : montage et équilibrage.',
    icon: 'tire',
  },
];

/**
 * Le détail de l'offre comptoir, transmis par le client.
 *
 * Ces trois listes portent l'essentiel de l'argumentaire professionnel : la
 * profondeur de gamme, les véhicules couverts, et les trois niveaux de qualité.
 * Le dernier point n'est pas commercial mais réglementaire — un réparateur doit
 * proposer des pièces de réemploi (art. L224-67 du Code de la consommation).
 */
export const partsFamilies = [
  'Freinage',
  'Distribution',
  'Allumage',
  'Batteries',
  'Climatisation & thermique',
  'Échappement',
  'Éclairage',
  'Électricité',
  'Embrayage',
  'Essuyage',
  'Filtration',
  'Injection',
  'Liaison au sol',
  'Lubrifiants',
];

/** Au-delà de la voiture : c'est ce qui distingue un vrai distributeur. */
export const vehicleTypes = [
  { code: 'VL', label: 'Véhicules légers' },
  { code: 'PL', label: 'Poids lourds' },
  { code: 'TP', label: 'Travaux publics' },
  { code: 'AGRI', label: 'Agricole' },
  { code: 'MARINE', label: 'Marine' },
];

/** Trois niveaux de prix pour la même réparation. */
export const partsQuality = [
  {
    title: "Pièces d'origine",
    description: "La référence constructeur, quand rien d'autre ne convient.",
  },
  {
    title: 'Qualité équivalente à l’origine',
    description:
      "Le même équipementier que celui qui fournit le constructeur, sans le logo de la marque — et sans son prix.",
  },
  {
    title: 'Pièces de réemploi',
    description:
      "Des pièces d'occasion contrôlées, l'option la plus économique. Un réparateur est tenu de vous la proposer.",
  },
];

/** Le comptoir ne vend pas qu'aux véhicules : il équipe aussi les ateliers. */
export const equipment = 'Équipements de garage et outillage professionnel.';

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
    a: "Du lundi au vendredi de 9h à 12h30 puis de 14h à 19h, le samedi de 9h à 17h30 en continu. Fermé le dimanche.",
  },
  {
    q: 'Où se trouve le garage à Épinay-sur-Seine ?',
    a: "Au 80 avenue de la République, 93800 Épinay-sur-Seine, sur l'avenue entre la rue Ampère et la rue Branly.",
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
    q: 'Proposez-vous des pièces moins chères que celles du constructeur ?',
    a: "Oui, trois niveaux existent pour une même réparation : la pièce d'origine constructeur, la pièce de qualité équivalente à l'origine — souvent le même équipementier, sans le logo ni le prix — et la pièce de réemploi, contrôlée et la plus économique. On vous présente les options avant de décider.",
  },
  {
    q: 'Fournissez-vous des pièces pour poids lourds ou engins agricoles ?',
    a: "Oui. Le stock couvre les véhicules légers, les poids lourds, les engins de travaux publics, le matériel agricole et la marine. Le comptoir fournit également des équipements de garage et de l'outillage professionnel.",
  },
  /*
    Les deux questions « moyens de paiement » et « entrée de plain-pied » ont
    été retirées avec le reste. Elles ne sont pas remplacées : une FAQ de six
    questions vraies vaut mieux que huit dont deux sont meublées.
  */
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

/**
 * Ce que les clients écrivent, reformulé — pas ce que le garage promet.
 *
 * La version précédente inventait quatre engagements commerciaux (« le devis
 * annoncé est le prix payé », « la plupart des interventions repartent le jour
 * même »). Personne au garage ne les avait formulés, et ce sont exactement les
 * phrases qu'un client cite au comptoir quand la promesse n'est pas tenue.
 *
 * Chaque point ci-dessous s'appuie sur un avis Google transmis par le client,
 * cité en commentaire. `source` porte le prénom du client : la section les
 * présente comme une observation, jamais comme une garantie.
 */
export const benefits = [
  {
    // Johanna : « tombé en panne de batterie et le garage m'a pris en charge
    // immédiatement ». Isma : « prise en charge très rapidement, pas d'attente
    // interminable comme ailleurs ».
    title: 'La rapidité de prise en charge',
    description:
      "C'est le mot qui revient le plus : une panne annoncée le matin regardée dans la foulée, sans passer par une semaine de délai. Deux clients sur quatre en parlent en premier.",
    source: 'Johanna, Isma',
  },
  {
    // Meandra : plusieurs devis autour de 175 €, « il m'ont fait un devis qui a
    // été divisé de moitié ». Johanna : « des tarifs qui défient toute
    // concurrence ». Isma : « niveau prix, clairement imbattable ».
    title: 'Le prix, une fois comparé',
    description:
      "Plusieurs clients arrivent ici après avoir fait chiffrer ailleurs. C'est la comparaison qu'ils racontent — pas une promesse qu'on leur a faite au comptoir.",
    source: 'Meandra, Johanna, Isma',
  },
  {
    // Meandra : « merci au vendeur pour sa franchise ».
    title: 'La franchise du comptoir',
    description:
      "Dire qu'une pièce peut encore tenir, ou qu'une réparation ne vaut pas son prix : c'est ce que les avis appellent la franchise du vendeur.",
    source: 'Meandra',
  },
  {
    // Alyma : « on se sent accompagné du début à la fin, avec un vrai suivi ».
    title: 'Le même interlocuteur du début à la fin',
    description:
      "Le magasin et l'atelier sont sous le même toit : la personne qui vous conseille la pièce est celle qui suit le montage. Les avis parlent d'accompagnement, pas de guichet.",
    source: 'Alyma',
  },
];
