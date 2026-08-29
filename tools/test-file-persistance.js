// La file d attente survit-elle a un rechargement SANS RIEN PERDRE ? — _jsonAller et
// _jsonRetour, EXTRAITS DU FICHIER REEL (methode poly-core.js : jamais une copie).
//
// POURQUOI CE TEST EXISTE (2026-08-29, v1.14.02)
// La file ne vivait qu en memoire. Le 29/08/2026, j ai conseille a Glenan56 « Refresh la
// page » pendant que son panneau affichait « 1 entree en file » : le conseil reglait son
// symptome et lui faisait perdre son travail. La file est desormais conservee dans les
// preferences — et c est la CONVERSION qui devient le point dangereux.
//
// ⚠️ CE QUI SE PERD EN SILENCE, et c est tout l objet de ce test : une entree de file porte
// des Set (segments absents, segments modifies recemment, LIGNES SUPPRIMEES) et des Date.
// JSON.stringify ecrase les deux sans un mot. Un Set devient {} et se relit comme un objet
// vide — donc comme « aucune ligne supprimee ». Des fermetures que l editeur croyait avoir
// retirees repartiraient sur la carte, et rien nulle part ne l aurait signale. C est le
// pire mode de defaillance possible pour ce script : une ecriture qu on n a pas demandee.
'use strict';
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');

const extraire = (nom) => {
    const i = txt.indexOf('const ' + nom + ' = (v) => {');
    if (i < 0) {
        console.error('❌ ' + nom + ' introuvable dans ' + SRC);
        console.error('   Renommee ou supprimee : le reporter ici, sinon ce test ne prouve plus rien.');
        process.exit(2);
    }
    const j = txt.indexOf('\n};', i);
    if (j < 0) { console.error('❌ fin de ' + nom + ' introuvable'); process.exit(2); }
    return txt.slice(i, j + 3);
};

let _jsonAller, _jsonRetour;
try {
    const code = extraire('_jsonAller') + '\n' + extraire('_jsonRetour');
    ({ _jsonAller, _jsonRetour } = new Function(code + '\nreturn { _jsonAller, _jsonRetour };')());
} catch (e) { console.error('❌ les convertisseurs ne s evaluent pas : ' + e.message); process.exit(2); }

let ok = 0, ko = 0;
const dit = (b, quoi, detail) => {
    console.log('  ' + (b ? 'ok  ' : 'KO  ') + ' ' + quoi + (detail ? '   ' + detail : ''));
    b ? ok++ : ko++;
};

// Une entree de file realiste : ce que `makeEntry` et le chemin des virages produisent.
const debut = new Date('2026-09-12T07:00:00.000Z');
const fin   = new Date('2026-09-12T17:15:00.000Z');
const entree = {
    segIds: [62831704, 383525947],
    config: { direction: '3', reason: 'Triathlon', starttime: '09:00', days: [false,true,true,true,true,true,false] },
    closures: [{ start: debut, end: fin }],
    excludedRows: new Set(['62831704:0']),
    nullSegs: new Set([383525947]),
    recentSegs: new Set(),
    turnMeta: [{ id: 'a-b', from: 1, to: 2 }],
    source: 'cfg', label: 'Triathlon', collapsed: false,
};

const rendu = _jsonRetour(JSON.parse(JSON.stringify(_jsonAller([entree]))))[0];

console.log('\n— Aller-retour d une entree de file par le stockage —');
dit(Array.isArray(rendu.segIds) && rendu.segIds.length === 2 && rendu.segIds[0] === 62831704,
    'les identifiants de segments reviennent', JSON.stringify(rendu.segIds));
dit(rendu.excludedRows instanceof Set && rendu.excludedRows.has('62831704:0'),
    '🔴 les LIGNES SUPPRIMEES reviennent, et en Set',
    'taille ' + (rendu.excludedRows instanceof Set ? rendu.excludedRows.size : 'PAS UN SET'));
dit(rendu.nullSegs instanceof Set && rendu.nullSegs.has(383525947),
    'les segments signales reviennent, et en Set');
dit(rendu.recentSegs instanceof Set && rendu.recentSegs.size === 0,
    'un Set VIDE reste un Set vide, il ne devient pas null');
dit(rendu.closures[0].start instanceof Date && rendu.closures[0].start.getTime() === debut.getTime(),
    'la date de DEBUT revient, et en Date', rendu.closures[0].start instanceof Date ? rendu.closures[0].start.toISOString() : String(rendu.closures[0].start));
dit(rendu.closures[0].end instanceof Date && rendu.closures[0].end.getTime() === fin.getTime(),
    'la date de FIN revient, et en Date');
dit(rendu.config.direction === '3' && rendu.config.days.length === 7 && rendu.config.days[0] === false,
    'la configuration revient entiere, jours compris');
dit(Array.isArray(rendu.turnMeta) && rendu.turnMeta[0].id === 'a-b',
    'les objets imbriques traversent aussi');

console.log('\n— Cas degeneres —');
dit(JSON.stringify(_jsonRetour(_jsonAller([]))) === '[]', 'une file vide traverse sans lever');
const dateKo = _jsonRetour(JSON.parse(JSON.stringify(_jsonAller({ d: new Date('nawak') })))).d;
dit(dateKo === null, 'une date INVALIDE ressort a null, elle ne fabrique pas un 1970',
    String(dateKo));
dit(_jsonRetour(_jsonAller({ a: null, b: 0, c: '', d: false })).b === 0,
    'null, zero, chaine vide et false ne sont pas avales');

console.log('\n— TEMOIN DE MORSURE : ce que ferait un JSON.stringify nu —');
// Sans ce temoin, les assertions ci-dessus passeraient aussi avec des convertisseurs qui ne
// convertissent rien, sur une entree qui n aurait ni Set ni Date. Ce sont ces deux pertes-la
// qui justifient tout le mecanisme : il faut les CONSTATER.
const nu = JSON.parse(JSON.stringify(entree));
dit(!(nu.excludedRows instanceof Set) && Object.keys(nu.excludedRows).length === 0,
    'un Set y devient un objet VIDE — les lignes supprimees repartiraient sur la carte',
    JSON.stringify(nu.excludedRows));
dit(!(nu.closures[0].start instanceof Date),
    'une Date y devient une chaine — plus aucun calcul de plage ne fonctionne',
    typeof nu.closures[0].start);

console.log('\n— Le mecanisme est-il BRANCHE, et protege ? —');
dit(/queue:_queuePourPrefs\(\)/.test(txt), 'la file part bien dans les preferences');
dit(/_queueReprise = Array\.isArray\(d\.queue\)/.test(txt), 'et elle en revient au chargement');
// 🔴 Le verrou d ecrasement est ce qui separe « la file se souvient » de « la file
// s efface ». Sans lui, le premier save() venu — un simple deplacement de fenetre — ecrit
// la file VIDE du demarrage par-dessus celle de la veille, avant meme la reprise.
dit(/if\(!_queuePrete\) return _queueReprise \|\| \[\];/.test(txt),
    '🔴 le verrou d ecrasement est en place (rien n est ecrit avant la reprise)');
dit(/_queuePrete = true;/.test(txt), 'et il se leve une fois la reprise faite');
dit(/_queueReprendre\(\);/.test(txt.slice(txt.indexOf('const init=async'))),
    'la reprise est appelee par init, apres la construction du panneau');
// ⚠️ On exige la CONDITION, pas seulement le mot : un beforeunload qui se declencherait a
// chaque rechargement serait l avertissement qu on cesse de lire — une file ordinaire
// revient toute seule, il n y a rien a perdre et rien a dire.
dit(/beforeunload/.test(txt), 'un avertissement de sortie existe');
dit(/if\(!_applyRunning && !\(queue\.length && _queueTropGrosse\)\) return;/.test(txt),
    'et il se tait quand la file sera reprise (application en cours ou file non conservee, sinon rien)');

console.log('');
console.log(ko === 0 ? 'TOUT PASSE : ' + ok + ' ok, 0 ko' : '❌ ' + ko + ' ECHEC(S) sur ' + (ok + ko));
process.exit(ko === 0 ? 0 : 1);
