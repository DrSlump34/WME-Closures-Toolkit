// Raccourcis clavier — table et regles de declenchement, EXTRAITES DU FICHIER REEL.
//
// Pourquoi ce test existe (2026-08-01) : les raccourcis touchent a des actions qui
// ECRIVENT sur la carte publique. Deux garanties doivent tenir dans le temps, et aucune
// des deux ne se voit a la relecture :
//   1. AUCUN raccourci ne declenche « Appliquer » ni « Vider » — les deux seules actions
//      irreversibles (le SDK ne sait pas supprimer une fermeture, et Vider detruit le
//      seul releve de ce qui a ete pose).
//   2. Une frappe DANS UN CHAMP ne declenche jamais rien : sans cela, taper une
//      description ferait changer d onglet.
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');

const DEBUT = 'const _rcDansUnChamp';
const FIN = 'const _rcInstaller';
const i = txt.indexOf(DEBUT), j = txt.indexOf(FIN);
if (i < 0 || j < 0 || j < i) {
    console.error('❌ bloc des raccourcis introuvable dans ' + SRC);
    console.error('   Renomme ou deplace : ajuster les bornes DEBUT/FIN de ce test.');
    process.exit(2);
}
const code = txt.slice(i, j);

// ── DOM minimal : juste ce que le bloc touche ──
const faireDom = (etat) => {
    const clics = [];
    const el = (id, opts = {}) => ({
        id, tagName: opts.tag || 'BUTTON', disabled: !!opts.disabled,
        offsetParent: opts.masque ? null : {}, dataset: opts.dataset || {},
        isContentEditable: !!opts.editable,
        click() { clics.push(id); },
        scrollIntoView() {},
        querySelector: (s) => (opts.enfant && s.includes(opts.enfant.sel)) ? opts.enfant.el : null,
    });
    const parId = {};
    for (const id of (etat.boutons || [])) parId[id] = el(id);
    for (const id of (etat.grises || [])) parId[id] = el(id, { disabled: true });

    const doc = {
        getElementById: (id) => parId[id] || null,
        querySelector: (sel) => {
            if (sel.includes('.wct-main-tab.on')) return etat.onglet ? { dataset: { tab: etat.onglet } } : null;
            if (sel.includes('#wct-overlay.open')) return etat.ouvert ? {} : null;
            if (sel.includes('wct-trace-lot-row')) {
                if (!etat.lotADomicile) return null;
                return { querySelector: () => el('LOT-' + etat.lotADomicile) };
            }
            if (sel.includes('.wct-main-tab[data-tab=')) {
                const m = sel.match(/data-tab="(\w+)"/);
                return el('ONGLET-' + (m ? m[1] : '?'));
            }
            if (sel.startsWith('.') || sel.startsWith('#')) {
                const nom = sel.replace(/^[.#]/, '').split(' ')[0];
                return parId[nom] || el('SEL-' + sel);
            }
            return null;
        },
    };
    return { doc, clics, $id: doc.getElementById };
};

const BOUTONS_CIBLES = ['wct-poly-btn','wct-preset-save-btn','wct-tn-all','wct-tn-none',
                        'wct-tn-send','wct-src-run','wct-src-clear','wct-btn-close','wct-fab-btn'];
const charger = (etat) => {
    // Tous les boutons vises par la table existent par defaut ; un cas de test peut en
    // griser certains via `grises`.
    etat = Object.assign({}, etat);
    etat.boutons = (etat.boutons || []).concat(BOUTONS_CIBLES.filter(b => !(etat.grises||[]).includes(b)));
    const { doc, clics, $id } = faireDom(etat);
    const f = new Function('document', '$id', 'log', '_keysPop',
        code + '\nreturn {_RACCOURCIS,_rcDansUnChamp,_rcOngletActif,_rcOuvert,_rcLotSuivant,_rcEntree};');
    return { api: f(doc, $id, () => {}, () => clics.push('KEYS-POP')), clics };
};

let ok = 0, ko = 0;
const chk = (nom, cond, detail) => {
    if (cond) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + (detail !== undefined ? '  → ' + detail : '')); }
};

console.log('\n— La table couvre ce qui a ete decide —');
{
    const { api } = charger({});
    const touches = Object.keys(api._RACCOURCIS).sort();
    chk('14 touches declarees', touches.length === 14, touches.length + ' : ' + touches.join(','));
    for (const k of ['w', 'k', '1', '2', '3', '4', '5', '6', 'enter', 'z', 's', 'n', 'a', 'x'])
        chk('touche ' + k + ' presente', touches.includes(k));
}

console.log('\n— ⚠️ GARANTIE : rien ne declenche Appliquer ni Vider —');
{
    // Le code de la table ne doit citer NI le bouton Appliquer NI le bouton Vider.
    chk('aucune reference a wct-btn-apply', !code.includes('wct-btn-apply'),
        'un raccourci vers Appliquer ecrirait sur la carte publique');
    chk('aucune reference a wct-btn-clear', !code.includes('wct-btn-clear'),
        'un raccourci vers Vider detruirait le releve de ce qui a ete pose');
}

console.log('\n— Une frappe dans un champ ne declenche rien —');
{
    const { api } = charger({});
    for (const tag of ['INPUT', 'TEXTAREA', 'SELECT'])
        chk('ignore dans <' + tag.toLowerCase() + '>', api._rcDansUnChamp({ target: { tagName: tag } }) === true);
    chk('ignore dans un contenteditable',
        api._rcDansUnChamp({ target: { tagName: 'DIV', isContentEditable: true } }) === true);
    chk('agit hors des champs', api._rcDansUnChamp({ target: { tagName: 'DIV' } }) === false);
    chk('cible absente : pas de plantage', api._rcDansUnChamp({ target: null }) === false);
}

console.log('\n— Les raccourcis d onglet ne valent que dans LEUR onglet —');
{
    const cas = [
        ['z', 'cfg', 'gpx'], ['s', 'cfg', 'src'],
        ['n', 'gpx', 'cfg'], ['a', 'turn', 'cfg'], ['x', 'src', 'cfg'],
    ];
    for (const [touche, bon, mauvais] of cas) {
        const A = charger({ onglet: bon, ouvert: true, lotADomicile: 3 });
        const B = charger({ onglet: mauvais, ouvert: true, lotADomicile: 3 });
        const rA = A.api._RACCOURCIS[touche]();
        const rB = B.api._RACCOURCIS[touche]();
        chk('Alt+' + touche.toUpperCase() + ' agit dans ' + bon + ' et pas dans ' + mauvais,
            rA === true && rB !== true, 'dans ' + bon + ' → ' + rA + ', dans ' + mauvais + ' → ' + rB);
    }
}

console.log('\n— Alt+Entree suit le contexte —');
{
    const attendu = { cfg: true, turn: true, src: true, gpx: false, csv: false, pre: false };
    for (const [onglet, doitAgir] of Object.entries(attendu)) {
        const { api } = charger({ onglet, ouvert: true });
        const r = api._rcEntree();
        chk('Alt+Entree dans ' + onglet + (doitAgir ? ' agit' : ' ne fait rien'),
            (r === true) === doitAgir, String(r));
    }
}

console.log('\n— Un bouton grise ou masque ne repond pas au clavier —');
{
    const { api } = charger({ onglet: 'src', ouvert: true, grises: ['wct-src-clear'] });
    chk('Alt+X sur un bouton disabled ne fait rien', api._RACCOURCIS['x']() !== true);
}

console.log('\n— Lot suivant —');
{
    const avec = charger({ onglet: 'gpx', ouvert: true, lotADomicile: 5 });
    chk('trouve le prochain lot non traite', avec.api._rcLotSuivant() === true);
    const sans = charger({ onglet: 'gpx', ouvert: true });
    chk('aucun lot restant : ne fait rien', sans.api._rcLotSuivant() === false);
}

console.log('\n' + (ko === 0 ? 'TOUT PASSE' : 'ECHECS') + ' : ' + ok + ' ok, ' + ko + ' ko');
process.exit(ko === 0 ? 0 : 1);
