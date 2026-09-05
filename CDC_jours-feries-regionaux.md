# Cahier des charges — jours fériés régionaux

Rédigé le 05/09/2026. Chantier à mener en session dédiée.
Origine : question de `maporaptor` (Australie) sur Discuss `t405542`, le 05/09/2026 à 11 h 18 UTC —
« *We have different public holidays based on the state, territory or national. How does the script
work out these public holidays?* »

---

## 1. Le défaut

Le script demande à `date.nager.at` les jours fériés **du pays** du segment, et **garde toutes les
dates rendues** sans regarder si le férié est national ou limité à un État.

Mesuré le 05/09/2026 sur l'API, année 2026 :

| Pays | fériés rendus | dont **régionaux** |
|---|---|---|
| **FR** | 11 | **0** |
| AU | 27 | **21** |
| CH | 33 | **29** |
| ES | 32 | **22** |
| CA | 31 | **23** |
| DE | 19 | **10** |
| GB | 14 | **9** |
| US | 17 | **6** |

Exemples australiens : `Labour Day → AU-WA`, `Canberra Day → AU-ACT`, `Adelaide Cup Day → AU-SA`,
`Eight Hours Day → AU-TAS`. L'`Anzac Day` arrive même en **trois entrées** de dates différentes
selon les États.

**Conséquence** : coché « Sauf jours fériés », un éditeur australien perd 21 dates qui ne sont pas
fériées chez lui — des nuits ouvrables retirées de son chantier.

⭐ **Le sens de l'erreur compte, et il est le bon.** Aujourd'hui le filtre **sur-filtre**. Le sens
inverse — laisser passer un jour férié réel — est celui que le commentaire de `getHolidaysForRange`
décrit comme le danger : « *sur un chantier de décembre coché « sauf jours fériés », cela ferme le
25 décembre et le 1er janvier, les deux nuits où il ne fallait pas* ». **La correction ne doit pas
faire basculer le défaut de ce côté-là.**

🔴 **Pourquoi ça n'a jamais été vu** : la France a **0 férié régional sur 11**. Le défaut est
strictement invisible depuis notre position.

---

## 2. L'état du code aujourd'hui

Tout est dans `WME_ClosuresToolkit.user.js`, version **1.14.04**.

| Ligne | Élément | Rôle |
|---|---|---|
| 45 | `@connect date.nager.at` | déjà déclaré, **rien à changer** |
| 7290 | `getSegmentCountry(id)` | `sdk.DataModel.Segments.getAddress().country.abbr` |
| 7297 | `holidayCache` | clé `'FR-2026'`, valeur = **tableau de dates** |
| 7299 | `fetchHolidays(cc, year)` | **`data.map(h => h.date)` ← le défaut est ici** |
| 7326 | `getHolidaysForRange(cc, start, end)` | concatène les années ; rend **`null`** si une seule année manque |
| 8073 | `buildClosureList()` | appelle le moteur |
| 8079 | `pays: () => …` | résolution **paresseuse** du pays, commentée exprès |
| 8081 | `feries: getHolidaysForRange` | passé au moteur |
| 8086 | `_creneauxAvis(…, 'wct-holidays-warn')` | rend les avis du moteur |
| 8106 | `readConfig().holidayMode` | `'none' \| 'skip' \| 'only' \| 'add'` |
| 10309 | `updateCountryInfo()` | active/désactive les 3 cases, gère le cas multi-pays |
| 13973-13976 | IHM | les 3 cases `#wct-hol-skip` / `#wct-hol-only` / `#wct-hol-add`, puis `#wct-holidays-warn` |

Côté moteur : `lib/WMECreneaux.js`, ligne 143 — contrat
`feries: async (pays, debut, fin) => string[] de 'AAAA-MM-JJ', ou null`.

---

## 3. Ce qu'on veut

Un sélecteur de subdivision, **alimenté par l'API elle-même**, qui n'apparaît que là où il sert.

---

## 4. Décisions déjà prises, et pourquoi

**D1 — `lib/WMECreneaux.js` n'est PAS touché.** La subdivision se résout côté userscript, dans
`getHolidaysForRange`, avant que le moteur ne soit appelé. Le contrat `feries(pays, debut, fin)`
reste identique.
⇒ pas de `node tools/sync-lib-creneaux.js`, pas de `test-plage.js` à retoucher, aucun risque sur un
moteur qui vient d'être extrait en bibliothèque partagée (1.14.03).

**D2 — Aucun dictionnaire codé en dur.** La liste des subdivisions se déduit de l'**union des
`counties`** de la réponse de l'API. Rien à maintenir quand un pays change ses fériés.

**D3 — Pas de présélection automatique depuis WME.** Mesuré le 05/09/2026 :
`sdk.DataModel.Segments.getAddress().state` rend un **nom libre** (`{id, name: "Paris"}`), **jamais**
un code ISO. Faire correspondre « New South Wales » à `AU-NSW` imposerait le dictionnaire que D2
écarte, avec la garantie de vieillir en silence.

**D4 — Le défaut est « Tout le pays »**, c'est-à-dire le comportement actuel. Personne n'est
surpris, aucun préréglage existant ne change de sens, et le sens de l'erreur reste le sur-filtrage.

**D5 — Le sélecteur ne s'affiche que si le pays a au moins un férié régional sur la période.**
En France il ne s'affichera jamais.

---

## 5. À trancher — je ne l'ai pas décidé

**Q1 — Quand peupler le sélecteur ?** C'est la vraie question de conception. Connaître les
subdivisions demande un appel réseau, or le pays est résolu **paresseusement** parce que
`buildClosureList` tourne **à chaque frappe** pour l'aperçu (commentaire ligne 8074).
*Proposition* : peupler au **cochage** d'une des trois cases, et re-peupler si le pays de la
sélection change alors qu'une case est déjà cochée. Jamais à la sélection de segments seule.

**Q2 — Que dit `#wct-holidays-warn` quand on est sur « Tout le pays » dans un pays à fériés
régionaux ?** Aujourd'hui il annonce « N jour(s) férié(s) exclu(s) », ce qui est vrai mais ne dit
pas que des fériés d'autres régions sont dans le lot.

**Q3 — Le libellé des options.** L'API ne rend que le **code** (`AU-NSW`). L'afficher tel quel est
sec mais honnête ; y mettre un nom lisible contredit D2.

**Q4 — La subdivision doit-elle apparaître dans le récapitulatif des préréglages ?**

---

## 6. Le travail, point par point

1. **`fetchHolidays` (7299)** — mettre en cache `{date, global, counties}` au lieu de la seule date.
2. **Nouvelle fonction `getHolidayRegions(cc, start, end)`** — l'union triée des `counties`
   rencontrés, ou `[]` si le pays n'en a aucun. C'est elle qui peuple le sélecteur.
3. **`getHolidaysForRange(cc, start, end, region)`** — filtrer : `global === true`, ou
   `counties` contenant `region`. Sans `region`, tout est retenu (D4).
4. **`buildClosureList` (8073)** — capturer la région lue dans le DOM au moment de l'appel,
   sans casser la paresse (Q1).
5. **IHM (13976)** — un `<select id="wct-hol-region">` sous les trois cases, `display:none` par
   défaut, à côté de `#wct-holidays-warn`.
6. **`readConfig` (8106)** — nouvelle clé `holidayRegion`.
7. **`applyConfig`** — restaurer, avec la règle de compatibilité du P3.
8. **`updateCountryInfo` (10309)** — masquer et vider le sélecteur en multi-pays, comme les
   trois cases y sont déjà désactivées.
9. **i18n — 8 langues** : `fr, en, he, it, de, es, pt-BR, pt-PT`, **639 clés chacune** à ce jour
   (mesuré par `check-keys.js`). Clés à ajouter : libellé du sélecteur, option « tout le pays »,
   et l'avertissement de Q2 s'il est retenu.
10. **En-tête** — bumper `@version` : **1.14.04 → 1.15.00** (changement fonctionnel, pas un
    correctif).

---

## 7. Les pièges — à lire avant d'écrire une ligne

**P1 — Le troisième état est le cœur de cette fonction, ne pas l'abîmer.**
`getHolidaysForRange` rend **`null`** quand une année n'a pas pu être obtenue, et le moteur affiche
alors « *filtre NON appliqué* ». Un pays **sans** férié régional rend légitimement `[]`. Une panne
réseau rend `null`. **Ce sont deux choses différentes et il ne faut jamais confondre l'une avec
l'autre** — c'est exactement le défaut corrigé le 01/08/2026, documenté en commentaire ligne 7320.

**P2 — Préréglages existants.** Aucun ne porte `holidayRegion`. Clé absente ⇒ « tout le pays ».

**P3 — Préréglages PARTAGÉS.** Le script sait exporter, importer et **charger des préréglages depuis
une URL** (partage entre éditeurs). Un préréglage venu d'un éditeur australien peut porter
`AU-NSW` et atterrir chez un Français.
⇒ **Règle** : si la région enregistrée ne figure pas dans les subdivisions du pays courant, retomber
sur « tout le pays » — **et le dire**, jamais l'appliquer ni l'ignorer en silence.

**P4 — Ne pas casser la résolution paresseuse du pays** (commentaire ligne 8074) : ce n'est pas une
optimisation gratuite, elle évite d'interroger la sélection WME à chaque frappe.

**P5 — Le cache change de forme.** `holidayCache` portera des objets et non plus des chaînes :
greper `holidayCache` et vérifier qu'aucun autre appelant n'attend un tableau de dates.

**P6 — RTL.** L'hébreu fait partie des 8 langues et le projet a `check-rtl.js`. Un `<select>` neuf
doit y passer.

---

## 8. Contrôles à passer

```
node tools/check-keys.js          # parité des 8 langues — bloquant
node tools/check-cles-mortes.js
node tools/check-lib-creneaux.js  # doit rester IDENTIQUE : D1 dit qu'on ne touche pas la lib
node tools/check-rtl.js
node tools/check-entete.js        # version
node tools/test-plage.js          # non-regression du moteur de creneaux
node tools/check-demarrage.js     # compiler n'est pas demarrer
```

🔴 **Et le seul contrôle qui tranche vraiment : l'essai dans WME, sur un pays à fériés régionaux**
(Australie ou Suisse). Personne d'autre que l'auteur ne peut le faire.

---

## 9. Publication

Procédure habituelle : GitHub, GreasyFork, Discuss.
⏳ **Occasion à saisir** : la capture GreasyFork porte encore la **1.14.02** — la changer impose de
publier une version, et c'en est une.
📣 **Et revenir vers `maporaptor` dans `t405542`** pour dire que c'est livré : il a posé la question,
il mérite la réponse.

---

## 10. Déjà fait avant l'ouverture du chantier

Réponse à `maporaptor` annonçant le diagnostic et le travail en cours — **texte prêt, non posté**
au moment où ces lignes sont écrites. Il annonce « *let you pick your state or territory, with
whole country as the default* » : le chantier doit tenir cette promesse, ou la corriger avant.
