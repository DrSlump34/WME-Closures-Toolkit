# Relevé de la codification Waze des pays et des états

Relevé fait le 05/09/2026. Lecture seule : aucune écriture sur la carte, aucun enregistrement.

**Question de départ** : existe-t-il, dans le Drive ou les courriels, un tableur donnant la
codification Waze (les identifiants numériques) des pays **et** des états — vue internationale,
pas seulement la France ?

---

## 1. Ce qui existait déjà — et ce qui manquait

Deux tableurs partagés couvrent les **pays**, aucun ne couvre les **états** hors de France.

| Tableur | Contenu | Portée |
|---|---|---|
| **Waze Countries Numbers** (Sebiseba) — `1I79WdWm7-ZKejKAhrEbl3H93RIdlQjH5cTQxV8ph_xk` | onglet `Countries` : ID Waze / nom / indicatif téléphonique | mondial |
| ↳ même fichier | onglet `French States` : n° de département / nom / **ID Waze** / polygone WKT | France seule |
| ↳ même fichier | onglet `French Regions` : nom / polygone WKT, **sans ID** | France seule |
| **Countries setting panel** (compilé par @iredisni) — `14JRARp38z9-0Ylx6bX-CRCwHggwvgIh446_ygXO9I6s` | code ISO, country id, nom, abréviation, conduite à gauche, **serveur**, rangs minimum par fonctionnalité | mondial |

Écartés après lecture : *[External Waze Leadership] Map Editor Configurations* (configurations par
pays, aucun identifiant) et *France - Cities list (with states)* (villes françaises).

⭐ **Le contrôle qui tranche** : plutôt que de chercher les fichiers par leur **nom**, on cherche
dans tout le Drive une **valeur** connue — `1685015`, l'identifiant de l'Ain. Quatre fichiers
seulement la contiennent, tous français. Un fichier mondial des états aurait forcément contenu
cette valeur ; il n'existe pas.

---

## 2. Le moyen de les relever soi-même

Il n'a pas fallu balayer la carte : **WME publie lui-même l'adresse du service** qui rend ces
listes. Dans la console de l'éditeur :

```js
W.Config.paths
```

Deux entrées répondent à la question :

```
locationSearchCountries : /row-Descartes/app/LocationSearch/Countries
locationSearchStates    : /row-Descartes/app/LocationSearch/States
```

Ce sont deux `GET`, en lecture pure, joués avec les cookies de la session (`credentials:'include'`).

### Les paramètres

| Appel | Paramètre | Réponse |
|---|---|---|
| `LocationSearch/Countries` | aucun | `{"countries":[{"id":73,"name":"France","abbr":"FR","env":"ROW"}, …]}` |
| `LocationSearch/States` | **`countryId`** obligatoire | `{"countries":[…], "states":[{"id":1685015,"name":"Ain","countryId":73}, …]}` |

🔴 Le nom du paramètre est **`countryId`**, cette casse exactement. `countryID`, `country_id` ou
l'absence de paramètre renvoient tous un **HTTP 406** avec
`"Missing parameter value for 'countryId'"`.

### Les trois serveurs

Un seul serveur ne suffit pas : chaque environnement ne connaît que ses propres pays. Les trois
préfixes vivent sur `www.waze.com`, donc un `fetch` depuis WME les atteint tous les trois sans
question d'origine.

| env | préfixe | pays rendus |
|---|---|---|
| ROW | `/row-Descartes` | 248 |
| NA | `/Descartes` | 8 (dont **United States** et **Canada**) |
| IL | `/il-Descartes` | 3 (Israel, Gaza Strip, West Bank) |

⚠️ Interrogé depuis le serveur ROW seul, l'appel `Countries` rend 248 pays **tous marqués `ROW`** :
les États-Unis n'y sont simplement pas. Rien ne signale l'absence — c'est une liste complète en
apparence. C'est le piège principal de ce relevé.

### Ce que le modèle WME donne (et ne donne pas)

`W.model.states` et `W.model.countries` existent et portent bien la même donnée
(`{countryID, id, name, isDefault, geoJSONGeometry}`), **mais uniquement pour la zone chargée** :
carte centrée sur l'Australie, le modèle contenait 1 pays et 3 états. Utile pour la zone courante,
inutilisable pour un inventaire mondial — d'où le passage par le service.

---

## 3. Les résultats

Relevé des 259 pays des trois serveurs, 6 requêtes en parallèle, **0 erreur**, quelques secondes.

- **259 pays** — 248 ROW + 8 NA + 3 IL
- **3 534 états** au total
- **33 pays seulement possèdent des états** ; les **226 autres n'en ont aucun**

### Les 33 pays qui ont des états

| Pays | env | countryId | états | plage des identifiants |
|---|---|---|---|---|
| Russia | ROW | 186 | 2 267 | 1839601 – 1841877 |
| United Kingdom | ROW | 234 | 181 | 1692900 – 1693080 |
| Belarus | ROW | 37 | 118 | 2055451 – 2055568 |
| **France** | ROW | **73** | **96** | **1685000 – 1685095** |
| Philippines | ROW | 178 | 82 | 1944701 – 1944782 |
| Turkey | ROW | 227 | 81 | 575583 – 576139 |
| Czech Republic | ROW | 57 | 77 | 1958351 – 1958427 |
| Slovakia | ROW | 196 | 72 | 1959301 – 1959372 |
| United States | **NA** | 235 | 51 | 100000001 – 100000053 |
| Romania | ROW | 185 | 42 | 1821901 – 1821942 |
| Mexico | ROW | 145 | 38 | 1700000 – 1700032 |
| India | ROW | 101 | 36 | 700008 – 1953251 |
| Indonesia | ROW | 102 | 34 | 1775700 – 1793541 |
| Colombia | ROW | 49 | 33 | 1887701 – 1887733 |
| Bulgaria | ROW | 34 | 28 | 1862901 – 1862928 |
| Brazil | ROW | 30 | 27 | 1661000 – 1661026 |
| Ireland | ROW | 105 | 26 | 2121286 – 2121311 |
| Switzerland | ROW | 216 | 26 | 1867901 – 1867926 |
| Argentina | ROW | 10 | 24 | 497000 – 497052 |
| Italy | ROW | 107 | 20 | 1725700 – 1725719 |
| Portugal | ROW | 181 | 20 | 2112177 – 2112234 |
| Finland | ROW | 251 | 19 | 2121661 – 2121679 |
| Spain | ROW | 203 | 19 | 1605300 – 1605318 |
| Germany | ROW | 81 | 16 | 1796401 – 1796416 |
| Malaysia | ROW | 135 | 16 | 1752400 – 1898479 |
| Poland | ROW | 180 | 16 | 1814931 – 1814946 |
| Chile | ROW | 45 | 15 | 1937691 – 1937705 |
| Estonia | ROW | 67 | 15 | 2120983 – 2120997 |
| Canada | **NA** | 40 | 13 | 43002 – 64137 |
| Australia | ROW | 13 | 9 | 2058691 – 2058699 |
| Austria | ROW | 14 | 9 | 1809601 – 1809609 |
| Bangladesh | ROW | 19 | 7 | 1735745 – 1740015 |
| Antarctica | ROW | 8 | 1 | 1852700 |

### Ce que ces chiffres apprennent

🔴 **Les identifiants d'état ne se déduisent pas.** Chaque pays occupe une plage qui lui est propre,
sans règle commune : la France est en `16850xx`, les États-Unis en `1000000xx`, le Canada en
`43002 – 64137`, la Turquie en `575xxx`. Pire, certaines plages sont **éclatées** (Inde
`700008 – 1953251`, Malaisie `1752400 – 1898479`) : on ne peut pas retrouver le pays à partir de
l'identifiant, ni l'inverse. Il faut la table.

⚠️ **« Sans état » ne veut pas dire « données manquantes ».** Belgique, Pays-Bas, Maroc, Israël et
les DOM répondent un **HTTP 200** avec `"states":[]` — un vide déclaré, pas une panne. Contrôlé
corps de réponse à l'appui, pas au comptage.

⚠️ **Les DOM français sont des pays, pas des états.** Réunion (184), Guadeloupe (88), Martinique
(141), Mayotte (144), Guyane (74) ont chacun leur `countryId` et **zéro état**. Les 96 états
français sont les seuls départements métropolitains, Corse-du-Sud et Haute-Corse comprises.

✅ Contrôles de vraisemblance passés : États-Unis 51 (50 + District of Columbia), Canada 13
(10 provinces + 3 territoires), Suisse 26 cantons, Allemagne 16 Länder, Italie 20 régions,
Brésil 27, France 96. Aucun nom vide dans les 3 534 lignes.

---

## 4. Le script, à coller dans la console WME

Ouvrir l'éditeur, attendre le chargement complet, puis coller dans la console. Le script ne fait
que des `GET` et termine en téléchargeant deux fichiers CSV.

```js
(async () => {
  const BASES = { ROW: '/row-Descartes', NA: '/Descartes', IL: '/il-Descartes' };
  const pays = [], etats = [], erreurs = [];

  for (const [env, base] of Object.entries(BASES)) {
    const j = await (await fetch(base + '/app/LocationSearch/Countries',
                                 { credentials: 'include' })).json();
    j.countries.forEach(c => pays.push({ ...c, base }));
  }

  const file = pays.slice();
  const worker = async () => {
    while (file.length) {
      const c = file.shift();
      try {
        const r = await fetch(c.base + '/app/LocationSearch/States?countryId=' + c.id,
                              { credentials: 'include' });
        const j = await r.json();
        (j.states || []).forEach(s => etats.push(
          { env: c.env, countryId: c.id, country: c.name, stateId: s.id, state: s.name }));
      } catch (e) { erreurs.push({ id: c.id, name: c.name, err: String(e) }); }
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));

  etats.sort((a, b) => a.country.localeCompare(b.country) || a.state.localeCompare(b.state));

  const nb = id => etats.filter(s => s.countryId === id).length;
  const csvPays = 'env;countryId;country;abbr;nbStates\n' +
    pays.map(c => [c.env, c.id, c.name, c.abbr, nb(c.id)].join(';')).join('\n');
  const csvEtats = 'env;countryId;country;stateId;state\n' +
    etats.map(s => [s.env, s.countryId, s.country, s.stateId, s.state].join(';')).join('\n');

  const save = (nom, txt) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['\uFEFF' + txt], { type: 'text/csv;charset=utf-8' }));
    a.download = nom;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  save('waze_pays.csv', csvPays);
  save('waze_etats.csv', csvEtats);

  console.log('pays', pays.length, '· états', etats.length, '· erreurs', erreurs.length);
})();
```

Le `U+FEFF` en tête de fichier est la marque d'ordre des octets : sans elle, Excel ouvre le CSV en
ANSI et massacre les accents comme le cyrillique — la Russie pèse 2 267 des 3 534 lignes.

✅ **Ce bloc a été exécuté tel quel** le 05/09/2026, dans l'éditeur, téléchargement neutralisé :
259 pays, 3 534 états, 0 erreur, `waze_pays.csv` 6 171 octets et `waze_etats.csv` 256 057 octets.
Ce n'est pas une relecture de code — le geste a été joué.

---

## 5. Ce que cette codification casse — mesuré sur WCT le 05/09/2026

Ce relevé a été fait pour inventorier. Il a servi à autre chose : établir l'**ampleur** d'un défaut
du filtre des jours fériés de WCT, qui interroge `date.nager.at` — une API en **ISO 3166-1**.

🔴 **Les `abbr` de Waze sont du FIPS 10-4, pas de l'ISO.** Ce n'est pas un détail d'encodage : sur
les 259 pays relevés, **68 portent un `abbr` qui est un code ISO valide désignant un AUTRE pays**.
L'API répondait alors un HTTP 200, avec un calendrier complet et faux, sous un message qui
affirmait « N jour(s) férié(s) exclu(s) ». Rien ne signalait l'erreur.

| Filtre des jours fériés | avant (v1.14.04) | après (v1.15.00) |
|---|---|---|
| filtre **juste** | 79 pays | **193** |
| **calendrier d'un autre pays** | **68** | **0** |
| non appliqué, et l'interface le dit | 112 | 66 |

**0 régression** sur les 259, **114 pays** passent d'un filtre faux ou absent à un filtre juste.

### Les croisements

Ils ne sont pas aléatoires : les deux codifications se marchent dessus par paires, et parfois en
cycles fermés.

| | Waze dit | l'API comprend |
|---|---|---|
| **Sénégal** | `SG` | Singapour |
| **Singapour** | `SN` | Sénégal |

⭐ **Une inversion parfaite** : chacun recevait exactement le calendrier de l'autre.

Et un **cycle de quatre**, où chaque pays reçoit celui du suivant :
`Niger (NG) → Nigeria (NI) → Nicaragua (NU) → Niue (NE) → Niger`.

Les cas qui touchent nos langues et nos voisins :

| Pays | Waze | reçu | fériés réels | retrouvés | **laissés ouverts** |
|---|---|---|---|---|---|
| **Autriche** | `AU` | **Australie** | 20 | 5 | **15** |
| **Suisse** | `SZ` | Eswatini | 23 | 7 | **16** |
| **Allemagne** | `GM` | Gambie | 19 | 7 | **12** |

Autres collisions notables : `CH` = **China** chez Waze (Suisse en ISO), `ES` = El Salvador
(Espagne), `GB` = **Gabon** (Royaume-Uni), `RS` = Russie (Serbie), `ZA` = Zambie (Afrique du Sud),
`AS` = Australie (Samoa américaines).

### La correction, et pourquoi elle ne code aucune table

⭐ **La correspondance se fait sur le NOM, pas sur le code.** Mesuré : `getAddress().country.name`
est rendu **en anglais** par WME même quand l'interface est en français (« Australia », pas
« Australie »). En face, `date.nager.at/api/v3/AvailableCountries` donne 204 couples
`{countryCode, name}` — et `Intl.DisplayNames` complète, sans rien maintenir.

⚠️ **Le repli sur l'`abbr` est écarté par principe.** Ne rien rendre fait afficher « filtre non
appliqué » : un aveu. Rendre l'`abbr` ferme des routes le mauvais jour : un mensonge.

🔴 **Deux pays où la correction elle-même faisait régresser.** `HK` (Waze écrit « Hong Kong
(China) », l'API « Hong Kong ») et `VC` (« St. Vincent » contre « Saint Vincent ») avaient un
`abbr` juste et un nom qui ne s'appariait pas. Deux règles d'**écriture** les rattrapent — ignorer
les parenthèses, lire `St.` comme `Saint` — et rattrapent aussi `KN` et `PM`.

⭐ **Ces règles sont volontairement timides.** Elles ne rapprochent pas « Macedonia » de « North
Macedonia », ni « Swaziland » d'« Eswatini ». Une règle de sous-chaîne les aurait attrapés — et
aurait confondu **« Congo » avec « DR Congo »**, deux voisins aux calendriers différents.

### Ce que le relevé des états a tranché, lui

Le service `LocationSearch/States` rend `{id, name, countryId}` — **aucun code ISO 3166-2**. C'est
le quatrième niveau où on le vérifie, après le SDK, le modèle client et la réponse brute de
`Features` : le code n'existe nulle part.
⇒ **Aucune présélection automatique de la région n'est possible** sans une table écrite à la main.
Deviner par initiales serait faux : le Canada a **cinq** provinces en N (`NL`, `NT`, `NS`, `NB`,
`NU`). WCT affiche donc le nom de l'état à côté du sélecteur — « segment en Ontario » — et laisse
l'éditeur choisir.

---

## 6. Ce qui reste ouvert

- Le relevé ne rend **pas la géométrie** des états. `LocationSearch/States` donne
  `{id, name, countryId}` et rien d'autre ; les polygones ne viennent que du modèle chargé
  (`geoJSONGeometry`) ou de l'onglet `French States` du tableur, pour la France seule.
- Rien n'a été publié ni partagé : ce relevé vit ici. S'il doit servir à la communauté, reste à
  décider où il est déposé et qui le tient à jour.
