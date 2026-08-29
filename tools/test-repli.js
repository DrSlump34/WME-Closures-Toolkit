// Un panneau replie que l editeur n a PAS replie doit-il se rouvrir ? — la regle
// _repliSubiDoitCesser, EXTRAITE DU FICHIER REEL (methode poly-core.js : jamais une copie).
//
// POURQUOI CE TEST EXISTE (2026-08-29, v1.14.01)
// Glenan56, fil Discord du script : « je selectionne un segment mais rien n apparait dans
// l onglet configurer ». Le panneau n etait pas casse, il etait REPLIE — et il l etait sans
// qu il l ait demande. WCT replie de lui-meme pour liberer la carte pendant un trace de zone,
// et compte sur le RETOUR de sdk.Map.drawPolygon() pour deplier. Si cette promesse ne rend
// jamais la main — trace abandonne sans fermer le polygone — plus rien ne deplie, jamais.
// On ne tient pas la promesse d un SDK qu on ne tient pas ; on tient ce filet.
//
// ⚠️ CE QUE LE FILET NE DOIT PAS FAIRE est aussi important que ce qu il fait : deplier au
// mauvais moment reouvre le panneau EN PLEIN TRACE, c est-a-dire recouvre la carte que le
// repli venait de liberer. D ou le declencheur : le CHANGEMENT de selection, pas sa presence.
// Pendant un trace reel, les clics posent des sommets et ne selectionnent rien — la selection
// ne bouge donc pas. Une selection qui change pendant qu on est cense tracer dit justement que
// le trace n est plus actif. C est l hypothese que ce test verrouille, cas 5.
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');

const DEBUT = 'const _repliSubiDoitCesser';
const i = txt.indexOf(DEBUT);
if (i < 0) {
    console.error('❌ _repliSubiDoitCesser introuvable dans ' + SRC);
    console.error('   Renommee ou supprimee : le reporter ici, sinon ce test ne prouve plus rien.');
    process.exit(2);
}
const j = txt.indexOf(';\n', i);
if (j < 0) { console.error('❌ fin de _repliSubiDoitCesser introuvable'); process.exit(2); }
const code = txt.slice(i, j + 1);

let regle;
try { regle = new Function(code + '\nreturn _repliSubiDoitCesser;')(); }
catch (e) { console.error('❌ _repliSubiDoitCesser ne s evalue pas : ' + e.message); process.exit(2); }

// Le filet est-il encore BRANCHE ? Une regle juste que plus personne n appelle passerait
// tous les cas ci-dessous en laissant le defaut intact.
// ⚠️ On exige `if(` COLLE a l appel, et ce n est pas du zele : chercher seulement le nom de
// la fonction laissait passer un `if(false && _repliSubiDoitCesser(...))` — mesure faite, le
// controle annoncait « le filet est bien APPELE » sur un filet debranche. Une condition
// ajoutee devant lui est exactement la façon dont ce genre de garde meurt.
const branche = /if\(_repliSubiDoitCesser\(\{/.test(txt.slice(txt.indexOf('const updateFab')));
const deplie  = /_repliSubiDoitCesser\([\s\S]{0,400}?_polySetCollapsed\(false\)/.test(txt);

let ok = 0, ko = 0;
const dit = (b, quoi, detail) => {
    console.log('  ' + (b ? 'ok  ' : 'KO  ') + ' ' + quoi + (detail ? '   ' + detail : ''));
    b ? ok++ : ko++;
};

const etat = (o) => Object.assign(
    { replie: false, voulu: false, selection: false, selAChange: false, zoneEdit: false, balayage: false }, o);

// [ etat, doit-il cesser ?, ce que la situation est vraiment ]
const CAS = [
    [{ replie: true,  selection: true,  selAChange: true },
     true,  'LE CAS DE GLENAN : repli subi, un segment est selectionne'],
    [{ replie: true,  voulu: true, selection: true, selAChange: true },
     false, 'repli VOULU par l editeur : il reste replie, meme en selectionnant'],
    [{ replie: true,  selection: true,  selAChange: true, zoneEdit: true },
     false, 'edition d un contour en cours : le repli lui sert, on n y touche pas'],
    [{ replie: true,  selection: true,  selAChange: true, balayage: true },
     false, 'balayage en cours : c est le SCRIPT qui change la selection, pas l editeur'],
    [{ replie: true,  selection: true,  selAChange: false },
     false, 'TRACE EN COURS : selection presente mais INCHANGEE — ne pas recouvrir la carte'],
    [{ replie: true,  selection: false, selAChange: true },
     false, 'plus rien de selectionne : rien a rouvrir'],
    [{ replie: false, selection: true,  selAChange: true },
     false, 'panneau deja ouvert : la regle n a rien a dire'],
];

console.log('\n— La regle, lue dans le fichier reel —');
dit(branche, 'le filet est bien APPELE par updateFab');
dit(deplie,  'et son seul effet est de DEPLIER');

console.log('\n— Table de verite —');
for (const [e, attendu, quoi] of CAS) {
    const r = regle(etat(e));
    dit(r === attendu, quoi, '(rend ' + r + ')');
}

console.log('\n— TEMOIN DE MORSURE : la regle naive « replie + selection ⇒ deplier » —');
// Sans ce temoin, une regle qui repondrait « oui » des qu il y a une selection passerait le
// cas de Glenan et paraitrait suffisante. Ce sont les quatre cas qu elle rate qui font la
// difference entre un filet et un panneau qui se rouvre au milieu d un trace.
const naive = (e) => !!(e.replie && e.selection);
let tombe = 0;
for (const [e, attendu, quoi] of CAS) {
    if (naive(etat(e)) !== attendu) { tombe++; console.log('  ok   la naive se trompe sur « ' + quoi + ' »'); }
}
if (tombe === 0) {
    console.log('\n❌ TEMOIN NON DETECTE : la regle naive passe tous les cas.');
    console.log('   Ces cas ne distinguent donc pas le filet d une condition a deux termes,');
    console.log('   et le « TOUT PASSE » ci-dessus ne vaut pas ce qu il annonce.');
    process.exit(2);
}

console.log('');
console.log(ko === 0
    ? 'TOUT PASSE : ' + ok + ' ok, 0 ko (temoin de morsure : ' + tombe + ' cas rates par la naive)'
    : '❌ ' + ko + ' ECHEC(S) sur ' + (ok + ko));
process.exit(ko === 0 ? 0 : 1);
