# WCT — WME Closures Toolkit · Dossier de spécifications

> **Version du code décrite ici : 1.18.00** (lue dans le bloc `==UserScript==` du fichier
> `WME_ClosuresToolkit.user.js`, seule source de vérité du numéro).
> Dernière version **publiée** sur GreasyFork au moment où ce dossier est écrit : **1.17.00**.
> Ce dossier décrit le code présent dans le dépôt, pas ce qui est en ligne.

---

## 0. À qui s'adresse ce dossier, et comment le lire

Ce document est le **dossier de reprise** du projet : il doit permettre à quelqu'un — humain ou
IA — qui n'a jamais vu ce code de comprendre **ce que fait l'outil, pourquoi il est fait ainsi,
et ce qu'il ne faut pas casser**, sans avoir à lire les 17 000 lignes du script.

Trois documents cohabitent, avec trois rôles distincts :

| Document | Rôle | Public |
|---|---|---|
| `README.md` | Vitrine : ce que l'outil apporte, comment l'installer | Utilisateur, page GitHub |
| **`SPECIFICATIONS.md`** (ce fichier) | **Normatif** : le contrat, les invariants, les formats | Repreneur, développeur |
| `tools/README.md` | Le protocole de vérification, contrôle par contrôle, **avec l'histoire du défaut que chacun a attrapé** | Repreneur |

Le **code lui-même est massivement commenté**, et ces commentaires ne paraphrasent pas le code :
ils disent **pourquoi** il est écrit ainsi, souvent en citant le défaut réel qui a coûté la leçon
(date, symptôme, conséquence). Ce dossier ne les remplace pas — il donne la carte pour les
retrouver. **Quand ce dossier et un commentaire du code se contredisent, le code fait foi** et ce
dossier est à corriger.

Ordre de lecture conseillé pour une reprise :

1. § 1 et § 2 — ce que fait l'outil, et surtout ce qu'il refuse de faire ;
2. § 11 — **les contraintes non négociables** : c'est là que se trouvent les pièges qui coûtent cher ;
3. § 5 et § 6 — l'architecture et le modèle de données ;
4. § 13 — le protocole de vérification, à jouer **avant** toute modification, pour disposer d'un
   état initial vert.

---

## 1. Contexte et enjeu

### 1.1 Le besoin

Le **Waze Map Editor** (WME) permet de poser des *fermetures de route* (« road closures ») :
une plage horaire pendant laquelle un segment n'est pas empruntable, ce que l'application Waze
prend en compte pour ses itinéraires. L'éditeur natif traite **une fermeture à la fois, sur un
segment à la fois**.

Or les événements réels ne ressemblent pas à cela. Une course cycliste, un marathon, un rallye,
un marché hebdomadaire, un chantier : ce sont **des dizaines ou des centaines de segments**, à
fermer **selon un motif qui se répète** (tous les dimanches de 8 h à 13 h, toutes les nuits de
21 h à 5 h, six fois de suite à trois heures d'intervalle). Posé à la main, ce travail est long,
et surtout il est **irrégulier** : on oublie un segment, on se trompe d'une heure, on saute une
occurrence.

WCT transforme cela en **une opération de lot** : on désigne les segments (à la souris, par une
zone tracée, depuis un tracé GPS, ou par import d'un fichier), on décrit le motif temporel une
fois, on **met en file d'attente**, on relit, puis on **applique**.

### 1.2 L'enjeu, et ce qu'il impose

**Ce que WCT écrit part sur la carte réelle, et on ne sait pas le défaire.** « Appliquer »
n'est pas une simulation : le bouton pose des fermetures que des conducteurs vont subir. Une
fermeture posée le mauvais jour envoie du trafic ailleurs ; une fermeture manquée envoie des
conducteurs dans une course cycliste.

Trois conséquences structurent tout le code :

1. **Aucune erreur silencieuse n'est acceptable.** Un segment absent du modèle est *sauté sans
   rien dire* par l'API de WME : le script doit donc **compter ce qui a réellement été posé**, et
   non ce qu'il a demandé. C'est l'origine du bilan par entrée (§ 8.7) et de plusieurs contrôles.
2. **Ce qu'on annonce doit être vrai, dans la bonne unité.** Le bilan a un jour affiché
   « 322 posée(s) · 6 en échec » en mettant côte à côte des *fermetures* et des *entrées* : ces
   « 6 » valaient 54 fermetures ratées, l'échec était minimisé d'un facteur 9. Les deux comptes
   coexistent désormais, chacun nommé.
3. **Un filtre qui ne filtre pas doit le dire.** « Sauf jours fériés » qui ne trouve aucun férié
   ne doit **jamais** se lire comme « il n'y en avait pas » (§ 10).

### 1.3 Filiation

WCT descend de **WME Advanced Closures** (dummyd2, seb-d59, WazeDev) — dont il conserve la
compatibilité du format CSV segments — et s'est inspiré de **CSV Helper** (InstantT). Ces deux
crédits figurent dans l'en-tête du fichier et dans le README ; ils ne sont pas décoratifs.

---

## 2. Périmètre

### 2.1 Ce que WCT fait

- Poser des **fermetures de segments** et des **fermetures de virages** (turn closures), en lot.
- Décrire un motif temporel selon **trois modes** : chaque jour (motif hebdomadaire), répétition
  (N occurrences tous les X), continu (une seule fermeture du début à la fin).
- **Filtrer sur les jours fériés** — les éviter, ne viser qu'eux, ou les ajouter aux jours cochés —
  avec une résolution **régionale** dans les pays où les fériés diffèrent par État.
- Sélectionner des segments par **tracé d'une zone** sur la carte, avec édition du contour a
  posteriori et filtrage par type de route.
- Importer des **tracés** (GPX, KML, KMZ, GeoJSON, shapefile) et sélectionner les segments le long
  d'un tracé, par **lots** (mode balayage).
- Importer et exporter des **CSV de fermetures**, des **zones** (WKT / KML) et des **préréglages**.
- **Rechercher les fermetures existantes** (segments et virages), avec filtre par partenaire.
- Renseigner une **source partenaire** et un **événement trafic majeur (MTE)**.
- Tout cela en **8 langues**, dont une à écriture droite-à-gauche.

### 2.2 Ce que WCT ne fait pas — et ne doit pas faire

- **Il n'écrit rien au-delà de ce qui est demandé** : `applyQueue` pose ce que la file contient,
  rien d'autre.
- **Il ne devine pas la région sans le dire** : quand la région d'un État est déduite d'un service
  externe, c'est annoncé, et le choix de l'éditeur prime toujours et est mémorisé.
- **Il n'invente pas de correspondance entre codes pays.** Aucune table FIPS→ISO n'est écrite en
  dur : elle vieillirait en silence (§ 10.2).
- **Il ne stocke rien dans le `localStorage` du site** (sauf repli de secours explicite) : les
  réglages vivent dans le stockage du gestionnaire de scripts, via `WMEPrefs`.
- **Il ne modifie pas la géométrie de la carte** : il pose des fermetures, il ne trace pas de routes.

---

## 3. Glossaire

| Terme | Sens dans ce projet |
|---|---|
| **Segment** | Un tronçon de route dans WME, identifié par un entier. |
| **Virage** (*turn*) | Le passage autorisé d'un segment à un autre à travers un nœud. Son identifiant est un **composite dérivé des segments** : il ne survit pas au retraçage d'un carrefour. |
| **Nœud** (*node*) | L'extrémité partagée par plusieurs segments. |
| **Fermeture** (*closure*) | Un intervalle `{start, end}` posé sur un segment ou un virage, avec un sens et une description. |
| **Occurrence** | Une fermeture individuelle produite par le motif temporel. « Tous les dimanches d'août » = 4 ou 5 occurrences. |
| **Entrée de file** | Une ligne de la file d'attente : *un ensemble de segments (ou virages)* × *une liste d'occurrences* × *une configuration*. C'est l'unité que voit l'éditeur (une « carte »). |
| **Lot** (*sweep lot*) | Découpe d'un tracé long en portions, chacune donnant un recadrage de carte et une entrée de file. |
| **MTE** | *Major Traffic Event* — événement trafic majeur de Waze, auquel une fermeture peut être rattachée. |
| **Partenaire / source** | Organisme à l'origine d'une fermeture (`provider`), affiché et filtrable. |
| **Zone** | Polygone tracé ou importé, matérialisé par une couche sur la carte, servant à sélectionner des segments. |
| **Tracé** | Ligne importée d'un fichier GPS, affichée sur la carte, servant de guide de sélection. |
| **`_L`** | Mécanisme de repli linguistique de l'aide : **il retombe silencieusement sur l'anglais**. |

---

## 4. Utilisateurs

Des **éditeurs Waze bénévoles**, de tous niveaux, dans huit langues, sur navigateur de bureau.
Aucun n'est développeur. Ils travaillent souvent **dans l'urgence** (la course est demain) et
**sur du réel** (ce qu'ils posent part en production).

Deux conséquences d'interface, tenues dans tout le code :

- **Un seul bouton plein par écran : l'étape suivante.** Le reste est en bouton creux.
- **Aucun `button`, `select` ou `textarea` sans infobulle** — règle du projet, vérifiée par
  `tools/audit-tooltips.js`.

---

## 5. Architecture

### 5.1 Un seul fichier livré

`WME_ClosuresToolkit.user.js` — **~17 150 lignes, ~1,3 Mo**, autoporteur hormis trois
bibliothèques chargées par `@require` :

| Bibliothèque | Version | Usage | Intégrité |
|---|---|---|---|
| `fflate` | 0.8.2 | décompression ZIP (KMZ, shapefile zippé) | `#sha256=` dans l'URL |
| `proj4` | 2.11.0 | reprojection des shapefiles | `#sha256=` dans l'URL |
| `shpjs` | 4.0.4 | lecture des shapefiles | `#sha256=` dans l'URL |

⚠️ **Les trois URL portent un `#sha256=`** : un `@require` sans empreinte laisserait un tiers
changer le code exécuté chez tous les utilisateurs. Ne jamais en ajouter un sans empreinte.

`@grant` : `GM_addStyle`, `GM_getValue`, `GM_setValue`, `GM_xmlhttpRequest`.

`@connect` : `raw.githubusercontent.com`, `gist.githubusercontent.com`, `date.nager.at`,
`cdn.jsdelivr.net`, `storage.googleapis.com`, `update.greasyfork.org`,
`nominatim.openstreetmap.org`. **Toute nouvelle destination réseau doit être ajoutée ici**, sinon
l'appel est refusé par le gestionnaire de scripts.

### 5.2 Les grandes régions du fichier

Le fichier est une IIFE `'use strict'` unique. Les sections sont matérialisées par des bandeaux
de commentaires (`// ─── Titre ───` et `// ═══ TITRE ═══`), qui servent de sommaire :

| Zone (indicatif) | Contenu |
|---|---|
| en-tête → ~120 | Métadonnées, constantes (`DIR`, `NODE_CL`), **état de module** |
| ~120 → ~1430 | **CSS** intégral, injecté par `GM_addStyle` |
| ~1438 → ~6060 | **Dictionnaires des 8 langues** (`LANGS`, `RTL_LANGS`, puis un objet par langue) |
| ~6061 → ~7150 | Aide (`buildHelpHTML`), mécanisme `_L` |
| ~7150 → ~7480 | Utilitaires DOM, dates DST-safe, virages, permalinks |
| ~7475 → ~7780 | **Région et code pays** (Nominatim, correspondance par nom) |
| ~7780 → ~8120 | Horodatage des tuiles (flux RSS Waze), pastille de mise à jour |
| ~8120 → ~8210 | **Persistance** (`_prefsData`, `_appliquerPrefs`, `save`, `load`) |
| ~8210 → ~8940 | **`WMECreneaux`** — copie conforme de `lib/WMECreneaux.js` |
| ~8940 → ~9320 | Volet Virages, persistance et reprise de la file |
| ~9320 → ~9840 | **Onglet Recherche** : partenaires, couches, filtres, fermetures en vue ou en zone |
| ~9840 → ~10470 | Blocs de résultats segments et virages, exports |
| ~10470 → ~11110 | **Application de la file** (`applyQueue`), CSV, toasts |
| ~11110 → ~12820 | **Tracés** : lecture GPX/KML/KMZ/GeoJSON/SHP, styles, couverture, balayage, lots |
| ~12820 → ~14130 | **Zone** : géométrie, tuiles, sélection, édition du contour, exports |
| ~14130 → ~14600 | Table des tracés, **raccourcis clavier** |
| ~14600 → ~16340 | Construction et câblage de l'overlay, cartes de file |
| ~16340 → ~16800 | **Import universel**, CSV virages, FAB |
| ~16800 → fin | Couche fermetures de WME, initialisation |

### 5.3 Les bibliothèques copiées

`lib/WMECreneaux.js` (v1.1.0) est la **règle qui décide de ce qui sera écrit sur la carte**.
Elle est **copiée** dans le userscript, sous un bandeau qui interdit de la modifier sur place.

- Elle ne touche **ni au DOM, ni au réseau, ni à WME** : tout ce qu'elle ignore lui est passé
  (le pays, la façon d'obtenir les fériés, le plafond). Elle est donc exécutable sous Node,
  **testable sans ouvrir l'éditeur**.
- Elle **ne traduit pas** : elle rend des **codes** (`{code:'errDateStart'}`) que l'appelant
  traduit. Elle est partagée avec un second outil, qui prépare des fermetures hors de WME et en
  produit le CSV que WCT importe : **une seule règle, deux porteurs**.
- ⚠️ **Modifier la source, jamais la copie**, puis `node tools/sync-lib-creneaux.js --ecrire`.
  `tools/check-lib-creneaux.js` vérifie l'identité **et rejoue `test-plage.js` sur la copie** :
  un code identique qui ne tourne pas dans son contexte ne prouve rien.
- ⚠️ Les codes qu'elle rend sont des **clés du dictionnaire de WCT**. `check-cles-mortes.js` ne
  les voit employées que parce que la bibliothèque est copiée dans le userscript. Le jour où elle
  passerait en `@require`, ce contrôle les déclarerait mortes à tort.

`WMEPrefs` (dépôt voisin `WME-Prefs`) est également **embarquée en copie**, vérifiée par
`tools/check-lib-copie.js`.

---

## 6. Modèle de données

### 6.1 L'état de module

Variables de module, déclarées en tête de fichier. Elles ne sont pas regroupées dans un objet :
c'est délibéré, la fermeture lexicale les rend lisibles depuis tout le script.

| Variable | Sens |
|---|---|
| `sdk` | Le SDK WME, obtenu à l'initialisation |
| `queue` | **La file d'attente** : tableau d'entrées (§ 6.2) |
| `presets` | Les préréglages enregistrés |
| `enabled`, `closeNodes` | Actif ; politique de fermeture des nœuds (`none` / `inside` / `all`) |
| `lastConfig` | Dernière configuration lue |
| `collapsed` / `_collapseVoulu` | Panneau replié ; **et qui l'a demandé** — un repli *technique* (tracé en cours) doit être défait par le geste qui l'a posé, un repli *voulu* ne se défait jamais seul |
| `_displayMode` | `'normal'` ou `'compact'` |
| `_timeMode` | `'end'` (heure de fin) ou `'dur'` (durée) |
| `_dateFormat` | `'dmy'`, `'mdy'` ou `'iso'` — deviné depuis `navigator.language` |
| `_langPref` | `'auto'` (suit WME) ou un code de `LANGS` |
| `_applyRunning` / `_applyAborted` | Application en cours ; interruption demandée (Échap) |
| `_regionParEtat` | Cache `{'AU|New South Wales': 'AU-NSW'}` — persisté |

### 6.2 Une entrée de file

Produite par `makeEntry(segIds, cfg, closures)` puis enrichie :

```js
{
  segIds,            // identifiants de segments (entrée segments)
  config,            // la configuration lue à l'écran (§ 6.3)
  closures,          // [{start: Date, end: Date}, …] — les occurrences
  source,            // 'cfg' | 'csv' | 'turn' | 'sweep'
  label, detail,     // ce que la carte affiche
  excludedSegs,      // segments écartés pour conflit de sens
  excludedRows,      // Set de clés 'segId:occurrenceIdx' supprimées à la main
  nullSegs,          // Set — segments absents du modèle de données
  recentSegs,        // Set — segments modifiés après le dernier assemblage de tuiles
  // entrée issue d'un lot de balayage
  lotBbox, lotKind, fileId,
  // entrée issue d'un CSV
  csvCenter, csvZoom,
  // entrée virages
  turnIds, turnMeta, turnSegId, turnNodeId, turnLonLat
}
```

⚠️ **`nullSegs` et `recentSegs` ne sont pas cosmétiques.** Un segment absent du modèle est *sauté
en silence* à l'application ; un segment modifié après le dernier assemblage de tuiles peut ne pas
être celui qu'on croit. Les deux sont comptés à part et annoncés par le toast de mise en file, dont
la couleur dit ce qui passera réellement (vert / orange / rouge).

### 6.3 La configuration (`cfg`)

Lue à l'écran par `readConfig()`, consommée par le moteur de créneaux :

| Champ | Valeurs |
|---|---|
| `rangestart`, `rangeend` | `AAAA-MM-JJ` |
| `starttime` | `HH:MM` |
| `timemode` | `'end'` (heure de fin) ou `'dur'` (durée) |
| `endtime` / `durtime` | `HH:MM`, selon `timemode` |
| `durday` | jours entiers à ajouter à la durée |
| `activeTab` | le **mode** : chaque jour / répéter / continu |
| `days` | 7 booléens, **index 0 = dimanche** (comme `Date.getDay`) |
| `holidayMode` | `'none'` \| `'skip'` \| `'only'` \| `'add'` |
| `repntimes`, `repevery`, `repunit` | mode *répéter* ; `repunit` ∈ `day` \| `hour` \| `min` |
| `reason` | description écrite sur la fermeture |
| `direction` | `1` A→B, `2` B→A, `3` double sens |
| `ignoretraffic`, `mteId` | ignorer le trafic ; rattachement à un MTE |

### 6.4 Les préférences persistées

Écrites par `save()` → `WMEPrefs` (`scriptId: 'wmeClosuresToolkit'`, `schema: 1`,
`legacyKey: 'WCT_v1'`), relues par `load()` puis `_appliquerPrefs`.

Contenu : `presets`, `closeNodes`, `enabled`, `displayMode`, `dateFormat`,
`cardsCollapsedDefault`, `langPref`, `polyTypes`, `traceWidth`, `traceOpacity`, `ovGeom`
(géométrie de la fenêtre), `timeMode`, **`queue`** (la file), `regionParEtat`, `reason`.

Cinq règles de relecture, chacune née d'un défaut réel :

1. **La valeur est bornée à la RELECTURE**, pas seulement à la saisie — `ovGeom` est re-bornée
   contre l'écran **du jour**, car c'est le changement d'écran entre deux sessions qui la rend
   dangereuse. Idem pour `traceWidth` et `traceOpacity`, dont une valeur hors bornes donnerait un
   trait invisible ou une bande opaque, sans rien dire.
2. **La chaîne vide est une valeur** : `reason` est testée par `typeof === 'string'`, pas par
   véracité. Qui ne veut aucune description pré-remplie doit pouvoir l'obtenir.
3. **« Tout le pays » est un choix, pas une absence** : la marque `REGION_PAYS_ENTIER` doit passer
   le filtre de forme des codes ISO 3166-2, sinon le choix survit à la session mais pas au
   rechargement — c'est-à-dire nulle part.
4. **`save()` peut partir avant que le panneau existe** (reprise de la file, langue) : lire un
   champ absent y écrirait une chaîne vide et **effacerait** la valeur. D'où le
   `$id('wct-reason') ? … : _reason`.
5. **La file est sérialisée PAR TYPE** (`_jsonAller` / `_jsonRetour`) : elle porte des `Set` et
   des `Date`, que `JSON.stringify` écrase en silence — un `Set` relu comme `{}` vaut « aucune
   ligne supprimée », donc des fermetures que l'éditeur croyait avoir retirées et qui repartiraient
   sur la carte. Une liste blanche de champs se serait périmée au premier champ ajouté ; la
   conversion **par type** suit le code toute seule.

La file relue est **mise de côté**, pas posée : `_queueReprendre()` la rejoue une fois le panneau
construit, avec un bandeau de reprise.

---

## 7. Le moteur de créneaux — `WMECreneaux.generer(cfg, opts)`

C'est la fonction qui décide **de ce qui sera écrit sur la carte**. Asynchrone.

**Retour :**
```js
{ list: [{start: Date, end: Date}…],
  erreur: null | {code, args},
  avis:   [{zone, code, args, niveau}],
  debordement: null | {debut, fin} }
```

**Options :** `max` (plafond, 500 par défaut), `pays` (code ISO **ou une fonction** — WCT passe une
fonction, car le moteur tourne à *chaque frappe* pour l'aperçu et résoudre le pays coûte un appel
au SDK), `feries` (`async (pays, debut, fin) => string[] | null`).

### 7.1 Les trois modes

- **Continu** — une seule fermeture, du début à la fin. **Aucun filtre ne s'y applique** : ni jours
  de la semaine, ni fériés. *Une fermeture continue qui sauterait le 15 août ne serait plus continue.*
- **Répéter** — N occurrences à intervalle fixe (`repevery` × `repunit`). Un intervalle plus court
  que la durée fait se chevaucher les fermetures : ce n'est **pas refusé** (cela peut être voulu)
  mais c'est **dit** par un avis.
- **Chaque jour** — une occurrence par jour coché de la plage.

### 7.2 Quatre invariants temporels, chacun payé par un défaut réel

1. **Toute date est construite en heure LOCALE**, par `makeDSTSafeDate(chaîne, décalageJours,
   heure, minute)`, qui passe par `new Date(y,m,d,h,min)` — le seul constructeur JS qui opère en
   local. Cela corrige le changement d'heure **sans aucune table de règles**.
2. **On part de la CHAÎNE, jamais de l'objet `Date` de la plage.** `new Date('AAAA-MM-JJ')` parse
   en **minuit UTC** : à l'ouest d'UTC, relire ses composantes en local désigne la veille, et la
   plage entière glissait vers le passé (« du 1er au 6 juillet » posait du 30 juin au 5 juillet
   à New York).
3. **Le jour de la semaine se lit en local.** Lu en UTC, « lundi » coché fermait le **dimanche
   soir** à New York dès que l'heure de début tombait de l'autre côté de minuit UTC. Ce n'est pas
   un décalage d'affichage : cela change les jours réellement fermés.
4. **La borne de fin de plage porte sur le DÉBUT de l'occurrence**, pas sur sa fin. Sur la fin,
   toute fermeture passant minuit perdait le dernier jour, en silence : « du 1er au 31 août,
   21 h → 5 h » ne posait que 30 nuits. Le débordement n'est pas supprimé pour autant : il est
   **annoncé**, et calculé sur la liste **finale** (le filtre des fériés peut retirer la dernière
   occurrence, et annoncer un débordement qui n'existe plus serait aussi faux que taire celui qui
   existe).

Une heure de fin antérieure à l'heure de début **décrit une nuit** : la durée court jusqu'au
lendemain.

### 7.3 Les fériés dans le moteur

Le jour férié considéré est celui où la fermeture **commence** — même règle que la borne.
**Trois états, pas deux** : filtre appliqué / aucun férié dans la période / **liste indisponible**.
Le troisième produit l'avis `holidaysUnavailable` : on ne filtre rien **et on le dit**, plutôt que
d'affirmer « aucun jour férié », ce qui serait faux (§ 1.2).

Les **avis** portent une `zone` : l'absence d'avis pour une zone vaut « rien à signaler », et c'est
ainsi que l'appelant sait qu'il doit masquer la zone correspondante à l'écran.

---

## 8. Spécifications fonctionnelles — les sept onglets

La fenêtre est un **overlay déplaçable et redimensionnable**, ouvert par un **bouton flottant
(FAB)** lui-même déplaçable et porteur d'une pastille de sélection. Géométrie mémorisée, ramenée
dans l'écran au changement de machine, double-clic sur l'en-tête pour revenir au dimensionnement
automatique.

| Onglet | Clé | Rôle |
|---|---|---|
| ⚙️ Configurer | `cfg` | Décrire le motif temporel, tracer une zone, mettre en file |
| 🔀 Virages | `turn` | Fermer des virages au nœud sélectionné |
| 📥 Import | `csv` | Déposer n'importe quel fichier — **le contenu décide** |
| 🗺️ Tracés | `gpx` | Tracés importés, couverture, balayage par lots |
| 💾 Préréglages | `pre` | Enregistrer, charger, exporter, importer des configurations |
| 🔍 Recherche | `src` | Trouver les fermetures existantes, filtrer par partenaire |
| ❓ Aide | `help` | Aide intégrée, en 8 langues |

### 8.1 Configurer

Tant qu'il n'y a **aucune sélection**, le seul contrôle actif est le tracé de zone
(`refreshCfgGate`). L'aperçu du nombre de fermetures se recalcule à chaque frappe.

À la mise en file : `makeEntry`, puis détection des conflits de sens (`excludedSegs`), des segments
absents (`nullSegs`) et des segments récemment modifiés (`recentSegs`). Une entrée faite à la main
retient l'**emprise** de ses segments (`_empriseDe`) : c'est sur elle que l'application et le 🎯
recadrent la carte (§ 8.7).

La case **« Combler les trous »** (`combler`, cochée par défaut, portée par la config et les
préréglages) décide de ce qu'on fait d'un segment déjà fermé **en partie** sur le créneau : n'y poser
que les trous (§ 8.7), ou l'écarter.

### 8.2 La zone

- Tracé à la souris via `sdk.Map.drawPolygon`, ou **import** d'un `POLYGON(…)` WKT, d'un KML ou
  d'un GeoJSON de polygones. Une zone importée arrive **exactement au même point** qu'une zone
  fraîchement tracée.
- La zone **reste sur la carte** en tant que couche, avec un badge. Double-clic pour la reprendre :
  glisser un sommet, clic droit pour en supprimer un, clic sur une pastille creuse pour en insérer.
- **Ce n'est qu'après validation du contour** que WCT demande s'il faut sélectionner les segments
  à l'intérieur. Répondre non conserve la zone, prête à l'export.
- Ces deux décisions (Accepter · Éditer · Abandonner, puis la sélection) s'affichent **en tête de
  l'onglet Configurer** (`_zonePanelShow`) — là où vit ensuite le bandeau de la zone. Sur la carte
  seulement si le panneau WCT est fermé ou replié, en haut au centre et **toujours ramenées dans
  l'écran**. Posées dans un coin de la carte jusqu'à la 1.18.05, on les cherchait — et une fenêtre
  basse les sortait de l'écran.
- **Règle de sélection : tout segment dont plus de la moitié est à l'intérieur** (`_polyInsideFrac`,
  seuil strictement supérieur à 50 %). Le relevé **ne dépend pas du zoom** : la zone est découpée en
  tuiles de `POLY_TILE_KM = 5` km chargées au zoom `POLY_LOAD_ZOOM = 16`, avec barre de progression.
- **Filtrage par type de route a posteriori**, sans retracer (`_polyApplyTypes`).
- **Exports WKT et KML**, relisibles par l'import (contrat d'aller-retour, § 13.2).

### 8.3 Les tracés

Formats lus : **GPX, KML, KMZ, GeoJSON, shapefile** (avec reprojection par `proj4`, EPSG déduit
du `.prj`). Les noms de tracés viennent des attributs du fichier ; **les tracés de même nom
partagent une couleur** ; une couleur déclarée par le fichier (`stroke`, convention *simplestyle*)
est honorée. Couleur, épaisseur et opacité réglables par tracé ou par fichier, les dernières
valeurs choisies devenant le défaut des imports suivants.

**Couverture** : mesure quels segments longent le tracé, et **dessine les trous**.

**Balayage (`traceSweepSelect`)** : le tracé est découpé en **lots** ; chaque lot recadre la carte,
charge son emprise, sélectionne ses segments, et devient une entrée de file marquée
`source: 'sweep'` portant sa `lotBbox`. Le nombre de lots est ce que l'éditeur paiera en gestes :
c'est un chiffre qui compte, et il est testé (`test-pave.js`).

### 8.4 Les virages

Un virage n'existe **que si son nœud est chargé** : l'application recadre dessus avant d'écrire.
L'identifiant de virage étant un composite dérivé des segments, il **ne résout plus** si le
carrefour a été retracé : à l'application, WCT **re-résout** le virage à partir de son identité
sémantique (segment d'entrée → nœud → segment de sortie), qui, elle, survit.

### 8.5 L'import universel

`_impDetecter(nom, texte)` décide **d'après le contenu**, pas d'après l'extension, dans cet ordre :

1. **Binaires** (`.kmz`, `.zip`, `.shp`, ou signature `PK`) → tracé, jamais lus en texte ;
2. enveloppe `wme-userscript-prefs/` → **préférences** ;
3. `POLYGON(…)` / `MULTIPOLYGON(…)` (WKT, `SRID=` accepté) → **zone** ;
4. `.gpx` ou balise `<gpx>` → tracé ;
5. **GeoJSON** : on **compte les géométries** — lignes seules → tracé, polygones seuls → zone,
   les deux → **mixte**, JSON valide sans géométrie → inconnu ;
6. **KML** : même raisonnement sur `<LineString>` / `<Polygon>` ;
7. **CSV** : une ligne d'action reconnue (`add`, `remove`, `add-turn`) suffit. Repli par extension
   **volontairement strict** : il faut la signature d'un vrai tableau (plusieurs lignes de même
   largeur, ≥ 3 colonnes) — « Bonjour, ceci est une note. » contient une virgule sans être un CSV.

Le fichier reconnu est **routé vers l'onglet où se passe l'étape suivante**.

Un **CSV de fermetures de segments** propose deux suites (`_impCsvChoix`), dans le bloc de décision
en tête de Configurer : **🧲 Sélectionner les segments** (geste principal) ou **Ajouter à la file**.
Sélectionner passe par la même mécanique qu'une zone (`_polyProcessRings(null, {ids, bbox})`) :
inventaire de l'emprise des positions du fichier élargie d'environ 1 km, **exactement** les
segments de la liste, l'enveloppe convexe comme contour, puis chargement vue par vue, sélection et
lots recadrés. Les segments introuvables sont **annoncés**. Motif : mis en file, un CSV garde son
MTE tel quel, alors qu'à l'import les MTE ne sont pas encore chargés et qu'une entrée de file ne se
reconfigure pas. Un CSV de virages garde l'ancien chemin.

### 8.6 La recherche

Cherche les fermetures existantes sur **segments et virages**, soit dans la **vue courante**
(modèle client), soit dans une **zone** (API `Features`, bbox `_zoneBbox`). Filtre par
**partenaire** — la liste des partenaires présents est construite depuis la vue. Les nœuds des
virages trouvés sont matérialisés par des **cercles « ruban de chantier »**. Exports CSV séparés
segments / virages.

⚠️ Côté écriture, le `provider` et les attributions d'une source partenaire doivent être posés
**avant** `save()`.

### 8.7 L'application de la file

`applyQueue()` est le point où le script écrit sur la carte. Son déroulé :

1. Replie toutes les cartes pour libérer la place, réarme le bouton d'arrêt, remet à zéro les états.
2. Pour **chaque entrée**, dans l'ordre :
   - marque la carte **⏳ en cours** *avant* de commencer — sur une file longue, savoir *laquelle*
     est traitée vaut autant que le pourcentage global ;
   - **recadre si nécessaire** : emprise **complète** du lot (`sweep`), centre et zoom **portés par
     le CSV** (`csv`), nœud du virage (`turn`), et, pour une entrée faite à la main, son emprise
     **s'il en manque des segments** ;
   - écrit les fermetures, occurrence par occurrence, en respectant `excludedRows`.

**Trier avant d'écrire** (`_trierAFermer`, fonction pure, `test-ecartes.js`) — chaque segment, sens
par sens : *absent* du modèle, *sans sens ouvert* (rien à fermer : écarté, pas compté en échec),
*déjà fermé* sur le créneau (écarté), ou à poser. ⚠️ **Bout à bout = conflit** : Waze refuse une
fermeture qui finit à 08:00 quand une autre commence à 08:00 sur le même sens (« Road Closure time
is overlapped »). Avec `combler`, un sens occupé **en partie** reçoit ses **trous** (`_trousLibres`) :
chaque fermeture existante est élargie d'**une minute** de chaque côté, un trou de moins de
**5 minutes** est laissé, et **on ne touche jamais aux fermetures existantes** — d'un autre éditeur
ou d'un partenaire, on complète. Une fermeture par trou, dans le même enregistrement.

Les fermetures déjà chargées se lisent par `_fermeturesChargees()` : ⚠️ `RoadClosures.getAll()` du
SDK **lève** dès qu'une seule fermeture a `attributions: null` (WME v2.370). Repli sur le modèle ;
`null` (« pas pu regarder ») n'est pas `[]` (« rien »).

**Un refus de Waze ne fait plus tomber le lot** (`_poserParMoitie`) : l'enregistrement est groupé
et Waze le refuse en bloc — un segment fautif sur 405 faisait perdre les 404 autres. Sur un refus
**du serveur** seulement, le lot est coupé en deux et chaque moitié renvoyée, jusqu'à isoler le
fautif, nommé dans le bilan. Budget d'enregistrements borné (`_POSE_BUDGET_PAR_FAUTIF`) : si tout
est refusé, on ne descend pas jusqu'au segment.
3. **Clôt l'entrée** avec un état calculé : `ok` / `partiel` / `echec`, posé sur la carte.
4. À la fin, un **bilan** : replié quand tout est passé, **ouvert de lui-même** sinon. Il donne
   **les deux comptes** — entrées et fermetures (§ 1.2) — et, à part, les segments **écartés** (↷)
   et **complétés** (◐), qui ne sont ni des poses ni des échecs.

⚠️ **Le recadrage CSV a manqué jusqu'au 01/08/2026** : le fichier portait son lon/lat et son zoom,
qui étaient lus puis jamais utilisés. Un éditeur recevant le CSV d'une ville et travaillant sur une
autre posait **zéro** fermeture et lisait « ✅ 180 OK », parce que les segments absents du modèle
sont sautés en silence.

⚠️ Le **journal** est accumulé en mémoire et rendu **une seule fois à la fin** : écrit en direct, il
poussait la mise en page au moment même où l'on regardait la file. Ce qui se passe en direct se lit
sur les cartes ; le détail attend la fin.

**Interruption** : la touche Échap pose `_applyAborted`. Le `finally` garantit qu'aucune carte ne
reste avec un ⏳ éternel.

Les clés de traduction des états sont **écrites en clair**, jamais composées (`'tipEtat' + etat`) :
une clé construite à l'exécution est introuvable par recherche littérale, donc invisible pour
`check-keys.js` et `audit.js` — c'est le piège qui a éteint un contrôle entier pendant des mois.

### 8.8 Raccourcis clavier

Tous préfixés **Alt**. Inactifs dans un champ de saisie. La frappe **n'est consommée que si le
raccourci a réellement agi** — sinon elle est rendue à WME. L'écouteur est posé **une seule fois à
l'initialisation**, jamais dans `connectOverlay` : l'overlay est reconstruit à chaque changement de
langue, on empilerait les écouteurs.

| Touche | Effet | Portée |
|---|---|---|
| `W` | Ouvrir / fermer le panneau | partout |
| `K` | Panneau des raccourcis | panneau ouvert |
| `1`…`6` | Configurer / Virages / Import / Tracés / Préréglages / Recherche | partout |
| `Entrée` | Action principale de l'onglet | selon l'onglet |
| `Z` | Tracer une zone | Configurer |
| `S` | Enregistrer le préréglage | Configurer |
| `N` | Lot suivant | Tracés |
| `A` | Tout sélectionner / tout désélectionner | Virages |
| `X` | Effacer la recherche | Recherche |

---

## 9. Interface avec WME

WCT passe par le **SDK officiel** (`getWmeSdk`), et non par le modèle interne, partout où le SDK
le permet :

| Domaine | Appels utilisés |
|---|---|
| Carte | `Map.setMapCenter`, `getMapCenter`, `getZoomLevel`, `getMapExtent`, `getPixelFromLonLat`, `getLonLatFromPixel`, `drawPolygon` |
| Données | `DataModel.Segments`, `Turns`, `RoadClosures`, `TurnClosures`, `MajorTrafficEvents` |
| Édition | `Editing.setSelection`, `getSelection`, `save`, `undoAll` |
| Divers | `Events.on`, `State.isMapLoading`, `Sidebar.registerScriptTab` |

⚠️ **Greper le membre exact avant de l'écrire** : un nom approché ne lève pas toujours, il rend
`undefined`, et le défaut n'apparaît qu'en production.

⚠️ **Une fermeture porte UN SEUL SENS.** Poser un double sens là où le modèle n'en accepte qu'un
dégrade en silence à l'enregistrement — la compatibilité entre le sens de circulation du segment et
la direction demandée est vérifiée (vers la ligne 7305), et les segments incompatibles sont écartés
dans `excludedSegs` plutôt que posés de travers.

⚠️ Le script **allume la couche « fermetures » de WME** si elle est éteinte
(`ensureClosuresLayer`), et **la remet dans son état d'origine** ensuite.

---

## 10. Jours fériés, pays et régions

### 10.1 La source

`date.nager.at`, interrogée par `GM_xmlhttpRequest`. **Elle attend des codes ISO 3166-1.**

### 10.2 🔴 Le code pays de WME n'est **pas** de l'ISO

Mesure du 05/09/2026, en direct dans WME, sur 18 pays : `country.abbr` rend du **FIPS 10-4**.

- 9 pays coïncident (FR, US, CA, IT, BR, IL, MX, PL, BE) — **d'où l'invisibilité totale du défaut
  depuis la France** ;
- 6 sont inconnus de l'API (Australie `AS`, Espagne `SP`, Royaume-Uni `UK`, Portugal `PO`,
  Japon `JA`, Suède `SW`) : réponse 204, corps vide, aucun filtre — inutile, mais honnête ;
- **3 rendaient le calendrier d'un AUTRE pays, en silence** : Suisse `SZ` → Eswatini,
  Allemagne `GM` → Gambie, Autriche `AU` → **Australie**. « Sauf jours fériés » laissait une route
  **fermée** le jour de la Fête-Dieu en Autriche, et la **fermait** le jour de l'Australia Day.

**La correspondance se fait donc par le NOM du pays**, et la liste des noms vient de l'API
elle-même. ⚠️ **Aucune table FIPS→ISO n'est écrite** : elle vieillirait en silence le jour où Waze
ajoute ou renomme un pays, et personne ne le verrait — exactement le défaut qu'on venait de corriger.

Deux règles de normalisation seulement (`_normNom`), **volontairement timides** : retrait des
parenthèses (« Hong Kong (China) » → « Hong Kong ») et « St. » → « Saint ». Elles ne rapprochent
**pas** « Macedonia » de « North Macedonia » ni « Swaziland » d'« Eswatini » : *ne pas résoudre
coûte un filtre non appliqué ; mal résoudre ferme des routes le mauvais jour.*

### 10.3 La région

Dans les pays à fériés régionaux, il faut un code **ISO 3166-2**. Mesuré aux quatre niveaux que
WME expose (SDK, modèle client, réponse brute de `Features`, service `LocationSearch/States`) :
l'État n'a qu'un **nom libre** et un identifiant Waze — **le code ISO n'y est nulle part**, et il
n'est pas dérivable du nom (AT-9 pour Vienne, IT-32, PT-20 ; DE-ST = Sachsen-Anhalt, DE-BY = Bayern).

D'où un **géocodage inverse** sur `nominatim.openstreetmap.org`, qui rend le code lui-même.

⚠️ **Ce service est bénévole et interdit le géocodage en masse** — il l'autorise *« if your app
has very few users and applies caching »*. D'où le cache **persistant** `_regionParEtat` : **une
requête par État rencontré, une seule fois dans la vie du script** chez un éditeur donné.

⚠️ **S'il ne répond pas, on revient exactement au comportement de la 1.15.00** : sélecteur manuel,
« tout le pays » par défaut. Aucune dégradation, un geste de plus.

⚠️ **Le choix de l'éditeur prime toujours**, et « tout le pays » est un **choix mémorisé**, pas une
absence (§ 6.4). Ce qui est *déduit* est annoncé comme tel ; ce que l'éditeur a *choisi* ne se dit
plus « détecté ».

---

## 11. Contraintes non négociables

### 11.1 Un seul numéro de version, lu dans les métadonnées

`VERSION` est **lu** dans `GM_info.script.version`, avec repli sur `'?'`. Il était resté figé à
`0.75.00` pendant que `@version` annonçait `0.80.00` — cinq versions d'écart, affichées à
l'utilisateur dans l'en-tête **et** dans l'aide. **Ne jamais re-figer ce numéro en dur.** Le repli
sur `'?'` est délibéré : *mieux vaut avouer qu'on ne sait pas.*

Format de version : **`x.yy.zz`**, à incrémenter **à chaque livraison**.

### 11.2 Huit langues, aucune clé orpheline

Les 8 dictionnaires (`fr`, `en`, `de`, `es`, `it`, `pt-BR`, `pt-PT`, `he`) doivent avoir **les mêmes
clés, les mêmes types et les mêmes arités**. Un argument oublié affiche un trou à l'écran, sans
lever d'erreur. Vérifié par `check-keys.js`.

⚠️ **`_L` retombe silencieusement sur l'anglais** : une section d'aide non traduite ne lève rien.
`check-help.js` mesure **chaque section** et **nomme la dette restante** ; une section réparée qui
reste dans la liste de dette **fait échouer** le contrôle, pour que le chiffre ne mente jamais par
excès.

### 11.3 L'hébreu retourne vraiment le panneau

`RTL_LANGS = ['he']` ⇒ `dir="rtl"`. Ancrage, interrupteur, popovers et barre d'attente sont
mesurés en LTR **puis** en RTL par `check-rtl.js`. Toute future langue RTL s'ajoute dans cette liste.

### 11.4 Contraste WCAG 4,5:1

`--wct-text2` vaut `#566372` (6,13:1 sur blanc, 5,71:1 sur `--wct-bg`) et non `#718096`, qui
donnait **4,02:1** — sous le seuil — sur *tous* les libellés de formulaire. Le calcul est dans le
commit : **refaire la mesure avant de le retoucher**. `check-contraste.js` mesure le thème clair et
le thème compact.

### 11.5 Emoji : toujours suivis de `U+FE0F`

Tout caractère à `Emoji_Presentation=false` **affiché** doit porter le sélecteur de variante, sinon
le navigateur rend un glyphe texte. Vérifié par `check-emoji.js`.

### 11.6 Rien dans le `localStorage` du site

Les réglages passent par `WMEPrefs` (stockage du gestionnaire de scripts) : effacer ses données de
navigation ne doit plus les perdre. Le `localStorage` ne subsiste que comme **repli de secours**
avant l'initialisation, et comme **legs relu une fois** (`WCT_timeMode`) pour ne pas changer le
réglage d'un éditeur sous ses yeux à la mise à jour.

### 11.7 Aucun contrôle sans infobulle, aucune interpolation non échappée

Aucun `button`, `select` ou `textarea` sans `title` (`audit-tooltips.js`). `audit.js` traque les
interpolations HTML non échappées, les identifiants dupliqués, les `catch` muets, les `setInterval`
et les restes de mise au point. `audit-catch.js` classe les `catch` vides **par risque** : avaler
l'échec d'une écriture n'est pas avaler celui d'un cadrage optionnel.

### 11.8 Les barres tiennent sur une ligne

En-tête, sous-onglets de Configurer et pied « Valider » doivent tenir sur **une seule ligne**, dans
les **8 langues**, sur **4 tailles de fenêtre**, en-tête compris **avec et sans** la pastille de
mise à jour. Trois contrôles dédiés (`check-entete.js`, `check-onglets.js`, `check-pied.js`).

---

## 12. Formats d'échange

### 12.1 CSV segments — compatible WME Advanced Closures

```
header,reason,start date (yyyy-mm-dd hh:mm),end date (yyyy-mm-dd hh:mm),
direction (A to B|B to A|TWO WAY),ignore trafic (Yes|No),segment IDs (id1;id2;...),
lon/lat (like in a permalink: lon=xxx&lat=yyy),zoom (14 to 22),
MTE id (empty cell if not),comment (optional)
```

Action `add` (ou `remove`). **Une ligne = une occurrence × l'ensemble de ses segments encore
actifs** — même calcul que `applyQueue` : *ce qu'on exporte doit être ce qu'on appliquerait.*
Une occurrence entièrement supprimée à la main ne produit pas de ligne.

### 12.2 CSV virages — format propre à WCT

```
header,reason,start date,end date,from segment id,node id,to segment id,turn id,
ignore trafic (Yes|No),MTE id,lon/lat,zoom,comment
```

Action **`add-turn`**, et non `add` : un fichier de virages donné par erreur à Advanced Closures
est ainsi **rejeté** au lieu d'être mal interprété.

Deux choix de conception à préserver :
- on écrit **l'identité sémantique** (from / node / to) **en plus** du `turn id`, parce que ce
  dernier ne résout plus après retraçage d'un carrefour ;
- le `lon/lat` pointe le **nœud du virage** (et non le centre de carte comme le CSV AC) : c'est ce
  qui permet à l'import de recadrer, condition pour que le virage soit chargé.

### 12.3 Zone

**WKT** `POLYGON((lon lat, …))` et **KML**. Contrat d'aller-retour : *ce qu'on écrit, on doit
savoir le relire* — vérifié par `test-roundtrip.js`, qui avait justement révélé que WCT ne relisait
pas ses propres exports.

### 12.4 Préréglages et préférences

Enveloppe `wme-userscript-prefs/`, exportable, importable, et **chargeable depuis une URL** pour
partager des préréglages entre éditeurs.

---

## 13. Protocole de vérification

**~50 scripts Node, sans aucune dépendance**, dans `tools/`. Ils lisent **le fichier réel**
(`../WME_ClosuresToolkit.user.js`), pas une copie : *un test qui s'exécute sur autre chose que le
code livré ne prouve rien.* Plusieurs **extraient la fonction du fichier livré** et la rejouent.

```bash
cd tools
node check-keys.js        # avant toute publication
```

### 13.1 Avant de publier

| Script | Ce qu'il vérifie |
|---|---|
| `check-keys.js` | Mêmes clés, types et arités dans les 8 langues |
| `check-help.js` | L'aide se rend dans les 8 langues, **section par section**, dette nommée |
| `check-aide-parite.js` | Aucune section d'aide **périmée** dans une langue (longueur rapportée au français, seuil propre à l'hébreu, témoin intégré) |
| `check-lib-copie.js` | La copie de `WMEPrefs` est identique à `../../WME-Prefs/WMEPrefs.js` **et fonctionne** |
| `check-lib-creneaux.js` | La copie de `WMECreneaux` est identique à `lib/` **et rejoue `test-plage.js` sur la copie** |
| `check-contraste.js` | 4,5:1 (WCAG), thème clair **et** compact |
| `check-entete.js`, `check-onglets.js`, `check-pied.js` | Ces barres tiennent sur une ligne, 8 langues × 4 tailles |
| `check-bilan-defile.js` | Le bilan déplié n'est pas rogné et ne pousse pas les boutons hors de l'overlay |
| `check-rtl.js` | Le panneau se retourne réellement en hébreu |
| `check-ancrage.js` | La fenêtre tient dans l'écran et reste réglable |
| `check-emoji.js` | `U+FE0F` après tout emoji à présentation texte |
| `check-cles-mortes.js` | Aucune clé de dictionnaire orpheline |
| `check-demarrage.js`, `check-api-carte.js`, `check-css-vars.js` | Démarrage, API carte, variables CSS |

### 13.2 Les tests de règle

`test-plage.js` (bornes de la plage — *elle décide de ce qui sera écrit sur la carte*),
`test-poly.js` (point-dans-polygone, fraction > 50 %, concave, trous, **50 % pile non retenu**,
normalisation du tracé), `test-export.js` et `test-roundtrip.js` (formats, aller-retour),
`test-imp-detect.js` (cas **ambigus** de l'import), `test-bilan.js` (états de carte et structure du
bilan), `test-centrage.js` (recadrage sur ce qui reste **visible**, hors volet WME, hors panneau,
hors barre du bas), `test-pave.js` (nombre de lots), `test-queue-total.js` (nombre de fermetures
réellement écrites), `test-file-persistance.js` (la file survit à un rechargement **sans rien
perdre**), `test-turn-bilan.js` (ce que l'onglet Virages compte comme **posé**),
`test-raccourcis.js`, `test-maj.js`, `test-imp-route.js`, `test-geojson-noms.js`, `test-repli.js`,
`test-prefs-region-desc.js`, `test-feries-regions.js`, `test-extremites.js`, `test-style-trace.js`,
`test-emprise-captage.js`, `test-lib-dico.js`, `test-ecartes.js` (le **tri avant écriture**, le
bout à bout, le **comblement des trous** et la pose par moitiés), `test-zone-geojson.js` (une zone
GeoJSON se lit).

### 13.3 Les audits

`audit.js`, `audit-catch.js`, `audit-ortho.js` (orthographe des **textes affichés**, pas des
commentaires : accents, doubles espaces, apostrophes droites, ponctuation française),
`audit-tooltips.js`.

### 13.4 Ce que les harnais ne prouvent pas

Ils lisent le fichier livré, mais ils ne l'exécutent pas **dans WME**. Ils ne voient pas : une API
du SDK qui change de nom ou de contrat, un segment absent du modèle, une latence de chargement de
tuiles, ni ce qu'un éditeur comprend d'un libellé. **Le geste réel dans WME reste la seule preuve
de bout en bout** — et c'est lui qui a trouvé la plupart des défauts cités dans ce dossier.

⚠️ **« Appliquer » publie sur la carte.** Ne jamais déclencher ce bouton pour « voir si ça
marche » lors d'une session de mise au point pilotée depuis un navigateur automatisé : des
fermetures ont déjà été posées en production de cette façon. De même, `confirm()` gèle le pilotage
automatisé de la page.

---

## 14. Publication

Le canal utilisateur est **GreasyFork** (script **581015**), le canal d'annonce est le forum
**Waze Discuss** (fil **405542**), le dépôt est `github.com/DrSlump34/WME-Closures-Toolkit`.

**Ordre obligatoire : `git push` d'abord, GreasyFork ensuite** — parce que le code est chargé dans
le formulaire GreasyFork par un `fetch` sur l'URL *raw* GitHub. La source publiée est alors, par
construction, celle qui est en ligne.

Points de méthode acquis, à ne pas réapprendre :

- **Vérifier après, toujours** : sur ce formulaire, l'échec est **silencieux des deux côtés**. Un
  clic accepté sans erreur peut ne rien soumettre.
- **La version publiée se lit sur la page du script**, pas sur `.meta.js` : ce dernier est **en
  cache**, même avec un cache-buster.
- **GreasyFork réécrit lui-même deux lignes** (`@downloadURL`, `@updateURL`) : le code servi ressort
  à 4 caractères de moins que l'envoyé. Comparer en neutralisant ces deux lignes.
- **Relire les descriptions EN ENTIER à chaque publication**, dans les deux langues, et sur le champ
  entier — pas seulement sur ce qu'on vient d'écrire.
- **Les notes de version GreasyFork sont en HTML** : les `\n` ne sont pas rendus, entourer chaque
  bloc de `<p>…</p>`.
- **Compter dans la bonne unité** : PowerShell et JS comptent en unités UTF-16, Python en
  caractères. 1 172 881 contre 1 172 247 sur le même fichier = 634 emojis hors BMP, **pas** une
  altération.

---

## 15. Ce qui reste ouvert

- **Le multi-États et le mode P3 n'ont jamais été éprouvés en conditions réelles.**
- La **dette de traduction de l'aide** est nommée dans `check-help.js` et affichée à chaque
  exécution : elle est connue, chiffrée, et le contrôle refuse de dire « complète » tant qu'elle
  existe.
- **La v1.18.00 est committée mais pas publiée** — elle ajoute « aller voir une entrée de file, et
  la sélectionner ».

### Documents annexes du dépôt

| Fichier | Contenu |
|---|---|
| `CDC_jours-feries-regionaux.md` | Cahier des charges du volet fériés régionaux |
| `RELEVE_pays-et-etats-waze.md` | Relevé, en direct dans WME, de la codification des 259 pays et de leurs États — la pièce qui fonde le § 10 |
| `Exemples/` | Fichiers d'exemple pour l'import |
| `Archives/` | Anciennes versions (ignoré par git) |
| `capture_*.png` | Captures d'écran par version, publiées avec les annonces |
