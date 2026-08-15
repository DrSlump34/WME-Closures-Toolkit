#!/usr/bin/env node
// test-emprise-captage.js — le captage a-t-il bien lieu PENDANT le parcours ?
//
// Pourquoi ce controle existe (14/08/2026) : _chargerEmprise parcourait bien toute
// l emprise d un lot, mais le matching n avait lieu QU UNE FOIS, apres le parcours.
// WME ne garde pas indefiniment ce qu il a charge : au moment du matching, seules les
// dernieres vues etaient encore la. MisterLogik l a decrit exactement ainsi — « on voit
// en orange le trace theorique, mais il n a selectionne que la fin ».
// Et traceGenerateLots, lui, ne parcourait RIEN du tout : un seul recadrage centre sur
// un lot qui peut faire 4,5 km de cote quand la vue en couvre ~3x2.
//
// Ce test extrait _chargerEmprise du fichier REEL et compte les captages, avec une
// carte simulee qui OUBLIE tout sauf la derniere vue — c est le comportement qu on
// soupconne a WME, et c est celui qui doit etre survecu.
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
const deb = src.indexOf('const _chargerEmprise = async');
if (deb < 0) { console.error('ECHEC : _chargerEmprise introuvable'); process.exit(1); }
const fin = src.indexOf('\n};', deb);
const bloc = src.slice(deb, fin + 3);
if (!bloc.includes('onVue')) { console.error('ECHEC : le bloc extrait ne parle pas de onVue'); process.exit(1); }

// Bac a sable : une carte qui n a JAMAIS plus d une vue en memoire.
const faire = (bboxKm, vueKm) => {
    const chargees = [];          // ce que la vue courante contient (indices de case)
    let centre = null;
    const etat = { vues: 0, captages: 0, vuesAuMomentDuCaptage: [] };
    const sdk = {
        Map: {
            setMapCenter: (o) => { centre = o.lonLat; etat.vues++; chargees.length = 0; chargees.push(centre); },
            getMapExtent: () => [0, 0, vueKm / 111.32 / 0.8, vueKm / 110.54 / 0.8],
        },
    };
    const ctx = {
        sdk,
        SWEEP_ZOOM: 16,
        _sweepAborted: false,
        _sweepSleep: () => Promise.resolve(),
        waitMapLoaded: () => Promise.resolve(),
    };
    const f = new Function('sdk', 'SWEEP_ZOOM', 'SWEEP_SETTLE_MS', '_sweepAborted', '_sweepSleep', 'waitMapLoaded',
        bloc + '\nreturn _chargerEmprise;')(ctx.sdk, ctx.SWEEP_ZOOM, 0, ctx._sweepAborted, ctx._sweepSleep, ctx.waitMapLoaded);
    const bbox = { minLon: 0, minLat: 0, maxLon: bboxKm / 111.32, maxLat: bboxKm / 110.54 };
    const onVue = () => { etat.captages++; etat.vuesAuMomentDuCaptage.push(chargees.slice()); };
    return f(bbox, null, onVue).then(n => ({ ...etat, retour: n }));
};

(async () => {
    console.log('\n— Une emprise plus grande qu une vue —');
    // 4,5 km de cote, vue de 3x2 km : il faut plusieurs vues.
    const grand = await faire(4.5, 2.5);
    dit(grand.vues > 2, 'l emprise est parcourue en plusieurs vues', grand.vues + ' recadrages');
    dit(grand.captages === grand.vues - 1 || grand.captages === grand.vues,
        'un captage par vue chargee', grand.captages + ' captages pour ' + grand.vues + ' vues');
    dit(grand.captages > 1, 'le captage n a PAS lieu une seule fois a la fin',
        grand.captages + ' captages (avant le correctif : 1)');

    console.log('\n— Une emprise qui tient dans une vue —');
    // Le seul cas qui marchait avant ne doit pas devenir le seul a ne rien rendre.
    const petit = await faire(0.5, 3);
    dit(petit.retour === 1, 'un seul recadrage suffit', 'retour = ' + petit.retour);
    dit(petit.captages === 1, 'le captage a QUAND MEME lieu', petit.captages + ' captage');

    console.log('\n— Temoin : sans onVue, rien ne doit etre capte —');
    // Si ce temoin comptait quand meme des captages, le test mesurerait autre chose
    // que ce qu il croit.
    const chargees = [];
    let vues = 0, captages = 0;
    const sdk = { Map: { setMapCenter: () => { vues++; }, getMapExtent: () => [0, 0, 0.02, 0.02] } };
    const f2 = new Function('sdk', 'SWEEP_ZOOM', 'SWEEP_SETTLE_MS', '_sweepAborted', '_sweepSleep', 'waitMapLoaded',
        bloc + '\nreturn _chargerEmprise;')(sdk, 16, 0, false, () => Promise.resolve(), () => Promise.resolve());
    await f2({ minLon: 0, minLat: 0, maxLon: 0.04, maxLat: 0.04 }, null, undefined);
    dit(captages === 0 && vues > 1, 'sans callback, aucun captage et l emprise est quand meme parcourue',
        vues + ' vues, ' + captages + ' captages');

    console.log('\n— Les chemins qui restent passent par la meme porte —');
    const select = /_lotSelect[\s\S]*?await _chargerEmprise\(lot\.bbox,[\s\S]*?capter\)/.test(src);
    dit(select, '_lotSelect capte pendant le parcours');
    // ⚠️ traceGenerateLots etait surveille ici jusqu au 15/08/2026. `git log -S` a montre
    // qu elle etait MORTE depuis le 15/07 : le commit 8c01c5e (« lots en sous-lignes ») a
    // retire le bouton .wct-trace-file-lots et son handler sans retirer la fonction. Elle
    // a ete supprimee. Le correctif du 14/08 qui la visait n a donc jamais rien change
    // pour personne — et l annonce qui en faisait le chemin emprunte par l utilisateur
    // etait fausse. Ce controle garde la trace, et surtout il MORD si on la reintroduit
    // sans la brancher : une fonction que rien n appelle est un correctif qui ment.
    dit(!/traceGenerateLots/.test(src),
        'traceGenerateLots n est pas revenue', '(morte le 15/07, supprimee le 15/08)');
    const orpheline = /const\s+(\w+)\s*=\s*async\s*\(fileId\)[\s\S]{0,4000}?_sweepLots\(/.exec(src);
    dit(!orpheline || new RegExp(orpheline[1] + '\\s*\\(').test(src.replace(orpheline[0], '')),
        'aucune fonction de niveau fichier n est orpheline');

    console.log('\n' + (ko ? 'ECHEC : ' : 'TOUT PASSE : ') + ok + ' ok, ' + ko + ' ko');
    process.exit(ko ? 1 : 0);
})();
