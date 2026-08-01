// Controle des emojis AFFICHES : tout caractere dont Emoji_Presentation est FAUX doit
// etre suivi du selecteur de variante U+FE0F, sinon le navigateur le rend en GLYPHE
// TEXTE monochrome — fin, pale, parfois quasi invisible.
//
// Pourquoi ce script existe (2026-08-01) : le piege avait deja ete rencontre en 0.81.00
// et corrige pour un seul caractere (l'info, mesuree a 4,2 px de large). L'audit du 01/08
// a montre qu'il en restait douze dans ce cas, dont TOUTE la barre d'action basse
// (Appliquer, Vider, Valider, Stop, les exports). Personne ne l'avait vu parce qu'aucun
// test ne le regardait.
//
// ⚠️ Le fichier ecrit ces caracteres sous DEUX formes : le caractere reel, ou son
// echappement \uXXXX. Le controle normalise donc la ligne avant de chercher.
// ⚠️ Les commentaires sont ignores : un emoji dans un commentaire ne se rend nulle part.
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const lignes = fs.readFileSync(SRC, 'utf8').split('\n');

// Points de code a Emoji_Presentation = false employes dans ce fichier.
// Liste explicite plutot que derivee d'une propriete Unicode : lisible, sans dependance,
// et c'est elle qui documente le probleme. En ajouter une entree quand on introduit un
// nouveau caractere de ce type.
const CIBLES = [
    [0x2B07, 'fleche bas'],   [0x2B06, 'fleche haut'], [0x25B6, 'lecture'],
    [0x23F9, 'stop'],         [0x23F1, 'chrono'],      [0x1F5D1, 'corbeille'],
    [0x2714, 'coche'],        [0x2699, 'engrenage'],   [0x26A0, 'attention'],
    [0x2139, 'info'],         [0x270F, 'crayon'],      [0x2328, 'clavier'],
    [0x1F441, 'oeil'],        [0x1F5FA, 'carte'],      [0x21A9, 'retour'],
];
const VS16 = 0xFE0F;

// Remplace les echappements \uXXXX (et les paires de substitution) par leurs caracteres,
// pour que la recherche voie la meme chose quelle que soit l'ecriture employee.
const normaliser = (s) => s.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
const estCommentaire = (l) => /^\s*(\/\/|\*|\/\*)/.test(l);

let ok = 0, manquants = 0;
const details = [];
lignes.forEach((ligne, i) => {
    if (estCommentaire(ligne)) return;
    const n = normaliser(ligne);
    const pts = [...n].map(c => c.codePointAt(0));
    // [...n] decoupe par point de code : une paire de substitution compte pour un.
    for (let k = 0; k < pts.length; k++) {
        const cible = CIBLES.find(([cp]) => cp === pts[k]);
        if (!cible) continue;
        if (pts[k + 1] === VS16) { ok++; continue; }
        manquants++;
        if (details.length < 30) details.push('  L' + (i + 1) + '  ' + cible[1].padEnd(11) + ligne.trim().slice(0, 68));
    }
});

console.log('emojis suivis de U+FE0F        : ' + ok);
console.log('emojis SANS U+FE0F (rendu texte) : ' + manquants);
if (manquants) {
    console.log('');
    details.forEach(d => console.log(d));
    if (manquants > 30) console.log('  … et ' + (manquants - 30) + ' autres');
    console.log('\nECHEC : ces caracteres sont rendus en glyphe texte monochrome.');
    process.exit(1);
}
console.log('\nTOUT PASSE : aucun emoji affiche sans son selecteur de variante');
