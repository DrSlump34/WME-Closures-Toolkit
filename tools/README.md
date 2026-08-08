# Contrôles et tests

Scripts Node, sans dépendance. Ils lisent **le fichier réel** (`../WME_ClosuresToolkit.user.js`)
plutôt qu'une copie : un test qui s'exécute sur autre chose que le code livré ne prouve rien.

```bash
cd tools
node check-keys.js        # avant toute publication
```

## Avant de publier

| Script | Ce qu'il vérifie | Pourquoi il existe |
|---|---|---|
| `check-keys.js` | Les 8 langues ont les **mêmes clés, types et arités** ; les nouvelles clés rendent du texte | Un argument oublié affiche un trou à l'écran, sans erreur |
| `check-help.js` | L'aide se rend dans les 8 langues, même nombre de sections, aucune vide | `_L` retombe **silencieusement** sur l'anglais : une langue oubliée ne lève rien |
| `check-lib-copie.js` | La copie de `WMEPrefs` embarquée est **identique** à `../../WME-Prefs/WMEPrefs.js`, et fonctionne | Deux copies qui divergent en silence sont le pire des deux mondes |
| `check-contraste.js` | Les couleurs **du thème** respectent 4,5:1 (WCAG), thème clair **et** compact | L'audit du 01/08 a mesuré 41 paires en échec sur 90. Le thème compact repeignait le fond en gris Win95 sans redéfinir les textes secondaires : 2,21:1 et **1,47:1**, quasi invisible. On juge les couleurs à l'œil, et l'œil s'habitue |
| `check-onglets.js` | La barre des **sous-onglets de Configurer** tient sur **une seule ligne** dans les 8 langues, sur 4 tailles de fenêtre. ⚠️ Seul outil qui a besoin de **Chrome** : il mesure des pixels, pas du texte. S'il ne le trouve pas, il le dit et sort en erreur | Le 3ᵉ onglet de la 1.10.00 (« En continu ») a fait passer l'allemand à **296 px dans une colonne de 296** : zéro marge. Ça ne débordait pas ce jour-là, sur cette machine, avec cette police de repli — ça aurait débordé chez le premier éditeur dont la police rend deux pixels plus large. Les trois défauts partis en production avec la 1.07.01 étaient tous de rendu, tous invisibles aux 186 tests. ⚠️ Il compte les **lignes**, pas le débordement : depuis que `.wct-tabs` porte `flex-wrap`, un libellé trop large ne déborde plus, il passe à la ligne — surveiller le débordement seul serait surveiller une chose qui ne peut plus arriver. Porte un **témoin** (une barre volontairement trop large) qui doit être signalé dans les 4 configurations |
| `check-emoji.js` | Tout caractère à `Emoji_Presentation=false` **affiché** est suivi de `U+FE0F` | Sans ce sélecteur, le navigateur rend un **glyphe texte monochrome**, fin et pâle. Corrigé pour un seul caractère en 0.81.00 (l'info, mesurée à 4,2 px) ; l'audit du 01/08 en a trouvé **402 autres**, dont toute la barre d'action basse. Aucun test ne le regardait. Ignore les commentaires et comprend les deux écritures du fichier (caractère réel ou `\uXXXX`) |

## Tests unitaires

| Script | Couvre |
|---|---|
| `test-poly.js` | Moteur géométrique de la zone : point-dans-polygone, fraction >50 %, concave, trous, 50 % pile non retenu, normalisation du tracé |
| `test-export.js` | Formats WKT et KML **extraits du fichier réel** : ordre lon/lat, anneaux, trous, échappement XML |
| `test-roundtrip.js` | **Aller-retour** export → import : ce qu'on écrit, on doit savoir le relire. C'est ce test qui avait révélé que WCT ne relisait pas son propre CSV |
| `test-imp-detect.js` | Détecteur de l'onglet Import, surtout les cas **ambigus** : `.json` GeoJSON ou préréglages, `.kml` tracé ou zone, fichier mixte |
| `test-centrage.js` | Recadrage **sur ce qui reste visible** (hors volet WME, hors panneau, hors barre du bas) : le point doit atterrir au centre de la partie visible, au **pixel près et au zoom d'arrivée**. Vérifie aussi que le niveau de zoom se calcule sur la surface visible et non sur le canevas entier |
| `test-pave.js` | Découpage d'une zone en **lots** : un lot = un recadrage de carte et une entrée de file, donc le nombre de lots est ce que l'éditeur paie. Vérifie la règle « ce qui tient dans une vue ne fait qu'un lot » sur 200 dispositions, plus les bbox, les doublons et les cas dégénérés |
| `test-raccourcis.js` | La table des **raccourcis clavier** et ses règles de déclenchement, sur un DOM simulé. Verrouille deux garanties invisibles à la relecture : ⚠️ **aucun raccourci ne déclenche « Appliquer » ni « Vider »** (les deux seules actions irréversibles), et une frappe **dans un champ** ne déclenche jamais rien. Vérifie aussi qu'un raccourci d'onglet ne vaut que dans son onglet, et qu'un bouton grisé ne répond pas au clavier |
| `test-queue-total.js` | Le nombre de fermetures que la file va **réellement écrire** (`_queueTotalClosures`), extrait du fichier réel. Ce compte alimente la **seule barrière avant écriture** : jusqu'à la 1.02.00 la confirmation annonçait un nombre de *lots* (« Appliquer 3 lot(s) ? ») alors qu'une zone de 1 150 segments sur 21 occurrences en écrit **24 150** — et rien ne sait les défaire. Couvre les lignes supprimées à la main, les segments défaillants, et les entrées virages (dont `segIds` est vide) |
| `test-plage.js` | Les **bornes de la plage de dates** dans `buildClosureList`, extraite du fichier réel. C'est elle qui décide de ce qui sera **écrit dans WME**, et aucun test ne la regardait. La borne portait sur la **fin** de l'occurrence : toute fermeture passant minuit faisait donc perdre le **dernier jour de la plage, en silence** — « du 1er au 31 août, 21h→5h » ne posait que 30 nuits. Elle porte désormais sur le **début**, comme le filtre des jours de la semaine, celui des jours fériés et la boucle des jours calendaires, qui raisonnaient déjà tous sur le début. Vérifie que le dernier jour produit sa fermeture, que le débordement est **annoncé** et non corrigé en douce, et — **témoin** — qu'aucune annonce n'apparaît quand rien ne déborde : un avertissement permanent est un avertissement qu'on cesse de lire. Verrouille aussi que la fin de plage est **minuit LOCAL** : construite depuis `new JDate('AAAA-MM-JJ')`, que JS parse en UTC, elle tombait à 02:00 du matin en France l'été et laissait passer des départs hors plage. Couvre les deux onglets, les deux modes horaires et `+Jours`. Enfin il **croise deux calculs qui vivent à 6 000 lignes l'un de l'autre** : le nombre d'occurrences annoncé par l'avertissement « Répéter » doit être celui que la génération produit — c'est ce croisement qui a révélé la borne en UTC |
| `test-imp-route.js` | Ce qui se passe **après** la détection : le libellé du type reconnu, le filet à exceptions du point d'entrée, l'import de zone qui doit lire le fichier entier. Et surtout : **aucune portée ne masque la fonction de traduction `t()`** |

## Le module d'extraction

`lib-dico.js` **est le seul endroit qui sait lire le dictionnaire dans le fichier réel.** `check-keys.js`,
`check-help.js`, `audit.js` et `audit-ortho.js` en portaient chacun sa copie — quatre copies du même
scanner, dans un dossier dont ce README explique qu'une copie ne prouve rien. Et ce scanner était faux
sur trois points, découverts en le cassant pour de vrai le 2026-08-01 :

- il **ne sautait pas les commentaires**, donc `indexOf` pouvait trouver un `const D = …` écrit dans un
  commentaire *avant* le vrai dictionnaire (arrivé : les trois outils sont tombés d'un coup) ;
- un **guillemet ASCII isolé** dans une chaîne à apostrophes le faisait avaler le reste du fichier. Le
  userscript en contenait cinq — des abréviations hébraïques du type `ק״מ` — qui tenaient par un
  appariement fortuit ; le sixième a tout cassé ;
- il **ignorait les regex littérales**, dont les guillemets et accolades faussaient le comptage : il
  annonçait `_epsgFromPrj : 3675 lignes` pour une fonction qui en fait **quatre**.

`test-lib-dico.js` (21 tests) rejoue ces trois pannes. Ne pas réintroduire de scanner local.

`poly-core.js`, `imp-detect.js` et `poly-pave.js` sont les modules testés. **Aucun n'est plus une copie :
tous les trois extraient leur code du fichier réel.**
`poly-core.js` a été converti en dernier (2026-08-01). Motif : c'était le dernier module encore copié,
donc les 28 tests du moteur géométrique validaient du code qui n'était pas celui qui tourne. Sa copie
**avait d'ailleurs déjà divergé** — elle nommait les fonctions `_polyRings` et `_polyBBox` là où le
fichier réel dit `_polyRingsOf` et `_polyBBoxOf` (corps encore identiques, noms non). Les anciens noms
restent exportés comme alias vers le code réel. Il extrait le bloc `POLY_INSIDE_FRAC` → fin de
`_polyInsideFrac`, **seuils compris** : un seuil changé dans le userscript est donc vu par les tests.
`imp-detect.js` **était** une copie lui aussi — il extrait désormais la fonction du fichier réel
(2026-07-26). Motif : le bug 0.97.01 vivait à deux lignes du code copié, dans une zone qu'aucun
test n'atteignait. Une copie ne prouve rien.
`poly-pave.js` extrait lui aussi (2026-07-30). Motif : le pavage était enfoui dans
`_polyLoadAndSelect`, qui parle au SDK et déplace la carte — donc intestable, et personne n'a vu
qu'une zone tenant dans un écran ressortait en trois lots. Il en a été sorti en fonction pure.
`centrage.js` extrait `_decalageVisible` et `_zoomPourTaille` (2026-07-30). La **mesure** des
rectangles (volet WME, panneau, barre du bas) ne se teste pas hors navigateur — mais le **calcul**,
lui, décide où la carte atterrit : c'est celui-là qui posait 620 px en dur et ignorait le volet.

⚠️ **Le piège du masquage de `t()`** — la fonction de traduction est une variable globale nommée
`t`. Une fonction qui prend un paramètre `t` (ou déclare un `const t`) **et** appelle `t('clé')`
dans son corps lève un `TypeError` à l'exécution seulement, jamais à `node --check`. C'est ce qui a
rendu l'onglet Import totalement muet en 0.97.00 : l'exception partait dans une promesse que
personne n'attendait. `test-imp-route.js` balaie tout le fichier pour ça.

## Audit

| Script | Cherche |
|---|---|
| `audit.js` | Interpolations HTML non échappées, clés i18n orphelines ou manquantes, ids dupliqués, `catch` muets, `setInterval`, restes de mise au point |
| `audit-catch.js` | Classe les `catch` vides **par risque** : avaler l'échec d'une écriture n'est pas avaler celui d'un cadrage optionnel |
| `audit-ortho.js` | Orthographe des **textes affichés** (pas des commentaires) : accents, doubles espaces, apostrophes droites, ponctuation française |
| `audit-tooltips.js` | Éléments interactifs sans `title`. Règle du projet : aucun `button`, `select` ou `textarea` sans infobulle |

⚠️ `audit.js` signale des interpolations HTML « suspectes » qui sont, pour la plupart, **échappées
en amont** (`descHtml`, `nameHtml`…). Il désigne des endroits à relire, pas des failles : vérifier
d'où vient la donnée avant de conclure.

## Après toute édition du userscript

```bash
node --check ../WME_ClosuresToolkit.user.js
git diff --numstat        # plus de lignes modifiées que demandé = corruption
```

⚠️ **Ne jamais éditer le userscript via PowerShell `Set-Content`** : il ajoute un BOM (et peut
casser l'UTF-8). Un BOM en tête menace le parsing du bloc `// ==UserScript==`. Et `Get-Content -Raw
-Encoding UTF8` **ne peut pas le détecter**, puisqu'il le retire à la lecture — seul `git diff` le
montre. Éditer avec l'outil d'édition, ou `node fs.readFileSync/writeFileSync(..., 'utf8')`.
