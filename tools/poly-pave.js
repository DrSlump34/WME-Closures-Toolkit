// Le pavage d une zone en lots, EXTRAIT DU FICHIER REEL — ce n est pas une copie.
//
// Pourquoi ce module existe (2026-07-30) : l auteur a applique une zone de 20 segments
// tenant dans un seul ecran, et WCT l a decoupee en 3 lots — donc 3 recadrages de carte
// et 3 entrees de file. Le pavage etait jusque-la enfoui dans _polyLoadAndSelect, une
// fonction qui parle au SDK et deplace la carte : intestable. Il en est sorti en
// fonction pure (_polyPaver), et ce module l extrait du fichier livre.
//
// ⚠️ Meme regle que imp-detect.js : on extrait, on ne recopie pas. poly-core.js, lui,
// est encore une copie — c est la dette qui reste.
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');

// Extrait `const <nom> = …` jusqu a la premiere accolade fermante en colonne 0.
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

// La marge est une constante d une seule ligne : on la prend telle quelle.
const ligneMarge = txt.match(/^const POLY_PAVE_MARGE = .*$/m);
if (!ligneMarge) { console.error('❌ POLY_PAVE_MARGE introuvable'); process.exit(2); }

const code = [
    ligneMarge[0],
    extraire('const _polySegCentre = (s) => {'),
    extraire('const _polyPaver = (retenus, vueW, vueH) => {')
].join('\n');

let api;
try {
    api = new Function(code + '\nreturn { _polyPaver, _polySegCentre, POLY_PAVE_MARGE };')();
} catch (e) {
    console.error('❌ le pavage ne s evalue pas : ' + e.message);
    process.exit(2);
}

module.exports = { ...api, code, SRC };
