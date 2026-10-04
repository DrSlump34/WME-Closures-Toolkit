// Lecture des fermetures chargées SANS `W` : quand RoadClosures.getAll() du SDK lève (ticket SDK
// 566467873, encore vrai en bêta v2.373 le 04/10/2026 : à Paris, 418 fermetures sur 862 sans
// attributions), _fermeturesChargees se replie sur l'API Features lue pour la vue courante.
// Avant le 24/11/2026, ce repli lisait `W.model`, qui disparaît.
//
// Le code est extrait du fichier réel ; SDK et fetch sont des doublures.
const fs = require('fs');
const SRC = require('path').join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');
const extrait = (a, b) => {
    const i = txt.indexOf(a); if (i < 0) throw new Error('introuvable : ' + a);
    const j = txt.indexOf(b, i + a.length); if (j < 0) throw new Error('fin introuvable : ' + a);
    return txt.slice(i, j + b.length);
};
const blocRepli = extrait('let _fcApi = ', 'return a ? a.credit : null;\n};');
const blocApi = extrait('const _apiToClosure = (o) => ({', '\n});');
let ok = 0, ko = 0;
const chk = (nom, cond, detail) => { if (cond) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + (detail !== undefined ? '\n        ' + detail : '')); } };

const monter = (bloc, { lisible, apiObjets }) => {
    const etat = { ext: [2.33, 48.85, 2.35, 48.86], appels: 0, urls: [] };
    const sdk = {
        Map: { getMapExtent: () => etat.ext, getZoomLevel: () => 17 },
        DataModel: { RoadClosures: { getAll: () => {
            if (!lisible) throw new TypeError("Cannot read properties of null (reading 'map')");
            return [{ id: 's1', segmentId: 1, attributions: [{ credit: 'Ville de Paris' }] }];
        } } },
    };
    const fetch = async (url) => { etat.appels++; etat.urls.push(url);
        return { ok: true, json: async () => ({ roadClosures: { objects: apiObjets } }) }; };
    const f = new Function('sdk', 'fetch', 'log', '_featuresPath', '_lang',
        blocApi + '\n' + bloc + '\nreturn { _fermeturesChargees, _rafraichirFermeturesApi, _creditDe, _sdkFermeturesLisibles };');
    return { ...f(sdk, fetch, () => {}, () => '/row-Descartes/app/Features', 'fr'), etat };
};
const API = [
    { id: 'a1', segID: 10, reason: 'Travaux', closureStatus: 'ACTIVE', startDate: '2026-10-04 08:00',
      endDate: '2026-10-04 18:00', forward: true, permanent: false, eventId: null, provider: 'Ville de Paris', geometry: null },
    { id: 'a2', segID: 11, reason: '', closureStatus: 'ACTIVE', startDate: '2026-10-04 08:00',
      endDate: '2026-10-04 18:00', forward: false, permanent: false, eventId: null, provider: null, geometry: null },
];

(async () => {
    console.log('\n— SDK lisible : on lit le SDK, sans appel réseau —');
    const a = monter(blocRepli, { lisible: true, apiObjets: API });
    const ra = a._fermeturesChargees();
    chk('rend la liste du SDK', Array.isArray(ra) && ra.length === 1 && ra[0].id === 's1', JSON.stringify(ra));
    chk('aucun appel à l\'API', a.etat.appels === 0, a.etat.appels);
    chk('la source vient du crédit des attributions', a._creditDe(ra[0]) === 'Ville de Paris');

    console.log('\n— SDK qui lève, pas encore de lecture API —');
    const b = monter(blocRepli, { lisible: false, apiObjets: API });
    chk('null (« pas pu regarder »), pas [] (« rien »)', b._fermeturesChargees() === null);
    chk('une lecture de l\'API est lancée', b.etat.appels === 1, b.etat.appels);
    chk('l\'emprise de la vue est dans l\'URL', /bbox=2\.33000,48\.85000,2\.35000,48\.86000/.test(b.etat.urls[0]), b.etat.urls[0]);
    chk('les fermetures sont demandées', /roadClosures=true/.test(b.etat.urls[0]));

    console.log('\n— SDK qui lève, lecture API faite pour CETTE vue —');
    await b._rafraichirFermeturesApi();
    const rb = b._fermeturesChargees();
    chk('rend les fermetures de l\'API', Array.isArray(rb) && rb.length === 2, JSON.stringify(rb));
    chk('forme SDK (segmentId, isForward)', rb && rb[0].segmentId === 10 && rb[1].isForward === false);
    chk('le provider de l\'API est gardé', rb && rb[0]._provider === 'Ville de Paris' && rb[1]._provider === null);

    console.log('\n— La carte a bougé : la lecture ne vaut plus —');
    b.etat.ext = [2.40, 48.80, 2.42, 48.81];
    const avant = b.etat.appels;
    chk('null, plutôt qu\'une lecture d\'une autre vue', b._fermeturesChargees() === null);
    chk('une nouvelle lecture est lancée', b.etat.appels === avant + 1);

    console.log('\n— Témoin : sans le contrôle de la vue, la lecture périmée serait servie —');
    const sansControle = blocRepli.replace('_fcApi.objets && _fcApi.cle === _cleVue()', '_fcApi.objets');
    chk('TÉMOIN : le remplacement a mordu', sansControle !== blocRepli);
    const c = monter(sansControle, { lisible: false, apiObjets: API });
    await c._rafraichirFermeturesApi();
    c.etat.ext = [2.40, 48.80, 2.42, 48.81];
    const rc = c._fermeturesChargees();
    chk('TÉMOIN : sans contrôle, la vue précédente est rendue (le défaut que le contrôle évite)', Array.isArray(rc) && rc.length === 2);

    console.log('\n' + ok + ' ok, ' + ko + ' échec(s)');
    process.exit(ko ? 1 : 0);
})();
