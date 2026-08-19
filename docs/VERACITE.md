# Audit de véracité — d'où vient chaque affirmation du site

Vous avez posé deux fois la même question : « toutes les infos du site sont
vraies ? ». La réponse honnête, la première fois, était **non**. Ce document
disait lesquelles ne l'étaient pas.

Depuis, tout ce qui pouvait être corrigé sans vous l'a été, et ce qui ne
pouvait pas l'être a été retiré du site. Ce qui reste tient en **quatre
questions**, en bas de page, et chacune se règle par oui ou par non.

Trois statuts :

- ✅ **Confirmé** — transmis par vous, ou lisible sur une photo de la devanture.
- ⚠️ **À confirmer** — un point précis, une réponse courte suffit.
- ❌ **Rédigé par moi** — plausible, mais personne ne me l'avait dit. Il n'en
  reste plus sur le site : voir « Ce qui a été retiré ».

---

## ✅ Confirmé

| Information | Source |
|---|---|
| Nom, adresse, téléphone | Brief + enseigne sur les photos |
| Coordonnées GPS | Transmises par vous |
| Note 4,6 / 251 avis | Brief |
| Les 4 avis clients (textes, noms, dates) | Copiés depuis Google par vous |
| Horaires lundi–vendredi | Confirmés explicitement |
| Horaires du samedi : 9h–17h30 | Votre capture de la fiche Google, la plus récente des deux versions |
| Particuliers **et** professionnels | Écrit sur l'enseigne : « distributeur pièces détachées — particuliers et professionnels » |
| Distributeur de pièces détachées | Écrit sur l'enseigne |
| Station de montage | Écrit sur l'enseigne |
| 14 familles de pièces | Texte transmis par vous |
| VL, PL, TP, agricole, marine | Idem |
| Pièces origine / équivalente / réemploi | Idem |
| Équipements de garage et outillage | Idem |
| Réparation de l'électronique embarquée | Idem |
| Page Facebook | Transmise par vous |

---

## Ce qui a été retiré ou réécrit

### Accessibilité et moyens de paiement — supprimés du site

En deux temps.

D'abord la réécriture : « Parking et entrée accessibles PMR » était la phrase
la plus risquée du site. « Accessible PMR » est un terme **réglementaire** —
largeur de passage, cheminement, place réservée — et personne n'avait vérifié
un seul de ces points. Une personne en fauteuil qui se déplace sur la foi de
cette phrase et trouve une marche a fait le trajet pour rien. Elle a donc été
ramenée à ce que la photo montre : « entrée de plain-pied, au niveau du
trottoir ».

Puis la suppression, à votre demande : **plus aucune mention d'accessibilité,
de moyen de paiement ni de stationnement** sur le site. Les deux questions
correspondantes ont disparu de la FAQ, la bande de « faits pratiques » de la
section avis a été retirée, et `paymentAccepted` / `currenciesAccepted` ne sont
plus déclarés dans le balisage schema.org. C'est le choix le plus sûr : ces
sujets se règlent au téléphone, où la réponse peut être précise et datée du
jour.

Le stationnement est parti dans le même mouvement. Il avait déjà été corrigé
une première fois — « parking » laissait entendre un parking appartenant au
garage, alors qu'il s'agit de stationnement de rue — puis retiré entièrement.
La section accès ne donne plus que deux rues repères, Ampère et Branly, qui
servent à ne pas dépasser l'atelier sans rien promettre.

### Les quatre « engagements » de la section avis → quatre observations sourcées

Ces phrases étaient les plus persuasives du site, et les seules que personne
n'avait prononcées :

| Ancienne formulation | Statut |
|---|---|
| « La plupart des interventions courantes repartent le jour même » | ❌ retiré |
| « On vous annonce un délai réaliste dès l'accueil » | ❌ retiré |
| « Le devis annoncé est le prix payé » | ❌ retiré |
| « Si un imprévu apparaît en démontant, on vous appelle avant de toucher à quoi que ce soit » | ❌ retiré |

Elles sont remplacées par quatre observations tirées **de vos quatre avis
Google**, chacune signée du prénom du client qui l'a écrite (« Cité par
Johanna, Isma »). La section s'appelle « Ce qui revient dans les avis » : elle
dit maintenant ce que les clients disent, et non ce que le garage promet. Un
client ne peut plus arriver au comptoir en disant « votre site dit que… ».

### Descriptions de prestations

| Retiré | Pourquoi |
|---|---|
| « Devis avant travaux, aucune surprise à la facture » | engagement commercial jamais formulé |
| « Remplacement en atelier le jour même » | engagement de délai |
| « Toutes marques » (pneus) | jamais confirmé |
| « Permutation et géométrie » | la géométrie demande un banc spécifique — **voir question 3 ci-dessous** |
| « Le suivi qui évite la panne coûteuse » | formule de vente sans contenu |

### Autres

| Élément | Statut |
|---|---|
| « Espèces » comme moyen de paiement | ❌ inventé — puis toute la mention des paiements a été retirée |
| Zone desservie : Saint-Denis, Villetaneuse, L'Île-Saint-Denis | ❌ communes choisies sur une carte — réduit à Épinay-sur-Seine |
| Fourchette de prix « €€ » dans le balisage | ❌ déduit — le champ a été supprimé plutôt que deviné |
| Horaires du samedi | 9h–18h → **9h–17h30**, d'après votre capture ; la ligne du bloc contact, qui était écrite en dur, est maintenant calculée depuis le tableau des horaires et ne peut plus le contredire |

---

## La FAQ

Six questions, toutes appuyées sur des faits confirmés. Les deux autres ont été
supprimées et **ne sont pas remplacées** : six questions vraies valent mieux que
huit dont deux sont meublées.

| Question | Statut |
|---|---|
| Horaires | ✅ samedi corrigé à 17h30 |
| Adresse | ✅ deux rues repères, plus aucune mention de stationnement |
| Pièces aux particuliers | ✅ enseigne |
| Réparations à l'atelier | ✅ géométrie retirée |
| Pièces moins chères que l'origine | ✅ texte du client |
| Poids lourds et agricole | ✅ texte du client |
| ~~Moyens de paiement~~ | supprimée |
| ~~Entrée de plain-pied~~ | supprimée |

---

## ⚠️ Ce qui reste — quatre questions

1. **Le samedi ferme bien à 17h30 ?** Vous m'aviez d'abord écrit 18h, puis
   envoyé une capture indiquant 17h30. J'ai gardé 17h30, la plus récente. Une
   erreur de trente minutes envoie quelqu'un devant un rideau fermé.

2. **Faites-vous la géométrie ?** Si vous avez le banc, je la remets — c'est un
   argument fort et peu de garages de quartier l'affichent.

3. **Les pneus : toutes marques, ou une sélection ?** Un mot suffit.

Et une information que je n'ai pas pu vérifier moi-même :

4. **Alternative Autoparts.** Vous m'aviez transmis ce nom de réseau de
   distribution. Il n'apparaît nulle part sur le site pour l'instant : je ne
   sais pas s'il s'agit d'une adhésion à afficher (c'est un argument de
   sérieux) ou d'un simple fournisseur. Dites-moi lequel.

---

## Pourquoi c'était possible

Rien n'empêchait, dans le processus, qu'une phrase inventée se retrouve à côté
d'une phrase confirmée sans que la différence soit visible. Les avis avaient un
garde-fou (`reviewsVerified` bloquait la publication), le reste du contenu n'en
avait pas.

Deux garde-fous ont été ajoutés depuis :

- `src/config/business.js` porte en commentaire la source de chaque donnée, et
  chaque « avantage » porte le prénom du client qui l'a écrit ;
- la ligne d'horaires du bloc contact et la FAQ sont **calculées** depuis le
  tableau `hours`, et un test (`scripts/check.mjs`) compare le balisage
  schema.org à ce même tableau — deux endroits du site ne peuvent plus afficher
  des horaires différents.

**Toute nouvelle affirmation ajoutée au site doit venir avec sa source, ou être
marquée comme non vérifiée.**
