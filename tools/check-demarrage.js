#!/usr/bin/env node
// check-demarrage.js — Le script DEMARRE-T-IL ?
//
// Pourquoi ce controle existe : `node --check` prouve que le fichier se PARSE,
// pas qu'il s'execute. Deux versions sont parties en production sans demarrer
// alors que tous les tests etaient au vert — un backtick avale par une chaine
// de gabarit ne casse ni la syntaxe ni aucun test unitaire, il casse le corps
// de l'IIFE au premier tour. Compiler n'est pas demarrer.
//
// Ce qu'il fait : execute le fichier REEL dans un bac a sable minimal, et
// verifie que le corps du grand IIFE va jusqu'au bout, c'est-a-dire jusqu'a
// l'abonnement final a `wme-ready`. C'est ce dernier geste qui prouve que
// tout ce qui precede (dictionnaire, constantes, fonctions) a ete evalue.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const FICHIER = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const src = fs.readFileSync(FICHIER, 'utf8');

let ok = 0, ko = 0;
const dit = (b, quoi, detail) => {
    console.log('  ' + (b ? 'ok  ' : 'KO  ') + ' ' + quoi + (detail ? '   ' + detail : ''));
    b ? ok++ : ko++;
};

// ── Bac a sable ────────────────────────────────────────────────────────────
// Volontairement pauvre : on ne simule pas WME, on veut seulement voir si le
// corps du script s'evalue. Tout ce qui n'est touche qu'apres `wme-ready` n'a
// pas besoin d'exister.
const faireSandbox = () => {
    const ecoutes = [];
    const elem = () => ({
        style: {}, dataset: {}, classList: { add(){}, remove(){}, toggle(){}, contains(){ return false; } },
        appendChild(){}, append(){}, remove(){}, setAttribute(){}, removeAttribute(){},
        getAttribute(){ return null; }, addEventListener(){}, removeEventListener(){},
        querySelector(){ return null; }, querySelectorAll(){ return []; },
        insertAdjacentHTML(){}, focus(){}, click(){}, closest(){ return null; },
        getBoundingClientRect(){ return { left:0, top:0, right:0, bottom:0, width:0, height:0 }; },
        get innerHTML(){ return ''; }, set innerHTML(_v){},
        get textContent(){ return ''; }, set textContent(_v){},
    });
    const doc = {
        readyState: 'complete',
        head: elem(), body: elem(), documentElement: elem(),
        createElement: () => elem(), createElementNS: () => elem(),
        createTextNode: () => elem(),
        querySelector: () => null, querySelectorAll: () => [],
        getElementById: () => null, getElementsByTagName: () => [],
        addEventListener: (nom) => { ecoutes.push(nom); },
        removeEventListener(){},
    };
    const sandbox = {
        document: doc,
        console: { log(){}, warn(){}, error(){}, info(){}, debug(){} },
        setTimeout: () => 0, clearTimeout(){}, setInterval: () => 0, clearInterval(){},
        requestAnimationFrame: () => 0, cancelAnimationFrame(){},
        localStorage: { getItem: () => null, setItem(){}, removeItem(){} },
        navigator: { language: 'fr-FR', languages: ['fr-FR'], userAgent: 'node', clipboard: {} },
        location: { href: 'https://www.waze.com/fr/editor', search: '', hash: '' },
        MutationObserver: function(){ return { observe(){}, disconnect(){} }; },
        ResizeObserver: function(){ return { observe(){}, disconnect(){} }; },
        IntersectionObserver: function(){ return { observe(){}, disconnect(){} }; },
        DOMParser: function(){ return { parseFromString: () => doc }; },
        XMLSerializer: function(){ return { serializeToString: () => '' }; },
        fetch: () => Promise.resolve({ ok:false, text: () => Promise.resolve('') }),
        matchMedia: () => ({ matches:false, addEventListener(){}, addListener(){} }),
        getComputedStyle: () => ({ getPropertyValue: () => '' }),
        Blob: function(){}, URL: { createObjectURL: () => '', revokeObjectURL(){} },
        // `W` existe, mais VIDE. Deux raisons :
        //  - le point d entree teste `W?.userscripts?.state.isReady` ; avec un W vide
        //    la branche `wme-ready` est prise, et c est elle qu on veut voir passer ;
        //  - `W?.` ne protege PAS d une variable non declaree, seulement d un undefined.
        //    Le script s en remet donc a WME pour avoir pose `W` avant lui. C est vrai
        //    a `document-idle` (aucun @run-at n est declare, c est le defaut), mais la
        //    garantie tient au gestionnaire de scripts, pas au code.
        W: {},
        // Les quatre API accordees par les @grant du fichier : elles existent
        // vraiment sous Tampermonkey, les omettre ferait echouer le controle sur
        // une absence qui n arrive jamais en vrai.
        GM_addStyle(){}, GM_getValue: (_k, d) => d, GM_setValue(){}, GM_xmlhttpRequest(){},
        // Les trois bibliotheques @require, chargees par le gestionnaire AVANT le script.
        fflate: { unzipSync: () => ({}), strFromU8: () => '' },
        proj4: Object.assign(() => ({ forward: p => p, inverse: p => p }), { defs(){} }),
        shp: () => Promise.resolve([]),
        // Deliberement ABSENTS : sdk, OpenLayers. Le script ne doit pas en avoir
        // besoin pour se charger — il les attend apres `wme-ready`.
        __ecoutes: ecoutes,
    };
    sandbox.window = sandbox;
    sandbox.unsafeWindow = sandbox;
    sandbox.globalThis = sandbox;
    return sandbox;
};

console.log('\n— Le corps du script s evalue-t-il ? —');
const sandbox = faireSandbox();
let leve = null;
try {
    vm.runInNewContext(src, vm.createContext(sandbox), { filename: 'WME_ClosuresToolkit.user.js', timeout: 20000 });
} catch (e) {
    leve = e;
}
dit(!leve, 'le fichier s execute sans lever', leve ? (leve.name + ': ' + leve.message) : '');

// Le dernier geste du script : s abonner a `wme-ready` (W absent dans le bac a
// sable, donc c est cette branche qui doit etre prise). S il est enregistre,
// TOUT ce qui precede a ete evalue.
const abonne = sandbox.__ecoutes.includes('wme-ready');
dit(abonne, 'le script va jusqu au bout (abonnement a wme-ready)',
    abonne ? '' : 'ecouteurs vus : ' + (sandbox.__ecoutes.join(', ') || 'aucun'));

// ── Temoin ─────────────────────────────────────────────────────────────────
// Un controle qui ne peut pas echouer ne prouve rien. On rejoue le meme test
// sur une copie volontairement cassee : elle DOIT etre refusee. Sans ce temoin,
// un bac a sable trop permissif validerait n importe quoi.
console.log('\n— Temoin : une version cassee doit etre refusee —');
const casse = src.replace('(function () {', '(function () {\n    NExistePasDuTout.appel();');
const bacTemoin = faireSandbox();
let leveTemoin = null;
try {
    vm.runInNewContext(casse, vm.createContext(bacTemoin), { filename: 'temoin.js', timeout: 20000 });
} catch (e) { leveTemoin = e; }
dit(!!leveTemoin, 'le temoin casse leve bien', leveTemoin ? leveTemoin.name : 'IL N A PAS LEVE — le bac a sable ne mord pas');
dit(!bacTemoin.__ecoutes.includes('wme-ready'), 'le temoin casse n atteint pas la fin');

console.log('\n' + (ko ? 'ECHEC : ' : 'TOUT PASSE : ') + ok + ' ok, ' + ko + ' ko');
process.exit(ko ? 1 : 0);
