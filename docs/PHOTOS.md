# Photos du site — origine, emplacement, ce qui reste à régler

## Où elles sont

| Photo | Emplacement | Origine |
|---|---|---|
| Devanture au crépuscule | Hero | Transmise au brief |
| Façade de jour | (réserve, non publiée) | Transmise au brief |
| Rayon outillage | Section « Ce qui revient dans les avis » | Transmise au brief |
| L'avenue devant le garage | Section « Venir nous voir » | Transmise au brief |
| Cayenne sur le pont | Galerie — À l'atelier (photo de tête) | Page Facebook du garage |
| Étrier de frein déposé | Galerie — À l'atelier | Idem |
| Haut moteur ouvert, distribution | Galerie — À l'atelier | Idem |
| Rayon huiles | Galerie — Au comptoir | Idem |
| Batteries en rayon | Galerie — Au comptoir | Idem |
| Coffret d'outillage | Galerie — Au comptoir | Idem |
| Dégivrant | Galerie — Au comptoir | Idem |
| Plan d'accès | Section « Venir nous voir » | Capture Google Maps, recadrée |

Les sept photos de la galerie passent par `scripts/prepare-photos.mjs`, qui les
renomme et applique le floutage ci-dessous. Pour les régénérer :

```
node scripts/prepare-photos.mjs <dossier-source>
```

---

## Ce qui a été modifié

### La plaque d'immatriculation du Cayenne est floutée

Une plaque est une donnée personnelle : elle identifie le titulaire du
véhicule, qui est **un client**, pas le garage. La publier sur le site
commercial du garage n'est pas quelque chose à quoi ce client a consenti.

Le floutage est fait par script, pas à la main, pour qu'il soit rejoué si la
photo est réimportée.

---

## ⚠️ Une photo n'a pas été mise en ligne

**L'homme qui branche des câbles de démarrage dans la neige.**

Cette image ne vient pas du garage. Trois indices concordants :

1. **612 × 408 pixels** — c'est exactement le format des aperçus gratuits de
   Getty Images, et aucune des autres photos n'a cette taille.
2. Le cadrage, la lumière et la profondeur de champ sont ceux d'une photo de
   studio en extérieur, pas d'une photo prise au téléphone à l'atelier.
3. Il y a de la neige et des sapins. Il n'y en a sur aucune autre photo, et
   pas beaucoup avenue de la République.

Deux raisons de ne pas la publier, chacune suffisante :

- **Le droit.** Une image de banque utilisée sans licence expose à une demande
  de régularisation, et les agences les recherchent automatiquement sur le web.
  Le montant réclamé dépasse largement le prix de la licence.
- **La cohérence.** Toutes les autres photos du site ont été prises au garage.
  Une photo d'illustration au milieu, avec un inconnu, affaiblit précisément ce
  que les autres démontrent — que ces images sont vraies.

**Si vous avez la licence**, dites-le moi et je la remets. **Si vous voulez
illustrer le dépannage batterie**, une photo prise au comptoir avec un
démarreur de secours ferait mieux le travail — et serait de vous.

---

## ⚠️ Deux points à valider avant la mise en ligne

1. **L'accord des personnes visibles.** Deux photos montrent des visages : le
   Cayenne sur le pont (visage net) et l'étrier de frein (de dos, peu
   identifiable). Ce sont vraisemblablement vos collaborateurs, et les photos
   viennent de votre page Facebook publique — mais une publication sur Facebook
   ne vaut pas accord pour une publication sur le site commercial. Un accord
   oral suffit ; il faut juste l'avoir demandé.

2. **Les prix affichés sur la photo du rayon huiles.** On y lit « 17 € le
   bidon 5 litres », « 29 € », « 25 € ». Ces prix deviennent lisibles sur le
   site. S'ils ont changé, un client peut arriver au comptoir avec la capture
   d'écran. Deux options : garder la photo si les prix sont à jour, ou en
   fournir une plus récente. C'est la seule photo qui porte une information
   périssable.

---

## Ce que les légendes disent, et ne disent pas

Chaque légende décrit ce qui est dans le cadre, et rien de plus :

- « Un Porsche Cayenne sur le pont de l'atelier » — visible.
- « Étrier avant déposé, disque à nu » — visible.
- « Haut moteur ouvert, pignons de distribution accessibles » — visible.
- « Des batteries en rayon » — visible.

Ce qu'aucune légende ne dit : « on prend tous les véhicules », « distribution
faite le jour même », « le plus grand stock du 93 ». Ce serait la même faute
que les engagements retirés de la section avis (voir `docs/VERACITE.md`) : une
photo prouve ce qu'elle montre, pas ce qu'on aimerait qu'elle prouve.
