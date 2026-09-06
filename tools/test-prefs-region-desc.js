// Ce que les preferences RENDENT apres un aller-retour : la region « tout le pays » et
// la description. Fonctions EXTRAITES DU FICHIER REEL (methode poly-core.js), jamais
// recopiees — une copie prouverait que la copie marche.
//
// POURQUOI CE TEST EXISTE (2026-09-06, v1.17.00)
// Deux defauts signales le meme jour par un editeur australien, et les deux sont des
// defauts d ALLER-RETOUR : ce qui est choisi tient le temps de la session et se perd au
// rechargement. Ils ne se voient donc jamais en regardant l ecran juste apres le geste.
//
//   1. « Tout le pays » EFFACAIT l entree de _regionParEtat. Au chargement suivant l Etat
//      redevenait inconnu, la position etait reinterrogee, et la region detectee se
//      reimposait. Le choix se defaisait a chaque ouverture de WME, sans un mot.
//      ⚠️ Le piege du correctif est ICI : la marque « * » ne ressemble pas a un code ISO
//         3166-2, et le filtre de relecture (/^[A-Z]{2}-/) l aurait jetee en silence. Le
//         choix aurait alors survecu a la session mais pas au rechargement — c est-a-dire
//         nulle part, et sans que rien ne le dise.
//
//   2. La DESCRIPTION repartait de son defaut a chaque chargement. Elle est desormais
//      persistee, et la chaine VIDE est une valeur : c est meme celle que reclame qui ne
//      veut aucune description pre-remplie. Un `if (d.reason)` la relirait comme « rien
//      d enregistre » et ferait revenir le defaut a chaque fois.
//
//   node tools/test-prefs-region-desc.js
'use strict';
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');

// Decoupe « const <nom> = ... ` jusqu au marqueur de fin donne, en echouant fort : une
// fonction renommee doit arreter le test, pas le rendre vert sur du vide.
const extraire = (debut, fin) => {
    const i = txt.indexOf(debut);
    if (i < 0) {
        console.error('❌ introuvable dans le userscript : ' + debut);
        console.error('   Renomme ou supprime : le reporter ici, sinon ce test ne prouve plus rien.');
        process.exit(2);
    }
    const j = txt.indexOf(fin, i);
    if (j < 0) { console.error('❌ fin introuvable pour : ' + debut); process.exit(2); }
    return txt.slice(i, j + fin.length);
};

// Meme decoupe, mais en s arretant AVANT le marqueur : les bornes ne doivent pas etre
// des lignes qu on retouche, sinon le test tombe a la moindre edition legitime.
const extraireAvant = (debut, borne) => {
    const bloc = extraire(debut, borne);
    return bloc.slice(0, bloc.length - borne.length);
};

const ligneSentinelle = extraire("const REGION_PAYS_ENTIER='*';", ";");
// ⚠️ On part de la DECLARATION de _reason, pas de _prefsData. Declaree dans le decor,
//    elle serait un stub ; extraite, c est la vraie — et si elle disparaissait du
//    userscript, les affectations tomberaient dans une globale implicite et ce test
//    resterait vert sur une variable qui n existe plus.
const codePrefsData   = extraireAvant('let _reason = null;', '\nconst _appliquerPrefs = d => {');
const codeAppliquer   = extraire('const _appliquerPrefs = d => {', '\n};');

// Le decor : tout ce que les deux fonctions touchent sans en etre proprietaires. Rien
// ici ne participe a ce qui est verifie — ces valeurs ne servent qu a les faire tourner.
const PREAMBULE = `
let presets = [], closeNodes = 0, enabled = true, _displayMode = 'normal';
let _dateFormat = 'dmy', _cardsCollapsedDefault = false, _langPref = 'auto';
let _polyTypes = null, _traceWidth = 3, _traceOpacity = 0.6, _ovGeom = null;
let _timeMode = 'end', _queueReprise = null;
const NODE_CL = { none: 0 };
const LANGS = [{ code: 'fr' }, { code: 'en' }];
const _queuePourPrefs = () => [];
const _traceWidthOk = v => v;
const _traceOpacityOk = v => v;
const _ovClamp = (g) => g;
const window = { innerWidth: 1280, innerHeight: 800 };
const localStorage = {};
let champ = null;                       // le <input id="wct-reason">, ou rien
const $id = id => (id === 'wct-reason' ? champ : null);
`;

let api;
try {
    api = new Function(PREAMBULE + '\n' + ligneSentinelle + '\n' + codePrefsData + '\n' + codeAppliquer
        + '\nreturn { _prefsData, _appliquerPrefs, REGION_PAYS_ENTIER,'
        + '  lireRegions: () => _regionParEtat, lireReason: () => _reason,'
        + '  poserChamp: v => { champ = (v === null ? null : { value: v }); } };')();
} catch (e) {
    console.error('❌ les fonctions extraites ne s evaluent pas : ' + e.message);
    process.exit(2);
}

let ok = 0, ko = 0;
const verifier = (nom, cond, detail) => {
    if (cond) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + (detail ? '\n         ' + detail : '')); }
};

console.log('— La region « tout le pays » survit au rechargement —');
{
    api._appliquerPrefs({ regionParEtat: { 'AU|Victoria': api.REGION_PAYS_ENTIER } });
    const r = api.lireRegions();
    verifier('la marque « tout le pays » est RELUE, pas filtree',
        r['AU|Victoria'] === api.REGION_PAYS_ENTIER, 'relu : ' + JSON.stringify(r));

    api._appliquerPrefs({ regionParEtat: { 'AU|Victoria': 'AU-VIC' } });
    verifier('un code de region ordinaire passe toujours',
        api.lireRegions()['AU|Victoria'] === 'AU-VIC', 'relu : ' + JSON.stringify(api.lireRegions()));

    // Temoin : le filtre mord encore. Sans ce cas, elargir la regle pour laisser passer
    // « * » aurait pu la laisser TOUT laisser passer, et le test serait reste vert.
    api._appliquerPrefs({ regionParEtat: { 'AU|Victoria': 'nimportequoi', 'FR|Occitanie': 42 } });
    const r3 = api.lireRegions();
    verifier('temoin : une valeur qui n est ni un code ni la marque est refusee',
        r3['AU|Victoria'] === undefined && r3['FR|Occitanie'] === undefined,
        'relu : ' + JSON.stringify(r3));

    verifier('temoin : la marque n est pas un code ISO 3166-2',
        !/^[A-Z]{2}-/.test(api.REGION_PAYS_ENTIER), 'marque : ' + api.REGION_PAYS_ENTIER);
}

console.log('\n— La description survit au rechargement, le vide compris —');
{
    api.poserChamp(null);                       // panneau pas encore construit

    api._appliquerPrefs({ reason: '' });
    verifier('la chaine VIDE est relue comme une valeur, pas comme une absence',
        api.lireReason() === '', 'relu : ' + JSON.stringify(api.lireReason()));

    verifier('et elle ressort telle quelle quand le panneau n existe pas encore',
        api._prefsData().reason === '', 'ecrit : ' + JSON.stringify(api._prefsData().reason));

    api._appliquerPrefs({ reason: '\u{1F6A7}Roadworks\u{1F6A7}' });
    verifier('une description non vide fait le meme aller-retour',
        api._prefsData().reason === '\u{1F6A7}Roadworks\u{1F6A7}',
        'ecrit : ' + JSON.stringify(api._prefsData().reason));

    // Temoin : sans champ, l ecriture ne doit RIEN inventer. C est le defaut qu on evite
    // en lisant `_reason` en repli — un `$id` absent aurait ecrit une chaine vide et
    // efface la description a la premiere sauvegarde d avant-panneau.
    api._appliquerPrefs({ reason: 'Travaux nuit' });
    api.poserChamp(null);
    verifier('temoin : sans panneau, la sauvegarde n ecrase pas la description',
        api._prefsData().reason === 'Travaux nuit', 'ecrit : ' + JSON.stringify(api._prefsData().reason));

    // Et quand le champ existe, c est LUI qui fait foi : c est la valeur que l editeur voit.
    api.poserChamp('Course cycliste');
    verifier('quand le champ existe, c est lui qui est enregistre',
        api._prefsData().reason === 'Course cycliste', 'ecrit : ' + JSON.stringify(api._prefsData().reason));

    api.poserChamp('');
    verifier('un champ vide s enregistre vide — c est la demande qui a ouvert ce chantier',
        api._prefsData().reason === '', 'ecrit : ' + JSON.stringify(api._prefsData().reason));
}

console.log('\n' + (ko === 0 ? 'TOUT PASSE : ' + ok + ' ok, 0 ko' : '❌ ECHEC : ' + ok + ' ok, ' + ko + ' ko'));
process.exit(ko === 0 ? 0 : 1);
