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
const DETTE = {   // section -> langues encore en anglais, dette anterieure a l ajout de it/he
    h4: ['it', 'he'], h6: ['it', 'he'], h7: ['it', 'he'], h8: ['it', 'he'],
    h9: ['it', 'he'], h10: ['it', 'he'], h11: ['it', 'he'], h12: ['it', 'he'], h13: ['it', 'he'],
};
console.log('\n— Repli silencieux sur l anglais, section par section —');
const idsSections = [...new Set((rendu.en.match(/id="(h\d+)"/g) || []).map(s => s.slice(4, -1)))];
const extrait = (h, id) => { const i2 = h.indexOf('id="' + id + '"'); return i2 < 0 ? null : h.slice(i2, i2 + 900); };
let dettesVues = 0;
for (const id of idsSections) {
    const ref = extrait(rendu.en, id);
    const repli = [];
    for (const L of LANGUES) {
        if (L === 'en') continue;
        const s = extrait(rendu[L], id);
        if (!s) { console.log('  ECHEC ' + id + ' : absente en ' + L); ko++; continue; }
        if (s === ref) repli.push(L);
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

// ⚠️ LE VERDICT DIT CE QUI EST VRAI, PAS CE QUI RASSURE. « AIDE COMPLETE DANS LES 8 LANGUES »
// s affichait meme quand dix sections sur onze rendaient de l anglais a l italien et a
// l hebreu : c est cette phrase-la qui a laisse la dette invisible pendant des versions.
const verdict = ko !== 0 ? ko + ' PROBLEME(S)'
    : dettesVues === 0 ? 'AIDE COMPLETE DANS LES ' + LANGUES.length + ' LANGUES'
    : 'AUCUNE REGRESSION — mais ' + dettesVues + ' section(s) encore en anglais pour it/he';
console.log('\n' + verdict);
process.exit(ko === 0 ? 0 : 1);
