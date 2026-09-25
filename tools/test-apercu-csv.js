// L'aperçu d'une entrée CSV affiche l'heure que la pose écrira : l'heure MURALE du fichier.
//
// Audit du 25/09/2026 : l'aperçu lisait « 2026-07-10 08:00 » en UTC (il y collait un « Z ») quand
// la pose le lit en local. À Paris l'été, 08:00 posé s'affichait 10:00 ; à New York, 04:00.
// Vérifié sous deux fuseaux, dans des processus séparés (le fuseau se fixe au lancement).
const { execFileSync } = require('child_process');
if (!process.env.WCT_TZ_ENFANT) {
    let ko = 0;
    for (const tz of ['Europe/Paris', 'America/New_York']) {
        try { process.stdout.write(execFileSync(process.execPath, [__filename], { env: { ...process.env, TZ: tz, WCT_TZ_ENFANT: '1' }, encoding: 'utf8' })); }
        catch (e) { process.stdout.write(e.stdout || ''); ko++; }
    }
    console.log(ko ? '\n❌ ' + ko + ' fuseau(x) en échec' : '\n✅ TOUT PASSE');
    process.exit(ko ? 1 : 0);
}
const fs = require('fs');
const SRC = require('path').join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');
const i = txt.indexOf('const _dateLocale='), j = txt.indexOf('\n};', i);
const _dateLocale = new Function(txt.slice(i, j + 3) + ';return _dateLocale;')();
const iv = txt.indexOf('const _versMurale='), jv = txt.indexOf('\n};', iv);
const _versMurale = new Function(txt.slice(iv, jv + 3) + ';return _versMurale;')();
let ok = 0, ko = 0;
const chk = (nom, cond, detail) => { if (cond) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + (detail !== undefined ? '\n        ' + detail : '')); } };
const hm = d => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');

console.log('\n— ' + process.env.TZ + ' —');
const d = _dateLocale('2026-07-10 08:00');
chk('l\'aperçu lit 08:00', hm(d) === '08:00', hm(d));
chk('même instant que la pose (heure murale identique)', _versMurale(d) === _versMurale('2026-07-10 08:00'));
chk('une Date passe telle quelle', _dateLocale(d) === d);
chk('hiver aussi : 2026-12-01 21:30', hm(_dateLocale('2026-12-01 21:30')) === '21:30');
const ancien = new Date('2026-07-10 08:00'.replace(' ', 'T') + 'Z');
chk('TÉMOIN : l\'ancienne lecture en UTC affichait une autre heure', hm(ancien) !== '08:00', hm(ancien));
chk('plus aucune lecture « +\'Z\' » dans le fichier', !/\+'Z'\)/.test(txt));
console.log(ok + ' ok, ' + ko + ' échec(s)');
process.exit(ko ? 1 : 0);
