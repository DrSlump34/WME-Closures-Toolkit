// Controle de parite du dictionnaire i18n de WCT.
// Extrait le litteral « const D = {…} » de t() dans le fichier REEL et compare, langue
// par langue : jeu de cles, TYPE de chaque valeur (une cle fonction doit rester
// fonction) et ARITE (un argument oublie = un trou a l'ecran, muet).
// ⚠️ L'extraction passe par tools/lib-dico.js depuis le 01/08/2026. Ce fichier portait
// sa propre copie du scanner — comme trois autres outils — et cette copie ne sautait pas
// les commentaires : un guillemet isole dans une chaine hebraique a suffi a les faire
// tomber tous les trois d'un coup. Ne pas la reintroduire ici.
const { SRC, charger } = require('./lib-dico.js');
const { txt, D } = charger();
const langues = Object.keys(D);
console.log('Langues : ' + langues.join(', ') + '  (' + langues.length + ')');

const ref = 'en';
const clesRef = Object.keys(D[ref]).sort();
console.log('Cles dans « ' + ref + ' » : ' + clesRef.length);

let ko = 0;
const sousObjets = [];
for (const L of langues) {
    if (L === ref) continue;
    const cles = Object.keys(D[L]).sort();
    const manquantes = clesRef.filter(k => !(k in D[L]));
    const enTrop = cles.filter(k => !(k in D[ref]));
    const typeKo = [], ariteKo = [];
    for (const k of clesRef) {
        if (!(k in D[L])) continue;
        const a = D[ref][k], b = D[L][k];
        if (typeof a !== typeof b) { typeKo.push(k + ' (' + typeof a + ' vs ' + typeof b + ')'); continue; }
        if (typeof a === 'function' && a.length !== b.length) ariteKo.push(k + ' (' + a.length + ' vs ' + b.length + ')');
        if (a && typeof a === 'object' && !Array.isArray(a)) sousObjets.push([L, k]);
    }
    const souci = manquantes.length + enTrop.length + typeKo.length + ariteKo.length;
    if (souci) {
        ko++;
        console.log('\n  ECHEC ' + L + ' : ' + cles.length + ' cles');
        if (manquantes.length) console.log('      manquantes : ' + manquantes.join(', '));
        if (enTrop.length)     console.log('      en trop    : ' + enTrop.join(', '));
        if (typeKo.length)     console.log('      type       : ' + typeKo.join(', '));
        if (ariteKo.length)    console.log('      arite      : ' + ariteKo.join(', '));
    } else {
        console.log('  ok   ' + L + ' : ' + cles.length + ' cles, types et arites conformes');
    }
}

// Les cles du polygone doivent exister partout ET rendre quelque chose de non vide
const CLES_POLY = ['polyBtn','tipPolyBtn','polyGateHint','polyGateWhy','polyDrawHint','polyCancelled',
    'polyZoomIn','polyInvent','polyLoading','polyNone','polyDone','polyStopped','polyPartial',
    'polyBanner','polyBannerClear','polyBigConfirm','polyManyViews','polyApiFallback','polyError'];
console.log('\n— Rendu des cles du polygone —');
for (const L of langues) {
    const vides = [];
    for (const k of CLES_POLY) {
        const v = D[L][k];
        let rendu;
        try { rendu = (typeof v === 'function') ? v(1, 2, 3) : v; } catch (e) { rendu = ''; }
        if (!rendu || !String(rendu).trim()) vides.push(k);
    }
    if (vides.length) { ko++; console.log('  ECHEC ' + L + ' : vides → ' + vides.join(', ')); }
    else console.log('  ok   ' + L + ' : les 19 cles rendent du texte');
}
// Un placeholder non substitue trahit une arite ratee
console.log('\n— Placeholders non substitues —');
for (const L of langues) {
    const suspects = [];
    for (const k of CLES_POLY) {
        const v = D[L][k];
        if (typeof v !== 'function') continue;
        const s = String(v(7, 8, 9));
        if (/undefined|\$\{/.test(s)) suspects.push(k + ' → ' + s);
    }
    if (suspects.length) { ko++; console.log('  ECHEC ' + L + ' : ' + suspects.join(' | ')); }
    else console.log('  ok   ' + L);
}

console.log('\n' + (ko === 0 ? 'PARITE COMPLETE' : ko + ' PROBLEME(S)'));
process.exit(ko === 0 ? 0 : 1);
