/* ═══════════════════════════════════════════════════════════════════════════
 *  WMECreneaux — de la configuration d'un panneau « Configurer » à la liste
 *  des fermetures qu'il décrit.
 *  Version 1.0.0
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  POURQUOI CETTE BIBLIOTHÈQUE EXISTE
 *  ----------------------------------
 *  Ce moteur vivait dans WCT sous le nom `buildClosureList`, et il lisait le
 *  DOM du panneau directement. Un second outil en a eu besoin : il prépare des
 *  fermetures hors de WME et en produit le CSV que WCT importe. Recopier la
 *  fonction aurait donné deux exemplaires d'une règle qui décide de ce qui est
 *  ÉCRIT sur la carte : ils auraient divergé.
 *
 *  ⚠️⚠️ ELLE NE TOUCHE NI AU DOM, NI AU RÉSEAU, NI À WME. Tout ce qu'elle ne
 *     sait pas lui est passé : le pays, la façon d'obtenir les jours fériés, le
 *     plafond. C'est ce qui la rend exécutable sous Node, donc testable sans
 *     ouvrir l'éditeur.
 *
 *  ⚠️ ELLE NE TRADUIT PAS. Elle rend des CODES (`{code:'errDateStart'}`), que
 *     l'appelant traduit avec son propre dictionnaire. WCT en a huit langues ;
 *     l'extranet écrit en français. Une bibliothèque qui rendrait des phrases
 *     imposerait sa langue aux deux.
 *
 *     ⚠️⚠️ CE QUE CELA PIÉGERA LE JOUR DU `@require`. Les codes rendus ici sont
 *        des clés du dictionnaire de WCT — errDateStart, errDateEnd, errNone,
 *        errContEnd, errRepeat, errMaxItems, holidaysExcl, holidaysNone,
 *        holidaysOnly, holidaysOnlyNone, holidaysAdded, holidaysUnavailable.
 *        `tools/check-cles-mortes.js` les voit employées parce que cette
 *        bibliothèque est COPIÉE dans le userscript, où il les lit en clair. Le
 *        jour où la copie cède la place à un `@require`, elles disparaîtront de
 *        son champ de vision et seront déclarées mortes — alors qu'elles seront
 *        les plus vivantes du fichier. Il faudra l'apprendre à cet outil AVANT
 *        de faire la bascule, pas après avoir supprimé les douze.
 *
 *  ⚠️ ELLE NE FORMATE PAS LES DATES. `debordement` porte des `Date`, pas des
 *     chaînes : le format d'affichage est un réglage de l'appelant.
 *
 *  LES DEUX PIÈGES QU'ELLE PORTE, ET QU'IL NE FAUT PAS « SIMPLIFIER »
 *  -----------------------------------------------------------------
 *  1. Tout se raisonne en heure LOCALE — la borne de plage, le jour de la
 *     semaine, la clé de jour férié. Une seule de ces lectures faite en UTC
 *     change les jours réellement fermés sur la carte.
 *  2. La borne de plage porte sur le DÉBUT de l'occurrence, jamais sur sa fin :
 *     sinon toute fermeture passant minuit perd le dernier jour de la plage, en
 *     silence.
 *  `tools/test-plage.js` de WCT tient les deux sur cinq fuseaux horaires.
 */

var WMECreneaux = (function () {
    'use strict';

    /* ── Dates ────────────────────────────────────────────────────────────── */

    class JDate extends Date {
        clone()       { return new JDate(this); }
        addMinutes(v) { return new JDate(this.getTime() + v * 60000); }
        addDays(v)    { this.setDate(this.getDate() + v); return this; }
    }

    const pad = n => String(n).padStart(2, '0');

    const isValidDate = d =>
        Object.prototype.toString.call(d) === '[object Date]' && !isNaN(d.getTime());

    /* Construit « baseDate + dayOffset jours, à localHour:localMin heure locale ».
       Passe par new Date(y,m,d,h,min) — le seul constructeur JS qui opère en heure
       locale — ce qui corrige le changement d'heure sans aucune table de règles.
       ⚠️ new Date('AAAA-MM-JJ') parse en UTC minuit : à l'est d'UTC, getDate()
          rendrait la veille. D'où l'analyse manuelle de la chaîne. */
    const makeDSTSafeDate = (baseDate, dayOffset, localHour, localMin) => {
        let y, m, day;
        if (typeof baseDate === 'string' && /^\d{4}-\d{2}-\d{2}/.test(baseDate)) {
            y   = parseInt(baseDate.slice(0, 4));
            m   = parseInt(baseDate.slice(5, 7)) - 1;
            day = parseInt(baseDate.slice(8, 10));
        } else {
            const b = new Date(baseDate);
            y = b.getFullYear(); m = b.getMonth(); day = b.getDate();
        }
        return new JDate(new Date(y, m, day + dayOffset, localHour, localMin, 0, 0));
    };

    /* Clé de jour calendaire LOCAL, au format des jours fériés et des <input type="date">.
       ⚠️⚠️ EN LOCAL, JAMAIS EN UTC. Lue en UTC, une fermeture partant le 4 juillet à
          21:00 à New York s'écrit « 2026-07-05 » : elle échappe à « sauf jours fériés »
          pendant que celle du 3 juillet se fait exclure à sa place. */
    const dayKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    /* ── Les trois modes ──────────────────────────────────────────────────── */
    /* Les valeurs sont les identifiants des volets de WCT : la configuration qu'il
       produit les porte telles quelles, et les renommer obligerait à convertir de
       part et d'autre. */
    const MODES = {
        CHAQUE_JOUR: 'wct-tab-each',
        REPETER:     'wct-tab-repeat',
        CONTINU:     'wct-tab-cont',
    };

    /* Zones d'avertissement : où l'appelant doit poser l'avis qu'il reçoit.
     *
     * ⚠️⚠️ TROIS ÉTATS, PAS DEUX, et c'est ce qui rend l'affichage fidèle :
     *   · un avis avec un `code`  → il y a quelque chose à dire, affiche-le ;
     *   · un avis à `code: null`  → rien à signaler, MASQUE la zone ;
     *   · aucun avis pour la zone → N'Y TOUCHE PAS.
     * Le troisième cas n'est pas une subtilité gratuite : quand le pays n'a pas pu
     * être résolu, l'écran doit garder ce qu'il affichait, ni l'effacer ni le
     * remplacer. Confondre « rien à dire » et « rien à faire » efface au premier
     * caractère saisi un message que l'utilisateur était en train de lire. */
    const ZONES = { FERIES: 'feries', REPETITION: 'repetition' };
    const RAS = (zone) => ({ zone, code: null, args: [], niveau: 'info' });

    /* ⚠️ UNE ERREUR N'EFFACE PAS LES AVIS DÉJÀ ÉMIS, et ce n'est pas une élégance :
       le chevauchement d'intervalle est signalé AVANT que la boucle ne bute sur le
       plafond. Rendre une liste d'avis vide effacerait à l'écran un avertissement
       que l'utilisateur venait de voir apparaître. */
    const erreur = (code, args, avis) => ({
        list: [], erreur: { code, args: args || [] }, avis: avis || [], debordement: null,
    });

    /**
     * Génère la liste des fermetures décrites par une configuration.
     *
     * @param {object} cfg  La configuration, telle que `readConfig()` la produit :
     *   rangestart, rangeend  (AAAA-MM-JJ)
     *   starttime             (HH:MM)
     *   timemode              'end' (heure de fin) | 'dur' (durée)
     *   endtime, durtime      (HH:MM) — selon timemode
     *   durday                jours à ajouter à la durée
     *   activeTab             une valeur de MODES
     *   days                  7 booléens, index 0 = DIMANCHE (comme Date.getDay)
     *   holidayMode           'none' | 'skip' | 'only' | 'add'
     *   repntimes, repevery, repunit   (mode REPETER ; repunit : day|hour|min)
     *
     * @param {object} [opts]
     *   max      plafond de fermetures générées (défaut 500)
     *   pays     code pays ISO, `null` si inconnu, ou une FONCTION `() => code|null`.
     *            ⚠️ La forme fonction est celle que WCT emploie, et ce n'est pas
     *            un détail : elle n'est appelée que si un filtre de fériés est
     *            réellement actif. Résoudre le pays demande d'interroger la
     *            sélection dans WME, et ce moteur tourne à CHAQUE FRAPPE pour
     *            l'aperçu — un appel au SDK par caractère saisi.
     *   feries   async (pays, debut, fin) => string[] de 'AAAA-MM-JJ', ou null si
     *            la liste n'a pas pu être obtenue. Absente ⇒ aucun filtre.
     *
     * @returns {Promise<{list:Array<{start:Date,end:Date}>, erreur:?{code:string,args:Array},
     *                    avis:Array<{zone:string,code:string,args:Array,niveau:string}>,
     *                    debordement:?{debut:Date,fin:Date}}>}
     */
    async function generer(cfg, opts) {
        opts = opts || {};
        const MAX = opts.max || 500;
        const avis = [];

        const rs = new JDate(cfg.rangestart);
        const re = new JDate(cfg.rangeend);
        if (!isValidDate(rs)) return erreur('errDateStart');
        if (!isValidDate(re)) return erreur('errDateEndInvalid');
        if (re < rs)          return erreur('errDateEnd');

        const [stH, stM] = (cfg.starttime || '00:00').split(':').map(Number);
        const stMin = (stH || 0) * 60 + (stM || 0);

        const joursEnPlus = parseInt(cfg.durday) || 0;
        let dur;
        if (cfg.timemode === 'end') {
            const [etH, etM] = (cfg.endtime || '00:00').split(':').map(Number);
            const etMin = (etH || 0) * 60 + (etM || 0);
            /* Une heure de fin antérieure à l'heure de début décrit une nuit :
               on passe minuit, la durée court jusqu'au lendemain. */
            const base = etMin > stMin ? etMin - stMin : (1440 - stMin + etMin);
            dur = base + joursEnPlus * 1440;
        } else {
            const [dH, dM] = (cfg.durtime || '00:00').split(':').map(Number);
            dur = joursEnPlus * 1440 + (dH || 0) * 60 + (dM || 0);
        }
        if (dur <= 0) return erreur('errNone');

        /* Fin de la plage = minuit LOCAL au lendemain du dernier jour, construite
           comme les occurrences elles-mêmes. `re` sort de new JDate('AAAA-MM-JJ'),
           que JS parse en UTC minuit, tandis que les occurrences sont bâties en
           local : comparer les deux fait tomber la borne après minuit à l'est
           d'UTC, et accepte des débuts qui n'appartiennent plus à la plage. */
        const reDT = makeDSTSafeDate(cfg.rangeend, 1, 0, 0);

        const mode = cfg.activeTab || MODES.CHAQUE_JOUR;
        const list = [];

        /* ⚠️⚠️ LA BORNE PORTE SUR LE DÉBUT DE L'OCCURRENCE, PAS SUR SA FIN.
           Sur la fin, toute fermeture passant minuit perdait le DERNIER jour de la
           plage, en silence : « du 1er au 31 août, 21h → 5h » ne posait que 30
           nuits. Le reste de la fonction raisonnait déjà sur le début.
           Le débordement n'est pas supprimé pour autant : il est ANNONCÉ, calculé
           sur la liste FINALE — le filtre des fériés peut retirer la dernière
           occurrence, et annoncer un débordement qui n'existe plus serait aussi
           faux que taire celui qui existe. */
        const sortie = l => {
            const der = l.length ? l[l.length - 1] : null;
            const deborde = !!der && der.end > reDT;
            return {
                list: l,
                erreur: null,
                avis,
                debordement: deborde ? { debut: der.start, fin: der.end } : null,
            };
        };

        /* ── EN CONTINU : une seule fermeture, du début à la fin ──────────────
           Aucun filtre ne s'applique ici : ni jours de la semaine, ni jours
           fériés, ni répétition. Une fermeture continue qui sauterait le 15 août
           ne serait plus continue. */
        if (mode === MODES.CONTINU) {
            const [enH, enM] = (cfg.endtime || '00:00').split(':').map(Number);
            const s = makeDSTSafeDate(cfg.rangestart, 0, stH, stM);
            const e = makeDSTSafeDate(cfg.rangeend, 0, enH || 0, enM || 0);
            if (e <= s) return erreur('errContEnd');
            list.push({ start: new Date(s), end: new Date(e) });
            /* Sortie directe : la borne de débordement n'a pas d'objet — la fin EST
               la date de fin, elle ne peut pas la dépasser. */
            return { list, erreur: null, avis, debordement: null };
        }

        /* ── RÉPÉTER : N fois, tous les X ─────────────────────────────────── */
        if (mode === MODES.REPETER) {
            const n = parseInt(cfg.repntimes);
            if (isNaN(n) || n < 1) return erreur('errRepeat');
            const every = parseInt(cfg.repevery) || 1;
            const unit  = cfg.repunit || 'day';
            const evMin = unit === 'day' ? every * 1440 : unit === 'hour' ? every * 60 : every;
            if (evMin <= 0) return erreur('errRepEvery');

            /* Un intervalle plus court que la durée fait se chevaucher les
               fermetures. Ce n'est pas refusé — cela peut être voulu — mais cela
               se dit. L'absence d'avis vaut « rien à signaler » : c'est ainsi que
               l'appelant sait qu'il doit masquer sa zone. */
            avis.push(evMin < dur
                ? { zone: ZONES.REPETITION, code: 'repOverlap', args: [evMin, dur], niveau: 'alerte' }
                : RAS(ZONES.REPETITION));

            const first = makeDSTSafeDate(cfg.rangestart, 0, stH, stM);
            for (let i = 0; i < n; i++) {
                if (list.length >= MAX) return erreur('errMaxItems', [MAX], avis);
                const s = first.clone().addMinutes(evMin * i);
                if (s > reDT) break;
                list.push({ start: new Date(s), end: new Date(s.clone().addMinutes(dur)) });
            }
        } else {
            /* ── CHAQUE JOUR : une occurrence par jour coché ───────────────── */
            const dow  = cfg.days || [true, true, true, true, true, true, true];
            const jours = Math.ceil((re - rs + 1) / 86400000);

            for (let d = 0; d < jours; d++) {
                if (list.length >= MAX) return erreur('errMaxItems', [MAX], avis);

                /* ⚠️⚠️ ON PART DE LA CHAÎNE, PAS DE `rs`. `rs` sort de
                   new JDate('AAAA-MM-JJ'), que JS parse en MINUIT UTC, et
                   makeDSTSafeDate relit ensuite ses composantes en LOCAL. À l'ouest
                   d'UTC les deux lectures ne désignent pas le même jour, et la plage
                   ENTIÈRE glissait vers le passé : « du 1er au 6 juillet » posait
                   des fermetures du 30 juin au 5 juillet à New York. */
                const s = makeDSTSafeDate(cfg.rangestart, d, stH, stM);

                /* ⚠️⚠️ LE JOUR DE LA SEMAINE SE LIT EN LOCAL. Lu en UTC, il décale
                   d'un jour entier dès que l'heure de début tombe de l'autre côté de
                   minuit UTC : à l'ouest, TOUTE fermeture de soirée suffit — 21:00 à
                   New York, « lundi » coché ferme le DIMANCHE soir. Ce n'est pas un
                   décalage d'affichage : cela change les jours réellement fermés. */
                if (!dow[s.getDay()]) continue;
                if (s > reDT) break;

                list.push({ start: new Date(s), end: new Date(s.clone().addMinutes(dur)) });
            }
        }

        /* ── Jours fériés ─────────────────────────────────────────────────── */
        const modeFeries = cfg.holidayMode || 'none';
        /* Aucun filtre demandé : il n'y a rien à dire, et la zone doit donc se
           masquer — c'est le seul cas où l'absence de filtre s'affiche. */
        if (modeFeries === 'none') { avis.push(RAS(ZONES.FERIES)); return sortie(list); }
        /* Filtre demandé mais rien à filtrer, ou pas de quoi le faire : on ne touche
           pas à la zone. Voir le commentaire de ZONES. */
        if (list.length === 0 && modeFeries !== 'add') return sortie(list);
        if (typeof opts.feries !== 'function') return sortie(list);

        /* Le pays n'est résolu qu'ICI, et seulement si un filtre est actif : voir
           l'avertissement sur `opts.pays`. */
        const pays = typeof opts.pays === 'function' ? opts.pays() : opts.pays;
        if (!pays) return sortie(list);

        const hols = await opts.feries(pays, list[0].start, list[list.length - 1].end);

        /* ⚠️ TROISIÈME ÉTAT : la liste n'a pas pu être obtenue. On ne filtre RIEN et
           on le dit — plutôt que d'affirmer « aucun jour férié », ce qui serait faux. */
        if (hols === null || hols === undefined) {
            avis.push({ zone: ZONES.FERIES, code: 'holidaysUnavailable', args: [], niveau: 'alerte' });
            return sortie(list);
        }

        /* Le jour férié est celui où la fermeture COMMENCE — même règle que la borne
           de plage et que le filtre des jours de la semaine. */
        const retenues = list.filter(cl => {
            const k = dayKey(cl.start);
            return modeFeries === 'only' ? hols.includes(k) : !hols.includes(k);
        });

        if (modeFeries === 'skip') {
            const retirees = list.length - retenues.length;
            avis.push(retirees > 0
                ? { zone: ZONES.FERIES, code: 'holidaysExcl', args: [retirees], niveau: 'info' }
                : { zone: ZONES.FERIES, code: 'holidaysNone', args: [], niveau: 'info' });
            return sortie(retenues);
        }

        if (modeFeries === 'only') {
            avis.push(retenues.length > 0
                ? { zone: ZONES.FERIES, code: 'holidaysOnly', args: [retenues.length], niveau: 'info' }
                : { zone: ZONES.FERIES, code: 'holidaysOnlyNone', args: [], niveau: 'info' });
            return sortie(retenues);
        }

        /* 'add' — les fériés de la plage viennent EN PLUS de ce qui est déjà là.
           ⚠️ Les bornes sont les chaînes BRUTES des champs date, déjà au format des
              jours fériés : aucune conversion, donc aucun fuseau. Relire `rs`/`re`
              (minuit UTC) donnait la veille à l'ouest d'UTC. */
        const dejaLa = new Set(list.map(cl => dayKey(cl.start)));
        const enPlus = [];
        for (const h of hols) {
            if (h < cfg.rangestart || h > cfg.rangeend) continue;
            if (dejaLa.has(h)) continue;
            const s = makeDSTSafeDate(h, 0, stH, stM);
            if (s > reDT) continue;   // même borne que la boucle : sur le DÉBUT
            enPlus.push({ start: new Date(s), end: new Date(s.clone().addMinutes(dur)) });
        }
        avis.push(enPlus.length > 0
            ? { zone: ZONES.FERIES, code: 'holidaysAdded', args: [enPlus.length], niveau: 'info' }
            : { zone: ZONES.FERIES, code: 'holidaysNone', args: [], niveau: 'info' });

        return sortie([...list, ...enPlus].sort((a, b) => a.start - b.start));
    }

    return {
        VERSION: '1.0.0',
        MODES,
        ZONES,
        generer,
        /* Exposés pour les tests et pour les appelants qui construisent des dates
           dans les mêmes règles — l'extranet en a besoin pour son aperçu. */
        _internes: { JDate, makeDSTSafeDate, dayKey, isValidDate, pad },
    };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = WMECreneaux;
