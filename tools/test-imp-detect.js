// Tests du detecteur d import. Les cas qui comptent sont les AMBIGUS : meme
// extension, natures differentes. Une erreur ici envoie l editeur au mauvais endroit.
const { _impDetecter } = require('./imp-detect.js');
let ok = 0, ko = 0;
const chk = (nom, attendu, obtenu) => {
    if (attendu === obtenu) { ok++; console.log('  ok   ' + nom + '  → ' + obtenu); }
    else { ko++; console.log('  ECHEC ' + nom + '  attendu ' + attendu + ', obtenu ' + obtenu); }
};
const d = (n, t) => _impDetecter(n, t).type;

console.log('\n— CSV —');
chk('CSV de fermetures AC', 'csv', d('export.csv', 'add,123,2026-01-01 08:00,...\nadd,124,...'));
chk('CSV de virages WCT', 'csv', d('turns.csv', 'add-turn,123,456,...'));
chk('CSV avec guillemets', 'csv', d('x.csv', '"add","123","Travaux"'));
chk('tableau sans ligne d action (2 lignes, 3 colonnes)', 'csv', d('liste.txt', 'a,b,c\nd,e,f'));
chk('une seule ligne : trop peu pour conclure', 'inconnu', d('liste.txt', 'a,b,c'));
chk('colonnes irregulieres → pas un tableau', 'inconnu', d('x.csv', 'a,b,c\nd,e'));

console.log('\n— Preferences —');
chk('enveloppe WMEPrefs', 'prefs', d('wct-prefs.json', '{"format":"wme-userscript-prefs/1","script":"wct","payload":{}}'));
chk('prefs prime sur l analyse JSON', 'prefs',
    d('x.json', '{"format":"wme-userscript-prefs/1","payload":{"presets":[]},"type":"FeatureCollection"}'));

console.log('\n— WKT —');
chk('POLYGON nu', 'zone', d('', 'POLYGON((4.3 43.7, 4.4 43.7, 4.4 43.8, 4.3 43.7))'));
chk('minuscules', 'zone', d('', 'polygon((4.3 43.7, 4.4 43.7, 4.4 43.8, 4.3 43.7))'));
chk('prefixe SRID', 'zone', d('', 'SRID=4326;POLYGON((4.3 43.7, 4.4 43.7, 4.4 43.8, 4.3 43.7))'));
chk('MULTIPOLYGON', 'zone', d('', 'MULTIPOLYGON(((4.3 43.7, 4.4 43.7, 4.4 43.8, 4.3 43.7)))'));

console.log('\n— Binaires (jamais lus en texte) —');
chk('KMZ par extension', 'trace', d('parcours.kmz', ''));
chk('zip (shapefile)', 'trace', d('communes.zip', ''));
chk('signature PK', 'trace', d('sansext', 'PK...'));

console.log('\n— GPX —');
chk('GPX par balise', 'trace', d('x.txt', '<?xml version="1.0"?><gpx version="1.1"><trk>...'));
chk('GPX par extension', 'trace', d('rando.gpx', ''));

console.log('\n— KML : LE cas ambigu —');
const kmlLigne = '<kml><Placemark><LineString><coordinates>4,43 4.1,43.1</coordinates></LineString></Placemark></kml>';
const kmlPoly = '<kml><Placemark><Polygon><outerBoundaryIs><LinearRing><coordinates>4,43 4.1,43 4.1,43.1 4,43</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark></kml>';
chk('KML de lignes → trace', 'trace', d('parcours.kml', kmlLigne));
chk('KML de polygone → zone', 'zone', d('zone.kml', kmlPoly));
chk('KML mixte → on demande', 'mixte', d('tout.kml', kmlLigne.replace('</kml>', '') + kmlPoly.replace('<kml>', '')));
const mixte = _impDetecter('tout.kml', kmlLigne.replace('</kml>', '') + kmlPoly.replace('<kml>', ''));
chk('le decompte accompagne la question (lignes)', 1, mixte.lignes);
chk('le decompte accompagne la question (polygones)', 1, mixte.polygones);

console.log('\n— GeoJSON —');
chk('LineString → trace', 'trace', d('x.geojson', '{"type":"Feature","geometry":{"type":"LineString","coordinates":[[4,43],[4.1,43.1]]}}'));
chk('Polygon → zone', 'zone', d('x.geojson', '{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[4,43],[4.1,43],[4.1,43.1],[4,43]]]}}'));
chk('FeatureCollection mixte → on demande', 'mixte', d('x.geojson',
    '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"LineString","coordinates":[]}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[]}}]}'));
chk('GeometryCollection exploree', 'zone', d('x.json',
    '{"type":"GeometryCollection","geometries":[{"type":"Polygon","coordinates":[]}]}'));
chk('MultiLineString', 'trace', d('x.geojson', '{"type":"MultiLineString","coordinates":[]}'));
chk('JSON sans geometrie → inconnu', 'inconnu', d('x.json', '{"a":1,"b":[1,2]}'));
chk('JSON casse → inconnu', 'inconnu', d('x.json', '{"type":"Feature",'));

console.log('\n— Rien de reconnaissable —');
chk('texte quelconque', 'inconnu', d('lisezmoi.txt', 'Bonjour, ceci est une note.'));
chk('fichier vide', 'inconnu', d('vide.dat', ''));
chk('PDF', 'inconnu', d('doc.pdf', '%PDF-1.4 ...'));

console.log('\n' + (ko === 0 ? 'TOUT PASSE' : 'ECHECS') + ' : ' + ok + ' ok, ' + ko + ' ko\n');
process.exit(ko === 0 ? 0 : 1);
