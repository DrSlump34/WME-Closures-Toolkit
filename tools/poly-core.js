// Le moteur geometrique de la zone, EXTRAIT DU FICHIER REEL — ce n est plus une copie.
//
// Pourquoi ce changement (2026-08-01) : ce module etait le DERNIER a etre une copie
// du code du userscript. Les 28 tests passaient donc sur autre chose que ce qui
// tourne chez l editeur — exactement ce que le README interdit (« un test qui
// s execute sur autre chose que le code livre ne prouve rien »). C est le motif qui
// avait deja force la conversion d imp-detect.js (bug 0.97.01) et de poly-pave.js.
//
// La copie AVAIT DEJA DIVERGE au moment de la conversion : elle nommait les fonctions
// _polyRings et _polyBBox la ou le fichier reel dit _polyRingsOf et _polyBBoxOf. Deux
// noms pour une meme piece, c est la divergence qui commence — les corps, eux, etaient
// encore identiques. Les anciens noms restent exportes comme ALIAS pour ne pas casser
// test-poly.js, mais ils pointent desormais sur le code reel.
//
// Tout le bloc extrait est PUR : pas de DOM, pas de SDK, pas de reseau. Il s evalue
// tel quel.
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');

// Le bloc va de la premiere constante du moteur a la fin de _polyInsideFrac. Ces
// pieces sont contigues dans le fichier reel et forment un tout : les seuils et les
// fonctions qui s en servent doivent etre pris ENSEMBLE, sinon un seuil modifie dans
// le userscript resterait a l ancienne valeur ici.
const DEBUT = 'const POLY_INSIDE_FRAC';
const i = txt.indexOf(DEBUT);
if (i < 0) {
    console.error('❌ POLY_INSIDE_FRAC introuvable dans ' + SRC);
    console.error('   Le moteur a du etre renomme ou deplace : le reporter ici, sinon les tests ne testent plus rien.');
    process.exit(2);
}
// Fin = la fin de _polyInsideFrac, derniere fonction pure du bloc. Ce qui suit
// (_polyZone, _polyTiles…) touche au SDK et ne s evalue pas hors WME.
const FIN = 'const _polyInsideFrac';
const k = txt.indexOf(FIN, i);
if (k < 0) {
    console.error('❌ _polyInsideFrac introuvable dans ' + SRC);
    process.exit(2);
}
const j = txt.indexOf('\n};', k);
if (j < 0) { console.error('❌ fin de _polyInsideFrac introuvable'); process.exit(2); }
const code = txt.slice(i, j + 3);

// Garde-fou : si une piece attendue disparait du bloc, le dire ICI plutot que de
// laisser les tests echouer sur un « n est pas une fonction » incomprehensible.
for (const nom of ['_polyDeproj', '_polyClose', '_polyNorm', '_polyRingsOf', '_polyPtIn', '_polyBBoxOf', '_polyInsideFrac']) {
    if (!code.includes('const ' + nom)) {
        console.error('❌ ' + nom + ' n est plus dans le bloc extrait de ' + SRC);
        console.error('   Soit il a ete renomme, soit il est sorti du bloc : ajuster les bornes DEBUT/FIN ci-dessus.');
        process.exit(2);
    }
}

let M;
try {
    M = new Function(code + `
        return { POLY_INSIDE_FRAC, POLY_SAMPLE_M, POLY_SAMPLE_MAX,
                 _polyDeproj, _polyClose, _polyNorm, _polyRingsOf, _polyPtIn, _polyBBoxOf, _polyInsideFrac };
    `)();
} catch (e) {
    console.error('❌ le moteur geometrique ne s evalue pas : ' + e.message);
    console.error('   Une dependance au DOM ou au SDK a du entrer dans le bloc : il doit rester PUR.');
    process.exit(2);
}

// Le verdict pour un segment. Cette fonction n existe pas telle quelle dans le
// userscript : il applique la regle en ligne (« _polyInsideFrac(...) > POLY_INSIDE_FRAC »,
// voir _polyProcessRings). On la reconstitue ici a partir des DEUX pieces reelles,
// pour que le test puisse nommer la regle. Si le userscript change de comparateur,
// c est test-poly.js qui doit le dire — pas ce helper qui doit le suivre en silence.
const _polyJudge = (coords, rings) => {
    const frac = M._polyInsideFrac(coords, rings);
    return { retenu: frac > M.POLY_INSIDE_FRAC, frac };
};

module.exports = {
    ...M,
    _polyJudge,
    // Alias historiques : test-poly.js les emploie depuis l origine.
    _polyRings: M._polyRingsOf,
    _polyBBox:  M._polyBBoxOf,
    code, SRC
};
