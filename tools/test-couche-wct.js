// L'objet « calque WCT » (creerCoucheWct), qui remplace depuis le retrait de `W` (24/11/2026)
// les calques OpenLayers posés par W.map.addLayer. Il porte un calque du SDK, range le style de
// chaque objet dans ses propriétés (relu par le styleContext), découpe les géométries multiples
// — le SDK refuse TOUT LE LOT sur une Multi* (DiaLog 29/09, BAN 27/09) — et rejoue objet par
// objet un lot refusé pour une autre raison.
// Depuis l'étape async (04/10/2026), toutes les opérations sont attendues et passent par une file :
// le calque doit EXISTER avant qu'on y pose quoi que ce soit.
//
// Le code est extrait du fichier réel ; le SDK est une doublure qui valide comme le vrai et qui,
// comme le vrai SDK en mode async, rend des promesses et REJETTE au lieu de lever.
const fs = require('fs');
const SRC = require('path').join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');
const extrait = (a, b) => {
    const i = txt.indexOf(a); if (i < 0) throw new Error('introuvable : ' + a);
    const j = txt.indexOf(b, i + a.length); if (j < 0) throw new Error('fin introuvable : ' + a);
    return txt.slice(i, j + b.length);
};
const bloc = extrait('const _WCT_STYLE_DEF = ', "return enFile(() => _essai(() => sdk.Map.removeLayer({ layerName }), 'calque ' + nom));\n        },\n    };\n};");
const essai = extrait('const _essai = (fn, ctx) => {', '\n};');
let ok = 0, ko = 0;
const chk = (nom, cond, detail) => { if (cond) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + (detail !== undefined ? '\n        ' + detail : '')); } };

const monter = (code, { lent } = {}) => {
    const st = { couches: {}, z: {}, vis: {}, retirees: [], logs: [], ordre: [] };
    const valide = g => ['Point', 'LineString', 'Polygon'].includes(g.type)
        && !(g.type === 'LineString' && g.coordinates.length < 2);
    // Doublure async : chaque méthode rend une promesse ; `lent` retarde la création du calque,
    // pour vérifier que rien n'est posé avant qu'il existe.
    const att = ms => new Promise(r => setTimeout(r, ms));
    const A = fn => async (...a) => fn(...a);
    const sdk = { Map: {
        addLayer: async a => { if (lent) await att(30); st.ordre.push('addLayer'); st.couches[a.layerName] = { opts: a, feats: [] }; },
        setLayerZIndex: A(a => { st.z[a.layerName] = a.zIndex; }),
        getLayerZIndex: A(a => { const z = { roads: 2065, segments: 2305, venues: 2285, closures: 6365 }[a.layerName]; if (z === undefined) throw new Error('x'); return z; }),
        addFeaturesToLayer: A(a => { if (!st.couches[a.layerName]) throw new Error('calque inexistant');
                                     if (a.features.some(f => !valide(f.geometry))) throw new Error('géométrie refusée');
                                     st.ordre.push('add'); st.couches[a.layerName].feats.push(...a.features); }),
        addFeatureToLayer: A(a => { if (!valide(a.feature.geometry)) throw new Error('géométrie refusée');
                                    st.couches[a.layerName].feats.push(a.feature); }),
        removeAllFeaturesFromLayer: A(a => { st.couches[a.layerName].feats = []; }),
        setLayerVisibility: A(a => { st.vis[a.layerName] = a.visibility; }),
        removeLayer: A(a => { st.retirees.push(a.layerName); delete st.couches[a.layerName]; }),
    } };
    const log = m => st.logs.push(m);
    const f = new Function('sdk', 'log', essai + '\n' + code + '\nreturn { creerCoucheWct, _wctStyleCtx, _wctStyleTpl };');
    return { ...f(sdk, log), st };
};
const LIGNES2 = { type: 'MultiLineString', coordinates: [[[2, 48], [2.1, 48.1]], [[2.2, 48], [2.3, 48.1]]] };

(async () => {
    console.log('\n— Création : calque SDK, style relu par le contexte, au-dessus des fermetures de WME —');
    const a = monter(bloc);
    const c = a.creerCoucheWct('WCT_TRACE_x');
    await c.ajouter([]);
    const L = a.st.couches[c.layerName];
    chk('un calque SDK est créé', !!L);
    chk('une règle de style unique, alimentée par le contexte', L.opts.styleRules.length === 1 && L.opts.styleRules[0].style.strokeColor === '${wct_strokeColor}');
    chk('z-index au-dessus des fermetures natives (6365)', a.st.z[c.layerName] > 6365, a.st.z[c.layerName]);
    const c2 = a.creerCoucheWct('WCT_TRACE_x');
    chk('nom unique à chaque création', c2.layerName !== c.layerName);

    console.log('\n— Ajout : découpe des multiples, style par objet —');
    const n = await c.ajouter([
        { geometry: LIGNES2, style: { strokeColor: '#ff0000' } },
        { geometry: { type: 'MultiPolygon', coordinates: [[[[2, 48], [2.1, 48], [2.1, 48.1], [2, 48]]]] }, style: { strokeColor: '#00ff00' }, poly: true },
    ]);
    chk('3 objets simples posés (2 lignes + 1 polygone)', n === 3 && L.feats.length === 3, n + ' / ' + L.feats.length);
    chk('aucune géométrie multiple n\'atteint le SDK', L.feats.every(f => !/^Multi|Collection/.test(f.geometry.type)));
    const ctx = a._wctStyleCtx;
    chk('le contexte rend la couleur de l\'objet', ctx.wct_strokeColor({ feature: L.feats[0] }) === '#ff0000');
    chk('…et la valeur par défaut d\'une clé absente', ctx.wct_strokeWidth({ feature: L.feats[0] }) === 2);

    console.log('\n— SDK lent : rien n\'est posé avant que le calque existe —');
    const l = monter(bloc, { lent: true });
    const cl = l.creerCoucheWct('WCT_ZONE');
    const nl = await cl.ajouter([{ geometry: { type: 'Point', coordinates: [2, 48] }, style: {} }]);
    chk('l\'objet est posé, APRÈS la création du calque', nl === 1 && l.st.ordre.join(',') === 'addLayer,add', l.st.ordre.join(','));

    console.log('\n— Un objet invalide ne fait pas perdre le lot (le SDK REJETTE, il ne lève pas) —');
    const d = a.creerCoucheWct('WCT_ZONE');
    const nd = await d.ajouter([
        { geometry: { type: 'LineString', coordinates: [[2, 48]] }, style: {} },             // 1 point : refusé
        { geometry: { type: 'LineString', coordinates: [[2, 48], [2.1, 48.1]] }, style: {} },
    ]);
    chk('l\'objet valide est posé, le fautif seul est écarté', nd === 1 && a.st.couches[d.layerName].feats.length === 1, nd);
    chk('le refus est journalisé', a.st.logs.some(m => /1 objet\(s\) refusé/.test(m)), a.st.logs.join(' | '));

    console.log('\n— Restyler, masquer, détruire —');
    await c.restyler(o => ({ strokeColor: o.poly ? '#0000ff' : '#111111' }));
    const coul = L.feats.map(f => f.properties._st.strokeColor);
    chk('restyler repose les objets avec le nouveau style', L.feats.length === 3 && coul.filter(x => x === '#111111').length === 2 && coul.includes('#0000ff'), coul.join(','));
    await c.setVisibility(false);
    chk('setVisibility passe par le SDK', a.st.vis[c.layerName] === false);
    await c.detruire(); await c.detruire();
    chk('detruire retire le calque une seule fois', a.st.retirees.filter(x => x === c.layerName).length === 1);
    chk('un calque détruit ne repose plus rien', (await c.ajouter([{ geometry: { type: 'Point', coordinates: [2, 48] }, style: {} }])) === 0);

    console.log('\n— Témoin : sans la découpe, une Multi* fait refuser tout le lot —');
    const sansDecoupe = bloc.replace("case 'MultiLineString': return g.coordinates.map(c => ({ type:'LineString', coordinates:c }));", "case 'MultiLineString': return [g];");
    chk('TÉMOIN : le remplacement a mordu', sansDecoupe !== bloc);
    const t = monter(sansDecoupe);
    const ct = t.creerCoucheWct('WCT_TRACE_t');
    const nt = await ct.ajouter([{ geometry: LIGNES2, style: {} }]);
    chk('TÉMOIN : sans découpe, la ligne multiple n\'est pas dessinée', nt === 0 && t.st.couches[ct.layerName].feats.length === 0, nt);

    console.log('\n— Témoin : sans attendre la création, un SDK lent pose dans le vide —');
    const sansAttente = bloc.replace('let file = pret.catch(', 'let file = Promise.resolve(); pret.catch(');
    chk('TÉMOIN : le remplacement a mordu', sansAttente !== bloc);
    const w = monter(sansAttente, { lent: true });
    const cw = w.creerCoucheWct('WCT_ZONE');
    const nw = await cw.ajouter([{ geometry: { type: 'Point', coordinates: [2, 48] }, style: {} }]);
    chk('TÉMOIN : sans attente, rien n\'est posé (le calque n\'existait pas encore)', nw === 0, nw);

    console.log('\n' + ok + ' ok, ' + ko + ' échec(s)');
    process.exit(ko ? 1 : 0);
})();
