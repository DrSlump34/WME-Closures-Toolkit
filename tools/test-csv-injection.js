// Une cellule piégée d'un CSV de virages ne doit ni passer la lecture, ni s'afficher brute.
//
// Audit du 25/09/2026 : la colonne 7 (id du virage) était lue par /.*/ puis écrite telle quelle
// dans un attribut de la carte de file (data-key="${row.rowKey}"). « x"><img src=x onerror=…> »
// passait, et la file étant persistée, le code se réexécutait à chaque ouverture de WME.
// Deux défenses, vérifiées séparément : la lecture (TURN_CSV_RE) et l'affichage (escHtml).
const fs = require('fs');
const SRC = require('path').join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');
const i = txt.indexOf('const TURN_CSV_RE='), j = txt.indexOf('];', i);
const TURN_CSV_RE = new Function(txt.slice(i, j + 2) + '; return TURN_CSV_RE;')();

let ok = 0, ko = 0;
const chk = (nom, cond, detail) => { if (cond) { ok++; console.log('  ok   ' + nom); }
    else { ko++; console.log('  ECHEC ' + nom + (detail !== undefined ? '\n        ' + detail : '')); } };

const PIEGE = 'x"><img src=x onerror=alert(1)>';
console.log('\n— Lecture —');
chk('colonne 7 : la cellule piégée est refusée', !TURN_CSV_RE[7].test(PIEGE));
chk('colonne 9 : la cellule piégée est refusée', !TURN_CSV_RE[9].test(PIEGE));
for (const id of ['123456', '123456f789012r', '12:34:56', 'a-b_c.d', '']) {
    chk('colonne 7 : un identifiant ordinaire passe (« ' + id + ' »)', TURN_CSV_RE[7].test(id));
}
chk('colonne 9 : un MTE numérique passe', TURN_CSV_RE[9].test('1234567'));
chk('témoin : l\'ancienne règle /.*/ laissait passer la cellule', /.*/.test(PIEGE));

console.log('\n— Affichage de la carte de file —');
const ligne = txt.split('\n').find(l => l.includes('class="wct-row-del"'));
chk('data-key échappé', /data-key="\$\{escHtml\(row\.rowKey\)\}"/.test(ligne), ligne && ligne.trim().slice(0, 90));
const ligneSid = txt.split('\n').find(l => l.includes('class="wct-center-seg" data-sid='));
chk('data-sid et texte du segment échappés', ligneSid && !/\$\{row\.sid\}/.test(ligneSid), ligneSid && ligneSid.trim().slice(0, 90));
const ligneNoeud = txt.split('\n').find(l => l.includes('wct-badge-node'));
chk('badge des nœuds échappé', ligneNoeud && !/>\$\{entry\.config\.nodesClosed/.test(ligneNoeud));

console.log('\n' + ok + ' ok, ' + ko + ' échec(s)');
process.exit(ko ? 1 : 0);
