// Recopie lib/WMECreneaux.js dans le userscript, à l'emplacement de la copie.
//
// Pourquoi un outil plutôt qu'un copier-coller : ce qui est COPIÉ doit être
// exactement ce qui est COMPARÉ. check-lib-creneaux.js compare le bloc
// « var WMECreneaux = (function … )(); » et rien d'autre — si la copie embarquait
// en plus l'en-tête documentaire du fichier, cet en-tête pourrait vieillir sans
// que rien ne le signale. L'outil ne copie donc que le bloc, et le bandeau
// renvoie à la source pour le reste.
//
//   node tools/sync-lib-creneaux.js          voir ce qui changerait
//   node tools/sync-lib-creneaux.js --ecrire  l'appliquer
const fs = require('fs');
const { SRC, codeSource, codeCopie } = require('./lib-creneaux-source.js');

const source = codeSource();
if (!source) { console.error('❌ Bloc introuvable dans lib/WMECreneaux.js'); process.exit(2); }

const txt = fs.readFileSync(SRC, 'utf8');
const copie = codeCopie();
if (!copie) { console.error('❌ Copie introuvable dans le userscript'); process.exit(2); }

if (copie === source) { console.log('Deja identique — rien a faire.'); process.exit(0); }

const neuf = txt.replace(copie, source);
if (neuf === txt) { console.error('❌ Remplacement sans effet'); process.exit(2); }

console.log('copie : ' + copie.length + ' caracteres  ->  source : ' + source.length);
if (process.argv.includes('--ecrire')) {
    // .tmp puis renommage : une écriture interrompue ne doit pas laisser un
    // userscript tronqué à la place d'un userscript valide.
    fs.writeFileSync(SRC + '.tmp', neuf, 'utf8');
    if (fs.statSync(SRC + '.tmp').size < Buffer.byteLength(txt, 'utf8') * 0.9) {
        console.error('❌ Le fichier ecrit est anormalement petit — abandon');
        fs.unlinkSync(SRC + '.tmp');
        process.exit(2);
    }
    fs.renameSync(SRC + '.tmp', SRC);
    console.log('Userscript mis a jour. Lancer check-lib-creneaux.js pour confirmer.');
} else {
    console.log('(essai a blanc — relancer avec --ecrire pour appliquer)');
}
