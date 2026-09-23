// Une zone GeoJSON se lit-elle ? — _polyParseZone, _polyFromGeoJSON, _polyFromWKT et
// _polyClose, EXTRAITS DU FICHIER REEL (methode poly-core.js : jamais une copie).
//
// POURQUOI CE TEST EXISTE (2026-09-23, v1.18.05) : l'import 📥 routait un polygone GeoJSON
// vers la zone — l'aide le promettait — mais le lecteur de zone ne connaissait que KML et
// WKT. Resultat : « Zone illisible » sur un fichier valide, en pleine preparation de la
// visite du pape. test-imp-route.js verifiait l'AIGUILLAGE, personne ne verifiait que la
// destination savait lire ce qu'on lui envoyait.
const fs = require('fs');
const path = require('path');
const SRC = process.argv[2] || path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');
const extraire = (debut) => {
    const i = txt.indexOf(debut);
    if (i < 0) { console.error('❌ introuvable : ' + debut); process.exit(2); }
    const j = txt.indexOf('\n};', i);
    return txt.slice(i, j + 3);
};
const code = ['const _polyClose', 'const _polyFromWKT = (txt)', 'const _polyFromGeoJSON = (txt)',
              'const _polyParseZone = (txt)'].map(extraire).join('\n');
const { parse } = new Function(code + `
    const _polyFromKML = () => 'KML';
    return { parse: _polyParseZone };`)();

let ok = 0, ko = 0;
const chk = (nom, cond, detail) => {
    if (cond) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + (detail ? '\n         ' + detail : '')); }
};
const carre = [[2.30, 48.86], [2.31, 48.86], [2.31, 48.87], [2.30, 48.87], [2.30, 48.86]];
const fc = { type: 'FeatureCollection', features: [
    { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[0, 0], [1, 1]] } },
    { type: 'Feature', properties: { name: 'z' }, geometry: { type: 'Polygon', coordinates: [carre] } }] };

console.log('\n— Formes GeoJSON —');
let r = parse(JSON.stringify(fc));
chk('FeatureCollection : le polygone est trouve apres une ligne', r.length === 1 && r[0].length === 5, JSON.stringify(r));
r = parse(JSON.stringify(fc.features[1]));
chk('Feature seule', r.length === 1 && r[0][1][0] === 2.31);
r = parse(JSON.stringify({ type: 'Polygon', coordinates: [carre] }));
chk('geometrie nue', r.length === 1);
r = parse(JSON.stringify({ type: 'MultiPolygon', coordinates: [[carre], [carre]] }));
chk('MultiPolygon : le premier polygone', r.length === 1);
r = parse(JSON.stringify({ type: 'Polygon', coordinates: [carre.slice(0, 4)] }));
chk('anneau non ferme : referme', r.length === 1 && r[0].length === 5 && r[0][4][0] === r[0][0][0]);
chk('JSON sans polygone : vide', parse(JSON.stringify(fc.features[0])).length === 0);
chk('JSON casse : vide, sans lever', parse('{"type":"Polygon", ').length === 0);

console.log('\n— Non-regression : les autres formats passent toujours au bon lecteur —');
chk('WKT', parse('POLYGON((2.30 48.86, 2.31 48.86, 2.31 48.87, 2.30 48.86))').length === 1);
chk('KML aiguille vers le lecteur KML', parse('<kml></kml>') === 'KML');

console.log('\n— Les fichiers reels de la zone jaune —');
const DL = 'C:/Users/drslu/Downloads/';
for (const f of ['zone_jaune_champs_elysees_limites_incluses.geojson', 'zone_jaune_champs_elysees_limites_exclues.geojson']) {
    if (!fs.existsSync(DL + f)) { console.log('  --   ' + f + ' absent, saute'); continue; }
    r = parse(fs.readFileSync(DL + f, 'utf8'));
    chk(f + ' : ' + (r[0] ? r[0].length : 0) + ' points', r.length === 1 && r[0].length >= 4);
}
console.log('\n' + (ko ? `❌ ${ko} ECHEC(S), ${ok} ok` : `✅ TOUT PASSE : ${ok} ok, 0 ko`));
process.exit(ko ? 1 : 0);
