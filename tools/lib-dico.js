// Extraction du dictionnaire i18n depuis le fichier REEL — module partage.
//
// Pourquoi il existe (2026-08-01) : check-keys.js, check-help.js, audit.js et
// audit-ortho.js portaient CHACUN sa copie du meme scanner d'accolades. Quatre copies du
// meme code dans un dossier dont le README explique qu'une copie ne prouve rien.
// Et ce scanner etait fragile sur deux points, decouverts en le cassant pour de vrai :
//
//   1. Il ne sautait PAS les commentaires. Un guillemet isole dans un commentaire, une
//      apostrophe francaise (« l'aide »), une accolade dans un exemple : tout faussait le
//      comptage. Pire, `indexOf` trouvait un « const D = { » ecrit dans un COMMENTAIRE
//      avant le vrai dictionnaire — c'est arrive le 01/08, les trois outils sont tombes
//      d'un coup.
//   2. Un guillemet ASCII isole DANS une chaine a apostrophes le faisait partir chercher
//      une fermeture inexistante et avaler le reste du fichier. Le fichier en contenait
//      cinq (des abreviations hebraiques du type ק״מ) qui tenaient par un appariement
//      fortuit : le sixieme a tout casse.
//
// Ce scanner-ci saute les commentaires ET les chaines, dans le bon ordre.
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');

// Le caractere significatif qui precede l'index k (en sautant les blancs).
const precedentUtile = (txt, k) => {
    let j = k - 1;
    while (j >= 0 && /\s/.test(txt[j])) j--;
    return j >= 0 ? txt[j] : '';
};
// Un `/` ouvre-t-il une expression reguliere plutot qu'une division ? Heuristique
// classique : c'est une regex si ce qui precede ne peut pas terminer une expression.
// ⚠️ Indispensable ici : le fichier contient des regex qui portent des guillemets et des
// accolades, par exemple /AUTHORITY\s*\[\s*["']EPSG["']…/ dans _epsgFromPrj. Sans cette
// regle, ces guillemets etaient pris pour des chaines et le scanner partait a la derive —
// il annoncait 3675 lignes pour une fonction qui en fait quatre.
const ouvreUneRegex = (txt, k) => {
    const p = precedentUtile(txt, k);
    return p === '' || '(,=:[!&|?{};+-*%<>~^'.includes(p) || /[\n\r]/.test(p);
};
// Avance d'une position en sautant, s'il y a lieu, un commentaire, une chaine ou une
// regex complete. Rend l'index du caractere SUIVANT la zone sautee, ou -1 si rien.
const sauter = (txt, k) => {
    const c = txt[k], d = txt[k + 1];
    if (c === '/' && d === '/') { const f = txt.indexOf('\n', k); return f < 0 ? txt.length : f; }
    if (c === '/' && d === '*') { const f = txt.indexOf('*/', k + 2); return f < 0 ? txt.length : f + 2; }
    if (c === '`' || c === "'" || c === '"') {
        let j = k + 1;
        while (j < txt.length) {
            if (txt[j] === '\\') { j += 2; continue; }
            if (txt[j] === c) return j + 1;
            j++;
        }
        return txt.length;
    }
    if (c === '/' && ouvreUneRegex(txt, k)) {
        let j = k + 1, classe = false;
        while (j < txt.length) {
            const x = txt[j];
            if (x === '\\') { j += 2; continue; }
            if (x === '\n') return -1;            // pas de regex sur plusieurs lignes : c'etait une division
            if (x === '[') classe = true;
            else if (x === ']') classe = false;
            else if (x === '/' && !classe) { j++; while (j < txt.length && /[a-z]/.test(txt[j])) j++; return j; }
            j++;
        }
        return -1;
    }
    return -1;
};

// Fin du bloc { … } ouvert a l'index `ouvrante`, en ignorant commentaires et chaines.
const finDuBloc = (txt, ouvrante) => {
    let prof = 0;
    for (let k = ouvrante; k < txt.length; k++) {
        const s = sauter(txt, k);
        if (s >= 0) { k = s - 1; continue; }
        if (txt[k] === '{') prof++;
        else if (txt[k] === '}') { prof--; if (prof === 0) return k; }
    }
    return -1;
};

// Trouve une declaration HORS commentaire et hors chaine.
const trouverDeclaration = (txt, decl) => {
    for (let k = 0; k < txt.length; k++) {
        const s = sauter(txt, k);
        if (s >= 0) { k = s - 1; continue; }
        if (txt.startsWith(decl, k)) return k;
    }
    return -1;
};

// Rend { txt, litteral, D } ou sort en erreur avec un message exploitable.
const charger = () => {
    const txt = fs.readFileSync(SRC, 'utf8');
    const decl = trouverDeclaration(txt, 'const D = {');
    if (decl < 0) {
        console.error('❌ dictionnaire introuvable dans ' + SRC);
        console.error('   Sa declaration a du changer : la reporter dans tools/lib-dico.js.');
        process.exit(2);
    }
    const ouvrante = txt.indexOf('{', decl);
    const fin = finDuBloc(txt, ouvrante);
    if (fin < 0) {
        console.error('❌ fin du dictionnaire introuvable (accolades desequilibrees ?)');
        process.exit(2);
    }
    const litteral = txt.slice(ouvrante, fin + 1);
    let D;
    try { D = eval('(' + litteral + ')'); }
    catch (e) { console.error('❌ le dictionnaire ne s evalue pas : ' + e.message); process.exit(2); }
    return { txt, litteral, D, debut: ouvrante, fin };
};

// Extrait le corps d'une fonction declaree `decl`, jusqu'a sa fin equilibree.
const extraireFonction = (txt, decl) => {
    const i = trouverDeclaration(txt, decl);
    if (i < 0) return null;
    const ouvrante = txt.indexOf('{', i);
    const fin = finDuBloc(txt, ouvrante);
    return fin < 0 ? null : txt.slice(i, fin + 1);
};

module.exports = { SRC, charger, finDuBloc, trouverDeclaration, extraireFonction, sauter };
