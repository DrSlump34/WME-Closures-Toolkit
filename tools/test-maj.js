// La pastille de mise a jour dit-elle la verite ? — _majCmp et la lecture du bloc
// @version, EXTRAITS DU FICHIER REEL (methode poly-core.js : jamais une copie).
//
// POURQUOI CE TEST EXISTE (2026-08-23, v1.13.02)
// La pastille rouge de l en-tete envoie l editeur reinstaller le script. Elle repose sur
// deux pieces qu aucun autre outil ne regarde : la comparaison de deux numeros de version,
// et la lecture du @version dans le fichier .meta.js de GreasyFork.
// ⚠️ La comparaison est le genre de code qu on relit sans rien voir : compare des CHAINES
// et '1.9.00' devient plus recent que '1.13.01' — vrai dans l alphabet, faux en versions.
// Le script publie 8 versions en 1.9.xx a 1.13.xx : le cas n a rien de theorique.
// Une pastille qui se trompe dans ce sens-la reste ETEINTE alors qu une version est sortie,
// et personne ne s en apercoit — c est la panne silencieuse, celle qui ne se signale pas.
// Dans l autre sens elle s allume en permanence sur un script deja a jour, et l editeur
// cesse de la croire.
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');

const DEBUT = 'const _majCmp = (a, b) => {';
const i = txt.indexOf(DEBUT);
if (i < 0) {
    console.error('❌ _majCmp introuvable dans ' + SRC);
    console.error('   Renommee ou supprimee : le reporter ici, sinon ce test ne prouve plus rien.');
    process.exit(2);
}
const j = txt.indexOf('\n};', i);
if (j < 0) { console.error('❌ fin de _majCmp introuvable'); process.exit(2); }
const code = txt.slice(i, j + 3);

let _majCmp;
try { _majCmp = new Function(code + '\nreturn _majCmp;')(); }
catch (e) { console.error('❌ _majCmp ne s evalue pas : ' + e.message); process.exit(2); }

// Le garde-fou de format et le motif de lecture du @version viennent eux aussi du fichier.
const mRe = txt.match(/const _VER_RE\s*=\s*(\/.*?\/)\s*;/);
if (!mRe) { console.error('❌ _VER_RE introuvable — le garde-fou de format a disparu.'); process.exit(2); }
const VER_RE = new Function('return ' + mRe[1])();

const mLit = txt.match(/\.match\((\/\^\\\/\\\/.*?@version.*?\/m)\)/);
if (!mLit) { console.error('❌ le motif de lecture du @version introuvable dans _majVerifier.'); process.exit(2); }
const VERSION_RE = new Function('return ' + mLit[1])();

let ok = 0, ko = 0;
const chk = (nom, obtenu, attendu) => {
    if (obtenu === attendu) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + '  → attendu ' + JSON.stringify(attendu) + ', obtenu ' + JSON.stringify(obtenu)); }
};

console.log('\n— Comparaison de versions —');
chk('1.13.01 est plus recent que 1.13.00', _majCmp('1.13.00', '1.13.01'), -1);
chk('1.13.00 est plus ancien que 1.13.01', _majCmp('1.13.01', '1.13.00'), 1);
chk('deux fois la meme version', _majCmp('1.13.01', '1.13.01'), 0);
// Le piege alphabetique, celui pour lequel ce test existe.
chk('1.13.01 bat 1.9.00 (et non l inverse)', _majCmp('1.9.00', '1.13.01'), -1);
chk('1.9.00 ne bat pas 1.13.01', _majCmp('1.13.01', '1.9.00'), 1);
chk('2.0.00 bat 1.99.99', _majCmp('1.99.99', '2.0.00'), -1);
// Segments manquants : '1.14' et '1.14.00' doivent etre LA MEME version, sinon la
// pastille s allumerait sur une publication qui aurait juste omis un zero.
chk('1.14 vaut 1.14.00', _majCmp('1.14', '1.14.00'), 0);
chk('1.14.00 vaut 1.14', _majCmp('1.14.00', '1.14'), 0);
chk('1.14.01 bat 1.14', _majCmp('1.14', '1.14.01'), -1);
// Zeros de tete : 1.13.01 et 1.13.1 sont le meme numero.
chk('1.13.01 vaut 1.13.1', _majCmp('1.13.01', '1.13.1'), 0);

console.log('\n— Format refuse : la pastille doit rester eteinte —');
chk('version locale inconnue (GM_info absent)', VER_RE.test('?'), false);
chk('chaine vide', VER_RE.test(''), false);
chk('suffixe de pre-publication', VER_RE.test('1.13.01-beta'), false);
chk('page HTML rendue au lieu du meta.js', VER_RE.test('<!doctype html>'), false);
chk('1.13.01 accepte', VER_RE.test('1.13.01'), true);
chk('2 accepte', VER_RE.test('2'), true);

console.log('\n— Lecture du @version dans un bloc de metadonnees —');
const META = '// ==UserScript==\n// @name         WME Closures Toolkit\n' +
             '// @namespace    http://tampermonkey.net/\n// @version      1.14.00\n' +
             '// @description  ...\n// ==/UserScript==\n';
const m1 = META.match(VERSION_RE);
chk('la version est lue', m1 && m1[1], '1.14.00');
// ⚠️ TEMOIN : le motif doit s ancrer en DEBUT DE LIGNE. Sans le ^ et le drapeau m, une
// description contenant les mots « @version » suffirait a fabriquer un numero.
const PIEGE = '// ==UserScript==\n// @description  voir @version 9.99.99 dans le journal\n' +
              '// @version      1.14.00\n// ==/UserScript==\n';
const m2 = PIEGE.match(VERSION_RE);
chk('temoin : un @version cite dans une description ne trompe pas', m2 && m2[1], '1.14.00');
// ⚠️ TEMOIN : aucune ligne @version du tout. Le code doit rendre null, pas inventer.
chk('temoin : bloc sans @version', '// ==UserScript==\n// @name X\n'.match(VERSION_RE), null);

console.log('\n— Enchainement complet : ce que verra l editeur —');
// installee, publiee, pastille attendue
const CAS = [
    ['1.13.01', '1.13.00', false, 'publiee plus ancienne (1.13.01 poussee non publiee)'],
    ['1.13.00', '1.13.01', true,  'une version est sortie'],
    ['1.13.02', '1.13.02', false, 'a jour'],
    ['1.9.00',  '1.13.01', true,  'huit versions de retard, piege alphabetique'],
    ['?',       '1.14.00', false, 'version locale illisible : on n allume pas'],
    ['1.13.02', 'blabla',  false, 'reponse illisible : on n allume pas'],
];
for (const [locale, publiee, attendu, quoi] of CAS) {
    const allume = VER_RE.test(locale) && VER_RE.test(publiee) && _majCmp(locale, publiee) < 0;
    chk('v' + locale + ' vs v' + publiee + ' → ' + (attendu ? 'pastille' : 'rien') + '  (' + quoi + ')', allume, attendu);
}

// ⚠️ TEMOIN DE MORSURE. Les trois « temoins » ci-dessus n en sont pas : ils verifient un
// comportement, ils ne cassent rien. Celui-ci rejoue les MEMES cas avec la comparaison
// naive — celle qu on ecrit sans y penser — et exige qu elle tombe. Si elle passait, ce
// fichier ne prouverait rien : il faut qu une regression de cette forme soit VUE ici.
console.log('\n— Temoin : la comparaison naive doit tomber —');
const naif = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const CAS_NAIF = [
    ['1.9.00', '1.13.01', -1, '1.13.01 est plus recent que 1.9.00'],
    ['1.13.01', '1.9.00', 1,  'et reciproquement'],
    ['1.14', '1.14.00', 0,    'un zero omis ne fait pas une version de plus'],
];
let temoinTombe = 0;
for (const [a, b, attendu, quoi] of CAS_NAIF) {
    if (naif(a, b) !== attendu) { temoinTombe++; console.log('  ok   temoin : la naive se trompe sur « ' + quoi + ' »'); }
    else console.log('  ECHEC temoin : la naive donne le bon resultat sur « ' + quoi + ' » — ce cas ne teste rien');
}
if (temoinTombe !== CAS_NAIF.length) {
    console.log('');
    console.log('❌ TEMOIN NON DETECTE : ' + (CAS_NAIF.length - temoinTombe) + ' cas sur ' + CAS_NAIF.length +
                ' passent avec une comparaison de chaines.');
    console.log('   Ces cas-la ne distinguent donc pas _majCmp d une version fausse,');
    console.log('   et le « TOUT PASSE » ci-dessus ne vaut pas ce qu il annonce.');
    process.exit(2);
}

console.log('');
console.log(ko === 0
    ? 'TOUT PASSE : ' + ok + ' ok, 0 ko (temoin de morsure : ' + temoinTombe + '/' + CAS_NAIF.length + ')'
    : '❌ ' + ko + ' ECHEC(S) sur ' + (ok + ko));
process.exit(ko === 0 ? 0 : 1);
