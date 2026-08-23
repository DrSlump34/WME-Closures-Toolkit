// La barre de l EN-TETE tient-elle, dans les 8 langues, avec la pastille de mise a jour ?
//
// POURQUOI CE CONTROLE EXISTE (2026-08-23, v1.13.02)
// L en-tete portait TROIS boutons (clavier, reduire, fermer) ; la pastille de mise a jour
// en fait un QUATRIEME, soit 29 px de plus (24 de bouton + 5 de gouttiere) pris a la seule
// chose elastique de la ligne : le titre, qui porte deja le nom du script, le numero de
// version et le compteur de file. Ce compteur est traduit, et l allemand ecrit
// « 999 Eintraege in der Warteschlange » la ou l anglais tient en « 999 entries in queue ».
// ⭐ Ce qu on AJOUTE se paie sur ce qui etait la : la mesure porte donc sur le TITRE, pas
// sur le bouton ajoute — c est le titre qui va se replier ou passer sous les boutons.
//
// COMMENT
// On rejoue le CSS REEL (le bloc passe a GM_addStyle) et le GABARIT REEL de l en-tete,
// extrait du fichier entre <div id="wct-hdr"> et le panneau des raccourcis : la pastille
// mesuree est celle qui est livree, pas une copie qui pourrait en diverger. Les ${t('x')}
// sont remplaces par le dictionnaire, langue par langue.
//
// ⚠️ CHAQUE LANGUE EST MESUREE DEUX FOIS : avec la pastille et sans. Un verdict « ca tient »
// ne dit rien tant qu on ne sait pas combien de marge il restait AVANT. C est l ecart entre
// les deux colonnes qui est le vrai resultat de ce controle.
//
// ⚠️ LA TAILLE DE FENETRE FAIT PARTIE DE LA MESURE (meme raison que check-onglets.js) :
// le panneau fait min(620px, 100vw - 24px) et deux media queries de hauteur font tomber la
// police a 11 px. Mesurer en 800x600 par defaut, c est mesurer le cas le plus favorable.
//
// ⚠️ Besoin de Chrome. S il est introuvable, ce controle le DIT et sort en erreur.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { charger } = require('./lib-dico.js');

const { txt, D } = charger();

// ── CSS reel ──
const deb = txt.indexOf('GM_addStyle(`');
const fin = txt.indexOf('`);', deb);
if (deb < 0 || fin < 0) {
    console.error('❌ bloc CSS introuvable — GM_addStyle a ete renomme ou deplace.');
    process.exit(2);
}
const css = txt.slice(deb + 'GM_addStyle(`'.length, fin);

// ── Gabarit reel de l en-tete ──
const gDeb = txt.indexOf('<div id="wct-hdr">');
const gFin = txt.indexOf('${buildKeysPanel()}', gDeb);
if (gDeb < 0 || gFin < 0) {
    console.error('❌ gabarit de l en-tete introuvable — #wct-hdr ou buildKeysPanel a bouge.');
    process.exit(2);
}
const GABARIT = txt.slice(gDeb, gFin).trim();

// La pastille doit etre DANS le gabarit lu : sans elle, ce controle mesurerait
// l en-tete d avant et rendrait un verdict rassurant sur autre chose.
if (!GABARIT.includes('wct-btn-maj')) {
    console.error('❌ #wct-btn-maj absent du gabarit — il n y a rien a mesurer ici.');
    process.exit(2);
}

const LANGUES = Object.keys(D);
const VERSION_TEST = '1.13.02';
const TEMOIN = 'temoin';

// Rend le gabarit pour une langue. `avec` = pastille visible ou retiree du DOM.
// `badge` = texte du compteur de file (le seul contenu variable de la ligne).
const rendre = (L, avec, badge, titreSup) => {
    let h = GABARIT
        .replace(/\$\{VERSION\}/g, VERSION_TEST)
        .replace(/\$\{t\('([A-Za-z0-9_]+)'\)\}/g, (_, k) => String(D[L] && D[L][k] !== undefined ? D[L][k] : D.en[k]));
    if (avec) h = h.replace('id="wct-btn-maj" style="display:none"', 'id="wct-btn-maj" style="display:flex"');
    else      h = h.replace(/<button class="wct-hdr-btn wct-hdr-maj"[\s\S]*?<\/button>\s*/, '');
    h = h.replace('<span id="wct-hdr-badge"', '<span id="wct-hdr-badge" data-plein="1"')
         .replace(/(<span id="wct-hdr-badge"[^>]*>)(<\/span>)/, '$1' + badge + '$2');
    if (titreSup) h = h.replace('WME Closures Toolkit', 'WME Closures Toolkit ' + titreSup);
    return h;
};

const bloc = (cle, avec, L, badge, titreSup, rtl) => `<div class="mesure" data-cle="${cle}" data-avec="${avec ? 1 : 0}">
  <div id="wct-overlay" class="open" dir="${rtl ? 'rtl' : 'ltr'}" style="position:static;margin-bottom:6px">
    ${rendre(L, avec, badge, titreSup)}
  </div></div>`;

const blocs = [];
for (const L of LANGUES) {
    // Pire cas realiste du compteur : trois chiffres, dans la langue mesuree.
    const badge = String(typeof D[L].queueBadge === 'function' ? D[L].queueBadge(999) : '');
    blocs.push(bloc(L, true, L, badge, '', L === 'he'));
    blocs.push(bloc(L, false, L, badge, '', L === 'he'));
}
// TEMOIN : un titre volontairement demesure. Il DOIT etre signale dans toutes les
// configurations. S il passe pour sain, la mesure ne mesure plus rien et le verdict
// rendu sur les huit langues ne vaut pas davantage.
blocs.push(bloc(TEMOIN, true, 'de', String(D.de.queueBadge(999)),
    'edition speciale anniversaire longue duree pour saturer la ligne', false));

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
body { margin:0; font-family:'Rubik','Open Sans',sans-serif; }
${css}
</style></head><body>
${blocs.join('\n')}
<pre id="sortie"></pre>
<script>
const lignes = [];
document.querySelectorAll('.mesure').forEach(m => {
    const hdr = m.querySelector('#wct-hdr');
    const titre = m.querySelector('.wct-hdr-title');
    const btns = m.querySelector('.wct-hdr-btns');
    const rh = hdr.getBoundingClientRect(), rt = titre.getBoundingClientRect(), rb = btns.getBoundingClientRect();
    // ⚠️ NE PAS surveiller le debordement : le titre est une boite flex COMPRESSIBLE, il ne
    // deborde jamais — il se REPLIE a l interieur, et scrollWidth reste sage. Un premier jet
    // de ce controle ne regardait que le debordement et le chevauchement : il a declare sain
    // un en-tete-temoin volontairement sature, dans les quatre configurations.
    // Ce qui se voit, c est le nombre de lignes que le texte du titre occupe reellement.
    // ⚠️ Un Range sur le CONTENEUR ne convient pas : .wct-hdr-title est un flex
    // align-items:center dont le texte (14 px) et les deux spans (12 px) n ont pas le
    // meme « top » alors qu ils sont sur la MEME ligne. Compter les tops distincts la
    // annoncait « 2 lignes » pour les huit langues, y compris en plein ecran. On mesure
    // donc chaque enfant separement : a l interieur d un noeud, meme fonte, top fiable.
    // Et .wct-hdr-title est en nowrap : le seul repli possible est bien intra-noeud.
    let lignesTitre = 1;
    titre.childNodes.forEach(n => {
        if (n.nodeType === 3 && !n.textContent.trim()) return;
        const p = document.createRange();
        if (n.nodeType === 3) p.selectNode(n); else p.selectNodeContents(n);
        const nb = new Set(Array.from(p.getClientRects())
            .filter(r => r.height > 0 && r.width > 0).map(r => Math.round(r.top))).size;
        if (nb > lignesTitre) lignesTitre = nb;
    });
    // ⚠️ Depuis que le titre est en nowrap + overflow:hidden, le REPLI ne peut plus se
    // produire : le compteur de lignes ci-dessus est devenu un garde-fou (il doit rester,
    // pour voir si la regle disparaissait un jour) et non plus l indicateur. Le mode de
    // defaillance est maintenant la TRONCATURE, et tout l enjeu est de savoir CE QUI est
    // tronque : le compteur de file, c est voulu ; le nom du script ou le numero de
    // version, c est un defaut. On mesure donc si la version reste entierement visible.
    const ver = m.querySelector('.wct-hdr-version');
    const rv = ver.getBoundingClientRect();
    const versionRognee = (rv.left < rt.left - 1 || rv.right > rt.right + 1) ? 1 : 0;
    const rogne = Math.max(0, Math.round(titre.scrollWidth - titre.clientWidth));
    // Ecart reel entre le titre et les boutons, sans arithmetique de padding : positif =
    // place libre, negatif = ils se recouvrent. Valable en LTR comme en RTL.
    const ecart = Math.max(rt.left, rb.left) - Math.min(rt.right, rb.right);
    // Les boutons passent-ils a la ligne ? Un seul « dessus » = une seule rangee.
    const dessus = new Set();
    btns.querySelectorAll('.wct-hdr-btn').forEach(x => dessus.add(Math.round(x.getBoundingClientRect().top)));
    lignes.push([m.dataset.cle, m.dataset.avec, Math.round(rh.width), Math.round(rh.height),
        Math.round(rt.width), Math.round(rb.width), Math.round(ecart),
        lignesTitre, dessus.size, rogne, versionRognee].join('|'));
});
document.getElementById('sortie').textContent = 'RESULTAT>>' + lignes.join(';') + '<<';
</script></body></html>`;

const page = path.join(os.tmpdir(), 'wct-check-entete.html');
fs.writeFileSync(page, html, 'utf8');

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

const CONFIGS = [
    { nom: 'plein ecran (police normale)', taille: '1920,1080' },
    { nom: 'portable haut 900 px',         taille: '1440,900'  },
    { nom: 'ecran court 800 px',           taille: '1366,800'  },
    { nom: 'fenetre etroite 540 px',       taille: '540,900'   },
];

let ko = 0, temoinVu = 0;
// Le compteur de file tronque n est PAS un echec : c est la piece qu on a designee pour
// absorber la compression. Ce qui est un echec, c est perdre le nom du script ou la
// version, replier la ligne, passer sous les boutons, ou empiler les boutons.
const mauvais = r => r.lignesTitre > 1 || r.ecart < 0 || r.rangees > 1 || r.versionRognee === 1;

for (const cfg of CONFIGS) {
    let dom;
    try {
        dom = execFileSync(chrome, ['--headless=new', '--disable-gpu', '--no-sandbox',
            '--virtual-time-budget=3000', '--window-size=' + cfg.taille,
            '--dump-dom', 'file:///' + page.replace(/\\/g, '/')],
            { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    } catch (e) {
        console.error('❌ MESURE NON FAITE : Chrome a echoue — ' + e.message);
        process.exit(2);
    }
    const m = dom.match(/RESULTAT&gt;&gt;(.*?)&lt;&lt;|RESULTAT>>(.*?)<</s);
    if (!m) {
        console.error('❌ MESURE NON FAITE : la page ne s est pas executee (aucun resultat dans le DOM rendu).');
        process.exit(2);
    }
    const par = {};
    for (const ligne of (m[1] || m[2]).split(';')) {
        const [cle, avec, largeur, hauteur, titre, btns, ecart, lignesTitre, rangees, rogne, versionRognee] = ligne.split('|');
        (par[cle] = par[cle] || {})[avec === '1' ? 'avec' : 'sans'] = {
            largeur: +largeur, hauteur: +hauteur, titre: +titre, btns: +btns,
            ecart: +ecart, lignesTitre: +lignesTitre, rangees: +rangees,
            rogne: +rogne, versionRognee: +versionRognee };
    }
    console.log('\n— ' + cfg.nom + ' (' + cfg.taille.replace(',', 'x') + ') —');
    console.log('  langue     entete   titre    place libre  (sans pastille)  cout   verdict');
    for (const cle of Object.keys(par)) {
        const a = par[cle].avec, s = par[cle].sans;
        const verdict = a.ecart < 0 ? 'TITRE SOUS LES BOUTONS (' + (-a.ecart) + ' px)'
            : a.lignesTitre > 1 ? 'TITRE SUR ' + a.lignesTitre + ' LIGNES'
            : a.rangees > 1 ? 'BOUTONS SUR ' + a.rangees + ' RANGEES'
            : a.versionRognee ? 'NUMERO DE VERSION ROGNE'
            : a.rogne > 1 ? 'tient, compteur de file tronque de ' + a.rogne + ' px'
            : 'tient sur une ligne';
        // ⚠️ Un defaut deja present SANS la pastille n est pas cause par elle. Le dire, sinon
        // ce controle ferait porter a l ajout du jour une dette qui lui preexiste — et on
        // corrigerait la mauvaise piece.
        const dejaAvant = s && mauvais(s);
        if (cle === TEMOIN) { if (mauvais(a)) temoinVu++; }
        else if (mauvais(a) && !dejaAvant) ko++;
        console.log('  ' + cle.padEnd(11) + (a.largeur + ' px').padEnd(9) + (a.titre + ' px').padEnd(9) +
            (a.ecart + ' px').padEnd(13) + (s ? s.ecart + ' px' : '—').padEnd(17) +
            (s ? '-' + (s.ecart - a.ecart) + ' px' : '—').padEnd(7) + verdict +
            (dejaAvant ? '   <- DEJA le cas sans la pastille' : '') +
            (cle === TEMOIN ? '   <- temoin, doit etre signale' : ''));
    }
}

console.log('');
if (temoinVu !== CONFIGS.length) {
    console.log('❌ TEMOIN NON DETECTE dans ' + (CONFIGS.length - temoinVu) + ' configuration(s) :');
    console.log('   un en-tete volontairement sature est passe pour sain.');
    console.log('   Le verdict rendu sur les vraies langues ne vaut donc rien.');
    process.exit(2);
}
console.log(ko === 0
    ? 'TOUT PASSE : ' + LANGUES.length + ' langues x ' + CONFIGS.length + ' configurations, en-tete sur une ligne partout (temoin detecte ' + temoinVu + '/' + CONFIGS.length + ')'
    : '❌ ' + ko + ' CAS OU L EN-TETE NE TIENT PAS');
process.exit(ko === 0 ? 0 : 1);
