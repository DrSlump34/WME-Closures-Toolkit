// Ne aprés le bug 0.97.01 : l onglet Import ne reagissait a AUCUN fichier.
//
// Cause : `const _impNomType = (t) => t === 'csv' ? t('impTypeCsv') : ...` — le
// parametre masquait la fonction de traduction globale `t()`. Des qu un fichier
// etait RECONNU, l appel levait un TypeError, hors du try/catch, dans une promesse
// que personne n attendait : aucun message, aucun toast, rien. Un fichier NON
// reconnu, lui, s arretait avant et affichait bien son erreur — d ou un symptome
// trompeur (« ca ne reagit pas »).
//
// Ce test verifie deux choses :
//   1. dynamiquement, que _impNomType rend bien un libelle pour chaque type ;
//   2. statiquement, que PLUS AUCUNE fonction du fichier ne lie `t` tout en
//      appelant la traduction `t(...)` dans son corps.
// Le point 2 est le vrai filet : le meme piege peut renaitre n importe ou.
const fs = require('fs');
const path = require('path');

// Un chemin peut etre passe en argument (sert a verifier que ce test ROUGIT bien
// quand on lui soumet un fichier ou le bug est present).
const SRC = process.argv[2]
    ? path.resolve(process.cwd(), process.argv[2])
    : path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');
const lignes = txt.split('\n');
let ok = 0, ko = 0;
const chk = (nom, cond, detail) => {
    if (cond) { ok++; console.log('  ok   ' + nom + (detail ? '  → ' + detail : '')); }
    else { ko++; console.log('  ECHEC ' + nom + (detail ? '  → ' + detail : '')); }
};

// ─── 1. _impNomType rend un libelle pour chaque type ─────────────────────────
console.log('\n— Libelle du type reconnu —');
const m = txt.match(/const _impNomType = [\s\S]*?;\n/);
if (!m) { console.log('  ECHEC _impNomType introuvable'); ko++; }
else {
    const t = (k) => 'TRAD:' + k;   // la vraie fonction de traduction, en portee
    let f = null;
    try { f = new Function('t', 'return (' + m[0].replace(/^const _impNomType = /, '').replace(/;\s*$/, '') + ')')(t); }
    catch (e) { console.log('  ECHEC _impNomType ne s evalue pas : ' + e.message); ko++; }
    if (f) for (const [type, attendu] of [['csv','TRAD:impTypeCsv'], ['trace','TRAD:impTypeTrace'],
                                          ['zone','TRAD:impTypeZone'], ['prefs','TRAD:impTypePrefs'], ['xxx','?']]) {
        let r;
        try { r = f(type); } catch (e) { r = 'PLANTE: ' + e.message; }
        chk('type ' + type, r === attendu, r);
    }
}

// ─── 2. Personne ne masque plus la fonction de traduction ────────────────────
// Une liaison de `t` (parametre ou variable locale) est tolerable TANT QUE le corps
// n appelle pas la traduction. Des que les deux coexistent, c est le bug.
console.log('\n— Masquage de la fonction de traduction t() —');
const LIAISON = [
    /^\s*const\s+t\s*=/,            // const t = ...
    /^\s*let\s+t\s*=/,
    /^\s*var\s+t\s*=/,
    /=\s*\(\s*t\s*[,)]/,            // = (t) => ... / = (t, x) => ...
    /=\s*t\s*=>/,                   // = t => ...
    /function\s*\w*\s*\(\s*t\s*[,)]/,
];
const APPEL_TRAD = /(^|[^\w.$])t\s*\(/;   // t( ... ) mais pas .test( ni escHtml(
const DECL_GLOBALE = /^const t = \(key, \.\.\.args\)/;   // la vraie, ligne ~1087

const coupables = [];
for (let i = 0; i < lignes.length; i++) {
    const l = lignes[i];
    if (DECL_GLOBALE.test(l)) continue;
    if (!LIAISON.some(re => re.test(l))) continue;
    // Portee approximative : jusqu au retour a une indentation <= celle de la liaison,
    // 250 lignes au maximum (large : les fonctions du fichier sont parfois enormes).
    const ind = (l.match(/^\s*/) || [''])[0].length;
    let fin = Math.min(i + 250, lignes.length);
    for (let k = i + 1; k < fin; k++) {
        const ik = (lignes[k].match(/^\s*/) || [''])[0].length;
        if (lignes[k].trim() && ik <= ind && /^[\s]*[})]/.test(lignes[k])) { fin = k + 1; break; }
    }
    for (let k = i; k < fin; k++) {
        // On ignore les commentaires : le piege est dans le code execute.
        const code = lignes[k].replace(/\/\/.*$/, '');
        if (APPEL_TRAD.test(code)) { coupables.push((i + 1) + ' : ' + l.trim().slice(0, 90)); break; }
    }
}
chk('aucune portee ne lie `t` tout en appelant t()', coupables.length === 0,
    coupables.length ? '\n         ' + coupables.join('\n         ') : 'fichier propre');

// ─── 3. Le chemin d import ne perd plus les exceptions ───────────────────────
// Regle maison : ne jamais echouer en silence. _impFichiers est appele par des
// ecouteurs (clic, depot) — sans try/catch, une exception meurt dans une promesse.
console.log('\n— Filet du point d entree —');
const impF = txt.match(/const _impFichiers = async[\s\S]{0,400}?\n};/);
chk('_impFichiers existe', !!impF);
if (impF) {
    chk('_impFichiers attrape les exceptions', /catch\s*\(/.test(impF[0]));
    chk('et le fait savoir (pas de catch muet)', /_impEchec|showToast|_impLog/.test(impF[0]));
}
// Un plantage ne doit pas etre annonce comme un « format non reconnu ».
chk('message d echec distinct du format non reconnu', /impErreur/.test(txt));

// ─── 4. L import d une zone lit le fichier ENTIER ────────────────────────────
// _impLire ne rend qu un prelevement de 200 ko, suffisant pour RECONNAITRE mais pas
// pour importer : un KML de zone au trace fin arriverait tronque.
console.log('\n— Import de zone : fichier entier —');
chk('la branche zone ne reutilise pas le prelevement de detection',
    /type === 'zone'[\s\S]{0,120}_polyImportTexte\(await _impLireTout\(f\)\)/.test(txt));

console.log('\n' + (ko ? 'ECHECS : ' + ko : 'TOUT PASSE') + ' : ' + ok + ' ok, ' + ko + ' ko\n');
process.exit(ko ? 1 : 0);
