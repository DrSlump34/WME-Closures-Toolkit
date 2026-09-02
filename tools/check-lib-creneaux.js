// La copie de WMECreneaux embarquée dans le userscript est-elle conforme à sa source ?
//
// Le moteur de créneaux décide de ce qui sera ÉCRIT sur la carte, et il vit désormais
// à deux endroits : lib/WMECreneaux.js (la source) et une copie dans le userscript, en
// attendant le passage au @require. Deux copies qui divergent en silence, c'est le pire
// des deux mondes — même raison d'être que check-lib-copie.js pour WMEPrefs.
//
// Ce contrôle fait DEUX choses, et la seconde est la vraie :
//   1. il compare le code de la copie à celui de la source ;
//   2. il REJOUE test-plage.js sur la COPIE. Un code identique au caractère près qui
//      ne tourne pas dans son contexte d'accueil ne prouve rien.
//
//   node tools/check-lib-creneaux.js
const { execFileSync } = require('child_process');
const path = require('path');
const { codeSource, codeCopie } = require('./lib-creneaux-source.js');

let ko = 0;
const chk = (n, c, d) => {
    if (c) console.log('  ok   ' + n);
    else { ko++; console.log('  ECHEC ' + n + (d ? '\n        ' + d : '')); }
};

const copie = codeCopie();
const source = codeSource();

chk('bibliotheque trouvee dans le userscript', !!copie);
chk('bibliotheque trouvee dans lib/', !!source);

if (copie && source) {
    // ⚠️ Comparer le CODE, pas la mise en forme : une copie insérée dans un bloc
    // indenté autrement n'a pas divergé pour autant. Un contrôle qui crie au loup sur
    // de l'indentation finit ignoré — et le jour où l'écart est réel, personne ne
    // regarde. Même doctrine que check-lib-copie.js.
    const lignes = s => s.replace(/\r\n/g, '\n').trim().split('\n').map(l => l.trim()).filter(l => l);
    const a = lignes(copie), b = lignes(source);
    const memeCode = a.length === b.length && a.every((l, i) => l === b[i]);
    chk('le CODE de la copie est identique a la source', memeCode,
        memeCode ? '' : a.length + ' lignes contre ' + b.length + ' — premiere difference ligne '
            + (a.findIndex((l, i) => l !== b[i]) + 1));

    const memeTexte = copie.replace(/\r\n/g, '\n').trim() === source.replace(/\r\n/g, '\n').trim();
    if (memeCode && !memeTexte) console.log('  note  indentation differente — sans consequence');
}

// ── Rejouer les tests SUR LA COPIE ───────────────────────────────────────────
if (copie) {
    console.log('');
    console.log('  Rejeu de test-plage.js sur la COPIE embarquee :');
    try {
        const sortie = execFileSync(process.execPath, [path.join(__dirname, 'test-plage.js')], {
            env: Object.assign({}, process.env, { WCT_LIB_COPIE: '1' }),
            encoding: 'utf8',
        });
        const derniere = sortie.trim().split('\n').pop().trim();
        chk('test-plage passe sur la copie', /^TOUT PASSE/.test(derniere), derniere);
    } catch (e) {
        const sortie = (e.stdout || '') + (e.stderr || '');
        chk('test-plage passe sur la copie', false, sortie.trim().split('\n').slice(-4).join('\n        '));
    }
}

console.log('');
console.log(ko === 0 ? 'COPIE CONFORME ET FONCTIONNELLE' : ko + ' PROBLEME(S)');
process.exit(ko === 0 ? 0 : 1);
