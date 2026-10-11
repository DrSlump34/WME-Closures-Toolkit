// Le verdict d'enregistrement d'addClosure : save() est appelé dès que le SDK a ACCEPTÉ des
// fermetures, même si le compte des fermetures créées est illisible.
//
// Audit du 25/09/2026 : « rien à écrire » se jugeait sur le diff de W.model.roadClosures.objects,
// qui n'est pas un contrat. Le jour où ce chemin change, le diff vaut vide, et CHAQUE lot sortait
// « posé » sans que save() soit jamais appelé. La vérification croisée d'après save() était, elle,
// une branche morte (le diff vide avait déjà fait sortir la fonction).
//
// 04/10/2026 (retrait de `W`) : le compte ne vient plus d'un diff de W.model mais de ce que rend
// addClosure (la fermeture créée, d'après la doc du SDK). « Illisible » = une valeur rendue sans id.
//
// addClosure et le tri sont extraits du fichier réel ; SDK et DOM sont des doublures.
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
    extrait('const _attenteEtrangere=', '\n};'),
    extrait('const addClosure=', '\n};'),
].join('\n');
let ok = 0, ko = 0;
const chk = (nom, cond, detail) => { if (cond) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + (detail !== undefined ? '\n        ' + detail : '')); } };

// `rejette` : segments dont le SDK refuse la pose comme le fait le mode ASYNC — promesse rejetée,
// pas exception. `source` : code d'addClosure à jouer (le témoin y retire l'await).
// `existantes` : ce que rend getExistingClosures (null = illisible), puis, après la relecture
// de l'API, `apresApi`. `enAttente` : modifications de l'éditeur non enregistrées (1.25.00).
const jouer = ({ rend, rejette = [], source = code, existantes = [], apresApi, enAttente = 0 }) => {
    const etat = { saves: 0, poses: 0 };
    const W = { model: {} };
    const sdk = {
        DataModel: { RoadClosures: { addClosure: (a) => {
            if (rejette.includes(a.segmentId)) return Promise.reject(new Error('Not allowed to edit closures on segment ' + a.segmentId));
            etat.poses++; return Promise.resolve(rend ? { id: 'tmp' + etat.poses } : undefined); } } },
        Editing: { save: () => { etat.saves++; return Promise.resolve('sauve'); }, undoAll: () => {},
                   getUnsavedChangesCount: () => enAttente },
    };
    let lu = existantes;
    etat.relectures = 0;
    const env = {
        sdk, W, document: { querySelector: () => null }, log: () => {}, t: k => k,
        DIR: { AtoB: 1, BtoA: 2, TWO: 3 }, NODE_CL: { none: 1, inside: 2, all: 3 }, closeNodes: 1,
        getSegById: id => ({ id, isTwoWay: true, isAtoB: true, isBtoA: true, fromNodeId: 1, toNodeId: 2 }),
        getExistingClosures: () => lu, _noeudsInterieurs: () => new Set(), _inversesListe: () => new Set(),
        _applyProviderTo: () => 0,
        _rafraichirFermeturesApi: async () => { etat.relectures++; if (apresApi !== undefined) lu = apresApi; return lu; },
        _applyAborted: false,
    };
    const noms = Object.keys(env);
    const addClosure = new Function(...noms, source + '\nreturn addClosure;')(...noms.map(n => env[n]));
    return new Promise(res => addClosure({
        segments: [11, 12], reason: 'Travaux', direction: 3,
        startDate: '2026-10-01 08:00', endDate: '2026-10-01 18:00', permanent: false, eventId: null,
    }, (v, b) => res({ issue: 'ok', b, ...etat }), (e, b) => res({ issue: 'ko', e, b, ...etat })));
};

(async () => {
    console.log('\n— Modèle lisible (le cas d\'aujourd\'hui) —');
    const a = await jouer({ rend: true });
    chk('save() appelé une fois', a.saves === 1, 'saves=' + a.saves);
    chk('succès', a.issue === 'ok', a.issue);
    chk('4 fermetures demandées au SDK (2 segments × 2 sens)', a.poses === 4, a.poses);
    chk('la vérification croisée a compté 4 objets', a.b.objets === 4, a.b.objets);

    console.log('\n— Le SDK ne rend rien (le jour où le contrat change) —');
    const b = await jouer({ rend: false });
    chk('save() est QUAND MÊME appelé', b.saves === 1, 'saves=' + b.saves);
    chk('succès, sur la foi du SDK et du DOM', b.issue === 'ok', b.issue);
    chk('la vérification croisée se déclare NON FAITE (objets = null)', b.b.objets === null, b.b.objets);

    console.log('\n— SDK async : un refus est une promesse REJETÉE, pas une exception —');
    const c = await jouer({ rend: true, rejette: [12] });
    chk('le segment refusé n\'est PAS compté posé (1 sur 2)', c.b.poses === 1, 'poses=' + c.b.poses);
    chk('ses deux sens sont comptés en erreur', c.b.erreurs === 2, 'erreurs=' + c.b.erreurs);
    const sansAwait = code.replace('const cree = await sdk.DataModel.RoadClosures.addClosure(', 'const cree = sdk.DataModel.RoadClosures.addClosure(');
    chk('TÉMOIN : le remplacement a mordu', sansAwait !== code);
    const cT = await jouer({ rend: true, rejette: [12], source: sansAwait });
    chk('TÉMOIN : sans await, le segment refusé passe pour posé (2 sur 2)', cT.b.poses === 2, 'poses=' + cT.b.poses);

    console.log('\n— 1.25.00 : fermetures existantes illisibles (doctrine France § 3.3) —');
    const d = await jouer({ rend: true, existantes: null });
    chk('illisibles : une relecture de l\'API est tentée', d.relectures === 1, 'relectures=' + d.relectures);
    chk('illisibles après relecture : RIEN n\'est posé', d.poses === 0 && d.saves === 0, 'poses=' + d.poses + ' saves=' + d.saves);
    chk('illisibles : échec dit avec son motif', d.issue === 'ko' && d.e[0] === 'applyExistingUnreadable', d.issue + ' ' + (d.e && d.e[0]));
    const d2 = await jouer({ rend: true, existantes: null, apresApi: [] });
    chk('lisibles après relecture : la pose part', d2.issue === 'ok' && d2.poses === 4, d2.issue + ' poses=' + d2.poses);
    const sansBlocage = code.replace("if(!existantes){ koCb&&koCb([t('applyExistingUnreadable')],{absents:0}); return; }", '');
    chk('TÉMOIN : le blocage est trouvé dans le code', sansBlocage !== code);
    const dT = await jouer({ rend: true, existantes: null, source: sansBlocage });
    chk('TÉMOIN : sans le blocage, tout part sans contrôle des doublons', dT.poses === 4 && dT.saves === 1, 'poses=' + dT.poses);

    console.log('\n— 1.25.00 : modifications de l\'éditeur en attente (doctrine France § 3.1) —');
    const p = await jouer({ rend: true, enAttente: 2 });
    chk('en attente : rien n\'est posé, save() jamais appelé', p.poses === 0 && p.saves === 0, 'poses=' + p.poses + ' saves=' + p.saves);
    chk('en attente : échec dit avec son motif', p.issue === 'ko' && p.e[0] === 'applyPendingStop', p.issue + ' ' + (p.e && p.e[0]));
    const sansGarde = code.replace('if(await _attenteEtrangere(koCb)) return;', '');
    chk('TÉMOIN : le garde est trouvé dans le code', sansGarde !== code);
    const pT = await jouer({ rend: true, enAttente: 2, source: sansGarde });
    chk('TÉMOIN : sans le garde, save() emporte les modifications de l\'éditeur', pT.saves === 1, 'saves=' + pT.saves);

    console.log('\n— Témoin : l\'ancien critère (diff du modèle) n\'aurait jamais enregistré —');
    const ancien = txt.includes('if(!segsPoses.size){');
    chk('le critère est bien segsPoses dans le fichier', ancien);
    const code2 = code.replace('if(!segsPoses.size){', 'if(!(_nouvelles||[]).length){');
    chk('TÉMOIN : le remplacement a mordu', code2 !== code);
    // Rejoue avec l'ancien critère.
    const env2 = code2;
    const W = { model: {} }, etat = { saves: 0 };
    const sdk = { DataModel: { RoadClosures: { addClosure: () => {} } }, Editing: { save: () => { etat.saves++; return Promise.resolve(); }, undoAll: () => {} } };
    sdk.Editing.getUnsavedChangesCount = () => 0;
    const f = new Function('sdk', 'W', 'document', 'log', 't', 'DIR', 'NODE_CL', 'closeNodes', 'getSegById', 'getExistingClosures', '_noeudsInterieurs', '_inversesListe', '_applyProviderTo', '_rafraichirFermeturesApi', '_applyAborted',
        env2 + '\nreturn addClosure;')(sdk, W, { querySelector: () => null }, () => {}, k => k, { AtoB: 1, BtoA: 2, TWO: 3 }, { none: 1, inside: 2, all: 3 }, 1,
        id => ({ id, isTwoWay: true, isAtoB: true, isBtoA: true }), () => [], () => new Set(), () => new Set(), () => 0, async () => null, false);
    const r = await new Promise(res => f({ segments: [11], reason: 'x', direction: 3, startDate: '2026-10-01 08:00', endDate: '2026-10-01 18:00' },
        (v, b) => res('ok'), () => res('ko')));
    chk('TÉMOIN : ancien critère + modèle illisible → « posé » sans aucun save()', r === 'ok' && etat.saves === 0, r + ', saves=' + etat.saves);

    console.log('\n' + ok + ' ok, ' + ko + ' échec(s)');
    process.exit(ko ? 1 : 0);
})();
