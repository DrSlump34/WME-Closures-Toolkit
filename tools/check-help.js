// Rend buildHelpHTML() dans les 8 langues et verifie qu'aucune section ne retombe
// SILENCIEUSEMENT sur l'anglais : _L fait un repli sur `en`, donc une langue oubliee
// ne provoque aucune erreur — elle rend juste de l'anglais sans le dire.
const fs = require('fs');
const SRC = require('path').join(__dirname,'..','WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');

// Litteral du dictionnaire
const dDeb = txt.indexOf('const D = {');
let i = txt.indexOf('{', dDeb), prof = 0, dFin = -1;
for (let k = i; k < txt.length; k++) {
    const c = txt[k];
    if (c === '{') prof++;
    else if (c === '}') { prof--; if (prof === 0) { dFin = k; break; } }
    else if (c === '`' || c === "'" || c === '"') { const q = c; k++; while (k < txt.length && txt[k] !== q) { if (txt[k] === '\\') k++; k++; } }
}
const D = eval('(' + txt.slice(i, dFin + 1) + ')');
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

// h14 doit exister partout ET differer de l'anglais dans chaque langue
console.log('\n— Section h14 (Zone) —');
const extraitH14 = h => { const i2 = h.indexOf('id="h14"'); return i2 < 0 ? null : h.slice(i2, i2 + 900); };
const refEn = extraitH14(rendu.en);
for (const L of LANGUES) {
    const s = extraitH14(rendu[L]);
    if (!s) { console.log('  ECHEC ' + L + ' : h14 absente'); ko++; continue; }
    if (L !== 'en' && s === refEn) { console.log('  ECHEC ' + L + ' : h14 retombe sur l anglais'); ko++; continue; }
    console.log('  ok   ' + L + ' : h14 traduite (' + s.length + ' car. echantillonnes)');
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

console.log('\n' + (ko === 0 ? 'AIDE COMPLETE DANS LES 8 LANGUES' : ko + ' PROBLEME(S)'));
process.exit(ko === 0 ? 0 : 1);
