// Le verdict d'enregistrement d'addClosure : save() est appelé dès que le SDK a ACCEPTÉ des
// fermetures, même si le modèle interne de WME est devenu illisible.
//
// Audit du 25/09/2026 : « rien à écrire » se jugeait sur le diff de W.model.roadClosures.objects,
// qui n'est pas un contrat. Le jour où ce chemin change, le diff vaut vide, et CHAQUE lot sortait
// « posé » sans que save() soit jamais appelé. La vérification croisée d'après save() était, elle,
// une branche morte (le diff vide avait déjà fait sortir la fonction).
//
// addClosure et le tri sont extraits du fichier réel ; SDK, W et le DOM sont des doublures.
const fs = require('fs');
const SRC = require('path').join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');
const extrait = (a, b) => {
    const i = txt.indexOf(a); if (i < 0) throw new Error('introuvable : ' + a);
    const j = txt.indexOf(b, i + a.length); if (j < 0) throw new Error('fin introuvable : ' + a);
    return txt.slice(i, j + b.length);
};
const code = [
    extrait('const _versMurale=', '\n};'),
    extrait('const _trousLibres=', '\n};'),
    extrait('const _trierAFermer=', '\n};'),
    extrait('const addClosure=', '\n};'),
].join('\n');
let ok = 0, ko = 0;
const chk = (nom, cond, detail) => { if (cond) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + (detail !== undefined ? '\n        ' + detail : '')); } };

const jouer = ({ modele }) => {
    const etat = { saves: 0, poses: 0 };
    const objets = {};
    const W = modele ? { model: { roadClosures: { objects: objets } } } : { model: {} };
    const sdk = {
        DataModel: { RoadClosures: { addClosure: () => { etat.poses++; if (modele) objets['tmp' + etat.poses] = {}; } } },
        Editing: { save: () => { etat.saves++; return Promise.resolve('sauve'); }, undoAll: () => {} },
    };
    const env = {
        sdk, W, document: { querySelector: () => null }, log: () => {}, t: k => k,
        DIR: { AtoB: 1, BtoA: 2, TWO: 3 }, NODE_CL: { none: 1, inside: 2, all: 3 }, closeNodes: 1,
        getSegById: id => ({ id, isTwoWay: true, isAtoB: true, isBtoA: true, fromNodeId: 1, toNodeId: 2 }),
        getExistingClosures: () => [], _noeudsInterieurs: () => new Set(), _inversesListe: () => new Set(),
        _applyProviderTo: () => 0,
    };
    const noms = Object.keys(env);
    const addClosure = new Function(...noms, code + '\nreturn addClosure;')(...noms.map(n => env[n]));
    return new Promise(res => addClosure({
        segments: [11, 12], reason: 'Travaux', direction: 3,
        startDate: '2026-10-01 08:00', endDate: '2026-10-01 18:00', permanent: false, eventId: null,
    }, (v, b) => res({ issue: 'ok', b, ...etat }), (e, b) => res({ issue: 'ko', e, b, ...etat })));
};

(async () => {
    console.log('\n— Modèle lisible (le cas d\'aujourd\'hui) —');
    const a = await jouer({ modele: true });
    chk('save() appelé une fois', a.saves === 1, 'saves=' + a.saves);
    chk('succès', a.issue === 'ok', a.issue);
    chk('4 fermetures demandées au SDK (2 segments × 2 sens)', a.poses === 4, a.poses);
    chk('la vérification croisée a compté 4 objets', a.b.objets === 4, a.b.objets);

    console.log('\n— Modèle interne illisible (le jour où WME le change) —');
    const b = await jouer({ modele: false });
    chk('save() est QUAND MÊME appelé', b.saves === 1, 'saves=' + b.saves);
    chk('succès, sur la foi du SDK et du DOM', b.issue === 'ok', b.issue);
    chk('la vérification croisée se déclare NON FAITE (objets = null)', b.b.objets === null, b.b.objets);

    console.log('\n— Témoin : l\'ancien critère (diff du modèle) n\'aurait jamais enregistré —');
    const ancien = txt.includes('if(!segsPoses.size){');
    chk('le critère est bien segsPoses dans le fichier', ancien);
    const code2 = code.replace('if(!segsPoses.size){', 'if(!(_nouvelles||[]).length){');
    chk('TÉMOIN : le remplacement a mordu', code2 !== code);
    // Rejoue avec l'ancien critère.
    const env2 = code2;
    const W = { model: {} }, etat = { saves: 0 };
    const sdk = { DataModel: { RoadClosures: { addClosure: () => {} } }, Editing: { save: () => { etat.saves++; return Promise.resolve(); }, undoAll: () => {} } };
    const f = new Function('sdk', 'W', 'document', 'log', 't', 'DIR', 'NODE_CL', 'closeNodes', 'getSegById', 'getExistingClosures', '_noeudsInterieurs', '_inversesListe', '_applyProviderTo',
        env2 + '\nreturn addClosure;')(sdk, W, { querySelector: () => null }, () => {}, k => k, { AtoB: 1, BtoA: 2, TWO: 3 }, { none: 1, inside: 2, all: 3 }, 1,
        id => ({ id, isTwoWay: true, isAtoB: true, isBtoA: true }), () => [], () => new Set(), () => new Set(), () => 0);
    const r = await new Promise(res => f({ segments: [11], reason: 'x', direction: 3, startDate: '2026-10-01 08:00', endDate: '2026-10-01 18:00' },
        (v, b) => res('ok'), () => res('ko')));
    chk('TÉMOIN : ancien critère + modèle illisible → « posé » sans aucun save()', r === 'ok' && etat.saves === 0, r + ', saves=' + etat.saves);

    console.log('\n' + ok + ' ok, ' + ko + ' échec(s)');
    process.exit(ko ? 1 : 0);
})();
