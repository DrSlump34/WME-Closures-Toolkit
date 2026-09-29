// Titre de l'aperçu de Configurer : sans segment ni virage visé, rien n'est « à appliquer ».
//
// 29/09/2026 : l'éditeur voyait « 1 fermeture(s) à appliquer » au-dessus d'une file VIDE et le
// prenait pour un reste d'un vieil import. C'était l'aperçu du formulaire (réglages par défaut :
// ce soir 21:00 → 05:00), calculé sans aucun segment sélectionné. Le titre dit désormais
// « Aperçu : N créneau(x) prévu(s), aucun segment sélectionné », en gris, et redevient
// « N fermeture(s) à appliquer » dès qu'une cible existe — réécrit au changement de sélection.
//
// Fait tourner le VRAI refreshSmallPreview et le VRAI _prevMajTete (DOM et moteur remplacés par
// des doublures). Témoin : le même code avec l'ancien titre (sans condition) doit échouer.
const fs = require('fs');
const SRC = require('path').join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');
const extrait = (a, b) => {
    const i = txt.indexOf(a); if (i < 0) throw new Error('introuvable : ' + a);
    const j = txt.indexOf(b, i + a.length); if (j < 0) throw new Error('fin introuvable : ' + a);
    return txt.slice(i, j);
};
const code = extrait('let _prevCollapsed=false;', '\n// ═══');

let ok = 0, ko = 0;
const chk = (nom, cond, detail) => { if (cond) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + (detail !== undefined ? '\n        ' + detail : '')); } };

const monter = (source) => {
    const etat = { sel: false, turns: null, n: 1 };
    const el = { innerHTML: '' };
    // Tête factice pour _prevMajTete : un nœud texte puis le chevron, comme le rendu réel.
    const tete = { firstChild: { nodeType: 3, textContent: '' },
                   classList: { set: new Set(), toggle(c, v) { v ? this.set.add(c) : this.set.delete(c); } } };
    const env = {
        $id: id => id === 'wct-small-prev' ? el : null,
        document: { querySelector: () => tete },
        buildClosureList: async () => ({ list: Array.from({ length: etat.n }, () => ({ start: 's', end: 'e' })) }),
        hasSel: () => etat.sel,
        t: (k, ...a) => k + '(' + a.join(',') + ')',
        escHtml: s => String(s),
        formatDateDisplay: d => d,
        TARGET_ICON: { seg: 'S', turn: 'T' },
        PREVIEW_MAX_ROWS: 50,
    };
    const f = new Function(...Object.keys(env), 'let _currentTurns=null;\n' + source +
        '\nreturn { refreshSmallPreview, _prevMajTete, setTurns: v => { _currentTurns = v; } };');
    const api = f(...Object.values(env));
    return { etat, el, tete, api };
};

(async () => {
    console.log('— code livré —');
    let m = monter(code);
    await m.api.refreshSmallPreview();
    chk('sans sélection : titre « aucun segment sélectionné »', /previewHeadNoSel\(1\)/.test(m.el.innerHTML), m.el.innerHTML);
    chk('sans sélection : jamais « à appliquer »', !/previewHead\(1\)/.test(m.el.innerHTML), m.el.innerHTML);
    chk('sans sélection : titre grisé (wct-prev-nosel)', /wct-prev-nosel/.test(m.el.innerHTML));

    m.etat.sel = true;
    await m.api.refreshSmallPreview();
    chk('segments sélectionnés : « N fermeture(s) à appliquer »', /previewHead\(1\)/.test(m.el.innerHTML) && !/NoSel/.test(m.el.innerHTML), m.el.innerHTML);
    chk('segments sélectionnés : titre non grisé', !/wct-prev-nosel/.test(m.el.innerHTML));

    m = monter(code);
    m.api.setTurns({ turns: [{ arrow: '↱' }] });
    await m.api.refreshSmallPreview();
    chk('virages visés (sans segment) : « à appliquer »', /previewHead\(1\)/.test(m.el.innerHTML), m.el.innerHTML);

    m = monter(code); m.etat.n = 0;
    await m.api.refreshSmallPreview();
    chk('aucun créneau : titre « 0 » inchangé', /previewHead\(0\)/.test(m.el.innerHTML), m.el.innerHTML);

    // Changement de sélection APRÈS le rendu : le titre suit sans recalcul.
    m = monter(code);
    await m.api.refreshSmallPreview();
    m.etat.sel = true; m.api._prevMajTete();
    chk('sélection faite ensuite : le titre passe à « à appliquer »', m.tete.firstChild.textContent === 'previewHead(1)' && !m.tete.classList.set.has('wct-prev-nosel'), m.tete.firstChild.textContent);
    m.etat.sel = false; m.api._prevMajTete();
    chk('sélection défaite ensuite : le titre repasse en « aucun segment »', m.tete.firstChild.textContent === 'previewHeadNoSel(1)' && m.tete.classList.set.has('wct-prev-nosel'), m.tete.firstChild.textContent);

    chk('refreshCfgGate réécrit le titre à chaque sélection',
        /const refreshCfgGate = \(\) => \{[\s\S]{0,400}_prevMajTete\(\);/.test(txt));

    console.log('— témoin : ancien titre sans condition —');
    const mutant = code.replace("const _prevTete=n=>(n&&!_prevACible())?t('previewHeadNoSel',n):t('previewHead',n);",
                                "const _prevTete=n=>t('previewHead',n);");
    if (mutant === code) { ko++; console.log('  ECHEC mutation non appliquée (le code a changé ?)'); }
    else {
        m = monter(mutant);
        await m.api.refreshSmallPreview();
        chk('le témoin DOIT réafficher « à appliquer » sans sélection (sinon le test ne voit rien)', /previewHead\(1\)/.test(m.el.innerHTML));
    }
    console.log(`\n${ok} ok, ${ko} échec(s)`);
    process.exit(ko ? 1 : 0);
})();
