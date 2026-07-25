// ─── Import universel : reconnaître le fichier avant de le router ────────────
// Le CONTENU prime toujours sur l'extension : un .json peut être un GeoJSON ou des
// préférences, un .kml un tracé ou une zone. L'extension ne sert que de repli quand
// le contenu ne tranche pas (cas des binaires, qu'on ne lit pas en texte).
//
// Rend { type, lignes, polygones } où type vaut :
//   'csv'     → fermetures (AC ou virages) : handleCSV sait distinguer les deux
//   'prefs'   → préférences / préréglages WMEPrefs
//   'trace'   → géométrie linéaire → onglet Tracés
//   'zone'    → polygone → sélection par zone
//   'mixte'   → lignes ET polygones : on ne devine pas, on demande
//   'inconnu' → rien de reconnaissable, on le dit franchement
const _impDetecter = (nom, texte) => {
    const ext = String(nom || '').toLowerCase().split('.').pop();
    const t = String(texte || '');
    const vide = { lignes: 0, polygones: 0 };

    // 1. Binaires : jamais lus en texte. « PK » = signature ZIP (kmz, shapefile
    //    zippé) — traceHandleFiles sait déjà démêler les deux.
    if (ext === 'kmz' || ext === 'zip' || ext === 'shp' || t.startsWith('PK'))
        return { type: 'trace', ...vide };

    // 2. Préférences : l'enveloppe est explicite, elle passe avant l'analyse JSON.
    if (t.includes('wme-userscript-prefs/')) return { type: 'prefs', ...vide };

    // 3. WKT collé ou déposé
    if (/^\s*(srid\s*=\s*\d+\s*;)?\s*(multi)?polygon\s*z?\s*m?\s*\(/i.test(t))
        return { type: 'zone', lignes: 0, polygones: 1 };

    // 4. GPX : toujours des tracés
    if (ext === 'gpx' || /<gpx[\s>]/i.test(t)) return { type: 'trace', ...vide };

    // 5. GeoJSON — compter les géométries, la nature du fichier en dépend
    if (/^\s*[{[]/.test(t)) {
        let j = null;
        try { j = JSON.parse(t); } catch (e) { return { type: 'inconnu', ...vide }; }
        const c = { lignes: 0, polygones: 0 };
        const compter = g => {
            if (!g || typeof g !== 'object') return;
            const ty = g.type;
            if (ty === 'FeatureCollection' && Array.isArray(g.features)) g.features.forEach(compter);
            else if (ty === 'Feature') compter(g.geometry);
            else if (ty === 'GeometryCollection' && Array.isArray(g.geometries)) g.geometries.forEach(compter);
            else if (ty === 'LineString' || ty === 'MultiLineString') c.lignes++;
            else if (ty === 'Polygon' || ty === 'MultiPolygon') c.polygones++;
        };
        compter(j);
        if (c.lignes && c.polygones) return { type: 'mixte', ...c };
        if (c.polygones) return { type: 'zone', ...c };
        if (c.lignes) return { type: 'trace', ...c };
        return { type: 'inconnu', ...c };   // JSON valide mais sans géométrie exploitable
    }

    // 6. KML — même raisonnement, sur les balises
    if (/<kml[\s>]/i.test(t) || ext === 'kml') {
        const c = { lignes: (t.match(/<LineString[\s>]/gi) || []).length,
                    polygones: (t.match(/<Polygon[\s>]/gi) || []).length };
        if (c.lignes && c.polygones) return { type: 'mixte', ...c };
        if (c.polygones) return { type: 'zone', ...c };
        if (c.lignes) return { type: 'trace', ...c };
        return { type: 'inconnu', ...c };
    }

    // 7. CSV : une ligne d'action reconnue suffit. handleCSV distingue ensuite
    //    `add-turn` (virages, format WCT) de `add`/`remove` (segments, format AC).
    if (/(^|\n)\s*"?(add-turn|add|remove)"?\s*,/i.test(t)) return { type: 'csv', ...vide };
    // Repli par extension — volontairement STRICT : « Bonjour, ceci est une note. »
    // dans un .txt contient une virgule sans être pour autant un tableau. On exige
    // la signature d'un vrai tableau : plusieurs lignes de même largeur, ≥ 3 colonnes.
    if (ext === 'csv' || ext === 'txt') {
        const l = t.split(/\r?\n/).filter(x => x.trim()).slice(0, 5).map(x => x.split(',').length);
        if (l.length >= 2 && l[0] >= 3 && l.every(n => n === l[0])) return { type: 'csv', ...vide };
    }

    return { type: 'inconnu', ...vide };
};

if (typeof module !== 'undefined') module.exports = { _impDetecter };
