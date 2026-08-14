#!/usr/bin/env node
/**
 * check-api-carte.js — les membres de W.map que le code utilise existent-ils vraiment ?
 *
 * POURQUOI CE CONTROLE EXISTE
 * ---------------------------
 * Les 1.12.00 et 1.12.01 ont ete PUBLIEES avec un correctif d'ordre des calques qui
 * n'a jamais place un seul calque : _wctRaiseLayers lisait `W.map.layers.length`.
 * Or W.map est une FACADE de WME, pas l'objet OpenLayers : elle n'a pas de propriete
 * `layers`. La ligne levait un TypeError a chaque appel, et un `catch` vide l'avalait.
 * Rien dans le depot ne pouvait le voir : le fichier se parse, il demarre, et l'erreur
 * ne sort pas. C'est un utilisateur qui l'a signale, deux versions plus tard.
 *
 * Ce controle ne remplace pas un essai dans WME — il empeche seulement de RE-ecrire un
 * acces a un membre dont on a mesure qu'il n'existe pas.
 *
 * LA LISTE VIENT D'UNE MESURE, PAS D'UNE DOC
 * -----------------------------------------
 * Relevee dans WME le 2026-08-14 en console (`typeof W.map[membre]`). Si WME change,
 * cette liste est PERIMEE : la refaire, ne pas y ajouter un nom au jugé.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const FICHIER = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');

// Mesure du 2026-08-14 dans WME (www.waze.com/fr/editor, 86 calques).
const PRESENTS = ['addLayer','removeLayer','setLayerIndex','getLayerIndex','getLayersByName',
                  'getLayerByUniqueName','moveLayerToTop','getProjectionObject','setCenter',
                  'events','roadLayer','segmentLayer','nodeLayer','venueLayer','commentLayer'];
const ABSENTS  = { 'layers': 'W.map est une facade : la pile ne se lit pas ainsi. '
                           + 'Pour placer un calque au sommet, setLayerIndex(l, 9999) — '
                           + 'OpenLayers ramene un index hors borne a la taille de la pile.' };
// Mesure : moveLayerToTop(layer) ne deplace PAS le calque (index inchange), et
// moveLayerToTop(nom) leve « e.setZIndex is not a function ». Presente mais inutilisable.
const PIEGES = { 'moveLayerToTop': 'presente mais SANS EFFET (mesure du 2026-08-14) : utiliser setLayerIndex(l, 9999)' };

// Ne garde que la partie CODE d'une ligne. audit.js s'est deja fait avoir en comptant
// des commentaires comme du code : ici le commentaire d'entete cite justement
// « W.map.layers » pour expliquer le defaut, et il ne doit PAS declencher l'alerte.
function partieCode(ligne) {
  let dansTexte = null;
  for (let i = 0; i < ligne.length; i++) {
    const c = ligne[i];
    if (dansTexte) { if (c === dansTexte && ligne[i-1] !== '\\') dansTexte = null; continue; }
    if (c === '"' || c === "'" || c === '`') { dansTexte = c; continue; }
    if (c === '/' && ligne[i+1] === '/') return ligne.slice(0, i);
    if (c === '/' && ligne[i+1] === '*') return ligne.slice(0, i);
  }
  return ligne;
}

function analyser(source) {
  const trouves = [];
  source.split('\n').forEach((ligne, i) => {
    const code = partieCode(ligne);
    const re = /W\.map\.([A-Za-z_$][A-Za-z0-9_$]*)/g;
    let m;
    while ((m = re.exec(code)) !== null) trouves.push({ n: i + 1, membre: m[1] });
  });
  return trouves;
}

function verdict(trouves, etiquette) {
  const ko = [];
  for (const t of trouves) {
    if (ABSENTS[t.membre])      ko.push(`${etiquette}:${t.n}  W.map.${t.membre} — N'EXISTE PAS. ${ABSENTS[t.membre]}`);
    else if (PIEGES[t.membre])  ko.push(`${etiquette}:${t.n}  W.map.${t.membre} — ${PIEGES[t.membre]}`);
    else if (!PRESENTS.includes(t.membre))
      ko.push(`${etiquette}:${t.n}  W.map.${t.membre} — jamais mesure. Le verifier en console dans WME, puis l'ajouter a PRESENTS.`);
  }
  return ko;
}

// ─── le fichier reel ────────────────────────────────────────────────────────
const source = fs.readFileSync(FICHIER, 'utf8');
const trouves = analyser(source);
const ko = verdict(trouves, 'WME_ClosuresToolkit.user.js');

console.log('\n— Membres de W.map utilises par le code —');
const distincts = [...new Set(trouves.map(t => t.membre))].sort();
console.log('  ' + distincts.length + ' distincts sur ' + trouves.length + ' acces : ' + distincts.join(', '));

// ─── temoin : une ligne fabriquee doit etre REFUSEE ─────────────────────────
// Sans lui, un controle qui ne trouve jamais rien passe pour sain alors qu'il
// pourrait ne rien regarder du tout.
const TEMOINS = [
  { code: 'const top = W.map.layers.length - 1;',        doitEchouer: true,  quoi: 'acces a W.map.layers' },
  { code: 'W.map.moveLayerToTop(l);',                     doitEchouer: true,  quoi: 'appel a moveLayerToTop' },
  { code: '// on lisait W.map.layers.length autrefois',   doitEchouer: false, quoi: 'meme texte EN COMMENTAIRE' },
  { code: 'W.map.setLayerIndex(l, 9999);',                doitEchouer: false, quoi: 'le remede' },
];
console.log('\n— Temoins —');
let temoinsKo = 0;
for (const t of TEMOINS) {
  const r = verdict(analyser(t.code), 'temoin');
  const ok = t.doitEchouer ? r.length > 0 : r.length === 0;
  if (!ok) temoinsKo++;
  console.log('  ' + (ok ? 'ok  ' : 'KO  ') + t.quoi + (t.doitEchouer ? ' → doit etre refuse' : ' → doit passer'));
}

console.log('\n— Verdict —');
if (ko.length) { console.log('  ' + ko.length + ' acces problematique(s) :'); ko.forEach(l => console.log('    ' + l)); }
else console.log('  aucun acces a un membre absent ou piege');
if (temoinsKo) console.log('  ⚠️ ' + temoinsKo + ' TEMOIN(S) EN ECHEC — ce controle ne regarde pas ce qu il pretend');

const echec = ko.length + temoinsKo;
console.log(echec ? '\nECHEC\n' : '\nTOUT PASSE\n');
process.exit(echec ? 1 : 0);
