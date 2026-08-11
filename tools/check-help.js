// Rend buildHelpHTML() dans les 8 langues et verifie qu'aucune section ne retombe
// SILENCIEUSEMENT sur l'anglais : _L fait un repli sur `en`, donc une langue oubliee
// ne provoque aucune erreur — elle rend juste de l'anglais sans le dire.
// ⚠️ Extraction via tools/lib-dico.js depuis le 01/08/2026 — voir le commentaire de
// tete de ce module : la copie locale du scanner ne sautait pas les commentaires.
const { charger } = require('./lib-dico.js');
const { txt, D } = charger();
const LANGUES = Object.keys(D);

// Corps de buildHelpHTML
const hDeb = txt.indexOf('const buildHelpHTML = () => {');
const hFin = txt.indexOf('\n};', hDeb);
const corps = txt.slice(txt.indexOf('{', hDeb) + 1, hFin);

let ko = 0;
const rendu = {};
for (const L of LANGUES) {
    const t = (key, ...args) => { const v = D[L][key] ?? D.en[key]; return typeof v === 'function' ? v(...args) : (v ?? key); };
    const _L = obj => obj[L] ?? obj.en;
    let html;
    try { html = new Function('t', '_L', corps)(t, _L); }
    catch (e) { console.log('  ECHEC ' + L + ' : ' + e.message); ko++; continue; }
    rendu[L] = html;
    const sections = (html.match(/data-help="h\d+"/g) || []).length;
    console.log('  ok   ' + L + ' : ' + sections + ' sections, ' + html.length + ' car.');
}

// ⚠️⚠️ AVANT LE 08/08/2026, CE CONTROLE NE REGARDAIT QUE h14. Il annoncait « AIDE COMPLETE
// DANS LES 8 LANGUES » pendant que DIX sections sur onze ne portaient que 6 langues : un
// editeur italien ou israelien lisait l aide en anglais, et rien ne le disait. C est
// exactement la famille de defauts que ce projet connait — un controle qui ne trouve jamais
// rien est indistinguable d un controle casse. Il mesure desormais CHAQUE section.
//
// La dette restante est NOMMEE ci-dessous, section par section, et affichee a chaque
// execution : elle ne peut plus se faire oublier. Ce n est pas une exemption qui eteint le
// controle (le piege `srcSelOff_`) — chaque section est bel et bien testee, et toute section
// hors de cette liste qui retomberait sur l anglais fait ECHOUER le contrôle.
// ⚠️ Liste etablie sur le RENDU, pas sur le source. Un premier audit lu dans le code source
// s etait trompe deux fois : il donnait h5 incomplete (elle est traduite) et ne voyait pas
// h9 ni h10 (elles retombent bel et bien sur l anglais). Seul le croisement des deux
// lectures a departage — et c est le rendu qui fait foi, puisque c est ce que l editeur voit.
// ✅ 11/08/2026 : la dette est SOLDEE — les 14 sections sont ecrites dans les 8 langues.
// La liste reste ici, vide, parce qu elle est le seul endroit ou une dette d aide peut se
// declarer sans faire echouer le controle. Toute section qui retomberait sur l anglais sans
// figurer ici fait desormais ECHOUER ce fichier : c est le comportement voulu.
const DETTE = {};   // section -> langues encore en anglais

// ── DEUXIEME LECTURE : les langues DECLAREES dans le source, section par section ──
// ⚠️ Le rendu seul ne suffit pas a conclure. Une section non traduite dont le corps
// contient une interpolation traduite — h10 porte un ${t('shpNetworkHelp')} — rend un
// texte DIFFERENT de l anglais tout en restant integralement en anglais. Le controle la
// declarait « traduite ». Le source, lui, dit sans ambiguite quelles langues _L connait.
// On garde donc les deux lectures, et TOUT DESACCORD est signale : c est le desaccord
// entre elles qui a revele les trois mensonges successifs de ce fichier.
const declarees = (() => {
    const par = {};
    const parts = corps.split(/\{\s*id:\s*'(h\d+)'/).slice(1);
    for (let i = 0; i < parts.length; i += 2) {
        par[parts[i]] = new Set([...parts[i + 1].matchAll(
            /(?:^|[,{]\s*)('pt-BR'|'pt-PT'|fr|en|de|es|it|he)\s*:\s*`/g)].map(m => m[1].replace(/'/g, '')));
    }
    return par;
})();
console.log('\n— Repli silencieux sur l anglais, section par section —');
const idsSections = [...new Set((rendu.en.match(/id="(h\d+)"/g) || []).map(s => s.slice(4, -1)))];
// ⚠️ On decoupe la section JUSQU A LA SUIVANTE, pas sur une longueur fixe. Une fenetre de
// 900 caracteres debordait sur la section d apres des que la section etait courte, et le
// TITRE de cette suivante — toujours traduit, car il vient de t() et non de _L() — suffisait
// a rendre les deux extraits differents. Le repli passait alors inapercu : h5 (390 car.)
// etait annoncee « traduite dans les 8 langues » alors qu elle n a jamais eu ni it ni he.
// Le controle mentait donc exactement sur les sections les plus courtes.
// ⚠️ On decoupe le CORPS de la section, du id="hN" jusqu au debut de la section suivante.
// Deux decoupages faux ont precede celui-ci, et chacun mentait dans un sens :
//   - une fenetre FIXE de 900 caracteres debordait sur la section d apres des que la
//     section etait courte. Le TITRE de cette suivante est traduit (il vient de t(), pas
//     de _L()), donc les deux extraits differaient et le repli passait inapercu : h5
//     (390 car.) etait annoncee « traduite dans les 8 langues » sans avoir ni it ni he ;
//   - decouper jusqu au prochain id="h" ramenait le titre suivant dans TOUS les cas, et
//     le controle declarait alors les 14 sections traduites.
// Le titre vit dans data-help="hN", AVANT le corps : s arreter au conteneur suivant est
// le seul decoupage qui ne ramene que du texte issu de _L().
const extrait = (h, id) => {
    const i2 = h.indexOf('id="' + id + '"');
    if (i2 < 0) return null;
    const suite = h.indexOf('class="wct-help-section"', i2);
    return h.slice(i2, suite < 0 ? h.length : suite);
};
let dettesVues = 0, desaccords = 0;
for (const id of idsSections) {
    const ref = extrait(rendu.en, id);
    const repli = [], memeRendu = [];
    for (const L of LANGUES) {
        if (L === 'en') continue;
        const s = extrait(rendu[L], id);
        if (!s) { console.log('  ECHEC ' + id + ' : absente en ' + L); ko++; continue; }
        if (s === ref) memeRendu.push(L);
        // Le SOURCE fait foi : une langue absente du _L rend de l anglais, meme si une
        // interpolation traduite fait differer le rendu.
        // ⚠️ Sauf pour une section SANS _L : h1 est batie uniquement avec des t(), donc
        // traduite clef par clef, et le source n a rien a en dire. La reconnaitre au fait
        // qu elle ne declare ni fr ni en — sinon on l accuserait d etre en anglais dans
        // les sept langues, francais compris, ce qui est absurde et le signalerait comme tel.
        const pilotee = declarees[id] && declarees[id].has('fr') && declarees[id].has('en');
        if (pilotee && !declarees[id].has(L)) repli.push(L);
        else if (s === ref) repli.push(L);
    }
    // Desaccord entre les deux lectures : a dire, jamais a taire.
    for (const L of repli) {
        if (!memeRendu.includes(L)) {
            desaccords++;
            console.log('  ⚠️   ' + id.padEnd(4) + L + ' : absente du _L (donc en anglais), mais le rendu differe' +
                ' — la section contient une interpolation traduite qui masque le repli');
        }
    }
    const attendu = DETTE[id] || [];
    const inattendu = repli.filter(L => !attendu.includes(L));
    const reparees = attendu.filter(L => !repli.includes(L));
    if (inattendu.length) { console.log('  ECHEC ' + id.padEnd(4) + ' retombe sur l anglais en : ' + inattendu.join(', ')); ko++; }
    else if (repli.length) { dettesVues++; console.log('  dette ' + id.padEnd(4) + ' en anglais pour : ' + repli.join(', ')); }
    else console.log('  ok   ' + id.padEnd(4) + ' traduite dans les ' + LANGUES.length + ' langues');
    // Une section reparee doit sortir de la liste, sinon la dette affichee ment par exces.
    if (reparees.length) { console.log('  ECHEC ' + id + ' : traduite en ' + reparees.join(', ') + ' — la retirer de DETTE dans ce fichier'); ko++; }
}
if (dettesVues) {
    console.log('\n  ⚠️ ' + dettesVues + ' section(s) d aide encore en anglais pour l italien et l hebreu.');
    console.log('     Dette anterieure a l ajout de ces deux langues, connue et chiffree.');
}

// Aucune section ne doit etre vide, et le compte doit etre le meme partout
console.log('\n— Coherence —');
const comptes = LANGUES.map(L => (rendu[L].match(/data-help="h\d+"/g) || []).length);
const memeCompte = comptes.every(c => c === comptes[0]);
console.log((memeCompte ? '  ok   ' : '  ECHEC ') + 'meme nombre de sections partout (' + comptes.join(', ') + ')');
if (!memeCompte) ko++;
for (const L of LANGUES) {
    const vides = (rendu[L].match(/class="wct-help-body" id="h\d+"[^>]*>\s*<\/div>/g) || []).length;
    if (vides) { console.log('  ECHEC ' + L + ' : ' + vides + ' section(s) vide(s)'); ko++; }
}
if (!LANGUES.some(L => (rendu[L].match(/class="wct-help-body" id="h\d+"[^>]*>\s*<\/div>/g) || []).length)) console.log('  ok   aucune section vide');

// Balises equilibrees. Une aide est du HTML ecrit a la main, langue par langue : un </td>
// oublie ne fait echouer aucun autre controle — le script se charge, les cles sont bonnes,
// les tests passent — et disloque tout le tableau chez le seul editeur qui lit cette
// langue-la. Le cout de la verification est nul, la panne serait invisible d ici.
const BALISES = ['p', 'b', 'i', 'table', 'tr', 'td', 'ul', 'li', 'code', 'span', 'div'];
let desequilibres = 0;
for (const L of LANGUES) {
    const mauvaises = BALISES.filter(b => {
        const ouv = (rendu[L].match(new RegExp('<' + b + '(?=[ >])', 'g')) || []).length;
        const fer = (rendu[L].match(new RegExp('</' + b + '>', 'g')) || []).length;
        return ouv !== fer;
    });
    if (mauvaises.length) {
        console.log('  ECHEC ' + L + ' : balises desequilibrees — ' + mauvaises.join(', '));
        ko++; desequilibres++;
    }
}
if (!desequilibres) console.log('  ok   balises equilibrees dans les ' + LANGUES.length + ' langues');

// ⚠️ LE VERDICT DIT CE QUI EST VRAI, PAS CE QUI RASSURE. « AIDE COMPLETE DANS LES 8 LANGUES »
// s affichait meme quand dix sections sur onze rendaient de l anglais a l italien et a
// l hebreu : c est cette phrase-la qui a laisse la dette invisible pendant des versions.
const verdict = ko !== 0 ? ko + ' PROBLEME(S)'
    : dettesVues === 0 ? 'AIDE COMPLETE DANS LES ' + LANGUES.length + ' LANGUES'
    : 'AUCUNE REGRESSION — mais ' + dettesVues + ' section(s) encore en anglais pour it/he';
console.log('\n' + verdict);
process.exit(ko === 0 ? 0 : 1);
