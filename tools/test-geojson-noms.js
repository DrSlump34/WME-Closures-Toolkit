#!/usr/bin/env node
// test-geojson-noms.js — un tracé importé porte-t-il un NOM, et une couleur qui veut dire
// quelque chose ?
//
// POURQUOI CE CONTROLE EXISTE (2026-08-28)
// ----------------------------------------
// MisterLogik, sur le GeoJSON du Triathlon de Dinard : « Tu sembles avoir gere des
// couleurs des traces, mais pas les noms ». Les deux moities de la phrase etaient a
// corriger, et pas dans le sens qu on croit :
//   - les NOMS : parseGeoJSON ne cherchait que `name | Name | nom | title | label`. Le
//     fichier nomme ses 28 traces par `epreuve` — aucune des cinq. Resultat a l ecran :
//     « TDCE2026-parcours (1/28) » … « (28/28) », vingt-huit lignes indiscernables.
//   - les COULEURS : elles ne venaient PAS du fichier, qui n en contient aucune. C etait
//     le roulement interne sur 8 teintes, tire 28 fois — la meme couleur revenait tous
//     les 8 traces, et deux tronçons d une meme epreuve ressortaient differents.
//
// CE QUE CE CONTROLE MESURE, ET SUR QUOI
// Sur les TROIS GeoJSON reels du dossier Exemples, qui nomment leurs traces de trois
// façons differentes. Un jeu fabrique pour l occasion ne prouverait que lui-meme.
//
// ⚠️ TEMOIN DE MORSURE OBLIGATOIRE. Un `_traceNameField` qui rendrait n importe quoi
// passerait « les noms ne sont plus le nom de fichier » des lors qu il rend un champ.
// On verifie donc aussi qu il rend le champ ATTENDU, et que le regroupement par couleur
// distingue vraiment (une couleur unique pour tout le fichier serait « un groupe », et
// satisferait un test naif).
'use strict';
const fs = require('fs');
const path = require('path');

const RACINE  = path.join(__dirname, '..');
const FICHIER = path.join(RACINE, 'WME_ClosuresToolkit.user.js');
const src = fs.readFileSync(FICHIER, 'utf8');

let ok = 0, ko = 0;
const dit = (b, quoi, detail) => {
    console.log('  ' + (b ? 'ok  ' : 'KO  ') + ' ' + quoi + (detail ? '   ' + detail : ''));
    b ? ok++ : ko++;
};

// ── Extraction du fichier reel ─────────────────────────────────────────────
const extraire = (debut, quoi) => {
    const i = src.indexOf(debut);
    if (i < 0) { console.error('ECHEC : ' + quoi + ' introuvable (' + debut + ')'); process.exit(2); }
    const j = src.indexOf('\n};', i);
    if (j < 0) { console.error('ECHEC : fin de ' + quoi + ' introuvable'); process.exit(2); }
    return src.slice(i, j + 3);
};
const blocNom  = extraire('const TRACE_NAME_FIELDS', 'TRACE_NAME_FIELDS / _traceNameField');
const blocAttr = extraire('const _traceAssignColors', '_traceAssignColors');
const blocCoul = extraire('const _traceColorProp', '_traceColorProp');
const blocGeo  = extraire('const parseGeoJSON = (filename, jsonText) => {', 'parseGeoJSON');

// `_pe` construit les messages d erreur multilingues : hors sujet ici, mais parseGeoJSON
// l appelle. On le remplace par un marqueur — si un jour une ERREUR remonte la ou on
// n en attend pas, elle sera lisible dans la sortie au lieu de faire planter le test.
const _pe = (fr) => 'ERREUR:' + fr;
let API;
try {
    API = new Function('_pe', [blocNom, blocAttr, blocCoul, blocGeo,
        'return { TRACE_NAME_FIELDS, _traceNameField, _traceAssignColors, _traceColorProp, parseGeoJSON };'].join('\n'))(_pe);
} catch (e) {
    console.error('ECHEC : le bloc extrait ne s evalue pas — ' + e.message);
    process.exit(2);
}
const { TRACE_NAME_FIELDS, _traceNameField, _traceAssignColors, _traceColorProp, parseGeoJSON } = API;

// Le roulement reel du script : 8 teintes, puis on recommence. Reproduit ici pour que la
// regle soit jouee dans ses vraies conditions — c est le retour a la premiere couleur au
// 9e trace qui rend le regroupement souhaitable, et c est lui qui doit rester possible.
const PALETTE = ['#ff1744','#00e5ff','#76ff03','#ffea00','#ff00ff','#1de9b6','#ff9100','#651fff'];
const roulement = () => { let i = 0; return () => PALETTE[i++ % PALETTE.length]; };

const lire = (nom) => {
    const p = path.join(RACINE, 'Exemples', nom);
    if (!fs.existsSync(p)) { console.error('ECHEC : exemple absent — ' + p); process.exit(2); }
    return fs.readFileSync(p, 'utf8');
};

// ── 1. Le champ de nom, sur trois fichiers qui nomment autrement ───────────
console.log('\n— Le champ de nom est trouve dans TROIS fichiers reels —');
const CAS = [
    { fichier: 'TDCE2026-parcours.geojson',                    champ: 'epreuve',
      pourquoi: 'le cas signale par MisterLogik : aucun des 5 champs cherches avant' },
    { fichier: 'Untitled.geojson',                             champ: 'name',
      pourquoi: 'export GPX classique — le comportement d avant doit etre conserve' },
    { fichier: 'parcours para marathon 19-08-2024 16-05.geojson', champ: null,
      pourquoi: '829 features, attributs metier : on note ce qui sort' },
];
const parsed = {};
for (const cas of CAS) {
    const texte = lire(cas.fichier);
    const gj = JSON.parse(texte);
    const feats = (gj.features || []).filter(f => f.geometry &&
        (f.geometry.type === 'LineString' || f.geometry.type === 'MultiLineString'));
    const champ = _traceNameField(feats.map(f => f.properties));
    parsed[cas.fichier] = { texte, feats, champ };
    if (cas.champ === null) {
        dit(champ !== null, cas.fichier + ' : un champ est trouve', '→ ' + champ + '   (' + cas.pourquoi + ')');
    } else {
        dit(champ === cas.champ, cas.fichier + ' : champ = ' + cas.champ,
            '→ ' + champ + '   (' + cas.pourquoi + ')');
    }
}

// ── 2. Les traces portent un vrai nom, pas le nom du fichier ──────────────
console.log('\n— Les traces ne s appellent plus « fichier (n/total) » —');
const tdce = parseGeoJSON('TDCE2026-parcours.geojson', parsed['TDCE2026-parcours.geojson'].texte);
dit(tdce.length === 28, '28 traces lues', '(' + tdce.length + ')');
const nomsBruts = tdce.map(t => t.group);
dit(!nomsBruts.some(n => /TDCE2026-parcours/.test(n)),
    'aucun trace ne retombe sur le nom de fichier');
dit(nomsBruts.includes('Swimrun Long') && nomsBruts.includes('Trail 11 km'),
    'les epreuves sont nommees', '(ex. « Swimrun Long », « Trail 11 km »)');
dit(tdce.every(t => /\(\d+\/28\)$/.test(t.name)),
    'le rang est conserve dans le nom affiche', '(28 traces homonymes restent distinguables)');

// ── 3. Une couleur par GROUPE, et le groupe distingue vraiment ────────────
console.log('\n— Le regroupement par couleur —');
const groupes = new Set(nomsBruts);
dit(groupes.size === 8, '8 epreuves distinctes reconnues', '(' + groupes.size + ')');
dit(groupes.size > 1, 'TEMOIN : le regroupement DISTINGUE',
    '(un groupe unique satisferait un test naif)');
dit(groupes.size < tdce.length, 'TEMOIN : le regroupement REGROUPE',
    '(28 groupes pour 28 traces = pas de regroupement)');
// Deux troncons de la meme epreuve doivent tomber dans le meme groupe : c est toute la
// demande (« SwimRunLong (rouge), Course a pied (vert) »).
const parGroupe = {};
tdce.forEach(t => { (parGroupe[t.group] = parGroupe[t.group] || []).push(t.name); });
dit((parGroupe['Swimrun Medium'] || []).length === 13,
    'les 13 troncons de Swimrun Medium sont un seul groupe',
    '(' + (parGroupe['Swimrun Medium'] || []).length + ')');

// ── 3 bis. LA REGLE D ATTRIBUTION, sur les fichiers reels ────────────────
console.log('\n— L attribution des couleurs (_traceAssignColors) —');
const coulTdce = _traceAssignColors(tdce, roulement());
dit(new Set(coulTdce).size === 8, 'Dinard : 8 couleurs pour 28 traces', '(' + new Set(coulTdce).size + ')');
const memeGroupe = tdce.map((t, i) => [t.group, coulTdce[i]]);
const coulSwimMedium = new Set(memeGroupe.filter(([g]) => g === 'Swimrun Medium').map(([, c]) => c));
dit(coulSwimMedium.size === 1, 'les 13 troncons de Swimrun Medium ont UNE SEULE couleur',
    '(' + coulSwimMedium.size + ')');
const coulParEpreuve = new Map();
let collision = '';
memeGroupe.forEach(([g, c]) => {
    if (coulParEpreuve.has(c) && coulParEpreuve.get(c) !== g) collision = c + ' partagee par « ' + coulParEpreuve.get(c) + ' » et « ' + g + ' »';
    coulParEpreuve.set(c, g);
});
dit(!collision, 'deux epreuves differentes n ont pas la meme couleur', collision);

console.log('\n— 🔴 LA GARDE : un regroupement qui ne separe rien —');
// Cas REEL, pas fabrique : les 21 lignes du para marathon portent la meme valeur sur
// tous leurs champs disponibles. Sans garde, elles ressortaient toutes de la meme couleur
// — moins lisible que le roulement d avant, donc une regression payee par l ajout.
const para = parseGeoJSON('parcours para marathon 19-08-2024 16-05.geojson',
                          parsed['parcours para marathon 19-08-2024 16-05.geojson'].texte);
const groupesPara = new Set(para.map(t => t.group));
dit(groupesPara.size === 1, 'ses ' + para.length + ' lignes forment UN SEUL groupe',
    '(' + [...groupesPara][0] + ')');
const coulPara = _traceAssignColors(para, roulement());
dit(new Set(coulPara).size > 1, 'elles restent pourtant de couleurs DIFFERENTES',
    '(' + new Set(coulPara).size + ' couleurs — le roulement reprend la main)');
dit(new Set(coulPara).size === Math.min(para.length, PALETTE.length),
    'exactement le comportement d avant la modification',
    '(' + new Set(coulPara).size + ' pour ' + para.length + ' traces)');

console.log('\n— TEMOIN DE MORSURE de la garde —');
// Sans la garde, le meme jeu de donnees rendrait UNE couleur. On rejoue la regle privee
// de sa garde : elle DOIT donner un resultat different, sinon la garde ne sert a rien et
// le verdict rassurant ci-dessus ne prouve rien.
const sansGarde = (parsed2, tirer) => {
    const duGroupe = new Map();
    return parsed2.map(p => {
        if (p && p.color) return p.color;
        if (p && p.group) { if (!duGroupe.has(p.group)) duGroupe.set(p.group, tirer()); return duGroupe.get(p.group); }
        return tirer();
    });
};
dit(new Set(sansGarde(para, roulement())).size === 1,
    'privee de sa garde, la regle peint les 21 lignes d une seule couleur',
    '(c est bien ce que la garde evite)');
dit(new Set(sansGarde(tdce, roulement())).size === 8,
    'et sur Dinard la garde ne change rien', '(8 groupes : elle ne se declenche pas)');

// ── 4. La couleur declaree par le fichier est respectee ───────────────────
console.log('\n— simplestyle : quand le fichier dit sa couleur —');
const avecCouleur = JSON.stringify({ type: 'FeatureCollection', features: [
    { type: 'Feature', properties: { name: 'Rouge officiel', stroke: '#E4032E' },
      geometry: { type: 'LineString', coordinates: [[2.1, 43.1], [2.2, 43.2]] } },
    { type: 'Feature', properties: { name: 'Sans couleur' },
      geometry: { type: 'LineString', coordinates: [[2.3, 43.3], [2.4, 43.4]] } },
    { type: 'Feature', properties: { name: 'Couleur illisible', stroke: 'rouge vif' },
      geometry: { type: 'LineString', coordinates: [[2.5, 43.5], [2.6, 43.6]] } },
] });
const cc = parseGeoJSON('couleurs.geojson', avecCouleur);
dit(cc[0].color === '#E4032E', '`stroke` est repris tel quel', '→ ' + cc[0].color);
dit(cc[1].color === null, 'sans `stroke`, on laisse la palette decider', '→ ' + cc[1].color);
dit(cc[2].color === null, 'une couleur illisible est REFUSEE',
    '(OpenLayers en ferait un trait noir, qui ressemble a un choix)');
dit(_traceColorProp({ 'marker-color': '#00ff00' }) === '#00ff00', 'marker-color est accepte aussi');
dit(_traceColorProp({ stroke: '#abc' }) === null, 'une notation a 3 chiffres est refusee',
    '(la regex vise 6 chiffres — c est un choix, pas un oubli)');

// ── 5. Les cas degeneres ne doivent rien casser ───────────────────────────
console.log('\n— Cas degeneres —');
dit(_traceNameField([]) === null, 'aucune propriete : pas de champ');
dit(_traceNameField([null, undefined]) === null, 'proprietes nulles : pas de champ');
dit(_traceNameField([{ name: '' }, { name: '   ' }]) === null,
    'un champ present mais VIDE partout n est pas retenu',
    '(sinon tous les traces retombent sur le nom de fichier)');
dit(_traceNameField([{ name: '' }, { name: 'Vrai nom' }]) === 'name',
    'un champ vide sur la 1re feature mais rempli plus loin EST retenu',
    '(l ancienne version shapefile ne regardait que la premiere)');
dit(_traceNameField([{ zzz: 'quelque chose' }]) === 'zzz',
    'un champ inconnu sert de repli', '(un nom approximatif vaut mieux que « (7/28) »)');
dit(_traceNameField([{ objectid: 12, libelle: 'Rue A' }]) === 'libelle',
    'un champ NUMERIQUE ne peut pas servir de nom');

// ── 6. Le champ de nom est le MEME pour tout le fichier ───────────────────
console.log('\n— Un seul champ pour tout le fichier —');
// Choisi feature par feature, il changerait en cours de route et deux traces voisins
// porteraient des noms qui ne se comparent pas — donc des groupes qui ne veulent rien dire.
const melange = [{ name: 'A' }, { epreuve: 'B' }, { name: 'C' }];
const c1 = _traceNameField(melange), c2 = _traceNameField(melange.slice().reverse());
dit(c1 === c2, 'le champ ne depend pas de l ordre des features', '→ ' + c1 + ' / ' + c2);
dit(TRACE_NAME_FIELDS.indexOf('name') < TRACE_NAME_FIELDS.indexOf('epreuve'),
    '`name` prime sur `epreuve`', '(la convention du format passe avant nos ajouts)');

console.log('\n— Verdict —');
console.log(ko ? '  ' + ko + ' KO sur ' + (ok + ko) + '\n\nECHEC\n' : '  ' + ok + ' ok, 0 ko\n\nTOUT PASSE\n');
process.exit(ko ? 1 : 0);
