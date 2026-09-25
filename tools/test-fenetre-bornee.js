// La fenêtre ne passe jamais par-dessus la colonne de boutons de la carte (zoom, calques,
// géolocalisation, bouton 🚧) — ni en la déplaçant, ni en l'agrandissant, ni à la relecture
// d'une géométrie mémorisée. Demande de l'auteur du 25/09/2026, comme WPEU et WRP.
//
// _ovDroite et _ovClamp sont extraits du fichier réel ; la colonne est une doublure DOM.
// Témoin : bornée à la largeur de la fenêtre (l'ancien code), la même géométrie mord sur la colonne.
const fs = require('fs');
const SRC = require('path').join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');
const extrait = (a, b) => {
    const i = txt.indexOf(a); if (i < 0) throw new Error('introuvable : ' + a);
    const j = txt.indexOf(b, i + a.length); if (j < 0) throw new Error('fin introuvable : ' + a);
    return txt.slice(i, j);
};
let ok = 0, ko = 0;
const chk = (nom, cond, detail) => { if (cond) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + (detail !== undefined ? '\n        ' + detail : '')); } };

const code = extrait('const OV_W_MIN', '\nlet _ovGeom') ;
const monter = (vw, colonne) => {
    const window = { innerWidth: vw, innerHeight: 1000 };
    const document = { querySelector: () => colonne ? { getBoundingClientRect: () => colonne } : null };
    return new Function('window', 'document', code + '\n; return { _ovDroite, _ovClamp, OV_MARGE };')(window, document);
};

console.log('\n— Écran de 1900 px, colonne de boutons à partir de x = 1846 —');
const COL = { left: 1846, right: 1886, width: 40, top: 60, bottom: 400 };
const { _ovDroite, _ovClamp, OV_MARGE } = monter(1900, COL);
const bord = _ovDroite();
chk('bord droit utilisable = bord gauche de la colonne moins la marge', bord === 1846 - OV_MARGE, bord);
const tiree = _ovClamp({ x: 1500, y: 50, w: 620, h: 500 }, bord, 1000);
chk('fenêtre tirée à droite : s\'arrête avant la colonne', tiree.x + tiree.w <= 1846 - OV_MARGE, JSON.stringify(tiree));
const large = _ovClamp({ x: 100, y: 50, w: 5000, h: 500 }, bord, 1000);
chk('fenêtre agrandie : ne dépasse pas la colonne', large.x + large.w <= 1846 - OV_MARGE, JSON.stringify(large));
const relue = _ovClamp({ x: 1880, y: 50, w: 400, h: 500 }, bord, 1000);
chk('géométrie mémorisée sur la colonne : ramenée à gauche', relue.x + relue.w <= 1846 - OV_MARGE, JSON.stringify(relue));
const ailleurs = _ovClamp({ x: 300, y: 50, w: 620, h: 500 }, bord, 1000);
chk('une fenêtre déjà à gauche ne bouge pas', ailleurs.x === 300 && ailleurs.w === 620, JSON.stringify(ailleurs));

console.log('\n— Replis —');
chk('sans colonne : largeur de la fenêtre', monter(1900, null)._ovDroite() === 1900);
chk('colonne à gauche de l\'écran : pas de borne de ce côté', monter(1900, { left: 10, right: 50, width: 40 })._ovDroite() === 1900);
chk('colonne masquée (largeur nulle) : largeur de la fenêtre', monter(1900, { left: 1846, right: 1846, width: 0 })._ovDroite() === 1900);

console.log('\n— Témoin : bornée à la fenêtre (ancien code), la même géométrie recouvre la colonne —');
const avant = _ovClamp({ x: 1500, y: 50, w: 620, h: 500 }, 1900, 1000);
chk('TÉMOIN : l\'ancien bornage laisse la fenêtre sur la colonne', avant.x + avant.w > 1846, JSON.stringify(avant));

console.log('\n— Branchements —');
chk('déplacement borné par la colonne', /x=Math\.max\(0,Math\.min\(x,_ovDroite\(\)-el\.offsetWidth\)\);/.test(txt));
chk('redimensionnement borné par la colonne', /_ovDroite\(\),window\.innerHeight\);/.test(txt));
chk('application et mémorisation bornées par la colonne', (txt.match(/_ovClamp\((_ovGeom|g), _ovDroite\(\), window\.innerHeight\)/g) || []).length === 2);

console.log('\n' + ok + ' ok, ' + ko + ' échec(s)');
process.exit(ko ? 1 : 0);
