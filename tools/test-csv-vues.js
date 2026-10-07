// Ligne CSV plus grande que la vue (1.24.05) — _csvLocaliser, _cumulPose, _attendreSegments,
// EXTRAITS DU FICHIER RÉEL (méthode poly-core.js : jamais une copie), sur un SDK simulé.
//
// Pourquoi ce test existe (07/10/2026, veille crues) : une ligne CSV de 78 segments (D8, 21 km),
// centrée sur son milieu ; WCT n'a posé que ce que la vue chargeait. Deux défauts :
//  1. des segments DANS la vue sortaient « non chargés » : le modèle était relu avant que le
//     chargement n'ait commencé (isMapLoading() dit « fini » trop tôt) ⇒ _attendreSegments ;
//  2. les segments HORS de la vue n'étaient jamais cherchés ⇒ _csvLocaliser les retrouve par
//     l'API Features, en anneaux de tuiles autour du centre, et la pose se fait vue par vue.
const fs = require('fs');
const path = require('path');
const SRC = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');

const extrait = (debut, fin) => {
    const i = txt.indexOf(debut);
    if (i < 0) { console.error('❌ introuvable : ' + debut); process.exit(2); }
    const j = txt.indexOf(fin, i);
    if (j < 0) { console.error('❌ fin introuvable : ' + debut); process.exit(2); }
    return txt.slice(i, j + fin.length);
};
let ok = 0, ko = 0;
const chk = (nom, vrai, detail) => {
    if (vrai) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + (detail ? '  → ' + detail : '')); }
};

const cLoc = extrait('const CSV_LOCATE_RINGS', '\n    return trouves;\n};');
const cCumul = extrait('const _cumulPose=', 'refus:[...a.refus,...b.refus] };');
const cAttente = extrait('const _attendreSegments=async(ids)=>{', '\n};');

// ── Monde simulé : des segments posés sur une droite est-ouest de 21 km ──────────────
const LAT = 43.75, LON0 = 3.14;
const kmLon = 1 / (111.320 * Math.cos(LAT * Math.PI / 180));
const ligne = Array.from({ length: 78 }, (_, k) => {
    const x = LON0 + (k - 38.5) * 0.27 * kmLon;          // ±10,5 km autour du centre
    return { id: 1000 + k, geometry: { coordinates: [[x, LAT], [x + 0.2 * kmLon, LAT]] }, fromNodeID: 500 + k, toNodeID: 501 + k };
});
const fabrique = (rings, monde, compteur) => new Function('POLY_TILE_KM', '_polyFetchTile', 'log', '_applyAborted',
    cLoc.replace(/const CSV_LOCATE_RINGS = \d+;/, rings == null ? '$&' : `const CSV_LOCATE_RINGS = ${rings};`) +
    '\nreturn _csvLocaliser;')(5, async bb => {
        compteur.n++;
        return monde.filter(s => { const [x, y] = s.geometry.coordinates[0];
            return x >= bb.minLon && x < bb.maxLon && y >= bb.minLat && y < bb.maxLat; });
    }, () => {}, false);

(async () => {
    console.log('— Localisation des segments hors de la vue —');
    {
        const n = { n: 0 }, loc = fabrique(null, ligne, n);
        const manquants = [1000, 1001, 1002, 1075, 1076, 1077];      // les deux bouts, à ±10 km
        const t = await loc({ lon: LON0, lat: LAT }, manquants);
        chk('les 6 segments des deux bouts sont retrouvés', manquants.every(id => t.has(id)), [...t.keys()].join(','));
        chk('chacun avec sa géométrie', manquants.every(id => t.get(id).geometry.coordinates.length === 2));
        chk('rien d\'autre n\'est rendu', t.size === 6, t.size);
        chk('arrêt dès que tout est trouvé : 25 tuiles au plus (anneaux 0 à 2)', n.n <= 25, n.n + ' tuiles');
    }
    {
        const n = { n: 0 }, loc = fabrique(null, ligne, n);
        const t = await loc({ lon: LON0, lat: LAT }, [1038]);       // au centre
        chk('un segment au centre : une seule tuile lue', t.has(1038) && n.n === 1, n.n + ' tuiles');
    }
    {
        const n = { n: 0 }, loc = fabrique(null, ligne, n);
        const t = await loc({ lon: LON0, lat: LAT }, [999999]);     // n'existe pas
        chk('introuvable : rien de rendu, recherche bornée à 49 tuiles (±17,5 km)', t.size === 0 && n.n === 49, n.n + ' tuiles');
    }
    {
        const n = { n: 0 }, loc = fabrique(0, ligne, n);             // TÉMOIN : sans anneaux
        const t = await loc({ lon: LON0, lat: LAT }, [1000, 1077]);
        chk('TÉMOIN : réduite à la tuile du centre, la recherche manque les bouts', t.size === 0, t.size);
    }

    console.log('— Cumul des bilans d\'une occurrence posée en plusieurs vues —');
    {
        const _cumulPose = new Function(cCumul + '\nreturn _cumulPose;')();
        const v = (o) => Object.assign({ demandes: 0, poses: 0, absents: 0, sansSens: 0, dejaFermes: 0, sensBloques: 0, combles: 0, trous: 0, refus: [] }, o);
        const a = v({ demandes: 40, poses: 38, dejaFermes: 2, refus: [{ segs: [1], n: 1, msg: 'x' }] });
        const b = v({ demandes: 38, poses: 37, absents: 1, combles: 2, trous: 3 });
        const s = _cumulPose(_cumulPose(null, a), b);
        chk('null + a = a', _cumulPose(null, a) === a);
        chk('les compteurs s\'additionnent', s.demandes === 78 && s.poses === 75 && s.absents === 1 && s.dejaFermes === 2 && s.combles === 2 && s.trous === 3);
        chk('les refus se cumulent', s.refus.length === 1 && s.refus[0].msg === 'x');
        const cles = Object.keys(v({})).sort().join(',');
        chk('aucun compteur oublié (mêmes clés que le bilan de _poserParMoitie)', Object.keys(s).sort().join(',') === cles, Object.keys(s).sort().join(','));
    }

    console.log('— Attente des segments après un recentrage —');
    {
        // Le modèle se remplit par paliers, avec retard : 0 à la 1re lecture, puis 50, puis 78.
        const prepare = (paliers, code = cAttente) => {
            let k = 0; const charges = new Set();
            const relire = async () => { const n = paliers[Math.min(k++, paliers.length - 1)]; charges.clear(); for (let i = 0; i < n; i++) charges.add(1000 + i); };
            const f = new Function('getSegById', '_attendreCarte', '_wmeModele', '_applyAborted', 'setTimeout',
                code + '\nreturn _attendreSegments;')(id => charges.has(id) ? {} : null, async () => {}, relire, false, (r) => r());
            return { f, charges, lectures: () => k };
        };
        const ids = Array.from({ length: 78 }, (_, i) => 1000 + i);
        let m = prepare([0, 50, 78]);
        await m.f(ids);
        chk('attend que les 78 soient là quand le chargement arrive en retard', m.charges.size === 78, m.charges.size);
        m = prepare([0, 65, 65, 65, 65]);
        await m.f(ids);
        chk('s\'arrête quand le compte ne bouge plus (65 : le reste est hors de la vue)', m.charges.size === 65 && m.lectures() <= 4, m.lectures() + ' lectures');
        m = prepare([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        await m.f(ids);
        chk('borné : 12 relectures au plus si rien n\'arrive', m.lectures() <= 12, m.lectures());
        // TÉMOIN : la boucle de relecture neutralisée (comportement de la 1.24.04), le même
        // chargement en retard ne doit rien laisser voir. Sinon ce banc ne mordrait sur rien.
        const sansBoucle = cAttente.replace('k<12&&', 'k<0&&');
        chk('TÉMOIN : la mutation a bien porté', sansBoucle !== cAttente);
        m = prepare([0, 50, 78], sansBoucle);
        await m.f(ids);
        chk('TÉMOIN : sans relecture, les 78 segments en retard sont manqués', m.charges.size < 78, m.charges.size);
    }

    console.log('— Branchements dans applyQueue —');
    {
        const aq = extrait('const applyQueue=', '\nconst ');
        chk('le centrage CSV est attendu', /await _centrerSurZoneVisibleOL\(e\.csvCenter\.lon/.test(aq));
        chk('puis le délai du balayage et l\'attente des segments', /await _sweepSleep\(SWEEP_SETTLE_MS\);\s*await waitMapLoaded\(\);\s*await _attendreSegments\(e\.segIds\|\|\[\]\);/.test(aq));
        chk('pose vue par vue réservée aux lignes CSV à deux sens', /if\(e\.source==='csv' && e\.csvCenter && dir===DIR\.TWO\)/.test(aq));
        chk('dans une vue, seuls les segments chargés et pas encore posés partent', /if\(vues\) activeSegs=activeSegs\.filter\(sid=>getSegById\(sid\)\);/.test(aq) && /filter\(sid=>!faits\[closureIdx\]\.has\(Number\(sid\)\)\)/.test(aq));
        chk('après un Stop, les vues non visitées ne sont pas comptées « non chargées »', /if\(!_applyAborted\) e\.closures\.forEach/.test(aq));
        chk('hors pose vue par vue, le décompte suit chaque pose comme avant', /if\(vues\) bilans\[closureIdx\]=_cumulPose\(bilans\[closureIdx\],b\);\s*else compter\(closureIdx,b\);/.test(aq));
    }

    console.log(`\n${ok} ok, ${ko} échec(s)`);
    process.exit(ko ? 1 : 0);
})();
