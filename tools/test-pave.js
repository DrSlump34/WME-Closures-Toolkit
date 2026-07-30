// Tests du pavage d une zone en lots — sur la fonction EXTRAITE du fichier livre.
//
// Ce que ces tests defendent : le nombre de lots est ce que l editeur paie a
// l application (un recadrage de carte et une entree de file par lot). Un pavage qui
// decoupe pour rien coute des deplacements de carte et decoupe la file en morceaux
// qu il faut ensuite suivre a l oeil.
//
// Le cas fondateur (30/07/2026) : 20 segments d un lotissement, tenant tous dans un
// seul ecran, ressortaient en 3 lots. Cause : la vue etait posee au coin sud-ouest du
// segment le plus au SUD, en supposant qu il etait aussi le plus a l OUEST. Le test
// « une zone qui tient dans une vue ne fait qu un lot » l aurait vu.
const { _polyPaver, _polySegCentre } = require('./poly-pave.js');

let ok = 0, ko = 0;
const titre = (s) => console.log('\n— ' + s + ' —');
const verifie = (nom, cond, detail) => {
    if (cond) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  KO   ' + nom + (detail ? '  → ' + detail : '')); }
};

// ── Cadre de mesure ──────────────────────────────────────────────────────────
// Taille de vue realiste au zoom de chargement, a la latitude du cas signale
// (43.17 N, Herault) : ~1900 x 900 px au zoom 17, retenue a 75 % par le code.
// Recalculee ici plutot que posee en dur, pour qu elle reste juste si on la relit.
const LAT = 43.17558, LON = 3.02845;
const M_LON = 111320 * Math.cos(LAT * Math.PI / 180);   // metres par degre de longitude
const M_LAT = 110540;                                   // metres par degre de latitude
const VUE_W = (1900 * 0.8734) / M_LON * 0.75;           // ~0.0153 deg
const VUE_H = (900  * 0.8734) / M_LAT * 0.75;           // ~0.0053 deg

const mLon = (m) => m / M_LON;                          // metres → degres de longitude
const mLat = (m) => m / M_LAT;

// Un segment droit de 2 points. ⚠️ _polySegCentre prend le point d indice
// floor(n/2) : pour 2 points c est le SECOND. On garde donc les deux extremites
// proches, sinon le « centre » de reference derive de la moitie de la longueur.
const seg = (id, dxM, dyM, longueurM = 30) => ({
    id,
    geometry: { coordinates: [
        [LON + mLon(dxM), LAT + mLat(dyM)],
        [LON + mLon(dxM + longueurM), LAT + mLat(dyM)]
    ] }
});

const idsDe = (lots) => lots.flatMap(g => g.ids).sort((a, b) => a - b);

// ═════════════════════════════════════════════════════════════════════════════
titre('Le cas signale : un lotissement dans un seul ecran');

// 20 rues reparties dans un carre de 350 m — la taille d un lotissement. Elles
// tiennent LARGEMENT dans une vue de ~1250 x 580 m.
const lotissement = [];
for (let i = 0; i < 20; i++) {
    lotissement.push(seg(100 + i, (i % 5) * 80, Math.floor(i / 5) * 80));
}
const rLotissement = _polyPaver(lotissement, VUE_W, VUE_H);
verifie('20 segments dans 350 m → 1 seul lot', rLotissement.length === 1,
        rLotissement.length + ' lot(s)');
verifie('aucun segment perdu', idsDe(rLotissement).length === 20);

// ── Le defaut exact : le plus au SUD n est pas le plus a l OUEST ─────────────
// C est la disposition qui cassait. Le segment le plus meridional est a l EST du
// groupe : l ancienne version posait la vue a partir de lui et laissait tout
// l ouest dehors.
const sudALEst = [
    seg(1, 300, 0),        // le plus au sud, et le plus a l EST
    seg(2, 0,   60),
    seg(3, 60,  60),
    seg(4, 120, 60),
    seg(5, 0,   120),
    seg(6, 200, 120)
];
const rSudALEst = _polyPaver(sudALEst, VUE_W, VUE_H);
verifie('le plus au sud est a l est → toujours 1 lot', rSudALEst.length === 1,
        rSudALEst.length + ' lot(s)');
verifie('aucun segment perdu', idsDe(rSudALEst).join(',') === '1,2,3,4,5,6');

// ── Propriete generale, sur 200 dispositions ────────────────────────────────
// Tirage deterministe (pas de Math.random : un test qui echoue une fois sur dix
// n apprend rien). La regle : tout ce qui tient dans une vue fait UN lot, quelle
// que soit la place du segment le plus au sud.
let graine = 12345;
const alea = () => { graine = (graine * 1103515245 + 12345) % 2147483648; return graine / 2147483648; };
let pires = 0, pireCas = null;
for (let essai = 0; essai < 200; essai++) {
    const n = 3 + Math.floor(alea() * 25);
    const largeurM = VUE_W * M_LON * 0.5, hauteurM = VUE_H * M_LAT * 0.5;  // moitie d une vue
    const jeu = [];
    for (let i = 0; i < n; i++) jeu.push(seg(i + 1, alea() * largeurM, alea() * hauteurM));
    const r = _polyPaver(jeu, VUE_W, VUE_H);
    if (r.length !== 1) { pires++; if (!pireCas) pireCas = { n, lots: r.length }; }
}
verifie('200 dispositions tenant dans une demi-vue → 1 lot a chaque fois', pires === 0,
        pires + ' echec(s), ex. ' + JSON.stringify(pireCas));

// ═════════════════════════════════════════════════════════════════════════════
titre('Le pavage decoupe quand il le faut');

// Une zone reellement plus large qu une vue DOIT etre decoupee : le correctif ne
// doit pas avoir transforme le pavage en « un seul lot quoi qu il arrive ».
const large = [];
for (let i = 0; i < 6; i++) large.push(seg(200 + i, i * VUE_W * M_LON * 0.9, 0));
const rLarge = _polyPaver(large, VUE_W, VUE_H);
verifie('6 segments etales sur 5 vues → plusieurs lots', rLarge.length > 1,
        rLarge.length + ' lot(s)');
verifie('aucun segment perdu sur une zone large', idsDe(rLarge).length === 6);

const haut = [];
for (let i = 0; i < 5; i++) haut.push(seg(300 + i, 0, i * VUE_H * M_LAT * 0.9));
const rHaut = _polyPaver(haut, VUE_W, VUE_H);
verifie('5 segments empiles sur 4 vues → plusieurs lots', rHaut.length > 1,
        rHaut.length + ' lot(s)');
verifie('aucun segment perdu en hauteur', idsDe(rHaut).length === 5);

// ═════════════════════════════════════════════════════════════════════════════
titre('Ce que chaque lot annonce');

// La bbox d un lot sert au recadrage a l application : si elle ne couvre pas les
// segments du lot, ceux-ci ne seront pas charges et seront sautes en silence.
const bboxJuste = rLarge.every(g => {
    const dedans = large.filter(s => g.ids.includes(s.id));
    return dedans.every(s => s.geometry.coordinates.every(p =>
        p[0] >= g.bbox.minLon && p[0] <= g.bbox.maxLon &&
        p[1] >= g.bbox.minLat && p[1] <= g.bbox.maxLat));
});
verifie('la bbox de chaque lot couvre TOUS ses segments', bboxJuste);

const sansDoublon = (() => {
    const vus = new Set();
    return rLarge.every(g => g.ids.every(id => !vus.has(id) && vus.add(id)));
})();
verifie('aucun segment dans deux lots a la fois', sansDoublon);

verifie('chaque lot annonce un centre exploitable',
        rLarge.every(g => Number.isFinite(g.centre[0]) && Number.isFinite(g.centre[1])));

// ═════════════════════════════════════════════════════════════════════════════
titre('Cas limites');

verifie('aucun segment → aucun lot', _polyPaver([], VUE_W, VUE_H).length === 0);
verifie('un seul segment → un lot', _polyPaver([seg(1, 0, 0)], VUE_W, VUE_H).length === 1);

const superposes = [seg(1, 0, 0), seg(2, 0, 0), seg(3, 0, 0)];
verifie('trois segments au meme endroit → un lot',
        _polyPaver(superposes, VUE_W, VUE_H).length === 1);

// Une vue degeneree ne doit pas boucler sans fin : le garde-fou a 500 tours existe
// pour ca, et chaque tour doit consommer au moins un segment.
const rMinuscule = _polyPaver(lotissement, 1e-9, 1e-9);
verifie('vue minuscule → un lot par segment, sans boucle infinie',
        rMinuscule.length === 20, rMinuscule.length + ' lot(s)');

// Le centre de reference vient du milieu de la polyligne, pas de son debut : une
// rue en L doit etre affectee a la vue de son milieu.
const enL = { id: 9, geometry: { coordinates: [
    [LON, LAT], [LON + mLon(100), LAT + mLat(100)], [LON + mLon(200), LAT] ] } };
verifie('segment coude : le centre est bien le point median',
        Math.abs(_polySegCentre(enL)[1] - (LAT + mLat(100))) < 1e-9);

// ═════════════════════════════════════════════════════════════════════════════
console.log('\n' + (ko === 0 ? 'TOUT PASSE' : 'ECHECS') + ' : ' + ok + ' ok, ' + ko + ' ko\n');
process.exit(ko === 0 ? 0 : 1);
