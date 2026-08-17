# Planet Auto — site vitrine

Site vitrine du garage **Planet Auto**, 80 avenue de la République, 93800
Épinay-sur-Seine. Astro + Tailwind + GSAP + Lenis, statique, sans base de
données et sans serveur.

```bash
npm install
npm run dev             # http://localhost:4321
npm run build           # -> dist/
npm run qa              # build + typecheck + 26 tests fonctionnels
npm run preview:single  # aperçu en un seul fichier HTML
```

---

## ⚠️ À faire avant la mise en ligne

### 1. Remettre les mentions légales

**La page a été supprimée à la demande du client pour la phase de test.** Elle
doit être rétablie avant toute mise en ligne : les mentions d'identification de
l'éditeur et de l'hébergeur sont obligatoires (art. 6-III de la loi LCEN
n°2004-575). Il faut la forme juridique, le SIRET, le n° de TVA, le directeur
de la publication, et les coordonnées de l'hébergeur.

L'ancienne page est récupérable dans l'historique git.

### 2. Remplacer le numéro WhatsApp de test

`contact.whatsapp` contient `33767898694`, un numéro fourni pour tester. À
remplacer par la ligne réellement consultée par le garage.

### 3. Confirmer les notes en étoiles des avis

Les quatre avis sont le libellé exact transmis par le client, mais les notes
n'accompagnaient pas les textes : elles sont déduites du contenu (les quatre
disent explicitement recommander) et valent 5. À vérifier sur la fiche Google.

### 4. Vérifier les coordonnées GPS

`business.address.lat` / `.lng` sont **approximatives** — elles n'ont pas pu
être géocodées. Elles ne servent qu'à cadrer la carte et le champ `geo` du
JSON-LD. Les boutons « Itinéraire » et « Waze » n'en dépendent pas : ils
utilisent une requête textuelle qui résout correctement quoi qu'il arrive.

Pour les corriger : fiche Google Maps → clic droit sur le marqueur → copier les
coordonnées.

### 5. Confirmer les horaires et les marques

Les horaires viennent du brief avec la mention « à confirmer ». Ils alimentent
le tableau affiché, le badge « Ouvert / Fermé » **et** le JSON-LD — une erreur
se propage partout, dont dans la fiche Google.

La liste `brands` a été relevée sur l'auvent. Une enseigne peut être plus
ancienne que la liste réelle des fournisseurs : à valider.

---

## Identité visuelle

Tout vient de la devanture, pas d'une charte inventée.

**Le logo** (`src/components/LogoMark.astro`) est le logo officiel du garage,
vectorisé depuis l'original fourni (`brand/logo-source.png`) — spirale acier,
moyeu de jante, anneau orbital cramoisi effilé.

```bash
npm i -D potrace
node scripts/trace-logo.mjs brand/logo-source.png > src/components/LogoMark.astro
npm uninstall potrace
node scripts/preview-logo.mjs logo.png 600            # sur fond clair
node scripts/preview-logo.mjs logo.png 200 '#16232E'  # sur fond sombre
```

Le composant est **généré** : modifier le script ou l'artwork, pas le SVG. Les
deux couleurs sont tracées séparément puis recomposées — vectoriser l'image
d'un seul tenant soudait l'anneau à la spirale à chaque point de contact. Le
`viewBox` est recadré sur le tracé, sinon les marges blanches de l'image
seraient dimensionnées avec le reste.

`potrace` n'est pas une dépendance du projet : il embarque une version de jimp
sous avis de sécurité, et ne sert que ponctuellement quand l'artwork change.

Le mark est **au format paysage** (ratio ≈ 1,71). Le dimensionner en largeur
(`w-12`, `w-16`), jamais avec un utilitaire carré qui rognerait l'anneau. Ses
couleurs passent par `--logo-steel` et `--logo-ring`, relevées dans le footer
pour rester lisibles sur fond sombre.

**La palette** est prise sur l'enseigne : panneau blanc, encre bleu acier,
cramoisi. Sur fond clair un seul rouge suffit — `#C8102E` donne 5,88:1 aussi
bien en texte sur blanc qu'en blanc sur aplat. Le neutre est volontairement
chaud (l'immeuble est en brique et pierre crème), ce qui évite le gris d'écran.

**La bande cramoisie** sous les photos et au-dessus des titres reprend le
bandeau de l'auvent. C'est le seul ornement emprunté, utilisé à la place d'un
sur-titre coloré répété à chaque section.

**Les typographies** sont Archivo (titres, signalétique) et Source Sans 3
(texte courant), auto-hébergées via npm — aucun appel à un CDN de polices.

**Pas de numérotation 01/02/03** dans « Ce qui revient dans les avis » : ces
quatre points ne sont pas une séquence, les numéroter habillerait le contenu
au lieu de le décrire.

## Le bloc message

Il n'y a **pas de serveur** derrière ce site, donc pas de formulaire classique.
Le comportement dépend de `contact` dans `business.js` :

| Configuration | Ce que voit le visiteur |
|---|---|
| `whatsapp: '336…'` *(état actuel)* | Un formulaire qui **compose un message WhatsApp** et l'ouvre sur le téléphone du garage. |
| `email: '…@…'` | Le même formulaire, qui ouvre l'application mail du visiteur, pré-remplie. |
| les deux à `null` | Pas de formulaire : un encart qui renvoie au téléphone et au comptoir. |

Le numéro WhatsApp s'écrit indicatif + numéro, chiffres uniquement, sans `+` ni
espaces : `06 12 34 56 78` devient `33612345678`.

Rien n'est stocké sur le site : le message part depuis l'application du
visiteur. C'est ce qui permet de se passer de serveur, de RGPD lourd et de
tableau de bord que personne n'ouvre.

## Structure

```
src/
  config/business.js   ← toutes les données client
  lib/hours.js         ← formatage horaires + openingHoursSpecification
  layouts/Layout.astro ← <head>, SEO, JSON-LD LocalBusiness
  components/          ← Hero, Services, WhyUs, Reviews, Location, Contact…
  scripts/main.ts      ← GSAP, Lenis, menu, badge ouvert/fermé, composeur
  styles/global.css    ← tokens de design
brand/
  logo-source.png      ← artwork d'origine, source de la vectorisation
scripts/
  trace-logo.mjs       ← vectorise le logo en composant Astro
  preview-logo.mjs     ← rendu PNG du logo
  shoot.mjs            ← captures + audit
  check.mjs            ← tests fonctionnels
  bundle-single-file.mjs ← aperçu autonome en un fichier
```

## Autres choix techniques

**OpenStreetMap plutôt que Google Maps.** Une iframe Google dépose des traceurs
avant tout consentement, ce qui imposerait un bandeau cookies (position CNIL).
OSM n'en dépose pas : le site n'a besoin d'aucun bandeau.

**Aucun appel réseau externe.** Polices auto-hébergées, images converties en
WebP au build. ~270 kB transférés, JS compris.

**Le site fonctionne sans JavaScript.** Les éléments animés au scroll sont
visibles par défaut ; GSAP ne fait que les révéler. `prefers-reduced-motion`
désactive Lenis et toutes les animations.

## Dupliquer pour un autre garage

1. `src/config/business.js` — nom, téléphone, adresse, horaires, note, services,
   avis, marques, canal de contact. Aucun composant ne contient de donnée client
   en dur.
2. `src/assets/` — remplacer les quatre photos (mêmes noms de fichiers).
3. `src/styles/global.css` — le bloc `@theme`. **Revérifier les contrastes** si
   l'accent change : les tests ne vérifient pas les couleurs.
4. `brand/logo-source.png` — déposer le logo du client et relancer
   `scripts/trace-logo.mjs`.

Puis `SITE_URL` en haut de `business.js`, et les mentions légales.

## QA

```bash
npm run qa                                         # typecheck + 26 tests
npm run preview                                    # dans un terminal
npm run qa:shots -- http://localhost:4321 shots    # captures + audit
```

`check.mjs` vérifie les liens `tel:` en E.164, le menu, les ancres, le fait que
rien ne passe sous la barre fixe, le rendu en `reduced-motion` et sans JS, la
validité du JSON-LD, et **l'absence de mots collés** — Astro absorbe le retour
à la ligne avant une expression, ce qui soude silencieusement deux mots
(« détachées àÉpinay »). Ce test a attrapé deux occurrences réelles.

`shoot.mjs` capture en 390 / 820 / 1440 px et signale débordement horizontal,
cibles tactiles sous 44 px (hors liens en ligne, exemptés par WCAG 2.5.5),
ordre des titres, images sans `alt` et reveals bloqués.

Si la version de Playwright ne correspond pas au Chromium installé :

```bash
CHROMIUM_PATH=/chemin/vers/chrome npm run qa:check
```

## Non vérifié dans cet environnement

Le sandbox de développement bloque les hôtes externes (403 sur CONNECT). N'ont
donc pas pu être testés en conditions réelles :

- le rendu de la carte OpenStreetMap (un lien de repli est affiché en dessous) ;
- l'ouverture effective de WhatsApp depuis un mobile ;
- les serveurs MCP HTTP de `.mcp.json` (GitHub, Figma, Vercel, Netlify), qui
  demandent une authentification OAuth au premier lancement.
