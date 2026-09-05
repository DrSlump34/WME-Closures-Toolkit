#!/usr/bin/env node
// test-feries-regions.js — Les jours feries REGIONAUX sont-ils filtres ?
//
// POURQUOI CE CONTROLE EXISTE
// ---------------------------
// L API date.nager.at rend les feries du PAYS, nationaux et regionaux melanges.
// Jusqu a la 1.14.04 le script gardait TOUTES les dates rendues. Mesure le
// 05/09/2026 : la France a 0 ferie regional sur 11 — mais l Australie en a 21 sur
// 27 et la Suisse 29 sur 33. Coche « sauf jours feries », un editeur australien
// perdait 21 dates ouvrables chez lui. Le defaut etait STRICTEMENT INVISIBLE
// depuis la France : c est pour cela qu il a vecu si longtemps, et c est pour cela
// que ce controle rejoue des donnees AUSTRALIENNES et SUISSES, pas francaises.
//
// CE QU IL FAIT
// -------------
// Il n ecrit pas un double des fonctions : il EXTRAIT le bloc « PAYS & JOURS
// FERIES » du fichier reel — meme methode que check-lib-creneaux.js — et le rejoue
// sur des reponses d API capturees verbatim le 05/09/2026. Ce qui est mesure est
// donc le code servi, pas une paraphrase.
//
// LE SENS DE L ERREUR, QUI COMMANDE TOUT
// --------------------------------------
// Sur-filtrer retire une nuit du chantier : l editeur le voit et rajoute la date.
// Sous-filtrer FERME UNE ROUTE le jour ou il ne fallait pas — le 25 decembre. Le
// verrou de region inconnue existe pour cela, et plusieurs verifications ci-dessous
// ne mesurent QUE ce sens-la.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const FICHIER = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const src = fs.readFileSync(FICHIER, 'utf8');

let ok = 0, ko = 0;
const dit = (b, quoi, detail) => {
    console.log('  ' + (b ? 'ok  ' : 'KO  ') + ' ' + quoi + (detail ? '   ' + detail : ''));
    b ? ok++ : ko++;
};

// ── Extraction du bloc reel ────────────────────────────────────────────────
// Bornes choisies sur des commentaires de section, pas sur du code : elles ne
// bougent pas quand une fonction est retouchee.
const DEBUT = '// ─── LE CODE PAYS DE WME';
const FIN = '// ─── Tile build timestamp';
const iD = src.indexOf(DEBUT), iF = src.indexOf(FIN);
if (iD < 0 || iF < 0 || iF <= iD) {
    console.error('ABANDON : bloc « PAYS & JOURS FERIES » introuvable dans le userscript.');
    console.error('  debut trouve : ' + (iD >= 0) + '   fin trouvee : ' + (iF >= 0));
    process.exit(1);
}
const BLOC = src.slice(iD, iF);

// ── Reponses d API capturees le 05/09/2026 ─────────────────────────────────
// Verbatim, champs conserves tels que l API les rend. AU et CH sont les deux pays
// a feries regionaux cites par maporaptor et par le releve ; FR est le temoin
// inverse — le pays ou ce chantier ne doit RIEN changer.
const REPONSES = {
    AU: [
        {"date":"2026-01-01","localName":"New Year's Day","global":true,"counties":null},
        {"date":"2026-01-26","localName":"Australia Day","global":true,"counties":null},
        {"date":"2026-03-02","localName":"Labour Day","global":false,"counties":["AU-WA"]},
        {"date":"2026-03-09","localName":"Canberra Day","global":false,"counties":["AU-ACT"]},
        {"date":"2026-03-09","localName":"Adelaide Cup Day","global":false,"counties":["AU-SA"]},
        {"date":"2026-03-09","localName":"Eight Hours Day","global":false,"counties":["AU-TAS"]},
        {"date":"2026-03-09","localName":"Labour Day","global":false,"counties":["AU-VIC"]},
        {"date":"2026-04-03","localName":"Good Friday","global":true,"counties":null},
        {"date":"2026-04-04","localName":"Easter Eve","global":false,"counties":["AU-ACT","AU-NSW","AU-NT","AU-QLD","AU-SA","AU-VIC"]},
        {"date":"2026-04-05","localName":"Easter Sunday","global":false,"counties":["AU-ACT","AU-NSW","AU-NT","AU-QLD","AU-SA","AU-VIC","AU-WA"]},
        {"date":"2026-04-06","localName":"Easter Monday","global":true,"counties":null},
        {"date":"2026-04-25","localName":"Anzac Day","global":false,"counties":["AU-SA","AU-TAS","AU-VIC"]},
        {"date":"2026-04-27","localName":"Anzac Day","global":false,"counties":["AU-NSW","AU-ACT","AU-WA"]},
        {"date":"2026-04-25","localName":"Anzac Day","global":false,"counties":["AU-NT","AU-QLD"]},
        {"date":"2026-05-04","localName":"May Day","global":false,"counties":["AU-NT"]},
        {"date":"2026-05-04","localName":"Labour Day","global":false,"counties":["AU-QLD"]},
        {"date":"2026-06-01","localName":"Reconciliation Day","global":false,"counties":["AU-ACT"]},
        {"date":"2026-06-01","localName":"Western Australia Day","global":false,"counties":["AU-WA"]},
        {"date":"2026-06-08","localName":"King's Birthday","global":false,"counties":["AU-ACT","AU-NSW","AU-NT","AU-SA","AU-TAS","AU-VIC"]},
        {"date":"2026-08-03","localName":"Picnic Day","global":false,"counties":["AU-NT"]},
        {"date":"2026-09-25","localName":"Friday before AFL Grand Final","global":false,"counties":["AU-VIC"]},
        {"date":"2026-09-28","localName":"King's Birthday","global":false,"counties":["AU-WA"]},
        {"date":"2026-10-05","localName":"Labour Day","global":false,"counties":["AU-ACT","AU-NSW","AU-SA"]},
        {"date":"2026-10-05","localName":"King's Birthday","global":false,"counties":["AU-QLD"]},
        {"date":"2026-11-03","localName":"Melbourne Cup","global":false,"counties":["AU-VIC"]},
        {"date":"2026-12-25","localName":"Christmas Day","global":true,"counties":null},
        {"date":"2026-12-28","localName":"Boxing Day","global":true,"counties":null},
    ],
    FR: [
        {"date":"2026-01-01","localName":"Jour de l'an","global":true,"counties":null},
        {"date":"2026-04-06","localName":"Lundi de Pâques","global":true,"counties":null},
        {"date":"2026-05-01","localName":"Fête du Travail","global":true,"counties":null},
        {"date":"2026-05-08","localName":"Victoire 1945","global":true,"counties":null},
        {"date":"2026-05-14","localName":"Ascension","global":true,"counties":null},
        {"date":"2026-05-25","localName":"Lundi de Pentecôte","global":true,"counties":null},
        {"date":"2026-07-14","localName":"Fête nationale","global":true,"counties":null},
        {"date":"2026-08-15","localName":"Assomption","global":true,"counties":null},
        {"date":"2026-11-01","localName":"Toussaint","global":true,"counties":null},
        {"date":"2026-11-11","localName":"Armistice 1918","global":true,"counties":null},
        {"date":"2026-12-25","localName":"Noël","global":true,"counties":null},
    ],
    AT: [
        {"date":"2026-01-01","localName":"Neujahr","global":true,"counties":null},
        {"date":"2026-01-06","localName":"Heilige Drei Könige","global":true,"counties":null},
        {"date":"2026-03-19","localName":"Josefstag","global":false,"counties":["AT-2","AT-6","AT-7","AT-8"]},
        {"date":"2026-04-05","localName":"Ostersonntag","global":true,"counties":null},
        {"date":"2026-04-06","localName":"Ostermontag","global":true,"counties":null},
        {"date":"2026-05-01","localName":"Staatsfeiertag","global":true,"counties":null},
        {"date":"2026-05-04","localName":"Florianitag","global":false,"counties":["AT-4"]},
        {"date":"2026-05-14","localName":"Christi Himmelfahrt","global":true,"counties":null},
        {"date":"2026-05-24","localName":"Pfingstsonntag","global":true,"counties":null},
        {"date":"2026-05-25","localName":"Pfingstmontag","global":true,"counties":null},
        {"date":"2026-06-04","localName":"Fronleichnam","global":true,"counties":null},
        {"date":"2026-08-15","localName":"Maria Himmelfahrt","global":true,"counties":null},
        {"date":"2026-09-24","localName":"Rupertitag","global":false,"counties":["AT-5"]},
        {"date":"2026-10-26","localName":"Nationalfeiertag","global":true,"counties":null},
        {"date":"2026-11-01","localName":"Allerheiligen","global":true,"counties":null},
        {"date":"2026-11-11","localName":"Martinstag","global":false,"counties":["AT-1"]},
        {"date":"2026-11-15","localName":"Leopolditag","global":false,"counties":["AT-3","AT-9"]},
        {"date":"2026-12-08","localName":"Mariä Empfängnis","global":true,"counties":null},
        {"date":"2026-12-25","localName":"Weihnachten","global":true,"counties":null},
        {"date":"2026-12-26","localName":"Stefanitag","global":true,"counties":null},
    ],
    CH: [
        {"date":"2026-01-01","localName":"Neujahr","global":true,"counties":null},
        {"date":"2026-01-02","localName":"Berchtoldstag","global":false,"counties":["CH-BE","CH-FR","CH-SH","CH-AG","CH-TG","CH-VD"]},
        {"date":"2026-01-06","localName":"Heilige Drei Könige","global":false,"counties":["CH-TI"]},
        {"date":"2026-01-06","localName":"Heilige Drei Könige","global":false,"counties":["CH-UR","CH-SZ"]},
        {"date":"2026-03-01","localName":"Jahrestag der Ausrufung der Republik","global":false,"counties":["CH-NE"]},
        {"date":"2026-03-19","localName":"Josefstag","global":false,"counties":["CH-SZ","CH-VS"]},
        {"date":"2026-03-19","localName":"Josefstag","global":false,"counties":["CH-LU","CH-UR","CH-NW","CH-TI"]},
        {"date":"2026-04-03","localName":"Karfreitag","global":false,"counties":["CH-ZH","CH-BE","CH-LU","CH-UR","CH-SZ","CH-OW","CH-NW","CH-GL","CH-ZG","CH-FR","CH-SO","CH-BS","CH-BL","CH-SH","CH-AR","CH-AI","CH-SG","CH-GR","CH-AG","CH-TG","CH-VD","CH-NE","CH-GE","CH-JU"]},
        {"date":"2026-04-04","localName":"Näfelser Fahrt","global":false,"counties":["CH-GL"]},
        {"date":"2026-04-06","localName":"Ostermontag","global":false,"counties":["CH-ZH","CH-BE","CH-GL","CH-FR","CH-BS","CH-BL","CH-SH","CH-AR","CH-AI","CH-SG","CH-GR","CH-AG","CH-TG","CH-TI","CH-VD","CH-GE","CH-JU"]},
        {"date":"2026-04-06","localName":"Ostermontag","global":false,"counties":["CH-UR","CH-SZ","CH-OW"]},
        {"date":"2026-05-01","localName":"Tag der Arbeit","global":false,"counties":["CH-ZH","CH-SO","CH-BS","CH-BL","CH-SH","CH-NE","CH-JU"]},
        {"date":"2026-05-01","localName":"Tag der Arbeit","global":false,"counties":["CH-TG","CH-TI"]},
        {"date":"2026-05-14","localName":"Auffahrt","global":true,"counties":null},
        {"date":"2026-05-25","localName":"Pfingstmontag","global":false,"counties":["CH-ZH","CH-BE","CH-GL","CH-FR","CH-BS","CH-BL","CH-SH","CH-AR","CH-AI","CH-SG","CH-GR","CH-AG","CH-TG","CH-VD","CH-GE","CH-JU"]},
        {"date":"2026-05-25","localName":"Pfingstmontag","global":false,"counties":["CH-UR","CH-SZ","CH-OW","CH-TI"]},
        {"date":"2026-06-04","localName":"Fronleichnam","global":false,"counties":["CH-LU","CH-UR","CH-SZ","CH-OW","CH-NW","CH-ZG","CH-FR","CH-SO","CH-AI","CH-AG","CH-VS","CH-JU"]},
        {"date":"2026-06-04","localName":"Fronleichnam","global":false,"counties":["CH-TI"]},
        {"date":"2026-06-29","localName":"Peter und Paul","global":false,"counties":["CH-TI"]},
        {"date":"2026-08-01","localName":"Bundesfeier","global":true,"counties":null},
        {"date":"2026-08-15","localName":"Maria Himmelfahrt","global":false,"counties":["CH-LU","CH-UR","CH-SZ","CH-OW","CH-NW","CH-ZG","CH-FR","CH-SO","CH-AG","CH-TI","CH-VS"]},
        {"date":"2026-08-15","localName":"Maria Himmelfahrt","global":false,"counties":["CH-AI","CH-JU"]},
        {"date":"2026-09-10","localName":"Jeûne genevois","global":false,"counties":["CH-GE"]},
        {"date":"2026-09-20","localName":"Eidgenössischer Dank-, Buss- und Bettag","global":false,"counties":["CH-ZH","CH-BE","CH-LU","CH-SZ","CH-OW","CH-NW","CH-GL","CH-SO","CH-BS","CH-BL","CH-SH","CH-SG","CH-GR"]},
        {"date":"2026-09-21","localName":"Bettagsmontag","global":false,"counties":["CH-VD"]},
        {"date":"2026-11-01","localName":"Allerheiligen","global":false,"counties":["CH-LU","CH-UR","CH-SZ","CH-OW","CH-NW","CH-GL","CH-ZG","CH-FR","CH-SO","CH-SG","CH-AG","CH-TI","CH-VS"]},
        {"date":"2026-11-01","localName":"Allerheiligen","global":false,"counties":["CH-AI","CH-JU"]},
        {"date":"2026-12-08","localName":"Mariä Empfängnis","global":false,"counties":["CH-UR","CH-OW","CH-NW","CH-ZG","CH-FR","CH-AG","CH-VS"]},
        {"date":"2026-12-08","localName":"Mariä Empfängnis","global":false,"counties":["CH-AI","CH-JU","CH-LU","CH-SZ","CH-TI"]},
        {"date":"2026-12-25","localName":"Weihnachten","global":true,"counties":null},
        {"date":"2026-12-26","localName":"Stephanstag","global":false,"counties":["CH-ZH","CH-BE","CH-LU","CH-GL","CH-FR","CH-BS","CH-BL","CH-SH","CH-SG","CH-GR","CH-AG","CH-TG","CH-TI"]},
        {"date":"2026-12-26","localName":"Stephanstag","global":false,"counties":["CH-UR","CH-SZ","CH-OW"]},
        {"date":"2026-12-31","localName":"Restauration de la République","global":false,"counties":["CH-GE"]},
    ],
};

// ── La liste des pays de l API, extraite verbatim le 05/09/2026 ────────────
// 19 entrees des 204 servies, choisies pour ce controle. SZ et GM y sont A DESSEIN :
// ce sont les codes que WME emploie pour la Suisse et l Allemagne, et l API les
// attribue a l Eswatini et a la Gambie. Leur presence est ce qui donne au controle
// sa morsure — sans eux, envoyer l abbr brut passerait inapercu.
const PAYS_API = [
        {"countryCode":"AT","name":"Austria"},
        {"countryCode":"AU","name":"Australia"},
        {"countryCode":"BE","name":"Belgium"},
        {"countryCode":"BR","name":"Brazil"},
        {"countryCode":"CA","name":"Canada"},
        {"countryCode":"CD","name":"DR Congo"},
        {"countryCode":"CG","name":"Congo"},
        {"countryCode":"CH","name":"Switzerland"},
        {"countryCode":"HK","name":"Hong Kong"},
        {"countryCode":"DE","name":"Germany"},
        {"countryCode":"ES","name":"Spain"},
        {"countryCode":"FR","name":"France"},
        {"countryCode":"GB","name":"United Kingdom"},
        {"countryCode":"GM","name":"Gambia"},
        {"countryCode":"IT","name":"Italy"},
        {"countryCode":"JP","name":"Japan"},
        {"countryCode":"MX","name":"Mexico"},
        {"countryCode":"PL","name":"Poland"},
        {"countryCode":"PT","name":"Portugal"},
        {"countryCode":"SE","name":"Sweden"},
        {"countryCode":"SZ","name":"Eswatini"},
        {"countryCode":"US","name":"United States"},
        {"countryCode":"VC","name":"Saint Vincent and the Grenadines"},
];

// ── Bac a sable ────────────────────────────────────────────────────────────
// Un seul service rendu au bloc : GM_xmlhttpRequest. `panne` liste les cles
// (« AU-2027 ») que la fausse API doit REFUSER — c est ainsi qu on eprouve le
// troisieme etat sans debrancher le reseau.
const charger = (panne) => {
    const appels = [];
    const bac = {
        console: { log(){}, warn(){}, error(){} },
        Intl,   // resolveCountryIso s en sert en second recours (Intl.DisplayNames)
        GM_xmlhttpRequest(o) {
            if (/AvailableCountries/.test(o.url)) {
                appels.push('AvailableCountries');
                if ((panne || []).includes('AvailableCountries')) { o.onerror && o.onerror(); return; }
                o.onload({ responseText: JSON.stringify(PAYS_API) });
                return;
            }
            const m = /PublicHolidays\/(\d{4})\/([A-Z]{2})/.exec(o.url);
            const annee = m && m[1], cc = m && m[2];
            appels.push(cc + '-' + annee);
            if (!m || (panne || []).includes(cc + '-' + annee)) { o.onerror && o.onerror(); return; }
            const d = REPONSES[cc];
            if (!d) { o.onerror && o.onerror(); return; }
            // Une annee autre que 2026 est servie avec les memes feries, mais DATES
            // DECALEES a cette annee-la. Servir du 2026 sous l etiquette 2027 rendrait
            // le bac incapable de voir un debordement d annee — or c est exactement ce
            // qui arrive a toute fermeture de nuit posee le 31 decembre.
            const txt = JSON.stringify(d);
            o.onload({ responseText: annee === '2026' ? txt : txt.replace(/"2026-/g, '"' + annee + '-') });
        },
        __appels: appels,
    };
    // Exportation ajoutee ICI et non dans le userscript : le bloc extrait declare
    // ses `const` dans son propre scope lexical, invisibles depuis le bac.
    const rallonge = '\n;__exp = { holidayCache, fetchHolidays, getHolidaysForRange, getHolidayRegions, holidayYearsOf, resolveCountryIso, fetchCountryIndex };';
    vm.runInNewContext(BLOC + rallonge, vm.createContext(bac), { filename: 'bloc-feries.js', timeout: 10000 });
    return bac.__exp && Object.assign(bac.__exp, { __appels: appels });
};

const P = '2026-01-01', Q = '2026-12-31';
const trie = a => [...a].sort().join(',');

(async () => {

console.log('\n— Le bloc reel se charge —');
let E;
try { E = charger(); } catch (e) { dit(false, 'le bloc s evalue', e.name + ': ' + e.message); }
if (!E) { console.log('\nECHEC : bloc inexploitable'); process.exit(1); }
dit(typeof E.getHolidaysForRange === 'function', 'getHolidaysForRange extraite du fichier servi');
dit(typeof E.getHolidayRegions === 'function', 'getHolidayRegions extraite du fichier servi');

// ── Le code pays : FIPS chez WME, ISO chez l API ───────────────────────────
// Mesure du 05/09/2026 dans WME, sur 18 pays : `country.abbr` rend du FIPS 10-4.
// Les couples ci-dessous sont ceux relevés en direct — nom rendu par WME, puis abbr.
console.log('\n— Le code pays de WME n est pas un code ISO —');
{
    const E1 = charger();
    const releve = [
        // nom rendu par WME        abbr WME   ISO attendu
        ['France',                  'FR',      'FR'],
        ['United States',           'US',      'US'],
        ['Canada',                  'CA',      'CA'],
        ['Italy',                   'IT',      'IT'],
        ['Australia',               'AS',      'AU'],
        ['Spain',                   'SP',      'ES'],
        ['United Kingdom',          'UK',      'GB'],
        ['Portugal',                'PO',      'PT'],
        ['Japan',                   'JA',      'JP'],
        ['Sweden',                  'SW',      'SE'],
        ['Switzerland',             'SZ',      'CH'],
        ['Germany',                 'GM',      'DE'],
        ['Austria',                 'AU',      'AT'],
    ];
    let bons = 0;
    for (const [nom, abbr, iso] of releve) {
        const r = await E1.resolveCountryIso(nom);
        if (r === iso) bons++;
        else dit(false, 'resolution de ' + nom, 'attendu ' + iso + ', obtenu ' + r);
    }
    dit(bons === releve.length, 'les ' + releve.length + ' pays relevés dans WME sont résolus en ISO',
        bons + '/' + releve.length);

    // LES TROIS COLLISIONS, une par une : ce sont elles qui fermaient des routes.
    dit(await E1.resolveCountryIso('Austria') === 'AT',
        'Autriche : AT, et surtout PAS AU', 'AU aurait rendu le calendrier AUSTRALIEN');
    dit(await E1.resolveCountryIso('Switzerland') === 'CH',
        'Suisse : CH, et surtout PAS SZ', 'SZ = Eswatini');
    dit(await E1.resolveCountryIso('Germany') === 'DE',
        'Allemagne : DE, et surtout PAS GM', 'GM = Gambie');

    // On ne devine JAMAIS : mieux vaut un filtre non appliqué qu un filtre faux.
    dit(await E1.resolveCountryIso('Pays Imaginaire') === null, 'un nom inconnu rend null, pas un code au hasard');
    dit(await E1.resolveCountryIso(null) === null, 'aucun nom rend null');
    dit(await E1.resolveCountryIso('') === null, 'un nom vide rend null');

    // Robustesse du rapprochement de noms, sans table écrite.
    dit(await E1.resolveCountryIso('  UNITED   states  ') === 'US', 'casse et espaces indifférents');

    // La liste n est demandée qu UNE fois, puis mise en cache.
    const n = E1.__appels.filter(x => x === 'AvailableCountries').length;
    dit(n === 1, 'la liste des pays n est demandée qu une fois', n + ' appel(s)');
}

// ── Les deux regles d ecriture, et leur retenue ────────────────────────────
// WME et l API n orthographient pas les memes pays de la meme facon. Sans ces deux
// regles, la correction elle-meme aurait fait REGRESSER quatre pays dont le code Waze
// tombait juste : ils seraient passes d un filtre correct a « non applique ».
console.log('\n— Deux regles d ecriture, et ce qu elles refusent de faire —');
{
    const E1 = charger();
    dit(await E1.resolveCountryIso('Hong Kong (China)') === 'HK',
        'les parentheses sont ignorees', 'WME ecrit « Hong Kong (China) », l API « Hong Kong »');
    dit(await E1.resolveCountryIso('St. Vincent and the Grenadines') === 'VC',
        '« St. » vaut « Saint »', 'sans quoi ce pays perdait un filtre qui marchait');
    // LA RETENUE EST AUSSI IMPORTANTE QUE LA PORTEE. Une regle de sous-chaine aurait
    // rattrape « Macedonia » — et aurait aussi confondu deux Congos voisins dont les
    // calendriers different. On prefere ne pas resoudre.
    dit(await E1.resolveCountryIso('Democratic Republic of the Congo') === null,
        'et « Democratic Republic of the Congo » n est PAS confondu avec « Congo »',
        'ne pas resoudre coute un filtre ; mal resoudre ferme une route');
    dit(await E1.resolveCountryIso('Congo') === 'CG', 'alors que « Congo » seul se resout bien');
    dit(await E1.resolveCountryIso('Swaziland') === null,
        'un ancien nom de pays reste non resolu', 'Eswatini : aucune regle d ecriture ne rattrape cela');
}

console.log('\n— Liste des pays indisponible : on ne devine pas —');
{
    const E1 = charger(['AvailableCountries']);
    dit(await E1.resolveCountryIso('Australia') === null,
        'sans la liste, aucun code n est rendu', 'le filtre s annonce non appliqué');
    // Et surtout : pas de mise en cache d un échec, le prochain essai doit repartir.
    const E2 = charger(['AvailableCountries']);
    await E2.resolveCountryIso('France');
    const n = E2.__appels.filter(x => x === 'AvailableCountries').length;
    dit(n >= 1, 'un échec n est pas mis en cache', n + ' appel(s)');
}

// ── France : ce chantier ne doit RIEN y changer ────────────────────────────
console.log('\n— France : 0 ferie regional, rien ne bouge —');
{
    const E1 = charger();
    const tout = await E1.getHolidaysForRange('FR', P, Q);
    const avecRegion = await E1.getHolidaysForRange('FR', P, Q, 'AU-NSW');
    const info = E1.getHolidayRegions('FR', P, Q);
    dit(tout.length === 11, 'les 11 feries francais sont rendus', tout.length + ' dates');
    dit(info && info.regions.length === 0, 'aucune subdivision : le selecteur ne s affichera jamais en France');
    // P3 : un prereglage partage par un editeur australien atterrit chez un Francais.
    // Sous-filtrer ici retirerait 11 feries du filtre — Noel compris.
    dit(trie(avecRegion) === trie(tout), 'une region etrangere ne retire AUCUN ferie francais',
        avecRegion.length + ' dates au lieu de ' + tout.length);
    dit(avecRegion.includes('2026-12-25'), 'le 25 decembre reste dans le filtre');
}

// ── Australie : le defaut d origine ────────────────────────────────────────
console.log('\n— Australie : 27 entrees, 20 dates, 21 feries regionaux —');
{
    const E1 = charger();
    const tout = await E1.getHolidaysForRange('AU', P, Q);
    const nsw = await E1.getHolidaysForRange('AU', P, Q, 'AU-NSW');
    const wa = await E1.getHolidaysForRange('AU', P, Q, 'AU-WA');
    const brutes = REPONSES.AU.map(h => h.date);
    const nationales = REPONSES.AU.filter(h => h.global).map(h => h.date);

    // Dedoublonnage : l API rend une entree par FERIE, pas par DATE.
    dit(tout.length === 20 && brutes.length === 27,
        'tout le pays : 20 dates distinctes pour 27 entrees d API', tout.length + ' / ' + brutes.length);
    dit(new Set(tout).size === tout.length, 'aucune date rendue deux fois');
    // D4 : sans region, le jeu de dates reste EXACTEMENT celui d avant.
    dit(trie(tout) === trie([...new Set(brutes)]), 'sans region, le meme ensemble de dates qu avant le chantier');

    // Le coeur du defaut signale par maporaptor.
    dit(nsw.length < tout.length, 'AU-NSW retient moins que tout le pays', nsw.length + ' contre ' + tout.length);
    dit(nationales.every(d => nsw.includes(d)), 'AU-NSW garde TOUS les feries nationaux', nationales.length + ' nationaux');
    dit(!nsw.includes('2026-03-02'), 'le Labour Day de AU-WA (02/03) ne ferme plus en Nouvelle-Galles du Sud');
    dit(wa.includes('2026-03-02'), 'et il ferme bien en AU-WA');
    dit(!nsw.includes('2026-03-09'), 'le 09/03 (ACT, SA, TAS, VIC) ne ferme plus en AU-NSW');
    // L Anzac Day est LE cas que maporaptor aurait rencontre : trois entrees, deux
    // dates. NSW/ACT/WA le reportent au 27, NT/QLD/SA/TAS/VIC le tiennent au 25.
    // Avant ce chantier, les DEUX dates fermaient partout.
    const qld = await E1.getHolidaysForRange('AU', P, Q, 'AU-QLD');
    dit(nsw.includes('2026-04-27') && !nsw.includes('2026-04-25'),
        'AU-NSW ne retient que l Anzac Day reporte au 27/04');
    dit(qld.includes('2026-04-25') && !qld.includes('2026-04-27'),
        'AU-QLD ne retient que celui du 25/04');
    dit(wa.includes('2026-04-27'), 'AU-WA le reporte aussi, et le filtre le suit');

    // Le compte annonce dans le selecteur doit etre celui des dates, pas des entrees.
    const info = E1.getHolidayRegions('AU', P, Q);
    dit(info.toutes === 20, 'le selecteur annonce 20 jours pour « tout le pays », pas 27', String(info.toutes));
    const nswInfo = info.regions.find(r => r.code === 'AU-NSW');
    dit(nswInfo && nswInfo.nb === nsw.length, 'le compte annonce pour AU-NSW est celui qui sera filtre',
        nswInfo ? nswInfo.nb + ' = ' + nsw.length : 'AU-NSW absent');
    dit(info.regions.length === 8, 'les 8 Etats et territoires sont proposes', info.regions.map(r => r.code).join(' '));
    dit(trie(info.regions.map(r => r.code)) === info.regions.map(r => r.code).join(','), 'les regions sont triees');
}

// ── Le verrou : une region que le pays ne connait pas ──────────────────────
console.log('\n— Verrou : une region inconnue ne doit JAMAIS sous-filtrer —');
{
    const E1 = charger();
    const tout = await E1.getHolidaysForRange('AU', P, Q);
    const fantome = await E1.getHolidaysForRange('AU', P, Q, 'AU-ZZZ');
    const nationales = [...new Set(REPONSES.AU.filter(h => h.global).map(h => h.date))];
    dit(trie(fantome) === trie(tout), 'region inconnue ⇒ tout le pays', fantome.length + ' dates');
    // La verification qui compte : SANS le verrou, on tomberait sur les seules dates
    // nationales — 6 au lieu de 20 — et « sauf jours feries » laisserait 14 vrais
    // feries australiens ouverts a la circulation.
    dit(fantome.length !== nationales.length,
        'et surtout PAS sur les seuls feries nationaux', 'nationaux : ' + nationales.length);
}

// ── Suisse : 26 cantons, la region est une chaine parmi plusieurs ──────────
console.log('\n— Suisse : 29 feries regionaux sur 33, un seul en porte 24 —');
{
    const E1 = charger();
    const tout = await E1.getHolidaysForRange('CH', P, Q);
    const ti = await E1.getHolidaysForRange('CH', P, Q, 'CH-TI');
    const ge = await E1.getHolidaysForRange('CH', P, Q, 'CH-GE');
    dit(ti.includes('2026-01-06'), 'l Epiphanie ferme au Tessin');
    dit(!ge.includes('2026-01-06'), 'et pas a Geneve');
    dit(ge.includes('2026-04-03'), 'le Vendredi saint ferme a Geneve (un ferie a 24 cantons)');
    dit(ti.length < tout.length && ge.length < tout.length, 'chaque canton retient moins que tout le pays',
        'TI ' + ti.length + ' · GE ' + ge.length + ' · tout ' + tout.length);
}

// ── Le troisieme etat : null n est pas [] ──────────────────────────────────
console.log('\n— Troisieme etat : une liste indisponible reste NULL —');
{
    // La plage traverse deux annees ; l une des deux est en panne. Il suffit d UNE
    // annee manquante pour que le filtre soit faux.
    const E1 = charger(['AU-2027']);
    const r = await E1.getHolidaysForRange('AU', '2026-12-01', '2027-01-31');
    dit(r === null, 'une annee manquante rend null, jamais un tableau vide', String(r));
    const E2 = charger(['AU-2026', 'AU-2027']);
    const r2 = await E2.getHolidaysForRange('AU', '2026-12-01', '2027-01-31', 'AU-NSW');
    dit(r2 === null, 'avec une region aussi : la panne prime sur le filtre', String(r2));
    // Et le selecteur ne doit rien inventer a partir d un cache incomplet.
    dit(E1.getHolidayRegions('AU', '2026-12-01', '2027-01-31') === null,
        'le selecteur ne se peuple pas sur un cache incomplet');
}

// ── Le compte suit la PERIODE, pas les annees chargees ─────────────────────
// Une fermeture de nuit posee le 31 decembre finit en janvier suivant : le moteur
// demande alors DEUX annees de feries. Le cache est annuel, mais le compte affiche
// dans le selecteur doit rester celui de la plage — sinon il annonce « 19 jours »
// sous un message qui dit « 18 exclus ». Mesure faite a Sydney le 05/09/2026.
console.log('\n— Le compte du selecteur suit la periode, pas les annees du cache —');
{
    const E1 = charger();
    // Ce que le moteur demande quand la derniere nuit deborde sur 2027.
    await E1.getHolidaysForRange('AU', '2026-03-01', '2027-01-01');
    dit(trie(E1.__appels.filter(x => /^AU-/.test(x))) === 'AU-2026,AU-2027',
        'deux annees ont bien ete chargees', E1.__appels.join(' '));

    const attendu = new Set(REPONSES.AU.map(h => h.date)
        .filter(d => d >= '2026-03-01' && d <= '2026-12-31')).size;
    const surPlage = E1.getHolidayRegions('AU', '2026-03-01', '2026-12-31');
    dit(surPlage.toutes === attendu, 'le compte ne retient que les feries de la plage',
        surPlage.toutes + ' = ' + attendu);

    // Le temoin de CETTE verification : borner sur la fin de la derniere fermeture —
    // ce que faisait le code avant la mesure de Sydney — ajoute le 1er janvier suivant.
    const surFin = E1.getHolidayRegions('AU', '2026-03-01', '2027-01-01');
    dit(surFin.toutes === surPlage.toutes + 1,
        'et borner sur la derniere FIN en ajoutait un de trop',
        surFin.toutes + ' contre ' + surPlage.toutes);

    // Les regions, elles, restent listees sur l annee entiere : les borner ferait
    // disparaitre du selecteur une region qui filtre encore.
    const hiver = E1.getHolidayRegions('AU', '2026-11-01', '2026-11-30');
    dit(hiver.regions.length === surPlage.regions.length,
        'la LISTE des regions ne retrecit pas avec la plage',
        hiver.regions.length + ' regions sur un mois, ' + surPlage.regions.length + ' sur dix');
    dit(hiver.toutes < surPlage.toutes, 'mais les comptes, eux, suivent bien la plage',
        hiver.toutes + ' contre ' + surPlage.toutes);
}

// ── Le selecteur lit le CACHE, jamais le reseau ────────────────────────────
console.log('\n— Le selecteur ne declenche aucun appel reseau —');
{
    const E1 = charger();
    dit(E1.getHolidayRegions('AU', P, Q) === null, 'cache froid : rien a proposer, et rien n est demande');
    dit(E1.__appels.length === 0, 'aucun appel reseau declenche par le selecteur', E1.__appels.length + ' appel(s)');
    await E1.getHolidaysForRange('AU', P, Q);
    const avant = E1.__appels.length;
    dit(E1.getHolidayRegions('AU', P, Q) !== null, 'cache chaud : les regions sont la');
    dit(E1.__appels.length === avant, 'et toujours aucun appel de plus', E1.__appels.length + ' au total');
}

// ── L Autriche : la collision mesuree sur ses effets ───────────────────────
// C est le temoin du volet pays. On ne verifie pas que resolveCountryIso rend « AT » —
// c est deja fait plus haut — mais ce que l editeur autrichien RECEVAIT quand l abbr
// partait tel quel, et ce qu il recoit maintenant.
console.log('\n— Autriche : ce que la collision AU faisait vraiment —');
{
    const E1 = charger();
    const iso = await E1.resolveCountryIso('Austria');
    const bon = await E1.getHolidaysForRange(iso, P, Q);
    // L ANCIEN comportement : l abbr de WME envoye tel quel. « AU » est l Autriche pour
    // WME et l AUSTRALIE pour l API.
    const avant = await E1.getHolidaysForRange('AU', P, Q);
    const communes = bon.filter(d => avant.includes(d));

    dit(bon.length === 20 && avant.length === 20, 'vingt dates dans les deux cas', bon.length + ' / ' + avant.length);
    dit(communes.length === 5, 'et seulement CINQ coincident', communes.length + ' dates');
    // Le sens interdit : des feries REELS que le filtre laissait passer.
    const manques = bon.filter(d => !avant.includes(d));
    dit(manques.length === 15, 'quinze vrais feries autrichiens etaient laisses OUVERTS', manques.length);
    dit(manques.includes('2026-10-26'), 'dont la fete nationale autrichienne (26/10)');
    dit(manques.includes('2026-01-06'), 'et l Epiphanie (06/01), feriee en Autriche');
    dit(manques.includes('2026-06-04'), 'et la Fete-Dieu (04/06)');
    // L autre sens : des nuits retirees du chantier sans raison.
    const aTort = avant.filter(d => !bon.includes(d));
    dit(aTort.includes('2026-01-26'), 'et l Australia Day (26/01) fermait des routes en Autriche');
    dit(aTort.length === 15, 'quinze nuits retirees a tort', aTort.length);
    // Les subdivisions autrichiennes existent et sont bien les siennes.
    const info = E1.getHolidayRegions(iso, P, Q);
    dit(info && info.regions.every(r => r.code.startsWith('AT-')),
        'le selecteur propose des Laender autrichiens, pas des Etats australiens',
        info ? info.regions.map(r => r.code).join(' ') : 'aucun');
}

// ── Temoin ─────────────────────────────────────────────────────────────────
// Un controle qui ne peut pas echouer ne prouve rien. On rejoue les mesures
// decisives sur le code d AVANT le chantier, reconstitue par deux retraits :
// la date seule au lieu de l objet, et aucun filtre de region.
console.log('\n— Temoin : le code d avant DOIT echouer —');
{
    const casse = BLOC
        .replace(/const jours=data\.map\(h=>\(\{[\s\S]*?\}\)\);/, 'const jours=data.map(h=>h.date).map(d=>({date:d,global:true,counties:null}));')
        .replace(/const connue=[\s\S]*?const retenus=[^\n]*\n/, 'const retenus=jours;\n')
        .replace('return [...new Set(retenus.map(h=>h.date))];', 'return retenus.map(h=>h.date);');
    const bac = {
        console: { log(){}, warn(){}, error(){} },
        GM_xmlhttpRequest(o) {
            const m = /PublicHolidays\/(\d{4})\/([A-Z]{2})/.exec(o.url);
            if (!m || !REPONSES[m[2]]) { o.onerror && o.onerror(); return; }
            o.onload({ responseText: JSON.stringify(REPONSES[m[2]]) });
        },
    };
    let T = null;
    try {
        vm.runInNewContext(casse + '\n;__exp={getHolidaysForRange,getHolidayRegions};',
            vm.createContext(bac), { filename: 'temoin.js', timeout: 10000 });
        T = bac.__exp;
    } catch (e) { /* le temoin peut ne pas se charger : c est deja un echec valide */ }
    if (!T) {
        dit(true, 'le temoin ne se charge meme pas', 'les retraits ont bien mordu');
    } else {
        const tout = await T.getHolidaysForRange('AU', P, Q);
        const nsw = await T.getHolidaysForRange('AU', P, Q, 'AU-NSW');
        dit(tout.length === 27, 'le temoin rend bien 27 dates : il NE dedoublonne PAS', tout.length + ' dates');
        dit(trie(nsw) === trie(tout), 'le temoin ignore la region : AU-NSW = tout le pays', 'c est le defaut d origine');
        const info = T.getHolidayRegions('AU', P, Q);
        dit(!info || info.regions.length === 0, 'le temoin ne connait aucune subdivision');
    }
}

console.log('\n' + (ko ? 'ECHEC : ' : 'TOUT PASSE : ') + ok + ' ok, ' + ko + ' ko');
process.exit(ko ? 1 : 0);

})();
