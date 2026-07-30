// Tests du centrage « sur ce qui reste visible » — fonctions EXTRAITES du fichier livre.
//
// Ce que ces tests defendent : quand WCT recadre la carte sur un objet, cet objet doit
// tomber sous les yeux de l editeur, pas derriere le panneau ni derriere le volet
// lateral de WME. L ancienne version posait 620 px et 60 px en dur et ignorait le
// volet gauche ; elle etait fausse des que le panneau bougeait, retrecissait, se
// repliait ou se fermait.
const { _decalageVisible, _zoomPourTaille } = require('./centrage.js');

let ok = 0, ko = 0;
const titre = (s) => console.log('\n— ' + s + ' —');
const verifie = (nom, cond, detail) => {
    if (cond) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  KO   ' + nom + (detail ? '  → ' + detail : '')); }
};
const presque = (a, b, tol) => Math.abs(a - b) <= (tol == null ? 1e-9 : tol);

// ── Cadre de mesure ──────────────────────────────────────────────────────────
// Une carte de 1900 x 900 px affichant 0.02 deg de longitude et 0.007 deg de
// latitude. Chiffres realistes pour WME au zoom 17 vers 43 N.
const RC = { left: 0, right: 1900, top: 0, bottom: 900, width: 1900, height: 900 };
const EXT = [3.00, 43.16, 3.02, 43.167];          // [minLon, minLat, maxLon, maxLat]
const Z = 17;

// Fabrique une zone visible : `g` px rognes a gauche, `d` px a droite, `b` px en bas.
const zone = (g, d, b) => ({
    gauche: RC.left + g, droite: RC.right - d, haut: RC.top, bas: RC.bottom - b,
    rc: RC, complet: false
});

// Ou tombe le point corrige, exprime en PIXELS depuis le bord gauche du canevas ?
// C est la seule question qui compte : le point doit atterrir au centre de la partie
// visible. On refait le chemin complet — decalage, puis projection en pixels.
const pixelDArrivee = (z, zoomCible) => {
    const d = _decalageVisible(z, EXT, Z, zoomCible);
    const f = (zoomCible == null || zoomCible === Z) ? 1 : Math.pow(2, Z - zoomCible);
    const dpxLon = ((EXT[2] - EXT[0]) / RC.width) * f;
    const dpxLat = ((EXT[3] - EXT[1]) / RC.height) * f;
    // Le centre de la carte devient (cible + decalage) ; la cible apparait donc a
    // l oppose du decalage, depuis le centre du canevas.
    return {
        x: RC.width / 2 - d.dLon / dpxLon,
        y: RC.height / 2 + d.dLat / dpxLat
    };
};

// ═════════════════════════════════════════════════════════════════════════════
titre('Le point atterrit au centre de ce qui reste visible');

// Le cas courant : notre panneau a droite (620 px + 60 px de marge), volet WME a
// gauche (300 px). Zone visible = [300, 1220] → centre attendu a 760 px.
const courant = zone(300, 680, 0);
const pC = pixelDArrivee(courant, null);
verifie('panneau a droite + volet a gauche → centre visible a 760 px',
        presque(pC.x, 760, 1e-6), 'x = ' + pC.x.toFixed(2));

// Sans rien qui masque, le comportement ne doit pas changer d un pouce.
const rien = zone(0, 0, 0);
const pR = pixelDArrivee(rien, null);
verifie('rien ne masque → centre du canevas, aucun decalage',
        presque(pR.x, 950, 1e-6) && presque(pR.y, 450, 1e-6),
        'x = ' + pR.x.toFixed(2) + ', y = ' + pR.y.toFixed(2));

// ⚠️ Le defaut de l ancienne version : elle soustrayait TOUJOURS la largeur du
// panneau, meme replie ou ferme. Ici le panneau est replie (60 px) : le decalage
// doit suivre, pas rester cale sur 620.
const replie = zone(300, 120, 0);
const pRep = pixelDArrivee(replie, null);
verifie('panneau replie → le decalage suit sa vraie largeur',
        presque(pRep.x, 1040, 1e-6), 'x = ' + pRep.x.toFixed(2));
verifie('panneau replie ≠ panneau deploye', Math.abs(pRep.x - pC.x) > 200);

// Panneau deplace a GAUCHE par l editeur : on doit rogner de ce cote-la.
const aGauche = zone(680, 0, 0);
const pG = pixelDArrivee(aGauche, null);
verifie('panneau deplace a gauche → le point part vers la droite',
        presque(pG.x, 1290, 1e-6), 'x = ' + pG.x.toFixed(2));

// La barre d edition du bas mord la hauteur : l objet ne doit pas finir dessous.
const barreBas = zone(300, 680, 200);
const pB = pixelDArrivee(barreBas, null);
verifie('barre du bas → le point remonte',
        presque(pB.y, 350, 1e-6), 'y = ' + pB.y.toFixed(2));
verifie('⚠️ le signe de la latitude est bien inverse (ecran vers le bas, latitude vers le haut)',
        pB.y < RC.height / 2);

// ═════════════════════════════════════════════════════════════════════════════
titre('Le decalage vaut pour le zoom d ARRIVEE');

// C est tout l interet du calcul en une passe : a chaque niveau l echelle double.
// Le point doit atterrir au meme PIXEL quel que soit le zoom demande.
[14, 15, 16, 17, 18, 19].forEach(z => {
    const p = pixelDArrivee(courant, z);
    verifie('zoom ' + z + ' → toujours 760 px', presque(p.x, 760, 1e-6), 'x = ' + p.x.toFixed(2));
});

// Et le decalage en DEGRES, lui, doit changer avec le zoom : plus on zoome, moins
// il faut de degres pour parcourir les memes pixels.
const d16 = _decalageVisible(courant, EXT, Z, 16);
const d18 = _decalageVisible(courant, EXT, Z, 18);
verifie('zoomer divise le decalage en degres par deux a chaque cran',
        presque(Math.abs(d16.dLon) / Math.abs(d18.dLon), 4, 1e-6),
        'rapport = ' + (Math.abs(d16.dLon) / Math.abs(d18.dLon)).toFixed(4));

// ═════════════════════════════════════════════════════════════════════════════
titre('Garde-fous');

// Zone degeneree (panneau plus large que l ecran) : le code rend `complet` et on ne
// decale plus. Mieux vaut un centrage classique qu un centrage aberrant.
const complet = { gauche: 0, droite: 1900, haut: 0, bas: 900, rc: RC, complet: true };
const dComplet = _decalageVisible(complet, EXT, Z, null);
verifie('zone marquee complete → aucun decalage', dComplet.dLon === 0 && dComplet.dLat === 0);

verifie('zone absente → aucun decalage',
        _decalageVisible(null, EXT, Z, null).dLon === 0);
verifie('emprise mal formee → aucun decalage',
        _decalageVisible(courant, [1, 2], Z, null).dLon === 0);
verifie('canevas de largeur nulle → aucun decalage',
        _decalageVisible({ ...courant, rc: { ...RC, width: 0 } }, EXT, Z, null).dLon === 0);

// ═════════════════════════════════════════════════════════════════════════════
titre('Le zoom se calcule sur la surface VISIBLE');

// ⚠️ Le fond du probleme : calculer le zoom sur le canevas entier fait « tenir »
// l objet sur une largeur dont l editeur ne voit qu une partie. A surface reduite,
// le zoom doit etre au plus egal — jamais plus rapproche.
const zTotal   = _zoomPourTaille(0.02, 0.007, 1900, 900, 1, 22, 0);
const zVisible = _zoomPourTaille(0.02, 0.007, 920,  900, 1, 22, 0);
verifie('surface reduite → zoom au plus egal, jamais plus rapproche', zVisible <= zTotal,
        'total ' + zTotal + ' vs visible ' + zVisible);

verifie('une emprise deux fois plus large coute un cran de zoom',
        _zoomPourTaille(0.04, 0.007, 1900, 900, 1, 22, 0) === zTotal - 1);
verifie('le retrait recule bien d un cran',
        _zoomPourTaille(0.02, 0.007, 1900, 900, 1, 22, 1) === zTotal - 1);
verifie('la borne haute est respectee', _zoomPourTaille(1e-9, 1e-9, 1900, 900, 15, 17, 0) === 17);
verifie('la borne basse est respectee', _zoomPourTaille(300, 300, 1900, 900, 15, 17, 0) === 15);
verifie('emprise nulle → pas de division par zero, zoom fini',
        Number.isFinite(_zoomPourTaille(0, 0, 1900, 900, 1, 22, 0)));
verifie('surface minuscule → plancher de 200 px, zoom fini',
        Number.isFinite(_zoomPourTaille(0.02, 0.007, 0, 0, 1, 22, 0)));

// C est la hauteur qui contraint quand l emprise est haute et etroite : le zoom doit
// suivre la plus contraignante des deux dimensions.
verifie('la dimension la plus contraignante l emporte',
        _zoomPourTaille(0.001, 0.5, 1900, 900, 1, 22, 0) < _zoomPourTaille(0.001, 0.001, 1900, 900, 1, 22, 0));

// ═════════════════════════════════════════════════════════════════════════════
console.log('\n' + (ko === 0 ? 'TOUT PASSE' : 'ECHECS') + ' : ' + ok + ' ok, ' + ko + ' ko\n');
process.exit(ko === 0 ? 0 : 1);
