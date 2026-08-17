# Planet Auto — site vitrine

Site vitrine du garage **Planet Auto**, 80 avenue de la République, 93800
Épinay-sur-Seine. Astro + Tailwind + GSAP + Lenis, statique, sans base de
données.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # -> dist/
npm run qa         # build + typecheck + tests fonctionnels
```

---

## ⚠️ À faire avant la mise en ligne

Ces quatre points bloquent la publication. Les trois premiers portent une
responsabilité légale.

### 1. Remplacer les textes d'avis

`src/config/business.js` contient quatre avis dont le champ `text` est un
**gabarit de mise en page**, pas un vrai avis. Les noms « Isma B. » et
« Johanna Correa » viennent du brief, mais les phrases ont été rédigées pour
caler la maquette — ces personnes n'ont jamais écrit ça.

Publier de faux avis, ou attribuer des propos inventés à des clients nommés,
constitue une pratique commerciale trompeuse (art. L121-2 et suivants du Code
de la consommation) et expose à une sanction DGCCRF.

Marche à suivre :

1. Ouvrir la fiche Google Business Profile du garage.
2. Copier le **libellé exact** de quatre avis, avec le nom d'auteur affiché.
3. Remplacer `text`, `author` et `rating` dans `reviews`.
4. Passer `reviewsVerified` à `true`.

Tant que `reviewsVerified` vaut `false` :

- un bandeau d'avertissement s'affiche sur la section Avis ;
- le balisage `schema.org/Review` est **omis** du JSON-LD, pour ne pas déclarer
  de faux témoignages à Google. La note agrégée 4,6/251, elle, est réelle et
  reste déclarée.

### 2. Vérifier les coordonnées GPS

`business.address.lat` / `.lng` sont **approximatives** — elles n'ont pas pu
être géocodées. Elles ne servent qu'à cadrer la carte OpenStreetMap et le champ
`geo` du JSON-LD.

Les boutons « Itinéraire » et « Waze » n'en dépendent pas : ils utilisent une
requête textuelle (nom + adresse), qui résout correctement quelle que soit la
valeur de `lat`/`lng`.

Pour les corriger : ouvrir la fiche sur Google Maps → clic droit sur le
marqueur → copier les coordonnées.

### 3. Compléter les mentions légales

`src/pages/mentions-legales.astro` porte des `[À COMPLÉTER]` : forme juridique,
SIRET, TVA, directeur de la publication, et coordonnées de l'hébergeur. Ces
mentions sont obligatoires (art. 6-III de la LCEN). La page existe pour que le
lien du footer ne soit pas un 404 ; elle n'est pas conforme en l'état.

### 4. Confirmer les horaires

Les horaires de `business.hours` viennent du brief avec la mention « à
confirmer ». Ils alimentent à la fois le tableau affiché, le badge
« Ouvert / Fermé » et le JSON-LD — une erreur ici se propage partout, dont dans
la fiche Google.

---

## Structure

```
src/
  config/business.js   ← toutes les données client (voir « Dupliquer »)
  lib/hours.js         ← formatage horaires + openingHoursSpecification
  layouts/Layout.astro ← <head>, SEO, JSON-LD LocalBusiness
  components/          ← Hero, Services, WhyUs, Reviews, Location, Contact…
  scripts/main.ts      ← GSAP, Lenis, menu, badge ouvert/fermé
  styles/global.css    ← tokens de design
scripts/
  shoot.mjs            ← captures + audit (overflow, cibles tactiles, titres…)
  check.mjs            ← tests fonctionnels (menu, ancres, JSON-LD, sans JS…)
```

## Choix techniques

**Deux rouges, pas un.** Aucun rouge unique ne passe le contraste WCAG AA à la
fois en fond de bouton sous du texte blanc et en texte sur le fond quasi noir.
`--color-signal` (#d91f35) est le remplissage — blanc dessus = 5,00:1.
`--color-signal-bright` (#ff3b30) est l'encre — sur `--color-ink-950` = 5,55:1.
Même famille de teinte, donc l'œil lit un seul accent.

**Le rouge appartient aux boutons d'appel.** Le titre H1 est blanc. Colorer le
titre aussi diluerait le signal qui doit tirer vers le téléphone.

**Bouton d'appel en bas sur mobile.** Le CTA mobile est fixé en bas d'écran, à
portée de pouce, pas dupliqué dans l'en-tête. Le header porte le CTA à partir
de `lg` seulement.

**OpenStreetMap plutôt que Google Maps.** Une iframe Google Maps dépose des
traceurs avant tout consentement, ce qui imposerait un bandeau cookies (position
CNIL). OSM n'en dépose pas : le site n'a besoin d'aucun bandeau.

**Aucun appel réseau externe.** Les polices (Roboto Condensed + Inter) sont
auto-hébergées via npm. Les images sont converties en WebP au build par Astro.
Total transféré : ~380–400 kB, JS compris.

**Le site fonctionne sans JavaScript.** Les éléments animés au scroll sont
visibles par défaut ; GSAP ne fait que les révéler quand il est là. Le
formulaire est un POST HTML classique. `prefers-reduced-motion` désactive Lenis
et toutes les animations.

## Formulaire de contact

Câblé pour **Netlify Forms** (`data-netlify="true"`) : aucun code serveur, les
soumissions arrivent dans le dashboard Netlify.

**Sur Vercel, ce formulaire ne fonctionnera pas.** Il faudra soit une fonction
serverless dans `api/`, soit un service tiers (Formspree, Basin), soit rester
sur Netlify.

## Dupliquer pour un autre garage

Trois endroits à toucher, pas plus :

1. `src/config/business.js` — nom, téléphone, adresse, horaires, note, services,
   avis, arguments. Aucun composant ne contient de donnée client en dur.
2. `src/assets/` — remplacer les quatre photos (mêmes noms de fichiers).
3. `src/styles/global.css` — le bloc `@theme` si la palette change. **Revérifier
   les contrastes** si l'accent change : `npm run qa:check` ne teste pas les
   couleurs, il faut recalculer les ratios.

Puis `SITE_URL` en haut de `business.js`, et les mentions légales.

## QA

```bash
npm run qa                                  # typecheck + 22 tests fonctionnels
npm run preview                             # dans un terminal
npm run qa:shots -- http://localhost:4321 shots   # captures + audit
```

`check.mjs` vérifie les liens `tel:` en E.164, l'ouverture/fermeture du menu, le
défilement des ancres, le fait que rien ne passe sous la barre fixe, le rendu
en `reduced-motion` et sans JS, et la validité du JSON-LD (type, téléphone,
adresse, horaires fusionnés, absence de faux avis déclarés).

`shoot.mjs` capture en 390 / 820 / 1440 px et signale débordement horizontal,
cibles tactiles sous 44 px (hors liens en ligne, exemptés par WCAG 2.5.5),
ordre des titres, images sans `alt` et reveals bloqués.

Les scripts pointent sur le Chromium du système via `CHROMIUM_PATH` si la
version de Playwright ne correspond pas au binaire installé :

```bash
CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome npm run qa:check
```

## Non vérifié dans cet environnement

Le sandbox de développement bloque les hôtes externes (403 sur CONNECT). N'ont
donc **pas** pu être testés en conditions réelles :

- le rendu de la carte OpenStreetMap (l'iframe apparaît en gris ici ; un lien de
  repli « Ouvrir l'itinéraire » est affiché juste en dessous) ;
- la soumission du formulaire Netlify ;
- les serveurs MCP HTTP déclarés dans `.mcp.json` (GitHub, Figma, Vercel,
  Netlify), qui demanderont une authentification OAuth au premier lancement.
