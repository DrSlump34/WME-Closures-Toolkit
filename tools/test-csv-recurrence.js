// Lignes CSV « add-rec » (1.22.00) : une ligne = une récurrence (jours, heures, fériés, pays).
//
// Pourquoi (30/09/2026) : la passe Inforoutes a relevé 394 chantiers datés au jour, fermés en
// semaine de 7h30 à 18h. Sans récurrence dans le CSV, il fallait une ligne par jour — 13 000
// lignes, autant d'entrées de file, et un WME figé. Le moteur de Configurer (WMECreneaux) savait
// déjà déplier jours, heures et fériés : la ligne add-rec lui passe la main.
//
// Fait tourner le VRAI code du fichier livré (CsvClosure, parseCSV, _csvDeplier, _recDeEntree)
// et la copie EMBARQUÉE du moteur. Les jours fériés sont une doublure (2026 : 1er et 11 novembre).
// Chaque garantie a son témoin : le même code, dégradé, doit échouer.
const fs = require('fs');
const path = require('path');
const { codeCopie } = require('./lib-creneaux-source.js');
const SRC = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');
const extrait = (a, b) => {
    const i = txt.indexOf(a); if (i < 0) throw new Error('introuvable : ' + a);
    const j = txt.indexOf(b, i + a.length); if (j < 0) throw new Error('fin introuvable : ' + a);
    return txt.slice(i, j);
};
const CODE = extrait('const pad=', '\n') + '\n'
    + extrait('const dateToUTCStr=', '\n') + '\n'
    + extrait('const CSVtoArray=', '\nconst ') + '\n'
    + extrait('const CSV_WARN_SEGMENTS=', '\n// ⚠️ Le message reprend') + '\n'
    + extrait('class CsvClosure', '\n}\n') + '\n}\n'
    + extrait('const _csvDeplier=', '\nconst _impUnFichier') + '\n'
    + extrait('const parseCSV=', '\n// ─── IMPORT DU CSV VIRAGES') + '\n';
const MOTEUR = codeCopie();
if (!MOTEUR) { console.error('❌ moteur WMECreneaux introuvable dans le userscript'); process.exit(2); }

let ok = 0, ko = 0;
const chk = (nom, cond, detail) => { if (cond) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + (detail !== undefined ? '\n        ' + detail : '')); } };

const monter = (code) => new Function('csvLog', 'getSegmentCountryName', 'resolveCountryIso', 'getHolidaysForRange', 'DIR', 'addClosure',
    MOTEUR + '\n' + code + '\nreturn {parseCSV, _csvDeplier, _recDeEntree, CsvClosure, WMECreneaux};')(
    () => {}, () => null, async () => null,
    async (iso) => iso === 'FR' ? ['2026-11-01', '2026-11-11', '2026-12-25'] : [], {}, () => {});

const TETE = 'header,reason,start,end,direction,ignore,segs,lonlat,zoom,mte,comment,days,hours,holidays,country';
const L = (action, debut, fin, extra) =>
    `${action},"Travaux","${debut}","${fin}","TWO WAY",No,"111;112","lon=4.8&lat=45.7",17,,"c"${extra}`;
const DEP = { maintenant: new Date(2026, 9, 1, 0, 0) };   // 01/10/2026 00:00, heure locale

(async () => {
    const W = monter(CODE);

    console.log('— Lecture —');
    const items = W.parseCSV([TETE,
        L('add-rec', '2026-11-02 07:30', '2026-11-13 18:00', ',"12345","07:30-18:00",skip,FR'),
        L('add', '2026-11-02 07:30', '2026-11-13 18:00', ',"12345","07:30-18:00",skip,FR')].join('\n'));
    chk('les deux lignes sont lues', items && items.length === 2, JSON.stringify(items && items.map(i => i.action)));
    const rec = items[0].closure, plain = items[1].closure;
    chk('add-rec porte sa récurrence', rec.isValid && rec.creneau && rec.creneau.jours === '12345' && rec.creneau.feries === 'skip' && rec.creneau.pays === 'FR',
        JSON.stringify(rec.creneau));
    chk('lundi…vendredi → days[1..5], dimanche/samedi exclus', String(rec.creneau.days) === 'false,true,true,true,true,true,false', String(rec.creneau.days));
    chk('une ligne « add » garde le sens d’Advanced Closures (pas de récurrence)', plain.isValid && plain.creneau === null);
    chk('heures invalides refusées', W.parseCSV([TETE, L('add-rec', '2026-11-02 07:30', '2026-11-13 18:00', ',"12345","7h30-18h",,')].join('\n')) === null);
    chk('jour 8 refusé', W.parseCSV([TETE, L('add-rec', '2026-11-02 07:30', '2026-11-13 18:00', ',"12348","07:30-18:00",,')].join('\n')) === null);
    // Cellule d'heures vide : refusée comme toute cellule invalide — le fichier entier, comme AC.
    chk('add-rec sans heures : fichier refusé', W.parseCSV([TETE, L('add-rec', '2026-11-02 07:30', '2026-11-13 18:00', ',"12345","",,')].join('\n')) === null);

    console.log('\n— Dépliage : lun-ven 07:30-18:00 sauf fériés, 02/11 → 13/11 —');
    const d = await W._csvDeplier(rec, DEP);
    const jours = d.list ? d.list.map(x => x.start.slice(0, 10)) : [];
    chk('9 fermetures (10 jours ouvrés moins le 11 novembre)', d.list && d.list.length === 9, JSON.stringify(jours));
    chk('le 11/11 (férié, mercredi) est sauté', !jours.includes('2026-11-11'));
    chk('ni samedi ni dimanche', !jours.includes('2026-11-07') && !jours.includes('2026-11-08'));
    chk('heures murales exactes', d.list && d.list[0].start === '2026-11-02 07:30' && d.list[0].end === '2026-11-02 18:00', JSON.stringify(d.list && d.list[0]));

    console.log('\n— Nuit 21:00-06:00, et rognage aux bornes —');
    const nuit = W.parseCSV([TETE, L('add-rec', '2026-11-02 21:00', '2026-11-05 06:00', ',"","21:00-06:00",none,')].join('\n'))[0].closure;
    const dn = await W._csvDeplier(nuit, DEP);
    chk('3 nuits (02→03, 03→04, 04→05), la 4e rognée à rien est retirée', dn.list && dn.list.length === 3, JSON.stringify(dn.list));
    chk('une nuit finit le lendemain à 06:00', dn.list && dn.list[0].end === '2026-11-03 06:00', JSON.stringify(dn.list && dn.list[0]));

    console.log('\n— Plusieurs plages, début en cours de journée —');
    const pl = W.parseCSV([TETE, L('add-rec', '2026-11-02 10:00', '2026-11-03 18:00', ',"12345","08:00-12:00;13:30-17:30",none,')].join('\n'))[0].closure;
    const dp = await W._csvDeplier(pl, DEP);
    chk('4 fermetures, triées', dp.list && dp.list.length === 4 && dp.list.map(x => x.start).join() === ['2026-11-02 10:00', '2026-11-02 13:30', '2026-11-03 08:00', '2026-11-03 13:30'].join(),
        JSON.stringify(dp.list));

    console.log('\n— Ce qui est passé ne part pas —');
    const passe = W.parseCSV([TETE, L('add-rec', '2026-09-28 07:30', '2026-10-02 18:00', ',"12345","07:30-18:00",none,')].join('\n'))[0].closure;
    const dpa = await W._csvDeplier(passe, DEP);
    chk('restent le 01/10 et le 02/10', dpa.list && dpa.list.map(x => x.start.slice(0, 10)).join() === '2026-10-01,2026-10-02', JSON.stringify(dpa.list));

    console.log('\n— Fériés sans pays connu : refus, jamais « pas de filtre » —');
    const sansPays = W.parseCSV([TETE, L('add-rec', '2026-11-02 07:30', '2026-11-13 18:00', ',"12345","07:30-18:00",skip,')].join('\n'))[0].closure;
    const dsp = await W._csvDeplier(sansPays, DEP);
    chk('erreur csvRecNoCountry', dsp.err === 'csvRecNoCountry', JSON.stringify(dsp));
    const indispo = await W._csvDeplier(rec, { ...DEP, feries: async () => null });
    chk('liste des fériés indisponible : erreur, pas de pose', indispo.err === 'csvRecHolidaysKo', JSON.stringify(indispo).slice(0, 120));

    console.log('\n— Export : une entrée récurrente redevient UNE ligne —');
    const cfgEntree = { source: 'cfg', config: { activeTab: 'wct-tab-each', timemode: 'end', durday: '0', starttime: '07:30', endtime: '18:00',
        days: [false, true, true, true, true, true, false], holidayMode: 'skip', holidayIso: 'FR', holidayRegion: '' } };
    const r1 = W._recDeEntree(cfgEntree);
    chk('Configurer « Chaque jour » → jours 12345, 07:30-18:00, skip, FR', r1 && r1.jours === '12345' && r1.heures === '07:30-18:00' && r1.feries === 'skip' && r1.pays === 'FR', JSON.stringify(r1));
    chk('« En continu » ne s’exporte pas en récurrence', W._recDeEntree({ ...cfgEntree, config: { ...cfgEntree.config, activeTab: 'wct-tab-cont' } }) === null);
    chk('« + jours fériés » ne s’exporte pas en récurrence', W._recDeEntree({ ...cfgEntree, config: { ...cfgEntree.config, holidayMode: 'add' } }) === null);
    chk('durée de plus d’un jour : pas de récurrence', W._recDeEntree({ ...cfgEntree, config: { ...cfgEntree.config, durday: '2' } }) === null);
    chk('« sauf fériés » sans pays connu : pas de récurrence (on ne perd pas le filtre)', W._recDeEntree({ ...cfgEntree, config: { ...cfgEntree.config, holidayIso: '' } }) === null);
    const aller = W._recDeEntree({ source: 'csv', config: { recCsv: { jours: '12345', heures: '08:00-12:00;13:30-17:30', feries: 'none', pays: '' } } });
    chk('une entrée venue d’un add-rec se réexporte telle qu’elle a été lue', aller && aller.heures === '08:00-12:00;13:30-17:30');

    console.log('\n— Témoins —');
    // 1. Sans CSV_REC_RE, une heure mal écrite passerait.
    const t1 = CODE.replace("else if(r[0]==='add-rec'&&i>=11", "else if(false&&r[0]==='add-rec'&&i>=11");
    if (t1 === CODE) { ko++; console.log('  ECHEC témoin 1 non appliqué'); }
    else chk('témoin : validation retirée ⇒ « 7h30-18h » est accepté (le test sait le voir)',
        monter(t1).parseCSV([TETE, L('add-rec', '2026-11-02 07:30', '2026-11-13 18:00', ',"12345","7h30-18h",,')].join('\n')) !== null);
    // 2. Sans le filtre des fériés, le 11/11 serait fermé.
    const t2 = CODE.replace("holidayMode:c.feries}", "holidayMode:'none'}");
    if (t2 === CODE) { ko++; console.log('  ECHEC témoin 2 non appliqué'); }
    else { const x = await monter(t2)._csvDeplier(monter(t2).parseCSV([TETE, L('add-rec', '2026-11-02 07:30', '2026-11-13 18:00', ',"12345","07:30-18:00",skip,FR')].join('\n'))[0].closure, DEP);
        chk('témoin : filtre des fériés retiré ⇒ le 11/11 revient', x.list && x.list.some(y => y.start.startsWith('2026-11-11'))); }
    // 3. Sans le refus « pas de pays », la ligne passerait sans filtre.
    const t3 = CODE.replace("if(!pays) return {err:'csvRecNoCountry'};", '');
    if (t3 === CODE) { ko++; console.log('  ECHEC témoin 3 non appliqué'); }
    else { const W3 = monter(t3); const x = await W3._csvDeplier(W3.parseCSV([TETE, L('add-rec', '2026-11-02 07:30', '2026-11-13 18:00', ',"12345","07:30-18:00",skip,')].join('\n'))[0].closure, DEP);
        chk('témoin : sans le refus, la ligne sort SANS filtre — le 11/11 fermé', x.list && x.list.some(y => y.start.startsWith('2026-11-11')), JSON.stringify(x).slice(0, 100)); }
    // 4. Sans le rognage, la première plage commencerait avant l'heure annoncée.
    const t4 = CODE.replace('start:new Date(Math.max(x.start,s0))', 'start:new Date(x.start)');
    if (t4 === CODE) { ko++; console.log('  ECHEC témoin 4 non appliqué'); }
    else { const W4 = monter(t4); const x = await W4._csvDeplier(W4.parseCSV([TETE, L('add-rec', '2026-11-02 10:00', '2026-11-03 18:00', ',"12345","08:00-12:00;13:30-17:30",none,')].join('\n'))[0].closure, DEP);
        chk('témoin : sans rognage, la fermeture part à 08:00 au lieu de 10:00', x.list && x.list[0].start === '2026-11-02 08:00', JSON.stringify(x.list && x.list[0])); }

    console.log(`\n${ok} ok, ${ko} échec(s)`);
    process.exit(ko ? 1 : 0);
})();
