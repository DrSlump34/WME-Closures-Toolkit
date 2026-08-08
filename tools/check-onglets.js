// La barre des SOUS-ONGLETS de Configurer tient-elle sur une ligne, dans les 8 langues ?
//
// POURQUOI CE CONTROLE EXISTE (2026-08-08, v1.10.00)
// La 1.10.00 ajoute un TROISIEME sous-onglet (« En continu ») dans une colonne qui en
// portait deux et qui ne fait que ~296 px. Aucun des 20 autres outils ne peut voir le
// resultat : ils lisent du texte, pas des pixels. Or les trois defauts partis en
// production avec la 1.07.01 etaient TOUS de rendu, et tous invisibles aux 186 tests.
// Mesure faite avant publication : les trois libelles allemands occupaient 296 px dans
// 296 px disponibles — zero marge. Ils ne debordaient pas ce jour-la, sur cette machine,
// avec cette police de repli ; ils auraient deborde chez le premier editeur dont la
// police rend deux pixels plus large. Un « ca passe » a zero marge n est pas un resultat.
//
// COMMENT
// On rejoue le CSS REEL du script (le bloc passe a GM_addStyle) et la hierarchie DOM
// REELLE — #wct-overlay > #wct-body > .wct-cfg-grid > div > .wct-tabs — puis on laisse
// Chrome calculer. Aucune largeur n est estimee a la main : ni celle de la colonne, ni
// celle du texte. Les libelles viennent du dictionnaire du fichier, via lib-dico.js.
//
// ⚠️ LA TAILLE DE FENETRE FAIT PARTIE DE LA MESURE. En headless par defaut (800x600), les
// media queries (max-height:820px) puis (max-height:680px) sont deja declenchees et la
// police tombe a 11 px : on mesure alors le cas le plus FAVORABLE en croyant tout couvrir.
// D ou le balayage de quatre fenetres, dont un vrai plein ecran.
//
// ⚠️ CE QU ON COMPTE, C EST LE NOMBRE DE LIGNES, pas le debordement. Depuis que .wct-tabs
// porte flex-wrap, un libelle trop large ne deborde plus : il passe a la ligne, et
// scrollWidth reste sage. Un controle qui aurait continue a ne surveiller que le
// debordement n aurait plus jamais rien trouve — sans cesser d afficher « tout va bien ».
//
// ⚠️ Seul outil du dossier qui a besoin de Chrome. S il est introuvable, il le DIT et sort
// en erreur : mieux vaut un controle qui s annonce absent qu un controle silencieux.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { charger } = require('./lib-dico.js');

const { txt, D } = charger();

// ── CSS reel : le contenu du template literal passe a GM_addStyle ──
const deb = txt.indexOf('GM_addStyle(`');
const fin = txt.indexOf('`);', deb);
if (deb < 0 || fin < 0) {
    console.error('❌ bloc CSS introuvable — GM_addStyle a ete renomme ou deplace.');
    process.exit(2);
}
const css = txt.slice(deb + 'GM_addStyle(`'.length, fin);

const LANGUES = Object.keys(D);
// TEMOIN : une neuvieme barre, avec un libelle volontairement enorme. Elle DOIT etre
// signalee. Si elle passe, c est que la mesure ne mesure plus rien — et le verdict
// rassurant des huit autres ne vaut alors pas davantage.
const TEMOIN = 'temoin';

const barre = (cle, libelles) => `<div class="mesure" data-langue="${cle}">
  <div id="wct-overlay" style="display:flex;position:static">
    <div id="wct-body"><div class="wct-cfg-grid"><div>
      <div class="wct-tabs">
        <button class="wct-tab on">${libelles[0]}</button>
        <button class="wct-tab">${libelles[1]}</button>
        <button class="wct-tab">${libelles[2]}</button>
      </div>
    </div><div></div></div></div>
  </div></div>`;

const barres = LANGUES.map(L => {
    const lib = k => String(D[L][k] ?? D.en[k]);
    return barre(L, [lib('tabEachDay'), lib('tabRepeat'), lib('tabCont')]);
}).concat(
    // ⚠️ Le temoin doit deborder dans TOUTES les configurations, la plus large comprise
    // (panneau etroit : la grille repasse a UNE colonne, donc ~482 px). Un premier jet plus
    // court passait pour sain dans cette config-la et le controle l a dit — c est
    // exactement ce qu on lui demande.
    barre(TEMOIN, ['Un libelle volontairement deraisonnable en longueur',
                   'Un deuxieme tout aussi excessif pour la place disponible',
                   'Et un troisieme du meme acabit afin de saturer la barre'])
).join('\n');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
body { margin:0; font-family:'Rubik','Open Sans',sans-serif; }
${css}
</style></head><body>
${barres}
<pre id="sortie"></pre>
<script>
const lignes = [];
document.querySelectorAll('.mesure').forEach(m => {
    const b = m.querySelector('.wct-tabs');
    const colonne = m.querySelector('.wct-cfg-grid > div');
    let large = 0;
    const dessus = new Set();
    b.querySelectorAll('.wct-tab').forEach(x => {
        const r = x.getBoundingClientRect();
        large += r.width + 2;
        dessus.add(Math.round(r.top));
    });
    lignes.push([m.dataset.langue, Math.round(colonne.getBoundingClientRect().width),
        Math.round(large), Math.round(b.scrollWidth), Math.round(b.clientWidth), dessus.size].join('|'));
});
document.getElementById('sortie').textContent = 'RESULTAT>>' + lignes.join(';') + '<<';
</script></body></html>`;

const page = path.join(os.tmpdir(), 'wct-check-onglets.html');
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
    { nom: 'panneau etroit (1 colonne)',   taille: '540,900'   },
];

let ko = 0, temoinVu = 0;
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
    console.log('\n— ' + cfg.nom + ' (' + cfg.taille.replace(',', 'x') + ') —');
    console.log('  langue     colonne   onglets   marge     verdict');
    for (const ligne of (m[1] || m[2]).split(';')) {
        const [L, colonne, onglets, scrollW, clientW, nb] = ligne.split('|');
        const debordement = Number(scrollW) - Number(clientW);
        const marge = Number(colonne) - Number(onglets);
        const mauvais = debordement > 1 || Number(nb) > 1;
        const verdict = debordement > 1 ? 'DEBORDE de ' + debordement + ' px'
            : Number(nb) > 1 ? 'PASSE A LA LIGNE (' + nb + ' lignes)'
            : 'tient sur une ligne';
        if (L === TEMOIN) { if (mauvais) temoinVu++; }
        else if (mauvais) ko++;
        console.log('  ' + L.padEnd(11) + (colonne + ' px').padEnd(10) + (onglets + ' px').padEnd(10) +
            (marge + ' px').padEnd(10) + verdict + (L === TEMOIN ? '   <- temoin, doit etre signale' : ''));
    }
}

console.log('');
if (temoinVu !== CONFIGS.length) {
    console.log('❌ TEMOIN NON DETECTE dans ' + (CONFIGS.length - temoinVu) + ' configuration(s) :');
    console.log('   une barre volontairement trop large est passee pour saine.');
    console.log('   Le verdict rendu sur les vraies langues ne vaut donc rien.');
    process.exit(2);
}
console.log(ko === 0
    ? 'TOUT PASSE : ' + LANGUES.length + ' langues x ' + CONFIGS.length + ' configurations, une seule ligne partout (temoin detecte ' + temoinVu + '/' + CONFIGS.length + ')'
    : '❌ ' + ko + ' CAS OU LES ONGLETS NE TIENNENT PAS');
process.exit(ko === 0 ? 0 : 1);
