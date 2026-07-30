// Le calcul de centrage, EXTRAIT DU FICHIER REEL — ce n est pas une copie.
//
// Pourquoi ce module existe (2026-07-30) : le centrage posait 620 px de panneau et
// 60 px de marge EN DUR, et ignorait totalement le volet lateral de WME. Quatre
// situations le rendaient faux (panneau deplace, retreci, replie, ferme). La mesure
// des rectangles ne se teste pas hors navigateur — mais le CALCUL, si, et c est lui
// qui decide ou la carte atterrit.
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');

function extraire(debut) {
    const i = txt.indexOf(debut);
    if (i < 0) {
        console.error('❌ introuvable dans ' + SRC + ' : ' + debut);
        console.error('   La signature a du changer : la reporter ici, sinon les tests ne testent plus rien.');
        process.exit(2);
    }
    const j = txt.indexOf('\n};', i);
    if (j < 0) { console.error('❌ fin introuvable pour : ' + debut); process.exit(2); }
    return txt.slice(i, j + 3);
}

const code = [
    extraire('const _decalageVisible = (zone, ext, zoomActuel, zoomCible) => {'),
    extraire('const _zoomPourTaille = (dLon, dLat, largeurPx, hauteurPx, zMin, zMax, retrait) => {')
].join('\n');

let api;
try {
    api = new Function(code + '\nreturn { _decalageVisible, _zoomPourTaille };')();
} catch (e) {
    console.error('❌ le calcul de centrage ne s evalue pas : ' + e.message);
    process.exit(2);
}

module.exports = { ...api, code, SRC };
