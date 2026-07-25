// Tests du moteur geometrique de la selection par polygone.
// Cas construits a la main : on connait la reponse attendue par le calcul, pas en
// relisant le code — c'est le seul moyen que le test prouve quelque chose.
const P = require('./poly-core.js');

let ok = 0, ko = 0;
const near = (a, b, tol) => Math.abs(a - b) <= (tol === undefined ? 0.02 : tol);
const chk = (nom, cond, detail) => {
    if (cond) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + (detail !== undefined ? '  → ' + detail : '')); }
};

// Carre de 0 a 0.01 en lon ET lat (~810 m x 1110 m vers l'equateur du test)
const carre = [[[0, 0], [0.01, 0], [0.01, 0.01], [0, 0.01], [0, 0]]];

console.log('\n— Point dans polygone —');
chk('centre dedans',            P._polyPtIn(0.005, 0.005, carre) === true);
chk('loin dehors',              P._polyPtIn(0.05,  0.005, carre) === false);
chk('a gauche dehors',          P._polyPtIn(-0.001, 0.005, carre) === false);
chk('au-dessus dehors',         P._polyPtIn(0.005, 0.011, carre) === false);

console.log('\n— Fraction de longueur —');
// Entierement dedans
chk('segment tout dedans → 1',
    near(P._polyInsideFrac([[0.002, 0.005], [0.008, 0.005]], carre), 1),
    P._polyInsideFrac([[0.002, 0.005], [0.008, 0.005]], carre));
// Entierement dehors
chk('segment tout dehors → 0',
    near(P._polyInsideFrac([[0.02, 0.005], [0.03, 0.005]], carre), 0),
    P._polyInsideFrac([[0.02, 0.005], [0.03, 0.005]], carre));
// Pile a moitie : de -0.005 a 0.015, dedans de 0 a 0.01 → 0.010/0.020 = 50 %
const moitie = P._polyInsideFrac([[-0.005, 0.005], [0.015, 0.005]], carre);
chk('segment a cheval pile 50 % → 0,5', near(moitie, 0.5), moitie);
chk('50 % pile n’est PAS retenu (seuil strict)',
    P._polyJudge([[-0.005, 0.005], [0.015, 0.005]], carre).retenu === false, moitie);
// 80 % dedans : de 0.002 a 0.012, dedans de 0.002 a 0.01 → 0.008/0.010
const f80 = P._polyInsideFrac([[0.002, 0.005], [0.012, 0.005]], carre);
chk('segment 80 % dedans → 0,8', near(f80, 0.8), f80);
chk('80 % est retenu', P._polyJudge([[0.002, 0.005], [0.012, 0.005]], carre).retenu === true);
// 20 % dedans : de 0.008 a 0.018, dedans de 0.008 a 0.01 → 0.002/0.010
const f20 = P._polyInsideFrac([[0.008, 0.005], [0.018, 0.005]], carre);
chk('segment 20 % dedans → 0,2', near(f20, 0.2), f20);
chk('20 % n’est pas retenu', P._polyJudge([[0.008, 0.005], [0.018, 0.005]], carre).retenu === false);

console.log('\n— Longueur, pas nombre de points —');
// Un segment dont la partie DEHORS porte 10 sommets et la partie DEDANS 2 :
// un comptage de points dirait « surtout dehors », la longueur dit l'inverse.
const trompeur = [[0.001, 0.005], [0.009, 0.005],          // 0.008 dedans
                  [0.0095, 0.005], [0.0096, 0.005], [0.0097, 0.005], [0.0098, 0.005],
                  [0.0099, 0.005], [0.00995, 0.005], [0.00996, 0.005], [0.00997, 0.005]];
const fTromp = P._polyInsideFrac(trompeur, carre);
chk('les sommets serres ne faussent pas le verdict', fTromp > 0.99, fTromp);

console.log('\n— Polygone concave (forme en L) —');
const L = [[[0, 0], [0.02, 0], [0.02, 0.01], [0.01, 0.01], [0.01, 0.02], [0, 0.02], [0, 0]]];
chk('dans la branche basse', P._polyPtIn(0.015, 0.005, L) === true);
chk('dans la branche haute', P._polyPtIn(0.005, 0.015, L) === true);
chk('dans le creux du L = dehors', P._polyPtIn(0.015, 0.015, L) === false);

console.log('\n— Trou (anneau interieur) —');
const avecTrou = [
    [[0, 0], [0.03, 0], [0.03, 0.03], [0, 0.03], [0, 0]],           // exterieur
    [[0.01, 0.01], [0.02, 0.01], [0.02, 0.02], [0.01, 0.02], [0.01, 0.01]] // trou
];
chk('dans la couronne = dedans', P._polyPtIn(0.005, 0.005, avecTrou) === true);
chk('dans le trou = dehors',     P._polyPtIn(0.015, 0.015, avecTrou) === false);
chk('segment dans le trou n’est pas retenu',
    P._polyJudge([[0.012, 0.015], [0.018, 0.015]], avecTrou).retenu === false);

console.log('\n— Normalisation du trace —');
const attendu = JSON.stringify(carre);
chk('GeoJSON Polygon',  JSON.stringify(P._polyRings({ type: 'Polygon', coordinates: carre })) === attendu);
chk('GeoJSON Feature',  JSON.stringify(P._polyRings({ type: 'Feature', geometry: { type: 'Polygon', coordinates: carre } })) === attendu);
chk('objet { geometry }', JSON.stringify(P._polyRings({ geometry: { type: 'Polygon', coordinates: carre } })) === attendu);
chk('tableau brut de points', JSON.stringify(P._polyRings(carre[0])) === attendu);
// Anneau non ferme : doit etre referme tout seul
chk('anneau non ferme → referme',
    JSON.stringify(P._polyRings([[[0, 0], [0.01, 0], [0.01, 0.01], [0, 0.01]]])) === attendu);
// OpenLayers 2, coordonnees projetees
const ol = { CLASS_NAME: 'OpenLayers.Geometry.Polygon', components: [ { components: [
    { x: 0, y: 0 }, { x: 111319.49, y: 0 }, { x: 111319.49, y: 111325.14 }, { x: 0, y: 111325.14 }
] } ] };
const rOL = P._polyRings(ol);
chk('OpenLayers projete → lon/lat',
    rOL.length === 1 && near(rOL[0][1][0], 1, 0.01) && near(rOL[0][2][1], 1, 0.01),
    JSON.stringify(rOL[0] && rOL[0].slice(0, 3)));
chk('forme inconnue → tableau vide (pas de plantage)', P._polyRings({ nawak: 1 }).length === 0);
chk('null → tableau vide', P._polyRings(null).length === 0);

console.log('\n— Emprise —');
const bb = P._polyBBox(carre);
chk('bbox du carre', bb.minLon === 0 && bb.minLat === 0 && bb.maxLon === 0.01 && bb.maxLat === 0.01);

console.log('\n' + (ko === 0 ? 'TOUT PASSE' : 'ECHECS') + ' : ' + ok + ' ok, ' + ko + ' ko\n');
process.exit(ko === 0 ? 0 : 1);
