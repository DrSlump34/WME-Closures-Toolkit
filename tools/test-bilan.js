// Etat d application d une entree de file, et structure du bilan — EXTRAITS DU FICHIER REEL.
//
// POURQUOI CE TEST EXISTE (2026-08-08, v1.11.00)
// L application ecrivait son deroule dans un encart sur fond noir intercale entre la file et
// les boutons : UNE LIGNE PAR OCCURRENCE. Une entree « 21x5 seg » en produisait 21, une file
// de dix cartes deux cents, dans une boite de 180 px — et cent-quatre-vingt-dix-neuf de ces
// lignes annoncaient un succes, c est-a-dire ce qu on attendait. L information rare, celle
// qu on cherchait, s y noyait. L etat vit desormais sur la carte de chaque entree, et le
// detail attend la fin.
//
// Ce que ce test verrouille :
//   1. la regle d etat, cas par cas — c est elle qui decide ce que l editeur voit ;
//   2. « echec » reste reserve au cas ou RIEN n a ete pose : sur un lot a moitie ecrit, il
//      enverrait tout refaire, et l editeur poserait des doublons sur la carte ;
//   3. le bouton « Continuer » de la pause entre lots n est PLUS dans le journal. Il y etait,
//      ce qui faisait du journal un CONTROLE ; le replier — ce que fait cette version —
//      aurait fige l application en attente d un clic sur un bouton devenu invisible.
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');

let ok = 0, ko = 0;
const verifier = (titre, condition, detail) => {
    if (condition) { ok++; console.log('  ok   ' + titre); }
    else { ko++; console.log('  ECHEC ' + titre + (detail ? '\n         ' + detail : '')); }
};

// ── 1. La regle d etat, extraite telle quelle ──
const i = txt.indexOf('const _etatEntree=');
const j = txt.indexOf(';', txt.indexOf('=>', i + 20));
if (i < 0 || j < 0) {
    console.error('❌ _etatEntree introuvable dans ' + SRC);
    console.error('   Renommee ou deplacee : ajuster les bornes de ce test.');
    process.exit(2);
}
const etat = new Function(txt.slice(i, j + 1) + '\nreturn _etatEntree;')();

console.log('\n— La regle d etat, cas par cas (pose / manque / erreur) —');
const CAS = [
    { p: [21, 0, 0], attendu: 'ok',      note: 'tout est passe' },
    { p: [0, 0, 0],  attendu: 'ok',      note: 'entree vide : rien a poser, rien a signaler' },
    { p: [18, 3, 0], attendu: 'partiel', note: '3 segments absents du modele' },
    { p: [18, 0, 2], attendu: 'partiel', note: '2 refus du serveur, mais 18 sont passes' },
    { p: [1, 0, 20], attendu: 'partiel', note: 'UNE SEULE pose reussie suffit a ecarter « echec »' },
    { p: [0, 0, 21], attendu: 'echec',   note: 'rien n a ete ecrit' },
    { p: [0, 5, 0],  attendu: 'partiel', note: 'que des manques : pas une erreur, donc jamais « echec »' },
];
for (const c of CAS) {
    const r = etat(...c.p);
    verifier(c.note + ' [' + c.p.join('/') + '] -> ' + r, r === c.attendu, 'attendu ' + c.attendu);
}

// ── 2. Temoin : une regle qui repondrait toujours la meme chose passerait les cas ci-dessus
//      si l on ne verifiait pas qu elle SAIT distinguer. On exige les trois valeurs.
console.log('\n— Temoin : la regle rend bien trois valeurs distinctes —');
const rendus = new Set(CAS.map(c => etat(...c.p)));
verifier('trois etats distincts observes (' + [...rendus].sort().join(', ') + ')',
    rendus.size === 3 && rendus.has('ok') && rendus.has('partiel') && rendus.has('echec'),
    'une regle qui repond toujours pareil passerait tous les cas d au-dessus');

// ── 3. Le bouton « Continuer » n est plus dans le journal ──
console.log('\n— La pause entre lots ne depend plus du journal —');
const iP = txt.indexOf('const _applyLotPause');
const jP = txt.indexOf('\n});', iP);
if (iP < 0 || jP < 0) {
    console.error('❌ _applyLotPause introuvable — ajuster les bornes de ce test.');
    process.exit(2);
}
const pause = txt.slice(iP, jP);
verifier('elle ne reference plus wct-apply-log', !pause.includes('wct-apply-log'),
    'le bouton Continuer y etait pose : replier le journal figerait l application');
verifier('elle pose son bouton dans le dock de progression', pause.includes('wct-progress-dock'));
verifier('elle se retire toujours (clearInterval + box.remove)',
    pause.includes('clearInterval') && pause.includes('box.remove()'));

// ── 4. Le journal ne s ecrit plus en direct dans le DOM ──
console.log('\n— Le journal est accumule, plus ecrit ligne a ligne —');
const iA = txt.indexOf('const applyQueue');
const jA = txt.indexOf('\nconst _csvQ', iA);
const corpsApply = txt.slice(iA, jA);
verifier('logApply empile en memoire (journal.push)', /const logApply=\(msg,niveau\)=>\{ journal\.push/.test(corpsApply),
    'un appendChild par occurrence est precisement ce qui rendait l encart illisible');
verifier('le bilan est rendu dans le finally', /finally\{[\s\S]*_afficherBilan\(/.test(corpsApply),
    'une exception en cours de route ne doit pas emporter le compte rendu de ce qui est deja ecrit');
verifier('les etats sont remis a zero au DEBUT de l application', corpsApply.includes('_resetEtatsCartes()'));

// ── 5. Le compte du bilan reste visible meme replie ──
console.log('\n— On replie le detail, jamais l information —');
const iB = txt.indexOf('const _afficherBilan');
const corpsBilan = txt.slice(iB, txt.indexOf('\n};', iB));
verifier('le repli ne porte que sur le corps, pas sur l en-tete',
    /wct-bilan-corps"\$\{ouvert\?'':' style="display:none"'\}/.test(corpsBilan),
    'le compte doit rester lisible dans les deux cas');
verifier('un bilan replie qui contient une anomalie porte le point rouge',
    corpsBilan.includes("!ouvert&&anomalies?'<span class=\"wct-bilan-dot\">"),
    'meme regle que les sections de filtres de Recherche');
verifier('il s ouvre de lui-meme quand il y a une anomalie',
    /const ouvert=anomalies>0\|\|!!compte\.interrompu/.test(corpsBilan));

console.log('\n' + (ko === 0 ? 'TOUT PASSE : ' + ok + ' ok, 0 ko' : '❌ ' + ko + ' ECHEC(S) sur ' + (ok + ko)));
process.exit(ko === 0 ? 0 : 1);
