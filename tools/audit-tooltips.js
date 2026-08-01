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
    // ⚠️ Un champ ENVELOPPE par un <label> est deja nomme : l'association est implicite,
    // c'est la forme la plus sure et le script l'emploie deja (.wct-check, les radios de
    // format de date). Les signaler etait un FAUX POSITIF — et un outil qui reclame de
    // « corriger » ce qui va bien fait ajouter du bruit, ou pire, fait douter du reste.
    // On remonte jusqu'au <label> ouvrant le plus proche : s'il n'est pas encore ferme
    // quand le champ arrive, le champ est dedans.
    const avant = txt.slice(Math.max(0, debut - 600), debut);
    const dernierLabel = avant.lastIndexOf('<label');
    if (dernierLabel >= 0 && !avant.slice(dernierLabel).includes('</label>')) continue;
    // Idem pour aria-label / aria-labelledby, qui nomment tout aussi bien.
    if (/\saria-label(ledby)?\s*=/.test(balise)) continue;
    const noLigne = txt.slice(0, debut).split('\n').length;
    sansTitre.push({ ligne: noLigne, tag, extrait: balise.replace(/\s+/g, ' ').slice(0, 110) });
}

console.log('Elements interactifs sans attribut title : ' + sansTitre.length + '\n');
sansTitre.forEach(s => console.log('  L' + s.ligne + '  <' + s.tag + '>  ' + s.extrait));

// Ceux du secteur Zone en particulier (ajouts recents)
const zone = sansTitre.filter(s => /poly/i.test(s.extrait));
console.log('\nDont dans le secteur Zone : ' + zone.length);
zone.forEach(s => console.log('  L' + s.ligne + '  ' + s.extrait));
