/**
 * Everything the site still needs from the client, in one place.
 *
 * Kept as data rather than markup so the copy can be edited without touching
 * the page, and so the count in the header cannot drift out of step with the
 * list underneath it.
 */

export const intro =
  "Le site est construit, testé et prêt à publier. Il reste des informations que je ne peux ni deviner ni inventer — soit parce qu'elles appartiennent au garage, soit parce que les inventer serait illégal. Voici la liste exacte, dans l'ordre où elle bloque.";

export const sections = [
  {
    level: 'bloquant',
    chip: 'Bloquant',
    title: 'Sans ça, on ne peut pas publier',
    lead: 'Trois points, dont deux engagent une responsabilité juridique.',
    items: [
      {
        title: 'Le texte exact de 4 avis Google',
        ask: "Ouvrir la fiche Google du garage et me copier **mot pour mot** quatre avis, avec le nom d'auteur tel qu'il s'affiche et le nombre d'étoiles. Idéalement un sur la réactivité, un sur l'accueil, un sur les prix, un sur le stock de pièces.",
        why: "les textes actuellement en place sont des gabarits **que j'ai écrits pour caler la mise en page**. Isma B. et Johanna Correa n'ont jamais écrit ces phrases.",
        blocked:
          "publier de faux avis, ou attribuer des propos inventés à des clients nommés, est une pratique commerciale trompeuse (art. L121-2 du Code de la consommation), passible d'une sanction DGCCRF. Un bandeau d'avertissement reste affiché sur le site tant que ce n'est pas corrigé.",
      },
      {
        title: 'Un canal pour recevoir les messages écrits',
        ask: "Le **numéro WhatsApp** du garage (celui que le patron consulte vraiment), ou à défaut une **adresse e-mail**. Ou me dire que le téléphone suffit, et on n'affiche rien d'autre.",
        why: "le site n'a pas de serveur, donc pas de boîte de réception. Avec un numéro WhatsApp, le formulaire compose le message et l'ouvre directement sur le téléphone du garagiste — c'est ce qui marche le mieux pour ce métier.",
        blocked:
          "le bloc « écrire » reste un simple renvoi vers le téléphone. Ce n'est pas cassé, mais on perd les gens qui préfèrent écrire, notamment le soir.",
      },
      {
        title: 'Les informations légales de la société',
        ask: '**Forme juridique** (SARL, SAS, auto-entrepreneur…), **numéro SIRET**, **n° de TVA intracommunautaire**, et le **nom du directeur de la publication** (en général le gérant). Tout est sur le Kbis.',
        why: 'ces mentions sont obligatoires sur tout site professionnel français (art. 6-III de la loi LCEN n°2004-575).',
        blocked:
          'la page « Mentions légales » existe mais affiche des `[À COMPLÉTER]`. Le site est en infraction dès sa mise en ligne.',
      },
    ],
  },
  {
    level: 'important',
    chip: 'Important',
    title: 'À vérifier avant de communiquer dessus',
    lead: "Le site fonctionne sans, mais avec des données potentiellement fausses — et certaines partent directement dans la fiche Google.",
    items: [
      {
        title: 'Confirmation des horaires',
        ask: 'Valider ou corriger&nbsp;: **Lun–Ven 9h–12h30 puis 14h–19h**, **Samedi 9h–18h**, **Dimanche fermé**. Et me signaler les fermetures annuelles s\'il y en a.',
        why: "ces horaires alimentent trois choses à la fois : le tableau affiché, le badge « Ouvert / Fermé » en temps réel, et le balisage que Google lit pour sa fiche. Une erreur se propage partout.",
      },
      {
        title: 'Les coordonnées GPS exactes',
        ask: "Sur Google Maps, clic droit sur le marqueur du garage → copier les deux nombres. Ou simplement me confirmer que la fiche Google Maps du garage est correctement placée.",
        why: "les coordonnées actuelles sont **approximatives**, je n'ai pas pu les géocoder. Elles ne servent qu'à centrer la carte — les boutons « Itinéraire » et « Waze », eux, marchent déjà car ils cherchent par nom et adresse.",
      },
      {
        title: 'Validation des marques distribuées',
        ask: "J'ai relevé sur l'auvent&nbsp;: Valeo, Bosch, Monroe, Purflux, Ferodo, Brembo, Bosal, Moog, Gabriel, Delphi. À confirmer, compléter ou élaguer.",
        why: "une enseigne peut être plus ancienne que la liste réelle des fournisseurs. Ces noms sont un argument fort pour les clients professionnels, autant qu'ils soient exacts.",
      },
      {
        title: 'Le nom de domaine',
        ask: "Quel domaine acheter&nbsp;? J'ai mis `planet-auto-epinay.fr` en attendant. Me dire aussi si le garage possède déjà un domaine ou une ancienne adresse de site.",
        why: "le domaine est écrit dans les balises que Google utilise pour identifier le site. Le changer après coup oblige à tout republier et brouille le référencement le temps que Google suive.",
      },
      {
        title: "L'hébergeur",
        ask: 'Me dire où on publie — je recommande **Netlify** ou **Vercel**, tous deux gratuits pour ce type de site. Il me faudra ensuite la raison sociale et l\'adresse de l\'hébergeur pour les mentions légales.',
        why: "l'identité de l'hébergeur fait partie des mentions obligatoires, au même titre que celles de l'éditeur.",
      },
    ],
  },
  {
    level: 'utile',
    chip: 'Utile',
    title: 'Ce qui rendrait le site nettement meilleur',
    lead: 'Rien de bloquant ici, mais chacun de ces points a un vrai effet sur la confiance.',
    items: [
      {
        title: 'De meilleures photos',
        ask: "Trois ou quatre photos prises au téléphone en plein jour&nbsp;: **l'atelier avec un véhicule sur le pont**, **le comptoir et les rayons**, et si le patron est d'accord, **l'équipe**. Cadrage horizontal, sans flash.",
        why: "les photos actuelles viennent de la rue et de Google. Celle de l'intérieur est sombre et encombrée. Une photo d'équipe est ce qui fait le plus basculer un visiteur hésitant sur un site de garage.",
      },
      {
        title: 'Réseaux sociaux',
        ask: "Les liens Facebook, Instagram ou Google Business si le garage en a. Sinon on n'affiche rien — mieux vaut aucun lien qu'un lien vers une page morte.",
        why: 'le footer prévoit déjà les icônes, elles restent masquées tant que la liste est vide.',
      },
      {
        title: 'Les prestations à mettre en avant',
        ask: "J'ai supposé&nbsp;: réparation, entretien, pièces détachées, diagnostic, freinage, pneus. Y a-t-il une **spécialité** du garage, une marque de véhicule qu'il maîtrise particulièrement, ou une prestation rentable à pousser&nbsp;?",
        why: "aujourd'hui les six prestations sont présentées à égalité. Savoir laquelle rapporte le plus permettrait de la remonter et d'orienter les appels vers elle.",
      },
      {
        title: 'Précisions commerciales',
        ask: "Le garage fait-il&nbsp;: devis gratuit&nbsp;? véhicule de courtoisie&nbsp;? reprise/dépôt&nbsp;? paiement en plusieurs fois&nbsp;? garantie sur les pièces posées&nbsp;? tarifs remisés pour les professionnels&nbsp;?",
        why: "chacun de ces points est un argument que les concurrents affichent et qui manque ici. Le « véhicule de courtoisie » en particulier lève un frein majeur.",
      },
    ],
  },
];
