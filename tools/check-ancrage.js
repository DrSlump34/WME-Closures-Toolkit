#!/usr/bin/env node
// check-ancrage.js — la fenetre du script tient-elle dans l ecran, et peut-on la regler ?
//
// POURQUOI CE CONTROLE EXISTE (2026-08-28, v1.14.00)
// --------------------------------------------------
// MisterLogik, 27/08/2026 : « le reglage de la fenete n est pas / plus possible ? Elle est
// attache en bas... et je la trouve trop "grande" sur cet ecran ». GNico73, meme version,
// sur un autre ecran : « Pas de probleme de mon cote, la fenetre est bien flottante ».
// Deux constats opposes sur le meme code — donc une mesure a faire, pas un avis a rendre.
//
// CE QUE LA MESURE A DONNE, et c est la partie B ci-dessous :
//   au-dessus de 820 px de hauteur de fenetre, le panneau s arrete a 50 px du bas ;
//   a 820 px et en dessous, la media query l etire jusqu a 16 px du bas ;
//   a 680 px et en dessous, jusqu a 8 px.
// « Attache en bas » n est donc pas un bug : c est ce que le CSS demande. Et comme le
// deplacement bornait deja la hauteur a ce qui reste sous le curseur, deplacer le panneau
// ne pouvait pas le decoller — il n y avait simplement AUCUN moyen de le retrecir.
//
// CE QUE LE CORRECTIF AJOUTE, et le risque qu il cree (partie A) :
// une geometrie MEMORISEE. Reglee sur un 27 pouces et relue sur un portable, elle mettrait
// le panneau hors ecran — et il est en `position:fixed`, donc plus rien ne permettrait
// d aller le rechercher : ni barre de defilement, ni raccourci. Le bornage a la RELECTURE
// est la seule chose qui separe « la fenetre se souvient » de « la fenetre a disparu ».
// C est lui que la partie A mesure, avec un temoin.
//
// ⚠️ La partie B a besoin de Chrome. Si elle ne peut pas etre faite, elle le DIT et sort
// en erreur : un controle qui se tait sur ce qu il n a pas mesure ne vaut rien.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const RACINE  = path.join(__dirname, '..');
const FICHIER = path.join(RACINE, 'WME_ClosuresToolkit.user.js');
const src = fs.readFileSync(FICHIER, 'utf8');

let ok = 0, ko = 0;
const dit = (b, quoi, detail) => {
    console.log('  ' + (b ? 'ok  ' : 'KO  ') + ' ' + quoi + (detail ? '   ' + detail : ''));
    b ? ok++ : ko++;
};

// ════════════════════════════════════════════════════════════════════════════
//  PARTIE A — le bornage, extrait du fichier reel et joue en Node
// ════════════════════════════════════════════════════════════════════════════
const iA = src.indexOf('const OV_W_MIN');
if (iA < 0) { console.error('ECHEC : OV_W_MIN introuvable — les bornes ont ete renommees.'); process.exit(2); }
const iFin = src.indexOf('\n};', src.indexOf('const _ovClamp', iA));
if (iFin < 0) { console.error('ECHEC : fin de _ovClamp introuvable'); process.exit(2); }
const blocA = src.slice(iA, iFin + 3);
if (!blocA.includes('_ovClamp')) { console.error('ECHEC : bloc sans _ovClamp'); process.exit(2); }

const A = new Function(blocA + '\nreturn { _ovClamp, OV_W_MIN, OV_H_MIN, OV_MARGE };')();
const { _ovClamp, OV_W_MIN, OV_H_MIN, OV_MARGE } = A;

console.log('\n— Bornes lues dans le fichier reel —');
console.log('   largeur mini ' + OV_W_MIN + ' px, hauteur mini ' + OV_H_MIN + ' px, marge ' + OV_MARGE + ' px');

// Ecrans reels, du plus grand au plus petit. Le 1366x768 est le cas de MisterLogik ; le
// 1280x600 represente un portable avec barre des taches et fenetre non maximisee.
const ECRANS = [
    { nom: '27 pouces',        vw: 2560, vh: 1440 },
    { nom: 'bureau 1080p',     vw: 1920, vh: 1080 },
    { nom: 'portable 900',     vw: 1440, vh: 900  },
    { nom: 'portable 768',     vw: 1366, vh: 768  },
    { nom: 'fenetre courte',   vw: 1280, vh: 600  },
];

console.log('\n— 🔴 UNE GEOMETRIE REGLEE SUR GRAND ECRAN, RELUE SUR PETIT —');
// Le scenario qui fabriquerait un panneau inatteignable : reglee plein cadre sur un 27
// pouces, la fenetre depasse de TOUS les ecrans plus petits.
const grande = { x: 1800, y: 1100, w: 700, h: 320 };
for (const e of ECRANS) {
    const g = _ovClamp(grande, e.vw, e.vh);
    const dedans = g.x >= 0 && g.y >= 0 && g.x + g.w <= e.vw && g.y + g.h <= e.vh;
    dit(dedans, e.nom.padEnd(15) + ' (' + e.vw + 'x' + e.vh + ') : la fenetre reste dans l ecran',
        'x' + g.x + ' y' + g.y + ' ' + g.w + 'x' + g.h);
}

console.log('\n— TEMOIN DE MORSURE : sans bornage, elle sortirait —');
// Sans ce temoin, un _ovClamp qui rendrait sa saisie telle quelle passerait tous les tests
// ci-dessus sur les grands ecrans, ou la geometrie tient deja.
const petit = ECRANS[ECRANS.length - 1];
dit(grande.x + grande.w > petit.vw || grande.y + grande.h > petit.vh,
    'la geometrie d essai depasse VRAIMENT du petit ecran',
    '(' + (grande.x + grande.w) + ' > ' + petit.vw + ')');
const borne = _ovClamp(grande, petit.vw, petit.vh);
dit(borne.x !== grande.x || borne.y !== grande.y || borne.w !== grande.w || borne.h !== grande.h,
    'le bornage la MODIFIE donc reellement');

console.log('\n— Les minimums : la barre d action doit rester visible —');
// Sous la hauteur mini, il ne reste plus rien entre l en-tete et « Valider »/« Appliquer ».
dit(_ovClamp({ x: 0, y: 0, w: 10, h: 10 }, 1920, 1080).w === OV_W_MIN, 'une largeur minuscule remonte au minimum');
dit(_ovClamp({ x: 0, y: 0, w: 10, h: 10 }, 1920, 1080).h === OV_H_MIN, 'une hauteur minuscule remonte au minimum');
dit(_ovClamp({ x: 0, y: 0, w: 0,  h: 0  }, 1920, 1080).h === OV_H_MIN, 'zero aussi');
dit(_ovClamp({ x: -500, y: -500, w: 600, h: 400 }, 1920, 1080).x === 0, 'une position negative revient a 0');
dit(_ovClamp({ x: 'abc', y: null, w: undefined, h: NaN }, 1920, 1080).w === OV_W_MIN,
    'des valeurs illisibles retombent sur les minimums',
    '(fichier de preferences edite a la main, ou bornes changees entre deux versions)');

console.log('\n— TEMOIN : le bornage ne doit pas tout ecraser —');
const raisonnable = { x: 120, y: 80, w: 620, h: 700 };
const r = _ovClamp(raisonnable, 1920, 1080);
dit(r.x === 120 && r.y === 80 && r.w === 620 && r.h === 700,
    'une geometrie qui TIENT passe telle quelle', JSON.stringify(r));

console.log('\n— Un ecran plus petit que le minimum —');
// Cas limite reel : une fenetre de navigateur reduite a la main sous 400x250.
// ⚠️ LES DEUX PREMIERES VERSIONS DE CE TEST ONT ECHOUE, ET C EST LE TEST QUI AVAIT TORT.
// J attendais « x=0 et y=0 » puis « h = hauteur mini » ; la mesure rend x=0, y=16, h=224.
// Elle a raison : a 240 px de haut, le maximum autorise est 240 - 2x8 = 224, donc plus
// que le minimum de 200 — et y=16 est ce qui reste au-dessus une fois cette hauteur posee.
// Le minimum n est pas une cible, c est un plancher. Ce qui doit etre vrai ici n est pas
// une position particuliere, mais que la fenetre reste ATTEIGNABLE : l en-tete au-dessus
// du bord haut, et le bas dans l ecran.
const minus = _ovClamp({ x: 300, y: 300, w: 620, h: 700 }, 320, 240);
dit(minus.y >= 0 && minus.y + minus.h <= 240,
    'sur un ecran minuscule, la fenetre reste verticalement atteignable', JSON.stringify(minus));
dit(minus.x === 0, 'elle se cale contre le bord gauche');
// Le plancher de largeur l emporte sur un ecran de 320 px : le panneau depasse alors de
// 60 px. C est assume — un panneau de 304 px de large est inutilisable, un panneau qui
// depasse un peu se lit encore. Le test le CONSTATE au lieu de le taire.
dit(minus.w === OV_W_MIN, 'sa largeur tombe au plancher',
    '(' + minus.w + ' px pour un ecran de 320 : le plancher l emporte, et c est voulu)');

// ════════════════════════════════════════════════════════════════════════════
//  PARTIE B — la geometrie que le CSS produit VRAIMENT, mesuree par Chrome
// ════════════════════════════════════════════════════════════════════════════
const deb = src.indexOf('GM_addStyle(`');
const fin = src.indexOf('`);', deb);
if (deb < 0 || fin < 0) { console.error('ECHEC : bloc CSS introuvable'); process.exit(2); }
const css = src.slice(deb + 'GM_addStyle(`'.length, fin);

// Panneau NU, avec un corps volontairement plus haut que tout ecran : c est la seule
// façon de mesurer ce que le CSS AUTORISE, et non ce que le contenu du jour occupe.
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
html,body { margin:0; height:100%; }
${css}
</style></head><body>
<div id="wct-overlay" class="open">
  <div id="wct-hdr">WCT</div>
  <div id="wct-body"><div style="height:4000px">corps volontairement tres haut</div></div>
  <div id="wct-action-bar-wrap"><button class="wct-btn">Appliquer</button></div>
  <div id="wct-resize"></div>
</div>
<pre id="sortie"></pre>
<script>
const ov = document.getElementById('wct-overlay');
const bar = document.getElementById('wct-action-bar-wrap');
const poi = document.getElementById('wct-resize');
const r = ov.getBoundingClientRect(), b = bar.getBoundingClientRect(), p = poi.getBoundingClientRect();
document.getElementById('sortie').textContent = 'RESULTAT>>' + [
    Math.round(innerHeight), Math.round(r.top), Math.round(r.height),
    Math.round(innerHeight - r.bottom),           // distance au bas de l ecran
    Math.round(r.bottom - b.bottom),              // la barre d action est-elle DANS le panneau ?
    Math.round(p.width), Math.round(r.right - p.right), Math.round(r.bottom - p.bottom)
].join('|') + '<<';
</script></body></html>`;

const page = path.join(os.tmpdir(), 'wct-check-ancrage.html');
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
    console.error('   La partie B mesure des PIXELS, il lui faut un moteur de rendu.');
    console.error('   Chemins testes :\n   ' + CHROMES.join('\n   '));
    process.exit(2);
}

const FENETRES = [
    { nom: 'plein ecran',          taille: '1920,1080' },
    { nom: 'portable haut',        taille: '1440,900'  },
    { nom: 'sous la 1re bascule',  taille: '1366,800'  },
    { nom: 'sous la 2e bascule',   taille: '1280,660'  },
];

console.log('\n— PARTIE B : ce que le CSS produit, mesure par Chrome —');
console.log('  fenetre        haut   hauteur  bas    barre d action   poignee');
const bas = [];
for (const f of FENETRES) {
    let dom;
    try {
        dom = execFileSync(chrome, ['--headless=new', '--disable-gpu', '--no-sandbox',
            '--virtual-time-budget=3000', '--window-size=' + f.taille,
            '--dump-dom', 'file:///' + page.replace(/\\/g, '/')],
            { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    } catch (e) {
        console.error('MESURE NON FAITE : Chrome a echoue — ' + e.message);
        process.exit(2);
    }
    const m = dom.match(/RESULTAT&gt;&gt;(.*?)&lt;&lt;|RESULTAT>>(.*?)<</s);
    if (!m) { console.error('MESURE NON FAITE : la page ne s est pas executee.'); process.exit(2); }
    const [vh, top, h, sousLePli, barreDedans, poiW, poiDroite, poiBas] = (m[1] || m[2]).split('|').map(Number);
    bas.push({ f, vh, top, h, sousLePli });
    console.log('  ' + f.nom.padEnd(21) + String(top).padEnd(7) + String(h).padEnd(9) +
        String(sousLePli).padEnd(7) + String(barreDedans).padEnd(17) +
        poiW + 'px a ' + poiDroite + '/' + poiBas);
    dit(barreDedans >= 0, f.nom + ' : la barre d action reste DANS le panneau',
        '(depassement ' + (-barreDedans) + ' px)');
    // ⚠️ Tolerance de 2 px, et ce n est pas de la complaisance : #wct-overlay porte
    // `border: 1px`, que getBoundingClientRect compte alors que `right:0` se cale sur la
    // boite de padding. Exiger 0 px faisait echouer les quatre fenetres pour une bordure.
    dit(poiW > 0 && poiDroite <= 2 && poiBas <= 2,
        f.nom + ' : la poignee est bien dans le coin bas-droite',
        '(' + poiW + ' px, a ' + poiDroite + '/' + poiBas + ' du coin — la bordure)');
}

console.log('\n— Le constat de MisterLogik, chiffre —');
// On ne CORRIGE pas ces valeurs : le panneau doit continuer a se densifier sur ecran
// court, c est ce qui garde « Valider » visible. Ce qu on verifie, c est que le diagnostic
// donne dans le fil Discord correspond a ce que la machine fait.
const court = bas.filter(x => x.vh <= 820);
const haut  = bas.filter(x => x.vh > 820);
dit(haut.length > 0 && court.length > 0, 'les deux regimes sont couverts par la mesure');
if (haut.length && court.length) {
    const pireCourt = Math.min(...court.map(x => x.sousLePli));
    const pireHaut  = Math.min(...haut.map(x => x.sousLePli));
    dit(pireCourt < pireHaut,
        'sur ecran court, le panneau s approche VRAIMENT plus du bas',
        pireCourt + ' px contre ' + pireHaut + ' px — c est le « attache en bas » signale');
}

// ════════════════════════════════════════════════════════════════════════════
//  PARTIE C — LE PANNEAU REPLIE SE VOIT-IL ENCORE ?
// ════════════════════════════════════════════════════════════════════════════
// POURQUOI CETTE PARTIE EXISTE (2026-08-29, v1.14.01)
// Glenan56, fil Discord du script : « je selectionne un segment mais rien n apparait dans
// l onglet configurer », capture a l appui. Le panneau n etait pas casse : il etait REPLIE.
// La regle `.collapsed` masque le corps ET le bandeau de selection — les deux seules pieces
// absentes de sa capture, et aucune autre regle du fichier ne masque ce bandeau.
//
// CE QUI A CHANGE EN 1.14.00, ET C EST TOUT LE DEFAUT : le repli ne se VOIT plus. Tant que
// la hauteur restait `auto`, replier retrecissait la fenetre — le geste s annoncait de
// lui-meme. Depuis que `_ovApply` pose `height` en STYLE INLINE des que l editeur a deplace
// ou redimensionne la fenetre une fois, elle garde sa taille memorisee : le corps disparait
// et il reste un grand rectangle vide, qui se lit comme une panne et non comme un repli.
//
// CE QU ON MESURE, et c est un RAPPORT, pas une borne : la hauteur du panneau replie AVEC
// une geometrie memorisee doit etre celle qu il prend SANS — celle de son contenu. Un seuil
// en pixels se serait perime a la premiere ligne ajoutee dans l en-tete.
console.log('\n— PARTIE C : le panneau replie garde-t-il la hauteur memorisee ? —');

// La regle du correctif, cherchee dans le CSS reel. Le temoin de morsure consiste a la
// retirer : sans lui, un contrôle qui « passe » ne distinguerait pas le correctif de rien.
const RE_REPLI = /#wct-overlay\.collapsed\s*\{[^}]*height:\s*auto[^}]*\}/;
dit(RE_REPLI.test(css), 'la regle qui libere la hauteur en replie est bien dans le fichier');

// Panneau complet : le pied « Valider » n apparait que si un #wct-pane-cfg.on existe
// (regle :has), et c est justement lui qu on voit sur la capture de Glenan.
const pageRepli = (feuille) => `<!doctype html><html><head><meta charset="utf-8"><style>
html,body { margin:0; height:100%; }
${feuille}
</style></head><body>
<div id="wct-overlay" class="open">
  <div id="wct-hdr">WCT</div>
  <div id="wct-sel-strip"><span class="wct-sel-text">3 segments</span></div>
  <div id="wct-main-tabs"><button class="wct-main-tab on" data-tab="cfg">Configurer</button></div>
  <div id="wct-body"><div id="wct-pane-cfg" class="wct-main-pane on"><div style="height:4000px">corps</div></div></div>
  <div class="wct-validate-footer"><button class="wct-btn">Valider</button></div>
  <div id="wct-action-bar-wrap"><button class="wct-btn">Appliquer</button></div>
  <div id="wct-resize"></div>
</div>
<pre id="sortie"></pre>
<script>
const ov = document.getElementById('wct-overlay');
const bar = document.getElementById('wct-action-bar-wrap');
// Exactement ce que pose _ovApply une fois la fenetre reglee par l editeur.
const GEO = { left:'120px', top:'80px', width:'620px', height:'700px', maxHeight:'700px' };
const poseGeo = on => { for (const k in GEO) ov.style[k] = on ? GEO[k] : ''; };
const mesure = () => {
    const r = ov.getBoundingClientRect(), b = bar.getBoundingClientRect();
    return [Math.round(r.height), Math.round(r.bottom - b.bottom)];  // hauteur, vide sous la barre
};
poseGeo(true);  ov.classList.remove('collapsed'); const deplie     = mesure();
                ov.classList.add('collapsed');    const replieGeo  = mesure();
poseGeo(false);                                   const replieAuto = mesure();
document.getElementById('sortie').textContent = 'RESULTAT>>' +
    [].concat(deplie, replieGeo, replieAuto).join('|') + '<<';
</script></body></html>`;

const mesurerRepli = (feuille, quoi) => {
    const f = path.join(os.tmpdir(), 'wct-check-repli.html');
    fs.writeFileSync(f, pageRepli(feuille), 'utf8');
    let dom;
    try {
        dom = execFileSync(chrome, ['--headless=new', '--disable-gpu', '--no-sandbox',
            '--virtual-time-budget=3000', '--window-size=1920,1080',
            '--dump-dom', 'file:///' + f.replace(/\\/g, '/')],
            { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    } catch (e) {
        console.error('MESURE NON FAITE (' + quoi + ') : Chrome a echoue — ' + e.message);
        process.exit(2);
    }
    const m = dom.match(/RESULTAT&gt;&gt;(.*?)&lt;&lt;|RESULTAT>>(.*?)<</s);
    if (!m) { console.error('MESURE NON FAITE (' + quoi + ') : la page ne s est pas executee.'); process.exit(2); }
    const [hD, vD, hRG, vRG, hRA, vRA] = (m[1] || m[2]).split('|').map(Number);
    return { deplie: { h: hD, vide: vD }, replieGeo: { h: hRG, vide: vRG }, replieAuto: { h: hRA, vide: vRA } };
};

const C = mesurerRepli(css, 'code reel');
console.log('  deplie avec geometrie   : ' + C.deplie.h + ' px de haut, ' + C.deplie.vide + ' px sous la barre d action');
console.log('  REPLIE avec geometrie   : ' + C.replieGeo.h + ' px de haut, ' + C.replieGeo.vide + ' px sous la barre d action');
console.log('  replie sans geometrie   : ' + C.replieAuto.h + ' px de haut, ' + C.replieAuto.vide + ' px sous la barre d action');

// ⚠️ Ce premier controle protege la 1.14.00 elle-meme : liberer la hauteur en replie ne
// doit pas liberer celle du panneau OUVERT, sinon la fenetre ne se souviendrait plus.
// ⚠️ 702 px pour une geometrie de 700 : #wct-overlay porte `border: 1px`, que
// getBoundingClientRect compte des deux cotes alors que `height` se pose sur la boite de
// contenu. Meme tolerance qu en partie B, et pour exactement la meme raison — exiger 700
// pile faisait echouer un correctif qui marche.
dit(Math.abs(C.deplie.h - 700) <= 2, 'ouvert, le panneau garde bien la hauteur memorisee',
    C.deplie.h + ' px pour 700 demandes — les 2 px sont la bordure');
dit(Math.abs(C.replieGeo.h - C.replieAuto.h) <= 1,
    'replie, il retombe sur la hauteur de son CONTENU',
    C.replieGeo.h + ' px avec geometrie, ' + C.replieAuto.h + ' px sans');
dit(C.replieGeo.vide <= C.replieAuto.vide + 1,
    'plus de rectangle vide sous la barre d action',
    C.replieGeo.vide + ' px de vide (reference : ' + C.replieAuto.vide + ' px)');

console.log('\n— TEMOIN DE MORSURE : sans la regle, le defaut de Glenan revient —');
const cssSansRegle = css.replace(RE_REPLI, '');
dit(cssSansRegle.length < css.length, 'la regle a VRAIMENT ete retiree de la feuille d essai',
    (css.length - cssSansRegle.length) + ' caracteres en moins');
const T = mesurerRepli(cssSansRegle, 'temoin');
console.log('  REPLIE avec geometrie   : ' + T.replieGeo.h + ' px de haut, ' + T.replieGeo.vide + ' px sous la barre d action');
dit(Math.abs(T.replieGeo.h - 700) <= 2 && T.replieGeo.h > C.replieGeo.h,
    'sans elle, le panneau replie garde sa hauteur memorisee',
    T.replieGeo.h + ' px contre ' + C.replieGeo.h + ' px avec la regle');
dit(T.replieGeo.vide > C.replieGeo.vide,
    'sans elle, le vide sous la barre d action reapparait',
    T.replieGeo.vide + ' px contre ' + C.replieGeo.vide + ' px — c est le rectangle de la capture');

console.log('\n— Verdict —');
console.log(ko ? '  ' + ko + ' KO sur ' + (ok + ko) + '\n\nECHEC\n' : '  ' + ok + ' ok, 0 ko\n\nTOUT PASSE\n');
process.exit(ko ? 1 : 0);
