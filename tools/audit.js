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
// ⚠️ Extraction via tools/lib-dico.js depuis le 01/08/2026 (copie locale supprimee).
const { D, debut: i0, fin: dFin } = require('./lib-dico.js').charger();
const clesFr = Object.keys(D.fr || {});
const horsDico = txt.slice(0, i0) + txt.slice(dFin + 1);
// ⚠️⚠️ CE CONTROLE ETAIT ETEINT EN PERMANENCE, et personne ne s'en doutait puisqu'il
// affichait sagement « aucun ». Le filtre portait un troisieme terme,
// `!horsDico.includes('srcSelOff_')`, QUI NE DEPENDAIT PAS DE LA CLE TESTEE : des que le
// fichier contenait cette chaine quelque part — c'est le cas — il valait false pour
// TOUTES les cles, et la liste ressortait vide a tous les coups.
// Le prefixe srcSelOff_ doit etre exempte parce que ces cles sont construites
// dynamiquement (t('srcSelOff_'+motif)) et donc introuvables par recherche litterale :
// c'est bien la CLE qu'il faut tester, pas le fichier.
R.clesInutilisees = clesFr.filter(k =>
    !k.startsWith('srcSelOff_') &&
    !new RegExp("['\"`]" + k + "['\"`]").test(horsDico) &&
    !horsDico.includes("t('" + k + "'"));
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
// ⚠️⚠️ CE COMPTE ETAIT FAUX, ET IL A SOUTENU UNE DECISION PENDANT DES MOIS.
// Le scanner local ne sautait pas les COMMENTAIRES : une accolade dans un commentaire
// (il y en a partout dans ce fichier, tres commente a dessein) decalait le comptage et
// la fonction paraissait s'etendre jusqu'a la fin d'un bloc bien plus loin. Mesure du
// 01/08/2026 : il annoncait « renderTurnBanner : 2351 lignes » pour une fonction qui en
// fait 29. Un chiffre de ce genre a justifie pendant un an un projet de refonte de
// buildOverlay, mesuree depuis a 397 lignes.
// Il passe desormais par finDuBloc de lib-dico.js, qui saute commentaires ET chaines.
const { finDuBloc } = require('./lib-dico.js');
const fns = [];
const reFn = /^(?:const|function)\s+([\w$]+)\s*=?\s*(?:async\s*)?(?:\([^)]*\)|function)/gm;
while ((m = reFn.exec(txt)) !== null) {
    const debut = m.index;
    const k = txt.indexOf('{', debut);
    if (k < 0) continue;
    const fin = finDuBloc(txt, k);
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
