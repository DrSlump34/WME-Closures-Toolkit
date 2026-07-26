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

## Tests unitaires

| Script | Couvre |
|---|---|
| `test-poly.js` | Moteur géométrique de la zone : point-dans-polygone, fraction >50 %, concave, trous, 50 % pile non retenu, normalisation du tracé |
| `test-export.js` | Formats WKT et KML **extraits du fichier réel** : ordre lon/lat, anneaux, trous, échappement XML |
| `test-roundtrip.js` | **Aller-retour** export → import : ce qu'on écrit, on doit savoir le relire. C'est ce test qui avait révélé que WCT ne relisait pas son propre CSV |
| `test-imp-detect.js` | Détecteur de l'onglet Import, surtout les cas **ambigus** : `.json` GeoJSON ou préréglages, `.kml` tracé ou zone, fichier mixte |
| `test-imp-route.js` | Ce qui se passe **après** la détection : le libellé du type reconnu, le filet à exceptions du point d'entrée, l'import de zone qui doit lire le fichier entier. Et surtout : **aucune portée ne masque la fonction de traduction `t()`** |

`poly-core.js` et `imp-detect.js` sont les modules testés. ⚠️ `poly-core.js` est une **copie**
du moteur intégré au userscript : en cas de modification du moteur, reporter le changement ici,
sinon le test valide du code qui n'est plus celui qui tourne.
`imp-detect.js` **était** une copie lui aussi — il extrait désormais la fonction du fichier réel
(2026-07-26). Motif : le bug 0.97.01 vivait à deux lignes du code copié, dans une zone qu'aucun
test n'atteignait. Une copie ne prouve rien.

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
