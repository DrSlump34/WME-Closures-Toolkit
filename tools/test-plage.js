// Bornes de la plage de dates — EXTRAITES DU FICHIER REEL.
//
// Pourquoi ce test existe (2026-08-05) : buildClosureList decide de ce qui sera ECRIT dans
// WME, et aucun test ne la regardait. La borne de fin de plage portait sur la FIN de
// l occurrence : toute fermeture passant minuit perdait donc le DERNIER jour de la plage,
// EN SILENCE. « Du 1er au 31 aout, 21h -> 5h » ne posait que 30 nuits ; l editeur croyait
// avoir couvert le mois, aucun message ne le detrompait, et sur une plage d un seul jour il
// n obtenait rien du tout avec pour seule explication « Aucune fermeture generee ».
//
// La borne porte desormais sur le DEBUT — comme le filtre des jours de la semaine, celui des
// jours feries et la boucle des jours calendaires, qui raisonnaient deja tous sur le debut.
//
// Ce que ce test verrouille :
//   1. Le dernier jour de la plage produit sa fermeture, meme si elle finit le lendemain.
//   2. Ce debordement est ANNONCE (pastRangeStart / pastRangeEnd) : on ne le corrige pas en
//      douce, l editeur doit savoir que sa derniere fermeture depasse la date affichee.
//   3. L annonce ne se declenche PAS quand rien ne deborde. Un avertissement permanent est
//      un avertissement qu on cesse de lire — c est le temoin qui garde cette garantie.
//   4. La borne se joue au strict : une occurrence qui commence a MINUIT PILE le lendemain
//      de la date de fin est refusee, celle qui commence a 23:59 la veille passe.
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'WME_ClosuresToolkit.user.js');
const txt = fs.readFileSync(SRC, 'utf8');

// ── Extraction : trois blocs du fichier reel, aucune copie ──
const bloc = (debut, fin, nom) => {
    const i = txt.indexOf(debut), j = txt.indexOf(fin);
    if (i < 0 || j < 0 || j < i) {
        console.error('❌ bloc ' + nom + ' introuvable dans ' + SRC);
        console.error('   Renomme ou deplace : ajuster les bornes de ce test.');
        process.exit(2);
    }
    return txt.slice(i, j);
};
const codeJDate = bloc('class JDate extends Date {', '// ─── Constants & State', 'JDate');
const codeUtils = bloc("const pad=n=>String(n).padStart(2,'0');", 'const download=', 'utilitaires de date');
const codeBuild = bloc('const buildClosureList=async()=>{', 'const readConfig=', 'buildClosureList');

// ── DOM minimal : juste ce que buildClosureList touche ──
const faireDom = (cfg) => {
    const champs = {
        'wct-rangestart': cfg.debut,
        'wct-rangeend': cfg.fin,
        'wct-starttime': cfg.heureDebut || '21:00',
        'wct-endtime': cfg.heureFin || '05:00',
        'wct-dur-time': cfg.duree || '08:00',
        'wct-dur-day': String(cfg.joursEnPlus === undefined ? 0 : cfg.joursEnPlus),
        'wct-rep-ntimes': String(cfg.repN || 5),
        'wct-rep-every': String(cfg.repTous || 1),
        'wct-rep-unit': cfg.repUnite || 'day',
    };
    // Mode horaire : wct-mode-end est VISIBLE en mode « heure de fin », masque en mode
    // « duree ». C est bien son style qui porte l information dans le fichier reel.
    const modeEnd = cfg.mode !== 'duree';
    const parId = { 'wct-mode-end': { style: { display: modeEnd ? '' : 'none' } } };
    for (const [id, valeur] of Object.entries(champs)) parId[id] = { value: valeur };
    const jours = cfg.jours || [true, true, true, true, true, true, true];
    // Jours feries : les trois cases sont absentes du DOM par defaut ($id rend null, donc
    // holidayMode vaut 'none'). On ne les pose que si le cas de test les demande.
    if (cfg.feries) {
        parId['wct-hol-skip'] = { checked: cfg.feries === 'skip' };
        parId['wct-hol-only'] = { checked: cfg.feries === 'only' };
        parId['wct-hol-add'] = { checked: cfg.feries === 'add' };
        parId['wct-holidays-warn'] = { style: {}, textContent: '' };
    }
    const document = {
        querySelector: (sel) => {
            if (sel.includes('.wct-pane.on')) return { id: cfg.onglet || 'wct-tab-each' };
            const m = sel.match(/data-dow="(\d)"/);
            if (m) return { classList: { contains: (c) => c === 'on' && jours[Number(m[1])] } };
            return null;
        },
    };
    return { $id: (id) => parId[id] || null, document };
};

const tTest = (cle, ...args) => (args.length ? cle + '(' + args.join('|') + ')' : cle);
const source = "let _dateFormat='dmy';\n" + codeJDate + codeUtils + codeBuild + '\nreturn buildClosureList;';
const fabriquer = new Function('$id', 'document', 't', 'getSelection', 'checkSelectionCountry', 'getHolidaysForRange', source);

const lancer = async (cfg) => {
    const { $id, document } = faireDom(cfg);
    // Par defaut aucun pays n est resolu : le filtre des jours feries ne s execute pas.
    // cfg.pays + cfg.joursFeries (tableau 'AAAA-MM-JJ') l allument pour les cas qui le visent.
    const pays = cfg.pays ? { ok: true, country: cfg.pays } : { ok: false, country: null, countries: [] };
    const feries = async () => (cfg.joursFeries === undefined ? null : cfg.joursFeries);
    return fabriquer($id, document, tTest, () => ({ ids: [] }), () => pays, feries)();
};
const LUN_VEN = [false, true, true, true, true, true, false];

// ── Harnais ──
let ok = 0, ko = 0;
const verifier = (titre, condition, detail) => {
    if (condition) { ok++; console.log('  ok   ' + titre); }
    else { ko++; console.log('  ECHEC ' + titre + (detail ? '\n         ' + detail : '')); }
};

(async () => {
    console.log('\n— Le cas signale : nuit 21:00 -> 05:00 sur une plage d un seul jour —');
    {
        // Mercredi 05/08/2026, jour coche. La fermeture COMMENCE dans la plage : elle doit
        // etre generee. C est la capture de l editeur, qui n obtenait rien.
        const r = await lancer({ debut: '2026-08-05', fin: '2026-08-05', jours: LUN_VEN });
        verifier('la fermeture est generee', r.list.length === 1, 'obtenu ' + r.list.length);
        verifier('aucune erreur', !r.error, 'obtenu : ' + r.error);
        const d = r.list[0];
        verifier('elle commence le 05/08 a 21:00', d && d.start.getDate() === 5 && d.start.getHours() === 21);
        verifier('elle finit le 06/08 a 05:00', d && d.end.getDate() === 6 && d.end.getHours() === 5);
        verifier('le debordement est annonce', r.pastRangeEnd === '06/08/2026 05:00', 'obtenu : ' + r.pastRangeEnd);
        verifier('l annonce donne aussi le debut', r.pastRangeStart === '05/08/2026 21:00', 'obtenu : ' + r.pastRangeStart);
    }

    console.log('\n— Le mois entier : plus de jour mange en silence —');
    {
        // 31 jours, tous coches, fermeture de nuit. C est le cas ou la perte etait la plus
        // grave : elle ne se voyait pas, le compteur affichait simplement 30.
        const r = await lancer({ debut: '2026-08-01', fin: '2026-08-31' });
        verifier('les 31 nuits sont generees', r.list.length === 31, 'obtenu ' + r.list.length);
        const der = r.list[r.list.length - 1];
        verifier('la derniere commence bien le 31/08', der && der.start.getDate() === 31);
        verifier('elle finit le 01/09', der && der.end.getMonth() === 8 && der.end.getDate() === 1);
        verifier('le debordement est annonce', r.pastRangeEnd === '01/09/2026 05:00', 'obtenu : ' + r.pastRangeEnd);
    }

    console.log('\n— Temoin : rien ne deborde, rien ne s affiche —');
    {
        // Fermeture de journee : elle tient dans son jour. Si l annonce apparaissait ici,
        // elle apparaitrait partout — et un avertissement permanent cesse d etre lu.
        const r = await lancer({ debut: '2026-08-01', fin: '2026-08-31', heureDebut: '09:00', heureFin: '17:00' });
        verifier('les 31 occurrences sont generees', r.list.length === 31, 'obtenu ' + r.list.length);
        verifier('aucune annonce de debordement', r.pastRangeEnd === undefined, 'obtenu : ' + r.pastRangeEnd);
        verifier('pas de debut annonce non plus', r.pastRangeStart === undefined, 'obtenu : ' + r.pastRangeStart);
    }

    console.log('\n— La borne se joue au strict, sur le DEBUT —');
    {
        // Une occurrence qui commence a 23:59 le dernier jour passe : son debut est dans la
        // plage. Le jour suivant, meme heure, commence apres reDT et ne passe pas.
        const r = await lancer({ debut: '2026-08-05', fin: '2026-08-06', heureDebut: '23:59', heureFin: '05:00' });
        verifier('les deux jours de la plage sont retenus', r.list.length === 2, 'obtenu ' + r.list.length);
        verifier('le dernier debut est le 06/08 a 23:59', r.list[1] && r.list[1].start.getDate() === 6 && r.list[1].start.getMinutes() === 59);
        verifier('le debordement est annonce', !!r.pastRangeEnd, 'obtenu : ' + r.pastRangeEnd);
    }

    console.log('\n— Une liste vide pour une autre cause reste sans annonce —');
    {
        // Samedi 08/08 seul dans la plage, samedi decoche : rien a generer, et rien a
        // annoncer non plus. Une annonce sur une liste vide n aurait aucun objet.
        const r = await lancer({ debut: '2026-08-08', fin: '2026-08-08', jours: LUN_VEN });
        verifier('aucune fermeture generee', r.list.length === 0, 'obtenu ' + r.list.length);
        verifier('aucune annonce', r.pastRangeEnd === undefined, 'obtenu : ' + r.pastRangeEnd);
    }

    console.log('\n— Mode Duree : meme borne —');
    {
        const r = await lancer({ debut: '2026-08-05', fin: '2026-08-05', mode: 'duree', duree: '08:00', jours: LUN_VEN });
        verifier('la fermeture est generee', r.list.length === 1, 'obtenu ' + r.list.length);
        verifier('le debordement est annonce', r.pastRangeEnd === '06/08/2026 05:00', 'obtenu : ' + r.pastRangeEnd);
    }

    console.log('\n— +Jours : la fermeture longue est generee et annoncee —');
    {
        // 21:00 -> 05:00 avec +1 jour = 32 h. Elle commence dans la plage, donc elle est
        // generee ; l annonce doit porter la fin REELLE, deux jours plus loin.
        const r = await lancer({ debut: '2026-08-05', fin: '2026-08-05', joursEnPlus: 1, jours: LUN_VEN });
        verifier('la fermeture est generee', r.list.length === 1, 'obtenu ' + r.list.length);
        verifier('l annonce porte la fin reelle (07/08)', r.pastRangeEnd === '07/08/2026 05:00', 'obtenu : ' + r.pastRangeEnd);
    }

    console.log('\n— Onglet Repeter : la borne compte les DEBUTS —');
    {
        // 5 occurrences demandees, une par jour, sur une plage d un seul jour : seule celle
        // qui COMMENCE dans la plage est retenue. La deuxieme demarrerait le 06/08 a 21:00,
        // au-dela de la fin de plage.
        const r = await lancer({ debut: '2026-08-05', fin: '2026-08-05', onglet: 'wct-tab-repeat', repN: 5 });
        verifier('une seule occurrence retenue', r.list.length === 1, 'obtenu ' + r.list.length);
        verifier('le debordement est annonce', r.pastRangeEnd === '06/08/2026 05:00', 'obtenu : ' + r.pastRangeEnd);
    }
    {
        // Sur trois jours, les trois debuts tiennent.
        const r = await lancer({ debut: '2026-08-05', fin: '2026-08-07', onglet: 'wct-tab-repeat', repN: 5 });
        verifier('trois occurrences retenues sur trois jours', r.list.length === 3, 'obtenu ' + r.list.length);
    }

    console.log('\n— La fin de plage est MINUIT LOCAL, pas minuit UTC —');
    {
        // Depuis le 05/08 a 23:00, toutes les 2 h : le depart suivant tombe le 06/08 a 01:00,
        // donc HORS plage. Tant que la borne se construisait sur `new JDate('AAAA-MM-JJ')`
        // (parse en UTC), elle valait 02:00 du matin heure francaise l ete et ce depart
        // passait. Un test cale sur un seul fuseau ne verrait rien : celui-ci compte.
        const r = await lancer({ debut: '2026-08-05', fin: '2026-08-05', heureDebut: '23:00',
                                 onglet: 'wct-tab-repeat', repN: 5, repTous: 2, repUnite: 'hour' });
        verifier('le depart de 01:00 le lendemain est refuse', r.list.length === 1, 'obtenu ' + r.list.length);
        verifier('le seul retenu part le 05/08 a 23:00', r.list[0] && r.list[0].start.getDate() === 5 && r.list[0].start.getHours() === 23);
    }

    console.log('\n— L avertissement « Repeter » annonce ce que la generation produit —');
    {
        // Verification CROISEE : validateRepeat previent « seulement N occurrences tiennent
        // dans la plage ». Ce N doit etre celui que buildClosureList genere reellement. Les
        // deux calculs vivent a 6000 lignes l un de l autre et personne ne les comparait :
        // l avertissement comptait depuis minuit alors que les fermetures partent a l heure
        // de debut, et oubliait de compter le premier depart.
        const codeVR = bloc('const validateRepeat=()=>{', "['wct-rep-every','wct-rep-unit'", 'validateRepeat');
        const cas = [
            { debut: '2026-08-05', fin: '2026-08-05', heureDebut: '21:00', repTous: 1, repUnite: 'day', note: 'un jour, une fois par jour' },
            { debut: '2026-08-05', fin: '2026-08-07', heureDebut: '21:00', repTous: 1, repUnite: 'day', note: 'trois jours' },
            { debut: '2026-08-05', fin: '2026-08-05', heureDebut: '21:00', repTous: 1, repUnite: 'hour', note: 'un jour, toutes les heures' },
            { debut: '2026-08-05', fin: '2026-08-06', heureDebut: '21:00', repTous: 12, repUnite: 'hour', note: 'deux jours, toutes les 12 h' },
            { debut: '2026-08-01', fin: '2026-08-03', heureDebut: '08:00', repTous: 6, repUnite: 'hour', note: 'matin, toutes les 6 h' },
        ];
        for (const c of cas) {
            // maxOcc annonce : on demande volontairement plus que possible pour declencher
            // l avertissement, et on relit le nombre qu il annonce.
            const dom = faireDom(Object.assign({}, c, { repN: 999, onglet: 'wct-tab-repeat' }));
            let message = '';
            const warn = { style: {}, set innerHTML(v) { message = v; }, get innerHTML() { return message; } };
            const $idVR = (id) => (id === 'wct-rep-warn' ? warn : dom.$id(id));
            new Function('$id', 't', codeVR + '\nvalidateRepeat();')($idVR, tTest);
            const m = message.match(/warnOcc\((\d+)\|/);
            const annonce = m ? Number(m[1]) : null;
            // Genere reellement : on demande le meme gros nombre, la borne de plage tranche.
            const r = await lancer(Object.assign({}, c, { repN: 999, onglet: 'wct-tab-repeat' }));
            verifier(c.note + ' : annonce ' + annonce + ', genere ' + r.list.length,
                annonce === r.list.length, 'les deux calculs doivent tomber d accord');
        }
    }

    console.log('\n— Le jour coche est le jour LOCAL, dans tous les fuseaux —');
    {
        // Pourquoi ce bloc (2026-08-08) : la boucle lisait le jour de la semaine avec
        // getUTCDay() sur une date pourtant construite en heure LOCALE par makeDSTSafeDate.
        // Un commentaire affirmait « coherent avec timestamp decale » — le decalage
        // (valueOf() - tzOffset) n est applique que bien plus tard, dans addClosure. Le
        // resultat : des que l heure de debut tombe de l autre cote de minuit UTC, le filtre
        // se decale d un jour entier et ferme le mauvais jour sur une carte publique.
        //   - a l EST d UTC il faut une heure de debut petite (01:00 a Paris l ete) ;
        //   - a l OUEST, TOUTE fermeture de soiree suffit (des 20:00 a New York).
        // Un test cale sur le seul fuseau de la machine ne verrait qu une moitie du defaut :
        // on balaie donc quatre fuseaux, dont un a offset non entier.
        const tzAvant = process.env.TZ;
        const cas = [
            { tz: 'Europe/Paris',     heure: '01:00', jour: 3, nom: 'mercredi', note: 'Paris, UTC+2 l ete, debut a 01:00' },
            { tz: 'America/New_York', heure: '21:00', jour: 1, nom: 'lundi',    note: 'New York, UTC-4, fermeture de soiree' },
            { tz: 'Asia/Kolkata',     heure: '03:00', jour: 5, nom: 'vendredi', note: 'Inde, UTC+5:30, offset non entier' },
            { tz: 'Pacific/Auckland', heure: '09:00', jour: 6, nom: 'samedi',   note: 'Auckland, UTC+12' },
        ];
        for (const c of cas) {
            process.env.TZ = c.tz;
            const jours = [false, false, false, false, false, false, false];
            jours[c.jour] = true;
            const r = await lancer({ debut: '2026-08-01', fin: '2026-08-31', heureDebut: c.heure, heureFin: '05:00', jours });
            const tous = r.list.length > 0 && r.list.every(cl => cl.start.getDay() === c.jour);
            const vus = [...new Set(r.list.map(cl => cl.start.getDay()))].join(',');
            verifier(c.note + ' : seuls des ' + c.nom + ' (' + r.list.length + ')',
                tous, 'jours locaux obtenus : [' + vus + '], attendu [' + c.jour + ']');
        }
        // Le DEBUT DE PLAGE lui-meme, sans aucun filtre : la boucle part de `rs`, un JDate
        // issu de new JDate('AAAA-MM-JJ') — donc MINUIT UTC — que makeDSTSafeDate relit
        // ensuite en composantes LOCALES. A l ouest d UTC ces deux lectures ne designent pas
        // le meme jour : la plage entiere glissait d un jour vers le passe, et la borne de
        // fin amputait le dernier. Tous les jours coches ici : seul le calendrier est en jeu.
        for (const tz of ['America/New_York', 'America/Los_Angeles', 'Pacific/Honolulu', 'Europe/Paris', 'Asia/Kolkata']) {
            process.env.TZ = tz;
            const r = await lancer({ debut: '2026-07-01', fin: '2026-07-06', heureDebut: '21:00', heureFin: '05:00' });
            const jours = r.list.map(cl => cl.start.getDate());
            verifier(tz + ' : la plage du 1er au 6 donne bien les jours 1 a 6',
                jours.length === 6 && jours.every((j, i) => j === i + 1),
                'jours locaux obtenus : [' + jours.join(',') + ']');
        }
        // Filtre des jours feries : meme faute, meme consequence. Le 4 juillet ferme a 21:00
        // a New York s ecrit 2026-07-05 en UTC — « sauf jours feries » le laissait donc
        // passer, et « uniquement les jours feries » ne le trouvait pas.
        process.env.TZ = 'America/New_York';
        const feries = ['2026-07-03', '2026-07-04'];
        const rSkip = await lancer({ debut: '2026-07-01', fin: '2026-07-06', heureDebut: '21:00', heureFin: '05:00',
                                     pays: 'US', joursFeries: feries, feries: 'skip' });
        const datesSkip = rSkip.list.map(cl => cl.start.getDate());
        verifier('New York, « sauf jours feries » : les 3 et 4 juillet sont bien retires',
            !datesSkip.includes(3) && !datesSkip.includes(4) && datesSkip.length === 4,
            'jours locaux retenus : [' + datesSkip.join(',') + '], attendu [1,2,5,6]');
        const rOnly = await lancer({ debut: '2026-07-01', fin: '2026-07-06', heureDebut: '21:00', heureFin: '05:00',
                                     pays: 'US', joursFeries: feries, feries: 'only' });
        const datesOnly = rOnly.list.map(cl => cl.start.getDate());
        verifier('New York, « uniquement les jours feries » : les 3 et 4 juillet, et eux seuls',
            datesOnly.length === 2 && datesOnly.includes(3) && datesOnly.includes(4),
            'jours locaux retenus : [' + datesOnly.join(',') + '], attendu [3,4]');
        // Temoin : en UTC pur, local et UTC coincident. Ce cas passe AVANT comme APRES le
        // correctif — s il venait a echouer, c est le harnais qui serait en cause, pas la
        // regle. Il distingue « le test attrape le defaut » de « le test attrape tout ».
        process.env.TZ = 'UTC';
        const rTemoin = await lancer({ debut: '2026-08-01', fin: '2026-08-31', heureDebut: '01:00', heureFin: '05:00',
                                       jours: [false, false, false, true, false, false, false] });
        verifier('temoin en UTC : rien ne bouge quand local et UTC coincident',
            rTemoin.list.length > 0 && rTemoin.list.every(cl => cl.start.getDay() === 3),
            'obtenu ' + rTemoin.list.length + ' occurrences');
        if (tzAvant === undefined) delete process.env.TZ; else process.env.TZ = tzAvant;
    }

    console.log('\n' + (ko === 0 ? 'TOUT PASSE : ' + ok + ' verifications' : '❌ ' + ko + ' ECHEC(S) sur ' + (ok + ko)));
    process.exit(ko === 0 ? 0 : 1);
})();
