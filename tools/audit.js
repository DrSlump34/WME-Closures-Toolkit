// Audit automatise de WCT : securite, coherence, dette. Ne remplace pas la lecture,
// mais trouve ce qu'une lecture de 11 000 lignes laisse forcement passer.
const fs = require('fs');
const SRC = require('path').join(__dirname,'..','WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');
const lignes = txt.split('\n');
const noLigne = i => txt.slice(0, i).split('\n').length;
const R = {};

// ── 1. SECURITE : interpolation dans du HTML sans echappement ───────────────
// On ne signale que les interpolations de VARIABLES (pas les appels a t() ni
// escHtml(), ni les valeurs numeriques calculees).
const suspects = [];
const reHtml = /(innerHTML\s*=|insertAdjacentHTML\([^,]+,)\s*`([^`]*)`/gs;
let m;
while ((m = reHtml.exec(txt)) !== null) {
    const corps = m[2];
    const interp = corps.match(/\$\{[^}]+\}/g) || [];
    for (const it of interp) {
        const inner = it.slice(2, -1).trim();
        if (/^(escHtml|t)\(/.test(inner)) continue;             // deja echappe / traduit
        if (/^[\d\s+\-*/().]+$/.test(inner)) continue;           // arithmetique
        if (/\.(length|size|idx|id)\b/.test(inner) && !/name|label|reason|desc|text|nom/i.test(inner)) continue;
        if (/^_?[A-Za-z_$][\w$]*\s*\?\s*['"`]/.test(inner)) continue;  // ternaire de style
        if (/(Style|style|color|width|display|px|CSS|\?\s*'')/.test(inner)) continue;
        suspects.push(noLigne(m.index) + ' : ' + inner.slice(0, 70));
    }
}
R.htmlNonEchappe = suspects;

// ── 2. Cles i18n definies mais jamais utilisees ─────────────────────────────
const dDeb = txt.indexOf('const D = {');
let i0 = txt.indexOf('{', dDeb), prof = 0, dFin = -1;
for (let k = i0; k < txt.length; k++) {
    const c = txt[k];
    if (c === '{') prof++;
    else if (c === '}') { prof--; if (prof === 0) { dFin = k; break; } }
    else if (c === '`' || c === "'" || c === '"') { const q = c; k++; while (k < txt.length && txt[k] !== q) { if (txt[k] === '\\') k++; k++; } }
}
const litteral = txt.slice(i0, dFin + 1);
const D = eval('(' + litteral + ')');
const clesFr = Object.keys(D.fr || {});
const horsDico = txt.slice(0, dDeb) + txt.slice(dFin + 1);
R.clesInutilisees = clesFr.filter(k => !new RegExp("['\"`]" + k + "['\"`]").test(horsDico) && !horsDico.includes("t('" + k + "'") && !horsDico.includes('srcSelOff_'));
// Cles appelees mais absentes du dictionnaire
const appelees = [...horsDico.matchAll(/\bt\(\s*'([A-Za-z0-9_]+)'/g)].map(x => x[1]);
R.clesManquantes = [...new Set(appelees.filter(k => !clesFr.includes(k)))];

// ── 3. Identifiants HTML en double ─────────────────────────────────────────
const ids = [...txt.matchAll(/\bid="(wct-[\w-]+)"/g)].map(x => x[1]);
const compte = {};
ids.forEach(x => compte[x] = (compte[x] || 0) + 1);
R.idsEnDouble = Object.entries(compte).filter(([, n]) => n > 1).map(([k, n]) => k + ' x' + n);

// ── 4. try/catch qui avalent tout en silence ───────────────────────────────
R.catchMuets = (txt.match(/catch\s*\([\w$]*\)\s*\{\s*\}/g) || []).length;

// ── 5. Restes de mise au point ─────────────────────────────────────────────
R.todo = [...txt.matchAll(/\b(TODO|FIXME|XXX|HACK)\b/g)].map(x => noLigne(x.index) + ' ' + x[1]);
R.consoleLog = [...txt.matchAll(/console\.(log|warn|error)\(/g)].map(x => noLigne(x.index));

// ── 6. Minuteries et boucles ───────────────────────────────────────────────
R.setInterval = [...txt.matchAll(/setInterval\(/g)].map(x => noLigne(x.index));

// ── 7. Fonctions les plus longues (dette de lisibilite) ────────────────────
const fns = [];
const reFn = /^(?:const|function)\s+([\w$]+)\s*=?\s*(?:async\s*)?(?:\([^)]*\)|function)/gm;
while ((m = reFn.exec(txt)) !== null) {
    const debut = m.index;
    let p = 0, k = txt.indexOf('{', debut), fin = -1;
    if (k < 0) continue;
    for (let z = k; z < txt.length && z < k + 400000; z++) {
        const c = txt[z];
        if (c === '{') p++;
        else if (c === '}') { p--; if (p === 0) { fin = z; break; } }
        else if (c === '`' || c === "'" || c === '"') { const q = c; z++; while (z < txt.length && txt[z] !== q) { if (txt[z] === '\\') z++; z++; } }
    }
    if (fin > 0) fns.push({ nom: m[1], lignes: txt.slice(debut, fin).split('\n').length, ligne: noLigne(debut) });
}
R.fonctionsLongues = fns.sort((a, b) => b.lignes - a.lignes).slice(0, 8).map(f => f.nom + ' : ' + f.lignes + ' l. (L' + f.ligne + ')');

// ── 8. Reseau : domaines contactes vs @connect declares ────────────────────
const connect = [...txt.matchAll(/@connect\s+(\S+)/g)].map(x => x[1]);
const hotes = [...new Set([...txt.matchAll(/https?:\/\/([a-z0-9.-]+)/gi)].map(x => x[1].toLowerCase()))];
R.connectDeclares = connect;
R.hotesCites = hotes;

// ── 9. Taille et commentaires ──────────────────────────────────────────────
const nCom = lignes.filter(l => /^\s*(\/\/|\*|\/\*)/.test(l)).length;
R.taille = { lignes: lignes.length, ko: Math.round(txt.length / 1024), commentaires: nCom,
             tauxCommentaires: Math.round(nCom * 100 / lignes.length) + ' %' };

for (const [k, v] of Object.entries(R)) {
    const val = Array.isArray(v) ? (v.length ? v.length + ' → ' + v.slice(0, 12).join(' | ') : 'aucun') : JSON.stringify(v);
    console.log('\n### ' + k + '\n' + val);
}
