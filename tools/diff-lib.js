// Montre CE QUI diverge entre la copie embarquee de WMEPrefs et la source.
// « Ecart de N caracteres » ne dit pas si c'est une version ancienne ou une
// modification locale — et la reponse change ce qu'il faut faire.
//   node diff-lib.js <userscript>
const fs = require('fs'), path = require('path');
const cible = process.argv[2] ? path.resolve(process.cwd(), process.argv[2])
                              : path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const LIB = path.join(__dirname, '..', '..', 'WME-Prefs', 'WMEPrefs.js');

const extraire = (txt) => {
    const i = txt.indexOf('var WMEPrefs = (function');
    if (i < 0) return null;
    let prof = 0, q = null;
    for (let k = i; k < txt.length; k++) {
        const c = txt[k];
        if (q) { if (c === '\\') k++; else if (c === q) q = null; continue; }
        if (c === '`' || c === "'" || c === '"') { q = c; continue; }
        if (c === '/' && txt[k+1] === '/') { k = txt.indexOf('\n', k); if (k < 0) break; continue; }
        if (c === '/' && txt[k+1] === '*') { k = txt.indexOf('*/', k) + 1; continue; }
        if (c === '{' || c === '(') prof++;
        else if (c === '}' || c === ')') { prof--; if (prof === 0) { const f = txt.indexOf(';', k); return txt.slice(i, f + 1); } }
    }
    return null;
};
const norm = s => s.replace(/\r\n/g, '\n').trim().split('\n');
const a = norm(extraire(fs.readFileSync(cible, 'utf8')) || '');
const b = norm(extraire(fs.readFileSync(LIB, 'utf8')) || '');
console.log('copie  : ' + path.basename(cible) + '  (' + a.length + ' lignes)');
console.log('source : WMEPrefs.js  (' + b.length + ' lignes)\n');

const setA = new Set(a.map(l => l.trim())), setB = new Set(b.map(l => l.trim()));
const manqueDansCopie = b.filter(l => l.trim() && !setA.has(l.trim()));
const enPlusDansCopie = a.filter(l => l.trim() && !setB.has(l.trim()));
console.log('--- présent dans la SOURCE, absent de la copie (' + manqueDansCopie.length + ') ---');
manqueDansCopie.slice(0, 25).forEach(l => console.log('  - ' + l.trim().slice(0, 100)));
console.log('\n--- présent dans la COPIE, absent de la source (' + enPlusDansCopie.length + ') ---');
enPlusDansCopie.slice(0, 25).forEach(l => console.log('  + ' + l.trim().slice(0, 100)));
console.log('\nVerdict : ' + (manqueDansCopie.length && !enPlusDansCopie.length
    ? 'la copie est une version ANCIENNE — la remettre à jour depuis la source'
    : enPlusDansCopie.length && !manqueDansCopie.length
    ? 'la copie a été MODIFIÉE localement — reporter dans la source, sinon la modif sera perdue'
    : manqueDansCopie.length ? 'les deux ont divergé — arbitrer manuellement' : 'identiques'));
