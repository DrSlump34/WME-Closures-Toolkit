// Le BILAN d application est-il reellement defilable une fois deplie ?
//
// POURQUOI CE CONTROLE EXISTE (2026-08-08, v1.11.01)
// Signale par l auteur le jour meme de la 1.11.00 : « le bilan n est pas defilable une fois
// deplie, on ne voit que les 5 premieres lignes ». Le corps portait pourtant max-height ET
// overflow-y:auto — le defaut n etait pas dans le corps, mais dans la CHAINE de conteneurs.
// #wct-overlay est un flex column borne a calc(100vh - 110px) : le bilan y est un item comme
// un autre, donc COMPRIME quand la place manque, et son overflow:hidden — pose pour les coins
// arrondis — coupait alors le bas de la zone defilante, barre de defilement comprise. Le
// contenu etait la, atteignable a la molette, mais nulle part visible.
//
// ⚠️⚠️ LA LECON EST DANS L INSTRUMENT AUTANT QUE DANS LE DEFAUT. La premiere version de cette
// mesure lisait corps.clientHeight et repondait « defilable partout » — elle mesurait ce que
// le corps CROIT afficher, pas ce que son parent en laisse voir. Elle declarait sain
// exactement le defaut qu on lui demandait de trouver. On mesure donc l intersection reelle
// du corps avec son parent.
//
// ⚠️ La hauteur de fenetre fait partie de la mesure : sur un grand ecran l overlay a de la
// place et rien ne se voit. C est en hauteur reduite que le flex comprime.
//
// ⚠️ Temoin de NON-REGRESSION : le correctif rend le bilan increpressible (flex-shrink:0),
// ce qui pourrait pousser la barre d action hors de l overlay — les boutons Appliquer et
// Vider passeraient sous le pli. On aurait deplace le defaut, pas corrige. C est verifie.
//
// ⚠️ Seul autre outil du dossier a demander Chrome, avec check-onglets.js : il mesure des
// pixels. S il ne le trouve pas, il le DIT et sort en erreur.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const SRC = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');
const deb = txt.indexOf('GM_addStyle(`'), fin = txt.indexOf('`);', deb);
if (deb < 0 || fin < 0) { console.error('❌ bloc CSS introuvable — GM_addStyle renomme ou deplace.'); process.exit(2); }
const css = txt.slice(deb + 'GM_addStyle(`'.length, fin);

const LIGNES = 30;
const corpsHtml = Array.from({ length: LIGNES }, (_, i) =>
    `<div class="wct-bilan-l">Travaux nord : 0${(i % 9) + 1}/08/2026 21:00 to 05:00</div>`).join('');

// Deux panneaux : le vrai, et un TEMOIN dont on annule les trois pieces du correctif par du
// style en ligne. Le temoin DOIT etre signale ; s il passe, la mesure ne mesure plus rien.
const panneau = (id, styleBilan, styleCorps) => `
<div id="wct-overlay" class="p" data-cas="${id}" style="display:flex;position:static;margin:0 0 4px">
  <div style="padding:6px;background:#2196f3;color:#fff">WCT</div>
  <div id="wct-body">${Array.from({length:14},(_,i)=>`<p>Carte ${i+1} de la file.</p>`).join('')}</div>
  <div class="wct-bilan b" style="margin:0 10px 4px;${styleBilan}">
    <div class="wct-bilan-hdr"><span style="flex:1">84 applied</span><span class="wct-bilan-chev">&#x25BC;</span></div>
    <div class="wct-bilan-corps c" style="${styleCorps}">${corpsHtml}</div>
  </div>
  <div class="wct-validate-footer" style="display:flex;padding:6px"><button class="wct-btn">Valider</button></div>
  <div id="wct-action-bar-wrap" class="ab" style="padding:6px">Appliquer</div>
</div>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
body { margin:0; font-family:'Rubik','Open Sans',sans-serif; }
${css}
</style></head><body>
${panneau('reel', '', '')}
${panneau('temoin', 'display:block;flex-shrink:1;min-height:auto', 'max-height:170px;flex:none')}
<pre id="sortie"></pre>
<script>
const res = [];
document.querySelectorAll('.p').forEach(p => {
  const bilan = p.querySelector('.b'), corps = p.querySelector('.c');
  const rb = bilan.getBoundingClientRect(), rc = corps.getBoundingClientRect();
  const ov = p.getBoundingClientRect(), ba = p.querySelector('.ab').getBoundingClientRect();
  const visible = Math.max(0, Math.min(rc.bottom, rb.bottom) - rc.top);
  const hL = p.querySelector('.wct-bilan-l').getBoundingClientRect().height || 1;
  res.push([p.dataset.cas, Math.round(rc.height - visible), Math.round(visible / hL),
            (corps.scrollHeight - corps.clientHeight > 2) ? 1 : 0,
            (ba.bottom <= ov.bottom + 1 && ba.top >= ov.top) ? 1 : 0].join('|'));
});
document.getElementById('sortie').textContent = 'RESULTAT>>' + res.join(';') + '<<';
</script></body></html>`;

const page = path.join(os.tmpdir(), 'wct-check-bilan.html');
fs.writeFileSync(page, html, 'utf8');

const CHROMES = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/usr/bin/google-chrome',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];
const chrome = CHROMES.find(p => fs.existsSync(p));
if (!chrome) {
    console.error('❌ MESURE NON FAITE : chrome.exe introuvable — ce controle mesure des pixels.');
    console.error('   Chemins testes :\n   ' + CHROMES.join('\n   '));
    process.exit(2);
}

let ko = 0, temoinVu = 0;
const HAUTEURS = [1080, 900, 800, 700, 620, 520, 460];
console.log('\nBilan deplie : rogne par son parent ? boutons du bas encore visibles ?');
console.log('  fenetre   cas      rogne   lignes vues   defile   boutons');
for (const h of HAUTEURS) {
    let dom;
    try {
        dom = execFileSync(chrome, ['--headless=new','--disable-gpu','--no-sandbox',
            '--virtual-time-budget=3000','--window-size=1280,' + h,
            '--dump-dom','file:///' + page.replace(/\\/g,'/')], { encoding:'utf8', maxBuffer: 64*1024*1024 });
    } catch (e) { console.error('❌ MESURE NON FAITE : Chrome a echoue — ' + e.message); process.exit(2); }
    const m = dom.match(/RESULTAT&gt;&gt;(.*?)&lt;&lt;|RESULTAT>>(.*?)<</s);
    if (!m) { console.error('❌ MESURE NON FAITE : la page ne s est pas executee.'); process.exit(2); }
    for (const l of (m[1] || m[2]).split(';')) {
        const [cas, rogne, vues, defile, boutons] = l.split('|');
        const mauvais = Number(rogne) > 1 || Number(boutons) === 0 || (Number(defile) === 0 && Number(vues) < LIGNES);
        if (cas === 'temoin') { if (mauvais) temoinVu++; }
        else if (mauvais) ko++;
        console.log('  ' + String(h).padEnd(9) + cas.padEnd(9) + (rogne + ' px').padEnd(8) +
            (vues + '/' + LIGNES).padEnd(14) + (Number(defile) ? 'oui' : 'non').padEnd(9) +
            (Number(boutons) ? 'visibles' : 'HORS ECRAN') + (cas === 'temoin' ? '   <- doit etre signale' : ''));
    }
}

console.log('');
if (temoinVu === 0) {
    console.log('❌ TEMOIN NON DETECTE : un bilan volontairement mal contraint est passe pour sain.');
    console.log('   Le verdict rendu sur le vrai panneau ne vaut donc rien.');
    process.exit(2);
}
console.log(ko === 0
    ? 'TOUT PASSE : ' + HAUTEURS.length + ' hauteurs de fenetre, rien de rogne, boutons toujours visibles (temoin detecte ' + temoinVu + '/' + HAUTEURS.length + ')'
    : '❌ ' + ko + ' CAS OU LE BILAN EST COUPE OU POUSSE LES BOUTONS DEHORS');
process.exit(ko === 0 ? 0 : 1);
