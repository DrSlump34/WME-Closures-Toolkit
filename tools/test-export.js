// Teste les exports WKT / KML EXTRAITS DU FICHIER REEL (pas d'une copie qui pourrait
// diverger). Verifie le format, pas seulement l'absence d'erreur.
const fs = require('fs');
const SRC = require('path').join(__dirname,'..','WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');

const extrait = (debut, fin) => {
    const i = txt.indexOf(debut);
    if (i < 0) throw new Error('introuvable : ' + debut);
    const j = txt.indexOf(fin, i);
    if (j < 0) throw new Error('fin introuvable pour : ' + debut);
    return txt.slice(i, j);
};
const escHtml = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const code = extrait("const _polyToWKT", "const _polyDownload");
const f = new Function('escHtml', code + '; return { _polyToWKT, _polyToKML };');
const { _polyToWKT, _polyToKML } = f(escHtml);

let ok = 0, ko = 0;
const chk = (nom, cond, detail) => { if (cond) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + (detail !== undefined ? '\n        ' + detail : '')); } };

const carre = [[[4.3, 43.79], [4.31, 43.79], [4.31, 43.80], [4.3, 43.80], [4.3, 43.79]]];
const trou  = [carre[0], [[4.303, 43.793], [4.306, 43.793], [4.306, 43.796], [4.303, 43.796], [4.303, 43.793]]];

console.log('\n— WKT —');
const w = _polyToWKT(carre);
chk('commence par POLYGON((', w.startsWith('POLYGON(('), w.slice(0, 30));
chk('se termine par ))', w.endsWith('))'), w.slice(-20));
chk('couples « lon lat » separes par des virgules', /^POLYGON\(\((-?\d+\.\d+ -?\d+\.\d+)(, -?\d+\.\d+ -?\d+\.\d+)+\)\)$/.test(w), w);
chk('5 sommets pour un carre ferme', w.split(',').length === 5, w);
chk('lon AVANT lat (ordre WKT)', w.includes('4.300000 43.790000'), w.slice(0, 40));
const wt = _polyToWKT(trou);
chk('trou rendu comme 2e anneau', /\)\), \(\(|\), \(/.test(wt) && wt.split('), (').length === 2, wt.slice(0, 60) + '…');
chk('trou : parentheses equilibrees',
    (wt.match(/\(/g) || []).length === (wt.match(/\)/g) || []).length, wt);

console.log('\n— KML —');
const k = _polyToKML(carre, 'WCT_zone_2026-07-25');
chk('declaration XML en tete', k.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
chk('espace de noms KML 2.2', k.includes('xmlns="http://www.opengis.net/kml/2.2"'));
chk('balises equilibrees (kml/Document/Placemark/Polygon)',
    ['kml','Document','Placemark','Polygon','outerBoundaryIs','LinearRing','coordinates']
        .every(b => (k.match(new RegExp('<'+b+'[ >]','g'))||[]).length === (k.match(new RegExp('</'+b+'>','g'))||[]).length));
chk('coordonnees en lon,lat,alt', /<coordinates>4\.300000,43\.790000,0 /.test(k), (k.match(/<coordinates>[^<]{0,50}/)||[''])[0]);
chk('nom repris dans le document', k.includes('WCT_zone_2026-07-25'));
const kt = _polyToKML(trou, 'zone');
chk('trou → innerBoundaryIs', kt.includes('<innerBoundaryIs>') && kt.includes('</innerBoundaryIs>'));
chk('sans trou → aucun innerBoundaryIs', !k.includes('<innerBoundaryIs>'));
// Un nom hostile ne doit pas casser le XML
const kx = _polyToKML(carre, 'zone <script> & "co"');
chk('nom echappe (pas de < ni & bruts)', !/<script>/.test(kx) && kx.includes('&amp;'), (kx.match(/<name>[^<]*<\/name>/)||[''])[0]);

console.log('\n' + (ko === 0 ? 'TOUT PASSE' : 'ECHECS') + ' : ' + ok + ' ok, ' + ko + ' ko\n');
process.exit(ko === 0 ? 0 : 1);
