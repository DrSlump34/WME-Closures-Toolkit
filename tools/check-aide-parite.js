// Une section d'aide est-elle restee sur un ANCIEN texte dans une langue ?
//
// POURQUOI CE CONTROLE EXISTE (2026-09-23, v1.19.02) : check-help.js detecte le repli
// silencieux sur l'anglais, mais pas une traduction PERIMEE. La section h4 (onglet Import)
// avait ete reecrite en fr/en/it/he lors de l'import unifie ; en de/es/pt-BR/pt-PT elle
// decrivait encore l'ancien onglet « CSV directement dans la file » — sans tracés, zones
// ni preferences. Personne ne l'avait vu : chaque langue etait complete, juste fausse.
// Le signal le plus simple d'un texte perime est sa LONGUEUR : 0,35 a 0,38 du francais.
//
// Seuils : l'hebreu s'ecrit sans voyelles, il pese ~0,7 du francais partout — on lui
// laisse un seuil plus bas. Le temoin (plus bas) verifie que le controle MORD.
const fs = require('fs');
const path = require('path');
const SRC = process.argv[2] || path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');

const LG = ['fr', 'en', 'it', 'he', 'de', 'es', "'pt-BR'", "'pt-PT'"];
const BAS = { he: 0.5 }, BAS_DEFAUT = 0.7, HAUT = 1.5;
const decoder = t => t.replace(/\\u([0-9A-Fa-f]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
const texte = t => decoder(t).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const analyser = (src) => {
    const i = src.indexOf('const buildHelpHTML'); const j = src.indexOf('\n};', i);
    if (i < 0 || j < 0) { console.error('❌ buildHelpHTML introuvable'); process.exit(2); }
    const h = src.slice(i, j);
    const re = /\{ id:'(h\d+)',[\s\S]*?body: _L\(\{([\s\S]*?)\}\) \}/g;
    const suspects = []; let n = 0, m;
    while ((m = re.exec(h))) {
        n++;
        const L = {};
        for (const lg of LG) {
            const k = new RegExp(lg.replace(/[-']/g, c => '\\' + c) + ':`([\\s\\S]*?)`').exec(m[2]);
            L[lg] = k ? texte(k[1]).length : 0;
        }
        for (const lg of LG.slice(1)) {
            const r = L[lg] / (L.fr || 1), nom = lg.replace(/'/g, '');
            if (r < (BAS[nom] ?? BAS_DEFAUT) || r > HAUT) suspects.push(`${m[1]} ${nom} : ${r.toFixed(2)} du francais`);
        }
    }
    return { n, suspects };
};

const r = analyser(txt);
console.log(`Sections analysees : ${r.n}`);
r.suspects.forEach(s => console.log('  SUSPECT ' + s));

// Temoin : une copie ou la h4 allemande est reduite a sa premiere phrase doit etre signalee.
const tronque = txt.replace(/(\{ id:'h4',[\s\S]*?de:`)([\s\S]*?)(`)/, (_, a, b, c) => a + b.slice(0, 120) + c);
const t = analyser(tronque);
const mord = t.suspects.some(s => s.startsWith('h4 de'));
console.log(mord ? '  ok   temoin : une h4 allemande tronquee est bien signalee'
                 : '  ECHEC temoin : une h4 allemande tronquee passe inapercue');

const ko = r.suspects.length > 0 || !mord || r.n < 10;
console.log(ko ? `❌ ${r.suspects.length} section(s) suspecte(s)` : '✅ TOUT PASSE : aucune traduction d aide visiblement perimee');
process.exit(ko ? 1 : 0);
