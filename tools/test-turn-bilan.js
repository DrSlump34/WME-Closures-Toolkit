#!/usr/bin/env node
// test-turn-bilan.js — ce que l onglet Virages compte comme POSE
//
// Pourquoi ce controle existe : le rappel de succes de l application creditait
// `ids.length`, soit le nombre de virages DEMANDES. Un virage que le SDK refuse est
// saute dans la boucle de addTurnClosure, et le journal affichait quand meme
// « ✅ applique » sur un carrefour reste ouvert a la circulation. C est le meme defaut
// que celui corrige cote segments : le compte doit etre MESURE, pas suppose.
//
// Depuis le SDK v2.367, TurnClosures.addClosure applique aussi le RANG de l editeur
// (SegmentClosuresUseCase.canUserEditClosuresInView, seuil allowRoadClosureRank porte par
// le PAYS du segment) et leve « InvalidStateError: Not allowed to edit closures on these
// segments ». Le refus ne concerne donc plus seulement les virages interdits : il touche
// tout editeur dont le rang est insuffisant, et il touche des lots entiers.
//
// Le test extrait addTurnClosure du fichier REEL et le joue contre un SDK simule.
'use strict';
const fs = require('fs');
const path = require('path');

const FICHIER = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const src = fs.readFileSync(FICHIER, 'utf8');

let ok = 0, ko = 0;
const dit = (b, quoi, detail) => {
    console.log('  ' + (b ? 'ok  ' : 'KO  ') + ' ' + quoi + (detail ? '   ' + detail : ''));
    b ? ok++ : ko++;
};

// ── Extraction du fichier reel ─────────────────────────────────────────────
const deb = src.indexOf('const addTurnClosure=');
if (deb < 0) { console.error('ECHEC : addTurnClosure introuvable'); process.exit(1); }
const fin = src.indexOf('\n};', deb);
if (fin < 0) { console.error('ECHEC : fin de addTurnClosure introuvable'); process.exit(1); }
const bloc = src.slice(deb, fin + 3);
// 1.25.00 : le garde des modifications en attente et l'heure murale sont extraits eux aussi.
const extrait = (a, b) => { const i = src.indexOf(a); if (i < 0) { console.error('ECHEC : introuvable ' + a); process.exit(1); }
    const j = src.indexOf(b, i + a.length); return src.slice(i, j + b.length); };
const garde = extrait('const _attenteEtrangere=', '\n};');
const murale = extrait('const _versMurale=', '\n};');
for (const attendu of ['TurnClosures.addClosure', 'poses', 'bilan']) {
    if (!bloc.includes(attendu)) {
        console.error('ECHEC : le bloc extrait ne parle pas de ' + attendu);
        process.exit(1);
    }
}

// ── Bac a sable ────────────────────────────────────────────────────────────
// `rendu` decide, pour chaque appel, ce que fait le SDK : un objet (pose reussie),
// null/undefined (pas de retour), ou une exception (refus).
// virages : id -> [from, to], pour le recoupement des doublons (1.25.00).
const VIRAGES = new Map([[1, [101, 201]], [2, [101, 202]], [3, [101, 203]]]);
const jouer = ({ turnIds, rendu, getAllAvant = [], getAllApres = null, getAllLeve = false, saveRejette = false, code = bloc,
                 enAttente = 0, calqueKo = false }) => {
    const etat = { appels: 0, saveAppele: 0, undo: 0, journal: [] };
    let nAppels = 0;
    const sdk = {
        DataModel: {
            TurnClosures: {
                addClosure: () => {
                    etat.appels++;
                    const r = rendu(nAppels++);
                    if (r instanceof Error) throw r;
                    return r;
                },
                getAll: () => {
                    if (getAllLeve) throw new Error('modele indisponible');
                    // Le second appel (apres la boucle) rend l etat d arrivee.
                    return etat.appels === 0 ? getAllAvant : (getAllApres || getAllAvant);
                },
            },
        },
        Editing: {
            save: () => { etat.saveAppele++; return saveRejette ? Promise.reject(new Error('refus serveur')) : Promise.resolve('sauve'); },
            undoAll: () => { etat.undo++; },
            getUnsavedChangesCount: () => enAttente,
        },
    };
    const _virages = new Map([[9, { tours: [...VIRAGES].map(([id, [f, to]]) => ({ id, fromSegmentId: f, toSegmentId: to })) }]]);
    const document = { querySelector: () => null };
    const log = (m) => etat.journal.push(m);
    const t = (cle) => cle;
    const boite = new Function('sdk', 'document', 'log', 't', '_virages', '_closuresLayerKo',
        'let _applyAborted=false;\n' + murale + '\n' + garde + '\n' + code + '\nreturn { f:addTurnClosure, arrete:()=>_applyAborted };')(sdk, document, log, t, _virages, calqueKo);
    const f = boite.f;
    etat.arrete = boite.arrete;
    return new Promise(resolve => {
        f({ turnIds, reason: 'Travaux', startDate: new Date('2026-10-01T08:00:00'),
            endDate: new Date('2026-10-01T18:00:00'), permanent: false, eventId: null },
          (v, bilan) => resolve({ issue: 'ok', bilan, ...etat }),
          (errs, bilan) => resolve({ issue: 'ko', errs, bilan, ...etat }));
    });
};

const REFUS_RANG = () => new Error('Not allowed to edit closures on these segments');
const OBJET = (i) => ({ id: 'c' + i });

(async () => {
    console.log('\n=== addTurnClosure : ce qui est compte comme POSE ===\n');

    // 1. Tout passe.
    {
        const r = await jouer({ turnIds: [1, 2, 3], rendu: OBJET });
        dit(r.issue === 'ok', 'trois virages acceptes : succes', 'issue=' + r.issue);
        dit(r.bilan.poses === 3, 'trois poses comptees', 'poses=' + r.bilan.poses);
        dit(r.bilan.erreurs === 0, 'aucune erreur', 'erreurs=' + r.bilan.erreurs);
        dit(r.saveAppele === 1, 'save() appele une fois', 'save=' + r.saveAppele);
    }

    // 2. Refus partiel : c est LE cas que l ancien code affichait en « applique ».
    {
        const r = await jouer({ turnIds: [1, 2, 3], rendu: (i) => (i === 1 ? REFUS_RANG() : OBJET(i)) });
        dit(r.issue === 'ok', 'un refus sur trois : les deux autres partent', 'issue=' + r.issue);
        dit(r.bilan.poses === 2, 'DEUX poses comptees, pas trois', 'poses=' + r.bilan.poses);
        dit(r.bilan.demandes === 3, 'trois demandes', 'demandes=' + r.bilan.demandes);
        dit(r.bilan.erreurs === 1, 'une erreur retenue', 'erreurs=' + r.bilan.erreurs);
        dit(r.saveAppele === 1, 'save() appele : il reste quelque chose a sauver');
        // TEMOIN DE MORSURE : la regle naive credite les demandes. Si la regle reelle
        // rendait la meme chose, ce controle ne distinguerait rien.
        dit(r.bilan.poses !== 3, 'TEMOIN : la regle reelle differe de la regle naive (3)',
            'naive=3 reelle=' + r.bilan.poses);
    }

    // 3. Tout refuse : save() ne doit PAS etre appele.
    // Sans cela, save() n a rien a sauver et remonte « Save is disabled », un message qui
    // masque la vraie cause au lieu de la dire.
    {
        const r = await jouer({ turnIds: [1, 2], rendu: REFUS_RANG });
        dit(r.issue === 'ko', 'tout refuse : echec', 'issue=' + r.issue);
        dit(r.bilan.poses === 0, 'aucune pose', 'poses=' + r.bilan.poses);
        dit(r.saveAppele === 0, 'save() JAMAIS appele', 'save=' + r.saveAppele);
        dit(String(r.errs[0]).includes('Not allowed'), 'le motif remonte a l appelant',
            'errs[0]=' + r.errs[0]);
        dit(!String(r.errs[0]).startsWith('turn '), 'le prefixe technique est retire',
            'errs[0]=' + r.errs[0]);
        dit(r.bilan.cause === 'Not allowed to edit closures on these segments',
            'la cause est portee par le bilan', 'cause=' + r.bilan.cause);
    }

    // 4. FILET DE VERSION : le SDK cesse de rendre la fermeture creee, sans lever.
    // Le diff du modele doit alors faire foi, sinon le garde-fou contre les faux succes
    // fabriquerait de faux echecs a la premiere evolution du SDK.
    {
        const r = await jouer({
            turnIds: [1, 2, 3], rendu: () => undefined,
            getAllAvant: [{ id: 'a' }], getAllApres: [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }],
        });
        dit(r.issue === 'ok', 'aucun retour mais trois objets crees : succes', 'issue=' + r.issue);
        dit(r.bilan.poses === 3, 'le diff du modele fait foi', 'poses=' + r.bilan.poses);
        dit(r.bilan.objets === 3, 'trois objets gagnes', 'objets=' + r.bilan.objets);
    }

    // 5. Le filet ne doit PAS repecher un refus : si la boucle a signale une erreur,
    // c est elle qui fait foi, jamais le diff.
    {
        const r = await jouer({
            turnIds: [1, 2], rendu: REFUS_RANG,
            getAllAvant: [], getAllApres: [{ id: 'x' }, { id: 'y' }],
        });
        dit(r.bilan.poses === 0, 'un refus n est pas repeche par le diff', 'poses=' + r.bilan.poses);
        dit(r.issue === 'ko', 'et le lot reste en echec', 'issue=' + r.issue);
    }

    // 6. getAll indisponible. Jusqu'a la 1.24.05, la pose partait quand meme. Depuis la 1.25.00
    // (doctrine France § 3.3 : controler les doublons AVANT d'ecrire), rien n'est pose.
    {
        const r = await jouer({ turnIds: [1, 2], rendu: OBJET, getAllLeve: true });
        dit(r.issue === 'ko', 'fermetures existantes illisibles : echec', 'issue=' + r.issue);
        dit(r.appels === 0, 'AUCUN virage pose', 'appels=' + r.appels);
        dit(r.saveAppele === 0, 'save() jamais appele', 'save=' + r.saveAppele);
        dit(r.errs[0] === 'applyExistingUnreadable', 'le motif est dit', 'errs[0]=' + r.errs[0]);
        const c = await jouer({ turnIds: [1, 2], rendu: OBJET, calqueKo: true });
        dit(c.issue === 'ko' && c.appels === 0, 'calque Fermetures introuvable : rien n est pose non plus', 'issue=' + c.issue + ' appels=' + c.appels);
    }

    // 8. DOUBLONS (1.25.00) : un virage deja ferme sur le creneau est ecarte AVANT d'ecrire.
    {
        const exist = [{ id: 'e1', fromSegmentId: 101, toSegmentId: 202, startDate: '2026-10-01 12:00', endDate: '2026-10-01 14:00' }];
        const r = await jouer({ turnIds: [1, 2, 3], rendu: OBJET, getAllAvant: exist });
        dit(r.issue === 'ok', 'un virage deja ferme sur trois : succes', 'issue=' + r.issue);
        dit(r.appels === 2, 'DEUX virages poses, le doublon ecarte', 'appels=' + r.appels);
        dit(r.bilan.dejaFermes === 1, 'le bilan compte un deja ferme', 'dejaFermes=' + r.bilan.dejaFermes);
        dit(r.bilan.poses === 2, 'deux poses', 'poses=' + r.bilan.poses);
        // Bout a bout = conflit : Waze refuse 08:00 / 08:00.
        const bout = [{ id: 'e2', fromSegmentId: 101, toSegmentId: 201, startDate: '2026-10-01 06:00', endDate: '2026-10-01 08:00' }];
        const b = await jouer({ turnIds: [1], rendu: OBJET, getAllAvant: bout });
        dit(b.appels === 0 && b.bilan.dejaFermes === 1, 'bout a bout (fin 08:00 / debut 08:00) : ecarte', 'appels=' + b.appels);
        // Creneau qui ne chevauche pas : pose normale.
        const loin = [{ id: 'e3', fromSegmentId: 101, toSegmentId: 201, startDate: '2026-10-02 06:00', endDate: '2026-10-02 08:00' }];
        const l = await jouer({ turnIds: [1], rendu: OBJET, getAllAvant: loin });
        dit(l.appels === 1 && l.bilan.dejaFermes === 0, 'le lendemain : pose normale', 'appels=' + l.appels);
        // Meme creneau, AUTRE virage du meme noeud (from identique, to different) : pose normale.
        const autre = [{ id: 'e4', fromSegmentId: 101, toSegmentId: 999, startDate: '2026-10-01 08:00', endDate: '2026-10-01 18:00' }];
        const a = await jouer({ turnIds: [1], rendu: OBJET, getAllAvant: autre });
        dit(a.appels === 1, 'un autre virage ferme au meme noeud ne bloque rien', 'appels=' + a.appels);
        // TEMOIN : sans le filtre, le doublon est repose.
        const sans = bloc.replace('const aPoser=turnIds.filter(tid=>!dejaFermes.includes(tid));', 'const aPoser=turnIds;');
        dit(sans !== bloc, 'TEMOIN : le filtre est trouve dans le bloc');
        const t3 = await jouer({ turnIds: [1, 2, 3], rendu: OBJET, getAllAvant: exist, code: sans });
        dit(t3.appels === 3, 'TEMOIN : sans le filtre, le doublon part', 'appels=' + t3.appels);
    }

    // 9. Tout est deja ferme : rien a ecrire, et ce n'est pas un echec.
    {
        const exist = [1, 2].map(i => ({ id: 'x' + i, fromSegmentId: 101, toSegmentId: 200 + i, startDate: '2026-10-01 08:00', endDate: '2026-10-01 18:00' }));
        const r = await jouer({ turnIds: [1, 2], rendu: OBJET, getAllAvant: exist });
        dit(r.issue === 'ok', 'tout deja ferme : succes', 'issue=' + r.issue);
        dit(r.appels === 0 && r.saveAppele === 0, 'rien pose, save() jamais appele', 'appels=' + r.appels + ' save=' + r.saveAppele);
    }

    // 10. Modifications de l'editeur EN ATTENTE au moment de poser (1.25.00, doctrine § 3.1) :
    // save() les publierait avec le lot, on arrete toute l'application sans rien ecrire.
    {
        const r = await jouer({ turnIds: [1, 2], rendu: OBJET, enAttente: 3 });
        dit(r.issue === 'ko', 'modifications en attente : echec', 'issue=' + r.issue);
        dit(r.appels === 0 && r.saveAppele === 0 && r.undo === 0, 'rien pose, ni save() ni undoAll()', `appels=${r.appels} save=${r.saveAppele} undo=${r.undo}`);
        dit(r.errs[0] === 'applyPendingStop', 'le motif est dit', 'errs[0]=' + r.errs[0]);
        dit(r.arrete() === true, 'toute l application est arretee', 'arrete=' + r.arrete());
        const sans = bloc.replace('if(await _attenteEtrangere(koCb)) return;', '');
        dit(sans !== bloc, 'TEMOIN : le garde est trouve dans le bloc');
        const t4 = await jouer({ turnIds: [1, 2], rendu: OBJET, enAttente: 3, code: sans });
        dit(t4.saveAppele === 1, 'TEMOIN : sans le garde, save() emporte les modifications de l editeur', 'save=' + t4.saveAppele);
    }

    // 7. save() rejete : les fermetures de virage restees EN ATTENTE doivent etre defaites.
    // Audit du 25/09/2026 : sans undoAll, le save() du lot suivant les publiait alors que
    // la carte affichait un echec. Jumeau du chemin des segments.
    {
        const r = await jouer({ turnIds: [1, 2], rendu: OBJET, saveRejette: true });
        dit(r.issue === 'ko', 'save() rejete : echec', 'issue=' + r.issue);
        dit(r.undo === 1, 'undoAll() appele une fois', 'undo=' + r.undo);
        dit(String(r.errs[0]).includes('refus serveur'), 'le motif du rejet remonte', 'errs[0]=' + r.errs[0]);
        // TEMOIN : sans l undoAll du rejet, rien n est defait.
        // Depuis l'étape async (04/10/2026), l'annulation est ATTENDUE.
        const ligne = "try{ await sdk.Editing.undoAll(); }catch(e){ log('addTurnClosure/undoAll apres refus: '+e.message); }";
        const sans = bloc.replace(ligne, '');
        dit(sans !== bloc, 'TEMOIN : le correctif est trouve dans le bloc');
        const t2 = await jouer({ turnIds: [1, 2], rendu: OBJET, saveRejette: true, code: sans });
        dit(t2.undo === 0, 'TEMOIN : sans le correctif, rien n est defait', 'undo=' + t2.undo);
    }

    // ── Le branchement dans applyQueue ─────────────────────────────────────
    // Une mesure juste qui n est pas lue ne sert a rien : verifier que l appelant
    // credite bien le bilan, et non plus ids.length.
    console.log('\n=== branchement dans applyQueue ===\n');
    const app = src.slice(src.indexOf('addTurnClosure({turnIds:ids'));
    const zone = app.slice(0, 2000);
    dit(/\(v,bilan\)=>/.test(zone), 'le rappel de succes recoit le bilan');
    dit(/const poses=bilan\?bilan\.poses:ids\.length/.test(zone), 'il credite bilan.poses');
    dit(!/done\+=ids\.length/.test(zone), 'il ne credite PLUS ids.length sans condition');
    dit(/entryManques\+=manques/.test(zone), 'les manques alimentent l etat de l entree (partiel)');
    dit(/applyPartial/.test(zone), 'un lot incomplet est journalise comme partiel');
    dit(/applyCause/.test(zone), 'le motif est journalise');

    // La cle de traduction doit exister dans les 8 langues (check-keys.js le verifie
    // aussi, mais ce controle-ci doit tomber en meme temps que sa cause).
    const nCles = (src.match(/applyCause:/g) || []).length;
    dit(nCles === 8, 'applyCause definie dans les 8 langues', 'trouvees=' + nCles);

    console.log('\n' + (ko ? '❌ ' + ko + ' ECHEC(S)' : '✅ TOUT PASSE') + '   (' + ok + ' assertions)\n');
    process.exit(ko ? 1 : 0);
})();
