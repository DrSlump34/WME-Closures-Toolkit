#!/usr/bin/env node
// test-style-trace.js — le style d un trace : epaisseur reglable et bornee.
//
// POURQUOI CE CONTROLE EXISTE
// ---------------------------
// Le calcul du style vivait recopie a QUATRE endroits, avec des epaisseurs qui avaient
// deja diverge (4, 3 et 1,5 sans raison enoncee). Ajouter l epaisseur reglable sans
// factoriser aurait fait un cinquieme endroit a tenir d accord — c est exactement ce
// qui avait donne « trois chemins, trois comportements » sur le captage des segments.
// _traceStyle est desormais la source unique ; ce test la surveille.
//
// Le bornage est le point sensible : une valeur hors bornes venue des preferences
// (fichier edite a la main, bornes changees entre deux versions) donnerait un trait
// invisible ou une bande opaque, sans rien dire.
'use strict';
const fs = require('fs');
const path = require('path');

const FICHIER = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const src = fs.readFileSync(FICHIER, 'utf8');

let ok = 0, ko = 0;
const dit = (b, quoi, detail) => {
    console.log('  ' + (b ? 'ok  ' : 'KO  ') + ' ' + quoi + (detail ? '   ' + detail : ''));
    b ? ok++ : ko++;
};

// ── Extraction du fichier reel ─────────────────────────────────────────────
const d = src.indexOf('const TRACE_WIDTH_DEFAULT');
if (d < 0) { console.error('ECHEC : TRACE_WIDTH_DEFAULT introuvable'); process.exit(1); }
const f = src.indexOf('\n};', src.indexOf('const _traceStyle', d));
if (f < 0) { console.error('ECHEC : fin de _traceStyle introuvable'); process.exit(1); }
let bloc = src.slice(d, f + 3);
// `let _traceWidth = TRACE_WIDTH_DEFAULT;` est dans le bloc : inoffensif ici.
if (!bloc.includes('_traceStyle')) { console.error('ECHEC : bloc sans _traceStyle'); process.exit(1); }
if (!bloc.includes('TRACE_WIDTH_MIN')) { console.error('ECHEC : bornes absentes du bloc'); process.exit(1); }

if (!bloc.includes('TRACE_OPACITY_MIN')) { console.error('ECHEC : bornes d opacite absentes du bloc'); process.exit(1); }

const F = new Function(bloc + '\nreturn {_traceStyle, TRACE_WIDTH_DEFAULT, TRACE_WIDTH_MIN, TRACE_WIDTH_MAX, TRACE_OPACITY_DEFAULT, TRACE_OPACITY_MIN, TRACE_OPACITY_MAX};')();
const { _traceStyle, TRACE_WIDTH_DEFAULT, TRACE_WIDTH_MIN, TRACE_WIDTH_MAX,
        TRACE_OPACITY_DEFAULT, TRACE_OPACITY_MIN, TRACE_OPACITY_MAX } = F;

console.log('\n— Bornes lues dans le fichier reel —');
console.log('   defaut ' + TRACE_WIDTH_DEFAULT + ' px, min ' + TRACE_WIDTH_MIN + ', max ' + TRACE_WIDTH_MAX);

console.log('\n— Le defaut repond a la demande —');
dit(TRACE_WIDTH_DEFAULT >= 6, 'le trait par defaut fait au moins 6 px',
    '(Color Highlights peint les segments a 10 px : 4 px s y noyait)');
dit(_traceStyle('#ff1744', undefined, false).strokeWidth === TRACE_WIDTH_DEFAULT,
    'sans epaisseur fournie, on retombe sur le defaut');

console.log('\n— Bornage —');
dit(_traceStyle('#fff', 0, false).strokeWidth === TRACE_WIDTH_MIN,   'une epaisseur nulle remonte au minimum');
dit(_traceStyle('#fff', -5, false).strokeWidth === TRACE_WIDTH_MIN,  'une epaisseur negative remonte au minimum');
dit(_traceStyle('#fff', 999, false).strokeWidth === TRACE_WIDTH_MAX, 'une epaisseur enorme redescend au maximum');
dit(_traceStyle('#fff', 'abc', false).strokeWidth === TRACE_WIDTH_DEFAULT, 'une valeur non numerique retombe sur le defaut');
dit(_traceStyle('#fff', null, false).strokeWidth === TRACE_WIDTH_DEFAULT, 'null retombe sur le defaut');

console.log('\n— TEMOIN : le bornage ne doit pas tout ecraser —');
const milieu = Math.round((TRACE_WIDTH_MIN + TRACE_WIDTH_MAX) / 2);
dit(_traceStyle('#fff', milieu, false).strokeWidth === milieu,
    'une valeur DANS les bornes passe telle quelle', '(' + milieu + ' px)');
dit(_traceStyle('#fff', TRACE_WIDTH_MIN, false).strokeWidth === TRACE_WIDTH_MIN, 'la borne basse elle-meme est acceptee');
dit(_traceStyle('#fff', TRACE_WIDTH_MAX, false).strokeWidth === TRACE_WIDTH_MAX, 'la borne haute elle-meme est acceptee');

console.log('\n— Polygone : contour plus fin, mais jamais invisible —');
const poly = _traceStyle('#00e5ff', TRACE_WIDTH_MAX, true);
const ligne = _traceStyle('#00e5ff', TRACE_WIDTH_MAX, false);
dit(poly.strokeWidth < ligne.strokeWidth, 'a epaisseur egale, le contour d un polygone est plus fin',
    poly.strokeWidth + ' contre ' + ligne.strokeWidth);
dit(_traceStyle('#fff', TRACE_WIDTH_MIN, true).strokeWidth >= 1, 'au minimum, le contour reste >= 1 px');
dit(poly.fillOpacity > 0 && ligne.fillOpacity === 0, 'seul le polygone est rempli');
dit(poly.fillColor === '#00e5ff', 'le remplissage reprend la couleur du trace');

// ── Opacite (demande de MisterLogik, 27/08/2026) ──────────────────────────
// Meme piege que l epaisseur, en pire : une opacite a 0 rend le trace INVISIBLE, et un
// trace invisible est indiscernable d un trace absent. La borne basse est donc la seule
// chose qui distingue « tres discret » de « disparu ».
console.log('\n— Bornes d opacite lues dans le fichier reel —');
console.log('   defaut ' + TRACE_OPACITY_DEFAULT + ', min ' + TRACE_OPACITY_MIN + ', max ' + TRACE_OPACITY_MAX);

console.log('\n— Bornage de l opacite —');
dit(_traceStyle('#fff', 6, false, 0).strokeOpacity === TRACE_OPACITY_MIN,
    'une opacite NULLE remonte au minimum', '(sinon le trace disparait sans le dire)');
dit(_traceStyle('#fff', 6, false, -1).strokeOpacity === TRACE_OPACITY_MIN, 'une opacite negative remonte au minimum');
dit(_traceStyle('#fff', 6, false, 9).strokeOpacity === TRACE_OPACITY_MAX,  'une opacite superieure a 1 redescend au maximum');
dit(_traceStyle('#fff', 6, false, 'abc').strokeOpacity === TRACE_OPACITY_DEFAULT, 'une valeur non numerique retombe sur le defaut');
dit(_traceStyle('#fff', 6, false, undefined).strokeOpacity === TRACE_OPACITY_DEFAULT, 'sans opacite fournie, on retombe sur le defaut');
dit(_traceStyle('#fff', 6, false, null).strokeOpacity === TRACE_OPACITY_DEFAULT, 'null retombe sur le defaut');

console.log('\n— TEMOIN : le bornage de l opacite ne doit pas tout ecraser —');
const oMil = Math.round((TRACE_OPACITY_MIN + TRACE_OPACITY_MAX) / 2 * 100) / 100;
dit(_traceStyle('#fff', 6, false, oMil).strokeOpacity === oMil,
    'une opacite DANS les bornes passe telle quelle', '(' + oMil + ')');
dit(_traceStyle('#fff', 6, false, TRACE_OPACITY_MIN).strokeOpacity === TRACE_OPACITY_MIN, 'la borne basse elle-meme est acceptee');
dit(_traceStyle('#fff', 6, false, TRACE_OPACITY_MAX).strokeOpacity === TRACE_OPACITY_MAX, 'la borne haute elle-meme est acceptee');
dit(TRACE_OPACITY_MIN > 0, 'la borne basse n est PAS zero', '(un trace invisible ressemble a un trace absent)');

console.log('\n— Le remplissage d un polygone reste une fraction du contour —');
// Regles separement, contour et remplissage divergent : c est ainsi qu on obtient une
// zone plus opaque que son propre contour. Le rapport doit tenir a TOUTES les opacites.
let rapportOk = true, pire = '';
[TRACE_OPACITY_MIN, 0.3, 0.5, TRACE_OPACITY_DEFAULT, TRACE_OPACITY_MAX].forEach(o => {
    const st = _traceStyle('#00e5ff', 6, true, o);
    if (!(st.fillOpacity < st.strokeOpacity)) { rapportOk = false; pire = 'a o=' + o; }
});
dit(rapportOk, 'le remplissage reste plus transparent que le contour, sur toute la plage', pire);
dit(_traceStyle('#fff', 6, true, TRACE_OPACITY_MIN).fillOpacity > 0,
    'meme au minimum, le remplissage n est pas nul');
dit(_traceStyle('#fff', 6, false, TRACE_OPACITY_MAX).fillOpacity === 0,
    'une ligne n est jamais remplie, quelle que soit l opacite');

console.log('\n— TEMOIN DE MORSURE : l opacite est bien BRANCHEE sur le style —');
// Sans ce temoin, un _traceStyle qui ignorerait son 4e parametre passerait tous les
// tests ci-dessus des lors que le defaut est correct.
dit(_traceStyle('#fff', 6, false, TRACE_OPACITY_MIN).strokeOpacity
      !== _traceStyle('#fff', 6, false, TRACE_OPACITY_MAX).strokeOpacity,
    'deux opacites differentes donnent deux styles differents');
dit(_traceStyle('#fff', 6, true, TRACE_OPACITY_MIN).fillOpacity
      !== _traceStyle('#fff', 6, true, TRACE_OPACITY_MAX).fillOpacity,
    'le remplissage suit lui aussi');

console.log('\n— L epaisseur ne bouge pas quand on change l opacite —');
dit(_traceStyle('#fff', 9, false, TRACE_OPACITY_MIN).strokeWidth === 9,
    'regler l opacite ne touche pas a l epaisseur');

console.log('\n— La couleur est transmise telle quelle —');
dit(_traceStyle('#ff00ff', 6, false).strokeColor === '#ff00ff', 'une couleur libre passe sans etre normalisee');

console.log('\n— Verdict —');
console.log(ko ? '  ' + ko + ' KO sur ' + (ok + ko) + '\n\nECHEC\n' : '  ' + ok + ' ok, 0 ko\n\nTOUT PASSE\n');
process.exit(ko ? 1 : 0);
