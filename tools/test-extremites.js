#!/usr/bin/env node
// test-extremites.js — le 1er et le dernier segment d un parcours entrent-ils bien
// dans la selection, sans ouvrir la porte a tout le reste ?
//
// POURQUOI CE CONTROLE EXISTE
// ---------------------------
// COVERAGE_SPAN_FRAC exige qu un segment soit longe sur au moins 30 % de sa longueur.
// Or un GPS demarre et s arrete AU MILIEU d un segment, jamais sur un noeud : le
// premier et le dernier segment d un trace sont donc rejetes PAR CONSTRUCTION.
// MisterLogik l a signale le 14/08/2026 (« il n a selectionne que la fin ») ; l auteur
// a tranche le 15/08 : exempter les deux extremites du PARCOURS, et elles seules.
//
// Le piege que ce test surveille : une exemption trop large redonnerait exactement le
// faux positif de carrefour que le seuil existe pour ecarter. D ou le temoin du
// segment FAIBLEMENT longe AU MILIEU, qui doit rester rejete dans tous les cas.
//
// Tout est extrait du fichier REEL, pas recopie.
'use strict';
const fs = require('fs');
const path = require('path');

const FICHIER = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const src = fs.readFileSync(FICHIER, 'utf8');

let ok = 0, ko = 0;
const dit = (b, quoi, detail) => {
    console.log('  ' + (b ? 'ok  ' : 'KO  ') + ' ' + quoi + (detail ? '   ' + detail : ''));
    b ? ok++ : ko++;
};

// ── Extraction du fichier reel ─────────────────────────────────────────────
const coupe = (debut, finAncre) => {
    const d = src.indexOf(debut);
    if (d < 0) { console.error('ECHEC : ancre introuvable -> ' + debut); process.exit(1); }
    const f = src.indexOf(finAncre, d);
    if (f < 0) { console.error('ECHEC : fin introuvable pour -> ' + debut); process.exit(1); }
    return src.slice(d, f);
};

const seuils = coupe('const COVERAGE_SNAP_M', 'const COVERAGE_MAX_EVAL');
const noyau  = coupe('const _covNewAcc', 'const _covProteger');
const proj   = coupe('const _covProjEdge', 'const _covBBox');

for (const [nom, bloc, attendu] of [['seuils', seuils, 'COVERAGE_SPAN_FRAC'],
                                    ['noyau',  noyau,  '_covFinalizeUsed'],
                                    ['proj',   proj,   '_covProjEdge']]) {
    if (!bloc.includes(attendu)) { console.error('ECHEC : bloc ' + nom + ' incomplet'); process.exit(1); }
}
if (!noyau.includes('bornes')) { console.error('ECHEC : _covFinalizeUsed ne prend pas de bornes'); process.exit(1); }
if (!noyau.includes('idxBase')) { console.error('ECHEC : _covAccumulate ne prend pas d idxBase'); process.exit(1); }

const F = new Function(seuils + '\n' + proj + '\n' + noyau +
    '\nreturn {_covNewAcc,_covAccumulate,_covFinalizeUsed,COVERAGE_SPAN_FRAC,COVERAGE_MIN_PTS};')();
const { _covNewAcc, _covAccumulate, _covFinalizeUsed, COVERAGE_SPAN_FRAC } = F;

// ── Une carte de test : 3 segments alignes d ouest en est ──────────────────
// Chacun fait ~200 m. Le trace ne longe QUE la fin du seg A, tout le seg B, et
// seulement le debut du seg C — soit exactement la forme d un parcours GPS reel.
const M = 1 / 111320;                       // ~1 m en degres de longitude a l equateur
const seg = (id, x0, x1) => ({ id, a: [x0, 0], b: [x1, 0], L: (x1 - x0) / M, cum: 0 });

const index = (() => {
    const edges = [seg(101, 0,        200 * M),        // A : le PREMIER du parcours
                   seg(102, 200 * M,  400 * M),        // B : longe en entier
                   seg(103, 400 * M,  600 * M),        // C : le DERNIER du parcours
                   seg(104, 200 * M,  400 * M)];       // D : temoin, au MILIEU, a peine longe
    // le temoin D est decale de 25 m au nord : les points ne le rattachent qu au passage
    edges[3].a = [200 * M, 25 / 110540]; edges[3].b = [400 * M, 25 / 110540];
    const segPolyLen = {}; edges.forEach(e => { segPolyLen[e.id] = e.L; });
    const cellDeg = 0.0006, grid = new Map();
    edges.forEach((e, i) => {
        const iMin = Math.floor(Math.min(e.a[0], e.b[0]) / cellDeg), iMax = Math.floor(Math.max(e.a[0], e.b[0]) / cellDeg);
        const jMin = Math.floor(Math.min(e.a[1], e.b[1]) / cellDeg), jMax = Math.floor(Math.max(e.a[1], e.b[1]) / cellDeg);
        for (let x = iMin; x <= iMax; x++) for (let y = jMin; y <= jMax; y++) {
            const k = x + '|' + y; let arr = grid.get(k); if (!arr) { arr = []; grid.set(k, arr); } arr.push(i);
        }
    });
    return { edges, grid, segPolyLen, cellDeg };
})();

// Le trace : de 180 m (dans A) a 420 m (dans C), un point tous les 3 m.
const pts = [];
for (let x = 180; x <= 420; x += 3) pts.push([x * M, 0]);

const acc = _covNewAcc();
_covAccumulate(pts, index, acc, 0);

const pct = id => Math.round(100 * (acc.spanMax[id] - acc.spanMin[id]) / acc.segLen[id]);

console.log('\n— Ce que le trace longe reellement —');
console.log('   seg 101 (1er)    : ' + pct(101) + ' % de sa longueur');
console.log('   seg 102 (milieu) : ' + pct(102) + ' %');
console.log('   seg 103 (dernier): ' + pct(103) + ' %');
console.log('   seuil exige      : ' + Math.round(COVERAGE_SPAN_FRAC * 100) + ' %');

// ── Les cas ────────────────────────────────────────────────────────────────
const sans   = _covFinalizeUsed(acc);
const debut  = _covFinalizeUsed(acc, { debut: true,  fin: false });
const fin    = _covFinalizeUsed(acc, { debut: false, fin: true  });
const lesDeux= _covFinalizeUsed(acc, { debut: true,  fin: true  });

console.log('\n— TEMOIN : sans exemption, les extremites doivent etre PERDUES —');
dit(!sans.includes(101), 'le 1er segment est rejete', '(c est le defaut signale)');
dit(!sans.includes(103), 'le dernier segment est rejete');
dit(sans.includes(102),  'le segment longe en entier passe, lui');

console.log('\n— Avec exemption —');
dit(debut.includes(101),  'debut:true rattrape le 1er segment');
dit(!debut.includes(103), 'debut:true ne rattrape PAS le dernier');
dit(fin.includes(103),    'fin:true rattrape le dernier segment');
dit(!fin.includes(101),   'fin:true ne rattrape PAS le 1er');
dit(lesDeux.includes(101) && lesDeux.includes(103), 'les deux ensemble rattrapent les deux bouts');

console.log('\n— TEMOIN ANTI-DEBORDEMENT : l exemption ne doit RIEN elargir d autre —');
const enTrop = lesDeux.filter(id => !sans.includes(id) && id !== 101 && id !== 103);
dit(enTrop.length === 0, 'aucun segment autre que les 2 extremites n entre', enTrop.length ? '(en trop : ' + enTrop + ')' : '');
dit(!lesDeux.includes(104), 'le temoin faiblement longe AU MILIEU reste rejete', '(sinon le faux positif de carrefour revient)');

console.log('\n— TEMOIN : un lot du MILIEU ne doit rien exempter —');
const milieu = _covFinalizeUsed(acc, { debut: false, fin: false });
dit(milieu.length === sans.length, 'bornes toutes fausses == pas de bornes du tout');

console.log('\n— Verdict —');
console.log(ko ? '  ' + ko + ' KO sur ' + (ok + ko) + '\n\nECHEC\n' : '  ' + ok + ' ok, 0 ko\n\nTOUT PASSE\n');
process.exit(ko ? 1 : 0);
