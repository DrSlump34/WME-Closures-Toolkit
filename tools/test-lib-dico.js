// Tests du scanner partage. Les cas viennent de pannes REELLES du 01/08/2026 :
// c'est en cassant les anciens outils qu'on a decouvert ce qu'ils ne savaient pas faire.
const L = require('./lib-dico.js');

let ok = 0, ko = 0;
const chk = (nom, cond, detail) => {
    if (cond) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + (detail !== undefined ? '  → ' + detail : '')); }
};
// Cherche la fin du bloc ouvert par la premiere accolade du texte.
const fin = (s) => L.finDuBloc(s, s.indexOf('{'));

console.log('\n— Cas de base —');
chk('bloc simple', fin('{a:1}') === 4);
chk('bloc imbrique', fin('{a:{b:2}}') === 8);

console.log('\n— Chaines : les accolades qui y vivent ne comptent pas —');
chk('accolade dans une chaine', fin("{a:'}'}") === 6);
chk('accolade dans un template', fin('{a:`}`}') === 6);
chk('apostrophe echappee', fin("{a:'\\''}") === 7);

console.log('\n— LE CAS QUI A TOUT CASSE : guillemet ASCII isole dans une chaine —');
// Abreviation hebraique du type ק"מ : un seul " a l'interieur d'une chaine a apostrophes.
chk('guillemet isole ne fait pas derailler', fin(`{a:'50 k"m', b:2}`) === 16,
    fin(`{a:'50 k"m', b:2}`));
chk('deux chaines a guillemet isole', fin(`{a:'x"y', b:'z"w'}`) === 17,
    fin(`{a:'x"y', b:'z"w'}`));

console.log('\n— Commentaires : ni leurs accolades ni leurs apostrophes ne comptent —');
chk('accolade en commentaire ligne', fin('{a:1 // }\n}') === 10, fin('{a:1 // }\n}'));
chk('apostrophe francaise en commentaire', fin("{a:1, // l'aide\nb:2}") === 19,
    fin("{a:1, // l'aide\nb:2}"));
chk('accolade en commentaire bloc', fin('{a:1 /* } */ }') === 13, fin('{a:1 /* } */ }'));

console.log('\n— Regex litterales : leurs guillemets et accolades ne comptent pas —');
// Vecu : /AUTHORITY\s*\[\s*["']EPSG["']…/ faisait annoncer 3675 lignes pour une
// fonction qui en fait quatre, parce que les guillemets de la classe etaient pris
// pour une chaine.
chk('guillemets dans une classe de caracteres',
    fin(`{a: x.match(/["']E["']/), b:2}`) === 29, fin(`{a: x.match(/["']E["']/), b:2}`));
chk('accolade dans une regex', fin('{a: /x{2}/, b:2}') === 15, fin('{a: /x{2}/, b:2}'));
chk('slash echappe dans une regex', fin('{a: /a\\/b/, b:2}') === 15, fin('{a: /a\\/b/, b:2}'));
chk('crochet fermant dans une classe', fin('{a: /[\\]}]/, b:2}') === 16, fin('{a: /[\\]}]/, b:2}'));
// Et l'inverse : une DIVISION ne doit pas etre prise pour une regex.
chk('division simple', fin('{a: n / 2, b: m / 3}') === 19, fin('{a: n / 2, b: m / 3}'));

console.log('\n— La declaration cherchee ne doit pas etre trouvee dans un commentaire —');
// Piege vecu : un commentaire qui recopiait « const D = { » mot pour mot faisait
// extraire le COMMENTAIRE au lieu du dictionnaire, et les trois outils tombaient.
const piege = "// exemple : const D = { faux }\nconst D = { vrai:1 };";
chk('declaration en commentaire ignoree', L.trouverDeclaration(piege, 'const D = {') === 32,
    L.trouverDeclaration(piege, 'const D = {'));
const piege2 = "const s = 'const D = { dans une chaine }';\nconst D = { vrai:1 };";
// L'index attendu est calcule et non devine : la vraie declaration suit le saut de ligne.
chk('declaration en chaine ignoree',
    L.trouverDeclaration(piege2, 'const D = {') === piege2.indexOf('\n') + 1,
    L.trouverDeclaration(piege2, 'const D = {'));

console.log('\n— Sur le fichier reel —');
const { D, litteral } = L.charger();
const langues = Object.keys(D);
chk('8 langues chargees', langues.length === 8, langues.join(','));
chk('le litteral commence par une accolade', litteral.startsWith('{'));
chk('le litteral finit par une accolade', litteral.endsWith('}'));
chk('fr contient des cles', Object.keys(D.fr || {}).length > 400, Object.keys(D.fr || {}).length);

console.log('\n' + (ko === 0 ? 'TOUT PASSE' : 'ECHECS') + ' : ' + ok + ' ok, ' + ko + ' ko');
process.exit(ko === 0 ? 0 : 1);
