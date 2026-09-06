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
//   1 bis. ET CE N ETAIT PAS TOUT — mesure dans WME a Melbourne le 06/09 : AUCUN choix
//      de region ne survivait, pas seulement « tout le pays ». La branche d enregistrement
//      n etait jamais atteinte, parce que le gestionnaire refabriquait la cle Etat depuis
//      `_lastHolidayCall`, remise a null EN TETE de chaque generation de l apercu. La cle
//      vient desormais de la fonction qui AFFICHE le selecteur, ou pays et Etat sont ceux
//      de la liste montree a l editeur. ⚠️ Le premier correctif etait juste et inutile :
//      il reparait l ecriture d une valeur qui n etait de toute facon jamais ecrite.
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
const codeMemoriser   = extraire('const memoriserRegionChoisie=', '\n};');
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
const _regionEchecs = new Set();
let champ = null;                       // le <input id="wct-reason">, ou rien
const $id = id => (id === 'wct-reason' ? champ : null);
`;

let api;
try {
    api = new Function(PREAMBULE + '\n' + ligneSentinelle + '\n' + codePrefsData + '\n' + codeAppliquer
        + '\n' + codeMemoriser
        + '\nreturn { _prefsData, _appliquerPrefs, REGION_PAYS_ENTIER, memoriserRegionChoisie,'
        + '  lireRegions: () => _regionParEtat, lireReason: () => _reason,'
        + '  poserEchec: c => _regionEchecs.add(c), echecConnu: c => _regionEchecs.has(c),'
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

console.log('\n— Le geste de l editeur s enregistre, et sous LE BON Etat —');
{
    // Ce que ce bloc verrouille, et qui manquait le 06/09/2026 : le choix de region ne
    // survivait a AUCUN rechargement — ni « tout le pays », ni un autre Etat. La cause
    // n etait pas la marque, c est que la branche d enregistrement n etait pas atteinte :
    // le gestionnaire refabriquait la cle depuis `_lastHolidayCall`, remise a null en tete
    // de chaque generation de l apercu. La cle vient desormais de la fonction qui AFFICHE
    // le selecteur, ou le pays et l Etat sont ceux de la liste montree a l editeur.
    api._appliquerPrefs({ regionParEtat: {} });

    api.memoriserRegionChoisie('AU|Victoria', 'AU-NSW');
    verifier('un Etat choisi a la main est ecrit dans la table',
        api.lireRegions()['AU|Victoria'] === 'AU-NSW', JSON.stringify(api.lireRegions()));

    api.memoriserRegionChoisie('AU|Victoria', '');
    verifier('« tout le pays » ecrit la marque, il n efface pas l entree',
        api.lireRegions()['AU|Victoria'] === api.REGION_PAYS_ENTIER, JSON.stringify(api.lireRegions()));

    verifier('l appel rend true : c est ce qui dit a l appelant de sauvegarder',
        api.memoriserRegionChoisie('AU|Victoria', 'AU-VIC') === true);

    // ⚠️ LE CAS QUI COMPTE LE PLUS. Sans cle, on n ecrit RIEN — surtout pas « au dernier
    // Etat connu » : un choix range sous le mauvais Etat ressort plus tard sur un chantier
    // qui n a rien demande. Et rendre false empeche une sauvegarde inutile.
    const avant = JSON.stringify(api.lireRegions());
    const rendu = api.memoriserRegionChoisie(null, 'AU-WA');
    verifier('sans cle : rien n est ecrit, et l appel rend false',
        rendu === false && JSON.stringify(api.lireRegions()) === avant,
        'rendu ' + rendu + ', table ' + JSON.stringify(api.lireRegions()));

    // Le choix efface le souvenir d echec : l editeur vient de fournir la reponse que le
    // service n avait pas su donner. Sans cela, l Etat resterait marque « ne pas reessayer »
    // alors qu il n y a plus rien a demander a personne.
    api.poserEchec('CA|Ontario');
    api.memoriserRegionChoisie('CA|Ontario', 'CA-ON');
    verifier('le choix efface le souvenir d echec de cet Etat',
        !api.echecConnu('CA|Ontario'));

    // Temoin : un echec sur un AUTRE Etat n est pas touche. Sans ce cas, un `clear()`
    // maladroit passerait pour un correctif.
    api.poserEchec('CA|Quebec');
    api.memoriserRegionChoisie('CA|Ontario', 'CA-ON');
    verifier('temoin : l echec d un autre Etat reste en place',
        api.echecConnu('CA|Quebec'));
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
