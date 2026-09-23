// Tri des segments AVANT d'ecrire (_trierAFermer) et pose par moities (_poserParMoitie)
// — EXTRAITS DU FICHIER REEL (methode poly-core.js : jamais une copie).
//
// POURQUOI CE TEST EXISTE (2026-09-23, v1.18.01) — visite du pape a Paris.
// Une zone de 967 segments decoupee en 4 lots : « 0 fermeture posee, 4 lots en echec »,
// et pourtant toutes les pastilles au vert. Trois defauts empiles :
//   1. RoadClosures.getAll() du SDK LEVE des qu'une fermeture chargee porte
//      `attributions: null` ; le catch rendait [] : plus aucun chevauchement detecte.
//   2. L'enregistrement est groupe et Waze le refuse EN BLOC : UN segment deja ferme
//      pour travaux faisait tomber les 404 autres de son lot.
//   3. 9 chemins pietons sans aucun sens ouvert etaient comptes « non poses » : le bilan
//      annoncait un echec la ou tout ce qui pouvait l'etre avait ete ferme.
// Ce test verrouille le tri (2 et 3) et la pose par moities (2, ce que le tri ignore).
const fs = require('fs');
const path = require('path');

const SRC = process.argv[2] || path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');

const extraire = (debut, fin) => {
    const i = txt.indexOf(debut);
    if (i < 0) { console.error('❌ introuvable : ' + debut); process.exit(2); }
    const j = txt.indexOf(fin, i);
    if (j < 0) { console.error('❌ fin introuvable apres : ' + debut); process.exit(2); }
    return txt.slice(i, j + fin.length);
};
const code = [
    extraire('const DIR     =', ';'),
    extraire('const _versMurale=x=>{', '\n};'),
    extraire('const TROU_MIN_MS', ';'),
    extraire('const _trousLibres=(', '\n};'),
    extraire('const _trierAFermer=(', '\n};'),
    extraire('const _POSE_BUDGET_PAR_FAUTIF', ';'),
    extraire('const _poserParMoitie=async(', '\n};'),
].join('\n');

let ok = 0, ko = 0;
const chk = (nom, cond, detail) => {
    if (cond) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + (detail ? '\n         ' + detail : '')); }
};

// Environnement minimal : addClosure est simule, _applyAborted pilotable.
const env = { addClosure: null, _applyAborted: false };
const mod = new Function('env', `
    let _applyAborted=false;
    const addClosure=(...a)=>env.addClosure(...a);
    ${code}
    return { DIR, _versMurale, _trierAFermer, _poserParMoitie, _trousLibres,
             setAbort:v=>{_applyAborted=v;} };`)(env);
const { DIR, _versMurale, _trierAFermer, _poserParMoitie, _trousLibres } = mod;

// ── Donnees : segments types ──
const S = {
    1: { isTwoWay: true,  isAtoB: false, isBtoA: false },   // double sens
    2: { isTwoWay: false, isAtoB: true,  isBtoA: false },   // sens unique A→B
    3: { isTwoWay: false, isAtoB: false, isBtoA: false },   // chemin pieton verrouille
    4: { isTwoWay: true,  isAtoB: false, isBtoA: false },   // double sens, A→B deja ferme
    5: { isTwoWay: true,  isAtoB: false, isBtoA: false },   // double sens, 2 sens deja fermes
    6: { isTwoWay: false, isAtoB: true,  isBtoA: false },   // sens unique, deja ferme (Bernanos)
    7: { isTwoWay: true,  isAtoB: false, isBtoA: false },   // double sens, fermetures BOUT A BOUT
    8: { isTwoWay: true,  isAtoB: false, isBtoA: false },   // double sens, une minute d'ecart
};
const seg = id => S[id] || null;
const debut = _versMurale('2026-09-25 06:00'), fin = _versMurale('2026-09-25 20:00');
const fx = (segmentId, isForward, s, e) => ({ segmentId, isForward, startDate: s, endDate: e });
const existantes = [
    fx(4, true,  '2026-09-21 10:30', '2026-11-13 16:59'),   // Vaugirard : travaux A→B
    fx(5, true,  '2026-09-25 06:00', '2026-09-25 20:00'),
    fx(5, false, '2026-09-25 06:00', '2026-09-25 20:00'),
    fx(6, true,  '2026-06-07 13:57', '2027-03-12 16:59'),   // Bernanos
    fx(7, true,  '2026-09-25 20:00', '2026-09-25 22:00'),   // BOUT A BOUT apres : Waze REFUSE
    fx(7, false, '2026-09-24 06:00', '2026-09-25 06:00'),   // BOUT A BOUT avant : Waze REFUSE
    fx(8, true,  '2026-09-25 20:01', '2026-09-25 22:00'),   // une minute d'ecart : accepte
];

console.log('\n— Le tri, cas par cas (double sens demande) —');
const r = _trierAFermer({ ids: [1, 2, 3, 4, 5, 6, 7, 8, 99], dir: DIR.TWO, seg, inverses: new Set(),
                          existantes, debut, fin });
const plan = Object.fromEntries(r.plan.map(p => [p.sid, p]));
chk('double sens libre : les deux sens', plan[1] && plan[1].fwd && plan[1].rev);
chk('BOUT A BOUT (fin = debut) : conflit, comme chez Waze (23/09/2026)', r.dejaFermes.includes(7) && !plan[7]);
chk('une minute d ecart : pas de conflit', plan[8] && plan[8].fwd && plan[8].rev);
chk('sens unique A→B : A→B seulement', plan[2] && plan[2].fwd && !plan[2].rev);
chk('chemin pieton sans sens ouvert : ecarte « sansSens »', r.sansSens.includes(3) && !plan[3]);
chk('un sens deja ferme : l autre SEULEMENT (Vaugirard)', plan[4] && !plan[4].fwd && plan[4].rev);
chk('... et il est compte partiel, pas ecarte', r.partiels.includes(4) && !r.dejaFermes.includes(4) && r.sensBloques === 1);
chk('deux sens deja fermes : ecarte « dejaFermes »', r.dejaFermes.includes(5) && !plan[5]);
chk('sens unique deja ferme : ecarte « dejaFermes » (Bernanos)', r.dejaFermes.includes(6));
chk('segment non charge : « absent »', r.absents.includes(99));
chk('chaque segment range dans UNE seule case',
    r.plan.length + r.absents.length + r.sansSens.length + r.dejaFermes.length === 9);

console.log('\n— Le sens se juge PAR SENS, et le sens inverse d un segment retourne —');
const rA = _trierAFermer({ ids: [4], dir: DIR.BtoA, seg, inverses: new Set(), existantes, debut, fin });
chk('B→A demande sur Vaugirard (A→B ferme) : pose, rien d ecarte', rA.plan.length === 1 && rA.plan[0].rev && !rA.plan[0].fwd && rA.sensBloques === 0);
const rI = _trierAFermer({ ids: [2], dir: DIR.BtoA, seg, inverses: new Set([2]), existantes: [], debut, fin });
chk('segment inverse : B→A demande devient A→B', rI.plan.length === 1 && rI.plan[0].fwd);

console.log('\n— « Non verifiable » n ecarte rien —');
const rN = _trierAFermer({ ids: [5, 6], dir: DIR.TWO, seg, inverses: new Set(), existantes: null, debut, fin });
chk('existantes = null : aucun ecart pour chevauchement', rN.dejaFermes.length === 0 && rN.plan.length === 2);

console.log('\n— Temoin : sans le controle de sens, Vaugirard serait ecarte en entier —');
const naif = existantes.map(c => ({ ...c, isForward: true }));
const rT = _trierAFermer({ ids: [4, 5], dir: DIR.TWO, seg, inverses: new Set(), existantes: naif, debut, fin });
chk('le banc distingue bien un sens d un autre (5 change de case)', !rT.dejaFermes.includes(5) && r.dejaFermes.includes(5));

console.log('\n— L heure murale —');
chk('chaine et Date locale donnent la meme heure murale',
    _versMurale('2026-09-25 06:00') === _versMurale(new Date(2026, 8, 25, 6, 0)));
chk('heure murale = « 06:00 » lu en UTC', _versMurale('2026-09-25 06:00') === Date.UTC(2026, 8, 25, 6, 0));

// ── Combler les trous (v1.20.00) ──
console.log('\n— Combler les trous : _trousLibres —');
const H = h => _versMurale('2026-09-25 ' + h), J = (d, h) => _versMurale(d + ' ' + h);
const fmt = l => l.map(([a, b]) => new Date(a).toISOString().slice(11, 16) + '-' + new Date(b).toISOString().slice(11, 16)).join(',');
const D0 = H('06:00'), D1 = H('20:00');
const cas = [
    ['aucune fermeture : tout le creneau', [], '06:00-20:00'],
    ['au milieu : avant et apres', [[H('10:00'), H('12:00')]], '06:00-09:59,12:01-20:00'],
    ['deja ferme au debut : apres seulement', [[H('06:00'), H('12:00')]], '12:01-20:00'],
    ['deja ferme a la fin : avant seulement', [[H('15:00'), H('20:00')]], '06:00-14:59'],
    ['deux fermetures : trois trous', [[H('08:00'), H('09:00')], [H('12:00'), H('13:00')]], '06:00-07:59,09:01-11:59,13:01-20:00'],
    ['BOUT A BOUT avant (finit a 06:00) : reprise a 06:01', [[H('04:00'), H('06:00')]], '06:01-20:00'],
    ['BOUT A BOUT apres (commence a 20:00) : fin a 19:59', [[H('20:00'), H('22:00')]], '06:00-19:59'],
    ['entierement couvert : rien', [[H('05:00'), H('21:00')]], ''],
    ['trou de 2 min : ignore', [[H('06:00'), H('09:57')], [H('10:00'), H('20:00')]], ''],
    ['trou de 5 min pile : garde', [[H('06:00'), H('09:53')], [H('10:00'), H('20:00')]], '09:54-09:59'],
    ['fermeture hors creneau : sans effet', [[H('21:00'), H('22:00')]], '06:00-20:00'],
];
for (const [nom, occ, att] of cas) {
    const r = fmt(_trousLibres(D0, D1, occ));
    chk(nom + ' -> ' + (r || '(rien)'), r === att, 'attendu ' + (att || '(rien)'));
}
// Peyrouse (23/09/2026) : pose 26 14:00 -> 27 07:30, demande 26 14:00 -> 28 07:30.
const pey = _trousLibres(J('2026-09-26', '14:00'), J('2026-09-28', '07:30'), [[J('2026-09-26', '14:00'), J('2026-09-27', '07:30')]]);
chk('Peyrouse : seul le 27 07:31 -> 28 07:30 est pose', pey.length === 1 && pey[0][0] === J('2026-09-27', '07:31') && pey[0][1] === J('2026-09-28', '07:30'));

console.log('\n— Combler les trous : _trierAFermer —');
S[9] = { isTwoWay: true, isAtoB: false, isBtoA: false };
const ex9 = existantes.concat([fx(9, true, '2026-09-25 10:00', '2026-09-25 12:00')]);
const rc = _trierAFermer({ ids: [4, 5, 9], dir: DIR.TWO, seg, inverses: new Set(), existantes: ex9, debut, fin, combler: true });
const pc = Object.fromEntries(rc.plan.map(p => [p.sid, p]));
chk('combler : A>B ferme 10-12, deux trous en A>B, B>A entier', pc[9] && pc[9].fwd && pc[9].rev && pc[9].fenetresF && pc[9].fenetresF.length === 2 && !pc[9].fenetresR);
chk('... compte : 1 segment complete, 2 trous', rc.combles.includes(9) && rc.trous === 2);
chk('combler : entierement couvert dans les deux sens -> toujours ecarte', rc.dejaFermes.includes(5));
chk('combler : Vaugirard (A>B couvert tout le creneau) -> B>A seul, A>B partiel', pc[4] && !pc[4].fwd && pc[4].rev && rc.partiels.includes(4));
const rs = _trierAFermer({ ids: [9], dir: DIR.TWO, seg, inverses: new Set(), existantes: ex9, debut, fin, combler: false });
chk('SANS combler : A>B ecarte, B>A pose (comportement 1.19.01)', rs.plan.length === 1 && !rs.plan[0].fwd && rs.plan[0].rev && !rs.plan[0].fenetresF);

// ── Pose par moities ──
const mkAdd = (fautifs, log) => (opts, okCb, koCb) => {
    log.push(opts.segments.length);
    const bad = opts.segments.some(s => fautifs.has(s));
    const b = { demandes: opts.segments.length, poses: bad ? 0 : opts.segments.length,
                absents: 0, sansSens: 0, dejaFermes: 0, sensBloques: 0 };
    if (bad) { b.refusServeur = true; koCb(['refus simule'], b); } else okCb(null, b);
};
const run = async () => {
    console.log('\n— Pose par moities —');
    const ids = Array.from({ length: 405 }, (_, k) => k + 1);
    let log = [];
    env.addClosure = mkAdd(new Set([200]), log);
    let b = await _poserParMoitie({ segments: ids });
    chk('1 fautif sur 405 : 404 poses', b.poses === 404, 'poses=' + b.poses);
    chk('... le refus designe LE segment', b.refus.length === 1 && b.refus[0].segs.length === 1 && b.refus[0].segs[0] === 200);
    chk('... en peu d enregistrements (' + log.length + ')', log.length <= 1 + 2 * 9);

    log = []; env.addClosure = mkAdd(new Set([7, 300]), log);
    b = await _poserParMoitie({ segments: ids });
    chk('2 fautifs eloignes : 403 poses', b.poses === 403, 'poses=' + b.poses);

    log = []; env.addClosure = mkAdd(new Set(ids), log);
    b = await _poserParMoitie({ segments: ids });
    const refuses = b.refus.reduce((s, x) => s + x.n, 0);
    chk('tout refuse : aucun pose, les 405 comptes refuses', b.poses === 0 && refuses === 405, 'refuses=' + refuses);
    chk('... et le budget BORNE les enregistrements (' + log.length + ' ≤ 55)', log.length <= 55);

    log = [];
    env.addClosure = (opts, okCb, koCb) => { log.push(1); koCb(['rien ecrit'], { demandes: opts.segments.length, poses: 0, absents: opts.segments.length }); };
    b = await _poserParMoitie({ segments: ids });
    chk('echec qui n est PAS un refus de Waze : jamais recoupe', log.length === 1);
    chk('... et des absents ne sont pas comptes refuses', b.refus.length === 0 && b.absents === 405);

    log = []; env.addClosure = mkAdd(new Set([1]), log);
    mod.setAbort(true);
    b = await _poserParMoitie({ segments: ids });
    mod.setAbort(false);
    chk('Stop clique : on ne recoupe plus', log.length === 1);

    console.log('\n' + (ko ? `❌ ${ko} ECHEC(S), ${ok} ok` : `✅ TOUT PASSE : ${ok} ok, 0 ko`));
    process.exit(ko ? 1 : 0);
};
run();
