// Aller-retour export → import sur le code REEL du fichier.
// Le KML est teste a part dans le navigateur (il lui faut DOMParser).
const fs = require('fs');
const SRC = require('path').join(__dirname,'..','WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');
const extrait = (a, b) => {
    const i = txt.indexOf(a); if (i < 0) throw new Error('introuvable : ' + a);
    const j = txt.indexOf(b, i + a.length); if (j < 0) throw new Error('fin introuvable : ' + a);
    return txt.slice(i, j);
};
const escHtml = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const code = extrait('const _polyClose', 'const _polyNorm')
           + extrait('const _polyToWKT', 'const _polyToKML')
           + extrait('const _polyFromWKT', 'const _polyFromKML')
           + extrait('const _polyParseZone', 'const _polyImportTexte');
const { _polyToWKT, _polyFromWKT, _polyParseZone, _polyClose } =
    new Function('escHtml', code + '; return { _polyToWKT, _polyFromWKT, _polyParseZone, _polyClose };')(escHtml);

let ok = 0, ko = 0;
const chk = (nom, cond, detail) => { if (cond) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + (detail !== undefined ? '\n        ' + detail : '')); } };
// Compare a 1e-6 pres : l'export arrondit a 6 decimales (~10 cm), volontairement.
const memeAnneaux = (a, b) => a.length === b.length && a.every((r, i) =>
    r.length === b[i].length && r.every((p, j) =>
        Math.abs(p[0] - b[i][j][0]) < 1e-6 && Math.abs(p[1] - b[i][j][1]) < 1e-6));

const carre = _polyClose([[[4.3, 43.79], [4.31, 43.79], [4.31, 43.80], [4.3, 43.80]]]);
const trou = _polyClose([carre[0].slice(0, -1),
    [[4.303, 43.793], [4.306, 43.793], [4.306, 43.796], [4.303, 43.796]]]);

console.log('\n— Aller-retour WKT —');
chk('carre : export puis import redonne les memes anneaux',
    memeAnneaux(_polyFromWKT(_polyToWKT(carre)), carre),
    JSON.stringify(_polyFromWKT(_polyToWKT(carre))));
chk('polygone a trou : les 2 anneaux reviennent',
    memeAnneaux(_polyFromWKT(_polyToWKT(trou)), trou),
    JSON.stringify(_polyFromWKT(_polyToWKT(trou))).slice(0, 120));
chk('detection automatique du format (WKT)',
    memeAnneaux(_polyParseZone(_polyToWKT(carre)), carre));

console.log('\n— Tolerance du lecteur WKT —');
const attendu1 = carre;
chk('minuscules', memeAnneaux(_polyFromWKT('polygon((4.3 43.79, 4.31 43.79, 4.31 43.8, 4.3 43.8, 4.3 43.79))'), attendu1));
chk('espace avant la parenthese', memeAnneaux(_polyFromWKT('POLYGON ((4.3 43.79, 4.31 43.79, 4.31 43.8, 4.3 43.8, 4.3 43.79))'), attendu1));
chk('espaces multiples entre lon et lat', memeAnneaux(_polyFromWKT('POLYGON((4.3   43.79, 4.31 43.79, 4.31 43.8, 4.3 43.8, 4.3 43.79))'), attendu1));
chk('saut de ligne dans le corps', memeAnneaux(_polyFromWKT('POLYGON((4.3 43.79,\n 4.31 43.79,\n 4.31 43.8,\n 4.3 43.8,\n 4.3 43.79))'), attendu1));
chk('prefixe SRID', memeAnneaux(_polyFromWKT('SRID=4326;POLYGON((4.3 43.79, 4.31 43.79, 4.31 43.8, 4.3 43.8, 4.3 43.79))'), attendu1));
chk('anneau non ferme → referme tout seul', memeAnneaux(_polyFromWKT('POLYGON((4.3 43.79, 4.31 43.79, 4.31 43.8, 4.3 43.8))'), attendu1));
chk('MULTIPOLYGON → premier polygone',
    memeAnneaux(_polyFromWKT('MULTIPOLYGON(((4.3 43.79, 4.31 43.79, 4.31 43.8, 4.3 43.8, 4.3 43.79)), ((5 44, 5.1 44, 5.1 44.1, 5 44)))'), attendu1));

console.log('\n— Entrees invalides : tableau vide, jamais d exception —');
[['chaine vide', ''], ['nul', null], ['texte quelconque', 'bonjour'],
 ['POINT au lieu de POLYGON', 'POINT(4.3 43.79)'],
 ['parenthese jamais fermee', 'POLYGON((4.3 43.79, 4.31 43.79'],
 ['moins de 3 sommets', 'POLYGON((4.3 43.79, 4.31 43.79))'],
 ['coordonnees non numeriques', 'POLYGON((a b, c d, e f, a b))']
].forEach(([nom, val]) => {
    let r; try { r = _polyFromWKT(val); } catch (e) { r = 'EXCEPTION: ' + e.message; }
    chk(nom + ' → []', Array.isArray(r) && r.length === 0, JSON.stringify(r));
});

console.log('\n' + (ko === 0 ? 'TOUT PASSE' : 'ECHECS') + ' : ' + ok + ' ok, ' + ko + ' ko\n');
process.exit(ko === 0 ? 0 : 1);
