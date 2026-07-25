// Les catch vides ne se valent pas. Un « best effort » sur du DOM optionnel est
// legitime ; avaler l echec d une ECRITURE ou d un CHARGEMENT ne l est pas — c est
// ainsi qu une fonction disparait en silence (cf. le getById qui rendait null et
// faisait tomber toute une fonctionnalite sans un mot).
const fs = require('fs');
const txt = fs.readFileSync(require('path').join(__dirname,'..','WME_ClosuresToolkit.user.js'), 'utf8');
const noLigne = i => txt.slice(0, i).split('\n').length;

// Classement par ce que le try CONTENAIT
const CAT = [
  [/setMapCenter|setZoomLevel|centerMapOn|getMapExtent|getZoomLevel|getMapCenter/, 'carte (cadrage)'],
  [/removeLayer|addLayer|destroy\(\)|redraw\(\)|olLayer|OpenLayers/,              'calque OL'],
  [/localStorage|WCT_v1|JSON\.parse/,                                             'stockage / parsing'],
  [/addClosure|save\(\)|undoAll|setSelection|actionManager/,                       'ECRITURE carte'],
  [/getById|getObjectById|getAll\(|getSegment|getAddress/,                         'lecture modele'],
  [/clipboard|writeText/,                                                          'presse-papiers'],
  [/querySelector|classList|style\.|innerHTML|remove\(\)|focus\(\)/,               'DOM'],
  [/fetch|GM_xmlhttpRequest|responseText/,                                         'reseau'],
];
const res = {};
const re = /try\s*\{/g;
let m;
while ((m = re.exec(txt)) !== null) {
    // corps du try
    let p = 0, k = m.index + m[0].length - 1, fin = -1;
    for (let z = k; z < txt.length; z++) {
        const c = txt[z];
        if (c === '{') p++;
        else if (c === '}') { p--; if (p === 0) { fin = z; break; } }
        else if (c === '`' || c === "'" || c === '"') { const q = c; z++; while (z < txt.length && txt[z] !== q) { if (txt[z] === '\\') z++; z++; } }
    }
    if (fin < 0) continue;
    const apres = txt.slice(fin, fin + 60);
    if (!/^\}\s*catch\s*\([\w$]*\)\s*\{\s*\}/.test(apres)) continue;   // seulement les MUETS
    const corps = txt.slice(m.index, fin);
    let cat = 'autre';
    for (const [rx, nom] of CAT) if (rx.test(corps)) { cat = nom; break; }
    (res[cat] = res[cat] || []).push({ ligne: noLigne(m.index), extrait: corps.replace(/\s+/g, ' ').slice(12, 90) });
}
const ordre = ['ECRITURE carte', 'reseau', 'stockage / parsing', 'lecture modele', 'carte (cadrage)', 'calque OL', 'presse-papiers', 'DOM', 'autre'];
for (const c of ordre) {
    if (!res[c]) continue;
    console.log('\n### ' + c.toUpperCase() + ' (' + res[c].length + ')');
    res[c].forEach(x => console.log('  L' + x.ligne + ' : ' + x.extrait));
}
