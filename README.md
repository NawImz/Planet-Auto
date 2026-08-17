# Planet Auto — site vitrine

Site vitrine du garage **Planet Auto**, 80 avenue de la République, 93800
Épinay-sur-Seine. Astro + Tailwind + GSAP + Lenis, statique, sans base de
données et sans serveur.

```bash
npm install
npm run dev             # http://localhost:4321
npm run build           # -> dist/
npm run qa              # build + typecheck + 24 tests fonctionnels
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

### 2. Confirmer les notes en étoiles des avis

Les quatre avis sont le libellé exact transmis par le client, mais les notes
n'accompagnaient pas les textes : elles sont déduites du contenu (les quatre
disent explicitement recommander) et valent 5. À vérifier sur la fiche Google.

### 3. Vérifier les coordonnées GPS

`business.address.lat` / `.lng` sont **approximatives** — elles n'ont pas pu
être géocodées. Elles ne servent qu'à cadrer la carte et le champ `geo` du
JSON-LD. Les boutons « Itinéraire » et « Waze » n'en dépendent pas : ils
utilisent une requête textuelle qui résout correctement quoi qu'il arrive.

Pour les corriger : fiche Google Maps → clic droit sur le marqueur → copier les
coordonnées.

### 4. Valider les marques

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

**Les typographies** sont Archivo (titres), Source Sans 3 (texte courant) et
Oxanium pour le seul wordmark, auto-hébergées via npm — aucun appel à un CDN.

**Le wordmark** reprend la manière dont l'enseigne est peinte : une capitale
initiale agrandie suivie de capitales plus petites, dans une graisse
géométrique carrée, les deux mots dans le même rouge. La police exacte de
l'enseigne n'a pas pu être identifiée depuis une photo et le garage n'a pas de
fichier vectoriel portant le lettrage : Oxanium en est l'approximation libre la
plus proche. Sa couleur passe par `--wordmark`, relevée sur le footer où le
cramoisi de marque ne tient que 2,7:1.

**Pas de numérotation 01/02/03** dans « Ce qui revient dans les avis » : ces
quatre points ne sont pas une séquence, les numéroter habillerait le contenu
au lieu de le décrire.

## Pas de formulaire, par choix

Un bloc « écrire un message » a été construit puis retiré. Un site statique n'a
pas de boîte de réception&nbsp;: il devait donc passer la main à WhatsApp ou à
l'application mail du visiteur, et cette indirection n'apportait rien qu'un
garage ait besoin. L'appel est la conversion, et le numéro n'est jamais à plus
d'un pouce — en-tête sur desktop, barre fixe sur mobile.

La colonne de droite de la section contact porte à la place une liste de ce
qu'il faut avoir sous la main avant d'appeler, ce qui raccourcit l'échange des
deux côtés.

## Structure

```
src/
  config/business.js   ← toutes les données client
  lib/hours.js         ← formatage horaires + openingHoursSpecification
  layouts/Layout.astro ← <head>, SEO, JSON-LD LocalBusiness
  components/          ← Hero, Services, WhyUs, Reviews, Location, Contact…
  scripts/main.ts      ← GSAP, Lenis, menu, badge ouvert/fermé
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
   avis, marques. Aucun composant ne contient de donnée client
   en dur.
2. `src/assets/` — remplacer les quatre photos (mêmes noms de fichiers).
3. `src/styles/global.css` — le bloc `@theme`. **Revérifier les contrastes** si
   l'accent change : les tests ne vérifient pas les couleurs.
4. `brand/logo-source.png` — déposer le logo du client et relancer
   `scripts/trace-logo.mjs`.

Puis `SITE_URL` en haut de `business.js`, et les mentions légales.

## QA

```bash
npm run qa                                         # typecheck + 24 tests
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
