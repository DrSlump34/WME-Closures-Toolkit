// Import d'un CSV de fermetures : quel bouton est PLEIN, et que dit l'aide.
//
// 29/09/2026 : six ponts submersibles du Gard et une route, fermés à 16 h, 19 h et 22 h. Le CSV
// portait ces trois horaires ; l'éditeur a cliqué le bouton plein « Sélectionner les segments »,
// qui ne garde QUE les segments — les dates, le motif et le sens des lignes ont disparu sans un
// mot. Quand les lignes ne portent pas toutes le même réglage, « Ajouter à la file » devient le
// bouton plein, et l'aide dit ce que Sélectionner perdrait.
//
// Fait tourner le VRAI _impCsvChoix du fichier livré (lecture de fichier et panneau remplacés par
// des doublures). Témoin : le même code, forcé à garder Sélectionner en plein, doit échouer.
const fs = require('fs');
const SRC = require('path').join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');
const extrait = (a, b) => {
    const i = txt.indexOf(a); if (i < 0) throw new Error('introuvable : ' + a);
    const j = txt.indexOf(b, i + a.length); if (j < 0) throw new Error('fin introuvable : ' + a);
    return txt.slice(i, j);
};
const code = extrait('const CSVtoArray=', '\nconst ') + '\n'
           + extrait('const CSV_WARN_SEGMENTS=', '\nclass CsvClosure') + '\n'
           + extrait('class CsvClosure', '\n}\n') + '\n}\n'
           + extrait('const _csvReglages', '\nconst _impUnFichier') + '\n'
           + extrait('const parseCSV=', '\n// ─── IMPORT DU CSV VIRAGES');

let ok = 0, ko = 0;
const chk = (nom, cond, detail) => { if (cond) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + (detail !== undefined ? '\n        ' + detail : '')); } };

const TETE = 'header,reason,start date (yyyy-mm-dd hh:mm),end date (yyyy-mm-dd hh:mm),direction (A to B|B to A|TWO WAY),ignore trafic (Yes|No),segment IDs (id1;id2;...),lon/lat (lon=xx.xxxxxx&lat=yy.yyyyyy),zoom (14 to 22),MTE id,comment';
// Le cas réel du 29/09 (réduit à 3 lignes : les trois horaires).
const GARD = [TETE,
    'add,Pont submersible fermé - crue,2026-09-29 18:30,2026-10-01 12:00,TWO WAY,Yes,442505655,lon=3.71147&lat=43.99857,17,,',
    'add,Pont submersible fermé - crue,2026-09-29 19:00,2026-10-01 12:00,TWO WAY,Yes,293023531,lon=3.96233&lat=44.07498,17,,',
    'add,Route fermée - intempéries,2026-09-29 22:00,2026-10-01 12:00,TWO WAY,Yes,451771714;451771717,lon=3.6806&lat=43.9391,15,,'].join('\n');
// Un seul réglage sur toutes les lignes : Sélectionner reste le geste principal (choix du MTE).
const UNIFORME = [TETE,
    'add,Travaux,2026-10-01 08:00,2026-10-01 18:00,TWO WAY,No,111;112,lon=4.800000&lat=43.900000,17,,',
    'add,Travaux,2026-10-01 08:00,2026-10-01 18:00,TWO WAY,No,113,lon=4.810000&lat=43.910000,17,,'].join('\n');
// Même dates, MTE différent : c'est aussi un réglage différent.
const MTE = [TETE,
    'add,Travaux,2026-10-01 08:00,2026-10-01 18:00,TWO WAY,No,111,lon=4.800000&lat=43.900000,17,5001,',
    'add,Travaux,2026-10-01 08:00,2026-10-01 18:00,TWO WAY,No,113,lon=4.810000&lat=43.910000,17,,'].join('\n');

const lancer = async (source, csv) => {
    let html = null;
    const env = {
        _impLireTout: async () => csv,
        _sweepRunning: false,
        handleCSV: () => {}, _impVersOnglet: () => {}, _zonePanelHide: () => {}, _polyProcessRings: () => {},
        $id: () => null,
        escHtml: s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'),
        t: (k, ...a) => k + (a.length ? '(' + a.join(',') + ')' : ''),
        _zonePanelShow: h => { html = h; return { querySelector: () => null }; },
    };
    const f = new Function(...Object.keys(env), source + '\nreturn _impCsvChoix;')(...Object.values(env));
    await f({ name: 'x.csv' });
    const plein = id => new RegExp('class="[^"]*wct-btn-primary[^"]*" id="' + id + '"').test(html);
    return { html, sel: plein('wct-csv-sel'), file: plein('wct-csv-file') };
};

(async () => {
    console.log('— code livré —');
    let r = await lancer(code, GARD);
    chk('Gard (3 réglages) : « Ajouter à la file » est plein', r.file && !r.sel, r.html);
    chk('Gard : l\'aide annonce 3 réglages différents', /csvChoixAideDiff\(3\)/.test(r.html), r.html);
    chk('Gard : un seul bouton plein', (r.html.match(/wct-btn-primary/g) || []).length === 1);
    r = await lancer(code, UNIFORME);
    chk('Uniforme : « Sélectionner » reste plein', r.sel && !r.file, r.html);
    chk('Uniforme : aide habituelle (sans décompte)', /csvChoixAide</.test(r.html) && !/AideDiff/.test(r.html), r.html);
    r = await lancer(code, MTE);
    chk('MTE différent d\'une ligne à l\'autre : « Ajouter à la file » est plein', r.file && !r.sel, r.html);

    console.log('— témoin : Sélectionner forcé en plein —');
    const mutant = code.replace('const fileDabord = nReglages > 1;', 'const fileDabord = false;');
    if (mutant === code) { ko++; console.log('  ECHEC mutation non appliquée (le code a changé ?)'); }
    else {
        r = await lancer(mutant, GARD);
        chk('le témoin DOIT laisser Sélectionner plein sur le Gard (sinon le test ne voit rien)', r.sel && !r.file);
    }
    console.log(`\n${ok} ok, ${ko} échec(s)`);
    process.exit(ko ? 1 : 0);
})();
