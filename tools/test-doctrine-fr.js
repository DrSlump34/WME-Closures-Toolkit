#!/usr/bin/env node
// test-doctrine-fr.js — les engagements de la 1.25.00 envers la doctrine France des scripts
// (Discuss 414231, octobre 2026), là où aucun autre banc ne regarde :
//
//  1. Le clic « Appliquer » REFUSE de partir quand l'éditeur a des modifications en attente
//     (§ 3.1 : un script ne touche pas aux modifications de l'éditeur). Avant, il prévenait
//     seulement, et save() les emportait avec les fermetures.
//  2. Une entrée sans MTE ni motif est SIGNALÉE dans la confirmation, pas bloquée (§ 3.3 :
//     « un acte identifiable » ; arbitrage de l'auteur du 11/10/2026 : avertissement).
//  3. La position du segment ne part à Nominatim QUE sur un clic (§ 3.1 : un envoi reste
//     désactivé tant que l'éditeur ne l'a pas activé). Avant, elle partait d'elle-même.
//
// Le garde PENDANT l'application et le contrôle des doublons sont éprouvés par
// test-verdict-save.js (segments) et test-turn-bilan.js (virages).
'use strict';
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js'), 'utf8');

let ok = 0, ko = 0;
const dit = (b, quoi, detail) => { console.log('  ' + (b ? 'ok  ' : 'KO  ') + ' ' + quoi + (detail ? '   ' + detail : '')); b ? ok++ : ko++; };
const extrait = (a, b, depuis = 0) => {
    const i = src.indexOf(a, depuis); if (i < 0) throw new Error('introuvable : ' + a);
    const j = src.indexOf(b, i + a.length); if (j < 0) throw new Error('fin introuvable : ' + a);
    return src.slice(i, j + b.length);
};

(async () => {
    // ── 1 et 2 : le gestionnaire du clic « Appliquer », joué contre des doublures ──
    console.log('\n=== Clic « Appliquer » ===\n');
    const debut = src.indexOf("$id('wct-btn-apply')?.addEventListener('click',async()=>{");
    const corps = extrait('if(_applyRunning) return;', 'await applyQueue();', debut);
    const jouer = ({ enAttente = 0, file = [{ config: { reason: 'Arrêté 2026-123' } }], code = corps, accepte = true }) => {
        const etat = { alertes: [], confirmations: [], appliquee: 0 };
        const f = new Function('_applyRunning', 'sdk', 'log', 't', 'alert', 'confirm', 'queue', '_queueTotalClosures', 'applyQueue',
            'return (async()=>{' + code + '})();');
        return f(false, { Editing: { getUnsavedChangesCount: () => enAttente } }, () => {},
            (k, ...a) => k + (a.length ? '(' + a.join(',') + ')' : ''),
            m => etat.alertes.push(m), m => { etat.confirmations.push(m); return accepte; },
            file, q => q.length, () => { etat.appliquee++; }).then(() => etat);
    };
    {
        const r = await jouer({ enAttente: 0 });
        dit(r.appliquee === 1 && r.alertes.length === 0, 'rien en attente : la confirmation puis l application', `appliquee=${r.appliquee}`);
        dit(!/confirmApplySansActe/.test(r.confirmations[0] || ''), 'entrée avec motif : pas d avertissement', r.confirmations[0]);
    }
    {
        const r = await jouer({ enAttente: 3 });
        dit(r.appliquee === 0, 'modifications en attente : l application NE PART PAS', `appliquee=${r.appliquee}`);
        dit(r.alertes[0] === 'applyPendingBlock(3)', 'l éditeur est prévenu, avec le nombre', r.alertes[0]);
        dit(r.confirmations.length === 0, 'aucune confirmation n est même proposée', `confirm=${r.confirmations.length}`);
        const sans = corps.replace("if(enAttente){ alert(t('applyPendingBlock',enAttente)); return; }", '');
        dit(sans !== corps, 'TEMOIN : le refus est trouvé dans le code');
        const t = await jouer({ enAttente: 3, code: sans });
        dit(t.appliquee === 1, 'TEMOIN : sans le refus, l application part avec les modifications de l éditeur', `appliquee=${t.appliquee}`);
    }
    {
        const file = [{ config: { reason: '  ' } }, { config: { reason: '', mteId: 77 } }, { config: { reason: 'Arrêté' } }, { config: {} }];
        const r = await jouer({ file });
        dit(/confirmApplySansActe\(2\)/.test(r.confirmations[0] || ''), 'deux entrées sans MTE ni motif sont signalées (motif blanc compris)', r.confirmations[0]);
        dit(r.appliquee === 1, 'signalé, pas bloqué : l éditeur peut confirmer', `appliquee=${r.appliquee}`);
        const r2 = await jouer({ file, accepte: false });
        dit(r2.appliquee === 0, 'et il peut renoncer', `appliquee=${r2.appliquee}`);
    }
    dit(!/confirmApplyPending/.test(src), 'l ancienne mise en garde (qui laissait partir) a disparu du fichier');
    for (const cle of ['applyPendingBlock', 'applyPendingStop', 'confirmApplySansActe', 'applyExistingUnreadable', 'turnDejaFermes', 'holRegionLocate', 'tipHolRegionLocate']) {
        const n = (src.match(new RegExp('^\\s*' + cle + ':', 'gm')) || []).length;
        dit(n === 8, cle + ' définie dans les 8 langues', 'trouvées=' + n);
    }

    // ── 3 : Nominatim seulement sur un clic ──
    console.log('\n=== Nominatim ===\n');
    const fn = extrait('const resoudreRegionAuto=', '\n};');
    const appels = (src.match(/fetchRegionCodes\(/g) || []).length;
    dit(appels === 1, 'fetchRegionCodes : un seul appel dans tout le fichier', 'appels=' + appels);
    dit(fn.includes('fetchRegionCodes('), 'et cet appel est dans resoudreRegionAuto');
    const jouerRegion = (autorise, code = fn) => {
        const etat = { requetes: 0 };
        const f = new Function('_holRegionSource', '_regionEnCours', 'getSelection', 'checkSelectionState', 'cleEtat', '_regionParEtat',
            'REGION_PAYS_ENTIER', '_regionEchecs', 'getSegPoint', 'fetchRegionCodes', '_regionAutoAutorisee', 'setTimeout', 'refreshSmallPreview',
            code + '\nreturn resoudreRegionAuto;');
        const r = f('auto', null, () => ({ ids: [1] }), () => ({ ok: true, state: 'Victoria' }), (p, e) => p + '|' + e, {},
            '*', new Set(), () => ({ lon: 145, lat: -37.8 }), () => { etat.requetes++; return new Promise(() => {}); }, autorise, () => {}, () => {});
        r('AU', ['AU-VIC']);
        return etat;
    };
    dit(jouerRegion(false).requetes === 0, 'sans le clic : AUCUNE requête');
    dit(jouerRegion(true).requetes === 1, 'après le clic : une requête');
    const sans = fn.replace('if(!_regionAutoAutorisee) return;', '');
    dit(sans !== fn, 'TEMOIN : le verrou est trouvé dans le code');
    dit(jouerRegion(false, sans).requetes === 1, 'TEMOIN : sans le verrou, la position part d elle-même');
    const poses = [...src.matchAll(/_regionAutoAutorisee=true/g)].map(m => m.index);
    const bouton = src.indexOf("$id('wct-hol-region-locate')?.addEventListener('click'");
    dit(poses.length === 1 && poses[0] > bouton && poses[0] - bouton < 400, 'le verrou ne s ouvre que dans le gestionnaire du bouton', 'ouvertures=' + poses.length);
    dit(/let _regionAutoAutorisee=false;/.test(src), 'fermé au démarrage');

    console.log('\n' + (ko ? '❌ ' + ko + ' ECHEC(S)' : '✅ TOUT PASSE') + '   (' + ok + ' assertions)\n');
    process.exit(ko ? 1 : 0);
})().catch(e => { console.error('ECHEC : ' + e.message); process.exit(1); });
