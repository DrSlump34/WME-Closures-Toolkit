// Controle des ratios de contraste WCAG des couleurs du theme, lues DANS le fichier reel.
//
// Pourquoi ce script existe (2026-08-01) : l audit a mesure 41 paires en echec sur 90.
// Le pire venait du theme compact, qui repeint le fond en gris Win95 sans redefinir les
// couleurs de texte secondaire : --wct-text2 y tombait a 2,21:1 et --wct-grey a 1,47:1,
// c est-a-dire quasi invisible. Personne ne l avait vu parce qu aucun test ne regardait
// les couleurs — on les juge a l oeil, et l oeil s habitue.
//
// Il ne controle QUE les variables du theme : le reste du CSS emploie des couleurs en
// dur, souvent sur des fonds variables, qu on ne peut pas apparier de facon fiable sans
// rendre la page. Mieux vaut un controle etroit et sur qu un controle large et faux.
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');

const lum = (hex) => {
    const c = hex.replace('#', '');
    const v = [0, 2, 4].map(i => {
        const x = parseInt(c.substr(i, 2), 16) / 255;
        return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
};
const ratio = (a, b) => {
    const l1 = lum(a), l2 = lum(b);
    const [h, l] = l1 > l2 ? [l1, l2] : [l2, l1];
    return (h + 0.05) / (l + 0.05);
};

// Lit une variable CSS. `portee` limite la recherche a un bloc (pour le theme compact).
const variable = (nom, portee) => {
    let zone = txt;
    if (portee) {
        const i = txt.indexOf(portee);
        if (i < 0) return null;
        zone = txt.slice(i, i + 400);
    }
    // Toutes les variables du theme portent le prefixe wct-.
    const m = zone.match(new RegExp('--wct-' + nom + '\\s*:\\s*(#[0-9a-fA-F]{6})'));
    return m ? m[1].toLowerCase() : null;
};

const COMPACT = '#wct-overlay.wct-compact { background:';
const cas = [
    // libelle                              texte                       fond          seuil
    ['texte principal sur carte',           variable('text'),           '#ffffff',    4.5],
    ['texte secondaire sur carte',          variable('text2'),          '#ffffff',    4.5],
    ['texte secondaire sur fond',           variable('text2'),          variable('bg'), 4.5],
    ['texte compact sur gris Win95',        '#000000',                  '#c0c0c0',    4.5],
    ['texte secondaire compact',            variable('text2', COMPACT), '#c0c0c0',    4.5],
    ['gris compact (« et N autres »)',      variable('grey', COMPACT),  '#c0c0c0',    4.5],
];

let ko = 0;
console.log('libelle                              | texte   | fond    | ratio | seuil');
console.log('-------------------------------------|---------|---------|-------|------');
for (const [nom, fg, bg, seuil] of cas) {
    if (!fg || !bg) {
        console.log(nom.padEnd(36) + ' | VARIABLE INTROUVABLE — le theme a change, ajuster ce script');
        ko++;
        continue;
    }
    const r = ratio(fg, bg);
    const bon = r >= seuil;
    if (!bon) ko++;
    console.log(nom.padEnd(36) + ' | ' + fg.padEnd(7) + ' | ' + bg.padEnd(7) + ' | '
        + r.toFixed(2).padStart(5) + ' |  ' + seuil + (bon ? '' : '   ← ECHEC'));
}
console.log('');
if (ko) {
    console.log('ECHEC : ' + ko + ' paire(s) sous le seuil WCAG.');
    process.exit(1);
}
console.log('TOUT PASSE : les couleurs du theme respectent le seuil de 4,5:1');
