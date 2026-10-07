// État des cartes de file après un redessin (1.24.05) — _setEtatCarte, _resetEtatsCartes,
// _peindreEtat et la remise dans renderQueue, EXTRAITS DU FICHIER RÉEL, sur un DOM simulé.
//
// Pourquoi ce test existe (07/10/2026, veille crues) : 4 entrées appliquées, une seule coche
// affichée à la fin. Depuis la 1.24.00, le calcul asynchrone des inversés redessine la file
// (renderQueue) à chaque recentrage ; l'état, écrit dans le DOM seul, disparaissait des cartes
// déjà traitées. Il est désormais retenu à côté de l'entrée et remis au redessin.
const fs = require('fs');
const path = require('path');
const SRC = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');
const extrait = (debut, fin) => {
    const i = txt.indexOf(debut);
    if (i < 0) { console.error('❌ introuvable : ' + debut); process.exit(2); }
    const j = txt.indexOf(fin, i);
    if (j < 0) { console.error('❌ fin introuvable : ' + debut); process.exit(2); }
    return txt.slice(i, j + fin.length);
};
let ok = 0, ko = 0;
const chk = (nom, vrai, detail) => {
    if (vrai) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + (detail ? '  → ' + detail : '')); }
};

const code = extrait('let _etatsEntrees=new WeakMap();', "forEach(c=>{ c.textContent=''; c.title=''; });\n};");
const remise = extrait('{ const et=_etatsEntrees.get(entry);', '_peindreEtat(cel,et.etat,et.titre); }');

// DOM simulé : une carte = { idx, cel:{textContent,title} } ; « redessiner » = recréer les cellules.
const monter = (codeEtat) => {
    const doc = { cartes: [] };
    const document = {
        querySelector: sel => { const m = sel.match(/data-idx="(\d+)"/); const c = doc.cartes.find(x => x.idx == m[1]);
            return c ? { querySelector: () => c.cel } : null; },
        querySelectorAll: () => doc.cartes.map(c => c.cel),
    };
    const queue = [{ label: 'a' }, { label: 'b' }, { label: 'c' }, { label: 'd' }];
    const f = new Function('document', 'queue', 'APPLY_ETAT', codeEtat +
        `\nreturn { _setEtatCarte, _resetEtatsCartes, carte:(entry,idx)=>{ const cel={textContent:'',title:''}; const hdr={querySelector:()=>cel};` +
        remise + ` return {idx,cel}; } };`)(document, queue, { ok: '✅', partiel: '⚠️', echec: '❌' });
    const redessiner = () => { doc.cartes = queue.map((e, i) => f.carte(e, i)); };
    redessiner();
    return { f, doc, redessiner, queue };
};

(() => {
    let m = monter(code);
    m.f._resetEtatsCartes();
    m.f._setEtatCarte(0, 'ok', 'posée'); m.f._setEtatCarte(1, 'ok', 'posée');
    m.redessiner();                                   // le calcul des inversés redessine la file
    m.f._setEtatCarte(2, 'partiel', 'partielle'); m.f._setEtatCarte(3, 'ok', 'posée');
    const vus = m.doc.cartes.map(c => c.cel.textContent).join('');
    chk('après un redessin en cours de route, les 4 cartes gardent leur état', vus === '✅✅⚠️✅', vus);
    chk('l\'infobulle revient avec la coche', m.doc.cartes[0].cel.title === 'posée');
    m.redessiner();
    chk('un redessin APRÈS la fin garde tout', m.doc.cartes.map(c => c.cel.textContent).join('') === '✅✅⚠️✅');
    m.f._resetEtatsCartes(); m.redessiner();
    chk('une nouvelle application repart de zéro (même après redessin)', m.doc.cartes.every(c => c.cel.textContent === ''));
    m.f._setEtatCarte(1, 'ok', 'x'); m.f._setEtatCarte(1, null, ''); m.redessiner();
    chk('effacer un état (entrée interrompue sans rien posé) ne le fait pas revenir', m.doc.cartes[1].cel.textContent === '');

    // TÉMOIN : sans la mémoire (comportement 1.24.00 → 1.24.04), le redessin efface les coches acquises.
    const sansMemoire = code.replace("if(e){ if(etat) _etatsEntrees.set(e,{etat,titre}); else _etatsEntrees.delete(e); }", '');
    chk('TÉMOIN : la mutation a bien porté', sansMemoire !== code);
    m = monter(sansMemoire);
    m.f._setEtatCarte(0, 'ok', ''); m.f._setEtatCarte(1, 'ok', ''); m.redessiner(); m.f._setEtatCarte(3, 'ok', '');
    const t = m.doc.cartes.map(c => c.cel.textContent || '·').join('');
    chk('TÉMOIN : sans mémoire, seule la dernière carte garde sa coche', t === '···✅', t);

    console.log(`\n${ok} ok, ${ko} échec(s)`);
    process.exit(ko ? 1 : 0);
})();
