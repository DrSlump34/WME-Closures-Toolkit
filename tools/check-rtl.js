// Le panneau se retourne-t-il VRAIMENT en hebreu ?
//
// POURQUOI CE CONTROLE EXISTE (2026-08-11)
// L hebreu est livre depuis la 1.07.01 et PERSONNE N A JAMAIS VU L ECRAN. Le bloc CSS
// #wct-overlay[dir="rtl"] a ete ecrit pour corriger ce qui ne se retourne pas seul, et
// il a ete ecrit SANS ETRE VU non plus : son propre commentaire le dit (« Ce bloc n a
// PAS ete vu a l ecran »). Une regle CSS qui vise le mauvais parent, ou qui perd contre
// un style inline, ne laisse aucune trace : elle est la, elle se lit bien, et elle ne
// fait rien. Aucun des 30 autres outils ne peut le voir — ils lisent du texte.
//
// COMMENT
// On rejoue le CSS REEL du script et on remonte les fragments DOM dans leur VRAI parent
// (c est tout l enjeu : un toggle sous #wct-sidebar n est pas un toggle sous
// #wct-overlay). Les styles INLINE des deux popovers sont extraits du fichier, pas
// recopies a la main : c est justement leur presence en inline qui decide du resultat.
// Puis on laisse Chrome calculer, en LTR d abord, en RTL ensuite.
//
// CE QU ON MESURE : le RTL change-t-il quelque chose ? Pour chaque piece, on compare la
// geometrie LTR et la geometrie RTL. Une piece censee se retourner et qui rend
// exactement la meme position dans les deux sens est un correctif qui NE MORD PAS.
//
// ⚠️ TEMOIN — sans lui ce controle ne vaut rien. On rejoue tout une seconde fois avec le
// bloc RTL RETIRE du CSS. Les pieces declarees saines DOIVENT alors tomber. Une piece qui
// passe dans les deux cas ne doit rien au correctif, et le verdict la concernant est vide.
//
// ⚠️ Sur-contrainte : un element absolu portant left, right ET width est sur-contraint.
// CSS 2.1 §10.3.7 dit que le sens d ecriture decide de celui qu on ignore. On ne CITE pas
// cette regle, on la fait constater au moteur par un temoin dedie avant de s en servir.
//
// ⚠️ Ce controle a besoin de Chrome. S il ne le trouve pas, il le DIT et sort en erreur.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const SRC = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');

// ── CSS reel ──
const deb = txt.indexOf('GM_addStyle(`');
const fin = txt.indexOf('`);', deb);
if (deb < 0 || fin < 0) {
    console.error('❌ bloc CSS introuvable — GM_addStyle a ete renomme ou deplace.');
    process.exit(2);
}
const cssComplet = txt.slice(deb + 'GM_addStyle(`'.length, fin);

// ── Le bloc RTL, isole : on doit pouvoir le RETIRER pour le temoin ──
const reglesRtl = cssComplet.split('\n').filter(l => /\[dir="rtl"\]/.test(l));
if (reglesRtl.length === 0) {
    console.error('❌ aucune regle [dir="rtl"] dans le CSS — le bloc a disparu.');
    process.exit(2);
}
const cssSansRtl = cssComplet.split('\n').filter(l => !/\[dir="rtl"\]/.test(l)).join('\n');

// ── Styles INLINE reels des deux popovers : extraits, jamais recopies ──
const styleInline = (id) => {
    const m = txt.match(new RegExp('id="' + id + '"[^>]*?style="([^"]*)"', 's'));
    if (!m) {
        console.error('❌ style inline de #' + id + ' introuvable — le HTML a change.');
        process.exit(2);
    }
    return m[1].replace(/\s*\n\s*/g, ' ').trim();
};
const STYLE_EMOJI = styleInline('wct-emoji-picker');
const STYLE_PRESET = styleInline('wct-preset-popup');

// ── Fragments, chacun sous son VRAI parent ──
// Le toggle vit dans la barre laterale WME, PAS dans l overlay : c est le point.
const fragments = (sens) => `
<div id="wct-sidebar" dir="${sens}" style="width:300px;padding:10px;position:relative">
  <div class="wct-toggle-row">
    <span>etiquette</span>
    <label class="wct-toggle" id="tg-repos">
      <input type="checkbox"><span class="wct-toggle-slider"></span>
    </label>
    <label class="wct-toggle" id="tg-coche">
      <input type="checkbox" checked><span class="wct-toggle-slider"></span>
    </label>
  </div>
</div>

<div id="wct-overlay" dir="${sens}" style="display:flex;height:420px">
  <div id="wct-body" style="position:relative;flex:1">
    <div style="position:relative">
      <div id="wct-emoji-picker" style="${STYLE_EMOJI.replace('display:none', 'display:block')}"></div>
    </div>
    <div class="wct-src-busy" id="busy"></div>
  </div>
  <div id="wct-preset-popup" style="${STYLE_PRESET.replace('display:none', 'display:block')}">popup</div>
</div>`;

// Temoin de moteur : un element sur-contraint (left + right + width), mesurable pour de
// vrai. Il etablit ce que Chrome ignore selon le sens, au lieu de le tenir d une norme.
const temoinMoteur = `
<div id="sc-ltr" dir="ltr" style="position:relative;width:300px;height:20px">
  <div class="sc" style="position:absolute;left:-40px;right:0;width:120px;height:10px"></div>
</div>
<div id="sc-rtl" dir="rtl" style="position:relative;width:300px;height:20px">
  <div class="sc" style="position:absolute;left:-40px;right:0;width:120px;height:10px"></div>
</div>`;

// UNE PAGE PAR SENS. Les fragments portent les ID reels du script (#wct-overlay,
// #wct-sidebar…) et les selecteurs CSS a verifier visent ces ID : deux jeux dans la meme
// page, ce sont des ID en double, et plus rien ne garantit lequel on mesure.
const page = (css, sens) => `<!doctype html><html><head><meta charset="utf-8"><style>
body { margin:0; font-family:'Rubik','Open Sans',sans-serif; }
${css}
/* L animation de la barre d attente est figee a 33 % de son cycle : on veut une valeur
   interpolee stable, pas une photo au hasard. */
.wct-src-busy::after { animation-play-state: paused !important; animation-delay: -0.33s !important; }
.bloc { margin:16px; }
</style></head><body>
<div class="bloc" id="bloc">${fragments(sens)}</div>
${temoinMoteur}
<pre id="sortie"></pre>
<script>
try {
const res = {};
function mesure(bloc, sens, cle) {
    const q = (s) => bloc.querySelector(s);
    const rect = (el) => { const r = el.getBoundingClientRect(); return {x:Math.round(r.left), w:Math.round(r.width)}; };

    const sb = q('#wct-sidebar'), ov = q('#wct-overlay'), body = q('#wct-body');
    const rSb = rect(sb), rOv = rect(ov);

    // Pastille de l interrupteur : on veut sa position en PIXELS dans son rail, pas la
    // liste des declarations. Un pseudo-element n a pas de getBoundingClientRect : on
    // reconstitue le bord gauche a partir de left (ou right) et du translateX applique.
    const pastille = (id) => {
        const rail = q('#' + id);
        const cs = getComputedStyle(rail.querySelector('.wct-toggle-slider'), '::before');
        const larg = parseFloat(cs.width) || 0;
        const railW = rect(rail).w;
        const tx = (() => {
            const m = cs.transform.match(/matrix\(([^)]*)\)/);
            return m ? parseFloat(m[1].split(',')[4]) : 0;
        })();
        // Sur-contrainte : si left ET right sont poses, le sens decide du gagnant.
        const l = cs.left, r = cs.right;
        const gauchePosee = l !== 'auto', droitePosee = r !== 'auto';
        let x;
        if (gauchePosee && droitePosee) x = (sens === 'rtl') ? railW - parseFloat(r) - larg : parseFloat(l);
        else if (gauchePosee) x = parseFloat(l);
        else x = railW - parseFloat(r) - larg;
        return { x: Math.round(x + tx), larg: Math.round(larg), rail: railW };
    };

    // Popovers : marges reelles de part et d autre, et LARGEUR. Une piece qui change de
    // geometrie n est pas pour autant retournee : left et right poses ensemble sur une
    // largeur auto ne la deplacent pas, ils l ETIRENT.
    const geo = (sel, ref) => {
        const el = q(sel); if (!el) return null;
        const a = rect(el), b = rect(ref);
        return { debut: a.x - b.x, fin: (b.x + b.w) - (a.x + a.w), larg: a.w };
    };

    const busy = q('#busy');
    const csBusy = getComputedStyle(busy, '::after');

    res[cle] = {
        sidebarX: rSb.x, overlayX: rOv.x, overlayW: rOv.w,
        fenetre: window.innerWidth,
        pastilleRepos: pastille('tg-repos'),
        pastilleCoche: pastille('tg-coche'),
        emoji: geo('#wct-emoji-picker', body),
        preset: geo('#wct-preset-popup', ov),
        busyLeft: csBusy.left, busyRight: csBusy.right, busyW: csBusy.width,
        busyRailW: rect(busy).w,
    };
}
// Le sens REEL est injecte : la reconstitution de la pastille en depend, et une valeur
// figee ferait calculer tous les cas comme du gauche-a-droite. La cle de rangement, elle,
// reste la meme des deux cotes pour que la comparaison soit ecrite une seule fois.
mesure(document.getElementById('bloc'), '${sens}', 'sens');

// Temoin de moteur : quelle propriete le moteur ignore-t-il selon le sens ?
const sc = (id) => { const p = document.getElementById(id); const e = p.querySelector('.sc');
    return Math.round(e.getBoundingClientRect().left - p.getBoundingClientRect().left); };
res.moteur = { ltr: sc('sc-ltr'), rtl: sc('sc-rtl') };

document.getElementById('sortie').textContent = 'RESULTAT>>' + JSON.stringify(res) + '<<';
} catch (err) {
    document.getElementById('sortie').textContent = 'ERREUR>>' + (err && err.stack || err) + '<<';
}
</script></body></html>`;

// ── Chrome ──
const CHROMES = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/usr/bin/google-chrome',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];
const chrome = CHROMES.find(p => fs.existsSync(p));
if (!chrome) {
    console.error('❌ MESURE NON FAITE : chrome.exe introuvable.');
    console.error('   Ce controle mesure des PIXELS, il lui faut un moteur de rendu.');
    console.error('   Chemins testes :\n   ' + CHROMES.join('\n   '));
    process.exit(2);
}

const rendre = (css, sens, nom) => {
    const f = path.join(os.tmpdir(), 'wct-check-rtl-' + nom + '-' + sens + '.html');
    fs.writeFileSync(f, page(css, sens), 'utf8');
    let dom;
    try {
        dom = execFileSync(chrome, ['--headless=new', '--disable-gpu', '--no-sandbox',
            '--virtual-time-budget=3000', '--window-size=1400,900',
            '--dump-dom', 'file:///' + f.replace(/\\/g, '/')],
            { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    } catch (e) {
        console.error('❌ MESURE NON FAITE : Chrome a echoue — ' + e.message);
        process.exit(2);
    }
    // On lit le contenu du <pre>, pas un motif libre : le source du script figure lui
    // aussi dans le DOM dumpe, et une regex trop large y trouverait sa propre phrase.
    const bloc = dom.match(/<pre id="sortie">([\s\S]*?)<\/pre>/);
    const m = bloc && bloc[1].match(/RESULTAT&gt;&gt;([\s\S]*?)&lt;&lt;|RESULTAT>>([\s\S]*?)<</);
    if (bloc && /ERREUR&gt;&gt;|ERREUR>>/.test(bloc[1])) {
        console.error('❌ MESURE NON FAITE : la page a leve une erreur —');
        console.error(bloc[1].replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&'));
        process.exit(2);
    }
    if (!m) {
        console.error('❌ MESURE NON FAITE : la page ne s est pas executee (aucun resultat dans le <pre>).');
        process.exit(2);
    }
    const brut = (m[1] || m[2]).replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    return JSON.parse(brut);
};

// Quatre rendus : les deux sens, avec puis sans le bloc RTL (le temoin).
const lire = (css, nom) => {
    const l = rendre(css, 'ltr', nom), r = rendre(css, 'rtl', nom);
    return { ltr: l.sens, rtl: r.sens, moteur: l.moteur };
};
const avec = lire(cssComplet, 'avec');
const sans = lire(cssSansRtl, 'sans');

// ── Verdict ──
console.log('CONTROLE DU RENDU EN HEBREU (ecriture droite-a-gauche)');
console.log('  ' + reglesRtl.length + ' regles [dir="rtl"] dans le CSS\n');

console.log('— Ce que le moteur ignore quand left, right et width sont tous poses —');
console.log('  LTR : bord gauche a ' + avec.moteur.ltr + ' px  (left=-40 respecte => right ignore)');
console.log('  RTL : bord gauche a ' + avec.moteur.rtl + ' px  (left ignore => right respecte)');
const moteurOk = avec.moteur.ltr !== avec.moteur.rtl;
if (!moteurOk) {
    console.log('  ⚠️ le temoin ne montre aucune difference : la suite ne peut pas etre interpretee.');
}
console.log('');

const pieces = [];
const noter = (nom, quoi, verdictAvec, detail, doitChanger) => {
    pieces.push({ nom, quoi, ok: verdictAvec, detail, doitChanger });
};

// 1. Ancrage du panneau — mesure reelle : le panneau garde son position:fixed, donc
// c est bien right:60px puis left:60px qui le placent.
{
    const b = avec.ltr, a = avec.rtl;
    const margeFinLtr = b.fenetre - (b.overlayX + b.overlayW);   // 60 px attendus a droite
    const ok = a.overlayX === margeFinLtr && a.overlayX !== b.overlayX;
    noter('panneau', 'ancre du cote oppose', ok,
        'LTR bord gauche a ' + b.overlayX + ' px, marge droite ' + margeFinLtr + ' px' +
        '\n              RTL bord gauche a ' + a.overlayX + ' px' +
        (ok ? '' : '\n              => le panneau ne change pas de cote'), true);
}

// 2. Interrupteur (barre laterale) — la pastille doit occuper la position MIROIR.
for (const [cle, nom, quoi] of [
    ['pastilleRepos', 'interrupteur', 'pastille au repos du cote du debut de ligne'],
    ['pastilleCoche', 'interrupteur coche', 'pastille glissee vers la fin de ligne'],
]) {
    const b = avec.ltr[cle], a = avec.rtl[cle];
    const attendu = b.rail - b.larg - b.x;   // position miroir exacte
    const ok = Math.abs(a.x - attendu) <= 1;
    noter(nom, quoi, ok,
        'LTR x=' + b.x + ' px   RTL x=' + a.x + ' px   (miroir attendu : ' + attendu + ' px)' +
        (ok ? '' : '\n              => la pastille reste du meme cote qu en francais'), true);
}

// 3. Popovers — retournes veut dire : meme largeur, dans le panneau, ancrage inverse.
for (const [cle, nom] of [['emoji', 'palette emoji'], ['preset', 'popup prereglages']]) {
    const b = avec.ltr[cle], a = avec.rtl[cle];
    const memeLargeur = Math.abs(a.larg - b.larg) <= 1;
    const dedans = a.debut >= -1 && a.fin >= -1;
    const ancrageInverse = Math.abs(a.debut - b.fin) <= 1 && Math.abs(a.fin - b.debut) <= 1;
    const ok = memeLargeur && dedans && ancrageInverse;
    let pourquoi = '';
    if (!memeLargeur) pourquoi = '\n              => ETIRE : ' + b.larg + ' px en francais, ' + a.larg + ' px en hebreu' +
        ' (left et right poses ensemble sur une largeur auto)';
    else if (!ancrageInverse) pourquoi = '\n              => ancre du MEME cote qu en francais, il sort du panneau a la lecture';
    noter(nom, 'meme largeur, ancre du cote oppose', ok,
        'LTR debut ' + b.debut + ' / fin ' + b.fin + ' / larg ' + b.larg +
        '\n              RTL debut ' + a.debut + ' / fin ' + a.fin + ' / larg ' + a.larg + pourquoi, true);
}

// 4. Barre d attente
{
    const memeLeft = avec.ltr.busyLeft === avec.rtl.busyLeft;
    const droitPose = avec.rtl.busyRight !== avec.ltr.busyRight;
    // Sur-contrainte : en RTL c est `left` qui est ignore (etabli par le temoin ci-dessus).
    // Or c est `left` que l animation fait varier => la barre ne bouge plus.
    const fige = moteurOk && memeLeft && droitPose;
    noter('barre d attente', 'balaie dans le sens de lecture', !fige,
        'left LTR ' + avec.ltr.busyLeft + '  /  left RTL ' + avec.rtl.busyLeft +
        '\n              right LTR ' + avec.ltr.busyRight + '  /  right RTL ' + avec.rtl.busyRight +
        (fige ? '\n              => left est anime mais ignore en RTL : la barre reste immobile' : ''), true);
}

console.log('— Piece par piece —');
let ko = 0;
for (const p of pieces) {
    console.log('  ' + (p.ok ? 'ok   ' : 'KO   ') + p.nom.padEnd(20) + p.quoi);
    console.log('       ' + p.detail.replace(/\n/g, '\n       '));
    if (!p.ok) ko++;
}

// ── TEMOIN : le bloc RTL retire, ce qui passait doit tomber ──
// Le temoin n a de sens que pour les pieces DECLAREES SAINES : il verifie qu elles le
// doivent bien a quelque chose. Sur une piece deja fautive il n a rien a dire, et
// l afficher « le correctif mord » serait doublement trompeur — il mord parfois en cassant.
//
// ⚠️ Deux facons legitimes de se retourner, et le temoin doit les distinguer :
//   - une regle [dir="rtl"] dediee  => sans elle, la piece DOIT retomber en francais ;
//   - des proprietes LOGIQUES (inset-inline-start…) => elle se retourne seule, et retirer
//     le bloc RTL ne change rien. C est le cas de la barre d attente depuis qu elle
//     n anime plus `left`. Attendre d elle qu elle « retombe » serait exiger une dette.
console.log('\n— Temoin : les pieces saines le doivent-elles a quelque chose ? —');
let temoinsMuets = 0, temoinsVus = 0, temoinsSansObjet = 0;
const CLES = { 'panneau': ['overlayX', '#wct-overlay['], 'interrupteur': ['pastilleRepos', '.wct-toggle-slider'],
    'interrupteur coche': ['pastilleCoche', '.wct-toggle input:checked'], 'palette emoji': ['emoji', '#wct-emoji-picker'],
    'popup prereglages': ['preset', '#wct-preset-popup'], 'barre d attente': ['busyRight', '.wct-src-busy'] };
for (const p of pieces) {
    const [cle, motif] = CLES[p.nom];
    if (!p.ok) { temoinsSansObjet++; console.log('  --   ' + p.nom.padEnd(20) + 'fautive : rien a temoigner'); continue; }
    const dediee = reglesRtl.some(l => l.includes(motif));
    const j = (v) => JSON.stringify(v);
    const sansChange = j(sans.rtl[cle]) !== j(sans.ltr[cle]);
    if (dediee && !sansChange) { temoinsVus++; console.log('  ok   ' + p.nom.padEnd(20) + 'retombe en francais sans sa regle RTL — elle MORD'); }
    else if (!dediee && sansChange) { temoinsVus++; console.log('  ok   ' + p.nom.padEnd(20) + 'aucune regle RTL dediee : elle se retourne seule (proprietes logiques)'); }
    else if (dediee) { temoinsMuets++; console.log('  ⚠️   ' + p.nom.padEnd(20) + 'a une regle RTL qui ne lui sert a rien — elle se retourne aussi sans'); }
    else { temoinsMuets++; console.log('  ⚠️   ' + p.nom.padEnd(20) + 'ni regle RTL ni retournement propre : le verdict est un hasard'); }
}

console.log('');
if (!moteurOk) {
    console.log('❌ TEMOIN DE MOTEUR MUET : la sur-contrainte ne se constate pas.');
    console.log('   Le verdict sur la barre d attente ne vaut rien.');
    process.exit(2);
}
console.log(ko === 0
    ? 'TOUT PASSE : ' + pieces.length + ' pieces se retournent en hebreu'
    : '❌ ' + ko + ' PIECE(S) SUR ' + pieces.length + ' NE SE RETOURNENT PAS');
process.exit(ko === 0 ? 0 : 1);
