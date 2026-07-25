// La bibliotheque est COPIEE dans WCT en attendant son depot. Deux copies qui
// divergent en silence, c'est le pire des deux mondes : ce controle compare le
// code reellement embarque a la source, et rejoue les tests SUR LA COPIE.
const fs = require('fs');
const WCT = require('path').join(__dirname,'..','WME_ClosuresToolkit.user.js');
const LIB = require('path').join(__dirname,'..','..','WME-Prefs','WMEPrefs.js');

const extraire = (txt) => {
    const i = txt.indexOf('var WMEPrefs = (function');
    if (i < 0) return null;
    // fin = la fermeture de l'IIFE au niveau 0
    let prof = 0, dansChaine = null;
    for (let k = i; k < txt.length; k++) {
        const c = txt[k];
        if (dansChaine) { if (c === '\\') k++; else if (c === dansChaine) dansChaine = null; continue; }
        if (c === '`' || c === "'" || c === '"') { dansChaine = c; continue; }
        if (c === '/' && txt[k + 1] === '/') { k = txt.indexOf('\n', k); if (k < 0) break; continue; }
        if (c === '/' && txt[k + 1] === '*') { k = txt.indexOf('*/', k) + 1; continue; }
        if (c === '{' || c === '(') prof++;
        else if (c === '}' || c === ')') { prof--; if (prof === 0) { const f = txt.indexOf(';', k); return txt.slice(i, f + 1); } }
    }
    return null;
};

const dansWCT = extraire(fs.readFileSync(WCT, 'utf8'));
const source = extraire(fs.readFileSync(LIB, 'utf8'));
let ko = 0;
const chk = (n, c, d) => { if (c) console.log('  ok   ' + n); else { ko++; console.log('  ECHEC ' + n + (d ? '\n        ' + d : '')); } };

chk('bibliotheque trouvee dans WCT', !!dansWCT);
chk('bibliotheque trouvee dans la source', !!source);
if (dansWCT && source) {
    const norm = s => s.replace(/\r\n/g, '\n').trim();
    chk('la copie embarquee est IDENTIQUE a la source', norm(dansWCT) === norm(source),
        'ecart de ' + Math.abs(norm(dansWCT).length - norm(source).length) + ' caracteres');
}

// Rejouer un scenario complet sur la copie EXTRAITE DE WCT
if (dansWCT) {
    const m = new Map();
    global.GM_getValue = (k, d) => (m.has(k) ? m.get(k) : d);
    global.GM_setValue = (k, v) => m.set(k, v);
    const ls = new Map();
    global.localStorage = { getItem: k => (ls.has(k) ? ls.get(k) : null), setItem: (k, v) => ls.set(k, String(v)) };
    const WMEPrefs = new Function(dansWCT + '; return WMEPrefs;')();
    (async () => {
        // Le cas qui compte pour les utilisateurs deja installes : reprise de WCT_v1
        ls.set('WCT_v1', JSON.stringify({ presets: [{ name: 'Nuit' }], langPref: 'fr', closeNodes: 2 }));
        const p = WMEPrefs.create({ scriptId: 'wmeClosuresToolkit', schema: 1, legacyKey: 'WCT_v1' });
        const d = await p.load();
        chk('reprise des reglages existants depuis WCT_v1',
            d.langPref === 'fr' && d.presets[0].name === 'Nuit' && d.closeNodes === 2, JSON.stringify(d));
        chk('recopies dans le stockage du gestionnaire', m.size === 1);
        chk('WCT_v1 laisse intact (filet)', !!ls.get('WCT_v1'));
        chk('socle annonce le gestionnaire', p.info().resistantAuNettoyage === true);
        const part = await p.exportData({ only: ['presets'] });
        chk('export partiel : prereglages seuls', Object.keys(part).join(',') === 'presets', Object.keys(part).join(','));
        console.log('\n' + (ko === 0 ? 'COPIE CONFORME ET FONCTIONNELLE' : ko + ' PROBLEME(S)'));
        process.exit(ko === 0 ? 0 : 1);
    })();
} else { process.exit(1); }
