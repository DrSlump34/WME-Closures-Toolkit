// ═══════════════════════════════════════════════════════════════════════════
//  SELECTION PAR POLYGONE — moteur geometrique (fonctions pures, testables hors WME)
// ═══════════════════════════════════════════════════════════════════════════
// Un segment est retenu si PLUS DE POLY_INSIDE_FRAC de sa LONGUEUR est dans le
// polygone (regle choisie par l'auteur : « a +50% dans le polygone, on le prend »).
// On raisonne en longueur et non en nombre de points : un segment a 2 sommets et
// un segment a 40 sommets doivent etre juges pareil.
const POLY_INSIDE_FRAC = 0.5;
const POLY_SAMPLE_M    = 5;    // pas d'echantillonnage le long d'une arete
const POLY_SAMPLE_MAX  = 200;  // borne par arete (garde-fou sur les tres longues)

// Mercator spherique -> WGS84. Le trace peut arriver en coordonnees projetees.
const _polyDeproj = (x, y) => [
    x / 20037508.34 * 180,
    Math.atan(Math.exp((y / 20037508.34 * 180) * Math.PI / 180)) * 360 / Math.PI - 90
];

// Normalise ce que rend le trace en ANNEAUX [[ [lon,lat], ... ], ...] (exterieur puis trous).
// Defensif a dessein : selon la version du SDK le retour peut etre un GeoJSON, une
// Feature, une geometrie OpenLayers, ou un simple tableau de points — et une forme
// inconnue doit se voir tout de suite, pas produire une selection vide en silence.
const _polyRings = (res) => {
    if (!res) return [];
    // GeoJSON Feature -> sa geometrie
    if (res.type === 'Feature' && res.geometry) return _polyRings(res.geometry);
    if (res.geometry && !res.type && !Array.isArray(res)) return _polyRings(res.geometry);
    // GeoJSON Polygon / MultiPolygon
    if (res.type === 'Polygon' && Array.isArray(res.coordinates)) return _polyNorm(res.coordinates);
    if (res.type === 'MultiPolygon' && Array.isArray(res.coordinates)) return _polyNorm(res.coordinates.flat());
    // Geometrie OpenLayers 2 : components -> LinearRing -> components -> Point{x,y}
    if (res.CLASS_NAME && Array.isArray(res.components)) {
        const rings = [];
        for (const c of res.components) {
            const pts = Array.isArray(c.components) ? c.components : null;
            if (!pts) continue;
            rings.push(pts.map(p => (Math.abs(p.x) > 180 ? _polyDeproj(p.x, p.y) : [p.x, p.y])));
        }
        return _polyClose(rings);
    }
    // Tableau brut : [[lon,lat],...] ou [[[lon,lat],...],...]
    if (Array.isArray(res)) {
        if (res.length && Array.isArray(res[0]) && typeof res[0][0] === 'number') return _polyNorm([res]);
        if (res.length && Array.isArray(res[0])) return _polyNorm(res);
    }
    return [];
};
// Reprojette au besoin et ferme les anneaux.
const _polyNorm = (rings) => _polyClose(rings.map(r => r.map(p => {
    const x = Array.isArray(p) ? p[0] : p.x, y = Array.isArray(p) ? p[1] : p.y;
    return Math.abs(x) > 180 ? _polyDeproj(x, y) : [x, y];
})));
const _polyClose = (rings) => rings.filter(r => r && r.length >= 3).map(r => {
    const f = r[0], l = r[r.length - 1];
    return (f[0] === l[0] && f[1] === l[1]) ? r : r.concat([[f[0], f[1]]]);
});

// Point dans polygone — lancer de rayon. La PARITE cumulee sur tous les anneaux
// gere les trous gratuitement : un point dans un trou traverse un nombre pair de bords.
const _polyPtIn = (x, y, rings) => {
    let inside = false;
    for (const ring of rings) {
        for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
            const xi = ring[i][0], yi = ring[i][1], xj = ring[j][0], yj = ring[j][1];
            if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
        }
    }
    return inside;
};

// Emprise d'un jeu d'anneaux -> {minLon,minLat,maxLon,maxLat}
const _polyBBox = (rings) => {
    let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
    for (const r of rings) for (const p of r) {
        if (p[0] < minLon) minLon = p[0]; if (p[0] > maxLon) maxLon = p[0];
        if (p[1] < minLat) minLat = p[1]; if (p[1] > maxLat) maxLat = p[1];
    }
    return { minLon, minLat, maxLon, maxLat };
};

// Fraction de la longueur d'une polyligne situee dans le polygone, dans [0,1].
// coords = [[lon,lat],...] (format geometry.coordinates de l'API comme du modele).
// Methode : chaque arete est decoupee en sous-aretes de ~POLY_SAMPLE_M metres et
// c'est le MILIEU de chacune qui decide. Preferee a un calcul d'intersection exact
// parce qu'elle ne connait aucun cas degenere (sommet pile sur un bord, arete
// colineaire au bord) — et la precision qu'elle donne depasse de loin ce qu'un
// seuil a 50 % demande.
const _polyInsideFrac = (coords, rings) => {
    if (!Array.isArray(coords) || coords.length < 2 || !rings.length) return 0;
    let total = 0, dedans = 0;
    for (let i = 0; i < coords.length - 1; i++) {
        const a = coords[i], b = coords[i + 1];
        if (!a || !b) continue;
        const lat0 = (a[1] + b[1]) / 2 * Math.PI / 180;
        const mLon = Math.cos(lat0) * 111320, mLat = 110540;
        const len = Math.hypot((b[0] - a[0]) * mLon, (b[1] - a[1]) * mLat);
        if (!(len > 0)) continue;
        total += len;
        const n = Math.max(1, Math.min(POLY_SAMPLE_MAX, Math.ceil(len / POLY_SAMPLE_M)));
        let nIn = 0;
        for (let k = 0; k < n; k++) {
            const f = (k + 0.5) / n;
            if (_polyPtIn(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, rings)) nIn++;
        }
        dedans += len * (nIn / n);
    }
    return total > 0 ? dedans / total : 0;
};

// Verdict pour un segment. Rend {retenu, frac}.
const _polyJudge = (coords, rings) => {
    const frac = _polyInsideFrac(coords, rings);
    return { retenu: frac > POLY_INSIDE_FRAC, frac };
};

if (typeof module !== 'undefined') module.exports = {
    POLY_INSIDE_FRAC, _polyDeproj, _polyRings, _polyPtIn, _polyBBox, _polyInsideFrac, _polyJudge
};
