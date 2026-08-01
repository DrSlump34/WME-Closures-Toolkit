// Compte des fermetures que la file va REELLEMENT ecrire — _queueTotalClosures,
// EXTRAIT DU FICHIER REEL (methode poly-core.js : jamais une copie).
//
// Pourquoi ce test existe (2026-08-01) : ce compte alimente la SEULE barriere avant
// ecriture. Jusqu'a la 1.02.00 le message de confirmation annoncait un nombre de LOTS
// (« Appliquer 3 lot(s) ? ») pendant que le nombre de fermetures — le seul chiffre qui
// engage l'editeur, et qu'aucun outil ne sait defaire — n'etait calcule qu'APRES, une
// fois la premiere fermeture partie. Une zone de 1150 segments sur 21 occurrences
// partait sur un message qui disait « 9 ». Si ce compte se remet a mentir, c'est ici
// que ca doit se voir.
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');

const DEBUT = 'const _queueTotalClosures=(entries)=>{';
const i = txt.indexOf(DEBUT);
if (i < 0) {
    console.error('❌ _queueTotalClosures introuvable dans ' + SRC);
    console.error('   Renommee ou supprimee : le reporter ici, sinon ce test ne prouve plus rien.');
    process.exit(2);
}
const j = txt.indexOf('\n};', i);
if (j < 0) { console.error('❌ fin de _queueTotalClosures introuvable'); process.exit(2); }
const code = txt.slice(i, j + 3);

let _queueTotalClosures;
try { _queueTotalClosures = new Function(code + '\nreturn _queueTotalClosures;')(); }
catch (e) { console.error('❌ ne s evalue pas : ' + e.message); process.exit(2); }

let ok = 0, ko = 0;
const chk = (nom, obtenu, attendu) => {
    if (obtenu === attendu) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + '  → attendu ' + attendu + ', obtenu ' + obtenu); }
};
// Fabrique une entree de segments : n segments x c occurrences.
const seg = (n, c, extra) => Object.assign({
    segIds: Array.from({ length: n }, (_, k) => 1000 + k),
    closures: Array.from({ length: c }, () => ({})),
}, extra || {});

console.log('\n— Cas de base —');
chk('file vide → 0', _queueTotalClosures([]), 0);
chk('1 segment x 1 occurrence', _queueTotalClosures([seg(1, 1)]), 1);
chk('3 segments x 4 occurrences', _queueTotalClosures([seg(3, 4)]), 12);
chk('2 entrees s additionnent', _queueTotalClosures([seg(3, 4), seg(2, 5)]), 22);

console.log('\n— Le cas qui a motive le correctif —');
// Zone de 1150 segments, recurrence 22h-6h sur 3 semaines = 21 occurrences.
// L ancien message annoncait « 9 lots ». Le vrai chiffre est celui-ci.
chk('1150 segments x 21 occurrences', _queueTotalClosures([seg(1150, 21)]), 24150);

console.log('\n— Lignes supprimees a la main (excludedRows) —');
chk('1 ligne supprimee sur 12',
    _queueTotalClosures([seg(3, 4, { excludedRows: new Set(['1000:0']) })]), 11);
chk('toutes les lignes supprimees → 0',
    _queueTotalClosures([seg(2, 2, { excludedRows: new Set(['1000:0', '1000:1', '1001:0', '1001:1']) })]), 0);

console.log('\n— Segments defaillants : comptes NULLE PART —');
chk('nullSegs exclut le segment entier',
    _queueTotalClosures([seg(3, 4, { nullSegs: new Set([1000]) })]), 8);
chk('recentSegs aussi',
    _queueTotalClosures([seg(3, 4, { recentSegs: new Set([1001]) })]), 8);
chk('les deux cumules',
    _queueTotalClosures([seg(3, 4, { nullSegs: new Set([1000]), recentSegs: new Set([1001]) })]), 4);

console.log('\n— Entrees VIRAGES : l unite est le virage, pas le segment —');
const turn = (n, c, extra) => Object.assign({
    source: 'turn',
    turnIds: Array.from({ length: n }, (_, k) => 'T' + k),
    segIds: [],                       // toujours vide pour un virage : piege classique
    closures: Array.from({ length: c }, () => ({})),
}, extra || {});
chk('2 virages x 3 occurrences', _queueTotalClosures([turn(2, 3)]), 6);
chk('virage avec ligne supprimee',
    _queueTotalClosures([turn(2, 3, { excludedRows: new Set(['T0:0', 'T0:1']) })]), 4);
chk('melange segments + virages', _queueTotalClosures([seg(2, 2), turn(2, 3)]), 10);

console.log('\n— Degenere —');
chk('entree sans occurrence → 0', _queueTotalClosures([seg(5, 0)]), 0);
chk('entree sans segment → 0', _queueTotalClosures([seg(0, 5)]), 0);

console.log('\n' + (ko === 0 ? 'TOUT PASSE' : 'ECHECS') + ' : ' + ok + ' ok, ' + ko + ' ko');
process.exit(ko === 0 ? 0 : 1);
