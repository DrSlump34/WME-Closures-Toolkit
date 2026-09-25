// Les changements d'heure ne décalent aucune fermeture : une occurrence commence et finit à
// l'HEURE MURALE demandée, la veille comme le lendemain du changement.
//
// Audit du 25/09/2026, reproduit sous node : « Répéter 6 × tous les 1 jour, 08:00-09:00 » à partir
// du 22/10/2026 posait 07:00-08:00 à partir du 25/10 — les occurrences étaient additionnées en
// millisecondes. Et en « Chaque jour 21:00-05:00 », la nuit du 24 au 25/10 rouvrait à 04:00 : la fin
// valait début + durée. Au printemps, c'était une heure de trop.
//
// Ce qui DOIT rester absolu, et le reste : la répétition toutes les X heures (un intervalle) et le
// mode « durée » (2 h de fermeture réelles).
//
// Témoin : la bibliothèque d'avant le correctif (git, commit de de64252) doit échouer.
process.env.TZ = 'Europe/Paris';
const { execSync } = require('child_process');
const path = require('path');
const { charger } = require('./lib-creneaux-source.js');
const { lib: LIB, origine } = charger();

let ok = 0, ko = 0;
const chk = (nom, cond, detail) => { if (cond) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + (detail !== undefined ? '\n        ' + detail : '')); } };
const hm = d => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
const jour = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

const base = { holidayMode: 'none', days: [true, true, true, true, true, true, true], durday: 0 };
const cas = (lib) => ({
    automne: lib.generer({ ...base, activeTab: lib.MODES.REPETER, rangestart: '2026-10-22', rangeend: '2026-10-31',
        starttime: '08:00', timemode: 'end', endtime: '09:00', repntimes: '6', repevery: '1', repunit: 'day' }),
    printemps: lib.generer({ ...base, activeTab: lib.MODES.REPETER, rangestart: '2027-03-25', rangeend: '2027-03-31',
        starttime: '08:00', timemode: 'end', endtime: '09:00', repntimes: '6', repevery: '1', repunit: 'day' }),
    nuit: lib.generer({ ...base, activeTab: lib.MODES.CHAQUE_JOUR, rangestart: '2026-10-23', rangeend: '2026-10-26',
        starttime: '21:00', timemode: 'end', endtime: '05:00' }),
    nuitPrintemps: lib.generer({ ...base, activeTab: lib.MODES.CHAQUE_JOUR, rangestart: '2027-03-27', rangeend: '2027-03-28',
        starttime: '21:00', timemode: 'end', endtime: '05:00' }),
    heures: lib.generer({ ...base, activeTab: lib.MODES.REPETER, rangestart: '2026-10-25', rangeend: '2026-10-25',
        starttime: '01:00', timemode: 'duration', durtime: '00:30', repntimes: '3', repevery: '1', repunit: 'hour' }),
    duree: lib.generer({ ...base, activeTab: lib.MODES.CHAQUE_JOUR, rangestart: '2026-10-25', rangeend: '2026-10-25',
        starttime: '01:00', timemode: 'duration', durtime: '02:00' }),
});

const verifier = async (lib, prefixe) => {
    const r = cas(lib);
    const a = (await r.automne).list;
    chk(prefixe + 'automne : 6 occurrences', a.length === 6, a.length);
    chk(prefixe + 'automne : toutes à 08:00', a.every(o => hm(o.start) === '08:00'), a.map(o => jour(o.start) + ' ' + hm(o.start)).join(', '));
    chk(prefixe + 'automne : toutes finissent à 09:00', a.every(o => hm(o.end) === '09:00'), a.map(o => hm(o.end)).join(', '));
    chk(prefixe + 'automne : un jour par occurrence, sans trou', a.map(o => jour(o.start)).join() ===
        '2026-10-22,2026-10-23,2026-10-24,2026-10-25,2026-10-26,2026-10-27');
    const p = (await r.printemps).list;
    chk(prefixe + 'printemps : toutes à 08:00-09:00', p.every(o => hm(o.start) === '08:00' && hm(o.end) === '09:00'),
        p.map(o => jour(o.start) + ' ' + hm(o.start) + '-' + hm(o.end)).join(', '));
    const n = (await r.nuit).list;
    const n24 = n.find(o => jour(o.start) === '2026-10-24');
    chk(prefixe + 'nuit du 24 au 25/10 : ferme à 21:00', n24 && hm(n24.start) === '21:00');
    chk(prefixe + 'nuit du 24 au 25/10 : rouvre à 05:00 le 25', n24 && hm(n24.end) === '05:00' && jour(n24.end) === '2026-10-25',
        n24 && jour(n24.end) + ' ' + hm(n24.end));
    chk(prefixe + 'toutes les nuits d\'octobre : 21:00 → 05:00', n.every(o => hm(o.start) === '21:00' && hm(o.end) === '05:00'),
        n.map(o => hm(o.start) + '-' + hm(o.end)).join(', '));
    const np = (await r.nuitPrintemps).list;
    chk(prefixe + 'nuit du 27 au 28/03 : rouvre à 05:00', np.every(o => hm(o.end) === '05:00'), np.map(o => hm(o.end)).join(', '));
    // Ce qui reste absolu : un intervalle d'une heure reste une heure réelle.
    const h = (await r.heures).list;
    chk(prefixe + 'toutes les heures : intervalles de 60 min réelles', h.length === 3 &&
        h[1].start - h[0].start === 3600000 && h[2].start - h[1].start === 3600000, h.map(o => hm(o.start)).join(', '));
    const d = (await r.duree).list;
    chk(prefixe + 'durée 2 h la nuit du changement : 2 h réelles', d.length === 1 && d[0].end - d[0].start === 7200000,
        d[0] && (d[0].end - d[0].start) / 60000 + ' min');
};

(async () => {
    console.log('\n— Bibliothèque : ' + origine + ' (TZ=Europe/Paris) —');
    await verifier(LIB, '');

    console.log('\n— Témoin : la bibliothèque d\'avant le correctif doit échouer —');
    let ancienne = null;
    try {
        const code = execSync('git show de64252:lib/WMECreneaux.js', { cwd: path.join(__dirname, '..'), encoding: 'utf8' });
        ancienne = new Function('module', code + '; return WMECreneaux;')(undefined);
    } catch (e) { console.log('  (témoin indisponible : ' + e.message.split('\n')[0] + ')'); }
    if (ancienne) {
        const r = cas(ancienne);
        const a = (await r.automne).list, n = (await r.nuit).list;
        const n24 = n.find(o => jour(o.start) === '2026-10-24');
        const mord = !a.every(o => hm(o.start) === '08:00') && n24 && hm(n24.end) === '04:00';
        chk('TÉMOIN : l\'ancienne version décale (07:00 dès le 25/10, réouverture à 04:00)', mord,
            a.map(o => hm(o.start)).join(', ') + ' / fin ' + (n24 && hm(n24.end)));
    }
    console.log('\n' + ok + ' ok, ' + ko + ' échec(s)');
    process.exit(ko ? 1 : 0);
})();
