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
for (const attendu of ['TurnClosures.addClosure', 'poses', 'bilan']) {
    if (!bloc.includes(attendu)) {
        console.error('ECHEC : le bloc extrait ne parle pas de ' + attendu);
        process.exit(1);
    }
}

// ── Bac a sable ────────────────────────────────────────────────────────────
// `rendu` decide, pour chaque appel, ce que fait le SDK : un objet (pose reussie),
// null/undefined (pas de retour), ou une exception (refus).
const jouer = ({ turnIds, rendu, getAllAvant = [], getAllApres = null, getAllLeve = false }) => {
    const etat = { appels: 0, saveAppele: 0, journal: [] };
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
            save: () => { etat.saveAppele++; return Promise.resolve('sauve'); },
            undoAll: () => {},
        },
    };
    const document = { querySelector: () => null };
    const log = (m) => etat.journal.push(m);
    const t = (cle) => cle;
    const f = new Function('sdk', 'document', 'log', 't',
        bloc + '\nreturn addTurnClosure;')(sdk, document, log, t);
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

    // 6. getAll indisponible : la mesure primaire tient toujours.
    {
        const r = await jouer({ turnIds: [1, 2], rendu: OBJET, getAllLeve: true });
        dit(r.issue === 'ok', 'modele illisible : la pose est quand meme comptee', 'issue=' + r.issue);
        dit(r.bilan.poses === 2, 'deux poses', 'poses=' + r.bilan.poses);
        dit(r.bilan.objets === null, 'la corroboration se declare NON FAITE', 'objets=' + r.bilan.objets);
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
