#!/usr/bin/env node
// check-pied.js — le pied « Valider » tient-il sur une ligne, dans les 8 langues ?
//
// POURQUOI CE CONTROLE EXISTE (2026-08-29, v1.14.02)
// Glenan56 a demande le 29/08/2026 une fonction qui existe depuis longtemps : conserver les
// parametres d une fermeture pour les rejouer avec un autre sens. C est exactement ce que
// fait le bouton preregllage — mais il n etait qu une DISQUETTE SANS LIBELLE, expliquee par
// une seule infobulle. Un Local Champ ne l a pas trouvee ; le defaut n est pas dans sa
// lecture, il est dans le bouton.
//
// ⭐ CE QU ON AJOUTE SE PAIE SUR CE QUI ETAIT LA. Le pied porte deja « Valider et ajouter a
// la file » en flex:1, et .wct-btn est en `white-space: nowrap` : le texte ne se replie pas,
// il DEBORDE de son bouton. Donner un libelle au bouton preregllage prend de la place a
// Valider, et c est cette place qu on mesure ici — dans les 8 langues et sur 4 largeurs.
//
// Comme check-entete.js, chaque langue est mesuree DEUX FOIS : avec le libelle et sans. Un
// debordement deja present sans lui n est pas mis a son compte — le resultat utile de ce
// controle est l ECART entre les deux colonnes, pas le verdict seul.
//
// ⚠️ Besoin de Chrome : il mesure des pixels, pas du texte. S il ne le trouve pas, il le
// DIT et sort en erreur.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { charger } = require('./lib-dico.js');

const { txt, D } = charger();

const deb = txt.indexOf('GM_addStyle(`');
const fin = txt.indexOf('`);', deb);
if (deb < 0 || fin < 0) { console.error('❌ bloc CSS introuvable.'); process.exit(2); }
const css = txt.slice(deb + 'GM_addStyle(`'.length, fin);

// Gabarit REEL du pied, lu dans le fichier.
const gDeb = txt.indexOf('<div class="wct-validate-footer"');
if (gDeb < 0) { console.error('❌ gabarit du pied introuvable — .wct-validate-footer a bouge.'); process.exit(2); }
const gFin = txt.indexOf('</div>', txt.indexOf('wct-preset-save-btn', gDeb));
const GABARIT = txt.slice(gDeb, gFin + 6).trim();
if (!GABARIT.includes('wct-btn-validate') || !GABARIT.includes('wct-preset-save-btn')) {
    console.error('❌ le pied lu ne contient pas ses deux boutons — rien a mesurer.');
    process.exit(2);
}
// Le libelle doit VRAIMENT etre dans le gabarit : sans lui, ce controle mesurerait le pied
// d avant et rendrait un verdict rassurant sur autre chose.
if (!GABARIT.includes("t('btnPresetSave')")) {
    console.error('❌ le bouton preregllage n affiche pas btnPresetSave — ce controle mesure le pied d avant.');
    process.exit(2);
}

const LANGUES = Object.keys(D);
const TEMOIN = 'temoin';

const rendre = (L, avecLibelle, libelleSup) => {
    let h = GABARIT.replace(/\$\{t\('([A-Za-z0-9_]+)'\)\}/g,
        (_, k) => String(D[L] && D[L][k] !== undefined ? D[L][k] : D.en[k]));
    if (!avecLibelle) h = h.replace(String(D[L].btnPresetSave || D.en.btnPresetSave), '\u{1F4BE}');
    if (libelleSup) h = h.replace(String(D[L].btnValidate || D.en.btnValidate),
                                  String(D[L].btnValidate || D.en.btnValidate) + ' ' + libelleSup);
    return h;
};

const bloc = (cle, L, avecLibelle, largeur, libelleSup) =>
    `<div class="mesure" data-cle="${cle}" data-avec="${avecLibelle ? 1 : 0}" data-w="${largeur}">
  <div id="wct-overlay" class="open" dir="${L === 'he' ? 'rtl' : 'ltr'}"
       style="position:static;width:${largeur}px;margin-bottom:6px">
    <div id="wct-body"><div id="wct-pane-cfg" class="wct-main-pane on"></div></div>
    ${rendre(L, avecLibelle, libelleSup)}
  </div></div>`;

// Largeurs reelles : 380 est le plancher de _ovClamp (OV_W_MIN), 620 la largeur par defaut.
const LARGEURS = [380, 440, 540, 620];

const blocs = [];
for (const L of LANGUES) for (const w of LARGEURS) {
    blocs.push(bloc(L, L, true, w));
    blocs.push(bloc(L, L, false, w));
}
// TEMOIN : un libelle de validation demesure, qui DOIT deborder dans les 4 largeurs. S il
// passe pour sain, la mesure ne mesure rien et le verdict sur les 8 langues ne vaut rien.
for (const w of LARGEURS) blocs.push(bloc(TEMOIN, 'de', true, w, 'und alle Sperrungen sofort anwenden'));

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
body { margin:0; font-family:'Rubik','Open Sans',sans-serif; }
${css}
</style></head><body>
${blocs.join('\n')}
<pre id="sortie"></pre>
<script>
const lignes = [];
document.querySelectorAll('.mesure').forEach(m => {
    const pied = m.querySelector('.wct-validate-footer');
    const val  = m.querySelector('#wct-btn-validate');
    const pre  = m.querySelector('#wct-preset-save-btn');
    const rv = val.getBoundingClientRect(), rr = pre.getBoundingClientRect();
    // ⚠️⚠️ DEUX MESURES FAUSSES AVANT CELLE-CI, et les deux etaient deja documentees
    // ailleurs dans ce dossier :
    // (1) comparer le bord haut des deux boutons pour savoir s ils sont sur la meme
    //     ligne : ils n ont ni la meme taille (.wct-btn vs .wct-btn-sm) ni le meme bord haut dans un
    //     conteneur align-items:center — la mesure annoncait DEUX LIGNES dans les huit
    //     langues, y compris a 620 px. C est le piege que check-entete.js decrit deja.
    //     On regarde donc la HAUTEUR DU PIED : deux lignes de boutons la doubleraient.
    // (2) chercher le debordement d un bouton par son scrollWidth : un flex item ne se
    //     comprime pas sous sa taille min-content, donc le bouton ne deborde jamais — c est
    //     le PIED qui reclame plus de large que le panneau. Le temoin sature passait pour
    //     sain dans les quatre largeurs.
    const debordPied = Math.max(0, Math.round(pied.scrollWidth - pied.clientWidth));
    const debordPre  = Math.max(0, Math.round(pre.scrollWidth - pre.clientWidth));
    const hPied = Math.round(pied.getBoundingClientRect().height);
    const hVal  = Math.round(rv.height);
    lignes.push([m.dataset.cle, m.dataset.avec, m.dataset.w, debordPied, debordPre, hPied, hVal,
                 Math.round(rv.width), Math.round(rr.width)].join(','));
});
document.getElementById('sortie').textContent = 'RESULTAT>>' + lignes.join(';') + '<<';
</script></body></html>`;

const page = path.join(os.tmpdir(), 'wct-check-pied.html');
fs.writeFileSync(page, html, 'utf8');

const CHROMES = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/usr/bin/google-chrome',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];
const chrome = CHROMES.find(p => fs.existsSync(p));
if (!chrome) {
    console.error('\nMESURE NON FAITE : chrome.exe introuvable.');
    console.error('   Ce controle mesure des PIXELS, il lui faut un moteur de rendu.');
    console.error('   Chemins testes :\n   ' + CHROMES.join('\n   '));
    process.exit(2);
}

let dom;
try {
    dom = execFileSync(chrome, ['--headless=new', '--disable-gpu', '--no-sandbox',
        '--virtual-time-budget=4000', '--window-size=1400,1000',
        '--dump-dom', 'file:///' + page.replace(/\\/g, '/')],
        { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
} catch (e) { console.error('MESURE NON FAITE : Chrome a echoue — ' + e.message); process.exit(2); }
const m = dom.match(/RESULTAT&gt;&gt;(.*?)&lt;&lt;|RESULTAT>>(.*?)<</s);
if (!m) { console.error('MESURE NON FAITE : la page ne s est pas executee.'); process.exit(2); }

const R = (m[1] || m[2]).split(';').map(l => {
    const [cle, avec, w, dPied, dPre, hPied, hVal, wVal, wPre] = l.split(',');
    return { cle, avec: avec === '1', w: +w, dPied: +dPied, dPre: +dPre,
             hPied: +hPied, hVal: +hVal, wVal: +wVal, wPre: +wPre };
});

let ok = 0, ko = 0;
const dit = (b, quoi, detail) => {
    console.log('  ' + (b ? 'ok  ' : 'KO  ') + ' ' + quoi + (detail ? '   ' + detail : ''));
    b ? ok++ : ko++;
};

console.log('\n— Ce que le libelle coute a « Valider », largeur par largeur —');
console.log('  langue  largeur   Valider(px)   pied AVEC   pied SANS   bouton preregl.');
for (const L of LANGUES) for (const w of LARGEURS) {
    const a = R.find(x => x.cle === L && x.w === w && x.avec);
    const s = R.find(x => x.cle === L && x.w === w && !x.avec);
    if (!a || !s) continue;
    console.log('  ' + L.padEnd(8) + String(w).padEnd(10) + String(a.wVal).padEnd(14) +
                String(a.dPied).padEnd(12) + String(s.dPied).padEnd(12) + a.wPre + ' px');
}

console.log('\n— Le libelle du bouton preregllage est-il ENTIER ? —');
// C est le point du changement : un libelle tronque serait pire qu une icone seule.
for (const L of LANGUES) {
    const pires = LARGEURS.map(w => R.find(x => x.cle === L && x.w === w && x.avec)).filter(Boolean);
    const pire = Math.max(...pires.map(x => x.dPre));
    dit(pire === 0, L + ' : « ' + String(D[L].btnPresetSave) + ' » s affiche en entier',
        pire ? '(' + pire + ' px tronques)' : '');
}

console.log('\n— Le pied tient-il sur une ligne, et dans le panneau ? —');
for (const L of LANGUES) {
    const cas = LARGEURS.map(w => R.find(x => x.cle === L && x.w === w && x.avec)).filter(Boolean);
    // « Une seule ligne » = le pied ne fait pas la hauteur de deux boutons empiles.
    dit(cas.every(x => x.hPied < x.hVal * 2), L + ' : le pied reste sur une ligne',
        'hauteur ' + cas.map(x => x.hPied).join('/') + ' px pour un bouton de ' + cas[0].hVal + ' px');
    const dehors = Math.max(...cas.map(x => x.dPied));
    dit(dehors === 0, L + ' : le pied ne reclame pas plus large que le panneau',
        dehors ? '(' + dehors + ' px de trop)' : '');
}

console.log('\n— Ce que le libelle ajoute VRAIMENT —');
// On ne juge pas le pied dans l absolu : a 380 px il pouvait deja etre a l etroit SANS le
// libelle. Ce qui doit etre vrai, c est que le libelle ne cree pas un defaut la ou il n y en
// avait pas — l ECART entre les deux colonnes est le vrai resultat de ce controle.
for (const L of LANGUES) {
    const paires = LARGEURS.map(w => ({ a: R.find(x => x.cle === L && x.w === w && x.avec),
                                        s: R.find(x => x.cle === L && x.w === w && !x.avec), w }))
                           .filter(x => x.a && x.s);
    const creees = paires.filter(x => x.a.dPied > 0 && x.s.dPied === 0);
    dit(creees.length === 0, L + ' : le libelle ne met pas le pied a l etroit',
        creees.length ? 'apparait a ' + creees.map(x => x.w + ' px').join(', ')
                      : 'cout ' + paires.map(x => (x.a.wPre - x.s.wPre) + 'px').join('/'));
}

console.log('\n— TEMOIN DE MORSURE : un libelle de validation demesure —');
const tem = R.filter(x => x.cle === TEMOIN);
// ⚠️ On n exige pas qu il morde aux QUATRE largeurs, et ce n est pas un assouplissement de
// complaisance : a 620 px, un libelle demesure tient encore, et c est la bonne reponse. Ce
// qui doit etre vrai, c est qu il morde la ou la place manque — la largeur PLANCHER.
const mord = tem.filter(x => x.dPied > 0).length;
const auPlancher = tem.find(x => x.w === LARGEURS[0]);
dit(auPlancher && auPlancher.dPied > 0,
    'le temoin deborde bien a la largeur plancher (' + LARGEURS[0] + ' px)',
    'debords ' + tem.map(x => x.w + ':' + x.dPied).join(' ') + ' px');
if (!(auPlancher && auPlancher.dPied > 0)) {
    console.log('');
    console.log('❌ TEMOIN NON DETECTE : ' + (tem.length - mord) + ' largeur(s) declarent saine');
    console.log('   une ligne volontairement saturee. La mesure ne mesure alors rien,');
    console.log('   et le « TOUT PASSE » ci-dessus ne vaut pas ce qu il annonce.');
    process.exit(2);
}

console.log('\n— Verdict —');
console.log(ko ? '  ' + ko + ' KO sur ' + (ok + ko) + '\n\nECHEC\n' : '  ' + ok + ' ok, 0 ko\n\nTOUT PASSE\n');
process.exit(ko ? 1 : 0);
