#!/usr/bin/env node
/**
 * check-cles-mortes.js — quelles cles i18n sont declarees mais jamais employees ?
 *
 * POURQUOI CE CONTROLE EXISTE
 * ---------------------------
 * audit.js porte deja un controle des cles inutilisees, mais son filtre contient
 * `!horsDico.includes('srcSelOff_')` — un terme qui ne depend pas de la cle testee.
 * Il est donc ETEINT EN PERMANENCE et affiche « aucune » depuis toujours. Constate le
 * 01/08/2026, jamais repare. Ce controle-ci fait le travail pour de bon.
 *
 * Une cle morte ne casse rien : elle coute 8 lignes (une par langue) et, surtout, elle
 * se fait traduire a chaque nouvelle langue. Le 15/08 la suppression de traceGenerateLots
 * en a laisse 12 d un coup — dont 8 que je venais d ajouter le matin meme.
 *
 * PRINCIPE : la dette CONNUE est toleree et NOMMEE ; toute cle morte nouvelle fait
 * echouer. Une dette qu on affiche est une dette qu on peut decider de garder ; une
 * dette qu on tait redevient invisible.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const FICHIER = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const src = fs.readFileSync(FICHIER, 'utf8');
const lignes = src.split('\n');

// Dette anterieure au 2026-08-15, connue et assumee. En retirer une de cette liste
// quand elle est supprimee du dico ; n y AJOUTER une entree que sur decision explicite.
const DETTE_CONNUE = {
  'srcSelOff_flag':    'motif retire du code en 0.87.01, libelle laisse volontairement',
  'srcSelOff_feature': 'motif retire du code en 0.87.01, libelle laisse volontairement',
  'srcSelOff_api':     'motif de repli, plus reference',
  'srcSelOff_schema':  'motif de repli, plus reference',
  'srcNoClosures':     'onglet Recherche, remplace',
  'srcResults':        'onglet Recherche, remplace',
  'btnDur':            'ancienne bascule Duree',
  'lblToggleDur':      'ancienne bascule Duree',
  'lblHolidays':       'ancien libelle de la section feries',
  'holidayModeNone':   'ancien mode feries',
  'lblMtePh':          'ancien libelle MTE',
  'closuresN':         'ancien compteur',
  'fabNoSeg':          'ancien etat du FAB',
  'keysSecKbd':        'ancienne section du panneau des raccourcis',
  'selectAll':         'ancien bouton',
  'applyStopping':     'ancien etat d application',
  'sbResetFab':        'ancien bouton de la barre laterale',
};

// ── Bornes du bloc de dictionnaires ────────────────────────────────────────
const debut   = lignes.findIndex(l => /^\s{8}fr:\s*\{/.test(l));
const debutPT = lignes.findIndex(l => /^\s{8}'pt-PT':\s*\{/.test(l));
if (debut < 0 || debutPT < 0) { console.error('ECHEC : bloc de dictionnaires introuvable'); process.exit(1); }
let fin = debutPT;
while (fin < lignes.length && !/^\s{8}\},?\s*$/.test(lignes[fin])) fin++;

const cles = new Set();
for (let i = debut; i < debutPT; i++) {
  const m = lignes[i].match(/^\s{12}([A-Za-z_][A-Za-z0-9_]*)\s*:/);
  if (m) cles.add(m[1]);
}
if (cles.size < 300) { console.error('ECHEC : ' + cles.size + ' cles seulement, le decoupage a rate'); process.exit(1); }

// Le CODE = tout SAUF le bloc de dictionnaires.
const code = lignes.slice(0, debut).concat(lignes.slice(fin + 1)).join('\n');

// ⚠️ Recherche volontairement LARGE (le nom n importe ou dans le code) : une cle peut
// etre appelee via une variable — `t(aborted ? 'lotsStopped' : 'lotsDone')` — ou
// concatenee. Mieux vaut declarer « employee » a tort que faire supprimer une cle vivante.
const mortes = [...cles].filter(k => !new RegExp('\\b' + k + '\\b').test(code));

console.log('\n— Dictionnaire —');
console.log('  ' + cles.size + ' cles declarees, ' + (fin - debut + 1) + ' lignes');

const nouvelles = mortes.filter(k => !(k in DETTE_CONNUE));
const attendues = mortes.filter(k => k in DETTE_CONNUE);
const disparues = Object.keys(DETTE_CONNUE).filter(k => !mortes.includes(k));

console.log('\n— Dette connue —');
console.log('  ' + attendues.length + ' / ' + Object.keys(DETTE_CONNUE).length + ' cles mortes attendues, toujours la');
attendues.forEach(k => console.log('    ' + k.padEnd(20) + DETTE_CONNUE[k]));

if (disparues.length) {
  console.log('\n— Nettoyees depuis —');
  disparues.forEach(k => console.log('    ' + k + ' — la retirer de DETTE_CONNUE'));
}

console.log('\n— Verdict —');
if (nouvelles.length) {
  console.log('  ' + nouvelles.length + ' CLE(S) MORTE(S) NOUVELLE(S) :');
  nouvelles.forEach(k => {
    const n = (src.match(new RegExp('\\b' + k + '\\b', 'g')) || []).length;
    console.log('    ' + k.padEnd(20) + n + ' occurrence(s) — ' + (n === 8 ? '1 par langue, jamais employee' : 'a verifier'));
  });
  console.log('\n  Soit la cle doit etre employee, soit ses 8 lignes doivent partir.');
  console.log('\nECHEC\n');
  process.exit(1);
}
console.log('  aucune cle morte nouvelle (' + attendues.length + ' de dette connue, nommees ci-dessus)');
console.log('\nTOUT PASSE\n');
process.exit(0);
