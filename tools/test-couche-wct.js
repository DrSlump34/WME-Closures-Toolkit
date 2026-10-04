// L'objet « calque WCT » (creerCoucheWct), qui remplace depuis le retrait de `W` (24/11/2026)
// les calques OpenLayers posés par W.map.addLayer. Il porte un calque du SDK, range le style de
// chaque objet dans ses propriétés (relu par le styleContext), découpe les géométries multiples
// — le SDK refuse TOUT LE LOT sur une Multi* (DiaLog 29/09, BAN 27/09) — et rejoue objet par
// objet un lot refusé pour une autre raison.
//
// Le code est extrait du fichier réel ; le SDK est une doublure qui valide comme le vrai.
const fs = require('fs');
const SRC = require('path').join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');
const extrait = (a, b) => {
    const i = txt.indexOf(a); if (i < 0) throw new Error('introuvable : ' + a);
    const j = txt.indexOf(b, i + a.length); if (j < 0) throw new Error('fin introuvable : ' + a);
    return txt.slice(i, j + b.length);
};
const bloc = extrait('const _WCT_STYLE_DEF = ', "detruire(){ if(!vivant) return; vivant = false; try{ sdk.Map.removeLayer({ layerName }); }catch(e){} },\n    };\n};");
let ok = 0, ko = 0;
const chk = (nom, cond, detail) => { if (cond) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + (detail !== undefined ? '\n        ' + detail : '')); } };

const monter = (code) => {
    const st = { couches: {}, z: {}, vis: {}, retirees: [], logs: [] };
    const valide = g => ['Point', 'LineString', 'Polygon'].includes(g.type)
        && !(g.type === 'LineString' && g.coordinates.length < 2);
    const sdk = { Map: {
        addLayer: a => { st.couches[a.layerName] = { opts: a, feats: [] }; },
        setLayerZIndex: a => { st.z[a.layerName] = a.zIndex; },
        getLayerZIndex: a => ({ roads: 2065, segments: 2305, venues: 2285, closures: 6365 }[a.layerName] ?? (() => { throw new Error('x'); })()),
        addFeaturesToLayer: a => { if (a.features.some(f => !valide(f.geometry))) throw new Error('géométrie refusée');
                                   st.couches[a.layerName].feats.push(...a.features); },
        addFeatureToLayer: a => { if (!valide(a.feature.geometry)) throw new Error('géométrie refusée');
                                  st.couches[a.layerName].feats.push(a.feature); },
        removeAllFeaturesFromLayer: a => { st.couches[a.layerName].feats = []; },
        setLayerVisibility: a => { st.vis[a.layerName] = a.visibility; },
        removeLayer: a => { st.retirees.push(a.layerName); delete st.couches[a.layerName]; },
    } };
    const f = new Function('sdk', 'log', code + '\nreturn { creerCoucheWct, _wctStyleCtx, _wctStyleTpl };');
    return { ...f(sdk, m => st.logs.push(m)), st };
};

console.log('\n— Création : calque SDK, style relu par le contexte, au-dessus des fermetures de WME —');
const a = monter(bloc);
const c = a.creerCoucheWct('WCT_TRACE_x');
const L = a.st.couches[c.layerName];
chk('un calque SDK est créé', !!L);
chk('une règle de style unique, alimentée par le contexte', L.opts.styleRules.length === 1 && L.opts.styleRules[0].style.strokeColor === '${wct_strokeColor}');
chk('z-index au-dessus des fermetures natives (6365)', a.st.z[c.layerName] > 6365, a.st.z[c.layerName]);
const c2 = a.creerCoucheWct('WCT_TRACE_x');
chk('nom unique à chaque création', c2.layerName !== c.layerName);

console.log('\n— Ajout : découpe des multiples, style par objet —');
const n = c.ajouter([
    { geometry: { type: 'MultiLineString', coordinates: [[[2, 48], [2.1, 48.1]], [[2.2, 48], [2.3, 48.1]]] }, style: { strokeColor: '#ff0000' } },
    { geometry: { type: 'MultiPolygon', coordinates: [[[[2, 48], [2.1, 48], [2.1, 48.1], [2, 48]]]] }, style: { strokeColor: '#00ff00' }, poly: true },
]);
chk('3 objets simples posés (2 lignes + 1 polygone)', n === 3 && L.feats.length === 3, n + ' / ' + L.feats.length);
chk('aucune géométrie multiple n\'atteint le SDK', L.feats.every(f => !/^Multi|Collection/.test(f.geometry.type)));
const ctx = a._wctStyleCtx;
chk('le contexte rend la couleur de l\'objet', ctx.wct_strokeColor({ feature: L.feats[0] }) === '#ff0000');
chk('…et la valeur par défaut d\'une clé absente', ctx.wct_strokeWidth({ feature: L.feats[0] }) === 2);

console.log('\n— Un objet invalide ne fait pas perdre le lot —');
const d = a.creerCoucheWct('WCT_ZONE');
const nd = d.ajouter([
    { geometry: { type: 'LineString', coordinates: [[2, 48]] }, style: {} },             // 1 point : refusé
    { geometry: { type: 'LineString', coordinates: [[2, 48], [2.1, 48.1]] }, style: {} },
]);
chk('l\'objet valide est posé, le fautif seul est écarté', nd === 1 && a.st.couches[d.layerName].feats.length === 1, nd);
chk('le refus est journalisé', a.st.logs.some(m => /1 objet\(s\) refusé/.test(m)), a.st.logs.join(' | '));

console.log('\n— Restyler, masquer, détruire —');
c.restyler(o => ({ strokeColor: o.poly ? '#0000ff' : '#111111' }));
const coul = L.feats.map(f => f.properties._st.strokeColor);
chk('restyler repose les objets avec le nouveau style', L.feats.length === 3 && coul.filter(x => x === '#111111').length === 2 && coul.includes('#0000ff'), coul.join(','));
c.setVisibility(false);
chk('setVisibility passe par le SDK', a.st.vis[c.layerName] === false);
c.detruire(); c.detruire();
chk('detruire retire le calque une seule fois', a.st.retirees.filter(x => x === c.layerName).length === 1);
chk('un calque détruit ne repose plus rien', c.ajouter([{ geometry: { type: 'Point', coordinates: [2, 48] }, style: {} }]) === 0);

console.log('\n— Témoin : sans la découpe, une Multi* fait refuser tout le lot —');
const sansDecoupe = bloc.replace("case 'MultiLineString': return g.coordinates.map(c => ({ type:'LineString', coordinates:c }));", "case 'MultiLineString': return [g];");
chk('TÉMOIN : le remplacement a mordu', sansDecoupe !== bloc);
const t = monter(sansDecoupe);
const ct = t.creerCoucheWct('WCT_TRACE_t');
const nt = ct.ajouter([{ geometry: { type: 'MultiLineString', coordinates: [[[2, 48], [2.1, 48.1]], [[2.2, 48], [2.3, 48.1]]] }, style: {} }]);
chk('TÉMOIN : sans découpe, la ligne multiple n\'est pas dessinée', nt === 0 && t.st.couches[ct.layerName].feats.length === 0, nt);

console.log('\n' + ok + ' ok, ' + ko + ' échec(s)');
process.exit(ko ? 1 : 0);
