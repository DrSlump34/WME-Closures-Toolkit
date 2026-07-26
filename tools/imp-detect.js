// Le detecteur d import, EXTRAIT DU FICHIER REEL — ce n est plus une copie.
//
// Pourquoi ce changement (2026-07-26) : ce module etait une copie du code du
// userscript. Les 32 tests passaient donc sur autre chose que ce qui tourne chez
// l editeur — exactement ce que le README interdit (« un test qui s execute sur
// autre chose que le code livre ne prouve rien »). Le bug 0.97.01 (l onglet Import
// ne reagissait a RIEN) vivait a deux lignes de la, dans du code qu aucune copie ne
// reproduisait.
//
// _impDetecter est une fonction PURE, sans dependance au DOM ni au SDK : elle
// s extrait et s execute telle quelle.
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');

const DEBUT = 'const _impDetecter = (nom, texte) => {';
const i = txt.indexOf(DEBUT);
if (i < 0) {
    console.error('❌ _impDetecter introuvable dans ' + SRC);
    console.error('   Sa signature a du changer : la reporter ici, sinon les tests ne testent plus rien.');
    process.exit(2);
}
// Fin = la premiere accolade fermante en colonne 0 suivie d un point-virgule.
const j = txt.indexOf('\n};', i);
if (j < 0) { console.error('❌ fin de _impDetecter introuvable'); process.exit(2); }
const code = txt.slice(i, j + 3);

// Evalue dans une portee ou `t` EXISTE comme fonction de traduction : si quelqu un
// remasque un jour `t` par une variable locale, le test le verra au lieu de le subir.
const t = (k) => 'TRAD:' + k;
let _impDetecter;
try {
    _impDetecter = new Function('t', code + '\nreturn _impDetecter;')(t);
} catch (e) {
    console.error('❌ _impDetecter ne s evalue pas : ' + e.message);
    process.exit(2);
}

module.exports = { _impDetecter, code, SRC };
