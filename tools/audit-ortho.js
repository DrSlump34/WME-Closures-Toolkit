// Controle orthographique des TEXTES AFFICHES (le dictionnaire), pas des commentaires.
// Cherche les fautes qui se voient : accents manquants, doubles espaces, espaces avant
// une ponctuation double sans insecable, apostrophes droites.
// ⚠️ Extraction via tools/lib-dico.js depuis le 01/08/2026 (copie locale supprimee).
const { D } = require('./lib-dico.js').charger();

const rendre = v => { try { return typeof v === 'function' ? String(v(1, 2, 3)) : String(v ?? ''); } catch (e) { return ''; } };
const pbs = { accents: [], doubleEspace: [], apostropheDroite: [], ponctuation: [], majuscule: [] };
const SANS_ACCENT = /\b(deja|tres|apres|etre|meme|creer|generer|selectionner|fermetures?\b(?=[^\n]*\bdeja)|periode|duree|evenement|zone tracee|prereglages?|resultats?|numero|donnee|verifier|reglage)\b/i;

for (const [cle, val] of Object.entries(D.fr || {})) {
    const s = rendre(val);
    if (!s) continue;
    const nu = s.replace(/<[^>]+>/g, '');                       // sans balises
    if (SANS_ACCENT.test(nu)) pbs.accents.push(cle + ' : ' + nu.slice(0, 60));
    if (/[^\s]  +[^\s]/.test(nu)) pbs.doubleEspace.push(cle + ' : ' + nu.slice(0, 60));
    if (/\w'\w/.test(nu)) pbs.apostropheDroite.push(cle + ' : ' + nu.slice(0, 60));
    // En francais, « : ; ! ? » veulent une espace INSECABLE devant
    if (/[^\s\u00A0\u202F][:;!?](\s|$)/.test(nu.replace(/https?:\/\/\S+/g, '')) && /[:;!?]/.test(nu))
        pbs.ponctuation.push(cle + ' : ' + nu.slice(0, 60));
}
for (const [k, v] of Object.entries(pbs)) {
    console.log('\n### ' + k + ' (' + v.length + ')');
    v.slice(0, 14).forEach(x => console.log('   ' + x));
}
