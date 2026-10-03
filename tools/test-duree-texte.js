// Champ Durée de Configurer : un texte « h:mm », plus un <input type="time">.
//
// 03/10/2026 : Trexer0 (Discuss t405542 #83) demande comment passer de AM/PM au format 24 h.
// Les heures de début et de fin sont des heures : le navigateur les affiche selon sa langue,
// c'est voulu. Mais la DURÉE était aussi un type="time" : dans un navigateur réglé en AM/PM,
// une durée de 8 h s'affichait « 08:00 AM », et 13 h « 01:00 PM ». Le champ est désormais du
// texte, remis au format « HH:MM » à la sortie, et une saisie illisible revient à la dernière
// valeur valide en se cadrant de rouge (jamais jetée en silence).
//
// Fait tourner le VRAI normDuree et le VRAI durTimeVal, extraits du fichier livré.
// Témoin : un normDuree qui accepte tout doit faire échouer le contrôle.
const fs = require('fs');
const SRC = require('path').join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');
const extrait = (a, b) => {
    const i = txt.indexOf(a); if (i < 0) throw new Error('introuvable : ' + a);
    const j = txt.indexOf(b, i + a.length); if (j < 0) throw new Error('fin introuvable : ' + a);
    return txt.slice(i, j);
};
const code = extrait('const normDuree=', '\nconst readConfig=');

let ok = 0, ko = 0;
const chk = (nom, cond, detail) => { if (cond) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + (detail !== undefined ? '\n        ' + detail : '')); } };

const monter = source => {
    const el = { value: '08:00', dataset: { ok: '08:00' } };
    const f = new Function('$id', source + '\nreturn { normDuree, durTimeVal };');
    return { el, api: f(id => id === 'wct-dur-time' ? el : null) };
};

const CAS = [
    ['8', '08:00'], ['8:30', '08:30'], ['08:30', '08:30'], ['0:45', '00:45'], ['23:59', '23:59'],
    ['8h30', '08:30'], ['8H', null], ['8.15', '08:15'], [' 7:05 ', '07:05'],
    ['24:00', null], ['8:60', null], ['8:5', null], ['abc', null], ['', null], ['08:00 AM', null],
];

const verifier = (source, bavard) => {
    const { el, api } = monter(source);
    let echecs = 0;
    const c = (nom, cond, d) => { if (!cond) echecs++; if (bavard) chk(nom, cond, d); };
    for (const [entree, attendu] of CAS) {
        const r = api.normDuree(entree);
        c(`normDuree(${JSON.stringify(entree)}) = ${attendu}`, r === attendu, 'rendu : ' + r);
    }
    el.value = '8:';                       // frappe en cours
    c('frappe en cours : la dernière valeur valide fait foi', api.durTimeVal() === '08:00', api.durTimeVal());
    el.value = '13:15';
    c('saisie valide lue telle quelle', api.durTimeVal() === '13:15', api.durTimeVal());
    return echecs;
};

console.log('— code livré —');
verifier(code, true);

console.log('— la page : plus aucun type="time" sur la durée —');
const champ = (txt.match(/<input id="wct-dur-time"[^>]*>/) || [''])[0];
chk('wct-dur-time est un type="text"', /type="text"/.test(champ), champ);
chk('wct-dur-time n\'est plus un type="time"', !/type="time"/.test(champ), champ);
chk('aucun lecteur ne relit le champ brut', !/\$id\('wct-dur-time'\)\?\.value/.test(txt));

console.log('— témoin : un normDuree qui accepte tout —');
const temoin = code.replace(/if\(!m\) return null;/, 'if(!m) return String(s);')
                   .replace(/if\(h>23\|\|mn>59\) return null;/, '');
chk('le témoin a bien été fabriqué', temoin !== code);
const nt = verifier(temoin, false);
chk(`le témoin échoue (${nt} échec(s))`, nt > 0);

console.log(`\n${ok} ok, ${ko} échec(s)`);
process.exit(ko ? 1 : 0);
