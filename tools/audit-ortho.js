// Controle orthographique des TEXTES AFFICHES (le dictionnaire), pas des commentaires.
// Cherche les fautes qui se voient : accents manquants, doubles espaces, espaces avant
// une ponctuation double sans insecable, apostrophes droites.
const fs = require('fs');
const txt = fs.readFileSync(require('path').join(__dirname,'..','WME_ClosuresToolkit.user.js'), 'utf8');
const d0 = txt.indexOf('const D = {');
let i = txt.indexOf('{', d0), p = 0, fin = -1;
for (let k = i; k < txt.length; k++) {
    const c = txt[k];
    if (c === '{') p++;
    else if (c === '}') { p--; if (p === 0) { fin = k; break; } }
    else if (c === '`' || c === "'" || c === '"') { const q = c; k++; while (k < txt.length && txt[k] !== q) { if (txt[k] === '\\') k++; k++; } }
}
const D = eval('(' + txt.slice(i, fin + 1) + ')');

const rendre = v => { try { return typeof v === 'function' ? String(v(1, 2, 3)) : String(v ?? ''); } catch (e) { return ''; } };
const pbs = { accents: [], doubleEspace: [], apostropheDroite: [], ponctuation: [], majuscule: [] };
const SANS_ACCENT = /\b(deja|tres|apres|etre|meme|creer|generer|selectionner|fermetures?\b(?=[^\n]*\bdeja)|periode|duree|evenement|zone tracee|prereglages?|resultats?|numero|donnee|verifier|reglage)\b/i;

for (const [cle, val] of Object.entries(D.fr || {})) {
    const s = rendre(val);
    if (!s) continue;
    const nu = s.replace(/<[^>]+>/g, '');                       // sans balises
    if (SANS_ACCENT.test(nu)) pbs.accents.push(cle + ' : ' + nu.slice(0, 60));
    if (/[^\s]  +[^\s]/.test(nu)) pbs.doubleEspace.push(cle + ' : ' + nu.slice(0, 60));
    if (/\w'\w/.test(nu)) pbs.apostropheDroite.push(cle + ' : ' + nu.slice(0, 60));
    // En francais, « : ; ! ? » veulent une espace INSECABLE devant
    if (/[^\s\u00A0\u202F][:;!?](\s|$)/.test(nu.replace(/https?:\/\/\S+/g, '')) && /[:;!?]/.test(nu))
        pbs.ponctuation.push(cle + ' : ' + nu.slice(0, 60));
}
for (const [k, v] of Object.entries(pbs)) {
    console.log('\n### ' + k + ' (' + v.length + ')');
    v.slice(0, 14).forEach(x => console.log('   ' + x));
}
