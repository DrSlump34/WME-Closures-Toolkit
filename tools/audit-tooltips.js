// Audit : tout element interactif ecrit en HTML doit porter une infobulle.
// Regle posee en 0.77 puis etendue en 0.81 aux select et input — a retenir a chaque ajout.
const fs = require('fs');
const SRC = require('path').join(__dirname,'..','WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');
const lignes = txt.split('\n');

// Balise ouvrante -> on regarde jusqu'au '>' correspondant (l'attribut peut etre sur
// une autre ligne : plusieurs boutons du script sont ecrits sur 2-3 lignes).
const BALISES = ['button', 'select', 'textarea', 'input'];
const sansTitre = [];
const re = new RegExp('<(' + BALISES.join('|') + ')(\\s|>)', 'gi');
let m;
while ((m = re.exec(txt)) !== null) {
    const debut = m.index;
    let fin = txt.indexOf('>', debut);
    if (fin < 0) continue;
    const balise = txt.slice(debut, fin + 1);
    const tag = m[1].toLowerCase();
    // hidden / file interne / bouton d'icone deja titre ailleurs : on regarde juste title
    if (/\stitle\s*=/.test(balise)) continue;
    if (/type\s*=\s*["']hidden["']/.test(balise)) continue;
    const noLigne = txt.slice(0, debut).split('\n').length;
    sansTitre.push({ ligne: noLigne, tag, extrait: balise.replace(/\s+/g, ' ').slice(0, 110) });
}

console.log('Elements interactifs sans attribut title : ' + sansTitre.length + '\n');
sansTitre.forEach(s => console.log('  L' + s.ligne + '  <' + s.tag + '>  ' + s.extrait));

// Ceux du secteur Zone en particulier (ajouts recents)
const zone = sansTitre.filter(s => /poly/i.test(s.extrait));
console.log('\nDont dans le secteur Zone : ' + zone.length);
zone.forEach(s => console.log('  L' + s.ligne + '  ' + s.extrait));
