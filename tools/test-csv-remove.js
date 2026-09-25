// Une ligne « remove » d'un CSV (format Advanced Closures) ne doit JAMAIS entrer dans la file.
//
// Audit du 25/09/2026 : handleCSV mettait en file TOUTES les lignes lues par parseCSV, « add » comme
// « remove », sans lire l'action. Une ligne qui demandait de LEVER une fermeture était donc POSÉE,
// et l'entrée comblant ses trous par défaut, le créneau se retrouvait fermé. WCT ne supprime pas de
// fermeture : la ligne est écartée et comptée dans le journal.
//
// Fait tourner le VRAI handleCSV du fichier livré (FileReader et DOM remplacés par des doublures).
// Témoin : le même code avec le filtre retiré doit mettre la ligne remove en file.
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
           + extrait('class CsvClosure', '\nconst _impCsvChoix') + '\n'
           + extrait('const parseCSV=', '\n// ─── IMPORT DU CSV VIRAGES') + '\n'
           + extrait('const handleCSV=', '\n// ═══');

let ok = 0, ko = 0;
const chk = (nom, cond, detail) => { if (cond) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + (detail !== undefined ? '\n        ' + detail : '')); } };

const CSV = [
    'header,reason,start date (yyyy-mm-dd hh:mm),end date (yyyy-mm-dd hh:mm),direction (A to B|B to A|TWO WAY),ignore trafic (Yes|No),segment IDs (id1;id2;...),lon/lat (lon=xx.xxxxxx&lat=yy.yyyyyy),zoom (14 to 22),MTE id,comment',
    'add,Travaux,2026-10-01 08:00,2026-10-01 18:00,TWO WAY,No,111;112,lon=4.800000&lat=43.900000,17,,',
    'remove,Travaux,2026-10-02 08:00,2026-10-02 18:00,TWO WAY,No,221,lon=4.800000&lat=43.900000,17,,',
    'remove,Travaux,2026-10-03 08:00,2026-10-03 18:00,A to B,No,331,lon=4.800000&lat=43.900000,17,,',
].join('\n');

const essai = (source, csv = CSV) => {
    const queue = [], log = { style: {}, innerHTML: '' };
    const env = {
        $id: id => (id === 'wct-csv-log' ? log : null),
        t: (k, ...a) => k + '(' + a.join(',') + ')',
        escHtml: s => String(s),
        queue, renderQueue: () => {}, getSegDirConflicts: () => [],
        DIR: { AtoB: 1, BtoA: 2, TWO: 3 }, dirStr: d => 'dir' + d, confirm: () => true,
        parseTurnCSV: () => ({ entries: [], errors: 0 }),
        closeNodes: 1,
        FileReader: class { readAsText(f) { this.onload({ target: { result: f } }); } },
    };
    const noms = Object.keys(env);
    const handleCSV = new Function(...noms, source + '; return handleCSV;')(...noms.map(n => env[n]));
    handleCSV([csv]);
    return { queue, log: log.innerHTML };
};

console.log('\n— Fichier mixte : 1 add, 2 remove —');
const r = essai(code);
chk('une seule entrée en file (la ligne add)', r.queue.length === 1, 'file : ' + r.queue.length);
chk('c\'est bien la ligne add (segments 111;112)', r.queue[0] && String(r.queue[0].segIds) === '111,112', JSON.stringify(r.queue[0] && r.queue[0].segIds));
chk('le journal compte les 2 lignes remove écartées', /csvRemoveSkipped\(2\)/.test(r.log), r.log);

console.log('\n— Fichier sans aucune ligne add —');
const seul = essai(code, CSV.split('\n').filter(l => !l.startsWith('add,')).join('\n'));
chk('rien en file', seul.queue.length === 0, 'file : ' + seul.queue.length);
chk('le journal compte les 2 lignes remove écartées', /csvRemoveSkipped\(2\)/.test(seul.log), seul.log);

console.log('\n— Témoin : le filtre retiré, la ligne remove doit entrer en file —');
const sansFiltre = code.replace(".filter(it=>it.action==='add')", '');
if (sansFiltre === code) { ko++; console.log('  ECHEC le témoin n\'a pas trouvé le filtre à retirer'); }
else {
    const t = essai(sansFiltre);
    chk('témoin : 3 entrées en file sans le filtre (le test sait voir le défaut)', t.queue.length === 3, 'file : ' + t.queue.length);
}

console.log('\n' + ok + ' ok, ' + ko + ' échec(s)');
process.exit(ko ? 1 : 0);
