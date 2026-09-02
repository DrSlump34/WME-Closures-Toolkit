// D'où vient le moteur de créneaux qu'on teste : de la SOURCE, ou de la COPIE
// embarquée dans le userscript ?
//
// Même intention que lib-dico.js : un seul scanner, partagé par les outils, plutôt
// qu'une copie du même code dans chacun — c'est une copie de ce genre qui les avait
// tous fait tomber d'un coup le 01/08/2026.
//
// Par défaut : la source (lib/WMECreneaux.js). Avec WCT_LIB_COPIE=1 dans
// l'environnement : la copie extraite du userscript. C'est ce que check-lib-creneaux.js
// emploie pour rejouer les tests là où le code tourne vraiment.
const fs = require('fs');
const path = require('path');

const RACINE = path.join(__dirname, '..');
const SRC = path.join(RACINE, 'WME_ClosuresToolkit.user.js');
const LIB = path.join(RACINE, 'lib', 'WMECreneaux.js');

const DEBUT = 'var WMECreneaux = (function () {';

// Trouve la fin de l'IIFE au niveau 0, en sautant chaînes et commentaires — sans quoi
// une accolade dans un littéral suffirait à couper au mauvais endroit.
const extraire = (txt) => {
    const i = txt.indexOf(DEBUT);
    if (i < 0) return null;
    let prof = 0, chaine = null;
    for (let k = i; k < txt.length; k++) {
        const c = txt[k];
        if (chaine) {
            if (c === '\\') k++;
            else if (c === chaine) chaine = null;
            continue;
        }
        if (c === '`' || c === "'" || c === '"') { chaine = c; continue; }
        if (c === '/' && txt[k + 1] === '/') { k = txt.indexOf('\n', k); if (k < 0) break; continue; }
        if (c === '/' && txt[k + 1] === '*') { k = txt.indexOf('*/', k) + 1; continue; }
        if (c === '{' || c === '(') prof++;
        else if (c === '}' || c === ')') {
            prof--;
            if (prof === 0) { const f = txt.indexOf(';', k); return txt.slice(i, f + 1); }
        }
    }
    return null;
};

const codeSource = () => extraire(fs.readFileSync(LIB, 'utf8'));
const codeCopie  = () => extraire(fs.readFileSync(SRC, 'utf8'));

// Rend la bibliothèque prête à l'emploi, plus l'origine (à afficher dans le rapport
// du test : un test qui ne dit pas ce qu'il a chargé ne prouve pas grand-chose).
const charger = () => {
    if (process.env.WCT_LIB_COPIE) {
        const code = codeCopie();
        if (!code) {
            console.error('❌ Copie de WMECreneaux introuvable dans le userscript.');
            process.exit(2);
        }
        return { lib: new Function(code + '; return WMECreneaux;')(), origine: 'copie embarquée dans le userscript' };
    }
    return { lib: require(LIB), origine: 'lib/WMECreneaux.js' };
};

module.exports = { SRC, LIB, DEBUT, extraire, codeSource, codeCopie, charger };
