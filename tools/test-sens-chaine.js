// Le sens d'une entrée se lit UNE fois, sur sa liste ENTIÈRE, et c'est ce calcul que relisent
// l'aperçu, la pose, les moitiés après un refus et le contrôle de compatibilité.
//
// Audit du 25/09/2026 : getReversedSegments prend le PREMIER segment de la liste pour référence
// (doc du SDK). WCT le rappelait sur des sous-listes — seconde moitié après un refus, lignes
// supprimées, segments nuls ou récents retirés, premier segment écarté pour conflit — et toute la
// chaîne pouvait basculer : un double sens fermé à l'envers, sans rien à l'écran.
//
// Le SDK est simulé SELON SA DOC : le résultat dépend du premier identifiant. Le témoin montre que
// cette doublure fait bien basculer une sous-liste — sans quoi le test ne prouverait rien.
const fs = require('fs');
const SRC = require('path').join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');
const extrait = (a, b) => {
    const i = txt.indexOf(a); if (i < 0) throw new Error('introuvable : ' + a);
    const j = txt.indexOf(b, i + a.length); if (j < 0) throw new Error('fin introuvable : ' + a);
    return txt.slice(i, j);
};
let ok = 0, ko = 0;
const chk = (nom, cond, detail) => { if (cond) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + (detail !== undefined ? '\n        ' + detail : '')); } };

// Une rue de 3 segments : 1 et 3 tracés dans le sens de la chaîne, 2 tête-bêche.
// orientation : +1 dans le sens de la chaîne, -1 à rebours.
const ORIENT = { 1: +1, 2: -1, 3: +1 };
const SEGS = { 1: { isTwoWay: true }, 2: { isTwoWay: true }, 3: { isTwoWay: false, isAtoB: true, isBtoA: false } };
let appelsSdk = 0;
const sdk = { DataModel: { Segments: { getReversedSegments: ({ segmentIds }) => {
    appelsSdk++;
    // Comme le vrai (relevé dans WME le 25/09/2026) : un seul segment hors du modèle fait LEVER.
    const inconnu = segmentIds.find(id => !(id in ORIENT));
    if (inconnu !== undefined) throw new Error('segment with id: ' + inconnu + ' not found in data model');
    const ref = ORIENT[segmentIds[0]];
    return segmentIds.filter(id => ORIENT[id] !== ref).map(id => ({ id }));
} } } };
const code = extrait('const _inversesListe=', '\n// ─── VIRAGES');
const env = { sdk, log: () => {}, getSegById: id => SEGS[id] || null, getSegName: id => 'rue ' + id, DIR: { AtoB: 1, BtoA: 2, TWO: 3 } };
const noms = Object.keys(env);
const { _inversesListe, _inversesDe, getSegDirConflicts } =
    new Function(...noms, code + '; return { _inversesListe, _inversesDe, getSegDirConflicts };')(...noms.map(n => env[n]));

console.log('\n— Témoin : la doublure suit la doc (la référence est le 1er segment) —');
chk('liste [1,2,3] : seul 2 est à rebours', String([..._inversesListe([1, 2, 3])]) === '2');
chk('sous-liste [2,3] : c\'est 3 qui passe à rebours — la chaîne a basculé', String([..._inversesListe([2, 3])]) === '3');

console.log('\n— Un segment hors du modèle ne fait pas tout perdre —');
chk('[1,2,99,3] : 2 reste à rebours malgré le segment 99 non chargé', String([..._inversesListe([1, 2, 99, 3])]) === '2');
let leve = false; try { sdk.DataModel.Segments.getReversedSegments({ segmentIds: [1, 2, 99, 3] }); } catch (e) { leve = true; }
chk('TÉMOIN : le SDK appelé sur la liste brute lève', leve);

console.log('\n— Le calcul de l\'entrée —');
const entry = { segIds: [1, 2, 3] };
const inv = _inversesDe(entry);
chk('calculé sur la liste entière : {2}', String([...inv]) === '2');
chk('figé dans l\'entrée (toute la liste est chargée)', Array.isArray(entry.inverses) && String(entry.inverses) === '2');
const avant = appelsSdk;
_inversesDe(entry);
chk('relu sans rappeler le SDK', appelsSdk === avant, 'appels ' + avant + ' → ' + appelsSdk);
const partielle = { segIds: [1, 2, 99] };
_inversesDe(partielle);
chk('liste en partie hors du modèle : pas figée (recalculée après recadrage)', partielle.inverses === undefined);

console.log('\n— Contrôle de compatibilité —');
chk('A ⇒ B avec les inversés de l\'entrée : 3 (sens unique A ⇒ B) compatible',
    getSegDirConflicts([2, 3], 1, inv).length === 0);
chk('témoin : recalculé sur la sous-liste [2,3], 3 serait un faux conflit',
    getSegDirConflicts([2, 3], 1).length === 1);

console.log('\n— Branchements dans le fichier —');
const nAppels = (txt.match(/getReversedSegments\(/g) || []).length;
chk('un seul appel à getReversedSegments dans le code (dans _inversesListe)', nAppels === 1, 'appels : ' + nAppels);
const ac = extrait('const addClosure=', '\nconst _poserParMoitie');
chk('addClosure lit les inversés de l\'appelant', /const inv=inverses\|\|_inversesListe\(segments\)/.test(ac) && /inverses:inv,/.test(ac));
const aq = extrait('const applyQueue=', '\nconst ');
chk('applyQueue passe les inversés de l\'ENTRÉE à _poserParMoitie', /inverses:_inversesDe\(e\)/.test(aq));
const pm = extrait('const _poserParMoitie=', '\nconst applyQueue');
chk('les moitiés gardent les options (donc les inversés)', /\{\.\.\.opts,segments:segs\.slice\(0,m\)\}/.test(pm) && /\{\.\.\.opts,segments:reste\}/.test(pm));
chk('l\'aperçu lit le même calcul', /const inverses=_inversesDe\(entry\);/.test(txt));
chk('Configurer fige le sens sur la sélection entière', /const invSel=_inversesListe\(sel\.ids\);/.test(txt) && /entry\.inverses=\[\.\.\.invSel\];/.test(txt));

console.log('\n' + ok + ' ok, ' + ko + ' échec(s)');
process.exit(ko ? 1 : 0);
