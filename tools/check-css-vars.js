// Toute variable CSS employee — var(--wct-…) — doit etre DECLAREE quelque part.
//
// Pourquoi ce script existe (2026-08-01, signale par l'auteur capture a l'appui) :
// le panneau des raccourcis s'affichait SANS FOND, illisible par-dessus l'onglet actif.
// Cause : `background: var(--wct-card)` — une variable qui n'existe pas. La surface du
// theme s'appelle --wct-surface. Une var() inconnue ne provoque AUCUNE erreur : la
// propriete est simplement ignoree, donc le fond reste transparent et rien ne le dit.
// La meme faute dormait dans le thead collant des resultats de recherche, ou personne
// ne l'aurait vue avant longtemps.
//
// C'est exactement le genre de defaut que les tests ne voient pas (il est de RENDU) et
// qu'un controle statique attrape en une seconde.
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');

// Declarations : --wct-x: valeur;  (dans :root comme dans n'importe quel bloc)
const declarees = new Set([...txt.matchAll(/(--wct-[a-z0-9-]+)\s*:/gi)].map(m => m[1].toLowerCase()));
// Emplois : var(--wct-x)
const emplois = [...txt.matchAll(/var\(\s*(--wct-[a-z0-9-]+)\s*(?:,[^)]*)?\)/gi)];

const manquantes = new Map();
for (const m of emplois) {
    const nom = m[1].toLowerCase();
    if (declarees.has(nom)) continue;
    // var(--x, repli) est licite : le repli couvre l'absence.
    if (/var\(\s*--wct-[a-z0-9-]+\s*,/i.test(m[0])) continue;
    const ligne = txt.slice(0, m.index).split('\n').length;
    if (!manquantes.has(nom)) manquantes.set(nom, []);
    manquantes.get(nom).push(ligne);
}

console.log('variables declarees : ' + declarees.size);
console.log('emplois de var()    : ' + emplois.length);
if (manquantes.size) {
    console.log('');
    for (const [nom, lignes] of manquantes) {
        console.log('  ECHEC ' + nom + '  employee L' + lignes.join(', L') + ' — jamais declaree');
    }
    console.log('\nECHEC : une var() inconnue est ignoree en silence — la propriete ne s applique pas.');
    process.exit(1);
}
console.log('\nTOUT PASSE : toutes les variables employees sont declarees');
