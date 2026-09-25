// Nœuds fermés : le mode est celui de l'ENTRÉE, et les nœuds « intérieurs » se calculent sur sa
// liste ENTIÈRE — jamais sur un lot ni sur une moitié.
//
// Audit du 25/09/2026 : `closeNodes` était un réglage global lu au moment d'Appliquer (le mode du
// moment, pas celui préparé), et « Intérieurs » était recalculé sur chaque moitié après un refus :
// le carrefour à la frontière des deux moitiés restait ouvert. Le badge de la carte lisait une clé
// (`nodesClosed`) que rien n'écrivait : il affichait toujours « Aucun ».
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

// Une rue de 4 segments bout à bout : nœuds 10-11-12-13-14. Intérieurs : 11, 12, 13.
const SEGS = { 1: { fromNodeId: 10, toNodeId: 11 }, 2: { fromNodeId: 11, toNodeId: 12 },
               3: { fromNodeId: 12, toNodeId: 13 }, 4: { fromNodeId: 13, toNodeId: 14 } };
const code = extrait('const getNodeList=', '\n// Fermetures de segment chargées');
const { _noeudsInterieurs, _noeudsDe } = new Function('getSegById',
    code + '; return { _noeudsInterieurs, _noeudsDe };')(id => SEGS[id] || null);
const liste = s => [...s].sort().join(',');

console.log('\n— Nœuds intérieurs —');
chk('liste entière [1,2,3,4] : 11, 12, 13', liste(_noeudsInterieurs([1, 2, 3, 4])) === '11,12,13');
const entree = { segIds: [1, 2, 3, 4] };
chk('ceux de l\'entrée : les mêmes, quelle que soit la moitié posée', liste(_noeudsDe(entree)) === '11,12,13');
chk('figés à la validation : relus tels quels', liste(_noeudsDe({ segIds: [1, 2], nodesInside: [11, 12, 13] })) === '11,12,13');
// Témoin : recalculés sur chaque moitié, le nœud 12 (entre 2 et 3) disparaît des deux.
const m1 = _noeudsInterieurs([1, 2]), m2 = _noeudsInterieurs([3, 4]);
chk('TÉMOIN : par moitiés, le carrefour 12 de la frontière n\'est dans aucune', !m1.has(12) && !m2.has(12), liste(m1) + ' / ' + liste(m2));

console.log('\n— Branchements dans le fichier —');
const ac = extrait('const addClosure=', '\nconst _poserParMoitie');
chk('addClosure lit le mode de l\'appelant', /const modeNoeuds=options\.closeNodes\?\?closeNodes;/.test(ac));
chk('addClosure lit les nœuds intérieurs de l\'appelant', /interieurs=nodesInside\|\|_noeudsInterieurs\(segments\)/.test(ac));
chk('addClosure ne décide plus sur le réglage global seul', !/if\(closeNodes===NODE_CL/.test(ac));
const aq = extrait('const applyQueue=', '\nconst ');
chk('applyQueue passe le mode de l\'entrée', /closeNodes:e\.config\.closeNodes\?\?closeNodes/.test(aq));
chk('applyQueue passe les nœuds de l\'entrée', /nodesInside:\(e\.config\.closeNodes\?\?closeNodes\)===NODE_CL\.inside\?_noeudsDe\(e\):null/.test(aq));
chk('makeEntry garde le mode choisi', /config:\{\.\.\.cfg,closeNodes:cfg\.closeNodes\?\?closeNodes\}/.test(txt));
chk('plus aucune lecture de la clé morte nodesClosed', !/nodesClosed/.test(txt));

console.log('\n' + ok + ' ok, ' + ko + ' échec(s)');
process.exit(ko ? 1 : 0);
