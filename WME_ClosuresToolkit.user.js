// ==UserScript==
// @name         WME Closures Toolkit
// @name:fr      WME Closures Toolkit
// @name:de      WME Closures Toolkit
// @name:es      WME Closures Toolkit
// @name:pt-BR   WME Closures Toolkit
// @name:pt      WME Closures Toolkit
// @namespace    http://tampermonkey.net/
// @version      0.75.00
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc2NCcgaGVpZ2h0PSc2NCcgdmlld0JveD0nMCAwIDY0IDY0Jz4KICA8cmVjdCB3aWR0aD0nNjQnIGhlaWdodD0nNjQnIHJ4PScxMicgZmlsbD0nIzE1NjVjMCcvPgogIDxkZWZzPjxjbGlwUGF0aCBpZD0nYic+PHJlY3QgeD0nNicgeT0nMTgnIHdpZHRoPSc1MicgaGVpZ2h0PScxMicgcng9JzQnLz48L2NsaXBQYXRoPjwvZGVmcz4KICA8cmVjdCB4PSc2JyB5PScxOCcgd2lkdGg9JzUyJyBoZWlnaHQ9JzEyJyByeD0nNCcgZmlsbD0nd2hpdGUnLz4KICA8ZyBjbGlwLXBhdGg9J3VybCgjYiknPgogICAgPGxpbmUgeDE9JzEwJyB5MT0nMTgnIHgyPScyJyAgeTI9JzMwJyBzdHJva2U9JyNlNTM5MzUnIHN0cm9rZS13aWR0aD0nNScvPgogICAgPGxpbmUgeDE9JzIyJyB5MT0nMTgnIHgyPScxNCcgeTI9JzMwJyBzdHJva2U9JyNlNTM5MzUnIHN0cm9rZS13aWR0aD0nNScvPgogICAgPGxpbmUgeDE9JzM0JyB5MT0nMTgnIHgyPScyNicgeTI9JzMwJyBzdHJva2U9JyNlNTM5MzUnIHN0cm9rZS13aWR0aD0nNScvPgogICAgPGxpbmUgeDE9JzQ2JyB5MT0nMTgnIHgyPSczOCcgeTI9JzMwJyBzdHJva2U9JyNlNTM5MzUnIHN0cm9rZS13aWR0aD0nNScvPgogICAgPGxpbmUgeDE9JzU4JyB5MT0nMTgnIHgyPSc1MCcgeTI9JzMwJyBzdHJva2U9JyNlNTM5MzUnIHN0cm9rZS13aWR0aD0nNScvPgogIDwvZz4KICA8cmVjdCB4PScxMicgeT0nMzAnIHdpZHRoPSc3JyBoZWlnaHQ9JzE0JyByeD0nMy41JyBmaWxsPSd3aGl0ZScvPgogIDxyZWN0IHg9JzQ1JyB5PSczMCcgd2lkdGg9JzcnIGhlaWdodD0nMTQnIHJ4PSczLjUnIGZpbGw9J3doaXRlJy8+CiAgPHJlY3QgeD0nNycgIHk9JzQyJyB3aWR0aD0nMTcnIGhlaWdodD0nNicgcng9JzMnIGZpbGw9J3doaXRlJy8+CiAgPHJlY3QgeD0nNDAnIHk9JzQyJyB3aWR0aD0nMTcnIGhlaWdodD0nNicgcng9JzMnIGZpbGw9J3doaXRlJy8+Cjwvc3ZnPg==
// @description  Advanced recurring closures with queue management — inspired by WME Advanced Closures & waze.tech-informatique.fr
// @description:fr Fermetures récurrentes avancées avec file d'attente — inspiré par WME Advanced Closures & waze.tech-informatique.fr
// @description:de Wiederkehrende Sperrungen mit Warteschlangenverwaltung — inspiriert von WME Advanced Closures & waze.tech-informatique.fr
// @description:es Cierres recurrentes avanzados con cola de espera — inspirado en WME Advanced Closures & waze.tech-informatique.fr
// @description:pt-BR Bloqueios recorrentes avançados com fila de espera — inspirado em WME Advanced Closures & waze.tech-informatique.fr
// @description:pt Cortes de via recorrentes avançados com fila de espera — inspirado em WME Advanced Closures & waze.tech-informatique.fr
// @author       DrSlump34
// @copyright    DrSlump34 2026
// @license      MIT
// @match        https://www.waze.com/fr/editor?env=row*
// @match        https://www.waze.com/*/editor*
// @match        https://www.waze.com/editor*
// @match        https://waze.com/editor*
// @match        https://waze.com/*/editor*
// @match        https://beta.waze.com/*/editor*
// @match        https://beta.waze.com/fr/editor?env=row*
// @exclude      https://beta.waze.com/*user/*editor/*
// @exclude      https://www.waze.com/*user/*editor/*
// @exclude      https://www.waze.com/discuss/*
// @exclude      https://www.waze.com/editor/sdk/*
// @exclude      https://beta.waze.com/editor/sdk/*
// @require      https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.js
// @require      https://cdn.jsdelivr.net/npm/proj4@2.11.0/dist/proj4.js
// @require      https://cdn.jsdelivr.net/npm/shpjs@4.0.4/dist/shp.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      date.nager.at
// @connect      cdn.jsdelivr.net
// @connect      storage.googleapis.com
// @supportURL   https://www.waze.com/discuss/t/script-wme-closures-toolkit/405542
// @downloadURL  https://update.greasyfork.org/scripts/581015/WME%20Closures%20Toolkit.user.js
// @updateURL    https://update.greasyfork.org/scripts/581015/WME%20Closures%20Toolkit.meta.js
// ==/UserScript==

/*
 * Special thanks to:
 *   InstantT  — https://waze.tech-informatique.fr/TC/index.php (CSV Helper, source of inspiration)
 *   dummyd2, seb-d59, WazeDev — WME Advanced Closures (the foundation that made this possible)
 */

/* global W */
(function () {
'use strict';

const SCRIPT_NAME = 'WME Closures Toolkit';
const SCRIPT_ID   = 'wmeClosuresToolkit';
const VERSION     = '0.75.00';

// ─── Date helper ───────────────────────────────────────────────────────────
class JDate extends Date {
    clone()       { return new JDate(this); }
    addMinutes(v) { return new JDate(this.getTime() + v * 60000); }
    addDays(v)    { this.setDate(this.getDate() + v); return this; }
}

// ─── Constants & State ─────────────────────────────────────────────────────
const DIR     = { AtoB:1, BtoA:2, TWO:3 };
const NODE_CL = { none:1, inside:2, all:3 };
// Libell\u00E9 de sens affich\u00E9 dans l'UI \u2014 traduit \u00E0 l'appel (t() n'est pas encore d\u00E9fini ici).
// Ne pas remettre de table fig\u00E9e : \u00AB Double sens \u00BB s'affichait en fran\u00E7ais quelle que soit la langue.
const dirStr  = d => d===DIR.TWO ? t('dirBoth') : d===DIR.AtoB ? t('dirAtoB') : t('dirBtoA');
const DIR_CSV = { 1:'A to B', 2:'B to A', 3:'TWO WAY' };

let sdk        = null;
let enabled    = true;
let presets    = [];
let closeNodes = NODE_CL.none;
let queue      = [];
let lastConfig = null;
let collapsed  = false;
let csvList    = null;
let _displayMode = 'normal'; // 'compact' | 'normal'
let _cardsCollapsedDefault = false; // true = nouvelles cartes de file pliées par défaut
let _applyAborted = false;  // true si l'utilisateur interrompt l'application en cours
let _applyRunning = false;  // true pendant applyQueue() — autorise l'interruption par Échap
// Format d'affichage des dates : 'dmy' (DD/MM/YYYY), 'mdy' (MM/DD/YYYY), 'iso' (YYYY-MM-DD)
// Détection auto : en-US → mdy, tout le reste → dmy
let _dateFormat = (navigator.language||'').toLowerCase().startsWith('en-us') ? 'mdy' : 'dmy';
// Langue : 'auto' = suit WME (défaut), sinon code forcé par l'utilisateur ('fr', 'de', 'pt-BR'…)
let _langPref = 'auto';

// ═══════════════════════════════════════════════════════════════════════════
//  CSS
// ═══════════════════════════════════════════════════════════════════════════
GM_addStyle(`
/* ── Variables ── */
:root {
    --wct-blue:    #2196f3;
    --wct-blue-dk: #1565c0;
    --wct-green:   #43a047;
    --wct-red:     #e53935;
    --wct-orange:  #f57c00;
    --wct-grey:    #9e9e9e;
    --wct-warn:    #f9a825;
    --wct-surface: #ffffff;
    --wct-bg:      #f5f7f9;
    --wct-border:  #dde3ea;
    --wct-text:    #2d3748;
    --wct-text2:   #718096;
    --wct-radius:  8px;
    --wct-shadow:  0 8px 32px rgba(0,0,0,.22), 0 2px 8px rgba(0,0,0,.12);
    --wct-fs-base: 12px;
}

/* ══════════════════════════════════════════
   BOUTON FAB DRAGGABLE
══════════════════════════════════════════ */
#wct-fab-wrap {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 6px rgba(0,0,0,.3);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    transition: box-shadow .15s;
}
#wct-fab-wrap:hover { box-shadow: 0 3px 10px rgba(0,0,0,.4); }
#wct-fab-wrap:active { box-shadow: 0 1px 4px rgba(0,0,0,.3); }
#wct-fab-btn {
    position: relative;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border-radius: 50%;
}
.wct-fab-badge {
    position: absolute;
    top: -4px; right: -4px;
    background: var(--wct-green);
    color: #fff;
    border-radius: 50px;
    font-size: 10px;
    padding: 0 3px;
    display: none;
    align-items: center;
    justify-content: center;
    border: 2px solid #fff;
    pointer-events: none;
    white-space: nowrap;
    z-index: 1;
    box-sizing: border-box;
}
#wct-fab-btn.has-sel .wct-fab-badge { display: flex; }

/* ══════════════════════════════════════════
   OVERLAY
══════════════════════════════════════════ */
#wct-overlay {
    position: fixed;
    z-index: 9990;
    width: min(620px, calc(100vw - 24px));
    background: var(--wct-surface);
    border-radius: 12px;
    box-shadow: var(--wct-shadow);
    border: 1px solid var(--wct-border);
    display: none;
    flex-direction: column;
    max-height: calc(100vh - 110px);
    font-family: 'Rubik','Open Sans',sans-serif;
    font-size: var(--wct-fs-base);
    color: var(--wct-text);
    right: 60px;
    top: 60px;
    overflow: hidden;
}
#wct-overlay.open { display: flex; }

/* Header */
#wct-hdr {
    background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%);
    color: #fff;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: move;
    user-select: none;
    border-radius: 11px 11px 0 0;
    flex-shrink: 0;
}
#wct-overlay.collapsed #wct-hdr { border-radius: 11px; }
.wct-hdr-title {
    font-size: 1.083em; font-weight: 700;
    display: flex; align-items: center; gap: 8px;
}
.wct-hdr-version { font-size: 0.833em; opacity:.6; }
.wct-hdr-btns { display: flex; gap: 5px; }
.wct-hdr-btn {
    background: rgba(255,255,255,.18); border: none; color: #fff;
    width: 24px; height: 24px; border-radius: 50%;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 1.083em; line-height: 1; transition: background .15s; padding: 0;
}
.wct-hdr-btn:hover { background: rgba(255,255,255,.35); }

/* Sel strip */
#wct-sel-strip {
    background: var(--wct-bg); border-bottom: 1px solid var(--wct-border);
    padding: 0.417em 1.167em; font-size: 0.917em;
    display: flex; align-items: center; gap: 7px; flex-shrink: 0;
    transition: background .2s;
}
#wct-sel-strip.has-sel { background: #e8f5e9; }
.wct-sel-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--wct-grey); flex-shrink:0; transition: background .2s; }
#wct-sel-strip.has-sel .wct-sel-dot { background: var(--wct-green); }
.wct-sel-text { color: var(--wct-text2); }
#wct-sel-strip.has-sel .wct-sel-text { color: #2e7d32; font-weight: 600; }
.wct-gpx-layer-ctrl { margin-left:auto; display:flex; align-items:center; gap:4px; cursor:pointer; font-size:0.833em; color:var(--wct-text2); white-space:nowrap; user-select:none; }
.wct-gpx-layer-ctrl input[type=checkbox] { margin:0; cursor:pointer; accent-color:#00897b; }

/* Collapse */
#wct-overlay.collapsed #wct-sel-strip,
#wct-overlay.collapsed #wct-body { display: none; }

/* Body */
#wct-body { overflow-y: auto; flex: 1; padding: 0.5em 0.833em 0.333em; }

/* Sections */
.wct-section {
    font-size: 0.833em; font-weight: 700; text-transform: uppercase;
    letter-spacing: .07em; color: var(--wct-blue);
    border-bottom: 1px solid var(--wct-border);
    margin: 0.5em 0 0.333em; padding-bottom: 0.25em;
    display: flex; align-items: center; gap: 5px; flex-wrap: wrap;
}

/* Buttons */
.wct-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 0.5em 1.083em; border: none; border-radius: 50px;
    font-size: 0.917em; font-weight: 600; cursor: pointer;
    transition: filter .15s, transform .1s; white-space: nowrap;
}
.wct-btn:active { transform: scale(.97); }
.wct-btn-primary { background: var(--wct-blue); color: #fff; }
.wct-btn-primary:hover { filter: brightness(1.1); }
.wct-btn-success { background: var(--wct-green); color: #fff; }
.wct-btn-success:hover { filter: brightness(1.1); }
.wct-btn-danger { background: var(--wct-red); color: #fff; }
.wct-btn-danger:hover { filter: brightness(1.1); }
.wct-btn-neutral { background: var(--wct-border); color: var(--wct-text); }
.wct-btn-neutral:hover { filter: brightness(.95); }
.wct-btn-sm { padding: 0.333em 0.75em; font-size: 0.833em; }
.wct-btn-full { width: 100%; justify-content: center; margin-top: 4px; }
.wct-btn-dis { opacity: .4; cursor: not-allowed; pointer-events: none; }
/* Boutons-icône (tableau des tracés) : pas de bulle, emoji lisible */
.wct-ico { background: transparent; border: none; border-radius: 0; box-shadow: none;
    padding: 1px 3px; margin: 0; cursor: pointer; font-size: 1.35em; line-height: 1;
    vertical-align: middle; transition: transform .1s; }
.wct-ico:hover { transform: scale(1.18); filter: none; background: transparent; }
.wct-ico:active { transform: scale(.9); }
#wct-overlay.wct-compact .wct-ico { background: transparent; border: none; }
#wct-overlay.wct-compact .wct-ico:hover { background: transparent; }
.wct-btn-row { display: flex; gap: 5px; margin-top: 5px; flex-wrap: wrap; }

/* Form */
.wct-label {
    display: block; font-size: 0.833em; font-weight: 600; color: var(--wct-text2);
    margin-bottom: 0.167em; text-transform: uppercase; letter-spacing: .04em;
}
.wct-input, .wct-select {
    width: 100%; padding: 0.25em 0.417em;
    border: 1px solid var(--wct-border); border-radius: var(--wct-radius);
    font-size: 1em; background: #fff; color: var(--wct-text);
    box-sizing: border-box; transition: border-color .15s;
}
.wct-input:focus, .wct-select:focus {
    outline: none; border-color: var(--wct-blue);
    box-shadow: 0 0 0 3px rgba(33,150,243,.15);
}
.wct-row { display: flex; gap: 0.417em; margin-bottom: 0.333em; }
.wct-col { flex: 1; }
.wct-check {
    display: flex; align-items: center; gap: 5px;
    font-size: 0.917em; margin-top: 0.25em; cursor: pointer;
    line-height: 1;
}
.wct-check input { cursor: pointer; accent-color: var(--wct-blue); margin: 0; vertical-align: middle; flex-shrink: 0; }

/* Day chips */
.wct-days { display: flex; flex-wrap: nowrap; gap: 0.25em; margin-top: 0.333em; }
.wct-chip {
    display: inline-flex; align-items: center; justify-content: center;
    flex: 1; height: 1.667em; border-radius: 50px;
    font-size: 0.833em; font-weight: 700; cursor: pointer; user-select: none;
    border: 1px solid var(--wct-border); background: #fff; color: var(--wct-text2);
    transition: background .12s, color .12s, border-color .12s;
}
.wct-chip.on { background: var(--wct-blue); color: #fff; border-color: var(--wct-blue); }
.wct-shortcuts { display: flex; gap: 0.25em; margin-top: 0.25em; }
.wct-sc {
    flex: 1; padding: 0.083em 0.333em; border-radius: 50px;
    border: 1px solid var(--wct-border); font-size: 0.833em;
    cursor: pointer; background: #fff; color: var(--wct-text2);
    text-align: center; white-space: nowrap;
}
.wct-sc:hover { background: var(--wct-bg); }

/* Toggle vertical Durée / Heure fin */
.wct-vtoggle {
    display:flex; align-items:center; justify-content:center;
    flex-shrink:0; cursor:pointer;
    width:20px; height:40px; border-radius:10px;
    border:none; padding:0; position:relative;
    background:var(--wct-blue); transition:background .2s;
}
.wct-vtoggle-knob {
    position:absolute; width:14px; height:14px; border-radius:50%;
    background:#fff; box-shadow:0 1px 3px rgba(0,0,0,.3);
    transition:top .2s; top:3px; left:3px;
}
.wct-vtoggle.end .wct-vtoggle-knob { top:23px; }


/* Tabs */
.wct-tabs { display: flex; border-bottom: 2px solid var(--wct-blue); margin: 0.417em 0 0; }
.wct-tab {
    padding: 0.25em 0.75em; font-size: 0.917em; font-weight: 600; cursor: pointer;
    border: 1px solid transparent; border-bottom: none;
    border-radius: var(--wct-radius) var(--wct-radius) 0 0;
    color: var(--wct-text2); background: transparent; margin-right: 2px;
}
.wct-tab.on {
    background: var(--wct-surface); color: var(--wct-blue);
    border-color: var(--wct-border) var(--wct-border) var(--wct-surface);
    margin-bottom: -2px;
}
.wct-pane {
    display: none; padding: 0.75em;
    border: 1px solid var(--wct-border); border-top: none;
    border-radius: 0 0 var(--wct-radius) var(--wct-radius);
}
.wct-pane.on { display: block; }

/* Alert */
.wct-alert {
    background: #fff8e1; border: 1px solid var(--wct-warn);
    border-radius: var(--wct-radius); padding: 0.5em 0.75em;
    font-size: 0.833em; color: #5d4037; margin-top: 0.5em; line-height: 1.5;
}

/* Queue */
.wct-queue { list-style: none; padding: 0; margin: 0; }
.wct-queue li {
    background: var(--wct-bg); border: 1px solid var(--wct-border);
    border-radius: var(--wct-radius); padding: 0.583em 0.833em; margin-bottom: 0.417em;
    display: flex; align-items: flex-start; gap: 7px;
}
.wct-q-info { flex: 1; }
.wct-q-label { font-weight: 700; color: var(--wct-text); margin-bottom: 2px; }
.wct-q-detail { color: var(--wct-text2); font-size: 0.833em; line-height: 1.4; }
.wct-q-rm { color: var(--wct-red); cursor: pointer; font-size: 1.333em; line-height: 1; flex-shrink: 0; }
.wct-q-rm:hover { opacity: .7; }
.wct-queue-empty { font-size: 0.917em; color: var(--wct-text2); font-style: italic; text-align: center; padding: 0.667em 0; }

/* Progress bar */
.wct-pb-wrap { background: #e0e0e0; border-radius: 50px; height: 6px; overflow: hidden; margin-top: 6px; display: none; }
.wct-pb-fill { height: 100%; background: var(--wct-blue); border-radius: 50px; transition: width .2s; width: 0%; }
.wct-pb-text { font-size: 0.833em; text-align: center; margin-top: 2px; color: var(--wct-text2); }

/* Preview table */
.wct-prev-wrap { overflow-x: auto; margin-top: 0.5em; border-radius: var(--wct-radius); border: 1px solid var(--wct-border); }
.wct-prev-table { width: 100%; border-collapse: collapse; font-size: 0.833em;  }
.wct-prev-table th {
    background: var(--wct-blue); color: #fff; padding: 0.417em 0.583em;
    text-align: left; font-size: 0.833em; font-weight: 700;
    text-transform: uppercase; letter-spacing: .04em;
}
.wct-prev-table td { padding: 0.417em 0.583em; border-bottom: 1px solid var(--wct-border); vertical-align: middle; }
.wct-row-ok   td { background: #f1f8f1; }
.wct-row-warn td { background: #fff8e1; }
.wct-row-old  td { background: #fafafa; color: var(--wct-grey); }
.wct-row-err  td { background: #fff0f0; color: var(--wct-red); font-weight: 600; }
.wct-lot-hdr  td { background: #1565c0; color: #fff; font-weight: 700; padding: 0.417em 0.583em; font-size: 0.917em; }
.wct-badge {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 0.083em 0.5em; border-radius: 50px; font-size: 0.833em; font-weight: 700;
}
.wct-badge-dir  { background: #e3f2fd; color: #1565c0; }
.wct-badge-mte  { background: #f3e5f5; color: #6a1b9a; }
.wct-badge-node { background: #e8f5e9; color: #1b5e20; }
.wct-badge-count { background: #eceff1; color: #37474f; cursor: help; }
.wct-badge-count-warn { background: #fff3e0; color: #e65100; cursor: help; }
.wct-badge-count-error { background: #ffebee; color: #c62828; cursor: help; }
.wct-badge-null { background: #fff9c4; color: #f57f17; cursor: help; }
.wct-badge-recent { background: #fff3e0; color: #e65100; cursor: help; }
.wct-badge-it   { background: #fce4ec; color: #880e4f; }
.wct-badge-none { background: #eee; color: #666; }
.wct-badge-warn { background: #fff8e1; color: #f57c00; cursor: pointer; border: 1px solid #f57c00; }
.wct-badge-warn:hover { background: #fff3cd; }

/* Drop zone */
.wct-dropzone {
    border: 2px dashed var(--wct-border); border-radius: var(--wct-radius);
    padding: 0.833em; text-align: center; font-size: 0.917em; color: var(--wct-text2);
    cursor: pointer; transition: border-color .15s, color .15s;
}
.wct-dropzone:hover { border-color: var(--wct-blue); color: var(--wct-blue); }

/* Log */
.wct-log {
    background: #1e1e1e; border: 1px solid var(--wct-border);
    border-radius: var(--wct-radius); padding: 0.667em 0.833em;
    font-size: 0.917em; font-family: monospace; max-height: 180px;
    overflow-y: auto; margin-top: 0.417em; color: #d4d4d4; display: none;
}

/* Small preview */
#wct-small-prev { font-size:0.917em; color:var(--wct-text2); padding:0.333em 0; margin-top:0.5em; }
.wct-prev-box { text-align:left; margin-top:0.5em; max-height:130px; overflow-y:auto; border:1px solid var(--wct-border); border-radius:var(--wct-radius); background:var(--wct-bg2,#f7fafc); padding:5px 8px; font-size:0.833em; line-height:1.5; }
.wct-prev-head { font-weight:700; color:var(--wct-blue); margin-bottom:3px; position:sticky; top:-5px; background:inherit; padding:2px 0; }
.wct-prev-row { font-family:ui-monospace,Menlo,Consolas,monospace; color:var(--wct-text2); white-space:nowrap; }
.wct-prev-more { color:var(--wct-grey); font-style:italic; margin-top:3px; }

/* Sidebar */
#wct-sidebar { padding: 10px 12px; font-family: 'Rubik','Open Sans',sans-serif; font-size:12px; }
#wct-sidebar h2 { font-size:13px; font-weight:700; color:var(--wct-blue); margin:0 0 8px; }
.wct-sb-hint { font-size:11px; color:var(--wct-text2); line-height:1.6; margin:0; }
.wct-toggle-row { display:flex; align-items:center; justify-content:space-between; margin-top:12px; }
.wct-toggle { position:relative; width:36px; height:20px; }
.wct-toggle input { opacity:0; width:0; height:0; }
.wct-toggle-slider { position:absolute; cursor:pointer; inset:0; background:#ccc; border-radius:50px; transition:background .2s; }
.wct-toggle-slider:before { content:''; position:absolute; width:14px; height:14px; left:3px; bottom:3px; background:#fff; border-radius:50%; transition:transform .2s; }
.wct-toggle input:checked + .wct-toggle-slider { background:var(--wct-blue); }
.wct-toggle input:checked + .wct-toggle-slider:before { transform:translateX(16px); }

/* Tooltip */
.wct-tooltip {
    position: absolute;
    background: #333; color: #fff;
    font-size: 11px; padding: 4px 8px;
    border-radius: 4px; white-space: nowrap;
    pointer-events: none; z-index: 10000;
    top: 50%; transform: translateY(-50%);
    right: calc(100% + 8px);
    opacity: 0; transition: opacity .15s;
}
#wct-fab-btn:hover .wct-tooltip { opacity: 1; }

/* ── Onglets principaux ── */
#wct-main-tabs { display:flex; flex-shrink:0; border-bottom:3px solid var(--wct-blue); }
.wct-main-tab {
    flex:1; padding:0.667em 4px; font-size:0.917em; font-weight:700; cursor:pointer;
    border:none; border-right:1px solid var(--wct-border);
    background:var(--wct-bg); color:var(--wct-text2);
    transition:background .15s, color .15s;
}
.wct-main-tab:last-child { border-right:none; }
.wct-main-tab.on { background:#fff; color:var(--wct-blue); border-bottom:3px solid var(--wct-blue); margin-bottom:-3px; }
.wct-main-pane { display:none; padding:0.833em 0 0.333em; }
.wct-main-pane.on { display:block; }
/* Code couleur file d'attente */
.wct-queue li.src-cfg { border-left:3px solid #2196f3; }
.wct-queue li.src-csv { border-left:3px solid #43a047; }
.wct-queue li.src-pre { border-left:3px solid #f57c00; }


/* ── Onglets principaux colorés ── */
#wct-main-tabs { display:flex; flex-shrink:0; }
.wct-main-tab {
    flex:1; padding:0.667em 4px; font-size:0.917em; font-weight:700; cursor:pointer;
    border:none; border-right:1px solid var(--wct-border);
    border-top:3px solid transparent;
    border-bottom:none;
    background:var(--wct-bg); color:var(--wct-text2);
    transition:background .15s, color .15s, border-color .15s;
}
.wct-main-tab:last-child { border-right:none; }
.wct-main-tab[data-tab="cfg"] { --tc:#2196f3; }
.wct-main-tab[data-tab="csv"] { --tc:#43a047; }
.wct-main-tab[data-tab="pre"] { --tc:#f57c00; }
.wct-main-tab[data-tab="gpx"] { --tc:#00897b; }
.wct-main-tab[data-tab="src"] { --tc:#e91e63; }
.wct-main-tab.on { background:#fff; color:var(--tc,var(--wct-blue)); }
.wct-tab-icon-only { padding-left:0.5em !important; padding-right:0.5em !important; min-width:0 !important; flex:0 0 auto !important; }
.wct-main-pane { display:none; padding:0.833em 0 0.333em; }
.wct-main-pane.on { display:block; }
/* Queue cards */
.wct-qcard { border-radius:var(--wct-radius); margin-bottom:6px; overflow:hidden; }
.wct-qcard-hdr:hover { background:#eef4fb !important; }
/* Onglets — couleur toujours visible */
.wct-main-tab[data-tab="cfg"] { border-top:3px solid #2196f3 !important; }
.wct-main-tab[data-tab="csv"] { border-top:3px solid #43a047 !important; }
.wct-main-tab[data-tab="pre"] { border-top:3px solid #f57c00 !important; }
.wct-main-tab[data-tab="gpx"] { border-top:3px solid #00897b !important; }
.wct-main-tab[data-tab="src"] { border-top:3px solid #e91e63 !important; }
.wct-main-tab.on[data-tab="cfg"] { background:#e3f2fd; color:#1565c0; }
.wct-main-tab.on[data-tab="csv"] { background:#e8f5e9; color:#2e7d32; }
.wct-main-tab.on[data-tab="pre"] { background:#fff3e0; color:#e65100; }
.wct-main-tab.on[data-tab="gpx"] { background:#e0f2f1; color:#00695c; }
.wct-main-tab.on[data-tab="src"] { background:#fce4ec; color:#880e4f; }


/* ── Toast ── */
#wct-toast {
    position: absolute;
    top: 44px;
    bottom: auto;
    left: 50%;
    transform: translateX(-50%);
    background: #323232;
    color: #fff;
    font-size: 0.917em;
    padding: 0.583em 1.167em;
    border-radius: 50px;
    white-space: nowrap;
    z-index: 200;
    opacity: 0;
    pointer-events: none;
    transition: opacity .25s;
    max-width: 90%;
    text-align: center;
}
#wct-toast.show { opacity: 1; pointer-events: auto; }

/* ── Overlay layout: body scroll, boutons fixes ── */
#wct-overlay { flex-direction: column; }
#wct-body {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 0.333em;
}
/* Progression + Stop ancrés en bas de la zone défilante : le bouton Stop reste
   atteignable pendant toute l'application, sans avoir à faire défiler le panneau. */
.wct-progress-dock {
    position: sticky;
    bottom: 0;
    z-index: 5;
    background: var(--wct-surface);
}
#wct-overlay.wct-compact .wct-progress-dock { background: #c0c0c0; }

/* Pied « Valider » — footer fixe hors défilement, toujours accessible.
   Visible uniquement quand l'onglet Configurer est actif (via :has). */
.wct-validate-footer {
    flex-shrink: 0;
    padding: 0.5em 1.167em 0.333em;
    border-top: 1px solid var(--wct-border);
    background: var(--wct-surface);
}
#wct-overlay:not(:has(#wct-pane-cfg.on)) .wct-validate-footer { display: none !important; }
#wct-overlay.wct-compact .wct-validate-footer { background: #c0c0c0; border-top-color: #808080; }
#wct-action-bar-wrap {
    flex-shrink: 0;
    padding: 0.5em 1.167em 0.667em;
    border-top: 1px solid var(--wct-border);
    background: var(--wct-surface);
    display: flex;
    gap: 5px;
}
#wct-action-bar-wrap .wct-btn {
    flex: 1;
    justify-content: center;
    font-size: 0.833em;
    padding: 0.5em 2px;
}

/* ── Onglets grisés ── */
.wct-main-tab.disabled {
    opacity: .38;
    cursor: not-allowed;
    pointer-events: none;
}
.wct-pane { padding: 0.5em; }
.wct-alert { padding: 0.333em 0.583em; font-size: 0.833em; margin-top: 0.417em; }
.wct-btn { padding: 0.333em 0.833em; font-size: 0.917em; }
.wct-btn-sm { padding: 0.25em 0.583em; font-size: 0.833em; }
#wct-small-prev { padding: 0.167em 0; margin-top: 0.333em; font-size: 0.917em; }
.wct-main-tab { padding: 0.417em 4px; font-size: 0.917em; }
.wct-queue-empty { padding: 0.417em 0; font-size: 0.917em; }
.wct-qcard { margin-bottom: 0.333em; }
.wct-qcard-hdr { padding: 0.333em 0.583em !important; }
.wct-qcard-hdr span { font-size: 0.917em !important; }
#wct-hdr { padding: 0.583em 1em; }
.wct-hdr-title { font-size: 1.083em; }
#wct-sel-strip { padding: 0.25em 1em; font-size: 0.917em; }
#wct-action-bar-wrap { padding: 0.417em 0.833em 0.5em; gap: 4px; }
.wct-dropzone { padding: 0.667em; font-size: 0.917em; }
#wct-presets-table th { padding: 0.25em 0.417em; }
#wct-presets-table td { padding: 0.25em 0.417em; }


/* ── Onglet aide ── */
.wct-main-tab[data-tab="help"] { --tc:#9c27b0; }
.wct-main-tab[data-tab="help"].disabled { opacity:1 !important; pointer-events:auto !important; }
.wct-help-wrap { padding: 2px 0; }
.wct-help-section { border: 1px solid var(--wct-border); border-radius: var(--wct-radius); margin-bottom: 0.333em; overflow:hidden; }
.wct-help-hdr {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.417em 0.75em; font-size: 0.917em; font-weight: 700;
    cursor: pointer; background: var(--wct-bg); color: var(--wct-text);
    user-select: none;
}
.wct-help-hdr.on { color: var(--wct-blue); background: #e3f2fd; }
.wct-help-hdr:hover { background: #eef4fb; }
.wct-help-body { padding: 0.583em 0.75em; font-size: 0.917em; line-height: 1.5; color: var(--wct-text); }
.wct-help-body p { margin: 0 0 0.417em; }
.wct-help-table { width: 100%; border-collapse: collapse; }
.wct-help-table td { padding: 0.25em 0.417em; vertical-align: top; border-bottom: 1px solid var(--wct-border); }
.wct-help-table td:first-child { width: 130px; font-size: 0.833em; white-space: nowrap; color: var(--wct-text2); }

/* ── Tableau GPX ── */
.wct-gpx-table { width:100%; border-collapse:collapse; font-size:0.75em; }
.wct-gpx-table th { padding:0.25em 0.333em; color:var(--wct-text2); font-weight:600; border-bottom:1px solid var(--wct-border); text-align:left; white-space:nowrap; }
.wct-gpx-table td { padding:0.2em 0.333em; border-bottom:1px solid var(--wct-border); vertical-align:middle; }
.wct-gpx-name { max-width:130px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.wct-gpx-time { color:var(--wct-text2); white-space:nowrap; }
.wct-gpx-pts  { color:#2e7d32; white-space:nowrap; text-align:right; }
.wct-gpx-err  { white-space:nowrap; text-align:center; }
.wct-gpx-has-err { color:#c62828; cursor:help; }
.wct-gpx-swatch-cell { position:relative; }
.wct-gpx-swatch { display:inline-block; width:14px; height:14px; border-radius:3px; vertical-align:middle; cursor:pointer; box-shadow:0 0 0 1px rgba(0,0,0,.2); }
.wct-gpx-swatch:hover { box-shadow:0 0 0 2px rgba(0,0,0,.4); transform:scale(1.15); }
.wct-gpx-palette { position:absolute; z-index:99999; background:#fff; border:1px solid var(--wct-border); border-radius:6px; padding:5px; display:grid; grid-template-columns:repeat(4,18px); gap:3px; box-shadow:0 3px 10px rgba(0,0,0,.2); }
.wct-gpx-pal-chip { display:inline-block; width:18px; height:18px; border-radius:3px; cursor:pointer; box-shadow:0 0 0 1px rgba(0,0,0,.15); transition:transform .1s; }
.wct-gpx-pal-chip:hover { transform:scale(1.2); box-shadow:0 0 0 2px rgba(0,0,0,.35); }
.wct-gpx-pos { padding:0 5px !important; font-size:1em !important; line-height:1.4 !important; background:none !important; border:none !important; box-shadow:none !important; cursor:pointer; }
.wct-gpx-pos:hover { transform:scale(1.2); filter:none !important; }
.wct-gpx-del { padding:0 5px !important; font-size:1em !important; line-height:1.4 !important; background:none !important; border:none !important; box-shadow:none !important; cursor:pointer; }
.wct-gpx-del:hover { transform:scale(1.2); filter:none !important; }
.wct-drop-hover { border-color:var(--wct-green) !important; background:#f1f8e9 !important; }

/* ── Onglet Recherche ── */
.wct-src-section { font-size:0.833em; font-weight:600; color:var(--wct-text2); text-transform:uppercase; letter-spacing:.04em; margin:10px 0 5px; }
.wct-src-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:5px 8px; }
/* Toggle ET/OU — discret, inline après le label */
.wct-src-andor-wrap { display:flex; align-items:center; gap:5px; margin:5px 0 3px; }
.wct-src-andor-lbl { font-size:0.75em; color:var(--wct-text2); }
.wct-src-andor-toggle { display:flex; border:1px solid var(--wct-border); border-radius:3px; overflow:hidden; }
.wct-src-andor-btn { padding:1px 7px; font-size:0.75em; font-weight:500; cursor:pointer; border:none; background:var(--wct-bg2); color:var(--wct-text2); transition:background .12s,color .12s; line-height:1.6; }
.wct-src-andor-btn + .wct-src-andor-btn { border-left:1px solid var(--wct-border); }
.wct-src-andor-btn.on { background:#6c8ebf; color:#fff; }
/* Checkboxes statut */
.wct-src-status-grid { display:flex; flex-wrap:wrap; gap:3px 6px; margin-top:3px; }
.wct-src-status-cb { display:flex; align-items:center; gap:3px; font-size:0.75em; cursor:pointer; white-space:nowrap; }
.wct-src-status-cb input { margin:0; cursor:pointer; }
/* Résultats */
.wct-src-results-hdr { font-size:0.833em; font-weight:600; color:#880e4f; margin:8px 0 4px; }
.wct-src-table { width:100%; border-collapse:collapse; font-size:0.75em; margin-top:4px; }
.wct-src-table th { padding:0.25em 0.333em; color:var(--wct-text2); font-weight:600; border-bottom:2px solid var(--wct-border); text-align:left; white-space:nowrap; cursor:pointer; user-select:none; }
.wct-src-table th:hover { color:var(--wct-blue); }
.wct-src-table th .wct-sort-icon { font-size:0.75em; margin-left:2px; opacity:.5; }
.wct-src-table th.sort-asc .wct-sort-icon::after  { content:'▲'; opacity:1; }
.wct-src-table th.sort-desc .wct-sort-icon::after { content:'▼'; opacity:1; }
.wct-src-table th:not(.sort-asc):not(.sort-desc) .wct-sort-icon::after { content:'⇅'; }
.wct-src-table td { padding:0.25em 0.333em; border-bottom:1px solid var(--wct-border); vertical-align:middle; }
.wct-src-table tr:hover td { background:rgba(233,30,99,.06); }
.wct-src-center { cursor:pointer; font-size:1em; padding:0 3px; background:none; border:none; }
.wct-src-center:hover { transform:scale(1.2); }
.wct-src-name { max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; display:inline-block; }
.wct-src-desc-cell { max-width:180px; }
.wct-src-desc-item { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.wct-src-desc-item + .wct-src-desc-item { margin-top:2px; padding-top:2px; border-top:1px dotted var(--wct-border); }
.wct-src-mte-cell { max-width:110px; }
.wct-src-mte-item { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:var(--wct-text2); font-style:italic; }
.wct-src-mte-item + .wct-src-mte-item { margin-top:2px; padding-top:2px; border-top:1px dotted var(--wct-border); }
.wct-src-mte-unresolved { font-family:monospace; font-style:normal; color:#b0853a; cursor:help; border-bottom:1px dotted #b0853a; }
.wct-src-hint { font-size:0.75em; color:var(--wct-text2); margin-bottom:6px; line-height:1.4; }
/* Badges statut fermeture */
.wct-cl-status { display:inline-block; padding:1px 5px; border-radius:3px; font-size:0.75em; font-weight:600; white-space:nowrap; }
.wct-cl-status-ACTIVE                                   { background:#e8f5e9; color:#2e7d32; }
.wct-cl-status-NOT_STARTED                              { background:#e3f2fd; color:#1565c0; }
.wct-cl-status-SUSPENDED                                { background:#fff3e0; color:#e65100; }
.wct-cl-status-FINISHED                                 { background:#f5f5f5; color:#757575; }
.wct-cl-status-FINISHED_EARLY_DUE_TO_DELETION           { background:#fce4ec; color:#880e4f; }
.wct-cl-status-FINISHED_EARLY_DUE_TO_OVERLAPPING_CLOSURES { background:#fff8e1; color:#f57f17; }
.wct-cl-status-UNVERIFIED                               { background:#ede7f6; color:#4527a0; }
.wct-cl-status-FAILED                                   { background:#ffebee; color:#b71c1c; }
.wct-cl-status-UNKNOWN                                  { background:#f5f5f5; color:#9e9e9e; }

/* ══════════════════════════════════════════
   MODE COMPACT — austère, carré, dense
══════════════════════════════════════════ */

/* Forme générale : suppression des arrondis, ombres, gradients */
#wct-overlay.wct-compact { border-radius: 0; box-shadow: none; border: 2px solid #888; max-height: calc(100vh - 110px); }
#wct-overlay.wct-compact #wct-hdr {
    background: #000080; /* bleu Win95 */
    border-radius: 0;
    padding: 3px 6px;
}
#wct-overlay.wct-compact .wct-hdr-btn { background: #c0c0c0; color: #000; border-radius: 0; border: 2px outset #fff; width: 18px; height: 18px; font-size: 0.833em; }
#wct-overlay.wct-compact .wct-hdr-btn:hover { background: #d4d0c8; filter: none; }
#wct-overlay.wct-compact #wct-sel-strip { padding: 1px 6px; background: #c0c0c0; border-bottom: 1px solid #888; }
#wct-overlay.wct-compact #wct-sel-strip.has-sel { background: #c0c0c0; }
#wct-overlay.wct-compact #wct-sel-strip .wct-sel-text { color: #000; font-weight: 600; }
#wct-overlay.wct-compact #wct-sel-strip.has-sel .wct-sel-text { color: #000080; }

/* Body */
#wct-overlay.wct-compact #wct-body { padding: 3px 5px 2px; background: #c0c0c0; }
#wct-overlay.wct-compact { background: #c0c0c0; color: #000; }

/* Sections */
#wct-overlay.wct-compact .wct-section {
    margin: 3px 0 2px; padding-bottom: 1px;
    font-size: 0.75em; color: #000; border-bottom: 1px solid #888;
}

/* Labels */
#wct-overlay.wct-compact .wct-label { margin-bottom: 1px; font-size: 0.75em; color: #000; }

/* Inputs & selects — Win95 : sunken border, fond blanc, hauteur forcée */
#wct-overlay.wct-compact .wct-input,
#wct-overlay.wct-compact .wct-select {
    padding: 0 3px;
    height: 1.6em;
    border-radius: 0;
    border: 2px inset #808080;
    background: #fff;
    font-size: 0.909em;
    box-shadow: none;
}
#wct-overlay.wct-compact .wct-input:focus,
#wct-overlay.wct-compact .wct-select:focus { box-shadow: none; border-color: #808080; outline: 1px dotted #000; }

/* Rows */
#wct-overlay.wct-compact .wct-row { margin-bottom: 2px; gap: 3px; }

/* Boutons Win95 : raised border, fond gris */
#wct-overlay.wct-compact .wct-btn {
    padding: 1px 8px;
    border-radius: 0;
    border: 2px outset #fff;
    background: #c0c0c0;
    color: #000;
    font-size: 0.909em;
    font-weight: 400;
    box-shadow: none;
    filter: none;
    transition: none;
}
#wct-overlay.wct-compact .wct-btn:hover { filter: none; background: #d4d0c8; }
#wct-overlay.wct-compact .wct-btn:active { border-style: inset; transform: none; }
#wct-overlay.wct-compact .wct-btn-primary { background: #c0c0c0; color: #000080; font-weight: 700; }
#wct-overlay.wct-compact .wct-btn-success { background: #c0c0c0; color: #006400; font-weight: 700; }
#wct-overlay.wct-compact .wct-btn-danger  { background: #c0c0c0; color: #800000; font-weight: 700; }
#wct-overlay.wct-compact .wct-btn-sm { padding: 0 5px; font-size: 0.833em; }
#wct-overlay.wct-compact .wct-btn-row { margin-top: 2px; gap: 2px; }

/* Chips jours — carrés, plats */
#wct-overlay.wct-compact .wct-chip {
    height: 1.3em; border-radius: 0;
    border: 1px solid #808080;
    background: #c0c0c0; color: #000;
    font-size: 0.75em;
}
#wct-overlay.wct-compact .wct-chip.on { background: #000080; color: #fff; border-color: #000; }
#wct-overlay.wct-compact .wct-days { gap: 1px; margin-top: 2px; }
#wct-overlay.wct-compact .wct-shortcuts { gap: 1px; margin-top: 2px; }
#wct-overlay.wct-compact .wct-sc {
    padding: 0 3px; border-radius: 0;
    border: 1px solid #808080; background: #c0c0c0; color: #000;
    font-size: 0.75em;
}
#wct-overlay.wct-compact .wct-sc:hover { background: #d4d0c8; }

/* Checkbox */
#wct-overlay.wct-compact .wct-check { margin-top: 1px; font-size: 0.909em; }

/* Onglets principaux */
#wct-overlay.wct-compact .wct-main-tab {
    padding: 1px 4px; border-radius: 0;
    border-top: none !important; border-right: 1px solid #808080;
    background: #a0a0a0; color: #000; font-size: 0.833em;
    transition: none; line-height: 1.4;
}
#wct-overlay.wct-compact .wct-main-tab.on { background: #c0c0c0; color: #000; font-weight: 700; }
#wct-overlay.wct-compact #wct-main-tabs { border-bottom: 1px solid #808080; }

/* Onglets secondaires */
#wct-overlay.wct-compact .wct-tab { padding: 1px 6px; border-radius: 0; font-size: 0.833em; }
#wct-overlay.wct-compact .wct-tabs { margin-top: 2px; border-bottom-color: #808080; }
#wct-overlay.wct-compact .wct-pane { padding: 3px; border-radius: 0; border-color: #808080; }

/* Alert */
#wct-overlay.wct-compact .wct-alert {
    padding: 1px 4px; margin-top: 2px;
    border-radius: 0; border-color: #808080;
    background: #ffffc0; color: #000; font-size: 0.833em;
}

/* Barre d'action */
#wct-overlay.wct-compact #wct-action-bar-wrap {
    padding: 1px 4px 1px; gap: 2px;
    background: #c0c0c0; border-top: 2px solid #808080;
}
#wct-overlay.wct-compact #wct-action-bar-wrap .wct-btn { padding: 0 2px; font-size: 0.833em; line-height: 1.3; }

/* Queue */
/* Queue cards — header plus serré */
#wct-overlay.wct-compact .wct-qcard { border-radius: 0; margin-bottom: 1px; }
#wct-overlay.wct-compact .wct-qcard-hdr { padding: 1px 4px !important; border-radius: 0; background: #000080 !important; color: #fff !important; line-height: 1.2; }
#wct-overlay.wct-compact .wct-qcard-hdr:hover { background: #0000a0 !important; }
/* Tout le contenu textuel du header en blanc */
#wct-overlay.wct-compact .wct-qcard-hdr * { color: #fff !important; }
#wct-overlay.wct-compact .wct-qcard-hdr span { font-size: 0.833em !important; }
/* Badges dans header compact — gris clair, texte noir, lisibles sur #000080 */
#wct-overlay.wct-compact .wct-qcard-hdr .wct-badge { border-radius: 0 !important; background: #c0c0c0 !important; color: #000 !important; font-size: 0.75em !important; padding: 0 3px; }
#wct-overlay.wct-compact .wct-qcard-hdr .wct-badge-warn { background: #ffff00 !important; color: #000 !important; border-color: #808080; }
#wct-overlay.wct-compact .wct-qcard-hdr .wct-qcard-del { color: #ff8080 !important; font-size: 12px; }
#wct-overlay.wct-compact .wct-qcard-chevron { color: #c0c0c0 !important; }

/* Tableau queue — lignes basses */
#wct-overlay.wct-compact .wct-qcard-body table { font-size: 0.833em; }
#wct-overlay.wct-compact .wct-qcard-body td,
#wct-overlay.wct-compact .wct-qcard-body th { padding: 1px 3px !important; line-height: 1.2; }
#wct-overlay.wct-compact .wct-qcard-body thead tr { background: #a0a0a0 !important; }
#wct-overlay.wct-compact .wct-qcard-body thead th span { font-size: 0.833em !important; }

/* Onglets Chaque Jour / Répéter — Win95 */
#wct-overlay.wct-compact .wct-tabs { margin-top: 2px; border-bottom: 2px solid #808080; }
#wct-overlay.wct-compact .wct-tab {
    padding: 1px 8px; border-radius: 0;
    border: 2px outset #fff; border-bottom: none;
    background: #a0a0a0; color: #000;
    font-size: 0.833em; font-weight: 400;
    margin-right: 1px;
}
#wct-overlay.wct-compact .wct-tab.on {
    background: #c0c0c0; color: #000; font-weight: 700;
    border-style: outset; border-bottom: 2px solid #c0c0c0;
    margin-bottom: -2px;
}
#wct-overlay.wct-compact .wct-pane {
    padding: 3px; border-radius: 0;
    border: 2px inset #808080; border-top: none;
    background: #c0c0c0;
}

/* Vtoggle — Win95 : bouton carré plat, knob masqué */
#wct-overlay.wct-compact .wct-vtoggle {
    border-radius: 0;
    width: 18px; height: 32px;
    background: #c0c0c0;
    border: 2px outset #fff;
    transition: none;
}
#wct-overlay.wct-compact .wct-vtoggle:active { border-style: inset; }
#wct-overlay.wct-compact .wct-vtoggle-knob { display: none; }
#wct-overlay.wct-compact .wct-vtoggle::after {
    content: '⇅';
    color: #000; font-size: 10px; font-weight: 700;
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
}
/* Badge J+1 — carré, sobre */
#wct-overlay.wct-compact #wct-dur-jpn,
#wct-overlay.wct-compact #wct-endtime-jpn {
    border-radius: 0 !important;
    background: #808080 !important;
    color: #fff !important;
    font-size: 8px !important;
    padding: 0 2px !important;
}
/* Onglets principaux — encore plus serrés */
#wct-overlay.wct-compact #wct-small-prev { padding: 1px 0; margin-top: 2px; font-size: 0.833em; }
#wct-overlay.wct-compact .wct-dropzone { padding: 4px; border-radius: 0; border-style: dashed; border-color: #808080; }
#wct-overlay.wct-compact .wct-log { padding: 2px 4px; margin-top: 2px; border-radius: 0; }
#wct-overlay.wct-compact #wct-presets-table th,
#wct-overlay.wct-compact #wct-presets-table td { padding: 1px 3px; }
#wct-overlay.wct-compact .wct-badge { border-radius: 0; }

#wct-overlay.wct-compact .wct-help-wrap { padding: 1px 0; }
#wct-overlay.wct-compact .wct-help-section { border: 2px inset #808080; border-radius: 0; margin-bottom: 1px; }
#wct-overlay.wct-compact .wct-help-hdr {
    padding: 1px 5px; font-size: 0.833em;
    background: #000080; color: #fff;
    border-radius: 0;
}
#wct-overlay.wct-compact .wct-help-hdr.on { background: #000080; color: #fff; }
#wct-overlay.wct-compact .wct-help-hdr:hover { background: #0000a0; }
#wct-overlay.wct-compact .wct-help-body {
    padding: 2px 5px; font-size: 0.833em;
    background: #c0c0c0; color: #000;
    border-top: 1px solid #808080;
}
#wct-overlay.wct-compact .wct-help-body p { margin: 0 0 2px; }
#wct-overlay.wct-compact .wct-help-table td { padding: 1px 3px; border-bottom: 1px solid #808080; }
#wct-overlay.wct-compact .wct-help-table td:first-child { color: #000080; font-weight: 700; font-size: 0.833em; }
#wct-overlay.wct-compact .wct-vtoggle { border-radius: 0; }
#wct-overlay.wct-compact .wct-vtoggle-knob { border-radius: 0; }

/* Onglet Recherche — Win95 */
#wct-overlay.wct-compact .wct-src-section { font-size: 0.833em; color: #000080; font-weight: 700; margin: 4px 0 2px; }
#wct-overlay.wct-compact .wct-src-andor-toggle { border-radius: 0; border: 2px inset #808080; }
#wct-overlay.wct-compact .wct-src-andor-btn { border-radius: 0; background: #c0c0c0; color: #000; }
#wct-overlay.wct-compact .wct-src-andor-btn.on { background: #000080; color: #fff; }
#wct-overlay.wct-compact .wct-src-andor-btn + .wct-src-andor-btn { border-left: 1px solid #808080; }
#wct-overlay.wct-compact .wct-src-table { font-size: 0.833em; }
#wct-overlay.wct-compact .wct-src-table th { border-bottom: 2px solid #808080; color: #000080; }
#wct-overlay.wct-compact .wct-src-table th:hover { color: #0000a0; }
#wct-overlay.wct-compact .wct-src-table td { border-bottom: 1px solid #808080; }
#wct-overlay.wct-compact .wct-src-table tr:hover td { background: #d4d0c8; }
#wct-overlay.wct-compact .wct-cl-status { border-radius: 0; border: 1px solid #808080; }
#wct-overlay.wct-compact .wct-src-results-hdr { color: #000080; }
#wct-overlay.wct-compact .wct-src-desc-item + .wct-src-desc-item,
#wct-overlay.wct-compact .wct-src-mte-item + .wct-src-mte-item { border-top: 1px dotted #808080; }
#wct-overlay.wct-compact .wct-src-mte-unresolved { color: #800000; border-bottom-color: #800000; }

/* ══════════════════════════════════════════
   RESPONSIVE — adaptation automatique aux petits écrans
   S'applique quel que soit le thème (normal ou compact), sans réglage.
══════════════════════════════════════════ */

/* Grille 2 colonnes de l'onglet Configurer (ex-style inline, désormais pilotable) */
.wct-cfg-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; align-items:start; }

/* — Écrans peu hauts (portables) : on densifie verticalement pour que le bouton
     « Valider » et la file d'attente restent visibles sans devoir scroller — */
@media (max-height: 820px) {
    /* Police de base réduite : tout étant en em, ceci rétrécit l'ensemble d'un coup */
    #wct-overlay { --wct-fs-base: 11px !important; max-height: calc(100vh - 68px); top: 52px; }
    #wct-body { padding-top: 0.25em; padding-bottom: 0.2em; }
    #wct-body .wct-section { margin: 0.3em 0 0.2em; }
    #wct-body .wct-row { margin-bottom: 0.2em; }
    #wct-body .wct-input, #wct-body .wct-select { padding-top: 0.12em; padding-bottom: 0.12em; }
    #wct-body .wct-check { margin-top: 0.1em; }
    #wct-body .wct-btn-full { margin-top: 2px; }
    #wct-body .wct-days { margin-top: 0.2em; }
    #wct-body .wct-shortcuts { margin-top: 0.15em; }
    #wct-main-tabs .wct-main-tab { padding-top: 0.4em; padding-bottom: 0.4em; }
    #wct-action-bar-wrap { padding-top: 0.35em; padding-bottom: 0.4em; }
    .wct-validate-footer { padding-top: 0.3em; padding-bottom: 0.2em; }
}

/* — Écrans très bas : densité maximale — */
@media (max-height: 680px) {
    #wct-overlay { max-height: calc(100vh - 44px); top: 36px; }
    #wct-hdr { padding-top: 0.35em; padding-bottom: 0.35em; }
    #wct-sel-strip { padding-top: 0.12em; padding-bottom: 0.12em; }
    #wct-body .wct-section { margin: 0.2em 0 0.12em; }
}

/* — Fenêtre étroite : on empile les 2 colonnes du Configurer en une seule — */
@media (max-width: 560px) {
    .wct-cfg-grid { grid-template-columns: 1fr; gap: 4px; }
    /* Onglets du haut : moins d'air pour éviter que les libellés passent à la ligne */
    #wct-main-tabs .wct-main-tab { font-size: 0.8em; padding-left: 2px; padding-right: 2px; }
}

`);


// ═══════════════════════════════════════════════════════════════════════════
//  I18N — détection langue + dictionnaire FR/EN/DE
// ═══════════════════════════════════════════════════════════════════════════
let _lang = 'en';

// Langues traduites. L'ordre fixe celui du sélecteur ; le libellé est dans la langue
// elle-même (un germanophone cherche « Deutsch », pas « Allemand »).
const LANGS = [
    { code:'fr',    label:'Français'      },
    { code:'en',    label:'English'       },
    { code:'de',    label:'Deutsch'       },
    { code:'es',    label:'Español'       },
    { code:'pt-BR', label:'Português (BR)'},
    { code:'pt-PT', label:'Português (PT)'},
];

// Langue déduite de WME/navigateur. Le portugais est traité à part : seul « br » distingue
// le brésilien ; « pt » nu ou « pt-PT » ⇒ portugais européen.
const detectLang = () => {
    try {
        const l = (W?.userscripts?.state?.locale || document.documentElement.lang || navigator.language || 'en').toLowerCase();
        if (l.startsWith('pt')) return l.includes('br') ? 'pt-BR' : 'pt-PT';
        return LANGS.map(x => x.code).find(code => !code.includes('-') && l.startsWith(code)) || 'en';
    } catch(e) { return 'en'; }
};

// Langue effective = préférence forcée, ou détection auto si 'auto' (défaut).
const resolveLang = () => (_langPref !== 'auto' && LANGS.some(x => x.code === _langPref)) ? _langPref : detectLang();

// Sélecteur de variante par langue, avec repli sur l'anglais.
// Usage : _L({fr:'…', en:'…', de:'…'}) — utilisé pour les gros blocs (aide) et les
// libellés qui ne peuvent pas vivre dans le dictionnaire.
const _L = obj => obj[_lang] ?? obj.en;

const t = (key, ...args) => {
    const D = {
        fr: {
            // Onglets
            tabCfg:'\u2699 Configurer', tabCsv:'\uD83D\uDCC2 CSV',
            tabPre:'\uD83D\uDCBE Pr\u00E9r\u00E9glages', tabGpx:'\uD83D\uDDFA Trac\u00e9s', tabSrc:'\uD83D\uDD0D Recherche', tabHelp:'\u2753', tabHelpTitle:'Aide',
            // Onglet Recherche
            srcSectionTime:'\uD83D\uDCC5 Fen\u00EAtre temporelle',
            srcLblStartAfter:'D\u00E9but apr\u00E8s le', srcLblStartBefore:'D\u00E9but avant le',
            srcLblEndAfter:'Fin apr\u00E8s le', srcLblEndBefore:'Fin avant le',
            srcSectionKeywords:'\uD83D\uDD0D Mots-cl\u00E9s',
            srcLblDesc:'Description contient', srcLblMte:'\u00C9v\u00E9nement MTE contient',
            srcBtnAnd:'ET', srcBtnOr:'OU',
            srcBtnSearch:'Rechercher',
            srcBtnClear:'Effacer',
            srcNoResults:'Aucun segment trouv\u00E9 avec ces crit\u00E8res.',
            srcNoClosures:'Aucune fermeture charg\u00E9e dans la vue courante.',
            srcResults: n => `${n} segment(s) trouv\u00E9(s)`,
            srcBtnGoCfg:'\u2699 Basculer vers Configurer',
            srcHint:'Segments portant des fermetures charg\u00E9es dans la vue courante.',
            srcLoading:'Recherche en cours\u2026',
            srcSectionStatus:'\uD83D\uDCA1 \u00C9tat',
            srcStatusAll:'Tous',
            srcStatusLabels:{
                ACTIVE:'En cours',
                NOT_STARTED:'En attente',
                SUSPENDED:'Suspendue',
                FINISHED:'Termin\u00E9e',
                FINISHED_EARLY_DUE_TO_DELETION:'Supprim\u00E9e',
                FINISHED_EARLY_DUE_TO_OVERLAPPING_CLOSURES:'Chevauchement',
                UNVERIFIED:'Non v\u00E9rifi\u00E9e',
                FAILED:'Erreur',
                UNKNOWN:'Inconnu',
            },
            srcTipStatus:'Filtrer par \u00E9tat de fermeture. Cochez les \u00E9tats \u00E0 inclure dans les r\u00E9sultats.',
            srcTipStartAfter:'Date de d\u00E9but de fermeture \u2265 cette date',
            srcTipStartBefore:'Date de d\u00E9but de fermeture \u2264 cette date',
            srcTipEndAfter:'Date de fin de fermeture \u2265 cette date',
            srcTipEndBefore:'Date de fin de fermeture \u2264 cette date',
            srcTipDesc:'Recherche insensible \u00E0 la casse dans le libell\u00E9 de la fermeture',
            srcTipMte:'Recherche insensible \u00E0 la casse dans le nom de l\u2019\u00E9v\u00E9nement MTE associ\u00E9',
            srcTipAndOr:'ET : les deux champs doivent correspondre \u2014 OU : au moins un doit correspondre',
            srcTipAndOrLbl:'entre Description et MTE',
            srcTipSearch:'Lancer la recherche sur les fermetures charg\u00E9es dans la vue courante',
            srcTipClear:'R\u00E9initialiser tous les crit\u00E8res et les r\u00E9sultats',
            srcTipGoCfg:'S\u00E9lectionner ces segments et basculer vers l\u2019onglet Configurer pour cr\u00E9er des fermetures',
            srcTipCenterRow:'Centrer la carte sur ce segment (compens\u00E9 pour la zone visible)',
            srcColId:'ID', srcColName:'Nom', srcColClosures:'Ferm.', srcColStatus:'\u00C9tat', srcColDesc:'Description', srcColMte:'MTE',
            srcTipColDesc:'Trier par description',
            srcTipMteId:'\u00C9v\u00E9nement MTE non charg\u00E9 en m\u00E9moire \u2014 seul l\u2019identifiant est disponible. Ouvrez l\u2019onglet \u00C9v\u00E9nements de WME pour charger les noms, puis relancez la recherche.',
            srcTipColId:'Trier par identifiant de segment',
            srcTipColName:'Trier par nom de rue',
            srcTipColClosures:'Trier par nombre de fermetures correspondantes',
            srcTipColStatus:'Trier par \u00E9tat',
            srcTipColMte:'Trier par nom d\u2019\u00E9v\u00E9nement MTE',
            gpxLayerCtrl:'Calque Trac\u00e9s',
            // Tableau des trac\u00e9s
            trkColTrack:'Trac\u00e9', trkColTime:'Heure',
            trkTipFileColor:'Couleur pour tous les trac\u00e9s', trkTipColor:'Changer la couleur', trkTipColorCol:'Couleur',
            trkExpand:'D\u00e9plier', trkCollapse:'Replier',
            trkTipDelFile:'Supprimer le fichier', trkTipDel:'Supprimer', trkTipFocus:'Centrer',
            trkTipLoadTime:'Heure de chargement', trkTipFormat:'Format du fichier',
            trkTipPts:'Points trac\u00e9s (sous-\u00e9chantillonn\u00e9s si > 3 000)', trkTipStatus:'\u00c9tat',
            // P\u00E9riode
            sectionPeriod:'\uD83D\uDCC5 P\u00E9riode',
            lblStart:'D\u00E9but', lblEnd:'Fin',
            lblStartTime:'Heure d\u00E9but', lblDurTime:'Dur\u00E9e h:mm', lblDurDay:'+Jours',
            lblEndTime:'Heure Fin',
            btnDur:'\u23F1 Dur\u00E9e', btnEndTime:'\u23F1 Heure fin',
            lblToggleDur:'DUR', lblToggleEnd:'FIN',
            lblDuration:'Durée',
            jpnPrefix:'J+',
            tipToggle:'Mode Dur\u00E9e\u00A0: saisir une dur\u00E9e (H:MM) \u2014 Mode Heure de fin\u00A0: saisir l\u2019heure exacte de fin. Cliquez pour basculer.',
            tabEachDay:'\uD83D\uDCC6 Chaque jour', tabRepeat:'\uD83D\uDD01 R\u00E9p\u00E9ter',
            days:['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],
            scAll:'Tous', scWth:'Lun\u2013Jeu', scWd:'Lun\u2013Ven', scWe:'Sam\u2013Dim', scNone:'Aucun',
            skipHolidays:'Sauf jours f\u00E9ri\u00E9s',
            lblHolidays:'Jours f\u00E9ri\u00E9s\u00A0:',
            holidayModeNone:'Jours f\u00E9ri\u00E9s\u00A0: aucun filtre',
            holidayModeSkip:'Sauf jours f\u00E9ri\u00E9s',
            holidayModeOnly:'Uniquement jours f\u00E9ri\u00E9s',
            holidaysOnly: n => `\u2705 ${n} occurrence(s) sur jour(s) f\u00E9ri\u00E9(s) conserv\u00E9e(s).`,
            holidaysOnlyNone:'\u26A0\uFE0F Aucun jour f\u00E9ri\u00E9 dans la plage\u00A0\u2014 file vide.',
            lblNtimes:'Combien de fois\u00A0?', lblEvery:'Toutes les',
            unitDay:'Jour(s)', unitHour:'Heure(s)', unitMin:'Minute(s)',
            // Param\u00E8tres
            sectionParams:'\uD83D\uDCDD Param\u00E8tres',
            lblDesc:'Description', lblDir:'Sens',
            dirBoth:'Double sens', dirAtoB:'A \u21D2 B', dirBtoA:'B \u21D2 A',
            lblMte:'MTE associ\u00E9',
            lblMteHint:'Ouvrez l\u2019onglet \u00C9v\u00E9nements dans WME pour charger les MTE',
            lblMtePh:'Aucun MTE',
            mteRefresh:'\u21BB',
            mteRefreshTip:'Recharger les MTE depuis l\u2019onglet \u00C9v\u00E9nements WME',
            mteNone:'— Aucun MTE —',
            mteEmpty:'Ouvrez l\u2019onglet \u00C9v\u00E9nements WME puis cliquez \u21BB',
            lblNodes:'Fermetures aux n\u0153uds',
            nodeNone:'Aucune (□—□—□—□)', nodeInner:'Intérieures (□—■—■—□)', nodeAll:'Toutes (■—■—■—■)',
            lblIT:'Ignorer le trafic',
            tipIT:'Si coch\u00e9, Waze ne r\u00e9ouvre pas automatiquement le segment m\u00eame s\u2019il d\u00e9tecte du trafic passant.',
            tipHolSkip:'Aucune fermeture ne sera propos\u00e9e les jours f\u00e9ri\u00e9s \u2014 ces occurrences sont retir\u00e9es de la liste.',
            tipHolOnly:'Les fermetures ne seront propos\u00e9es QUE les jours f\u00e9ri\u00e9s \u2014 toutes les autres occurrences sont ignor\u00e9es.',
            tipHolAdd:'Ajoute les jours f\u00e9ri\u00e9s de la plage en suppl\u00e9ment des jours s\u00e9lectionn\u00e9s (union).',
            holidayModeAdd:'+ Jours f\u00e9ri\u00e9s',
            holidaysAdded: n => `\u2705 ${n} jour(s) f\u00e9ri\u00e9(s) ajout\u00e9(s) en suppl\u00e9ment.`,
            alertDir:'\u26A0\uFE0F Pour les longs tron\u00E7ons, le sens A \u21D2 B peut diff\u00E9rer par segment.',
            // File
            sectionQueue:'\uD83D\uDCCB File d\u2019attente', queueEmpty:'File vide.',
            btnValidate:'\u2714 Valider et ajouter \u00E0 la file',
            btnStop:'\u23F9 Stop', btnStopping:'\u23F3 Arr\u00EAt\u2026', btnApply:'\u25B6 Appliquer', btnCsv:'\u2B07 CSV', btnClear:'\uD83D\uDDD1 Vider',
            // CSV
            dropText:'\uD83D\uDCC4 Cliquer ou glisser un fichier CSV ici',
            dropHint:'Ajout direct en file d\u2019attente',
            gpxDropText:'\uD83D\uDDFA Cliquer ou glisser un fichier ici',
            gpxDropHint:'Formats accept\u00e9s\u00a0: GPX, KML, KMZ, GeoJSON, Shapefile (ZIP) \u2014 cumul des calques',
            // Couverture
            covTitle:'V\u00e9rifier les segments du parcours non s\u00e9lectionn\u00e9s',
            covResult: (pct,n) => n===0 ? `Couverture\u00a0: ${pct}\u00a0% \u2014 tous les segments emprunt\u00e9s sont s\u00e9lectionn\u00e9s \u2705` : `Couverture\u00a0: ${pct}\u00a0% \u2014 ${n} segment(s) emprunt\u00e9(s) non s\u00e9lectionn\u00e9(s)`,
            covLegend:'\uD83D\uDFE3 En magenta pointill\u00e9 : segments emprunt\u00e9s par le trac\u00e9 mais non s\u00e9lectionn\u00e9s (\u00e0 traiter).',
            covAllOk:'\u2705 Le trac\u00e9 ne passe sur aucun segment oubli\u00e9.',
            covZone: (n,k) => `Zone ${n} \u2014 ${k} segment(s)`,
            covClear:'Effacer',
            covNoSel:'S\u00e9lectionnez d\u2019abord les segments du parcours.',
            covNoPts:'Ce fichier ne contient aucun point exploitable.',
            covNoSeg:'Aucun segment WME charg\u00e9 \u00e0 proximit\u00e9 du trac\u00e9 (d\u00e9placez/zoomez la carte sur le parcours).',
            covNoOverlap:'Le trac\u00e9 ne traverse pas la zone charg\u00e9e (d\u00e9placez la carte sur le parcours).',
            covOutside: p => `${p}\u00a0% du trac\u00e9 est hors zone charg\u00e9e \u2014 d\u00e9placez la carte pour le v\u00e9rifier enti\u00e8rement.`,
            covFocus:'Centrer sur cette zone',
            // S\u00E9lection
            noSel:'Aucun segment s\u00E9lectionn\u00E9',
            hasSel: n => `\u2705 ${n} segment(s) s\u00E9lectionn\u00E9(s)`,
            newSel:'Nouvelle s\u00E9lection \u2014 file conserv\u00E9e.',
            multiCountry: cc => `\u26A0\uFE0F Multi-pays\u00A0: ${cc} \u2014 filtre JF impossible.`,
            // Toasts
            toastOk: (n,s,b) => b>0 ? `\u26A0\uFE0F ${n} fermeture(s) pour ${s} segment(s) valide(s) \u2014 ${b} segment(s) ignor\u00E9(s)` : `\u2705 ${n} fermeture(s) ajout\u00E9e(s) pour ${s} segment(s).`,
            errNone:'\u274C Aucune fermeture g\u00E9n\u00E9r\u00E9e.',
            fillForm:'Remplissez le formulaire\u2026',
            closuresN: n => `${n} fermeture(s) configur\u00E9e(s)`,
            previewHead: n => `${n} fermeture(s) \u00E0 appliquer\u00A0:`,
            previewMore: n => `\u2026 et ${n} autre(s)`,
            // Confirms
            confirmClear:'Vider la file\u00A0?',
            confirmApply: n => `Appliquer ${n} lot(s) dans WME\u00A0?`,
            confirmDel: n => `Supprimer \u00AB\u00A0${n}\u00A0\u00BB\u00A0?`,
            // Colonnes
            colId:'ID', colName:'Nom', colStart:'D\u00E9but', colEnd:'Fin', colState:'\u00C9tat',
            colIdTip:'Identifiant du segment', colNameTip:'Nom du segment',
            colStartTip:'Date/heure de d\u00E9but', colEndTip:'Date/heure de fin',
            colStateTip:'\uD83D\uDFE2 OK  \uD83D\uDFE0 En cours  \uD83D\uDD34 Chevauchement  \u26AB Pass\u00E9e',
            stateOk:'OK', stateOn:'En cours', stateOv:'Chevauchement', statePast:'Pass\u00E9e',
            stateNull:'Segment absent du data model \u2014 modification r\u00E9cente non encore propagée. Sera ignoré à l\u2019application.',
            nullSegBadgeTip: n => `${n} segment(s) absent(s) du data model \u2014 modification r\u00E9cente non propagée. Ajouter à la file pour les détails.`,
            stateRecent:'Segment modifié après le dernier assemblage de tiles Waze \u2014 la fermeture risque d\u2019être rejetée. Attendez la prochaine mise à jour (toutes les 24h).',
            recentSegBadgeTip: n => `${n} segment(s) modifié(s) après le dernier assemblage de tiles \u2014 fermetures potentiellement rejetées à l\u2019application.`,
            nodeIconNone:'\u26AA Aucun', nodeIconInner:'\uD83D\uDFE1 Int\u00E9rieurs', nodeIconAll:'\uD83D\uDD34 Tous',
            noMte:'No MTE',
            // Infobulles badges lot
            countBadge: (o,s) => `${o}\u00D7${s} seg`,
            tipCount: (o,s) => `${o} fermeture(s) \u00D7 ${s} segment(s) \u2014 hors lignes supprim\u00E9es et conflits de sens. Les chevauchements ne sont d\u00E9tect\u00E9s qu'\u00E0 l'application.`,
            tipDir:'Direction de fermeture',
            tipITon:'Ignore le trafic \u2014 pas de d\u00E9tection', tipIToff:'D\u00E9tecte le trafic',
            tipNodes: n => `Fermetures aux n\u0153uds\u00A0: ${n}`,
            tipMte: n => `MTE associ\u00E9\u00A0: ${n}`,
            tipPresetLoad:'Charger', tipPresetDel:'Supprimer',
            fabNoSeg:'S\u00E9lectionnez des segments sur la carte',
            btnCollapse:'R\u00E9duire', btnClose:'Fermer',
            // Pr\u00E9r\u00E9glages
            presetColName:'Nom', presetColDesc:'Description',
            presetColTime:'Horaire', presetColDir:'Dir',
            presetNamePh:'Nom du pr\u00E9r\u00E9glage\u2026',
            presetPopupTitle:'\uD83D\uDCBE Sauvegarder le pr\u00E9r\u00E9glage',
            btnSave:'Sauvegarder', btnCancel:'Annuler',
            presetErrEmpty:'Entrez un nom.', presetErrDup:'Ce nom existe d\u00E9j\u00E0.',
            presetSaved: n => `\u2705 Pr\u00E9r\u00E9glage \u00AB\u00A0${n}\u00A0\u00BB sauvegard\u00E9.`,
            // Jours f\u00E9ri\u00E9s
            holidaysExcl: n => `\u2139\uFE0F ${n} jour(s) f\u00E9ri\u00E9(s) exclu(s).`,
            holidaysNone:'\u2139\uFE0F Aucun jour f\u00E9ri\u00E9 dans la p\u00E9riode.',
            // R\u00E9p\u00E9ter
            warnInt: (ev,dur) => `\u26A0\uFE0F Intervalle (${ev}\u00A0min) < dur\u00E9e (${dur}\u00A0min)\u00A0: chevauchement.`,
            warnOcc: (max,req) => `\u2139\uFE0F Seulement ${max} occurrence(s) possible(s) dans la p\u00E9riode (${req} demand\u00E9es).`,
            warnZero:'\u26A0\uFE0F Intervalle nul.',
            // Apply log
            applyOk: (r,s) => `\u2705 ${r} ${s}`,
            applyErr: (r,s,e) => `\u274C ${r} ${s} \u2014 ${e}`,
            tipCenter:'Centrer sur ce segment',
            tipPresetSaveBtn:'Sauvegarder en pr\u00E9r\u00E9glage',
            errDateStart:'Date de d\u00E9but invalide',
            errDateEnd:'Date de fin avant date de d\u00E9but',
            warnDatePast:'La date de d\u00e9but est dans le pass\u00e9.',
            warnDateEnd:'La date de fin est ant\u00e9rieure \u00e0 la date de d\u00e9but.',
            warnDateMax: n => `La plage g\u00e9n\u00e8rerait plus de ${n} fermetures. R\u00e9duisez la p\u00e9riode.`,
            errRepeat:'Nombre de r\u00E9p\u00E9titions invalide',
            errMaxItems: n => `\u274C Limite de ${n} fermetures atteinte \u2014 v\u00E9rifiez la plage de dates ou r\u00E9duisez la p\u00E9riode.`,
            defaultClosure:'Fermeture',
            selectAll:'Tout s\u00E9lectionner',
            // Segments \u00e9cart\u00e9s (sens incompatible)
            exclWarnTitle: n => `${n} segment(s) \u00e9cart\u00e9(s) \u2014 sens incompatible. Ils ne seront pas trait\u00e9s. Cliquez pour t\u00e9l\u00e9charger le d\u00e9tail.`,
            dirConflictTip:'Sens incompatible \u2014 segment non trait\u00e9',
            toastNoCompatible: dir => `\u26A0\uFE0F Aucun segment compatible avec le sens ${dir} \u2014 lot non ajout\u00e9`,
            exclTxtHeader: dir => `Segments \u00e9cart\u00e9s \u2014 sens incompatible avec la fermeture ${dir}`,
            exclTxtBatch:'Lot\u00a0: ',
            exclTxtFooter1:'Ces segments n\u2019ont pas \u00e9t\u00e9 ajout\u00e9s \u00e0 la file.',
            exclTxtFooter2:'Configurez-les dans un autre lot avec le sens adapt\u00e9.',
            exclTxtFilename:'segments_ecartes',
            exclTxtDir:'sens',
            // Poubelle ligne
            tipRowDel:'Supprimer cette occurrence',
            // Header badge file
            queueBadge: n => n===1?'1 lot en file':`${n} lots en file`,
            // Tooltip suppression lot
            tipDelBatch:'Supprimer ce lot',
            tipEditLabel:'Modifier le libellé de ce lot',
            // Apply terminé
            applyStopping:'⏳ Arrêt demandé — fin de la fermeture en cours, puis interruption.',
                        applyStopped:(ok,ko)=>`⏹ Interrompu — ${ok} appliqué(s), ${ko} échec(s)`,
applyDone: (ok,ko,total) => `\u2705 ${ok} OK${ko?' \u2014 '+ko+' erreur(s)':''} sur ${total} fermeture(s).`,
            // Multi-pays alert
            multiCountryAlert: cc => `\u26A0\uFE0F S\u00e9lection multi-pays (${cc}).\nImpossible d\u2019utiliser le filtre jours f\u00e9ri\u00e9s.\nD\u00e9s\u00e9lectionnez les segments d\u2019un seul pays.`,
            // CSV import log
            csvAdded: (ok,ko) => `\u2705 ${ok} fermeture(s) ajout\u00e9e(s) \u00e0 la file${ko?', '+ko+' erreur(s)':''}.`,
            csvBigConfirm: (seg,rows) => `⚠️ Ce fichier contient ${seg} segments répartis sur ${rows} lignes. L'import de gros volumes peut ralentir le navigateur, et WME ne fermera que les segments chargés dans la vue courante. Continuer ?`,
            csvImportCancelled:'Import annulé.',
            sweepTitle:'Sélectionner les segments du tracé (balaie la carte)',
            sweepProgress: (done,total,n) => `Balayage… ${done}/${total} — ${n} segment(s)`,
            sweepDone: n => `✅ ${n} segment(s) sélectionné(s) le long du tracé.`,
            sweepStopped: n => `⏹ Interrompu — ${n} segment(s) sélectionné(s).`,
            sweepConfirm: (a,km) => `Ce tracé fait ~${km} km (${a} déplacements de carte). Le balayage peut prendre un moment et déplacera la vue. Continuer ?`,
            lotsBtnTitle:'Découper un long tracé en lots de fermeture (déplace la carte)',
            lotsNeedConfig:'⚠️ Réglez d’abord la fermeture dans l’onglet Configurer (période, horaires, sens…), puis relancez.',
            lotsConfirm: n => `Ce tracé sera découpé en ${n} lot(s). La carte va se déplacer automatiquement pour charger chaque zone — c’est normal, et ça peut prendre un moment. Générer les fermetures dans la file ?`,
            lotsProgress: (done,total,added,seg) => `Découpage en lots… ${done}/${total} — ${added} lot(s), ${seg} segment(s)`,
            lotsWhyMoving:'La carte se déplace pour charger les segments de chaque lot. Ne touchez pas à la carte pendant l’opération.',
            lotsDone: (added,seg) => `✅ ${added} lot(s) ajoutés à la file (${seg} segment(s)). Onglet Configurer pour vérifier et appliquer.`,
            lotsStopped: (added,seg) => `⏹ Interrompu — ${added} lot(s) déjà dans la file (${seg} segment(s)).`,
            applyLotFocus: (k,n) => `📦 Lot ${k}/${n} : recadrage de la carte pour charger les segments…`,
            applyLotDone: (k,n) => `📦 Lot ${k}/${n} appliqué. Vérifiez sur la carte, puis continuez.`,
            applyLotNext:'▶ Continuer (lot suivant)',
            lotRowLabel: (i,n) => `Lot ${i}/${n}`,
            lotStatusTodo:'à traiter',
            lotStatusDone:'configuré',
            lotShowTitle:'Afficher ce lot sur la carte',
            lotSelTitle:'Sélectionner les segments de ce lot (puis configurer la fermeture)',
            lotSelecting: (i,n) => `Lot ${i}/${n} : chargement des segments…`,
            lotSelected: seg => `✅ ${seg} segment(s) sélectionné(s). Réglez la fermeture, puis « Valider ».`,
            lotNone:'Aucun segment capté dans ce lot.',
            lotNextHint: (i,n) => `📦 Lot suivant à traiter : ${i}/${n}.`,
            lotsAllDone:'✅ Tous les lots sont configurés. Vous pouvez appliquer la file.',
            lotPermaTitle:'Copier le permalien de ce lot (pour retrouver la sélection)',
            lotPermaCopied: n => `🔗 Permalien copié (${n} segments).`,
            lotPermaCopy:'Copiez ce permalien :',
            lotCsvTitle:'Exporter en CSV les lots configurés de cette trace (format WME Advanced Closures)',
            lotCsvNone:'Aucun lot configuré à exporter pour cette trace.',
            lotCsvDone: n => `📥 ${n} lot(s) exporté(s) en CSV.`,
            // Détail entrée file
            entryDetail: (segs,cl,dir,time) => `${segs} seg \u00b7 ${cl} fermeture(s) \u00b7 ${dir} \u00b7 ${time}`,
            // Sidebar
            sbHint:'S\u00E9lectionnez des segments sur la carte, puis cliquez sur le bouton \uD83D\uDEA7 sur la carte pour ouvrir l\u2019outil.',
            sbToggle:'Activer l\u2019outil',
            emojiPickerTip:'Ins\u00e9rer un \u00e9moji',
            sbResetFab:'R\u00E9initialiser la position du bouton',
            sbDesc:'Le bouton \uD83D\uDEA7 est toujours visible sur la carte et peut \u00EAtre d\u00E9plac\u00E9 librement par glisser-d\u00E9poser.<br>Il affiche en vert le nombre de segments s\u00E9lectionn\u00E9s.<br>L\u2019overlay est d\u00E9pla\u00E7able et repliable.<br><br>\uD83D\uDCAC <a href="https://www.waze.com/discuss/t/script-wme-closures-toolkit/405542" target="_blank" style="color:var(--wct-blue)">Fil Discuss</a> &nbsp;·&nbsp; \uD83D\uDD17 <a href="https://greasyfork.org/fr/scripts/581015-wme-closures-toolkit" target="_blank" style="color:var(--wct-blue)">GreasyFork</a>',
            sbDisplayMode:'Affichage',
            sbModeCompact:'Windows 95',
            sbModeNormal:'Normal',
            sbCardsCollapsed:'Cartes de la file pli\u00E9es par d\u00E9faut',

            sbLanguage:'Langue',
            sbLangAuto: l => `Automatique — WME (${l})`,
            sbDateFormat:'Format des dates',
            sbDateDmy:'JJ/MM/AAAA (Europe, reste du monde)',
            sbDateMdy:'MM/JJ/AAAA (USA)',
            sbDateIso:'AAAA-MM-JJ (ISO)',
            sbDateAuto:'(détecté automatiquement)',
            // Aide
            helpH1:'\uD83D\uDE80 D\u00E9marrage rapide', helpH2:'\u2699\uFE0F Configurer une fermeture',
            helpH3:'\uD83D\uDCCB File d\u2019attente', helpH4:'\uD83D\uDCC2 Import CSV',
            helpH5:'\uD83D\uDCBE Pr\u00E9r\u00E9glages', helpH6:'\u26A0\uFE0F Erreurs fr\u00E9quentes & limites', helpH7:'\uD83D\uDDA5\uFE0F Sidebar / Pr\u00E9f\u00E9rences',
            helpH8:'\uD83D\uDDFA Trac\u00e9s',
            helpH9:'\uD83D\uDD0D Recherche de fermetures',
            helpH10:'📦 Longs tracés : le mode lots',
            helpS1:'<b>S\u00E9lectionnez</b> un ou plusieurs segments sur la carte WME',
            helpS2:'Cliquez sur le bouton \uD83D\uDEA7 visible sur la carte (d\u00E9pla\u00E7able par glisser-d\u00E9poser)',
            helpS3:'Dans l\u2019onglet <b>\u2699 Configurer</b>, param\u00E9trez vos fermetures (p\u00E9riode, horaire, jours\u2026)',
            helpS4:'Cliquez <b>\u2714 Valider et ajouter \u00E0 la file</b>',
            helpS5:'R\u00E9p\u00E9tez pour d\u2019autres segments si n\u00E9cessaire',
            helpS6:'Cliquez <b>\u25B6 Appliquer</b> pour cr\u00E9er les fermetures dans WME',
        },
        en: {
            tabCfg:'\u2699 Configure', tabCsv:'\uD83D\uDCC2 CSV',
            tabPre:'\uD83D\uDCBE Presets', tabGpx:'\uD83D\uDDFA Tracks', tabSrc:'\uD83D\uDD0D Search', tabHelp:'\u2753', tabHelpTitle:'Help',
            // Search tab
            srcSectionTime:'\uD83D\uDCC5 Time window',
            srcLblStartAfter:'Start after', srcLblStartBefore:'Start before',
            srcLblEndAfter:'End after', srcLblEndBefore:'End before',
            srcSectionKeywords:'\uD83D\uDD0D Keywords',
            srcLblDesc:'Description contains', srcLblMte:'MTE event contains',
            srcBtnAnd:'AND', srcBtnOr:'OR',
            srcBtnSearch:'Search',
            srcBtnClear:'Clear',
            srcNoResults:'No segments found matching these criteria.',
            srcNoClosures:'No closures loaded in the current view.',
            srcResults: n => `${n} segment(s) found`,
            srcBtnGoCfg:'\u2699 Switch to Configure',
            srcHint:'Segments with closures loaded in the current view.',
            srcLoading:'Searching\u2026',
            srcSectionStatus:'\uD83D\uDCA1 Status',
            srcStatusAll:'All',
            srcStatusLabels:{
                ACTIVE:'Active',
                NOT_STARTED:'Pending',
                SUSPENDED:'Suspended',
                FINISHED:'Finished',
                FINISHED_EARLY_DUE_TO_DELETION:'Deleted',
                FINISHED_EARLY_DUE_TO_OVERLAPPING_CLOSURES:'Overlap',
                UNVERIFIED:'Unverified',
                FAILED:'Failed',
                UNKNOWN:'Unknown',
            },
            srcTipStatus:'Filter by closure status. Check the statuses to include in results.',
            srcTipStartAfter:'Closure start date \u2265 this date',
            srcTipStartBefore:'Closure start date \u2264 this date',
            srcTipEndAfter:'Closure end date \u2265 this date',
            srcTipEndBefore:'Closure end date \u2264 this date',
            srcTipDesc:'Case-insensitive search in the closure description',
            srcTipMte:'Case-insensitive search in the associated MTE event name',
            srcTipAndOr:'AND: both fields must match \u2014 OR: at least one must match',
            srcTipAndOrLbl:'between Description and MTE',
            srcTipSearch:'Search closures loaded in the current map view',
            srcTipClear:'Reset all criteria and results',
            srcTipGoCfg:'Select these segments and switch to Configure tab to create closures',
            srcTipCenterRow:'Center the map on this segment (offset for visible area)',
            srcColId:'ID', srcColName:'Name', srcColClosures:'Cl.', srcColStatus:'Status', srcColDesc:'Description', srcColMte:'MTE',
            srcTipColDesc:'Sort by description',
            srcTipMteId:'MTE event not loaded in memory \u2014 only the ID is available. Open the WME Events tab to load names, then run the search again.',
            srcTipColId:'Sort by segment ID',
            srcTipColName:'Sort by street name',
            srcTipColClosures:'Sort by number of matching closures',
            srcTipColStatus:'Sort by status',
            srcTipColMte:'Sort by MTE event name',
            gpxLayerCtrl:'Tracks layer',
            // Tracks table
            trkColTrack:'Track', trkColTime:'Time',
            trkTipFileColor:'Color for all tracks', trkTipColor:'Change color', trkTipColorCol:'Color',
            trkExpand:'Expand', trkCollapse:'Collapse',
            trkTipDelFile:'Remove file', trkTipDel:'Remove', trkTipFocus:'Focus',
            trkTipLoadTime:'Load time', trkTipFormat:'File format',
            trkTipPts:'Plotted points (subsampled if > 3,000)', trkTipStatus:'Status',
            sectionPeriod:'\uD83D\uDCC5 Period',
            lblStart:'Start', lblEnd:'End',
            lblStartTime:'Start time', lblDurTime:'Duration h:mm', lblDurDay:'+Days',
            lblEndTime:'End time',
            btnDur:'\u23F1 Duration', btnEndTime:'\u23F1 End time',
            lblToggleDur:'DUR', lblToggleEnd:'END',
            lblDuration:'Duration',
            jpnPrefix:'D+',
            tipToggle:'Duration mode\u00A0: enter a duration (H:MM) \u2014 End time mode\u00A0: enter the exact end time. Click to switch.',
            tabEachDay:'\uD83D\uDCC6 Each day', tabRepeat:'\uD83D\uDD01 Repeat',
            days:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
            scAll:'All', scWth:'Mon\u2013Thu', scWd:'Mon\u2013Fri', scWe:'Sat\u2013Sun', scNone:'None',
            skipHolidays:'Except public holidays',
            lblHolidays:'Public holidays:',
            lblNtimes:'How many times?', lblEvery:'Every',
            unitDay:'Day(s)', unitHour:'Hour(s)', unitMin:'Minute(s)',
            sectionParams:'\uD83D\uDCDD Parameters',
            lblDesc:'Description', lblDir:'Direction',
            dirBoth:'Both ways', dirAtoB:'A \u21D2 B', dirBtoA:'B \u21D2 A',
            lblMte:'Associated MTE',
            lblMteHint:'Open the Events tab in WME to load MTEs',
            lblMtePh:'No MTE',
            mteRefresh:'\u21BB',
            mteRefreshTip:'Reload MTEs from WME Events tab',
            mteNone:'— No MTE —',
            mteEmpty:'Open WME Events tab then click \u21BB',
            lblNodes:'Node closures',
            nodeNone:'None (□—□—□—□)', nodeInner:'Inner nodes (□—■—■—□)', nodeAll:'All (■—■—■—■)',
            lblIT:'Ignore traffic',
            tipIT:'If checked, Waze will not automatically reopen the segment even if it detects traffic passing through.',
            tipHolSkip:'No closure will be proposed on public holidays \u2014 those occurrences are removed from the list.',
            tipHolOnly:'Closures will be proposed ONLY on public holidays \u2014 all other occurrences are ignored.',
            tipHolAdd:'Adds public holidays in the range on top of the selected weekdays (union).',
            holidayModeAdd:'+ Public holidays',
            holidaysAdded: n => `\u2705 ${n} additional public holiday(s) added.`,
            alertDir:'\u26A0\uFE0F For long segments, A \u21D2 B direction may differ per segment.',
            sectionQueue:'\uD83D\uDCCB Queue', queueEmpty:'Queue empty.',
            btnValidate:'\u2714 Validate and add to queue',
            btnStop:'\u23F9 Stop', btnStopping:'\u23F3 Stopping\u2026', btnApply:'\u25B6 Apply', btnCsv:'\u2B07 CSV', btnClear:'\uD83D\uDDD1 Clear',
            dropText:'\uD83D\uDCC4 Click or drag a CSV file here',
            dropHint:'Added directly to queue',
            gpxDropText:'\uD83D\uDDFA Click or drag a file here',
            gpxDropHint:'Accepted formats\u00a0: GPX, KML, KMZ, GeoJSON, Shapefile (ZIP) \u2014 layers are cumulative',
            // Coverage
            covTitle:'Check for route segments not selected',
            covResult: (pct,n) => n===0 ? `Coverage: ${pct}% \u2014 all travelled segments are selected \u2705` : `Coverage: ${pct}% \u2014 ${n} travelled segment(s) not selected`,
            covLegend:'\uD83D\uDFE3 Dashed magenta: segments the track runs on but that aren\u2019t selected (to handle).',
            covAllOk:'\u2705 The track runs on no forgotten segment.',
            covZone: (n,k) => `Zone ${n} \u2014 ${k} segment(s)`,
            covClear:'Clear',
            covNoSel:'Select the route segments first.',
            covNoPts:'This file has no usable points.',
            covNoSeg:'No WME segments loaded near the track (pan/zoom the map onto the route).',
            covNoOverlap:'The track does not cross the loaded area (pan the map onto the route).',
            covOutside: p => `${p}% of the track is outside the loaded area \u2014 pan the map to check it fully.`,
            covFocus:'Center on this zone',
            noSel:'No segment selected',
            hasSel: n => `\u2705 ${n} segment(s) selected`,
            newSel:'New selection \u2014 queue kept.',
            multiCountry: cc => `\u26A0\uFE0F Multi-country: ${cc} \u2014 holiday filter unavailable.`,
            toastOk: (n,s,b) => b>0 ? `\u26A0\uFE0F ${n} closure(s) for ${s} valid segment(s) \u2014 ${b} segment(s) skipped` : `\u2705 ${n} closure(s) added for ${s} segment(s).`,
            errNone:'\u274C No closure generated.',
            fillForm:'Fill in the form\u2026',
            closuresN: n => `${n} closure(s) configured`,
            previewHead: n => `${n} closure(s) to apply:`,
            previewMore: n => `\u2026 and ${n} more`,
            confirmClear:'Clear the queue?',
            confirmApply: n => `Apply ${n} batch(es) in WME?`,
            confirmDel: n => `Delete \u201C${n}\u201D?`,
            colId:'ID', colName:'Name', colStart:'Start', colEnd:'End', colState:'State',
            colIdTip:'Segment ID', colNameTip:'Segment name',
            colStartTip:'Start date/time', colEndTip:'End date/time',
            colStateTip:'\uD83D\uDFE2 OK  \uD83D\uDFE0 Ongoing  \uD83D\uDD34 Overlap  \u26AB Past',
            stateOk:'OK', stateOn:'Ongoing', stateOv:'Overlap', statePast:'Past',
            stateNull:'Segment not found in data model \u2014 recent edit not yet propagated. Will be skipped on apply.',
            nullSegBadgeTip: n => `${n} segment(s) missing from data model \u2014 recent edit not yet propagated. Add to queue for details.`,
            stateRecent:'Segment edited after last Waze tile build \u2014 closure may be rejected on apply. Wait for next tile update (every 24h).',
            recentSegBadgeTip: n => `${n} segment(s) edited after last tile build \u2014 closures may be rejected on apply.`,
            nodeIconNone:'\u26AA None', nodeIconInner:'\uD83D\uDFE1 Inner', nodeIconAll:'\uD83D\uDD34 All',
            noMte:'No MTE',
            countBadge: (o,s) => `${o}\u00D7${s} seg`,
            tipCount: (o,s) => `${o} closure(s) \u00D7 ${s} segment(s) \u2014 excluding deleted rows and direction conflicts. Overlaps are only detected on apply.`,
            tipDir:'Closure direction',
            tipITon:'Ignores traffic \u2014 no detection', tipIToff:'Detects traffic',
            tipNodes: n => `Node closures: ${n}`,
            tipMte: n => `Associated MTE: ${n}`,
            tipPresetLoad:'Load', tipPresetDel:'Delete',
            fabNoSeg:'Select segments on the map',
            btnCollapse:'Collapse', btnClose:'Close',
            presetColName:'Name', presetColDesc:'Description',
            presetColTime:'Schedule', presetColDir:'Dir',
            presetNamePh:'Preset name\u2026',
            presetPopupTitle:'\uD83D\uDCBE Save preset',
            btnSave:'Save', btnCancel:'Cancel',
            presetErrEmpty:'Enter a name.', presetErrDup:'This name already exists.',
            presetSaved: n => `\u2705 Preset \u201C${n}\u201D saved.`,
            holidaysExcl: n => `\u2139\uFE0F ${n} public holiday(s) excluded.`,
            holidaysNone:'\u2139\uFE0F No public holidays in the period.',
            holidayModeNone:'Public holidays: no filter',
            holidayModeSkip:'Except public holidays',
            holidayModeOnly:'Public holidays only',
            holidaysOnly: n => `\u2705 ${n} occurrence(s) on public holiday(s) kept.`,
            holidaysOnlyNone:'\u26A0\uFE0F No public holidays in the period \u2014 queue will be empty.',
            warnInt: (ev,dur) => `\u26A0\uFE0F Interval (${ev}\u00A0min) < duration (${dur}\u00A0min): closures will overlap.`,
            warnOcc: (max,req) => `\u2139\uFE0F Only ${max} occurrence(s) possible in the period (${req} requested).`,
            warnZero:'\u26A0\uFE0F Zero interval.',
            applyOk: (r,s) => `\u2705 ${r} ${s}`,
            applyErr: (r,s,e) => `\u274C ${r} ${s} \u2014 ${e}`,
            errDateStart:'Invalid start date',
            errDateEnd:'End date before start date',
            warnDatePast:'Start date is in the past.',
            warnDateEnd:'End date is before start date.',
            warnDateMax: n => `The range would generate more than ${n} closures. Reduce the period.`,
            errRepeat:'Invalid number of repetitions',
            errMaxItems: n => `\u274C Limit of ${n} closures reached \u2014 check the date range or reduce the period.`,
            defaultClosure:'Closure',
            selectAll:'Select all',
            tipCenter:'Center on this segment',
            tipPresetSaveBtn:'Save as preset',
            // Excluded segments (direction conflict)
            exclWarnTitle: n => `${n} segment(s) excluded \u2014 incompatible direction. They will not be processed. Click to download details.`,
            dirConflictTip:'Incompatible direction \u2014 segment skipped',
            toastNoCompatible: dir => `\u26A0\uFE0F No segment compatible with direction ${dir} \u2014 batch not added`,
            exclTxtHeader: dir => `Excluded segments \u2014 direction incompatible with closure ${dir}`,
            exclTxtBatch:'Batch: ',
            exclTxtFooter1:'These segments were not added to the queue.',
            exclTxtFooter2:'Configure them in a separate batch with the appropriate direction.',
            exclTxtFilename:'excluded_segments',
            exclTxtDir:'dir',
            // Row delete
            tipRowDel:'Remove this occurrence',
            // Header badge queue
            queueBadge: n => n===1?'1 batch in queue':`${n} batches in queue`,
            // Batch delete tooltip
            tipDelBatch:'Remove this batch',
            tipEditLabel:'Edit this batch label',
            // Apply done
            applyStopping:'⏳ Stop requested — finishing the current closure, then aborting.',
                        applyStopped:(ok,ko)=>`⏹ Stopped — ${ok} applied, ${ko} failed`,
applyDone: (ok,ko,total) => `\u2705 ${ok} OK${ko?' \u2014 '+ko+' error(s)':''} out of ${total} closure(s).`,
            // Multi-country alert
            multiCountryAlert: cc => `\u26A0\uFE0F Multi-country selection (${cc}).\nCannot use public holiday filter.\nDeselect segments from one country only.`,
            // CSV import log
            csvAdded: (ok,ko) => `\u2705 ${ok} closure(s) added to queue${ko?', '+ko+' error(s)':''}.`,
            csvBigConfirm: (seg,rows) => `⚠️ This file contains ${seg} segments across ${rows} rows. Importing large volumes can slow the browser down, and WME will only close segments loaded in the current view. Continue?`,
            csvImportCancelled:'Import cancelled.',
            sweepTitle:'Select track segments (pans the map)',
            sweepProgress: (done,total,n) => `Sweeping… ${done}/${total} — ${n} segment(s)`,
            sweepDone: n => `✅ ${n} segment(s) selected along the track.`,
            sweepStopped: n => `⏹ Stopped — ${n} segment(s) selected.`,
            sweepConfirm: (a,km) => `This track is ~${km} km (${a} map moves). The sweep may take a while and will move the view. Continue?`,
            lotsBtnTitle:'Split a long track into closure batches (moves the map)',
            lotsNeedConfig:'⚠️ First set up the closure in the Configure tab (period, times, direction…), then try again.',
            lotsConfirm: n => `This track will be split into ${n} batch(es). The map will move automatically to load each area — this is normal and may take a while. Generate the closures in the queue?`,
            lotsProgress: (done,total,added,seg) => `Splitting into batches… ${done}/${total} — ${added} batch(es), ${seg} segment(s)`,
            lotsWhyMoving:'The map moves to load each batch’s segments. Don’t touch the map during the operation.',
            lotsDone: (added,seg) => `✅ ${added} batch(es) added to the queue (${seg} segment(s)). See the Configure tab to review and apply.`,
            lotsStopped: (added,seg) => `⏹ Stopped — ${added} batch(es) already in the queue (${seg} segment(s)).`,
            applyLotFocus: (k,n) => `📦 Batch ${k}/${n}: centering the map to load the segments…`,
            applyLotDone: (k,n) => `📦 Batch ${k}/${n} applied. Check on the map, then continue.`,
            applyLotNext:'▶ Continue (next batch)',
            lotRowLabel: (i,n) => `Batch ${i}/${n}`,
            lotStatusTodo:'to do',
            lotStatusDone:'configured',
            lotShowTitle:'Show this batch on the map',
            lotSelTitle:'Select this batch’s segments (then configure the closure)',
            lotSelecting: (i,n) => `Batch ${i}/${n}: loading segments…`,
            lotSelected: seg => `✅ ${seg} segment(s) selected. Set up the closure, then “Validate”.`,
            lotNone:'No segment captured in this batch.',
            lotNextHint: (i,n) => `📦 Next batch to handle: ${i}/${n}.`,
            lotsAllDone:'✅ All batches are configured. You can apply the queue.',
            lotPermaTitle:'Copy this batch’s permalink (to restore the selection)',
            lotPermaCopied: n => `🔗 Permalink copied (${n} segments).`,
            lotPermaCopy:'Copy this permalink:',
            lotCsvTitle:'Export this track’s configured batches to CSV (WME Advanced Closures format)',
            lotCsvNone:'No configured batch to export for this track.',
            lotCsvDone: n => `📥 ${n} batch(es) exported to CSV.`,
            // Queue entry detail
            entryDetail: (segs,cl,dir,time) => `${segs} seg \u00b7 ${cl} closure(s) \u00b7 ${dir} \u00b7 ${time}`,
            sbHint:'Select segments on the map, then click the \uD83D\uDEA7 button on the map to open the tool.',
            sbToggle:'Enable tool',
            emojiPickerTip:'Insert emoji',
            sbResetFab:'Reset button position',
            sbDesc:'The \uD83D\uDEA7 button is always visible on the map and can be freely repositioned by drag and drop.<br>It shows in green the number of selected segments.<br>The overlay is draggable and collapsible.<br><br>\uD83D\uDCAC <a href="https://www.waze.com/discuss/t/script-wme-closures-toolkit/405542" target="_blank" style="color:var(--wct-blue)">Discuss thread</a> &nbsp;·&nbsp; \uD83D\uDD17 <a href="https://greasyfork.org/fr/scripts/581015-wme-closures-toolkit" target="_blank" style="color:var(--wct-blue)">GreasyFork</a>',
            sbDisplayMode:'Display',
            sbModeCompact:'Windows 95',
            sbModeNormal:'Normal',
            sbCardsCollapsed:'Queue cards collapsed by default',

            sbLanguage:'Language',
            sbLangAuto: l => `Automatic — WME (${l})`,
            sbDateFormat:'Date format',
            sbDateDmy:'DD/MM/YYYY (Europe, worldwide)',
            sbDateMdy:'MM/DD/YYYY (USA)',
            sbDateIso:'YYYY-MM-DD (ISO)',
            sbDateAuto:'(auto-detected)',
            helpH1:'\uD83D\uDE80 Quick start', helpH2:'\u2699\uFE0F Configure a closure',
            helpH3:'\uD83D\uDCCB Queue', helpH4:'\uD83D\uDCC2 Import CSV',
            helpH5:'\uD83D\uDCBE Presets', helpH6:'\u26A0\uFE0F Common errors & limits', helpH7:'\uD83D\uDDA5\uFE0F Sidebar / Preferences',
            helpH8:'\uD83D\uDDFA Tracks',
            helpH9:'\uD83D\uDD0D Closure search',
            helpH10:'📦 Long tracks: batch mode',
            helpS1:'<b>Select</b> one or more segments on the WME map',
            helpS2:'Click the \uD83D\uDEA7 button visible on the map (drag and drop to reposition)',
            helpS3:'In the <b>\u2699 Configure</b> tab, set your closure parameters (period, schedule, days\u2026)',
            helpS4:'Click <b>\u2714 Validate and add to queue</b>',
            helpS5:'Repeat for other segments if needed',
            helpS6:'Click <b>\u25B6 Apply</b> to create closures in WME',
        },
        de: {
            // Reiter
            tabCfg:'\u2699 Einrichten', tabCsv:'\uD83D\uDCC2 CSV',
            tabPre:'\uD83D\uDCBE Vorlagen', tabGpx:'\uD83D\uDDFA Tracks', tabSrc:'\uD83D\uDD0D Suche', tabHelp:'\u2753', tabHelpTitle:'Hilfe',
            // Reiter Suche
            srcSectionTime:'\uD83D\uDCC5 Zeitfenster',
            srcLblStartAfter:'Beginn nach dem', srcLblStartBefore:'Beginn vor dem',
            srcLblEndAfter:'Ende nach dem', srcLblEndBefore:'Ende vor dem',
            srcSectionKeywords:'\uD83D\uDD0D Suchbegriffe',
            srcLblDesc:'Beschreibung enth\u00E4lt', srcLblMte:'MTE-Ereignis enth\u00E4lt',
            srcBtnAnd:'UND', srcBtnOr:'ODER',
            srcBtnSearch:'Suchen',
            srcBtnClear:'Zur\u00FCcksetzen',
            srcNoResults:'Keine Segmente gefunden, die diesen Kriterien entsprechen.',
            srcNoClosures:'Keine Sperrungen in der aktuellen Ansicht geladen.',
            srcResults: n => `${n} Segment(e) gefunden`,
            srcBtnGoCfg:'\u2699 Zu Einrichten wechseln',
            srcHint:'Segmente mit Sperrungen, die in der aktuellen Ansicht geladen sind.',
            srcLoading:'Suche l\u00E4uft\u2026',
            srcSectionStatus:'\uD83D\uDCA1 Status',
            srcStatusAll:'Alle',
            srcStatusLabels:{
                ACTIVE:'Aktiv',
                NOT_STARTED:'Ausstehend',
                SUSPENDED:'Ausgesetzt',
                FINISHED:'Beendet',
                FINISHED_EARLY_DUE_TO_DELETION:'Gel\u00F6scht',
                FINISHED_EARLY_DUE_TO_OVERLAPPING_CLOSURES:'\u00DCberschneidung',
                UNVERIFIED:'Ungepr\u00FCft',
                FAILED:'Fehlgeschlagen',
                UNKNOWN:'Unbekannt',
            },
            srcTipStatus:'Nach Sperrungsstatus filtern. Die einzubeziehenden Status ankreuzen.',
            srcTipStartAfter:'Beginn der Sperrung \u2265 dieses Datum',
            srcTipStartBefore:'Beginn der Sperrung \u2264 dieses Datum',
            srcTipEndAfter:'Ende der Sperrung \u2265 dieses Datum',
            srcTipEndBefore:'Ende der Sperrung \u2264 dieses Datum',
            srcTipDesc:'Suche in der Sperrungsbeschreibung (Gro\u00DF-/Kleinschreibung wird ignoriert)',
            srcTipMte:'Suche im Namen des zugeh\u00F6rigen MTE-Ereignisses (Gro\u00DF-/Kleinschreibung wird ignoriert)',
            srcTipAndOr:'UND: beide Felder m\u00FCssen passen \u2014 ODER: mindestens eines muss passen',
            srcTipAndOrLbl:'zwischen Beschreibung und MTE',
            srcTipSearch:'Sperrungen suchen, die im aktuellen Kartenausschnitt geladen sind',
            srcTipClear:'Alle Kriterien und Ergebnisse zur\u00FCcksetzen',
            srcTipGoCfg:'Diese Segmente ausw\u00E4hlen und zum Reiter Einrichten wechseln, um Sperrungen anzulegen',
            srcTipCenterRow:'Karte auf dieses Segment zentrieren (versetzt in den sichtbaren Bereich)',
            srcColId:'ID', srcColName:'Name', srcColClosures:'Sp.', srcColStatus:'Status', srcColDesc:'Beschreibung', srcColMte:'MTE',
            srcTipColDesc:'Nach Beschreibung sortieren',
            srcTipMteId:'MTE-Ereignis nicht im Speicher geladen \u2014 nur die ID ist verf\u00FCgbar. \u00D6ffne den Reiter Ereignisse in WME, um die Namen zu laden, und starte die Suche erneut.',
            srcTipColId:'Nach Segment-ID sortieren',
            srcTipColName:'Nach Stra\u00DFenname sortieren',
            srcTipColClosures:'Nach Anzahl der passenden Sperrungen sortieren',
            srcTipColStatus:'Nach Status sortieren',
            srcTipColMte:'Nach MTE-Ereignisname sortieren',
            gpxLayerCtrl:'Track-Ebene',
            // Track-Tabelle
            trkColTrack:'Track', trkColTime:'Zeit',
            trkTipFileColor:'Farbe f\u00FCr alle Tracks', trkTipColor:'Farbe \u00E4ndern', trkTipColorCol:'Farbe',
            trkExpand:'Ausklappen', trkCollapse:'Einklappen',
            trkTipDelFile:'Datei entfernen', trkTipDel:'Entfernen', trkTipFocus:'Zentrieren',
            trkTipLoadTime:'Ladezeit', trkTipFormat:'Dateiformat',
            trkTipPts:'Gezeichnete Punkte (unterabgetastet ab > 3.000)', trkTipStatus:'Status',
            sectionPeriod:'\uD83D\uDCC5 Zeitraum',
            lblStart:'Beginn', lblEnd:'Ende',
            lblStartTime:'Startzeit', lblDurTime:'Dauer h:mm', lblDurDay:'+Tage',
            lblEndTime:'Endzeit',
            btnDur:'\u23F1 Dauer', btnEndTime:'\u23F1 Endzeit',
            lblToggleDur:'DAUER', lblToggleEnd:'ENDE',
            lblDuration:'Dauer',
            jpnPrefix:'T+',
            tipToggle:'Dauer-Modus\u00A0: eine Dauer eingeben (H:MM) \u2014 Endzeit-Modus\u00A0: die genaue Endzeit eingeben. Zum Umschalten klicken.',
            tabEachDay:'\uD83D\uDCC6 Wochentage', tabRepeat:'\uD83D\uDD01 Wiederholen',
            days:['So','Mo','Di','Mi','Do','Fr','Sa'],
            scAll:'Alle', scWth:'Mo\u2013Do', scWd:'Mo\u2013Fr', scWe:'Sa\u2013So', scNone:'Keine',
            skipHolidays:'Au\u00DFer an Feiertagen',
            lblHolidays:'Feiertage:',
            lblNtimes:'Wie oft?', lblEvery:'Alle',
            unitDay:'Tag(e)', unitHour:'Stunde(n)', unitMin:'Minute(n)',
            sectionParams:'\uD83D\uDCDD Parameter',
            lblDesc:'Beschreibung', lblDir:'Fahrtrichtung',
            dirBoth:'Beide Richtungen', dirAtoB:'A \u21D2 B', dirBtoA:'B \u21D2 A',
            lblMte:'Zugeh\u00F6riges MTE',
            lblMteHint:'\u00D6ffne den Reiter Ereignisse in WME, um MTEs zu laden',
            lblMtePh:'Kein MTE',
            mteRefresh:'\u21BB',
            mteRefreshTip:'MTEs aus dem WME-Reiter Ereignisse neu laden',
            mteNone:'\u2014 Kein MTE \u2014',
            mteEmpty:'\u00D6ffne den WME-Reiter Ereignisse und klicke dann \u21BB',
            lblNodes:'Knotensperrungen',
            nodeNone:'Keine (\u25A1\u2014\u25A1\u2014\u25A1\u2014\u25A1)', nodeInner:'Innere Knoten (\u25A1\u2014\u25A0\u2014\u25A0\u2014\u25A1)', nodeAll:'Alle (\u25A0\u2014\u25A0\u2014\u25A0\u2014\u25A0)',
            lblIT:'Verkehr ignorieren',
            tipIT:'Wenn aktiviert, \u00F6ffnet Waze das Segment nicht automatisch wieder, selbst wenn Verkehr darauf erkannt wird.',
            tipHolSkip:'An Feiertagen wird keine Sperrung vorgeschlagen \u2014 diese Termine werden aus der Liste entfernt.',
            tipHolOnly:'Sperrungen werden AUSSCHLIESSLICH an Feiertagen vorgeschlagen \u2014 alle anderen Termine entfallen.',
            tipHolAdd:'F\u00FCgt die Feiertage im Zeitraum zus\u00E4tzlich zu den gew\u00E4hlten Wochentagen hinzu (Vereinigung).',
            holidayModeAdd:'+ Feiertage',
            holidaysAdded: n => `\u2705 ${n} zus\u00E4tzliche(r) Feiertag(e) hinzugef\u00FCgt.`,
            alertDir:'\u26A0\uFE0F Bei langen Abschnitten kann die Richtung A \u21D2 B je Segment unterschiedlich sein.',
            sectionQueue:'\uD83D\uDCCB Warteschlange', queueEmpty:'Warteschlange leer.',
            btnValidate:'\u2714 Best\u00E4tigen und zur Warteschlange',
            btnStop:'\u23F9 Stopp', btnStopping:'\u23F3 Wird gestoppt\u2026', btnApply:'\u25B6 Anwenden', btnCsv:'\u2B07 CSV', btnClear:'\uD83D\uDDD1 Leeren',
            dropText:'\uD83D\uDCC4 CSV-Datei hier klicken oder ablegen',
            dropHint:'Wird direkt in die Warteschlange \u00FCbernommen',
            gpxDropText:'\uD83D\uDDFA Datei hier klicken oder ablegen',
            gpxDropHint:'Zul\u00E4ssige Formate\u00A0: GPX, KML, KMZ, GeoJSON, Shapefile (ZIP) \u2014 Ebenen summieren sich',
            // Abdeckung
            covTitle:'Auf nicht ausgew\u00E4hlte Streckensegmente pr\u00FCfen',
            covResult: (pct,n) => n===0 ? `Abdeckung: ${pct}% \u2014 alle befahrenen Segmente sind ausgew\u00E4hlt \u2705` : `Abdeckung: ${pct}% \u2014 ${n} befahrene(s) Segment(e) nicht ausgew\u00E4hlt`,
            covLegend:'\uD83D\uDFE3 Magenta gestrichelt: Segmente, auf denen der Track verl\u00E4uft, die aber nicht ausgew\u00E4hlt sind (zu bearbeiten).',
            covAllOk:'\u2705 Der Track verl\u00E4uft \u00FCber kein vergessenes Segment.',
            covZone: (n,k) => `Bereich ${n} \u2014 ${k} Segment(e)`,
            covClear:'L\u00F6schen',
            covNoSel:'W\u00E4hle zuerst die Streckensegmente aus.',
            covNoPts:'Diese Datei enth\u00E4lt keine verwertbaren Punkte.',
            covNoSeg:'Keine WME-Segmente in der N\u00E4he des Tracks geladen (Karte auf die Strecke schwenken/zoomen).',
            covNoOverlap:'Der Track verl\u00E4uft nicht durch den geladenen Bereich (Karte auf die Strecke schwenken).',
            covOutside: p => `${p}% des Tracks liegen au\u00DFerhalb des geladenen Bereichs \u2014 schwenke die Karte, um ihn vollst\u00E4ndig zu pr\u00FCfen.`,
            covFocus:'Auf diesen Bereich zentrieren',
            noSel:'Kein Segment ausgew\u00E4hlt',
            hasSel: n => `\u2705 ${n} Segment(e) ausgew\u00E4hlt`,
            newSel:'Neue Auswahl \u2014 Warteschlange bleibt erhalten.',
            multiCountry: cc => `\u26A0\uFE0F Mehrere L\u00E4nder: ${cc} \u2014 Feiertagsfilter nicht verf\u00FCgbar.`,
            toastOk: (n,s,b) => b>0 ? `\u26A0\uFE0F ${n} Sperrung(en) f\u00FCr ${s} g\u00FCltige(s) Segment(e) \u2014 ${b} Segment(e) \u00FCbersprungen` : `\u2705 ${n} Sperrung(en) f\u00FCr ${s} Segment(e) hinzugef\u00FCgt.`,
            errNone:'\u274C Keine Sperrung erzeugt.',
            fillForm:'Formular ausf\u00FCllen\u2026',
            closuresN: n => `${n} Sperrung(en) eingerichtet`,
            previewHead: n => `${n} anzuwendende Sperrung(en):`,
            previewMore: n => `\u2026 und ${n} weitere`,
            confirmClear:'Warteschlange leeren?',
            confirmApply: n => `${n} Paket(e) in WME anwenden?`,
            confirmDel: n => `\u201E${n}\u201C l\u00F6schen?`,
            colId:'ID', colName:'Name', colStart:'Beginn', colEnd:'Ende', colState:'Zustand',
            colIdTip:'Segment-ID', colNameTip:'Segmentname',
            colStartTip:'Startdatum/-zeit', colEndTip:'Enddatum/-zeit',
            colStateTip:'\uD83D\uDFE2 OK  \uD83D\uDFE0 Laufend  \uD83D\uDD34 \u00DCberschneidung  \u26AB Vergangen',
            stateOk:'OK', stateOn:'Laufend', stateOv:'\u00DCberschneidung', statePast:'Vergangen',
            stateNull:'Segment nicht im Datenmodell gefunden \u2014 eine k\u00FCrzliche \u00C4nderung ist noch nicht \u00FCbernommen. Wird beim Anwenden \u00FCbersprungen.',
            nullSegBadgeTip: n => `${n} Segment(e) fehlen im Datenmodell \u2014 eine k\u00FCrzliche \u00C4nderung ist noch nicht \u00FCbernommen. F\u00FCr Details zur Warteschlange hinzuf\u00FCgen.`,
            stateRecent:'Segment nach dem letzten Waze-Tile-Build bearbeitet \u2014 die Sperrung kann beim Anwenden abgelehnt werden. Warte auf die n\u00E4chste Tile-Aktualisierung (alle 24 h).',
            recentSegBadgeTip: n => `${n} Segment(e) nach dem letzten Tile-Build bearbeitet \u2014 Sperrungen k\u00F6nnen beim Anwenden abgelehnt werden.`,
            nodeIconNone:'\u26AA Keine', nodeIconInner:'\uD83D\uDFE1 Innere', nodeIconAll:'\uD83D\uDD34 Alle',
            noMte:'Kein MTE',
            countBadge: (o,s) => `${o}\u00D7${s} Seg`,
            tipCount: (o,s) => `${o} Sperrung(en) \u00D7 ${s} Segment(e) \u2014 ohne gel\u00F6schte Zeilen und Richtungskonflikte. \u00DCberschneidungen werden erst beim Anwenden erkannt.`,
            tipDir:'Sperrrichtung',
            tipITon:'Ignoriert den Verkehr \u2014 keine Erkennung', tipIToff:'Erkennt den Verkehr',
            tipNodes: n => `Knotensperrungen: ${n}`,
            tipMte: n => `Zugeh\u00F6riges MTE: ${n}`,
            tipPresetLoad:'Laden', tipPresetDel:'L\u00F6schen',
            fabNoSeg:'Segmente auf der Karte ausw\u00E4hlen',
            btnCollapse:'Einklappen', btnClose:'Schlie\u00DFen',
            presetColName:'Name', presetColDesc:'Beschreibung',
            presetColTime:'Zeitplan', presetColDir:'Richt.',
            presetNamePh:'Name der Vorlage\u2026',
            presetPopupTitle:'\uD83D\uDCBE Vorlage speichern',
            btnSave:'Speichern', btnCancel:'Abbrechen',
            presetErrEmpty:'Gib einen Namen ein.', presetErrDup:'Dieser Name existiert bereits.',
            presetSaved: n => `\u2705 Vorlage \u201E${n}\u201C gespeichert.`,
            holidaysExcl: n => `\u2139\uFE0F ${n} Feiertag(e) ausgeschlossen.`,
            holidaysNone:'\u2139\uFE0F Keine Feiertage im Zeitraum.',
            holidayModeNone:'Feiertage: kein Filter',
            holidayModeSkip:'Au\u00DFer an Feiertagen',
            holidayModeOnly:'Nur an Feiertagen',
            holidaysOnly: n => `\u2705 ${n} Termin(e) an Feiertagen beibehalten.`,
            holidaysOnlyNone:'\u26A0\uFE0F Keine Feiertage im Zeitraum \u2014 die Warteschlange bleibt leer.',
            warnInt: (ev,dur) => `\u26A0\uFE0F Intervall (${ev}\u00A0Min.) < Dauer (${dur}\u00A0Min.): die Sperrungen \u00FCberschneiden sich.`,
            warnOcc: (max,req) => `\u2139\uFE0F Im Zeitraum sind nur ${max} Termin(e) m\u00F6glich (${req} angefordert).`,
            warnZero:'\u26A0\uFE0F Intervall ist null.',
            applyOk: (r,s) => `\u2705 ${r} ${s}`,
            applyErr: (r,s,e) => `\u274C ${r} ${s} \u2014 ${e}`,
            errDateStart:'Ung\u00FCltiges Startdatum',
            errDateEnd:'Enddatum liegt vor dem Startdatum',
            warnDatePast:'Das Startdatum liegt in der Vergangenheit.',
            warnDateEnd:'Das Enddatum liegt vor dem Startdatum.',
            warnDateMax: n => `Der Zeitraum w\u00FCrde mehr als ${n} Sperrungen erzeugen. Verk\u00FCrze den Zeitraum.`,
            errRepeat:'Ung\u00FCltige Anzahl an Wiederholungen',
            errMaxItems: n => `\u274C Grenze von ${n} Sperrungen erreicht \u2014 pr\u00FCfe den Datumsbereich oder verk\u00FCrze den Zeitraum.`,
            defaultClosure:'Sperrung',
            selectAll:'Alle ausw\u00E4hlen',
            tipCenter:'Auf dieses Segment zentrieren',
            tipPresetSaveBtn:'Als Vorlage speichern',
            // Ausgeschlossene Segmente (Richtungskonflikt)
            exclWarnTitle: n => `${n} Segment(e) ausgeschlossen \u2014 unpassende Fahrtrichtung. Sie werden nicht verarbeitet. F\u00FCr Details klicken.`,
            dirConflictTip:'Unpassende Fahrtrichtung \u2014 Segment \u00FCbersprungen',
            toastNoCompatible: dir => `\u26A0\uFE0F Kein Segment passt zur Richtung ${dir} \u2014 Paket nicht hinzugef\u00FCgt`,
            exclTxtHeader: dir => `Ausgeschlossene Segmente \u2014 Fahrtrichtung unvereinbar mit der Sperrung ${dir}`,
            exclTxtBatch:'Paket: ',
            exclTxtFooter1:'Diese Segmente wurden nicht zur Warteschlange hinzugef\u00FCgt.',
            exclTxtFooter2:'Richte sie in einem separaten Paket mit der passenden Fahrtrichtung ein.',
            exclTxtFilename:'ausgeschlossene_segmente',
            exclTxtDir:'Richtung',
            // Zeile l\u00F6schen
            tipRowDel:'Diesen Termin entfernen',
            // Badge Warteschlange
            queueBadge: n => n===1?'1 Paket in der Warteschlange':`${n} Pakete in der Warteschlange`,
            // Paket l\u00F6schen
            tipDelBatch:'Dieses Paket entfernen',
            tipEditLabel:'Bezeichnung dieses Pakets \u00E4ndern',
            // Anwenden beendet
            applyStopping:'\u23F3 Stopp angefordert \u2014 die laufende Sperrung wird abgeschlossen, danach wird abgebrochen.',
            applyStopped:(ok,ko)=>`\u23F9 Abgebrochen \u2014 ${ok} angewendet, ${ko} fehlgeschlagen`,
            applyDone: (ok,ko,total) => `\u2705 ${ok} OK${ko?' \u2014 '+ko+' Fehler':''} von ${total} Sperrung(en).`,
            // Warnung mehrere L\u00E4nder
            multiCountryAlert: cc => `\u26A0\uFE0F Auswahl \u00FCber mehrere L\u00E4nder (${cc}).\nDer Feiertagsfilter kann nicht verwendet werden.\nW\u00E4hle Segmente aus nur einem Land ab.`,
            // CSV-Importprotokoll
            csvAdded: (ok,ko) => `\u2705 ${ok} Sperrung(en) zur Warteschlange hinzugef\u00FCgt${ko?', '+ko+' Fehler':''}.`,
            csvBigConfirm: (seg,rows) => `⚠️ Diese Datei enthält ${seg} Segmente in ${rows} Zeilen. Der Import großer Mengen kann den Browser verlangsamen, und WME schließt nur Segmente, die in der aktuellen Ansicht geladen sind. Fortfahren?`,
            csvImportCancelled:'Import abgebrochen.',
            sweepTitle:'Segmente des Tracks auswählen (verschiebt die Karte)',
            sweepProgress: (done,total,n) => `Abtastung… ${done}/${total} — ${n} Segment(e)`,
            sweepDone: n => `✅ ${n} Segment(e) entlang des Tracks ausgewählt.`,
            sweepStopped: n => `⏹ Abgebrochen — ${n} Segment(e) ausgewählt.`,
            sweepConfirm: (a,km) => `Dieser Track ist ~${km} km lang (${a} Kartenbewegungen). Die Abtastung kann etwas dauern und verschiebt die Ansicht. Fortfahren?`,
            lotsBtnTitle:'Langen Track in Sperr-Pakete aufteilen (verschiebt die Karte)',
            lotsNeedConfig:'⚠️ Richten Sie zuerst die Sperrung im Reiter Einrichten ein (Zeitraum, Uhrzeiten, Richtung…), dann erneut versuchen.',
            lotsConfirm: n => `Dieser Track wird in ${n} Paket(e) aufgeteilt. Die Karte bewegt sich automatisch, um jeden Bereich zu laden — das ist normal und kann etwas dauern. Die Sperrungen in der Warteschlange erzeugen?`,
            lotsProgress: (done,total,added,seg) => `Aufteilung in Pakete… ${done}/${total} — ${added} Paket(e), ${seg} Segment(e)`,
            lotsWhyMoving:'Die Karte bewegt sich, um die Segmente jedes Pakets zu laden. Bewegen Sie die Karte währenddessen nicht.',
            lotsDone: (added,seg) => `✅ ${added} Paket(e) zur Warteschlange hinzugefügt (${seg} Segment(e)). Reiter Einrichten zum Prüfen und Anwenden.`,
            lotsStopped: (added,seg) => `⏹ Abgebrochen — ${added} Paket(e) bereits in der Warteschlange (${seg} Segment(e)).`,
            applyLotFocus: (k,n) => `📦 Paket ${k}/${n}: Karte wird zentriert, um die Segmente zu laden…`,
            applyLotDone: (k,n) => `📦 Paket ${k}/${n} angewendet. Auf der Karte prüfen, dann fortfahren.`,
            applyLotNext:'▶ Weiter (nächstes Paket)',
            lotRowLabel: (i,n) => `Paket ${i}/${n}`,
            lotStatusTodo:'offen',
            lotStatusDone:'konfiguriert',
            lotShowTitle:'Dieses Paket auf der Karte anzeigen',
            lotSelTitle:'Segmente dieses Pakets auswählen (dann Sperrung einrichten)',
            lotSelecting: (i,n) => `Paket ${i}/${n}: Segmente werden geladen…`,
            lotSelected: seg => `✅ ${seg} Segment(e) ausgewählt. Sperrung einrichten, dann „Bestätigen“.`,
            lotNone:'Kein Segment in diesem Paket erfasst.',
            lotNextHint: (i,n) => `📦 Nächstes Paket: ${i}/${n}.`,
            lotsAllDone:'✅ Alle Pakete sind konfiguriert. Sie können die Warteschlange anwenden.',
            lotPermaTitle:'Permalink dieses Pakets kopieren (Auswahl wiederherstellen)',
            lotPermaCopied: n => `🔗 Permalink kopiert (${n} Segmente).`,
            lotPermaCopy:'Diesen Permalink kopieren:',
            lotCsvTitle:'Konfigurierte Pakete dieses Tracks als CSV exportieren (Format WME Advanced Closures)',
            lotCsvNone:'Kein konfiguriertes Paket zum Exportieren für diesen Track.',
            lotCsvDone: n => `📥 ${n} Paket(e) als CSV exportiert.`,
            // Detail eines Warteschlangeneintrags
            entryDetail: (segs,cl,dir,time) => `${segs} Seg \u00B7 ${cl} Sperrung(en) \u00B7 ${dir} \u00B7 ${time}`,
            sbHint:'W\u00E4hle Segmente auf der Karte aus und klicke dann auf die Schaltfl\u00E4che \uD83D\uDEA7 auf der Karte, um das Werkzeug zu \u00F6ffnen.',
            sbToggle:'Werkzeug aktivieren',
            emojiPickerTip:'Emoji einf\u00FCgen',
            sbResetFab:'Position der Schaltfl\u00E4che zur\u00FCcksetzen',
            sbDesc:'Die Schaltfl\u00E4che \uD83D\uDEA7 ist immer auf der Karte sichtbar und l\u00E4sst sich frei per Drag & Drop verschieben.<br>Sie zeigt in Gr\u00FCn die Anzahl der ausgew\u00E4hlten Segmente.<br>Das Overlay ist verschiebbar und einklappbar.<br><br>\uD83D\uDCAC <a href="https://www.waze.com/discuss/t/script-wme-closures-toolkit/405542" target="_blank" style="color:var(--wct-blue)">Discuss-Thread</a> &nbsp;\u00B7&nbsp; \uD83D\uDD17 <a href="https://greasyfork.org/fr/scripts/581015-wme-closures-toolkit" target="_blank" style="color:var(--wct-blue)">GreasyFork</a>',
            sbDisplayMode:'Darstellung',
            sbModeCompact:'Windows 95',
            sbModeNormal:'Normal',
            sbCardsCollapsed:'Karten der Warteschlange standardm\u00E4\u00DFig eingeklappt',

            sbLanguage:'Sprache',
            sbLangAuto: l => `Automatisch — WME (${l})`,
            sbDateFormat:'Datumsformat',
            sbDateDmy:'TT/MM/JJJJ (Europa, weltweit)',
            sbDateMdy:'MM/TT/JJJJ (USA)',
            sbDateIso:'JJJJ-MM-TT (ISO)',
            sbDateAuto:'(automatisch erkannt)',
            helpH1:'\uD83D\uDE80 Schnellstart', helpH2:'\u2699\uFE0F Eine Sperrung einrichten',
            helpH3:'\uD83D\uDCCB Warteschlange', helpH4:'\uD83D\uDCC2 CSV-Import',
            helpH5:'\uD83D\uDCBE Vorlagen', helpH6:'\u26A0\uFE0F H\u00E4ufige Fehler & Grenzen', helpH7:'\uD83D\uDDA5\uFE0F Seitenleiste / Einstellungen',
            helpH8:'\uD83D\uDDFA Tracks',
            helpH9:'\uD83D\uDD0D Sperrungssuche',
            helpH10:'📦 Lange Tracks: Paket-Modus',
            helpS1:'<b>W\u00E4hle</b> ein oder mehrere Segmente auf der WME-Karte aus',
            helpS2:'Klicke auf die Schaltfl\u00E4che \uD83D\uDEA7 auf der Karte (per Drag & Drop verschiebbar)',
            helpS3:'Lege im Reiter <b>\u2699 Einrichten</b> deine Sperrungen fest (Zeitraum, Uhrzeit, Tage\u2026)',
            helpS4:'Klicke auf <b>\u2714 Best\u00E4tigen und zur Warteschlange</b>',
            helpS5:'Wiederhole dies bei Bedarf f\u00FCr weitere Segmente',
            helpS6:'Klicke auf <b>\u25B6 Anwenden</b>, um die Sperrungen in WME anzulegen',
        },
        es: {
            tabCfg:'⚙ Configurar', tabCsv:'📂 CSV',
            tabPre:'💾 Preajustes', tabGpx:'🗺 Trazas', tabSrc:'🔍 Buscar', tabHelp:'❓', tabHelpTitle:'Ayuda',
            // Pestaña Buscar
            srcSectionTime:'📅 Ventana temporal',
            srcLblStartAfter:'Inicio después del', srcLblStartBefore:'Inicio antes del',
            srcLblEndAfter:'Fin después del', srcLblEndBefore:'Fin antes del',
            srcSectionKeywords:'🔍 Palabras clave',
            srcLblDesc:'La descripción contiene', srcLblMte:'El evento MTE contiene',
            srcBtnAnd:'Y', srcBtnOr:'O',
            srcBtnSearch:'Buscar',
            srcBtnClear:'Borrar',
            srcNoResults:'No se ha encontrado ningún segmento con estos criterios.',
            srcNoClosures:'No hay cierres cargados en la vista actual.',
            srcResults: n => `${n} segmento(s) encontrado(s)`,
            srcBtnGoCfg:'⚙ Cambiar a Configurar',
            srcHint:'Segmentos con cierres cargados en la vista actual.',
            srcLoading:'Buscando…',
            srcSectionStatus:'💡 Estado',
            srcStatusAll:'Todos',
            srcStatusLabels:{
                ACTIVE:'Activo',
                NOT_STARTED:'Pendiente',
                SUSPENDED:'Suspendido',
                FINISHED:'Finalizado',
                FINISHED_EARLY_DUE_TO_DELETION:'Eliminado',
                FINISHED_EARLY_DUE_TO_OVERLAPPING_CLOSURES:'Solapamiento',
                UNVERIFIED:'Sin verificar',
                FAILED:'Error',
                UNKNOWN:'Desconocido',
            },
            srcTipStatus:'Filtrar por estado del cierre. Marca los estados que quieres incluir en los resultados.',
            srcTipStartAfter:'Fecha de inicio del cierre ≥ esta fecha',
            srcTipStartBefore:'Fecha de inicio del cierre ≤ esta fecha',
            srcTipEndAfter:'Fecha de fin del cierre ≥ esta fecha',
            srcTipEndBefore:'Fecha de fin del cierre ≤ esta fecha',
            srcTipDesc:'Búsqueda sin distinguir mayúsculas en la descripción del cierre',
            srcTipMte:'Búsqueda sin distinguir mayúsculas en el nombre del evento MTE asociado',
            srcTipAndOr:'Y: los dos campos deben coincidir — O: basta con que coincida uno',
            srcTipAndOrLbl:'entre Descripción y MTE',
            srcTipSearch:'Buscar en los cierres cargados en la vista actual del mapa',
            srcTipClear:'Restablecer todos los criterios y los resultados',
            srcTipGoCfg:'Seleccionar estos segmentos y cambiar a la pestaña Configurar para crear cierres',
            srcTipCenterRow:'Centrar el mapa en este segmento (compensado según la zona visible)',
            srcColId:'ID', srcColName:'Nombre', srcColClosures:'Cier.', srcColStatus:'Estado', srcColDesc:'Descripción', srcColMte:'MTE',
            srcTipColDesc:'Ordenar por descripción',
            srcTipMteId:'Evento MTE no cargado en memoria — solo está disponible su ID. Abre la pestaña Eventos de WME para cargar los nombres y vuelve a lanzar la búsqueda.',
            srcTipColId:'Ordenar por ID de segmento',
            srcTipColName:'Ordenar por nombre de calle',
            srcTipColClosures:'Ordenar por número de cierres coincidentes',
            srcTipColStatus:'Ordenar por estado',
            srcTipColMte:'Ordenar por nombre de evento MTE',
            gpxLayerCtrl:'Capa Trazas',
            // Tabla de trazas
            trkColTrack:'Traza', trkColTime:'Hora',
            trkTipFileColor:'Color para todas las trazas', trkTipColor:'Cambiar el color', trkTipColorCol:'Color',
            trkExpand:'Desplegar', trkCollapse:'Plegar',
            trkTipDelFile:'Eliminar el archivo', trkTipDel:'Eliminar', trkTipFocus:'Centrar',
            trkTipLoadTime:'Hora de carga', trkTipFormat:'Formato del archivo',
            trkTipPts:'Puntos trazados (submuestreados si > 3.000)', trkTipStatus:'Estado',
            sectionPeriod:'📅 Periodo',
            lblStart:'Inicio', lblEnd:'Fin',
            lblStartTime:'Hora de inicio', lblDurTime:'Duración h:mm', lblDurDay:'+Días',
            lblEndTime:'Hora de fin',
            btnDur:'⏱ Duración', btnEndTime:'⏱ Hora de fin',
            lblToggleDur:'DUR', lblToggleEnd:'FIN',
            lblDuration:'Duración',
            jpnPrefix:'D+',
            tipToggle:'Modo Duración : introduce una duración (H:MM) — Modo Hora de fin : introduce la hora exacta de fin. Haz clic para cambiar.',
            tabEachDay:'📆 Cada día', tabRepeat:'🔁 Repetir',
            days:['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
            scAll:'Todos', scWth:'Lun–Jue', scWd:'Lun–Vie', scWe:'Sáb–Dom', scNone:'Ninguno',
            skipHolidays:'Excepto festivos',
            lblHolidays:'Festivos:',
            lblNtimes:'¿Cuántas veces?', lblEvery:'Cada',
            unitDay:'Día(s)', unitHour:'Hora(s)', unitMin:'Minuto(s)',
            sectionParams:'📝 Parámetros',
            lblDesc:'Descripción', lblDir:'Sentido',
            dirBoth:'Ambos sentidos', dirAtoB:'A ⇒ B', dirBtoA:'B ⇒ A',
            lblMte:'MTE asociado',
            lblMteHint:'Abre la pestaña Eventos en WME para cargar los MTE',
            lblMtePh:'Sin MTE',
            mteRefresh:'↻',
            mteRefreshTip:'Recargar los MTE desde la pestaña Eventos de WME',
            mteNone:'— Sin MTE —',
            mteEmpty:'Abre la pestaña Eventos de WME y haz clic en ↻',
            lblNodes:'Cierres en los nodos',
            nodeNone:'Ninguno (□—□—□—□)', nodeInner:'Nodos interiores (□—■—■—□)', nodeAll:'Todos (■—■—■—■)',
            lblIT:'Ignorar el tráfico',
            tipIT:'Si se marca, Waze no reabrirá automáticamente el segmento aunque detecte tráfico circulando por él.',
            tipHolSkip:'No se propondrá ningún cierre en los días festivos — esas ocurrencias se eliminan de la lista.',
            tipHolOnly:'Los cierres se propondrán SOLO en los días festivos — el resto de ocurrencias se ignoran.',
            tipHolAdd:'Añade los festivos del periodo además de los días seleccionados (unión).',
            holidayModeAdd:'+ Festivos',
            holidaysAdded: n => `✅ ${n} festivo(s) añadido(s) adicionalmente.`,
            alertDir:'⚠️ En tramos largos, el sentido A ⇒ B puede variar según el segmento.',
            sectionQueue:'📋 Cola', queueEmpty:'Cola vacía.',
            btnValidate:'✔ Validar y añadir a la cola',
            btnStop:'⏹ Detener', btnStopping:'⏳ Deteniendo…', btnApply:'▶ Aplicar', btnCsv:'⬇ CSV', btnClear:'🗑 Vaciar',
            dropText:'📄 Haz clic o arrastra aquí un archivo CSV',
            dropHint:'Se añade directamente a la cola',
            gpxDropText:'🗺 Haz clic o arrastra aquí un archivo',
            gpxDropHint:'Formatos admitidos : GPX, KML, KMZ, GeoJSON, Shapefile (ZIP) — las capas se acumulan',
            // Cobertura
            covTitle:'Comprobar los segmentos del recorrido no seleccionados',
            covResult: (pct,n) => n===0 ? `Cobertura: ${pct}% — todos los segmentos recorridos están seleccionados ✅` : `Cobertura: ${pct}% — ${n} segmento(s) recorrido(s) sin seleccionar`,
            covLegend:'🟣 En magenta discontinuo: segmentos por los que pasa la traza pero que no están seleccionados (pendientes).',
            covAllOk:'✅ La traza no pasa por ningún segmento olvidado.',
            covZone: (n,k) => `Zona ${n} — ${k} segmento(s)`,
            covClear:'Borrar',
            covNoSel:'Selecciona primero los segmentos del recorrido.',
            covNoPts:'Este archivo no contiene ningún punto utilizable.',
            covNoSeg:'No hay segmentos de WME cargados cerca de la traza (desplaza o acerca el mapa al recorrido).',
            covNoOverlap:'La traza no cruza la zona cargada (desplaza el mapa hasta el recorrido).',
            covOutside: p => `El ${p}% de la traza está fuera de la zona cargada — desplaza el mapa para comprobarla por completo.`,
            covFocus:'Centrar en esta zona',
            noSel:'Ningún segmento seleccionado',
            hasSel: n => `✅ ${n} segmento(s) seleccionado(s)`,
            newSel:'Nueva selección — cola conservada.',
            multiCountry: cc => `⚠️ Varios países: ${cc} — filtro de festivos no disponible.`,
            toastOk: (n,s,b) => b>0 ? `⚠️ ${n} cierre(s) para ${s} segmento(s) válido(s) — ${b} segmento(s) descartado(s)` : `✅ ${n} cierre(s) añadido(s) para ${s} segmento(s).`,
            errNone:'❌ No se ha generado ningún cierre.',
            fillForm:'Rellena el formulario…',
            closuresN: n => `${n} cierre(s) configurado(s)`,
            previewHead: n => `${n} cierre(s) a aplicar:`,
            previewMore: n => `… y ${n} más`,
            confirmClear:'¿Vaciar la cola?',
            confirmApply: n => `¿Aplicar ${n} lote(s) en WME?`,
            confirmDel: n => `¿Eliminar “${n}”?`,
            colId:'ID', colName:'Nombre', colStart:'Inicio', colEnd:'Fin', colState:'Estado',
            colIdTip:'ID del segmento', colNameTip:'Nombre del segmento',
            colStartTip:'Fecha/hora de inicio', colEndTip:'Fecha/hora de fin',
            colStateTip:'🟢 OK  🟠 En curso  🔴 Solapamiento  ⚫ Pasado',
            stateOk:'OK', stateOn:'En curso', stateOv:'Solapamiento', statePast:'Pasado',
            stateNull:'Segmento ausente del modelo de datos — edición reciente aún no propagada. Se omitirá al aplicar.',
            nullSegBadgeTip: n => `${n} segmento(s) ausente(s) del modelo de datos — edición reciente aún no propagada. Añádelos a la cola para ver los detalles.`,
            stateRecent:'Segmento editado después de la última generación de tiles de Waze — el cierre podría ser rechazado. Espera a la próxima actualización (cada 24 h).',
            recentSegBadgeTip: n => `${n} segmento(s) editado(s) después de la última generación de tiles — los cierres podrían ser rechazados al aplicar.`,
            nodeIconNone:'⚪ Ninguno', nodeIconInner:'🟡 Interiores', nodeIconAll:'🔴 Todos',
            noMte:'No MTE',
            countBadge: (o,s) => `${o}×${s} seg`,
            tipCount: (o,s) => `${o} cierre(s) × ${s} segmento(s) — sin contar las filas eliminadas ni los conflictos de sentido. Los solapamientos solo se detectan al aplicar.`,
            tipDir:'Sentido del cierre',
            tipITon:'Ignora el tráfico — sin detección', tipIToff:'Detecta el tráfico',
            tipNodes: n => `Cierres en los nodos: ${n}`,
            tipMte: n => `MTE asociado: ${n}`,
            tipPresetLoad:'Cargar', tipPresetDel:'Eliminar',
            fabNoSeg:'Selecciona segmentos en el mapa',
            btnCollapse:'Plegar', btnClose:'Cerrar',
            presetColName:'Nombre', presetColDesc:'Descripción',
            presetColTime:'Horario', presetColDir:'Sent.',
            presetNamePh:'Nombre del preajuste…',
            presetPopupTitle:'💾 Guardar el preajuste',
            btnSave:'Guardar', btnCancel:'Cancelar',
            presetErrEmpty:'Introduce un nombre.', presetErrDup:'Ese nombre ya existe.',
            presetSaved: n => `✅ Preajuste “${n}” guardado.`,
            holidaysExcl: n => `ℹ️ ${n} festivo(s) excluido(s).`,
            holidaysNone:'ℹ️ No hay festivos en el periodo.',
            holidayModeNone:'Festivos: sin filtro',
            holidayModeSkip:'Excepto festivos',
            holidayModeOnly:'Solo festivos',
            holidaysOnly: n => `✅ ${n} ocurrencia(s) en día(s) festivo(s) conservada(s).`,
            holidaysOnlyNone:'⚠️ No hay festivos en el periodo — la cola quedará vacía.',
            warnInt: (ev,dur) => `⚠️ Intervalo (${ev} min) < duración (${dur} min): los cierres se solaparán.`,
            warnOcc: (max,req) => `ℹ️ Solo son posibles ${max} ocurrencia(s) en el periodo (${req} solicitadas).`,
            warnZero:'⚠️ Intervalo nulo.',
            applyOk: (r,s) => `✅ ${r} ${s}`,
            applyErr: (r,s,e) => `❌ ${r} ${s} — ${e}`,
            errDateStart:'Fecha de inicio no válida',
            errDateEnd:'La fecha de fin es anterior a la de inicio',
            warnDatePast:'La fecha de inicio está en el pasado.',
            warnDateEnd:'La fecha de fin es anterior a la fecha de inicio.',
            warnDateMax: n => `El intervalo generaría más de ${n} cierres. Reduce el periodo.`,
            errRepeat:'Número de repeticiones no válido',
            errMaxItems: n => `❌ Límite de ${n} cierres alcanzado — revisa el intervalo de fechas o reduce el periodo.`,
            defaultClosure:'Cierre',
            selectAll:'Seleccionar todo',
            tipCenter:'Centrar en este segmento',
            tipPresetSaveBtn:'Guardar como preajuste',
            // Segmentos excluidos (conflicto de sentido)
            exclWarnTitle: n => `${n} segmento(s) excluido(s) — sentido incompatible. No se procesarán. Haz clic para descargar el detalle.`,
            dirConflictTip:'Sentido incompatible — segmento no procesado',
            toastNoCompatible: dir => `⚠️ Ningún segmento compatible con el sentido ${dir} — lote no añadido`,
            exclTxtHeader: dir => `Segmentos excluidos — sentido incompatible con el cierre ${dir}`,
            exclTxtBatch:'Lote: ',
            exclTxtFooter1:'Estos segmentos no se han añadido a la cola.',
            exclTxtFooter2:'Configúralos en otro lote con el sentido adecuado.',
            exclTxtFilename:'segmentos_excluidos',
            exclTxtDir:'sentido',
            // Eliminar fila
            tipRowDel:'Eliminar esta ocurrencia',
            // Insignia de la cola
            queueBadge: n => n===1?'1 lote en cola':`${n} lotes en cola`,
            // Eliminar lote
            tipDelBatch:'Eliminar este lote',
            tipEditLabel:'Editar la etiqueta de este lote',
            // Aplicación terminada
            applyStopping:'⏳ Parada solicitada — se termina el cierre en curso y luego se interrumpe.',
                        applyStopped:(ok,ko)=>`⏹ Interrumpido — ${ok} aplicado(s), ${ko} fallido(s)`,
applyDone: (ok,ko,total) => `✅ ${ok} OK${ko?' — '+ko+' error(es)':''} de ${total} cierre(s).`,
            // Alerta varios países
            multiCountryAlert: cc => `⚠️ Selección en varios países (${cc}).\nNo se puede usar el filtro de festivos.\nDeja seleccionados solo los segmentos de un único país.`,
            // Registro de importación CSV
            csvAdded: (ok,ko) => `✅ ${ok} cierre(s) añadido(s) a la cola${ko?', '+ko+' error(es)':''}.`,
            csvBigConfirm: (seg,rows) => `⚠️ Este archivo contiene ${seg} segmentos en ${rows} filas. Importar grandes volúmenes puede ralentizar el navegador, y WME solo cerrará los segmentos cargados en la vista actual. ¿Continuar?`,
            csvImportCancelled:'Importación cancelada.',
            sweepTitle:'Seleccionar los segmentos de la traza (desplaza el mapa)',
            sweepProgress: (done,total,n) => `Barriendo… ${done}/${total} — ${n} segmento(s)`,
            sweepDone: n => `✅ ${n} segmento(s) seleccionado(s) a lo largo de la traza.`,
            sweepStopped: n => `⏹ Interrumpido — ${n} segmento(s) seleccionado(s).`,
            sweepConfirm: (a,km) => `Esta traza mide ~${km} km (${a} movimientos de mapa). El barrido puede tardar y moverá la vista. ¿Continuar?`,
            lotsBtnTitle:'Dividir una traza larga en lotes de cierre (desplaza el mapa)',
            lotsNeedConfig:'⚠️ Configura primero el cierre en la pestaña Configurar (periodo, horas, sentido…), luego vuelve a intentarlo.',
            lotsConfirm: n => `Esta traza se dividirá en ${n} lote(s). El mapa se moverá automáticamente para cargar cada zona — es normal y puede tardar un poco. ¿Generar los cierres en la cola?`,
            lotsProgress: (done,total,added,seg) => `Dividiendo en lotes… ${done}/${total} — ${added} lote(s), ${seg} segmento(s)`,
            lotsWhyMoving:'El mapa se mueve para cargar los segmentos de cada lote. No toques el mapa durante la operación.',
            lotsDone: (added,seg) => `✅ ${added} lote(s) añadidos a la cola (${seg} segmento(s)). Ve a la pestaña Configurar para revisar y aplicar.`,
            lotsStopped: (added,seg) => `⏹ Interrumpido — ${added} lote(s) ya en la cola (${seg} segmento(s)).`,
            applyLotFocus: (k,n) => `📦 Lote ${k}/${n}: centrando el mapa para cargar los segmentos…`,
            applyLotDone: (k,n) => `📦 Lote ${k}/${n} aplicado. Revisa en el mapa y continúa.`,
            applyLotNext:'▶ Continuar (siguiente lote)',
            lotRowLabel: (i,n) => `Lote ${i}/${n}`,
            lotStatusTodo:'pendiente',
            lotStatusDone:'configurado',
            lotShowTitle:'Mostrar este lote en el mapa',
            lotSelTitle:'Seleccionar los segmentos de este lote (luego configurar el cierre)',
            lotSelecting: (i,n) => `Lote ${i}/${n}: cargando segmentos…`,
            lotSelected: seg => `✅ ${seg} segmento(s) seleccionado(s). Configura el cierre y pulsa «Validar».`,
            lotNone:'Ningún segmento captado en este lote.',
            lotNextHint: (i,n) => `📦 Siguiente lote: ${i}/${n}.`,
            lotsAllDone:'✅ Todos los lotes están configurados. Puedes aplicar la cola.',
            lotPermaTitle:'Copiar el permalink de este lote (para recuperar la selección)',
            lotPermaCopied: n => `🔗 Permalink copiado (${n} segmentos).`,
            lotPermaCopy:'Copia este permalink:',
            lotCsvTitle:'Exportar a CSV los lotes configurados de esta traza (formato WME Advanced Closures)',
            lotCsvNone:'Ningún lote configurado para exportar en esta traza.',
            lotCsvDone: n => `📥 ${n} lote(s) exportado(s) a CSV.`,
            // Detalle de entrada de la cola
            entryDetail: (segs,cl,dir,time) => `${segs} seg · ${cl} cierre(s) · ${dir} · ${time}`,
            sbHint:'Selecciona segmentos en el mapa y haz clic en el botón 🚧 del mapa para abrir la herramienta.',
            sbToggle:'Activar la herramienta',
            emojiPickerTip:'Insertar un emoji',
            sbResetFab:'Restablecer la posición del botón',
            sbDesc:'El botón 🚧 está siempre visible en el mapa y se puede mover libremente arrastrándolo.<br>Muestra en verde el número de segmentos seleccionados.<br>El panel se puede mover y plegar.<br><br>💬 <a href="https://www.waze.com/discuss/t/script-wme-closures-toolkit/405542" target="_blank" style="color:var(--wct-blue)">Hilo de Discuss</a> &nbsp;·&nbsp; 🔗 <a href="https://greasyfork.org/fr/scripts/581015-wme-closures-toolkit" target="_blank" style="color:var(--wct-blue)">GreasyFork</a>',
            sbDisplayMode:'Visualización',
            sbModeCompact:'Windows 95',
            sbModeNormal:'Normal',
            sbCardsCollapsed:'Tarjetas de la cola plegadas por defecto',

            sbLanguage:'Idioma',
            sbLangAuto: l => `Automático — WME (${l})`,
            sbDateFormat:'Formato de las fechas',
            sbDateDmy:'DD/MM/AAAA (Europa, resto del mundo)',
            sbDateMdy:'MM/DD/AAAA (EE. UU.)',
            sbDateIso:'AAAA-MM-DD (ISO)',
            sbDateAuto:'(detectado automáticamente)',
            helpH1:'🚀 Inicio rápido', helpH2:'⚙️ Configurar un cierre',
            helpH3:'📋 Cola', helpH4:'📂 Importar CSV',
            helpH5:'💾 Preajustes', helpH6:'⚠️ Errores frecuentes y límites', helpH7:'🖥️ Barra lateral / Preferencias',
            helpH8:'🗺 Trazas',
            helpH9:'🔍 Búsqueda de cierres',
            helpH10:'📦 Trazas largas: modo por lotes',
            helpS1:'<b>Selecciona</b> uno o varios segmentos en el mapa de WME',
            helpS2:'Haz clic en el botón 🚧 visible en el mapa (se puede mover arrastrándolo)',
            helpS3:'En la pestaña <b>⚙ Configurar</b>, ajusta los parámetros de tus cierres (periodo, horario, días…)',
            helpS4:'Haz clic en <b>✔ Validar y añadir a la cola</b>',
            helpS5:'Repite con otros segmentos si es necesario',
            helpS6:'Haz clic en <b>▶ Aplicar</b> para crear los cierres en WME',
        },
        'pt-BR': {
            tabCfg:'⚙ Configurar', tabCsv:'📂 CSV',
            tabPre:'💾 Predefinições', tabGpx:'🗺 Trajetos', tabSrc:'🔍 Buscar', tabHelp:'❓', tabHelpTitle:'Ajuda',
            // Aba Buscar
            srcSectionTime:'📅 Janela de tempo',
            srcLblStartAfter:'Início depois de', srcLblStartBefore:'Início antes de',
            srcLblEndAfter:'Fim depois de', srcLblEndBefore:'Fim antes de',
            srcSectionKeywords:'🔍 Palavras-chave',
            srcLblDesc:'Descrição contém', srcLblMte:'Evento MTE contém',
            srcBtnAnd:'E', srcBtnOr:'OU',
            srcBtnSearch:'Buscar',
            srcBtnClear:'Limpar',
            srcNoResults:'Nenhum segmento encontrado com esses critérios.',
            srcNoClosures:'Nenhum bloqueio carregado na visualização atual.',
            srcResults: n => `${n} segmento(s) encontrado(s)`,
            srcBtnGoCfg:'⚙ Ir para Configurar',
            srcHint:'Segmentos com bloqueios carregados na visualização atual.',
            srcLoading:'Buscando…',
            srcSectionStatus:'💡 Status',
            srcStatusAll:'Todos',
            srcStatusLabels:{
                ACTIVE:'Ativo',
                NOT_STARTED:'Pendente',
                SUSPENDED:'Suspenso',
                FINISHED:'Encerrado',
                FINISHED_EARLY_DUE_TO_DELETION:'Excluído',
                FINISHED_EARLY_DUE_TO_OVERLAPPING_CLOSURES:'Sobreposição',
                UNVERIFIED:'Não verificado',
                FAILED:'Falhou',
                UNKNOWN:'Desconhecido',
            },
            srcTipStatus:'Filtra por status do bloqueio. Marque os status a incluir nos resultados.',
            srcTipStartAfter:'Data de início do bloqueio ≥ esta data',
            srcTipStartBefore:'Data de início do bloqueio ≤ esta data',
            srcTipEndAfter:'Data de fim do bloqueio ≥ esta data',
            srcTipEndBefore:'Data de fim do bloqueio ≤ esta data',
            srcTipDesc:'Busca na descrição do bloqueio, sem diferenciar maiúsculas de minúsculas',
            srcTipMte:'Busca no nome do evento MTE associado, sem diferenciar maiúsculas de minúsculas',
            srcTipAndOr:'E: os dois campos devem corresponder — OU: basta um deles',
            srcTipAndOrLbl:'entre Descrição e MTE',
            srcTipSearch:'Busca os bloqueios carregados na visualização atual do mapa',
            srcTipClear:'Redefine todos os critérios e resultados',
            srcTipGoCfg:'Seleciona esses segmentos e vai para a aba Configurar para criar bloqueios',
            srcTipCenterRow:'Centraliza o mapa neste segmento (deslocado para a área visível)',
            srcColId:'ID', srcColName:'Nome', srcColClosures:'Blq.', srcColStatus:'Status', srcColDesc:'Descrição', srcColMte:'MTE',
            srcTipColDesc:'Ordenar por descrição',
            srcTipMteId:'Evento MTE não carregado na memória — somente o ID está disponível. Abra a aba Eventos do WME para carregar os nomes e refaça a busca.',
            srcTipColId:'Ordenar por ID do segmento',
            srcTipColName:'Ordenar por nome da via',
            srcTipColClosures:'Ordenar por número de bloqueios correspondentes',
            srcTipColStatus:'Ordenar por status',
            srcTipColMte:'Ordenar por nome do evento MTE',
            gpxLayerCtrl:'Camada Trajetos',
            // Tabela de trajetos
            trkColTrack:'Trajeto', trkColTime:'Hora',
            trkTipFileColor:'Cor de todos os trajetos', trkTipColor:'Alterar a cor', trkTipColorCol:'Cor',
            trkExpand:'Expandir', trkCollapse:'Recolher',
            trkTipDelFile:'Remover arquivo', trkTipDel:'Remover', trkTipFocus:'Focar',
            trkTipLoadTime:'Hora do carregamento', trkTipFormat:'Formato do arquivo',
            trkTipPts:'Pontos traçados (subamostrados se > 3.000)', trkTipStatus:'Status',
            sectionPeriod:'📅 Período',
            lblStart:'Início', lblEnd:'Fim',
            lblStartTime:'Hora de início', lblDurTime:'Duração h:mm', lblDurDay:'+Dias',
            lblEndTime:'Hora de fim',
            btnDur:'⏱ Duração', btnEndTime:'⏱ Hora de fim',
            lblToggleDur:'DUR', lblToggleEnd:'FIM',
            lblDuration:'Duração',
            jpnPrefix:'D+',
            tipToggle:'Modo Duração : informe uma duração (H:MM) — Modo Hora de fim : informe a hora exata do fim. Clique para alternar.',
            tabEachDay:'📆 Cada dia', tabRepeat:'🔁 Repetir',
            days:['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
            scAll:'Todos', scWth:'Seg–Qui', scWd:'Seg–Sex', scWe:'Sáb–Dom', scNone:'Nenhum',
            skipHolidays:'Exceto feriados',
            lblHolidays:'Feriados:',
            lblNtimes:'Quantas vezes?', lblEvery:'A cada',
            unitDay:'Dia(s)', unitHour:'Hora(s)', unitMin:'Minuto(s)',
            sectionParams:'📝 Parâmetros',
            lblDesc:'Descrição', lblDir:'Sentido',
            dirBoth:'Ambos os sentidos', dirAtoB:'A ⇒ B', dirBtoA:'B ⇒ A',
            lblMte:'MTE associado',
            lblMteHint:'Abra a aba Eventos no WME para carregar os MTEs',
            lblMtePh:'Sem MTE',
            mteRefresh:'↻',
            mteRefreshTip:'Recarregar os MTEs da aba Eventos do WME',
            mteNone:'— Sem MTE —',
            mteEmpty:'Abra a aba Eventos do WME e clique em ↻',
            lblNodes:'Bloqueios nos nós',
            nodeNone:'Nenhum (□—□—□—□)', nodeInner:'Nós internos (□—■—■—□)', nodeAll:'Todos (■—■—■—■)',
            lblIT:'Ignorar o tráfego',
            tipIT:'Se marcado, o Waze não reabrirá o segmento automaticamente, mesmo que detecte tráfego passando por ele.',
            tipHolSkip:'Nenhum bloqueio será proposto em feriados — essas ocorrências são removidas da lista.',
            tipHolOnly:'Os bloqueios serão propostos SOMENTE em feriados — todas as outras ocorrências são ignoradas.',
            tipHolAdd:'Adiciona os feriados do período aos dias da semana selecionados (união).',
            holidayModeAdd:'+ Feriados',
            holidaysAdded: n => `✅ ${n} feriado(s) adicional(is) incluído(s).`,
            alertDir:'⚠️ Em trechos longos, o sentido A ⇒ B pode variar de um segmento para outro.',
            sectionQueue:'📋 Fila', queueEmpty:'Fila vazia.',
            btnValidate:'✔ Validar e adicionar à fila',
            btnStop:'⏹ Parar', btnStopping:'⏳ Parando…', btnApply:'▶ Aplicar', btnCsv:'⬇ CSV', btnClear:'🗑 Limpar',
            dropText:'📄 Clique ou arraste um arquivo CSV aqui',
            dropHint:'Adicionado diretamente à fila',
            gpxDropText:'🗺 Clique ou arraste um arquivo aqui',
            gpxDropHint:'Formatos aceitos : GPX, KML, KMZ, GeoJSON, Shapefile (ZIP) — as camadas são cumulativas',
            // Cobertura
            covTitle:'Verificar se há segmentos do percurso não selecionados',
            covResult: (pct,n) => n===0 ? `Cobertura: ${pct}% — todos os segmentos percorridos estão selecionados ✅` : `Cobertura: ${pct}% — ${n} segmento(s) percorrido(s) não selecionado(s)`,
            covLegend:'🟣 Magenta tracejado: segmentos por onde o trajeto passa mas que não estão selecionados (a tratar).',
            covAllOk:'✅ O trajeto não passa por nenhum segmento esquecido.',
            covZone: (n,k) => `Zona ${n} — ${k} segmento(s)`,
            covClear:'Limpar',
            covNoSel:'Selecione primeiro os segmentos do percurso.',
            covNoPts:'Este arquivo não tem pontos utilizáveis.',
            covNoSeg:'Nenhum segmento do WME carregado perto do trajeto (mova/aproxime o mapa sobre o percurso).',
            covNoOverlap:'O trajeto não cruza a área carregada (mova o mapa sobre o percurso).',
            covOutside: p => `${p}% do trajeto está fora da área carregada — mova o mapa para verificar tudo.`,
            covFocus:'Centralizar nesta zona',
            noSel:'Nenhum segmento selecionado',
            hasSel: n => `✅ ${n} segmento(s) selecionado(s)`,
            newSel:'Nova seleção — fila mantida.',
            multiCountry: cc => `⚠️ Vários países: ${cc} — filtro de feriados indisponível.`,
            toastOk: (n,s,b) => b>0 ? `⚠️ ${n} bloqueio(s) para ${s} segmento(s) válido(s) — ${b} segmento(s) ignorado(s)` : `✅ ${n} bloqueio(s) adicionado(s) para ${s} segmento(s).`,
            errNone:'❌ Nenhum bloqueio gerado.',
            fillForm:'Preencha o formulário…',
            closuresN: n => `${n} bloqueio(s) configurado(s)`,
            previewHead: n => `${n} bloqueio(s) a aplicar:`,
            previewMore: n => `… e mais ${n}`,
            confirmClear:'Limpar a fila?',
            confirmApply: n => `Aplicar ${n} lote(s) no WME?`,
            confirmDel: n => `Excluir “${n}”?`,
            colId:'ID', colName:'Nome', colStart:'Início', colEnd:'Fim', colState:'Estado',
            colIdTip:'ID do segmento', colNameTip:'Nome do segmento',
            colStartTip:'Data/hora de início', colEndTip:'Data/hora de fim',
            colStateTip:'🟢 OK  🟠 Em curso  🔴 Sobreposição  ⚫ Passado',
            stateOk:'OK', stateOn:'Em curso', stateOv:'Sobreposição', statePast:'Passado',
            stateNull:'Segmento não encontrado no modelo de dados — edição recente ainda não propagada. Será ignorado ao aplicar.',
            nullSegBadgeTip: n => `${n} segmento(s) ausente(s) do modelo de dados — edição recente ainda não propagada. Adicione à fila para ver os detalhes.`,
            stateRecent:'Segmento editado após a última geração de tiles do Waze — o bloqueio pode ser recusado ao aplicar. Aguarde a próxima atualização de tiles (a cada 24h).',
            recentSegBadgeTip: n => `${n} segmento(s) editado(s) após a última geração de tiles — os bloqueios podem ser recusados ao aplicar.`,
            nodeIconNone:'⚪ Nenhum', nodeIconInner:'🟡 Internos', nodeIconAll:'🔴 Todos',
            noMte:'Sem MTE',
            countBadge: (o,s) => `${o}×${s} seg`,
            tipCount: (o,s) => `${o} bloqueio(s) × ${s} segmento(s) — sem contar as linhas excluídas e os conflitos de sentido. As sobreposições só são detectadas ao aplicar.`,
            tipDir:'Sentido do bloqueio',
            tipITon:'Ignora o tráfego — sem detecção', tipIToff:'Detecta o tráfego',
            tipNodes: n => `Bloqueios nos nós: ${n}`,
            tipMte: n => `MTE associado: ${n}`,
            tipPresetLoad:'Carregar', tipPresetDel:'Excluir',
            fabNoSeg:'Selecione segmentos no mapa',
            btnCollapse:'Recolher', btnClose:'Fechar',
            presetColName:'Nome', presetColDesc:'Descrição',
            presetColTime:'Horário', presetColDir:'Sent.',
            presetNamePh:'Nome da predefinição…',
            presetPopupTitle:'💾 Salvar predefinição',
            btnSave:'Salvar', btnCancel:'Cancelar',
            presetErrEmpty:'Informe um nome.', presetErrDup:'Esse nome já existe.',
            presetSaved: n => `✅ Predefinição “${n}” salva.`,
            holidaysExcl: n => `ℹ️ ${n} feriado(s) excluído(s).`,
            holidaysNone:'ℹ️ Nenhum feriado no período.',
            holidayModeNone:'Feriados: sem filtro',
            holidayModeSkip:'Exceto feriados',
            holidayModeOnly:'Somente feriados',
            holidaysOnly: n => `✅ ${n} ocorrência(s) em feriado(s) mantida(s).`,
            holidaysOnlyNone:'⚠️ Nenhum feriado no período — a fila ficará vazia.',
            warnInt: (ev,dur) => `⚠️ Intervalo (${ev} min) < duração (${dur} min): os bloqueios vão se sobrepor.`,
            warnOcc: (max,req) => `ℹ️ Apenas ${max} ocorrência(s) possível(is) no período (${req} solicitada(s)).`,
            warnZero:'⚠️ Intervalo igual a zero.',
            applyOk: (r,s) => `✅ ${r} ${s}`,
            applyErr: (r,s,e) => `❌ ${r} ${s} — ${e}`,
            errDateStart:'Data de início inválida',
            errDateEnd:'Data de fim anterior à data de início',
            warnDatePast:'A data de início está no passado.',
            warnDateEnd:'A data de fim é anterior à data de início.',
            warnDateMax: n => `O período geraria mais de ${n} bloqueios. Reduza o intervalo de datas.`,
            errRepeat:'Número de repetições inválido',
            errMaxItems: n => `❌ Limite de ${n} bloqueios atingido — verifique o intervalo de datas ou reduza o período.`,
            defaultClosure:'Bloqueio',
            selectAll:'Selecionar tudo',
            tipCenter:'Centralizar neste segmento',
            tipPresetSaveBtn:'Salvar como predefinição',
            // Segmentos excluídos (conflito de sentido)
            exclWarnTitle: n => `${n} segmento(s) excluído(s) — sentido incompatível. Não serão processados. Clique para baixar os detalhes.`,
            dirConflictTip:'Sentido incompatível — segmento ignorado',
            toastNoCompatible: dir => `⚠️ Nenhum segmento compatível com o sentido ${dir} — lote não adicionado`,
            exclTxtHeader: dir => `Segmentos excluídos — sentido incompatível com o bloqueio ${dir}`,
            exclTxtBatch:'Lote: ',
            exclTxtFooter1:'Esses segmentos não foram adicionados à fila.',
            exclTxtFooter2:'Configure-os em um lote separado, com o sentido adequado.',
            exclTxtFilename:'segmentos_excluidos',
            exclTxtDir:'sent',
            // Exclusão de linha
            tipRowDel:'Remover esta ocorrência',
            // Selo de fila no cabeçalho
            queueBadge: n => n===1?'1 lote na fila':`${n} lotes na fila`,
            // Tooltip de exclusão de lote
            tipDelBatch:'Remover este lote',
            tipEditLabel:'Editar o rótulo deste lote',
            // Aplicação concluída
            applyStopping:'⏳ Parada solicitada — concluindo o bloqueio atual e interrompendo em seguida.',
                        applyStopped:(ok,ko)=>`⏹ Parado — ${ok} aplicado(s), ${ko} com falha`,
applyDone: (ok,ko,total) => `✅ ${ok} OK${ko?' — '+ko+' erro(s)':''} em ${total} bloqueio(s).`,
            // Alerta de vários países
            multiCountryAlert: cc => `⚠️ Seleção em vários países (${cc}).\nNão é possível usar o filtro de feriados.\nDesmarque os segmentos para manter apenas um país.`,
            // Log de importação CSV
            csvAdded: (ok,ko) => `✅ ${ok} bloqueio(s) adicionado(s) à fila${ko?', '+ko+' erro(s)':''}.`,
            csvBigConfirm: (seg,rows) => `⚠️ Este arquivo contém ${seg} segmentos em ${rows} linhas. Importar grandes volumes pode deixar o navegador lento, e o WME só vai bloquear os segmentos carregados na visualização atual. Continuar?`,
            csvImportCancelled:'Importação cancelada.',
            sweepTitle:'Selecionar os segmentos do trajeto (move o mapa)',
            sweepProgress: (done,total,n) => `Varrendo… ${done}/${total} — ${n} segmento(s)`,
            sweepDone: n => `✅ ${n} segmento(s) selecionado(s) ao longo do trajeto.`,
            sweepStopped: n => `⏹ Interrompido — ${n} segmento(s) selecionado(s).`,
            sweepConfirm: (a,km) => `Este trajeto tem ~${km} km (${a} movimentos de mapa). A varredura pode demorar e vai mover a visualização. Continuar?`,
            lotsBtnTitle:'Dividir um trajeto longo em lotes de bloqueio (move o mapa)',
            lotsNeedConfig:'⚠️ Configure primeiro o bloqueio na aba Configurar (período, horários, sentido…), depois tente de novo.',
            lotsConfirm: n => `Este trajeto será dividido em ${n} lote(s). O mapa vai se mover automaticamente para carregar cada área — é normal e pode demorar um pouco. Gerar os bloqueios na fila?`,
            lotsProgress: (done,total,added,seg) => `Dividindo em lotes… ${done}/${total} — ${added} lote(s), ${seg} segmento(s)`,
            lotsWhyMoving:'O mapa se move para carregar os segmentos de cada lote. Não mexa no mapa durante a operação.',
            lotsDone: (added,seg) => `✅ ${added} lote(s) adicionados à fila (${seg} segmento(s)). Veja a aba Configurar para revisar e aplicar.`,
            lotsStopped: (added,seg) => `⏹ Interrompido — ${added} lote(s) já na fila (${seg} segmento(s)).`,
            applyLotFocus: (k,n) => `📦 Lote ${k}/${n}: centralizando o mapa para carregar os segmentos…`,
            applyLotDone: (k,n) => `📦 Lote ${k}/${n} aplicado. Confira no mapa e continue.`,
            applyLotNext:'▶ Continuar (próximo lote)',
            lotRowLabel: (i,n) => `Lote ${i}/${n}`,
            lotStatusTodo:'pendente',
            lotStatusDone:'configurado',
            lotShowTitle:'Mostrar este lote no mapa',
            lotSelTitle:'Selecionar os segmentos deste lote (depois configurar o bloqueio)',
            lotSelecting: (i,n) => `Lote ${i}/${n}: carregando segmentos…`,
            lotSelected: seg => `✅ ${seg} segmento(s) selecionado(s). Configure o bloqueio e clique em «Validar».`,
            lotNone:'Nenhum segmento captado neste lote.',
            lotNextHint: (i,n) => `📦 Próximo lote: ${i}/${n}.`,
            lotsAllDone:'✅ Todos os lotes estão configurados. Você pode aplicar a fila.',
            lotPermaTitle:'Copiar o permalink deste lote (para recuperar a seleção)',
            lotPermaCopied: n => `🔗 Permalink copiado (${n} segmentos).`,
            lotPermaCopy:'Copie este permalink:',
            lotCsvTitle:'Exportar em CSV os lotes configurados deste trajeto (formato WME Advanced Closures)',
            lotCsvNone:'Nenhum lote configurado para exportar neste trajeto.',
            lotCsvDone: n => `📥 ${n} lote(s) exportado(s) em CSV.`,
            // Detalhe de entrada da fila
            entryDetail: (segs,cl,dir,time) => `${segs} seg · ${cl} bloqueio(s) · ${dir} · ${time}`,
            sbHint:'Selecione segmentos no mapa e clique no botão 🚧 sobre o mapa para abrir a ferramenta.',
            sbToggle:'Ativar a ferramenta',
            emojiPickerTip:'Inserir emoji',
            sbResetFab:'Redefinir a posição do botão',
            sbDesc:'O botão 🚧 fica sempre visível no mapa e pode ser reposicionado livremente arrastando com o mouse.<br>Ele mostra em verde o número de segmentos selecionados.<br>O painel pode ser arrastado e recolhido.<br><br>💬 <a href="https://www.waze.com/discuss/t/script-wme-closures-toolkit/405542" target="_blank" style="color:var(--wct-blue)">Fórum Discuss</a> &nbsp;·&nbsp; 🔗 <a href="https://greasyfork.org/fr/scripts/581015-wme-closures-toolkit" target="_blank" style="color:var(--wct-blue)">GreasyFork</a>',
            sbDisplayMode:'Exibição',
            sbModeCompact:'Windows 95',
            sbModeNormal:'Normal',
            sbCardsCollapsed:'Cartões da fila recolhidos por padrão',

            sbLanguage:'Idioma',
            sbLangAuto: l => `Automático — WME (${l})`,
            sbDateFormat:'Formato de data',
            sbDateDmy:'DD/MM/AAAA (Europa, Brasil)',
            sbDateMdy:'MM/DD/AAAA (EUA)',
            sbDateIso:'AAAA-MM-DD (ISO)',
            sbDateAuto:'(detectado automaticamente)',
            helpH1:'🚀 Início rápido', helpH2:'⚙️ Configurar um bloqueio',
            helpH3:'📋 Fila', helpH4:'📂 Importar CSV',
            helpH5:'💾 Predefinições', helpH6:'⚠️ Erros comuns e limites', helpH7:'🖥️ Barra lateral / Preferências',
            helpH8:'🗺 Trajetos',
            helpH9:'🔍 Busca de bloqueios',
            helpH10:'📦 Trajetos longos: modo em lotes',
            helpS1:'<b>Selecione</b> um ou mais segmentos no mapa do WME',
            helpS2:'Clique no botão 🚧 visível no mapa (arraste com o mouse para reposicioná-lo)',
            helpS3:'Na aba <b>⚙ Configurar</b>, defina os parâmetros do bloqueio (período, horário, dias…)',
            helpS4:'Clique em <b>✔ Validar e adicionar à fila</b>',
            helpS5:'Repita para outros segmentos, se necessário',
            helpS6:'Clique em <b>▶ Aplicar</b> para criar os bloqueios no WME',
        },
        'pt-PT': {
            tabCfg:'⚙ Configurar', tabCsv:'📂 CSV',
            tabPre:'💾 Predefinições', tabGpx:'🗺 Trajetos', tabSrc:'🔍 Pesquisar', tabHelp:'❓', tabHelpTitle:'Ajuda',
            // Search tab
            srcSectionTime:'📅 Janela temporal',
            srcLblStartAfter:'Início após', srcLblStartBefore:'Início antes de',
            srcLblEndAfter:'Fim após', srcLblEndBefore:'Fim antes de',
            srcSectionKeywords:'🔍 Palavras-chave',
            srcLblDesc:'Descrição contém', srcLblMte:'Evento MTE contém',
            srcBtnAnd:'E', srcBtnOr:'OU',
            srcBtnSearch:'Pesquisar',
            srcBtnClear:'Limpar',
            srcNoResults:'Nenhum segmento corresponde a estes critérios.',
            srcNoClosures:'Nenhum corte carregado na vista atual.',
            srcResults: n => `${n} segmento(s) encontrado(s)`,
            srcBtnGoCfg:'⚙ Mudar para Configurar',
            srcHint:'Segmentos com cortes carregados na vista atual.',
            srcLoading:'A pesquisar…',
            srcSectionStatus:'💡 Estado',
            srcStatusAll:'Todos',
            srcStatusLabels:{
                ACTIVE:'Ativo',
                NOT_STARTED:'Pendente',
                SUSPENDED:'Suspenso',
                FINISHED:'Terminado',
                FINISHED_EARLY_DUE_TO_DELETION:'Eliminado',
                FINISHED_EARLY_DUE_TO_OVERLAPPING_CLOSURES:'Sobreposição',
                UNVERIFIED:'Não verificado',
                FAILED:'Falhou',
                UNKNOWN:'Desconhecido',
            },
            srcTipStatus:'Filtrar por estado do corte. Marque os estados a incluir nos resultados.',
            srcTipStartAfter:'Data de início do corte ≥ esta data',
            srcTipStartBefore:'Data de início do corte ≤ esta data',
            srcTipEndAfter:'Data de fim do corte ≥ esta data',
            srcTipEndBefore:'Data de fim do corte ≤ esta data',
            srcTipDesc:'Pesquisa na descrição do corte, sem distinguir maiúsculas de minúsculas',
            srcTipMte:'Pesquisa no nome do evento MTE associado, sem distinguir maiúsculas de minúsculas',
            srcTipAndOr:'E: ambos os campos têm de corresponder — OU: pelo menos um tem de corresponder',
            srcTipAndOrLbl:'entre Descrição e MTE',
            srcTipSearch:'Pesquisar os cortes carregados na vista atual do mapa',
            srcTipClear:'Repor todos os critérios e resultados',
            srcTipGoCfg:'Selecionar estes segmentos e mudar para o separador Configurar para criar cortes',
            srcTipCenterRow:'Centrar o mapa neste segmento (deslocado para a área visível)',
            srcColId:'ID', srcColName:'Nome', srcColClosures:'Ct.', srcColStatus:'Estado', srcColDesc:'Descrição', srcColMte:'MTE',
            srcTipColDesc:'Ordenar por descrição',
            srcTipMteId:'Evento MTE não carregado em memória — apenas o ID está disponível. Abra o separador Eventos do WME para carregar os nomes e repita a pesquisa.',
            srcTipColId:'Ordenar por ID de segmento',
            srcTipColName:'Ordenar por nome da rua',
            srcTipColClosures:'Ordenar pelo número de cortes correspondentes',
            srcTipColStatus:'Ordenar por estado',
            srcTipColMte:'Ordenar por nome do evento MTE',
            gpxLayerCtrl:'Camada Trajetos',
            // Tracks table
            trkColTrack:'Trajeto', trkColTime:'Tempo',
            trkTipFileColor:'Cor para todos os trajetos', trkTipColor:'Mudar a cor', trkTipColorCol:'Cor',
            trkExpand:'Expandir', trkCollapse:'Recolher',
            trkTipDelFile:'Remover ficheiro', trkTipDel:'Remover', trkTipFocus:'Centrar',
            trkTipLoadTime:'Tempo de carregamento', trkTipFormat:'Formato do ficheiro',
            trkTipPts:'Pontos traçados (subamostrados se > 3 000)', trkTipStatus:'Estado',
            sectionPeriod:'📅 Período',
            lblStart:'Início', lblEnd:'Fim',
            lblStartTime:'Hora de início', lblDurTime:'Duração h:mm', lblDurDay:'+Dias',
            lblEndTime:'Hora de fim',
            btnDur:'⏱ Duração', btnEndTime:'⏱ Hora de fim',
            lblToggleDur:'DUR', lblToggleEnd:'FIM',
            lblDuration:'Duração',
            jpnPrefix:'D+',
            tipToggle:'Modo Duração: introduza uma duração (H:MM) — Modo Hora de fim: introduza a hora exata de fim. Clique para alternar.',
            tabEachDay:'📆 Cada dia', tabRepeat:'🔁 Repetir',
            days:['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
            scAll:'Todos', scWth:'Seg–Qui', scWd:'Seg–Sex', scWe:'Sáb–Dom', scNone:'Nenhum',
            skipHolidays:'Exceto feriados',
            lblHolidays:'Feriados:',
            lblNtimes:'Quantas vezes?', lblEvery:'A cada',
            unitDay:'Dia(s)', unitHour:'Hora(s)', unitMin:'Minuto(s)',
            sectionParams:'📝 Parâmetros',
            lblDesc:'Descrição', lblDir:'Sentido',
            dirBoth:'Ambos os sentidos', dirAtoB:'A ⇒ B', dirBtoA:'B ⇒ A',
            lblMte:'MTE associado',
            lblMteHint:'Abra o separador Eventos no WME para carregar os MTE',
            lblMtePh:'Sem MTE',
            mteRefresh:'↻',
            mteRefreshTip:'Recarregar os MTE a partir do separador Eventos do WME',
            mteNone:'— Sem MTE —',
            mteEmpty:'Abra o separador Eventos do WME e clique em ↻',
            lblNodes:'Cortes nos nós',
            nodeNone:'Nenhum (□—□—□—□)', nodeInner:'Nós interiores (□—■—■—□)', nodeAll:'Todos (■—■—■—■)',
            lblIT:'Ignorar o trânsito',
            tipIT:'Se estiver marcado, o Waze não reabre automaticamente o segmento, mesmo que detete trânsito a passar.',
            tipHolSkip:'Não será proposto nenhum corte em feriados — essas ocorrências são removidas da lista.',
            tipHolOnly:'Os cortes serão propostos APENAS em feriados — todas as outras ocorrências são ignoradas.',
            tipHolAdd:'Acrescenta os feriados do período aos dias da semana selecionados (união).',
            holidayModeAdd:'+ Feriados',
            holidaysAdded: n => `✅ ${n} feriado(s) adicional(ais) adicionado(s).`,
            alertDir:'⚠️ Em troços longos, o sentido A ⇒ B pode variar de segmento para segmento.',
            sectionQueue:'📋 Fila', queueEmpty:'Fila vazia.',
            btnValidate:'✔ Validar e adicionar à fila',
            btnStop:'⏹ Parar', btnStopping:'⏳ A parar…', btnApply:'▶ Aplicar', btnCsv:'⬇ CSV', btnClear:'🗑 Limpar',
            dropText:'📄 Clique ou arraste um ficheiro CSV para aqui',
            dropHint:'Adicionado diretamente à fila',
            gpxDropText:'🗺 Clique ou arraste um ficheiro para aqui',
            gpxDropHint:'Formatos aceites : GPX, KML, KMZ, GeoJSON, Shapefile (ZIP) — as camadas são cumulativas',
            // Coverage
            covTitle:'Verificar os segmentos do percurso que não estão selecionados',
            covResult: (pct,n) => n===0 ? `Cobertura: ${pct}% — todos os segmentos percorridos estão selecionados ✅` : `Cobertura: ${pct}% — ${n} segmento(s) percorrido(s) não selecionado(s)`,
            covLegend:'🟣 Magenta tracejado: segmentos por onde o trajeto passa mas que não estão selecionados (a tratar).',
            covAllOk:'✅ O trajeto não passa por nenhum segmento esquecido.',
            covZone: (n,k) => `Zona ${n} — ${k} segmento(s)`,
            covClear:'Limpar',
            covNoSel:'Selecione primeiro os segmentos do percurso.',
            covNoPts:'Este ficheiro não tem pontos utilizáveis.',
            covNoSeg:'Nenhum segmento do WME carregado perto do trajeto (desloque/aproxime o mapa sobre o percurso).',
            covNoOverlap:'O trajeto não atravessa a área carregada (desloque o mapa sobre o percurso).',
            covOutside: p => `${p}% do trajeto está fora da área carregada — desloque o mapa para o verificar por completo.`,
            covFocus:'Centrar nesta zona',
            noSel:'Nenhum segmento selecionado',
            hasSel: n => `✅ ${n} segmento(s) selecionado(s)`,
            newSel:'Nova seleção — fila mantida.',
            multiCountry: cc => `⚠️ Vários países: ${cc} — filtro de feriados indisponível.`,
            toastOk: (n,s,b) => b>0 ? `⚠️ ${n} corte(s) para ${s} segmento(s) válido(s) — ${b} segmento(s) ignorado(s)` : `✅ ${n} corte(s) adicionado(s) para ${s} segmento(s).`,
            errNone:'❌ Nenhum corte gerado.',
            fillForm:'Preencha o formulário…',
            closuresN: n => `${n} corte(s) configurado(s)`,
            previewHead: n => `${n} corte(s) a aplicar:`,
            previewMore: n => `… e mais ${n}`,
            confirmClear:'Limpar a fila?',
            confirmApply: n => `Aplicar ${n} lote(s) no WME?`,
            confirmDel: n => `Eliminar “${n}”?`,
            colId:'ID', colName:'Nome', colStart:'Início', colEnd:'Fim', colState:'Estado',
            colIdTip:'ID do segmento', colNameTip:'Nome do segmento',
            colStartTip:'Data/hora de início', colEndTip:'Data/hora de fim',
            colStateTip:'🟢 OK  🟠 Em curso  🔴 Sobreposição  ⚫ Passado',
            stateOk:'OK', stateOn:'Em curso', stateOv:'Sobreposição', statePast:'Passado',
            stateNull:'Segmento não encontrado no modelo de dados — edição recente ainda não propagada. Será ignorado na aplicação.',
            nullSegBadgeTip: n => `${n} segmento(s) em falta no modelo de dados — edição recente ainda não propagada. Adicione à fila para ver os detalhes.`,
            stateRecent:'Segmento editado após a última compilação de tiles do Waze — o corte pode ser rejeitado na aplicação. Aguarde a próxima atualização de tiles (a cada 24 h).',
            recentSegBadgeTip: n => `${n} segmento(s) editado(s) após a última compilação de tiles — os cortes podem ser rejeitados na aplicação.`,
            nodeIconNone:'⚪ Nenhum', nodeIconInner:'🟡 Interiores', nodeIconAll:'🔴 Todos',
            noMte:'Sem MTE',
            countBadge: (o,s) => `${o}×${s} seg`,
            tipCount: (o,s) => `${o} corte(s) × ${s} segmento(s) — excluindo as linhas eliminadas e os conflitos de sentido. As sobreposições só são detetadas na aplicação.`,
            tipDir:'Sentido do corte',
            tipITon:'Ignora o trânsito — sem deteção', tipIToff:'Deteta o trânsito',
            tipNodes: n => `Cortes nos nós: ${n}`,
            tipMte: n => `MTE associado: ${n}`,
            tipPresetLoad:'Carregar', tipPresetDel:'Eliminar',
            fabNoSeg:'Selecione segmentos no mapa',
            btnCollapse:'Recolher', btnClose:'Fechar',
            presetColName:'Nome', presetColDesc:'Descrição',
            presetColTime:'Horário', presetColDir:'Sent.',
            presetNamePh:'Nome da predefinição…',
            presetPopupTitle:'💾 Guardar predefinição',
            btnSave:'Guardar', btnCancel:'Cancelar',
            presetErrEmpty:'Introduza um nome.', presetErrDup:'Este nome já existe.',
            presetSaved: n => `✅ Predefinição “${n}” guardada.`,
            holidaysExcl: n => `ℹ️ ${n} feriado(s) excluído(s).`,
            holidaysNone:'ℹ️ Nenhum feriado no período.',
            holidayModeNone:'Feriados: sem filtro',
            holidayModeSkip:'Exceto feriados',
            holidayModeOnly:'Apenas feriados',
            holidaysOnly: n => `✅ ${n} ocorrência(s) em feriado(s) mantida(s).`,
            holidaysOnlyNone:'⚠️ Nenhum feriado no período — a fila ficará vazia.',
            warnInt: (ev,dur) => `⚠️ Intervalo (${ev} min) < duração (${dur} min): os cortes vão sobrepor-se.`,
            warnOcc: (max,req) => `ℹ️ Apenas ${max} ocorrência(s) possível(eis) no período (${req} pedidas).`,
            warnZero:'⚠️ Intervalo nulo.',
            applyOk: (r,s) => `✅ ${r} ${s}`,
            applyErr: (r,s,e) => `❌ ${r} ${s} — ${e}`,
            errDateStart:'Data de início inválida',
            errDateEnd:'Data de fim anterior à data de início',
            warnDatePast:'A data de início está no passado.',
            warnDateEnd:'A data de fim é anterior à data de início.',
            warnDateMax: n => `O intervalo geraria mais de ${n} cortes. Reduza o período.`,
            errRepeat:'Número de repetições inválido',
            errMaxItems: n => `❌ Limite de ${n} cortes atingido — verifique o intervalo de datas ou reduza o período.`,
            defaultClosure:'Corte',
            selectAll:'Selecionar tudo',
            tipCenter:'Centrar neste segmento',
            tipPresetSaveBtn:'Guardar como predefinição',
            // Excluded segments (direction conflict)
            exclWarnTitle: n => `${n} segmento(s) excluído(s) — sentido incompatível. Não serão processados. Clique para transferir os detalhes.`,
            dirConflictTip:'Sentido incompatível — segmento ignorado',
            toastNoCompatible: dir => `⚠️ Nenhum segmento compatível com o sentido ${dir} — lote não adicionado`,
            exclTxtHeader: dir => `Segmentos excluídos — sentido incompatível com o corte ${dir}`,
            exclTxtBatch:'Lote: ',
            exclTxtFooter1:'Estes segmentos não foram adicionados à fila.',
            exclTxtFooter2:'Configure-os num lote separado, com o sentido adequado.',
            exclTxtFilename:'segmentos_excluidos',
            exclTxtDir:'sent',
            // Row delete
            tipRowDel:'Remover esta ocorrência',
            // Header badge queue
            queueBadge: n => n===1?'1 lote na fila':`${n} lotes na fila`,
            // Batch delete tooltip
            tipDelBatch:'Remover este lote',
            tipEditLabel:'Editar a etiqueta deste lote',
            // Apply done
            applyStopping:'⏳ Paragem pedida — a terminar o corte em curso e a interromper de seguida.',
                        applyStopped:(ok,ko)=>`⏹ Parado — ${ok} aplicado(s), ${ko} falhado(s)`,
applyDone: (ok,ko,total) => `✅ ${ok} OK${ko?' — '+ko+' erro(s)':''} em ${total} corte(s).`,
            // Multi-country alert
            multiCountryAlert: cc => `⚠️ Seleção em vários países (${cc}).\nNão é possível utilizar o filtro de feriados.\nMantenha selecionados apenas os segmentos de um único país.`,
            // CSV import log
            csvAdded: (ok,ko) => `✅ ${ok} corte(s) adicionado(s) à fila${ko?', '+ko+' erro(s)':''}.`,
            csvBigConfirm: (seg,rows) => `⚠️ Este ficheiro contém ${seg} segmentos em ${rows} linhas. Importar grandes volumes pode tornar o navegador lento, e o WME só vai cortar os segmentos carregados na vista atual. Continuar?`,
            csvImportCancelled:'Importação cancelada.',
            sweepTitle:'Selecionar os segmentos do trajeto (desloca o mapa)',
            sweepProgress: (done,total,n) => `A varrer… ${done}/${total} — ${n} segmento(s)`,
            sweepDone: n => `✅ ${n} segmento(s) selecionado(s) ao longo do trajeto.`,
            sweepStopped: n => `⏹ Interrompido — ${n} segmento(s) selecionado(s).`,
            sweepConfirm: (a,km) => `Este trajeto tem ~${km} km (${a} movimentos de mapa). A varredura pode demorar e vai deslocar a vista. Continuar?`,
            lotsBtnTitle:'Dividir um trajeto longo em lotes de corte (desloca o mapa)',
            lotsNeedConfig:'⚠️ Configure primeiro o corte no separador Configurar (período, horas, sentido…), depois tente novamente.',
            lotsConfirm: n => `Este trajeto será dividido em ${n} lote(s). O mapa vai deslocar-se automaticamente para carregar cada área — é normal e pode demorar um pouco. Gerar os cortes na fila?`,
            lotsProgress: (done,total,added,seg) => `A dividir em lotes… ${done}/${total} — ${added} lote(s), ${seg} segmento(s)`,
            lotsWhyMoving:'O mapa desloca-se para carregar os segmentos de cada lote. Não mexa no mapa durante a operação.',
            lotsDone: (added,seg) => `✅ ${added} lote(s) adicionados à fila (${seg} segmento(s)). Veja o separador Configurar para rever e aplicar.`,
            lotsStopped: (added,seg) => `⏹ Interrompido — ${added} lote(s) já na fila (${seg} segmento(s)).`,
            applyLotFocus: (k,n) => `📦 Lote ${k}/${n}: a centrar o mapa para carregar os segmentos…`,
            applyLotDone: (k,n) => `📦 Lote ${k}/${n} aplicado. Verifique no mapa e continue.`,
            applyLotNext:'▶ Continuar (lote seguinte)',
            lotRowLabel: (i,n) => `Lote ${i}/${n}`,
            lotStatusTodo:'pendente',
            lotStatusDone:'configurado',
            lotShowTitle:'Mostrar este lote no mapa',
            lotSelTitle:'Selecionar os segmentos deste lote (depois configurar o corte)',
            lotSelecting: (i,n) => `Lote ${i}/${n}: a carregar segmentos…`,
            lotSelected: seg => `✅ ${seg} segmento(s) selecionado(s). Configure o corte e clique em «Validar».`,
            lotNone:'Nenhum segmento captado neste lote.',
            lotNextHint: (i,n) => `📦 Próximo lote: ${i}/${n}.`,
            lotsAllDone:'✅ Todos os lotes estão configurados. Pode aplicar a fila.',
            lotPermaTitle:'Copiar o permalink deste lote (para recuperar a seleção)',
            lotPermaCopied: n => `🔗 Permalink copiado (${n} segmentos).`,
            lotPermaCopy:'Copie este permalink:',
            lotCsvTitle:'Exportar em CSV os lotes configurados deste trajeto (formato WME Advanced Closures)',
            lotCsvNone:'Nenhum lote configurado para exportar neste trajeto.',
            lotCsvDone: n => `📥 ${n} lote(s) exportado(s) em CSV.`,
            // Queue entry detail
            entryDetail: (segs,cl,dir,time) => `${segs} seg · ${cl} corte(s) · ${dir} · ${time}`,
            sbHint:'Selecione segmentos no mapa e clique no botão 🚧 do mapa para abrir a ferramenta.',
            sbToggle:'Ativar a ferramenta',
            emojiPickerTip:'Inserir emoji',
            sbResetFab:'Repor a posição do botão',
            sbDesc:'O botão 🚧 está sempre visível no mapa e pode ser reposicionado livremente por arrastar e largar.<br>Mostra a verde o número de segmentos selecionados.<br>O painel pode ser arrastado e recolhido.<br><br>💬 <a href="https://www.waze.com/discuss/t/script-wme-closures-toolkit/405542" target="_blank" style="color:var(--wct-blue)">Tópico de discussão</a> &nbsp;·&nbsp; 🔗 <a href="https://greasyfork.org/fr/scripts/581015-wme-closures-toolkit" target="_blank" style="color:var(--wct-blue)">GreasyFork</a>',
            sbDisplayMode:'Apresentação',
            sbModeCompact:'Windows 95',
            sbModeNormal:'Normal',
            sbCardsCollapsed:'Cartões da fila recolhidos por predefinição',

            sbLanguage:'Idioma',
            sbLangAuto: l => `Automático — WME (${l})`,
            sbDateFormat:'Formato da data',
            sbDateDmy:'DD/MM/AAAA (Europa, mundo)',
            sbDateMdy:'MM/DD/AAAA (EUA)',
            sbDateIso:'AAAA-MM-DD (ISO)',
            sbDateAuto:'(detetado automaticamente)',
            helpH1:'🚀 Início rápido', helpH2:'⚙️ Configurar um corte',
            helpH3:'📋 Fila', helpH4:'📂 Importar CSV',
            helpH5:'💾 Predefinições', helpH6:'⚠️ Erros comuns e limites', helpH7:'🖥️ Barra lateral / Preferências',
            helpH8:'🗺 Trajetos',
            helpH9:'🔍 Pesquisa de cortes',
            helpH10:'📦 Trajetos longos: modo por lotes',
            helpS1:'<b>Selecione</b> um ou mais segmentos no mapa do WME',
            helpS2:'Clique no botão 🚧 visível no mapa (arraste e largue para o reposicionar)',
            helpS3:'No separador <b>⚙ Configurar</b>, defina os parâmetros do corte (período, horário, dias…)',
            helpS4:'Clique em <b>✔ Validar e adicionar à fila</b>',
            helpS5:'Repita para outros segmentos, se necessário',
            helpS6:'Clique em <b>▶ Aplicar</b> para criar os cortes no WME',
        }
    };
    const s = D[_lang] || D.en;
    const v = s[key];
    if (typeof v === 'function') return v(...args);
    return v !== undefined ? v : key;
};

// buildHelpHTML — contenu aide selon la langue (_L : repli sur l'anglais)
const buildHelpHTML = () => {
    const sections = [
        { id:'h1', title:t('helpH1'), open:true, body:`
            <ol style="margin:0;padding-left:16px;line-height:1.8">
                <li>${t('helpS1')}</li><li>${t('helpS2')}</li><li>${t('helpS3')}</li>
                <li>${t('helpS4')}</li><li>${t('helpS5')}</li><li>${t('helpS6')}</li>
            </ol>` },
        { id:'h2', title:t('helpH2'), body: _L({ fr:`
            <table class="wct-help-table">
            <tr><td><b>D\u00E9but / Fin</b></td><td>Plage de dates sur laquelle r\u00E9p\u00E9ter la fermeture</td></tr>
            <tr><td><b>Heure d\u00E9but</b></td><td>Heure \u00E0 laquelle la fermeture commence chaque jour. Les changements d\u2019heure sont g\u00E9r\u00E9s automatiquement \u2014 voir Limites connues.</td></tr>
            <tr><td><b>\u23F1 Dur\u00E9e / Heure fin</b></td><td>Bascule entre dur\u00E9e (ex\u00A0: 08:00) ou heure de fin explicite. Si heure fin &lt; heure d\u00E9but\u00A0: fermeture jusqu\u2019au lendemain (badge J+1)</td></tr>
            <tr><td><b>+Jours</b></td><td>Jours suppl\u00E9mentaires ajout\u00E9s \u00E0 la dur\u00E9e. En mode Dur\u00E9e\u00A0: s\u2019ajoute \u00E0 la dur\u00E9e h:mm. En mode Heure de fin\u00A0: l\u2019heure de fin est d\u00E9cal\u00E9e d\u2019autant de jours.</td></tr>
            <tr><td><b>Chaque jour</b></td><td>S\u00E9lectionnez les jours actifs. Raccourcis\u00A0: Tous, Lun\u2013Ven, Sam\u2013Dim, Aucun</td></tr>
            <tr><td><b>Sauf jours f\u00E9ri\u00E9s</b></td><td>Exclut automatiquement les jours f\u00E9ri\u00E9s du pays d\u00E9tect\u00E9. N\u00E9cessite internet. Indisponible en s\u00E9lection multi-pays.</td></tr>
            <tr><td><b>Uniquement jours f\u00E9ri\u00E9s</b></td><td>Ne conserve que les occurrences tombant sur un jour f\u00E9ri\u00E9 (utile pour les restrictions annuelles \u00E0 dates variables). N\u00E9cessite internet.</td></tr>
            <tr><td><b>R\u00E9p\u00E9ter</b></td><td>G\u00E9n\u00E8re N occurrences toutes les X jours/heures/minutes. Avertissement si intervalle &lt; dur\u00E9e.</td></tr>
            <tr><td><b>Description</b></td><td>Texte affich\u00E9 dans WME pour identifier la fermeture. Cliquez sur le bouton \uD83D\uDCCC \u00e0 droite du champ pour ins\u00e9rer un \u00e9moji (travaux, sport, m\u00e9t\u00e9o\u2026) \u00e0 la position du curseur.</td></tr>
            <tr><td><b>Sens</b></td><td>Double sens, A \u21D2 B ou B \u21D2 A. Attention\u00A0: sur les longs tron\u00E7ons, le sens peut diff\u00E9rer par segment.</td></tr>
            <tr><td><b>MTE</b></td><td>Ouvrez l\u2019onglet \u00C9v\u00E9nements dans WME, puis cliquez \u21BB dans le champ MTE pour charger la liste.</td></tr>
            <tr><td><b>Fermetures aux n\u0153uds</b></td><td>Aucune / Int\u00E9rieures (n\u0153uds partag\u00E9s) / Toutes</td></tr>
            <tr><td><b>Ignorer le trafic</b></td><td>Si coch\u00e9, la fermeture s\u2019applique sans tenir compte du trafic r\u00e9el. Waze ne r\u00e9ouvre pas automatiquement le segment m\u00eame s\u2019il d\u00e9tecte du trafic passant.</td></tr>
            </table>`, en:`
            <table class="wct-help-table">
            <tr><td><b>Start / End</b></td><td>Date range over which to repeat the closure</td></tr>
            <tr><td><b>Start time</b></td><td>Time at which the closure starts each day. DST transitions are handled automatically \u2014 see Known limits.</td></tr>
            <tr><td><b>\u23F1 Duration / End time</b></td><td>Toggle between duration (e.g. 08:00) or explicit end time. If end &lt; start: closure runs to next day (J+1 badge)</td></tr>
            <tr><td><b>+Days</b></td><td>Extra days added to the closure. In Duration mode: added on top of the h:mm duration. In End time mode: the end time is shifted forward by that many days.</td></tr>
            <tr><td><b>Each day</b></td><td>Select active weekdays. Shortcuts: All, Mon\u2013Fri, Sat\u2013Sun, None</td></tr>
            <tr><td><b>Except public holidays</b></td><td>Auto-excludes public holidays for the detected country. Requires internet. Unavailable for multi-country selections.</td></tr>
            <tr><td><b>Public holidays only</b></td><td>Keeps only occurrences falling on a public holiday (useful for annual variable-date restrictions). Requires internet.</td></tr>
            <tr><td><b>Repeat</b></td><td>Generates N occurrences every X days/hours/minutes. Warning shown if interval &lt; duration.</td></tr>
            <tr><td><b>Description</b></td><td>Text displayed in WME to identify the closure. Click the \uD83D\uDCCC button to the right of the field to insert an emoji (works, sport, weather\u2026) at the cursor position.</td></tr>
            <tr><td><b>Direction</b></td><td>Both ways, A \u21D2 B or B \u21D2 A. Caution: on long segments, direction may differ per segment.</td></tr>
            <tr><td><b>MTE</b></td><td>Open the Events tab in WME, then click \u21BB in the MTE field to load the list.</td></tr>
            <tr><td><b>Node closures</b></td><td>None / Inner nodes (shared between segments) / All</td></tr>
            <tr><td><b>Ignore traffic</b></td><td>If checked, closure applies regardless of actual traffic. Waze will not automatically reopen the segment even if it detects traffic passing through.</td></tr>
            </table>`, de:`
            <table class="wct-help-table">
            <tr><td><b>Beginn / Ende</b></td><td>Zeitraum, über den die Sperrung wiederholt wird</td></tr>
            <tr><td><b>Startzeit</b></td><td>Uhrzeit, zu der die Sperrung täglich beginnt. Zeitumstellungen werden automatisch berücksichtigt — siehe Bekannte Grenzen.</td></tr>
            <tr><td><b>⏱ Dauer / Endzeit</b></td><td>Umschalten zwischen Dauer (z. B. 08:00) und ausdrücklicher Endzeit. Liegt die Endzeit vor der Startzeit, läuft die Sperrung bis zum Folgetag (Kennzeichnung T+1)</td></tr>
            <tr><td><b>+Tage</b></td><td>Zusätzliche Tage. Im Dauer-Modus: werden zur Dauer h:mm addiert. Im Endzeit-Modus: die Endzeit wird um so viele Tage nach hinten verschoben.</td></tr>
            <tr><td><b>Wochentage</b></td><td>Wähle die aktiven Wochentage. Schnellauswahl: Alle, Mo–Fr, Sa–So, Keine</td></tr>
            <tr><td><b>Außer an Feiertagen</b></td><td>Schließt die Feiertage des erkannten Landes automatisch aus. Erfordert eine Internetverbindung. Bei einer Auswahl über mehrere Länder nicht verfügbar.</td></tr>
            <tr><td><b>Nur an Feiertagen</b></td><td>Behält nur die Termine, die auf einen Feiertag fallen (nützlich für jährliche Beschränkungen mit wechselndem Datum). Erfordert eine Internetverbindung.</td></tr>
            <tr><td><b>Wiederholen</b></td><td>Erzeugt N Termine alle X Tage/Stunden/Minuten. Warnung, wenn das Intervall kleiner als die Dauer ist.</td></tr>
            <tr><td><b>Beschreibung</b></td><td>Text, der in WME zur Kennzeichnung der Sperrung angezeigt wird. Klicke auf die Schaltfläche 📌 rechts neben dem Feld, um an der Cursorposition ein Emoji einzufügen (Bauarbeiten, Sport, Wetter…).</td></tr>
            <tr><td><b>Fahrtrichtung</b></td><td>Beide Richtungen, A ⇒ B oder B ⇒ A. Achtung: Bei langen Abschnitten kann die Richtung je Segment unterschiedlich sein.</td></tr>
            <tr><td><b>MTE</b></td><td>Öffne den Reiter Ereignisse in WME und klicke dann im MTE-Feld auf ↻, um die Liste zu laden.</td></tr>
            <tr><td><b>Knotensperrungen</b></td><td>Keine / Innere Knoten (zwischen Segmenten geteilt) / Alle</td></tr>
            <tr><td><b>Verkehr ignorieren</b></td><td>Wenn aktiviert, gilt die Sperrung unabhängig vom tatsächlichen Verkehr. Waze öffnet das Segment nicht automatisch wieder, selbst wenn Verkehr darauf erkannt wird.</td></tr>
            </table>`, es:`
            <table class="wct-help-table">
            <tr><td><b>Inicio / Fin</b></td><td>Intervalo de fechas en el que se repite el cierre</td></tr>
            <tr><td><b>Hora de inicio</b></td><td>Hora a la que empieza el cierre cada día. Los cambios de hora se gestionan automáticamente — consulta Límites conocidos.</td></tr>
            <tr><td><b>⏱ Duración / Hora de fin</b></td><td>Alterna entre duración (p. ej. 08:00) y hora de fin explícita. Si la hora de fin &lt; la de inicio: el cierre se prolonga hasta el día siguiente (indicador D+1)</td></tr>
            <tr><td><b>+Días</b></td><td>Días adicionales que se suman al cierre. En modo Duración: se añaden a la duración h:mm. En modo Hora de fin: la hora de fin se desplaza esos días.</td></tr>
            <tr><td><b>Cada día</b></td><td>Selecciona los días activos. Atajos: Todos, Lun–Vie, Sáb–Dom, Ninguno</td></tr>
            <tr><td><b>Excepto festivos</b></td><td>Excluye automáticamente los festivos del país detectado. Requiere conexión a internet. No disponible con selecciones en varios países.</td></tr>
            <tr><td><b>Solo festivos</b></td><td>Conserva únicamente las ocurrencias que caen en un día festivo (útil para restricciones anuales de fecha variable). Requiere conexión a internet.</td></tr>
            <tr><td><b>Repetir</b></td><td>Genera N ocurrencias cada X días/horas/minutos. Se muestra un aviso si el intervalo &lt; la duración.</td></tr>
            <tr><td><b>Descripción</b></td><td>Texto que se muestra en WME para identificar el cierre. Haz clic en el botón 📌 a la derecha del campo para insertar un emoji (obras, deporte, meteorología…) en la posición del cursor.</td></tr>
            <tr><td><b>Sentido</b></td><td>Ambos sentidos, A ⇒ B o B ⇒ A. Atención: en tramos largos, el sentido puede variar según el segmento.</td></tr>
            <tr><td><b>MTE</b></td><td>Abre la pestaña Eventos en WME y haz clic en ↻ en el campo MTE para cargar la lista.</td></tr>
            <tr><td><b>Cierres en los nodos</b></td><td>Ninguno / Nodos interiores (compartidos entre segmentos) / Todos</td></tr>
            <tr><td><b>Ignorar el tráfico</b></td><td>Si se marca, el cierre se aplica sin tener en cuenta el tráfico real. Waze no reabrirá automáticamente el segmento aunque detecte tráfico circulando por él.</td></tr>
            </table>`, 'pt-BR':`
            <table class="wct-help-table">
            <tr><td><b>Início / Fim</b></td><td>Intervalo de datas em que o bloqueio será repetido</td></tr>
            <tr><td><b>Hora de início</b></td><td>Hora em que o bloqueio começa a cada dia. As mudanças de horário de verão são tratadas automaticamente — veja Limites conhecidos.</td></tr>
            <tr><td><b>⏱ Duração / Hora de fim</b></td><td>Alterna entre duração (ex.: 08:00) e hora de fim explícita. Se a hora de fim for menor que a de início, o bloqueio segue até o dia seguinte (selo D+1)</td></tr>
            <tr><td><b>+Dias</b></td><td>Dias adicionais somados ao bloqueio. No modo Duração: somam-se à duração h:mm. No modo Hora de fim: a hora de fim é adiada em tantos dias.</td></tr>
            <tr><td><b>Cada dia</b></td><td>Selecione os dias da semana ativos. Atalhos: Todos, Seg–Sex, Sáb–Dom, Nenhum</td></tr>
            <tr><td><b>Exceto feriados</b></td><td>Exclui automaticamente os feriados do país detectado. Requer internet. Indisponível em seleções com vários países.</td></tr>
            <tr><td><b>Somente feriados</b></td><td>Mantém apenas as ocorrências que caem em feriado (útil para restrições anuais com datas variáveis). Requer internet.</td></tr>
            <tr><td><b>Repetir</b></td><td>Gera N ocorrências a cada X dias/horas/minutos. Um aviso é exibido se o intervalo for menor que a duração.</td></tr>
            <tr><td><b>Descrição</b></td><td>Texto exibido no WME para identificar o bloqueio. Clique no botão 📌 à direita do campo para inserir um emoji (obras, esporte, clima…) na posição do cursor.</td></tr>
            <tr><td><b>Sentido</b></td><td>Ambos os sentidos, A ⇒ B ou B ⇒ A. Atenção: em trechos longos, o sentido pode variar de um segmento para outro.</td></tr>
            <tr><td><b>MTE</b></td><td>Abra a aba Eventos no WME e clique em ↻ no campo MTE para carregar a lista.</td></tr>
            <tr><td><b>Bloqueios nos nós</b></td><td>Nenhum / Nós internos (compartilhados entre segmentos) / Todos</td></tr>
            <tr><td><b>Ignorar o tráfego</b></td><td>Se marcado, o bloqueio se aplica independentemente do tráfego real. O Waze não reabrirá o segmento automaticamente, mesmo que detecte tráfego passando por ele.</td></tr>
            </table>`, 'pt-PT':`
            <table class="wct-help-table">
            <tr><td><b>Início / Fim</b></td><td>Intervalo de datas no qual o corte é repetido</td></tr>
            <tr><td><b>Hora de início</b></td><td>Hora a que o corte começa todos os dias. As mudanças de hora são geridas automaticamente — ver Limites conhecidos.</td></tr>
            <tr><td><b>⏱ Duração / Hora de fim</b></td><td>Alterna entre duração (ex.: 08:00) e hora de fim explícita. Se a hora de fim &lt; hora de início: o corte prolonga-se até ao dia seguinte (indicador D+1)</td></tr>
            <tr><td><b>+Dias</b></td><td>Dias suplementares acrescentados ao corte. No modo Duração: somam-se à duração h:mm. No modo Hora de fim: a hora de fim é adiada esse número de dias.</td></tr>
            <tr><td><b>Cada dia</b></td><td>Selecione os dias da semana ativos. Atalhos: Todos, Seg–Sex, Sáb–Dom, Nenhum</td></tr>
            <tr><td><b>Exceto feriados</b></td><td>Exclui automaticamente os feriados do país detetado. Requer ligação à internet. Indisponível em seleções que abranjam vários países.</td></tr>
            <tr><td><b>Apenas feriados</b></td><td>Mantém apenas as ocorrências que caem num feriado (útil para restrições anuais de data variável). Requer ligação à internet.</td></tr>
            <tr><td><b>Repetir</b></td><td>Gera N ocorrências a cada X dias/horas/minutos. É apresentado um aviso se o intervalo for menor do que a duração.</td></tr>
            <tr><td><b>Descrição</b></td><td>Texto apresentado no WME para identificar o corte. Clique no botão 📌 à direita do campo para inserir um emoji (obras, desporto, meteorologia…) na posição do cursor.</td></tr>
            <tr><td><b>Sentido</b></td><td>Ambos os sentidos, A ⇒ B ou B ⇒ A. Atenção: em troços longos, o sentido pode variar de segmento para segmento.</td></tr>
            <tr><td><b>MTE</b></td><td>Abra o separador Eventos no WME e clique em ↻ no campo MTE para carregar a lista.</td></tr>
            <tr><td><b>Cortes nos nós</b></td><td>Nenhum / Nós interiores (partilhados entre segmentos) / Todos</td></tr>
            <tr><td><b>Ignorar o trânsito</b></td><td>Se estiver marcado, o corte aplica-se independentemente do trânsito real. O Waze não reabre automaticamente o segmento, mesmo que detete trânsito a passar.</td></tr>
            </table>` }) },
        { id:'h3', title:t('helpH3'), body: _L({ fr:`
            <p>La file accumule des <b>lots</b> de fermetures avant application.</p>
            <table class="wct-help-table">
            <tr><td><b>\uD83C\uDFAF</b></td><td>Centre la carte sur le segment correspondant</td></tr>
            <tr><td><b>\u25BC/\u25B6</b></td><td>Replie/d\u00E9plie le tableau du lot</td></tr>
            <tr><td><b>\u2715</b></td><td>Supprime le lot de la file</td></tr>
            <tr><td><b>🗑</b></td><td>Supprime une ligne de fermeture du lot (exclue de l'application et de l'export)</td></tr>
            <tr><td><b>Bordure color\u00E9e</b></td><td>\uD83D\uDD35 Configur\u00E9 manuellement \u00B7 \uD83D\uDFE2 Import\u00E9 CSV \u00B7 \uD83D\uDFE0 Charg\u00E9 depuis pr\u00E9r\u00E9glage</td></tr>
            <tr><td><b>\u00C9tat \uD83D\uDFE2\uD83D\uDFE0\uD83D\uDD34\u26AB</b></td><td>\uD83D\uDFE2 OK \u00B7 \uD83D\uDFE0 En cours \u00B7 \uD83D\uDD34 Chevauchement \u00B7 \u26AB Date pass\u00E9e</td></tr>
            </table>`, en:`
            <p>The queue accumulates <b>batches</b> of closures before applying.</p>
            <table class="wct-help-table">
            <tr><td><b>\uD83C\uDFAF</b></td><td>Centers the map on the corresponding segment</td></tr>
            <tr><td><b>\u25BC/\u25B6</b></td><td>Fold/unfold the batch table</td></tr>
            <tr><td><b>\u2715</b></td><td>Remove the batch from the queue</td></tr>
            <tr><td><b>🗑</b></td><td>Remove an individual closure row from the batch (excluded from apply and export)</td></tr>
            <tr><td><b>Colored border</b></td><td>\uD83D\uDD35 Manual \u00B7 \uD83D\uDFE2 CSV import \u00B7 \uD83D\uDFE0 From preset</td></tr>
            <tr><td><b>State \uD83D\uDFE2\uD83D\uDFE0\uD83D\uDD34\u26AB</b></td><td>\uD83D\uDFE2 OK \u00B7 \uD83D\uDFE0 Ongoing \u00B7 \uD83D\uDD34 Overlap \u00B7 \u26AB Past date</td></tr>
            </table>`, de:`
            <p>Die Warteschlange sammelt <b>Pakete</b> von Sperrungen, bevor sie angewendet werden.</p>
            <table class="wct-help-table">
            <tr><td><b>\uD83C\uDFAF</b></td><td>Zentriert die Karte auf das zugeh\u00F6rige Segment</td></tr>
            <tr><td><b>\u25BC/\u25B6</b></td><td>Klappt die Tabelle des Pakets ein/aus</td></tr>
            <tr><td><b>\u2715</b></td><td>Entfernt das Paket aus der Warteschlange</td></tr>
            <tr><td><b>\uD83D\uDDD1</b></td><td>Entfernt eine einzelne Sperrungszeile aus dem Paket (wird beim Anwenden und beim Export \u00FCbergangen)</td></tr>
            <tr><td><b>Farbiger Rand</b></td><td>\uD83D\uDD35 Manuell eingerichtet \u00B7 \uD83D\uDFE2 CSV-Import \u00B7 \uD83D\uDFE0 Aus Vorlage geladen</td></tr>
            <tr><td><b>Zustand \uD83D\uDFE2\uD83D\uDFE0\uD83D\uDD34\u26AB</b></td><td>\uD83D\uDFE2 OK \u00B7 \uD83D\uDFE0 Laufend \u00B7 \uD83D\uDD34 \u00DCberschneidung \u00B7 \u26AB Vergangenes Datum</td></tr>
            </table>`, es:`
            <p>La cola acumula <b>lotes</b> de cierres antes de aplicarlos.</p>
            <table class="wct-help-table">
            <tr><td><b>🎯</b></td><td>Centra el mapa en el segmento correspondiente</td></tr>
            <tr><td><b>▼/▶</b></td><td>Pliega/despliega la tabla del lote</td></tr>
            <tr><td><b>✕</b></td><td>Elimina el lote de la cola</td></tr>
            <tr><td><b>🗑</b></td><td>Elimina una fila de cierre del lote (se excluye de la aplicación y de la exportación)</td></tr>
            <tr><td><b>Borde de color</b></td><td>🔵 Manual · 🟢 Importado de CSV · 🟠 Cargado desde preajuste</td></tr>
            <tr><td><b>Estado 🟢🟠🔴⚫</b></td><td>🟢 OK · 🟠 En curso · 🔴 Solapamiento · ⚫ Fecha pasada</td></tr>
            </table>`, 'pt-BR':`
            <p>A fila acumula <b>lotes</b> de bloqueios antes da aplicação.</p>
            <table class="wct-help-table">
            <tr><td><b>🎯</b></td><td>Centraliza o mapa no segmento correspondente</td></tr>
            <tr><td><b>▼/▶</b></td><td>Recolhe/expande a tabela do lote</td></tr>
            <tr><td><b>✕</b></td><td>Remove o lote da fila</td></tr>
            <tr><td><b>🗑</b></td><td>Remove uma linha de bloqueio do lote (excluída da aplicação e da exportação)</td></tr>
            <tr><td><b>Borda colorida</b></td><td>🔵 Manual · 🟢 Importado de CSV · 🟠 Carregado de predefinição</td></tr>
            <tr><td><b>Estado 🟢🟠🔴⚫</b></td><td>🟢 OK · 🟠 Em curso · 🔴 Sobreposição · ⚫ Data passada</td></tr>
            </table>`, 'pt-PT':`
            <p>A fila acumula <b>lotes</b> de cortes antes da aplicação.</p>
            <table class="wct-help-table">
            <tr><td><b>🎯</b></td><td>Centra o mapa no segmento correspondente</td></tr>
            <tr><td><b>▼/▶</b></td><td>Recolhe/expande a tabela do lote</td></tr>
            <tr><td><b>✕</b></td><td>Remove o lote da fila</td></tr>
            <tr><td><b>🗑</b></td><td>Remove uma linha de corte do lote (excluída da aplicação e da exportação)</td></tr>
            <tr><td><b>Margem colorida</b></td><td>🔵 Manual · 🟢 Importado de CSV · 🟠 Carregado de predefinição</td></tr>
            <tr><td><b>Estado 🟢🟠🔴⚫</b></td><td>🟢 OK · 🟠 Em curso · 🔴 Sobreposição · ⚫ Data passada</td></tr>
            </table>` }) },
        { id:'h4', title:t('helpH4'), body: _L({ fr:`
            <p>Importe un fichier CSV au format <b>WME Advanced Closures</b> directement dans la file d\u2019attente.</p>
            <p>Colonnes attendues\u00A0:<br><code style="font-size:0.833em">header, reason, start date, end date, direction, ignore traffic, segment IDs, lon/lat, zoom, MTE id, comment</code></p>
            <p>Le format export\u00E9 par ce script est compatible avec le script WME Advanced Closures original.</p>`, en:`
            <p>Imports a CSV file in <b>WME Advanced Closures</b> format directly into the queue.</p>
            <p>Expected columns:<br><code style="font-size:0.833em">header, reason, start date, end date, direction, ignore traffic, segment IDs, lon/lat, zoom, MTE id, comment</code></p>
            <p>The format exported by this script is compatible with the original WME Advanced Closures script.</p>`, de:`
            <p>Importiert eine CSV-Datei im Format <b>WME Advanced Closures</b> direkt in die Warteschlange.</p>
            <p>Erwartete Spalten:<br><code style="font-size:0.833em">header, reason, start date, end date, direction, ignore traffic, segment IDs, lon/lat, zoom, MTE id, comment</code></p>
            <p>Das von diesem Skript exportierte Format ist mit dem ursprünglichen Skript WME Advanced Closures kompatibel.</p>`, es:`
            <p>Importa un archivo CSV en formato <b>WME Advanced Closures</b> directamente en la cola.</p>
            <p>Columnas esperadas:<br><code style="font-size:0.833em">header, reason, start date, end date, direction, ignore traffic, segment IDs, lon/lat, zoom, MTE id, comment</code></p>
            <p>El formato exportado por este script es compatible con el script original WME Advanced Closures.</p>`, 'pt-BR':`
            <p>Importa um arquivo CSV no formato <b>WME Advanced Closures</b> diretamente para a fila.</p>
            <p>Colunas esperadas:<br><code style="font-size:0.833em">header, reason, start date, end date, direction, ignore traffic, segment IDs, lon/lat, zoom, MTE id, comment</code></p>
            <p>O formato exportado por este script é compatível com o script original WME Advanced Closures.</p>`, 'pt-PT':`
            <p>Importa um ficheiro CSV no formato <b>WME Advanced Closures</b> diretamente para a fila.</p>
            <p>Colunas esperadas:<br><code style="font-size:0.833em">header, reason, start date, end date, direction, ignore traffic, segment IDs, lon/lat, zoom, MTE id, comment</code></p>
            <p>O formato exportado por este script é compatível com o script WME Advanced Closures original.</p>` }) },
        { id:'h5', title:t('helpH5'), body: _L({ fr:`
            <p>Sauvegardez une configuration (horaires, jours, sens\u2026) pour la r\u00E9utiliser.</p>
            <ul style="margin:0;padding-left:16px;line-height:1.7">
            <li>Cliquez \uD83D\uDCBE \u00E0 droite du bouton Valider pour sauvegarder la config actuelle</li>
            <li>Depuis l\u2019onglet Pr\u00E9r\u00E9glages\u00A0: \u21A9\uFE0F pour charger (bascule sur Configurer), \uD83D\uDDD1 pour supprimer</li>
            </ul>`, en:`
            <p>Save a configuration (schedule, days, direction\u2026) for reuse.</p>
            <ul style="margin:0;padding-left:16px;line-height:1.7">
            <li>Click \uD83D\uDCBE next to the Validate button to save the current config</li>
            <li>From the Presets tab: \u21A9\uFE0F to load (switches to Configure), \uD83D\uDDD1 to delete</li>
            </ul>`, de:`
            <p>Speichere eine Konfiguration (Zeitplan, Tage, Fahrtrichtung\u2026) zur Wiederverwendung.</p>
            <ul style="margin:0;padding-left:16px;line-height:1.7">
            <li>Klicke auf \uD83D\uDCBE rechts neben der Schaltfl\u00E4che Best\u00E4tigen, um die aktuelle Konfiguration zu speichern</li>
            <li>Im Reiter Vorlagen: \u21A9\uFE0F zum Laden (wechselt zu Einrichten), \uD83D\uDDD1 zum L\u00F6schen</li>
            </ul>`, es:`
            <p>Guarda una configuración (horarios, días, sentido…) para reutilizarla.</p>
            <ul style="margin:0;padding-left:16px;line-height:1.7">
            <li>Haz clic en 💾 junto al botón Validar para guardar la configuración actual</li>
            <li>Desde la pestaña Preajustes: ↩️ para cargar (cambia a Configurar), 🗑 para eliminar</li>
            </ul>`, 'pt-BR':`
            <p>Salve uma configuração (horários, dias, sentido…) para reutilizá-la.</p>
            <ul style="margin:0;padding-left:16px;line-height:1.7">
            <li>Clique em 💾 ao lado do botão Validar para salvar a configuração atual</li>
            <li>Na aba Predefinições: ↩️ para carregar (vai para Configurar), 🗑 para excluir</li>
            </ul>`, 'pt-PT':`
            <p>Guarde uma configuração (horário, dias, sentido…) para a reutilizar.</p>
            <ul style="margin:0;padding-left:16px;line-height:1.7">
            <li>Clique em 💾 ao lado do botão Validar para guardar a configuração atual</li>
            <li>No separador Predefinições: ↩️ para carregar (muda para Configurar), 🗑 para eliminar</li>
            </ul>` }) },
        { id:'h6', title:t('helpH6'), body: _L({ fr:`
            <table class="wct-help-table">
            <tr><td><b>Segment non \u00E9ditable</b></td><td>Vous n\u2019avez pas les permissions d\u2019\u00E9dition sur ce segment.</td></tr>
            <tr><td><b>Chevauchement</b></td><td>Une fermeture existe d\u00E9j\u00E0 sur ce segment \u00E0 ces dates. Visible en rouge dans la file.</td></tr>
            <tr><td><b>Date pass\u00E9e</b></td><td>WME refuse les fermetures dans le pass\u00E9. La ligne appara\u00EEt en gris.</td></tr>
            <tr><td><b>Multi-pays</b></td><td>La s\u00E9lection couvre plusieurs pays \u2014 filtre jours f\u00E9ri\u00E9s d\u00E9sactiv\u00E9.</td></tr>
            <tr><td><b>MTE introuvable</b></td><td>Ouvrez l\u2019onglet \u00C9v\u00E9nements WME et cliquez \u21BB pour recharger la liste.</td></tr>
            <tr><td><b>Intervalle &lt; dur\u00E9e</b></td><td>En mode R\u00E9p\u00E9ter, les occurrences se chevauchent. Augmentez l\u2019intervalle ou r\u00E9duisez la dur\u00E9e.</td></tr>
            <tr><td><b>Changement d\u2019heure (limite)</b></td><td>Les horaires sont interpr\u00E9t\u00E9s dans le <b>fuseau horaire du navigateur</b>. Si vous \u00e9ditez des segments dans un fuseau diff\u00E9rent de celui de votre syst\u00e8me (ex.\u00a0: un \u00e9diteur fran\u00e7ais travaillant sur des segments japonais), les heures saisies seront d\u00e9cal\u00e9es. Dans ce cas, convertissez manuellement les horaires dans votre fuseau local avant saisie.</td></tr>
            </table>`, en:`
            <table class="wct-help-table">
            <tr><td><b>Segment not editable</b></td><td>You don\u2019t have edit permissions on this segment.</td></tr>
            <tr><td><b>Overlap</b></td><td>A closure already exists on this segment for these dates. Shown in red in the queue.</td></tr>
            <tr><td><b>Past date</b></td><td>WME rejects closures in the past. Shown in grey.</td></tr>
            <tr><td><b>Multi-country</b></td><td>Selection spans multiple countries \u2014 holiday filter disabled.</td></tr>
            <tr><td><b>MTE not found</b></td><td>Open the WME Events tab and click \u21BB to reload the list.</td></tr>
            <tr><td><b>Interval &lt; duration</b></td><td>In Repeat mode, occurrences overlap. Increase interval or reduce duration.</td></tr>
            <tr><td><b>DST / time zone (limit)</b></td><td>Schedules are interpreted in the <b>browser\u2019s time zone</b>. If you are editing segments in a different time zone from your system (e.g. a French editor working on Japanese segments), the entered times will be offset accordingly. In that case, manually convert the times to your local time zone before entering them.</td></tr>
            </table>`, de:`
            <table class="wct-help-table">
            <tr><td><b>Segment nicht bearbeitbar</b></td><td>Du hast keine Bearbeitungsrechte f\u00fcr dieses Segment.</td></tr>
            <tr><td><b>\u00dcberschneidung</b></td><td>F\u00fcr dieses Segment besteht in diesem Zeitraum bereits eine Sperrung. Wird in der Warteschlange rot angezeigt.</td></tr>
            <tr><td><b>Vergangenes Datum</b></td><td>WME lehnt Sperrungen in der Vergangenheit ab. Die Zeile erscheint grau.</td></tr>
            <tr><td><b>Mehrere L\u00e4nder</b></td><td>Die Auswahl erstreckt sich \u00fcber mehrere L\u00e4nder \u2014 der Feiertagsfilter ist deaktiviert.</td></tr>
            <tr><td><b>MTE nicht gefunden</b></td><td>\u00d6ffne den WME-Reiter Ereignisse und klicke auf \u21bb, um die Liste neu zu laden.</td></tr>
            <tr><td><b>Intervall &lt; Dauer</b></td><td>Im Modus Wiederholen \u00fcberschneiden sich die Termine. Vergr\u00f6\u00dfere das Intervall oder verk\u00fcrze die Dauer.</td></tr>
            <tr><td><b>Zeitumstellung / Zeitzone (Grenze)</b></td><td>Die Uhrzeiten werden in der <b>Zeitzone des Browsers</b> ausgewertet. Wenn du Segmente in einer anderen Zeitzone als der deines Systems bearbeitest (z. B. ein deutscher Editor, der an japanischen Segmenten arbeitet), sind die eingegebenen Uhrzeiten entsprechend verschoben. Rechne die Zeiten in diesem Fall vor der Eingabe manuell in deine lokale Zeitzone um.</td></tr>
            </table>`, es:`
            <table class="wct-help-table">
            <tr><td><b>Segmento no editable</b></td><td>No tienes permisos de edición sobre este segmento.</td></tr>
            <tr><td><b>Solapamiento</b></td><td>Ya existe un cierre en este segmento para esas fechas. Se muestra en rojo en la cola.</td></tr>
            <tr><td><b>Fecha pasada</b></td><td>WME rechaza los cierres en el pasado. La fila aparece en gris.</td></tr>
            <tr><td><b>Varios países</b></td><td>La selección abarca varios países — filtro de festivos desactivado.</td></tr>
            <tr><td><b>MTE no encontrado</b></td><td>Abre la pestaña Eventos de WME y haz clic en ↻ para recargar la lista.</td></tr>
            <tr><td><b>Intervalo &lt; duración</b></td><td>En modo Repetir, las ocurrencias se solapan. Aumenta el intervalo o reduce la duración.</td></tr>
            <tr><td><b>Cambio de hora / zona horaria (límite)</b></td><td>Los horarios se interpretan en la <b>zona horaria del navegador</b>. Si editas segmentos situados en una zona horaria distinta a la de tu sistema (p. ej. un editor español trabajando sobre segmentos japoneses), las horas introducidas quedarán desfasadas. En ese caso, convierte manualmente los horarios a tu zona horaria local antes de introducirlos.</td></tr>
            </table>`, 'pt-BR':`
            <table class="wct-help-table">
            <tr><td><b>Segmento não editável</b></td><td>Você não tem permissão de edição neste segmento.</td></tr>
            <tr><td><b>Sobreposição</b></td><td>Já existe um bloqueio neste segmento nessas datas. Aparece em vermelho na fila.</td></tr>
            <tr><td><b>Data passada</b></td><td>O WME recusa bloqueios no passado. A linha aparece em cinza.</td></tr>
            <tr><td><b>Vários países</b></td><td>A seleção abrange vários países — filtro de feriados desativado.</td></tr>
            <tr><td><b>MTE não encontrado</b></td><td>Abra a aba Eventos do WME e clique em ↻ para recarregar a lista.</td></tr>
            <tr><td><b>Intervalo &lt; duração</b></td><td>No modo Repetir, as ocorrências se sobrepõem. Aumente o intervalo ou reduza a duração.</td></tr>
            <tr><td><b>Horário de verão / fuso (limite)</b></td><td>Os horários são interpretados no <b>fuso horário do navegador</b>. Se você editar segmentos em um fuso diferente do seu sistema (ex.: um editor brasileiro trabalhando em segmentos japoneses), as horas informadas ficarão deslocadas. Nesse caso, converta manualmente os horários para o seu fuso local antes de digitá-los.</td></tr>
            </table>`, 'pt-PT':`
            <table class="wct-help-table">
            <tr><td><b>Segmento não editável</b></td><td>Não tem permissões de edição neste segmento.</td></tr>
            <tr><td><b>Sobreposição</b></td><td>Já existe um corte neste segmento para estas datas. Aparece a vermelho na fila.</td></tr>
            <tr><td><b>Data passada</b></td><td>O WME recusa cortes no passado. Aparece a cinzento.</td></tr>
            <tr><td><b>Vários países</b></td><td>A seleção abrange vários países — filtro de feriados desativado.</td></tr>
            <tr><td><b>MTE não encontrado</b></td><td>Abra o separador Eventos do WME e clique em ↻ para recarregar a lista.</td></tr>
            <tr><td><b>Intervalo &lt; duração</b></td><td>No modo Repetir, as ocorrências sobrepõem-se. Aumente o intervalo ou reduza a duração.</td></tr>
            <tr><td><b>Mudança de hora / fuso horário (limite)</b></td><td>Os horários são interpretados no <b>fuso horário do navegador</b>. Se estiver a editar segmentos num fuso horário diferente do do seu sistema (por exemplo, um editor português a trabalhar em segmentos japoneses), as horas introduzidas ficarão desfasadas. Nesse caso, converta manualmente as horas para o seu fuso horário local antes de as introduzir.</td></tr>
            </table>` }) },
        { id:'h7', title:t('helpH7'), body: _L({ fr:`
            <table class="wct-help-table">
            <tr><td><b>Activer l’outil</b></td><td>Active ou désactive WCT. Désactivé, le bouton 🚧 reste visible mais l’overlay ne s’ouvre pas.</td></tr>
            <tr><td><b>Affichage</b></td><td>Choisissez entre <b>Normal</b> (interface standard) et <b>Windows 95</b> (ultra-compact, coins carrés, palette grise classique). Préférence sauvegardée.</td></tr>
            <tr><td><b>Format des dates</b></td><td>Contrôle l’affichage dans la file et les logs.<br><b>JJ/MM/AAAA</b> — Europe (défaut)<br><b>MM/JJ/AAAA</b> — USA<br><b>AAAA-MM-JJ</b> — ISO<br>Détecté via <code>navigator.language</code>, forçable manuellement. Préférence sauvegardée.</td></tr>
            <tr><td><b>Réinitialiser la position</b></td><td>Remet le bouton 🚧 à sa position par défaut sur la carte.</td></tr>
            </table>`, en:`
            <table class="wct-help-table">
            <tr><td><b>Enable tool</b></td><td>Enables or disables WCT. When disabled, the 🚧 button remains visible but the overlay does not open.</td></tr>
            <tr><td><b>Display mode</b></td><td>Choose between <b>Normal</b> (standard) and <b>Windows 95</b> (ultra-compact, square corners, classic grey). Preference saved.</td></tr>
            <tr><td><b>Date format</b></td><td>Controls display in the queue and logs.<br><b>DD/MM/YYYY</b> — Europe (default)<br><b>MM/DD/YYYY</b> — USA<br><b>YYYY-MM-DD</b> — ISO<br>Auto-detected via <code>navigator.language</code>, overridable manually. Preference saved.</td></tr>
            <tr><td><b>Reset button position</b></td><td>Moves the 🚧 button back to its default position on the map.</td></tr>
            </table>`, de:`
            <table class="wct-help-table">
            <tr><td><b>Werkzeug aktivieren</b></td><td>Aktiviert oder deaktiviert WCT. Ist es deaktiviert, bleibt die Schaltfläche 🚧 sichtbar, das Overlay öffnet sich jedoch nicht.</td></tr>
            <tr><td><b>Darstellung</b></td><td>Wähle zwischen <b>Normal</b> (Standardoberfläche) und <b>Windows 95</b> (sehr kompakt, eckige Ecken, klassische graue Palette). Die Einstellung wird gespeichert.</td></tr>
            <tr><td><b>Datumsformat</b></td><td>Steuert die Anzeige in der Warteschlange und in den Protokollen.<br><b>TT/MM/JJJJ</b> — Europa (Standard)<br><b>MM/TT/JJJJ</b> — USA<br><b>JJJJ-MM-TT</b> — ISO<br>Über <code>navigator.language</code> erkannt, manuell überschreibbar. Die Einstellung wird gespeichert.</td></tr>
            <tr><td><b>Position zurücksetzen</b></td><td>Setzt die Schaltfläche 🚧 auf ihre Standardposition auf der Karte zurück.</td></tr>
            </table>`, es:`
            <table class="wct-help-table">
            <tr><td><b>Activar la herramienta</b></td><td>Activa o desactiva WCT. Si está desactivada, el botón 🚧 sigue visible pero el panel no se abre.</td></tr>
            <tr><td><b>Visualización</b></td><td>Elige entre <b>Normal</b> (interfaz estándar) y <b>Windows 95</b> (ultracompacta, esquinas rectas, paleta gris clásica). La preferencia se guarda.</td></tr>
            <tr><td><b>Formato de las fechas</b></td><td>Controla la visualización en la cola y en los registros.<br><b>DD/MM/AAAA</b> — Europa (por defecto)<br><b>MM/DD/AAAA</b> — EE. UU.<br><b>AAAA-MM-DD</b> — ISO<br>Se detecta mediante <code>navigator.language</code> y se puede forzar manualmente. La preferencia se guarda.</td></tr>
            <tr><td><b>Restablecer la posición del botón</b></td><td>Devuelve el botón 🚧 a su posición por defecto en el mapa.</td></tr>
            </table>`, 'pt-BR':`
            <table class="wct-help-table">
            <tr><td><b>Ativar a ferramenta</b></td><td>Ativa ou desativa o WCT. Desativado, o botão 🚧 continua visível, mas o painel não abre.</td></tr>
            <tr><td><b>Modo de exibição</b></td><td>Escolha entre <b>Normal</b> (interface padrão) e <b>Windows 95</b> (ultracompacto, cantos retos, cinza clássico). A preferência é salva.</td></tr>
            <tr><td><b>Formato de data</b></td><td>Controla a exibição na fila e nos logs.<br><b>DD/MM/AAAA</b> — Europa, Brasil (padrão)<br><b>MM/DD/AAAA</b> — EUA<br><b>AAAA-MM-DD</b> — ISO<br>Detectado automaticamente via <code>navigator.language</code>, com possibilidade de forçar manualmente. A preferência é salva.</td></tr>
            <tr><td><b>Redefinir a posição do botão</b></td><td>Devolve o botão 🚧 à sua posição padrão no mapa.</td></tr>
            </table>`, 'pt-PT':`
            <table class="wct-help-table">
            <tr><td><b>Ativar a ferramenta</b></td><td>Ativa ou desativa o WCT. Quando está desativado, o botão 🚧 permanece visível no mapa, mas o painel não abre.</td></tr>
            <tr><td><b>Modo de apresentação</b></td><td>Escolha entre <b>Normal</b> (interface padrão) e <b>Windows 95</b> (ultracompacto, cantos retos, cinzento clássico). A preferência é guardada.</td></tr>
            <tr><td><b>Formato da data</b></td><td>Controla a apresentação na fila e nos registos.<br><b>DD/MM/AAAA</b> — Europa (predefinição)<br><b>MM/DD/AAAA</b> — EUA<br><b>AAAA-MM-DD</b> — ISO<br>Detetado automaticamente através de <code>navigator.language</code>, podendo ser forçado manualmente. A preferência é guardada.</td></tr>
            <tr><td><b>Repor a posição do botão</b></td><td>Repõe o botão 🚧 na sua posição predefinida no mapa.</td></tr>
            </table>` }) },
        { id:'h8', title:t('helpH8'), body: _L({ fr:`
            <p>Superpose un ou plusieurs tracés (GPX, KML, KMZ, GeoJSON, Shapefile ZIP) sur la carte WME pour faciliter l'identification des segments à fermer.</p>
            <p><b>Chargement :</b> cliquer sur la zone ou glisser-déposer un fichier. Plusieurs fichiers et formats peuvent être chargés simultanément — les calques se cumulent.</p>
            <table class="wct-help-table">
            <tr><td><b>📄 Fichier</b></td><td>Ligne parente : représente le fichier chargé. La coche toggle tous ses tracés. 🗑 supprime tous les calques du fichier.</td></tr>
            <tr><td><b>↳ Tracé</b></td><td>Ligne enfant : un track GPX, un Placemark KML, une Feature GeoJSON ou une géométrie Shapefile. Coche individuelle, couleur et focus par tracé.</td></tr>
            <tr><td><b>Type</b></td><td>Format du fichier source : GPX, KML, KMZ, GeoJSON ou SHP.</td></tr>
            <tr><td><b>Swatch couleur</b></td><td>Cliquer pour changer la couleur du tracé — palette de 16 couleurs.</td></tr>
            <tr><td><b>pts</b></td><td>Nombre de points tracés (max 3 000, sous-échantillonné si nécessaire).</td></tr>
            <tr><td><b>err</b></td><td>✅ si aucune erreur — ⚠️ + nombre sinon (survoler pour le détail).</td></tr>
            <tr><td><b>🎯</b></td><td>Centre la carte sur l'étendue du tracé au zoom optimal.</td></tr>
            <tr><td><b>🗑</b></td><td>Supprime ce tracé (ou tous les tracés du fichier pour la ligne parent).</td></tr>
            </table>
            <p style="margin-top:6px"><b>Shapefile :</b> fournir un ZIP contenant au minimum <code>.shp</code>, <code>.dbf</code> et <code>.shx</code>. Un fichier <code>.prj</code> est recommandé pour la reprojection automatique (Lambert 93, UTM…). Sans <code>.prj</code>, WGS84 est supposé.</p>
            <p><b>Calque Tracés</b> (barre de sélection) : visible dès qu'un fichier est chargé — coche globale pour afficher/masquer tous les calques.</p>
            <p><b>Limitation :</b> calque visuel uniquement. Aucune sélection automatique de segments — la sélection reste manuelle dans WME.</p>`, en:`
            <p>Overlays one or more tracks (GPX, KML, KMZ, GeoJSON, Shapefile ZIP) onto the WME map to help identify segments to close.</p>
            <p><b>Loading:</b> click the drop zone or drag and drop a file. Multiple files and formats can be loaded simultaneously — layers accumulate.</p>
            <table class="wct-help-table">
            <tr><td><b>📄 File</b></td><td>Parent row: represents the loaded file. Checkbox toggles all its tracks. 🗑 removes all file layers.</td></tr>
            <tr><td><b>↳ Track</b></td><td>Child row: a GPX track, a KML Placemark, a GeoJSON Feature, or a Shapefile geometry. Individual checkbox, color and focus per track.</td></tr>
            <tr><td><b>Type</b></td><td>Source file format: GPX, KML, KMZ, GeoJSON or SHP.</td></tr>
            <tr><td><b>Color swatch</b></td><td>Click to change the track color — 16-color palette.</td></tr>
            <tr><td><b>pts</b></td><td>Number of plotted points (max 3,000, subsampled if needed).</td></tr>
            <tr><td><b>err</b></td><td>✅ if no errors — ⚠️ + count otherwise (hover for details).</td></tr>
            <tr><td><b>🎯</b></td><td>Centers the map on the track extent at the optimal zoom.</td></tr>
            <tr><td><b>🗑</b></td><td>Removes this track (or all file tracks for the parent row).</td></tr>
            </table>
            <p style="margin-top:6px"><b>Shapefile:</b> provide a ZIP containing at least <code>.shp</code>, <code>.dbf</code> and <code>.shx</code>. A <code>.prj</code> file is recommended for automatic reprojection (Lambert 93, UTM…). Without <code>.prj</code>, WGS84 is assumed.</p>
            <p><b>Tracks layer</b> (selection bar): visible once a file is loaded — global checkbox to show/hide all layers at once.</p>
            <p><b>Limitation:</b> visual layer only. No automatic segment selection — selection remains manual in WME.</p>`, de:`
            <p>Legt einen oder mehrere Tracks (GPX, KML, KMZ, GeoJSON, Shapefile-ZIP) über die WME-Karte, um die zu sperrenden Segmente leichter zu erkennen.</p>
            <p><b>Laden:</b> auf die Ablagefläche klicken oder eine Datei per Drag & Drop ablegen. Mehrere Dateien und Formate können gleichzeitig geladen werden — die Ebenen summieren sich.</p>
            <table class="wct-help-table">
            <tr><td><b>📄 Datei</b></td><td>Übergeordnete Zeile: steht für die geladene Datei. Das Häkchen schaltet alle ihre Tracks um. 🗑 entfernt alle Ebenen der Datei.</td></tr>
            <tr><td><b>↳ Track</b></td><td>Untergeordnete Zeile: ein GPX-Track, ein KML-Placemark, ein GeoJSON-Feature oder eine Shapefile-Geometrie. Häkchen, Farbe und Zentrierung je Track.</td></tr>
            <tr><td><b>Type</b></td><td>Format der Quelldatei: GPX, KML, KMZ, GeoJSON oder SHP.</td></tr>
            <tr><td><b>Farbfeld</b></td><td>Anklicken, um die Farbe des Tracks zu ändern — Palette mit 16 Farben.</td></tr>
            <tr><td><b>pts</b></td><td>Anzahl der gezeichneten Punkte (max. 3.000, bei Bedarf unterabgetastet).</td></tr>
            <tr><td><b>err</b></td><td>✅ wenn kein Fehler — sonst ⚠️ + Anzahl (für Details mit der Maus darüberfahren).</td></tr>
            <tr><td><b>🎯</b></td><td>Zentriert die Karte im optimalen Zoom auf die Ausdehnung des Tracks.</td></tr>
            <tr><td><b>🗑</b></td><td>Entfernt diesen Track (bzw. alle Tracks der Datei in der übergeordneten Zeile).</td></tr>
            </table>
            <p style="margin-top:6px"><b>Shapefile:</b> ein ZIP bereitstellen, das mindestens <code>.shp</code>, <code>.dbf</code> und <code>.shx</code> enthält. Eine <code>.prj</code>-Datei wird für die automatische Umprojektion empfohlen (Lambert 93, UTM…). Ohne <code>.prj</code> wird WGS84 angenommen.</p>
            <p><b>Track-Ebene</b> (Auswahlleiste): sichtbar, sobald eine Datei geladen ist — globales Häkchen zum Ein-/Ausblenden aller Ebenen.</p>
            <p><b>Einschränkung:</b> reine Anzeigeebene. Keine automatische Segmentauswahl — die Auswahl erfolgt weiterhin manuell in WME.</p>`, es:`
            <p>Superpone una o varias trazas (GPX, KML, KMZ, GeoJSON, Shapefile ZIP) sobre el mapa de WME para facilitar la identificación de los segmentos a cerrar.</p>
            <p><b>Carga:</b> haz clic en la zona o arrastra y suelta un archivo. Se pueden cargar varios archivos y formatos a la vez — las capas se acumulan.</p>
            <table class="wct-help-table">
            <tr><td><b>📄 Archivo</b></td><td>Fila principal: representa el archivo cargado. La casilla activa o desactiva todas sus trazas. 🗑 elimina todas las capas del archivo.</td></tr>
            <tr><td><b>↳ Traza</b></td><td>Fila secundaria: un track GPX, un Placemark KML, una Feature GeoJSON o una geometría Shapefile. Casilla, color y centrado individuales por traza.</td></tr>
            <tr><td><b>Tipo</b></td><td>Formato del archivo de origen: GPX, KML, KMZ, GeoJSON o SHP.</td></tr>
            <tr><td><b>Muestra de color</b></td><td>Haz clic para cambiar el color de la traza — paleta de 16 colores.</td></tr>
            <tr><td><b>pts</b></td><td>Número de puntos trazados (máx. 3.000, submuestreados si es necesario).</td></tr>
            <tr><td><b>err</b></td><td>✅ si no hay errores — ⚠️ + número en caso contrario (pasa el ratón por encima para ver el detalle).</td></tr>
            <tr><td><b>🎯</b></td><td>Centra el mapa en la extensión de la traza con el zoom óptimo.</td></tr>
            <tr><td><b>🗑</b></td><td>Elimina esta traza (o todas las trazas del archivo en la fila principal).</td></tr>
            </table>
            <p style="margin-top:6px"><b>Shapefile:</b> proporciona un ZIP que contenga como mínimo <code>.shp</code>, <code>.dbf</code> y <code>.shx</code>. Se recomienda incluir un archivo <code>.prj</code> para la reproyección automática (Lambert 93, UTM…). Sin <code>.prj</code>, se asume WGS84.</p>
            <p><b>Capa Trazas</b> (barra de selección): visible en cuanto se carga un archivo — casilla global para mostrar u ocultar todas las capas.</p>
            <p><b>Limitación:</b> es solo una capa visual. No hay selección automática de segmentos — la selección sigue siendo manual en WME.</p>`, 'pt-BR':`
            <p>Sobrepõe um ou mais trajetos (GPX, KML, KMZ, GeoJSON, Shapefile ZIP) ao mapa do WME para facilitar a identificação dos segmentos a bloquear.</p>
            <p><b>Carregamento:</b> clique na área ou arraste e solte um arquivo. Vários arquivos e formatos podem ser carregados ao mesmo tempo — as camadas se acumulam.</p>
            <table class="wct-help-table">
            <tr><td><b>📄 Arquivo</b></td><td>Linha pai: representa o arquivo carregado. A caixa de seleção liga/desliga todos os seus trajetos. 🗑 remove todas as camadas do arquivo.</td></tr>
            <tr><td><b>↳ Trajeto</b></td><td>Linha filha: um track GPX, um Placemark KML, uma Feature GeoJSON ou uma geometria Shapefile. Caixa de seleção, cor e foco individuais por trajeto.</td></tr>
            <tr><td><b>Type</b></td><td>Formato do arquivo de origem: GPX, KML, KMZ, GeoJSON ou SHP.</td></tr>
            <tr><td><b>Amostra de cor</b></td><td>Clique para mudar a cor do trajeto — paleta de 16 cores.</td></tr>
            <tr><td><b>pts</b></td><td>Número de pontos traçados (máx. 3.000, subamostrados se necessário).</td></tr>
            <tr><td><b>err</b></td><td>✅ se não houver erro — ⚠️ + quantidade caso contrário (passe o mouse para ver os detalhes).</td></tr>
            <tr><td><b>🎯</b></td><td>Centraliza o mapa na extensão do trajeto, no zoom ideal.</td></tr>
            <tr><td><b>🗑</b></td><td>Remove este trajeto (ou todos os trajetos do arquivo, na linha pai).</td></tr>
            </table>
            <p style="margin-top:6px"><b>Shapefile:</b> forneça um ZIP contendo no mínimo <code>.shp</code>, <code>.dbf</code> e <code>.shx</code>. Um arquivo <code>.prj</code> é recomendado para a reprojeção automática (Lambert 93, UTM…). Sem <code>.prj</code>, presume-se WGS84.</p>
            <p><b>Camada Trajetos</b> (barra de seleção): visível assim que um arquivo é carregado — caixa de seleção global para exibir/ocultar todas as camadas de uma vez.</p>
            <p><b>Limitação:</b> camada apenas visual. Nenhuma seleção automática de segmentos — a seleção continua manual no WME.</p>`, 'pt-PT':`
            <p>Sobrepõe um ou vários trajetos (GPX, KML, KMZ, GeoJSON, Shapefile ZIP) ao mapa do WME para ajudar a identificar os segmentos a cortar.</p>
            <p><b>Carregamento:</b> clique na zona de largada ou arraste e largue um ficheiro. É possível carregar vários ficheiros e formatos em simultâneo — as camadas acumulam-se.</p>
            <table class="wct-help-table">
            <tr><td><b>📄 Ficheiro</b></td><td>Linha principal: representa o ficheiro carregado. A caixa de verificação ativa/desativa todos os seus trajetos. 🗑 remove todas as camadas do ficheiro.</td></tr>
            <tr><td><b>↳ Trajeto</b></td><td>Linha secundária: um track GPX, um Placemark KML, uma Feature GeoJSON ou uma geometria Shapefile. Caixa de verificação, cor e centragem individuais para cada trajeto.</td></tr>
            <tr><td><b>Type</b></td><td>Formato do ficheiro de origem: GPX, KML, KMZ, GeoJSON ou SHP.</td></tr>
            <tr><td><b>Amostra de cor</b></td><td>Clique para mudar a cor do trajeto — paleta de 16 cores.</td></tr>
            <tr><td><b>pts</b></td><td>Número de pontos traçados (máx. 3 000, subamostrados se necessário).</td></tr>
            <tr><td><b>err</b></td><td>✅ se não houver erros — caso contrário ⚠️ + número (passe o rato por cima para ver os detalhes).</td></tr>
            <tr><td><b>🎯</b></td><td>Centra o mapa na extensão do trajeto, no zoom ideal.</td></tr>
            <tr><td><b>🗑</b></td><td>Remove este trajeto (ou todos os trajetos do ficheiro, na linha principal).</td></tr>
            </table>
            <p style="margin-top:6px"><b>Shapefile:</b> forneça um ZIP que contenha, no mínimo, <code>.shp</code>, <code>.dbf</code> e <code>.shx</code>. Recomenda-se um ficheiro <code>.prj</code> para a reprojeção automática (Lambert 93, UTM…). Sem <code>.prj</code>, assume-se WGS84.</p>
            <p><b>Camada Trajetos</b> (barra de seleção): visível assim que um ficheiro é carregado — caixa de verificação global para mostrar/ocultar todas as camadas de uma só vez.</p>
            <p><b>Limitação:</b> apenas camada visual. Sem seleção automática de segmentos — a seleção continua a ser manual no WME.</p>` }) },
        { id:'h9', title:t('helpH9'), body: _L({ fr:`
            <p>Recherche les <b>fermetures déjà existantes</b> chargées dans la vue courante et sélectionne les segments correspondants. Utile pour retrouver toutes les fermetures d'un événement, ou vérifier ce qui est actif sur une période.</p>
            <table class="wct-help-table">
            <tr><td><b>État</b></td><td>Cases à cocher des statuts de fermeture à inclure. <b>Tous</b> coche/décoche l'ensemble. Décocher une case décoche aussi Tous.</td></tr>
            <tr><td><b>Fenêtre temporelle</b></td><td>Bornes optionnelles sur la date de début et de fin des fermetures. Une borne vide est ignorée. Toutes les bornes renseignées sont cumulées (ET).</td></tr>
            <tr><td><b>Description contient</b></td><td>Filtre les fermetures dont le libellé contient le texte (insensible à la casse).</td></tr>
            <tr><td><b>ET / OU</b></td><td>Combinaison entre Description et Événement MTE. <b>ET</b> : les deux doivent correspondre. <b>OU</b> : au moins un.</td></tr>
            <tr><td><b>Événement MTE contient</b></td><td>Filtre par nom d'événement MTE (recherche « like », insensible à la casse). Ex : « Mans » remonte « 24H Le Mans », « LeMans Classic »…</td></tr>
            <tr><td><b>Rechercher</b></td><td>Lance la recherche. Tous les segments trouvés sont sélectionnés sur la carte.</td></tr>
            <tr><td><b>Effacer</b></td><td>Réinitialise tous les critères et les résultats.</td></tr>
            <tr><td><b>\u2699 Basculer vers Configurer</b></td><td>Bascule vers l'onglet Configurer en conservant la sélection, pour enchaîner la création de fermetures.</td></tr>
            <tr><td><b>\uD83C\uDFAF</b></td><td>Centre la carte sur le segment, positionné dans la zone visible à gauche de l'overlay.</td></tr>
            <tr><td><b>Description</b></td><td>Libellé(s) de la ou des fermetures du segment. Plusieurs descriptions distinctes sont affichées l'une sous l'autre.</td></tr>
            <tr><td><b>MTE</b></td><td>Nom de l'événement associé. Si l'événement n'est pas chargé en mémoire, seul son <b>identifiant</b> s'affiche (en orange) — ouvrez l'onglet Événements de WME pour charger les noms, puis relancez la recherche.</td></tr>
            <tr><td><b>En-têtes de colonnes</b></td><td>Cliquez pour trier (croissant, puis décroissant au 2e clic).</td></tr>
            </table>
            <p style="margin-top:6px"><b>Limites :</b> seules les fermetures <b>chargées dans la vue courante</b> sont analysées (dézoomez/recadrez pour élargir). Les segments référencés par une fermeture mais non chargés sont ignorés. La <b>suppression</b> de fermetures n'est pas possible (non exposée par le SDK WME).</p>`, en:`
            <p>Searches <b>existing closures</b> loaded in the current view and selects the matching segments. Useful to find all closures of an event, or to check what is active over a period.</p>
            <table class="wct-help-table">
            <tr><td><b>Status</b></td><td>Checkboxes for the closure statuses to include. <b>All</b> checks/unchecks everything. Unchecking one also unchecks All.</td></tr>
            <tr><td><b>Time window</b></td><td>Optional bounds on closure start and end dates. An empty bound is ignored. All set bounds are combined (AND).</td></tr>
            <tr><td><b>Description contains</b></td><td>Filters closures whose label contains the text (case-insensitive).</td></tr>
            <tr><td><b>AND / OR</b></td><td>Combination between Description and MTE event. <b>AND</b>: both must match. <b>OR</b>: at least one.</td></tr>
            <tr><td><b>MTE event contains</b></td><td>Filters by MTE event name ("like" search, case-insensitive). E.g. "Mans" matches "24H Le Mans", "LeMans Classic"…</td></tr>
            <tr><td><b>Search</b></td><td>Runs the search. All found segments are selected on the map.</td></tr>
            <tr><td><b>Clear</b></td><td>Resets all criteria and results.</td></tr>
            <tr><td><b>\u2699 Switch to Configure</b></td><td>Switches to the Configure tab keeping the selection, to chain closure creation.</td></tr>
            <tr><td><b>\uD83C\uDFAF</b></td><td>Centers the map on the segment, positioned in the visible area left of the overlay.</td></tr>
            <tr><td><b>Description</b></td><td>Label(s) of the segment's closure(s). Multiple distinct descriptions are shown stacked.</td></tr>
            <tr><td><b>MTE</b></td><td>Associated event name. If the event is not loaded in memory, only its <b>ID</b> is shown (in orange) — open the WME Events tab to load names, then run the search again.</td></tr>
            <tr><td><b>Column headers</b></td><td>Click to sort (ascending, then descending on 2nd click).</td></tr>
            </table>
            <p style="margin-top:6px"><b>Limits:</b> only closures <b>loaded in the current view</b> are analyzed (zoom out/pan to widen). Segments referenced by a closure but not loaded are ignored. Closure <b>deletion</b> is not possible (not exposed by the WME SDK).</p>`, de:`
            <p>Durchsucht die <b>bereits bestehenden Sperrungen</b>, die in der aktuellen Ansicht geladen sind, und wählt die zugehörigen Segmente aus. Nützlich, um alle Sperrungen eines Ereignisses wiederzufinden oder zu prüfen, was in einem Zeitraum aktiv ist.</p>
            <table class="wct-help-table">
            <tr><td><b>Status</b></td><td>Kontrollkästchen für die einzubeziehenden Sperrungsstatus. <b>Alle</b> setzt bzw. entfernt alle Häkchen. Wird ein einzelnes Häkchen entfernt, wird auch Alle abgewählt.</td></tr>
            <tr><td><b>Zeitfenster</b></td><td>Optionale Grenzen für Beginn und Ende der Sperrungen. Eine leere Grenze wird ignoriert. Alle gesetzten Grenzen werden kombiniert (UND).</td></tr>
            <tr><td><b>Beschreibung enthält</b></td><td>Filtert Sperrungen, deren Bezeichnung den Text enthält (Groß-/Kleinschreibung wird ignoriert).</td></tr>
            <tr><td><b>UND / ODER</b></td><td>Verknüpfung von Beschreibung und MTE-Ereignis. <b>UND</b>: beide müssen passen. <b>ODER</b>: mindestens eines.</td></tr>
            <tr><td><b>MTE-Ereignis enthält</b></td><td>Filtert nach dem Namen des MTE-Ereignisses („like“-Suche, Groß-/Kleinschreibung wird ignoriert). Beispiel: „Mans“ findet „24H Le Mans“, „LeMans Classic“…</td></tr>
            <tr><td><b>Suchen</b></td><td>Startet die Suche. Alle gefundenen Segmente werden auf der Karte ausgewählt.</td></tr>
            <tr><td><b>Zurücksetzen</b></td><td>Setzt alle Kriterien und Ergebnisse zurück.</td></tr>
            <tr><td><b>⚙ Zu Einrichten wechseln</b></td><td>Wechselt unter Beibehaltung der Auswahl zum Reiter Einrichten, um direkt Sperrungen anzulegen.</td></tr>
            <tr><td><b>🎯</b></td><td>Zentriert die Karte auf das Segment, versetzt in den sichtbaren Bereich links neben dem Overlay.</td></tr>
            <tr><td><b>Beschreibung</b></td><td>Bezeichnung(en) der Sperrung(en) des Segments. Mehrere unterschiedliche Beschreibungen werden untereinander angezeigt.</td></tr>
            <tr><td><b>MTE</b></td><td>Name des zugehörigen Ereignisses. Ist das Ereignis nicht im Speicher geladen, wird nur seine <b>ID</b> angezeigt (in Orange) — öffne den WME-Reiter Ereignisse, um die Namen zu laden, und starte die Suche erneut.</td></tr>
            <tr><td><b>Spaltenköpfe</b></td><td>Zum Sortieren anklicken (aufsteigend, beim 2. Klick absteigend).</td></tr>
            </table>
            <p style="margin-top:6px"><b>Grenzen:</b> Es werden nur die <b>in der aktuellen Ansicht geladenen</b> Sperrungen ausgewertet (herauszoomen/schwenken, um den Bereich zu erweitern). Segmente, auf die eine Sperrung verweist, die aber nicht geladen sind, werden übergangen. Das <b>Löschen</b> von Sperrungen ist nicht möglich (vom WME-SDK nicht bereitgestellt).</p>`, es:`
            <p>Busca los <b>cierres ya existentes</b> cargados en la vista actual y selecciona los segmentos correspondientes. Útil para localizar todos los cierres de un evento o comprobar qué está activo durante un periodo.</p>
            <table class="wct-help-table">
            <tr><td><b>Estado</b></td><td>Casillas de los estados de cierre que se incluyen. <b>Todos</b> marca o desmarca el conjunto. Al desmarcar una casilla, también se desmarca Todos.</td></tr>
            <tr><td><b>Ventana temporal</b></td><td>Límites opcionales sobre la fecha de inicio y de fin de los cierres. Un límite vacío se ignora. Todos los límites indicados se acumulan (Y).</td></tr>
            <tr><td><b>La descripción contiene</b></td><td>Filtra los cierres cuya descripción contiene el texto (sin distinguir mayúsculas).</td></tr>
            <tr><td><b>Y / O</b></td><td>Combinación entre Descripción y evento MTE. <b>Y</b>: ambos deben coincidir. <b>O</b>: basta con uno.</td></tr>
            <tr><td><b>El evento MTE contiene</b></td><td>Filtra por nombre de evento MTE (búsqueda tipo «like», sin distinguir mayúsculas). Ej.: «Mans» devuelve «24H Le Mans», «LeMans Classic»…</td></tr>
            <tr><td><b>Buscar</b></td><td>Lanza la búsqueda. Todos los segmentos encontrados quedan seleccionados en el mapa.</td></tr>
            <tr><td><b>Borrar</b></td><td>Restablece todos los criterios y los resultados.</td></tr>
            <tr><td><b>⚙ Cambiar a Configurar</b></td><td>Cambia a la pestaña Configurar conservando la selección, para encadenar la creación de cierres.</td></tr>
            <tr><td><b>🎯</b></td><td>Centra el mapa en el segmento, colocado en la zona visible a la izquierda del panel.</td></tr>
            <tr><td><b>Descripción</b></td><td>Descripción o descripciones de los cierres del segmento. Varias descripciones distintas se muestran una debajo de otra.</td></tr>
            <tr><td><b>MTE</b></td><td>Nombre del evento asociado. Si el evento no está cargado en memoria, solo se muestra su <b>ID</b> (en naranja) — abre la pestaña Eventos de WME para cargar los nombres y vuelve a lanzar la búsqueda.</td></tr>
            <tr><td><b>Encabezados de columna</b></td><td>Haz clic para ordenar (ascendente y, al segundo clic, descendente).</td></tr>
            </table>
            <p style="margin-top:6px"><b>Límites:</b> solo se analizan los cierres <b>cargados en la vista actual</b> (aleja el zoom o desplaza el mapa para ampliarla). Los segmentos referenciados por un cierre pero no cargados se ignoran. <b>No es posible eliminar</b> cierres (el SDK de WME no lo permite).</p>`, 'pt-BR':`
            <p>Busca os <b>bloqueios já existentes</b> carregados na visualização atual e seleciona os segmentos correspondentes. Útil para reencontrar todos os bloqueios de um evento ou verificar o que está ativo em um período.</p>
            <table class="wct-help-table">
            <tr><td><b>Status</b></td><td>Caixas de seleção dos status de bloqueio a incluir. <b>Todos</b> marca/desmarca tudo. Desmarcar uma caixa também desmarca Todos.</td></tr>
            <tr><td><b>Janela de tempo</b></td><td>Limites opcionais para as datas de início e de fim dos bloqueios. Um limite vazio é ignorado. Todos os limites informados são combinados (E).</td></tr>
            <tr><td><b>Descrição contém</b></td><td>Filtra os bloqueios cujo rótulo contém o texto (sem diferenciar maiúsculas de minúsculas).</td></tr>
            <tr><td><b>E / OU</b></td><td>Combinação entre Descrição e evento MTE. <b>E</b>: os dois devem corresponder. <b>OU</b>: basta um deles.</td></tr>
            <tr><td><b>Evento MTE contém</b></td><td>Filtra pelo nome do evento MTE (busca do tipo "like", sem diferenciar maiúsculas de minúsculas). Ex.: "Mans" encontra "24H Le Mans", "LeMans Classic"…</td></tr>
            <tr><td><b>Buscar</b></td><td>Executa a busca. Todos os segmentos encontrados são selecionados no mapa.</td></tr>
            <tr><td><b>Limpar</b></td><td>Redefine todos os critérios e resultados.</td></tr>
            <tr><td><b>⚙ Ir para Configurar</b></td><td>Vai para a aba Configurar mantendo a seleção, para já criar bloqueios em seguida.</td></tr>
            <tr><td><b>🎯</b></td><td>Centraliza o mapa no segmento, posicionado na área visível à esquerda do painel.</td></tr>
            <tr><td><b>Descrição</b></td><td>Rótulo(s) do(s) bloqueio(s) do segmento. Várias descrições distintas são exibidas uma abaixo da outra.</td></tr>
            <tr><td><b>MTE</b></td><td>Nome do evento associado. Se o evento não estiver carregado na memória, apenas o <b>ID</b> é exibido (em laranja) — abra a aba Eventos do WME para carregar os nomes e refaça a busca.</td></tr>
            <tr><td><b>Cabeçalhos de coluna</b></td><td>Clique para ordenar (crescente e, no 2º clique, decrescente).</td></tr>
            </table>
            <p style="margin-top:6px"><b>Limites:</b> somente os bloqueios <b>carregados na visualização atual</b> são analisados (afaste o zoom/mova o mapa para ampliar). Segmentos referenciados por um bloqueio mas não carregados são ignorados. A <b>exclusão</b> de bloqueios não é possível (não exposta pelo SDK do WME).</p>`, 'pt-PT':`
            <p>Pesquisa os <b>cortes já existentes</b> carregados na vista atual e seleciona os segmentos correspondentes. Útil para encontrar todos os cortes de um evento ou para verificar o que está ativo num determinado período.</p>
            <table class="wct-help-table">
            <tr><td><b>Estado</b></td><td>Caixas de verificação dos estados de corte a incluir. <b>Todos</b> marca/desmarca tudo. Desmarcar uma caixa desmarca também Todos.</td></tr>
            <tr><td><b>Janela temporal</b></td><td>Limites opcionais para as datas de início e de fim dos cortes. Um limite vazio é ignorado. Todos os limites definidos são combinados (E).</td></tr>
            <tr><td><b>Descrição contém</b></td><td>Filtra os cortes cuja designação contém o texto (sem distinguir maiúsculas de minúsculas).</td></tr>
            <tr><td><b>E / OU</b></td><td>Combinação entre Descrição e evento MTE. <b>E</b>: ambos têm de corresponder. <b>OU</b>: pelo menos um.</td></tr>
            <tr><td><b>Evento MTE contém</b></td><td>Filtra pelo nome do evento MTE (pesquisa do tipo «like», sem distinguir maiúsculas de minúsculas). Ex.: «Mans» encontra «24H Le Mans», «LeMans Classic»…</td></tr>
            <tr><td><b>Pesquisar</b></td><td>Executa a pesquisa. Todos os segmentos encontrados são selecionados no mapa.</td></tr>
            <tr><td><b>Limpar</b></td><td>Repõe todos os critérios e resultados.</td></tr>
            <tr><td><b>⚙ Mudar para Configurar</b></td><td>Muda para o separador Configurar mantendo a seleção, para criar cortes de seguida.</td></tr>
            <tr><td><b>🎯</b></td><td>Centra o mapa no segmento, posicionado na área visível à esquerda do painel.</td></tr>
            <tr><td><b>Descrição</b></td><td>Designação(ões) do(s) corte(s) do segmento. Várias descrições distintas são apresentadas umas por baixo das outras.</td></tr>
            <tr><td><b>MTE</b></td><td>Nome do evento associado. Se o evento não estiver carregado em memória, apenas é apresentado o seu <b>ID</b> (a laranja) — abra o separador Eventos do WME para carregar os nomes e repita a pesquisa.</td></tr>
            <tr><td><b>Cabeçalhos das colunas</b></td><td>Clique para ordenar (ascendente e, no 2.º clique, descendente).</td></tr>
            </table>
            <p style="margin-top:6px"><b>Limites:</b> apenas são analisados os cortes <b>carregados na vista atual</b> (afaste o zoom/desloque o mapa para alargar). Os segmentos referenciados por um corte mas não carregados são ignorados. A <b>eliminação</b> de cortes não é possível (não é disponibilizada pelo SDK do WME).</p>` }) },
        { id:'h10', title:t('helpH10'), body: _L({ fr:`
            <p>Une trace qui dépasse une vue (~4,5 km) est automatiquement <b>découpée en lots</b>, affichés en sous-lignes sous la trace. On les traite un par un :</p>
            <table class="wct-help-table">
            <tr><td><b>🧲</b></td><td>Sélectionne les segments du lot — la carte se déplace pour tout charger (c'est normal) — puis bascule sur <b>Configurer</b>.</td></tr>
            <tr><td><b>Valider</b></td><td>Ajoute le lot à la file, le marque <b>✅ configuré</b>, revient aux Tracés et pointe le lot suivant.</td></tr>
            <tr><td><b>👁</b></td><td>Recadre la carte sur le lot.</td></tr>
            <tr><td><b>🔗</b></td><td>Après sélection : copie un permalien pour retrouver la sélection du lot.</td></tr>
            <tr><td><b>▶ Appliquer</b></td><td>Pose les fermetures : la carte se recadre sur chaque lot, avec une pause « Continuer » entre les lots.</td></tr>
            <tr><td><b>📥</b></td><td>Exporte les lots configurés de la trace en CSV (format WME Advanced Closures).</td></tr>
            </table>
            <p style="margin-top:6px">Le calque <b>Fermetures</b> de WME est activé automatiquement à l'ouverture du panneau (pour détecter les chevauchements) et remis dans son état d'origine à la fermeture. Une trace courte, qui tient dans une vue, n'est pas découpée : le 🧲 de la trace la sélectionne d'un seul coup.</p>`, en:`
            <p>A track that exceeds one view (~4.5 km) is automatically <b>split into batches</b>, shown as sub-rows under the track. You handle them one by one:</p>
            <table class="wct-help-table">
            <tr><td><b>🧲</b></td><td>Selects the batch's segments — the map moves to load everything (this is normal) — then switches to <b>Configure</b>.</td></tr>
            <tr><td><b>Validate</b></td><td>Adds the batch to the queue, marks it <b>✅ configured</b>, returns to Tracks and points to the next batch.</td></tr>
            <tr><td><b>👁</b></td><td>Centers the map on the batch.</td></tr>
            <tr><td><b>🔗</b></td><td>After selection: copies a permalink to restore the batch selection.</td></tr>
            <tr><td><b>▶ Apply</b></td><td>Creates the closures: the map re-centers on each batch, pausing on “Continue” between batches.</td></tr>
            <tr><td><b>📥</b></td><td>Exports the track's configured batches to CSV (WME Advanced Closures format).</td></tr>
            </table>
            <p style="margin-top:6px">WME's <b>Closures</b> layer is enabled automatically when the panel opens (to detect overlaps) and restored to its original state on close. A short track that fits in one view is not split: the track's 🧲 selects it all at once.</p>`, de:`
            <p>Ein Track, der über eine Ansicht hinausgeht (~4,5 km), wird automatisch <b>in Pakete aufgeteilt</b>, die als Unterzeilen unter dem Track erscheinen. Man bearbeitet sie einzeln:</p>
            <table class="wct-help-table">
            <tr><td><b>🧲</b></td><td>Wählt die Segmente des Pakets aus — die Karte bewegt sich, um alles zu laden (das ist normal) — und wechselt dann zu <b>Einrichten</b>.</td></tr>
            <tr><td><b>Bestätigen</b></td><td>Fügt das Paket zur Warteschlange hinzu, markiert es als <b>✅ konfiguriert</b>, kehrt zu Tracks zurück und zeigt auf das nächste Paket.</td></tr>
            <tr><td><b>👁</b></td><td>Zentriert die Karte auf das Paket.</td></tr>
            <tr><td><b>🔗</b></td><td>Nach der Auswahl: kopiert einen Permalink, um die Auswahl des Pakets wiederherzustellen.</td></tr>
            <tr><td><b>▶ Anwenden</b></td><td>Erstellt die Sperrungen: die Karte zentriert sich auf jedes Paket, mit einer Pause „Weiter“ zwischen den Paketen.</td></tr>
            <tr><td><b>📥</b></td><td>Exportiert die konfigurierten Pakete des Tracks als CSV (Format WME Advanced Closures).</td></tr>
            </table>
            <p style="margin-top:6px">Der Kartenlayer <b>Sperrungen</b> von WME wird beim Öffnen des Panels automatisch aktiviert (zur Erkennung von Überschneidungen) und beim Schließen zurückgesetzt. Ein kurzer Track, der in eine Ansicht passt, wird nicht aufgeteilt: das 🧲 des Tracks wählt ihn auf einmal aus.</p>`, es:`
            <p>Una traza que supera una vista (~4,5 km) se <b>divide automáticamente en lotes</b>, mostrados como subfilas bajo la traza. Se tratan uno a uno:</p>
            <table class="wct-help-table">
            <tr><td><b>🧲</b></td><td>Selecciona los segmentos del lote — el mapa se desplaza para cargarlo todo (es normal) — y luego cambia a <b>Configurar</b>.</td></tr>
            <tr><td><b>Validar</b></td><td>Añade el lote a la cola, lo marca <b>✅ configurado</b>, vuelve a Trazas y apunta al siguiente lote.</td></tr>
            <tr><td><b>👁</b></td><td>Centra el mapa en el lote.</td></tr>
            <tr><td><b>🔗</b></td><td>Tras la selección: copia un permalink para recuperar la selección del lote.</td></tr>
            <tr><td><b>▶ Aplicar</b></td><td>Crea los cierres: el mapa se recentra en cada lote, con una pausa «Continuar» entre lotes.</td></tr>
            <tr><td><b>📥</b></td><td>Exporta los lotes configurados de la traza a CSV (formato WME Advanced Closures).</td></tr>
            </table>
            <p style="margin-top:6px">La capa <b>Cierres</b> de WME se activa automáticamente al abrir el panel (para detectar solapamientos) y se restaura a su estado original al cerrar. Una traza corta que cabe en una vista no se divide: el 🧲 de la traza la selecciona de una vez.</p>`, 'pt-BR':`
            <p>Um trajeto que ultrapassa uma visualização (~4,5 km) é <b>dividido automaticamente em lotes</b>, mostrados como sublinhas sob o trajeto. Você trata um por um:</p>
            <table class="wct-help-table">
            <tr><td><b>🧲</b></td><td>Seleciona os segmentos do lote — o mapa se move para carregar tudo (é normal) — e depois muda para <b>Configurar</b>.</td></tr>
            <tr><td><b>Validar</b></td><td>Adiciona o lote à fila, marca como <b>✅ configurado</b>, volta para Trajetos e aponta o próximo lote.</td></tr>
            <tr><td><b>👁</b></td><td>Centraliza o mapa no lote.</td></tr>
            <tr><td><b>🔗</b></td><td>Após a seleção: copia um permalink para recuperar a seleção do lote.</td></tr>
            <tr><td><b>▶ Aplicar</b></td><td>Cria os bloqueios: o mapa recentraliza em cada lote, com uma pausa «Continuar» entre os lotes.</td></tr>
            <tr><td><b>📥</b></td><td>Exporta os lotes configurados do trajeto em CSV (formato WME Advanced Closures).</td></tr>
            </table>
            <p style="margin-top:6px">A camada <b>Bloqueios</b> do WME é ativada automaticamente ao abrir o painel (para detectar sobreposições) e restaurada ao estado original ao fechar. Um trajeto curto que cabe em uma visualização não é dividido: o 🧲 do trajeto seleciona tudo de uma vez.</p>`, 'pt-PT':`
            <p>Um trajeto que ultrapassa uma vista (~4,5 km) é <b>dividido automaticamente em lotes</b>, apresentados como sublinhas sob o trajeto. Trata-se um a um:</p>
            <table class="wct-help-table">
            <tr><td><b>🧲</b></td><td>Seleciona os segmentos do lote — o mapa desloca-se para carregar tudo (é normal) — e depois muda para <b>Configurar</b>.</td></tr>
            <tr><td><b>Validar</b></td><td>Adiciona o lote à fila, marca-o como <b>✅ configurado</b>, volta aos Trajetos e aponta o lote seguinte.</td></tr>
            <tr><td><b>👁</b></td><td>Centra o mapa no lote.</td></tr>
            <tr><td><b>🔗</b></td><td>Após a seleção: copia um permalink para recuperar a seleção do lote.</td></tr>
            <tr><td><b>▶ Aplicar</b></td><td>Cria os cortes: o mapa volta a centrar-se em cada lote, com uma pausa «Continuar» entre os lotes.</td></tr>
            <tr><td><b>📥</b></td><td>Exporta os lotes configurados do trajeto em CSV (formato WME Advanced Closures).</td></tr>
            </table>
            <p style="margin-top:6px">A camada <b>Cortes</b> do WME é ativada automaticamente ao abrir o painel (para detetar sobreposições) e reposta no estado original ao fechar. Um trajeto curto que cabe numa vista não é dividido: o 🧲 do trajeto seleciona tudo de uma vez.</p>` }) },
    ];
    return sections.map(s => `
        <div class="wct-help-section">
            <div class="wct-help-hdr${s.open?' on':''}" data-help="${s.id}">${s.title} <span>${s.open?'&#x25BC;':'&#x25B6;'}</span></div>
            <div class="wct-help-body" id="${s.id}" style="${s.open?'':'display:none'}">${s.body}</div>
        </div>`).join('')
    + `<div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--wct-border);font-size:0.917em;color:var(--wct-text2);text-align:center">
        \uD83D\uDCAC <a href="https://www.waze.com/discuss/t/script-wme-closures-toolkit/405542" target="_blank" style="color:var(--wct-blue)">${_L({fr:'Fil Discuss', en:'Discuss thread', de:'Discuss-Thread', es:'Hilo Discuss', 'pt-BR':'Tópico Discuss', 'pt-PT':'Tópico Discuss'})}</a> &nbsp;·&nbsp; \uD83D\uDD17 <a href="https://greasyfork.org/fr/scripts/581015-wme-closures-toolkit" target="_blank" style="color:var(--wct-blue)">GreasyFork</a>
    </div>`;
};


// ═══════════════════════════════════════════════════════════════════════════
//  UTILS
// ═══════════════════════════════════════════════════════════════════════════
const log  = (m,o) => o?console.debug(`[WCT] ${m}`,o):console.log(`[WCT] ${m}`);
const $id  = id => document.getElementById(id);
const make = (tag, attrs={}) => {
    const el=document.createElement(tag);
    Object.entries(attrs).forEach(([k,v])=>{
        if(k==='className')el.className=v;
        else if(k==='html')el.innerHTML=v;
        else if(k==='text')el.textContent=v;
        else el.setAttribute(k,v);
    });
    return el;
};
const pad=n=>String(n).padStart(2,'0');
const isValidDate=d=>Object.prototype.toString.call(d)==='[object Date]'&&!isNaN(d.getTime());
// Échappement HTML — toute donnée externe (noms de fichiers/tracés, libellés, CSV) injectée via innerHTML doit passer par ici
const escHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// dateToUTCStr : format pour l'export CSV — lit en local car timestamps construits via new Date(y,m,d,h,min)
const dateToUTCStr=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
// dateToLocalStr : affichage de l'heure "locale" — les dates FAB sont stockées décalées donc on lit en UTC
const dateToLocalStr=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
// formatDateDisplay : formate une JDate pour l'affichage selon _dateFormat
// Retourne ex: "24/05 21:00" (dmy), "05/24 21:00" (mdy), "2024-05-24 21:00" (iso)
const formatDateDisplay=d=>{
    const Y=d.getFullYear(),M=pad(d.getMonth()+1),D=pad(d.getDate());
    const hm=`${pad(d.getHours())}:${pad(d.getMinutes())}`;
    if(_dateFormat==='mdy') return `${M}/${D}/${Y} ${hm}`;
    if(_dateFormat==='iso') return `${Y}-${M}-${D} ${hm}`;
    return `${D}/${M}/${Y} ${hm}`; // dmy par défaut
};

// ─── DST-safe date builder ──────────────────────────────────────────────────
// Construit une date "baseDate + dayOffset jours, à localHour:localMin heure locale".
// Utilise new Date(y,m,d,h,min) — le seul constructeur JS opérant en heure locale —
// ce qui garantit la correction DST automatique pour toutes les dates futures,
// tous les fuseaux (y compris UTC+5:30, UTC+3:30…) et tous les changements d'heure,
// sans aucune table de règles en dur. Le moteur JS délègue au TZ du système.
//
// ATTENTION : new Date('YYYY-MM-DD') parse en UTC minuit → getDate() donnerait J-1
// à l'est d'UTC. On parse donc manuellement pour extraire des composantes locales.
const makeDSTSafeDate=(baseDate,dayOffset,localHour,localMin)=>{
    // Parser YYYY-MM-DD ou Date object en composantes calendaires locales
    let y,m,day;
    if(typeof baseDate==='string'&&/^\d{4}-\d{2}-\d{2}/.test(baseDate)){
        [y,m,day]=[parseInt(baseDate.slice(0,4)),parseInt(baseDate.slice(5,7))-1,parseInt(baseDate.slice(8,10))];
    }else{
        const b=new Date(baseDate);y=b.getFullYear();m=b.getMonth();day=b.getDate();
    }
    // Construire la date locale DST-safe via le constructeur local JS.
    // addClosure applique ensuite valueOf() - tzOffset comme WME Advanced Closures.
    const localDate=new Date(y,m,day+dayOffset,localHour,localMin,0,0);
    return new JDate(localDate);
};
const todayStr=()=>{const d=new Date();return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;};
const MAX_CLOSURES=500;
const download=(data,fn)=>{const a=make('a');a.style.display='none';a.href=encodeURI('data:text/plain,'+data);a.download=fn;document.body.appendChild(a);a.click();document.body.removeChild(a);};
const CSVtoArray=text=>{
    const b=[],re=/(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    text.split('\n').forEach(line=>{
        if(!line.trim())return;const a=[];
        line.replace(re,(m0,m1,m2,m3)=>{if(m1!==undefined)a.push(m1.replace(/\\'/g,"'"));else if(m2!==undefined)a.push(m2.replace(/\\"/g,'"'));else if(m3!==undefined)a.push(m3);return '';});
        if(/,\s*$/.test(line))a.push('');if(a.length)b.push(a);
    });
    return b;
};

// ═══════════════════════════════════════════════════════════════════════════
//  SELECTION — via selectedFeatureIds (confirmé par debug)
// ═══════════════════════════════════════════════════════════════════════════
const getSelection=()=>{
    try {
        const ids=W.selectionManager.selectedFeatureIds;
        if(ids&&ids.length>0){
            const segIds=ids.filter(f=>typeof f==='string'&&f.startsWith('segment:')).map(f=>parseInt(f.replace('segment:','')));
            if(segIds.length>0) return {ids:segIds,objectType:'segment'};
        }
    } catch(e){}
    try {
        const sel=sdk.Editing.getSelection();
        if(sel&&sel.ids&&sel.ids.length>0) return sel;
    } catch(e){}
    return {ids:[],objectType:'none'};
};
const hasSel=()=>{const s=getSelection();return s.ids.length>0&&s.objectType==='segment';};

// ═══════════════════════════════════════════════════════════════════════════
//  WME HELPERS
// ═══════════════════════════════════════════════════════════════════════════
const getSegById=id=>sdk.DataModel.Segments.getById({segmentId:Number(id)});
const getSegName=id=>{
    try{const addr=sdk.DataModel.Segments.getAddress({segmentId:Number(id)});if(addr?.street&&!addr.street.isEmpty)return addr.street.name;}catch(e){}
    return 'No name';
};
const getNodeList=segIds=>{
    const nd={};
    segIds.forEach(id=>{const seg=getSegById(id);if(!seg)return;[seg.fromNodeId,seg.toNodeId].forEach(nid=>{if(nid)nd[nid]=(nd[nid]||0)+1;});});
    return nd;
};
const getExistingClosures=segIds=>{
    try{return sdk.DataModel.RoadClosures.getAll().filter(c=>segIds.map(Number).includes(Number(c.segmentId)));}catch(e){return [];}
};
const dateTimeOverlaps=(a,b)=>new Date(a.startDate)<new Date(b.endDate)&&new Date(a.endDate)>new Date(b.startDate);

// ─── Vérifie la compatibilité sens de circulation / direction de fermeture ──
// Retourne les segments en conflit : [{sid, name, segDirLabel}]
// Tient compte des reversed segments (même logique que addClosure).
const getSegDirConflicts=(segIds,requestedDir)=>{
    if(requestedDir===DIR.TWO) return []; // double sens : toujours compatible
    let revSegs=[];
    try{revSegs=sdk.DataModel.Segments.getReversedSegments({segmentIds:segIds.map(Number)});}catch(e){}
    const conflicts=[];
    for(const sid of segIds){
        const seg=getSegById(sid);
        if(!seg) continue;
        if(seg.isTwoWay) continue; // double sens : toujours OK
        // Résoudre la direction effective pour ce segment (copie de la logique addClosure)
        let effDir=requestedDir;
        for(const r of revSegs){
            if(r.id===Number(sid)){
                effDir=effDir===DIR.AtoB?DIR.BtoA:DIR.AtoB;
                break;
            }
        }
        // Vérifier la compatibilité
        const ok=(effDir===DIR.AtoB && seg.isAtoB)||(effDir===DIR.BtoA && seg.isBtoA);
        if(!ok){
            const segDirLabel=seg.isAtoB?'A \u21D2 B':'B \u21D2 A';
            conflicts.push({sid:Number(sid),name:getSegName(sid),segDirLabel});
        }
    }
    return conflicts;
};

// ─── Construit le permalink WME d'un segment ───────────────────────────────
const getSegPermalink=(sid)=>{
    try{
        const seg=getSegById(sid);
        if(!seg||!seg.geometry) return null;
        const coords=seg.geometry.coordinates;
        const mid=coords[Math.floor(coords.length/2)];
        return `https://www.waze.com/editor?env=row&lon=${mid[0].toFixed(6)}&lat=${mid[1].toFixed(6)}&zoom=17&segments=${sid}`;
    }catch(e){return null;}
};

// ═══════════════════════════════════════════════════════════════════════════
//  PAYS & JOURS FERIES
// ═══════════════════════════════════════════════════════════════════════════
const getSegmentCountry=id=>{
    try{
        const addr=sdk.DataModel.Segments.getAddress({segmentId:Number(id)});
        return addr?.country?.abbr||null;
    }catch(e){return null;}
};

// Cache JF : { 'FR-2026': ['2026-01-01', ...] }
const holidayCache={};

const fetchHolidays=(countryCode,year)=>new Promise(resolve=>{
    const key=countryCode+'-'+year;
    if(holidayCache[key]){resolve(holidayCache[key]);return;}
    GM_xmlhttpRequest({
        method:'GET',
        url:'https://date.nager.at/api/v3/PublicHolidays/'+year+'/'+countryCode,
        timeout:10000,
        onload:resp=>{
            try{
                const data=JSON.parse(resp.responseText);
                const dates=data.map(h=>h.date);
                holidayCache[key]=dates; // succès : mis en cache
                resolve(dates);
            }catch(e){resolve([]);} // réponse invalide : pas de cache, réessai possible plus tard
        },
        onerror:()=>{resolve([]);},   // échec réseau : pas de cache, réessai possible
        ontimeout:()=>{resolve([]);}  // timeout : pas de cache, réessai possible
    });
});

const getHolidaysForRange=async(countryCode,startDate,endDate)=>{
    const ys=new Date(startDate).getFullYear();
    const ye=new Date(endDate).getFullYear();
    const promises=[];
    for(let y=ys;y<=ye;y++) promises.push(fetchHolidays(countryCode,y));
    const results=await Promise.all(promises);
    return results.flat();
};

// ─── Tile build timestamp (flux RSS Waze) ──────────────────────────────────
// Retourne le timestamp UTC du dernier assemblage de tiles publié (ms).
// Mis en cache 30min. En cas d'échec, retourne 0 (pas de filtre).
let _tileBuildCache={ts:0, fetchedAt:0};
const TILE_BUILD_URL='https://storage.googleapis.com/waze-tile-build-public/release-history/intl-feed.xml';
const TILE_BUILD_TTL=30*60*1000; // 30 minutes
const fetchLastTileBuild=()=>new Promise(resolve=>{
    const now=Date.now();
    if(_tileBuildCache.ts>0&&now-_tileBuildCache.fetchedAt<TILE_BUILD_TTL){resolve(_tileBuildCache.ts);return;}
    GM_xmlhttpRequest({
        method:'GET',
        url:TILE_BUILD_URL,
        timeout:10000,
        onload:resp=>{
            try{
                // Parse le premier <published> du premier <entry>
                const m=resp.responseText.match(/<entry[\s\S]*?<published>(.*?)<\/published>/);
                if(m&&m[1]){
                    const ts=new Date(m[1]).getTime();
                    if(!isNaN(ts)){_tileBuildCache={ts,fetchedAt:Date.now()};resolve(ts);return;}
                }
                resolve(0);
            }catch(e){resolve(0);}
        },
        onerror:()=>resolve(0),
        ontimeout:()=>resolve(0),
    });
});


const checkSelectionCountry=segIds=>{
    const countries=[...new Set(segIds.map(getSegmentCountry).filter(Boolean))];
    if(countries.length===0) return {ok:false,country:null,countries:[]};
    if(countries.length>1) return {ok:false,country:null,countries};
    return {ok:true,country:countries[0],countries};
};
const waitMapLoaded=()=>new Promise(resolve=>{
    // _applyAborted coupe l'attente immédiatement : sans cela, un Stop cliqué pendant
    // le chargement de la carte restait sans effet visible jusqu'à 10 s.
    let n=0;const iv=setInterval(()=>{n++;if(_applyAborted||(!sdk.State.isMapLoading()&&(W?.app?.attributes?.pendingOperations?.length||0)===0)||n>100){clearInterval(iv);resolve();}},100);
});

// ═══════════════════════════════════════════════════════════════════════════
//  SAVE / LOAD
// ═══════════════════════════════════════════════════════════════════════════
const save=()=>{try{localStorage.WCT_v1=JSON.stringify({presets,closeNodes,enabled,displayMode:_displayMode,dateFormat:_dateFormat,cardsCollapsedDefault:_cardsCollapsedDefault,langPref:_langPref});}catch(e){}};
const load=()=>{try{if(localStorage.WCT_v1){const d=JSON.parse(localStorage.WCT_v1);presets=d.presets||[];closeNodes=d.closeNodes||NODE_CL.none;enabled=d.enabled!==false;_displayMode=d.displayMode==='compact'?'compact':'normal';if(d.dateFormat&&['dmy','mdy','iso'].includes(d.dateFormat))_dateFormat=d.dateFormat;_cardsCollapsedDefault=d.cardsCollapsedDefault===true;if(d.langPref==='auto'||LANGS.some(x=>x.code===d.langPref))_langPref=d.langPref;}}catch(e){}};

// ═══════════════════════════════════════════════════════════════════════════
//  CLOSURE LIST BUILDER
// ═══════════════════════════════════════════════════════════════════════════
const buildClosureList=async()=>{
    const v=id=>($id(id)?$id(id).value.trim():'');
    const rs=new JDate(v('wct-rangestart')),re=new JDate(v('wct-rangeend'));
    if(!isValidDate(rs))return{list:[],error:t('errDateStart')};
    if(!isValidDate(re))return{list:[],error:'Date de fin invalide'};
    if(re<rs)return{list:[],error:t('errDateEnd')};
    const[stH,stM]=(v('wct-starttime')||'00:00').split(':').map(Number);
    const stMin=(stH||0)*60+(stM||0);
    let dur;
    const modeEnd=$id('wct-mode-end')&&$id('wct-mode-end').style.display!=='none';
    const extraDays=parseInt(v('wct-dur-day'))||0;
    if(modeEnd){
        const[etH,etM]=(v('wct-endtime')||'00:00').split(':').map(Number);
        const etMin=(etH||0)*60+(etM||0);
        const baseDur=etMin>stMin?etMin-stMin:(1440-stMin+etMin);
        dur=baseDur+extraDays*1440;
        if(dur<=0)return{list:[],error:t('errNone')};
    }else{
        const[dH,dM]=(v('wct-dur-time')||'00:00').split(':').map(Number);
        dur=extraDays*1440+(dH||0)*60+(dM||0);
        if(dur<=0)return{list:[],error:t('errNone')};
    }
    const reDT=re.clone().addMinutes(1440);
    const pane=document.querySelector('#wct-body .wct-pane.on');
    const tabId=pane?pane.id:'wct-tab-each';
    const list=[];
    if(tabId==='wct-tab-repeat'){
        const n=parseInt(v('wct-rep-ntimes'));
        if(isNaN(n)||n<1)return{list:[],error:t('errRepeat')};
        const every=parseInt(v('wct-rep-every'))||1;
        const unit=v('wct-rep-unit')||'day';
        const evMin=unit==='day'?every*1440:unit==='hour'?every*60:every;
        if(evMin<=0)return{list:[],error:'Intervalle invalide'};
        if(evMin<dur){
            const warnEl=$id('wct-rep-warn');
            if(warnEl){warnEl.style.display='block';warnEl.textContent='\u26A0\uFE0F L\u2019intervalle ('+evMin+'min) est inférieur à la durée ('+dur+'min) — les fermetures se chevaucheront.';}
        } else {
            const warnEl=$id('wct-rep-warn');if(warnEl)warnEl.style.display='none';
        }
        const first=makeDSTSafeDate(v('wct-rangestart'),0,stH,stM);
        for(let i=0;i<n;i++){
            if(list.length>=MAX_CLOSURES)return{list:[],error:t('errMaxItems',MAX_CLOSURES)};
            const s=first.clone().addMinutes(evMin*i),e=s.clone().addMinutes(dur);if(e>reDT)break;list.push({start:new Date(s),end:new Date(e)});
        }
    }else{
        const dow=[0,1,2,3,4,5,6].map(i=>{const c=document.querySelector(`#wct-body .wct-chip[data-dow="${i}"]`);return c&&c.classList.contains('on');});
        const days=Math.ceil((re-rs+1)/86400000);
        // ── Correctif DST (v0.43) ──────────────────────────────────────────
        // Chaque occurrence est construite à partir de la date calendaire locale
        // du jour j + l'heure de début locale, sans arithmétique brute de minutes.
        // Évite le décalage d'1h sur les occurrences post-changement d'heure.
        for(let d=0;d<days;d++){
            if(list.length>=MAX_CLOSURES)return{list:[],error:t('errMaxItems',MAX_CLOSURES)};
            const s=makeDSTSafeDate(rs,d,stH,stM);
            const localDow=new Date(s.getTime()).getUTCDay(); // jour UTC (cohérent avec timestamp décalé)
            if(!dow[localDow])continue;
            const e=s.clone().addMinutes(dur);
            if(e>reDT)break;
            list.push({start:new Date(s),end:new Date(e)});
        }
    }
    // Filtre jours fériés : 'skip' = sauf JF, 'only' = uniquement JF
    const holidayMode=$id('wct-hol-add')?.checked?'add':$id('wct-hol-only')?.checked?'only':$id('wct-hol-skip')?.checked?'skip':'none';
    if(holidayMode==='none'){
        const warnEl2=$id('wct-holidays-warn');
        if(warnEl2&&!$id('wct-hol-skip')?.disabled) warnEl2.style.display='none';
    }
    if(holidayMode!=='none'&&(list.length>0||holidayMode==='add')){
        const sel=getSelection();
        const cc=checkSelectionCountry(sel.ids);
        if(cc.ok&&cc.country){
            const hols=await getHolidaysForRange(cc.country,list[0].start,list[list.length-1].end);
            const filtered=list.filter(cl=>{
                const d=cl.start;
                const dateStr=`${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}`;
                return holidayMode==='only' ? hols.includes(dateStr) : !hols.includes(dateStr);
            });
            const delta=list.length-filtered.length;
            const warnEl=$id('wct-holidays-warn');
            if(warnEl){
                warnEl.style.display='block';
                if(holidayMode==='skip'){
                    warnEl.textContent=delta>0?t('holidaysExcl',delta):t('holidaysNone');
                }else{
                    warnEl.textContent=filtered.length>0?t('holidaysOnly',filtered.length):t('holidaysOnlyNone');
                }
            }
            if(holidayMode==='add'){
                const rsStr=`${new Date(rs).getFullYear()}-${pad(new Date(rs).getMonth()+1)}-${pad(new Date(rs).getDate())}`;
                const reStr=`${new Date(re).getFullYear()}-${pad(new Date(re).getMonth()+1)}-${pad(new Date(re).getDate())}`;
                const existingDateStrs=new Set(list.map(cl=>{const d=cl.start;return `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}`;}));
                const extra=[];
                for(const h of hols){
                    if(h<rsStr||h>reStr) continue;
                    if(existingDateStrs.has(h)) continue;
                    const s=makeDSTSafeDate(h,0,stH,stM);
                    const e=s.clone().addMinutes(dur);
                    if(e>reDT) continue;
                    extra.push({start:new Date(s),end:new Date(e)});
                }
                const merged=[...list,...extra].sort((a,b)=>a.start-b.start);
                const warnElAdd=$id('wct-holidays-warn');
                if(warnElAdd){warnElAdd.style.display='block';warnElAdd.textContent=extra.length>0?t('holidaysAdded',extra.length):t('holidaysNone');}
                return{list:merged,error:''};
            }
            return{list:filtered,error:''};
        }
    }
    return{list,error:''};
};

// ═══════════════════════════════════════════════════════════════════════════
//  CONFIG READ / APPLY
// ═══════════════════════════════════════════════════════════════════════════
const readConfig=()=>({
    rangestart:$id('wct-rangestart')?.value||'',rangeend:$id('wct-rangeend')?.value||'',
    starttime:$id('wct-starttime')?.value||'21:00',durtime:$id('wct-dur-time')?.value||'08:00',
    durday:$id('wct-dur-day')?.value||'0',endtime:$id('wct-endtime')?.value||'05:00',
    timemode:($id('wct-mode-end')?.style.display!=='none')?'end':'dur',
    reason:$id('wct-reason')?.value||'',
    direction:$id('wct-direction')?.value||'3',ignoretraffic:$id('wct-ignoretraffic')?.checked||false,
    mteId:$id('wct-mtesel')?.value||'',
    holidayMode:($id('wct-hol-add')?.checked?'add':$id('wct-hol-only')?.checked?'only':$id('wct-hol-skip')?.checked?'skip':'none'),
    days:[0,1,2,3,4,5,6].map(i=>{const c=document.querySelector(`#wct-body .wct-chip[data-dow="${i}"]`);return c?.classList.contains('on')||false;}),
    activeTab:document.querySelector('#wct-body .wct-pane.on')?.id||'wct-tab-each',
    repntimes:$id('wct-rep-ntimes')?.value||'1',
    repevery:$id('wct-rep-every')?.value||'1',repunit:$id('wct-rep-unit')?.value||'day',
});
const applyConfig=cfg=>{
    if(!cfg)return;
    const set=(id,v)=>{if($id(id))$id(id).value=v;};
    const chk=(id,v)=>{if($id(id))$id(id).checked=v;};
    set('wct-rangestart',cfg.rangestart);set('wct-rangeend',cfg.rangeend);
    set('wct-starttime',cfg.starttime);set('wct-dur-time',cfg.durtime);set('wct-dur-day',cfg.durday);
    if(cfg.endtime)set('wct-endtime',cfg.endtime);
    if(cfg.timemode){
        localStorage.WCT_timeMode=cfg.timemode;
        const isEnd=cfg.timemode==='end';
        const modeEl=$id('wct-mode-end'),durEl=$id('wct-mode-dur'),btn=$id('wct-time-toggle');
        if(modeEl)modeEl.style.display=isEnd?'':'none';
        if(durEl)durEl.style.display=isEnd?'none':'flex';
        if(btn){ btn.classList.toggle('end',isEnd); }
    }
    set('wct-reason',cfg.reason);set('wct-direction',cfg.direction);chk('wct-ignoretraffic',cfg.ignoretraffic);
    if(cfg.mteId){
        // Tenter de sélectionner l'ID dans le select ; si absent, déclencher un refresh puis réessayer
        const mtesel=$id('wct-mtesel');
        if(mtesel){
            if([...mtesel.options].some(o=>o.value===cfg.mteId)){
                mtesel.value=cfg.mteId;
            } else {
                refreshMTE();
                mtesel.value=cfg.mteId;
            }
        }
    }
    set('wct-rep-ntimes',cfg.repntimes);
    if(cfg.repevery)set('wct-rep-every',cfg.repevery);
    if(cfg.repunit&&$id('wct-rep-unit'))$id('wct-rep-unit').value=cfg.repunit;
    // Compat ascendante : anciens préréglages avec skipHolidays booléen
    const hm=cfg.holidayMode||(cfg.skipHolidays?'skip':'none');
    if($id('wct-hol-skip'))$id('wct-hol-skip').checked=(hm==='skip');
    if($id('wct-hol-only'))$id('wct-hol-only').checked=(hm==='only');
    if($id('wct-hol-add'))$id('wct-hol-add').checked=(hm==='add');
    if(cfg.days)[0,1,2,3,4,5,6].forEach(i=>{const c=document.querySelector(`#wct-body .wct-chip[data-dow="${i}"]`);if(c)c.classList.toggle('on',cfg.days[i]);});
    if(cfg.activeTab){
        document.querySelectorAll('#wct-body .wct-tab').forEach(t=>t.classList.remove('on'));
        document.querySelectorAll('#wct-body .wct-pane').forEach(p=>p.classList.remove('on'));
        $id(cfg.activeTab)?.classList.add('on');
        document.querySelector(`#wct-body .wct-tab[data-target="${cfg.activeTab}"]`)?.classList.add('on');
    }
};

// ═══════════════════════════════════════════════════════════════════════════
//  QUEUE
// ═══════════════════════════════════════════════════════════════════════════
const makeEntry=(segIds,cfg,closures)=>{
    return{segIds,config:cfg,closures,source:'cfg',
        label:cfg.reason||t('defaultClosure'),
        detail:t('entryDetail',segIds.length,closures.length,dirStr(parseInt(cfg.direction)),cfg.starttime)};

};
const renderQueue=()=>{
    const ul=$id('wct-queue-ul'),empty=$id('wct-queue-empty');if(!ul)return;
    ul.innerHTML='';
    // Badge toujours mis à jour, y compris quand la file se vide
    const badge=$id('wct-hdr-badge');
    if(badge) badge.textContent=queue.length>0?t('queueBadge',queue.length):'';
    if(!queue.length){if(empty)empty.style.display='block';updateActionBtns();return;}
    if(empty)empty.style.display='none';
    queue.forEach((entry,i)=>{ ul.appendChild(buildQueueCard(entry,i)); });
    updateActionBtns();
};
const updateActionBtns=()=>{
    const has=queue.length>0;
    ['wct-btn-apply','wct-btn-export','wct-btn-clear'].forEach(id=>$id(id)?.classList.toggle('wct-btn-dis',!has));
};

// ═══════════════════════════════════════════════════════════════════════════
//  MTE
// ═══════════════════════════════════════════════════════════════════════════
const refreshMTE=()=>{
    const sel=$id('wct-mtesel');
    if(!sel) return;
    let events=[];
    try{ events=W.model.majorTrafficEvents.getObjectArray(); }catch(e){}
    const current=sel.value;
    sel.innerHTML='';
    const noneOpt=document.createElement('option');
    noneOpt.value=''; noneOpt.textContent=t(events.length?'mteNone':'mteEmpty');
    sel.appendChild(noneOpt);
    events.forEach(ev=>{
        const id=ev.attributes.id;
        const name=ev.attributes.names?.[0]?.value||ev.attributes.uniqueName||id;
        const opt=document.createElement('option');
        opt.value=id; opt.textContent=name;
        sel.appendChild(opt);
    });
    // Restaurer sélection précédente si toujours présente
    if(current) sel.value=current;
};

// ═══════════════════════════════════════════════════════════════════════════
//  SEARCH (onglet Recherche)
// ═══════════════════════════════════════════════════════════════════════════
const runSearch=()=>{
    const resEl=$id('wct-src-results');
    if(!resEl) return;
    resEl.innerHTML=`<p style="color:var(--wct-text2);font-size:0.833em;margin-top:6px">${t('srcLoading')}</p>`;

    // Lire les filtres statut (checkboxes)
    const statusItems=[...document.querySelectorAll('.wct-src-status-item')];
    const checkedStatuses=new Set(statusItems.filter(cb=>cb.checked).map(cb=>cb.dataset.status));
    // "tout coché" = aucun filtre statut (comparaison au nombre réel de cases, pas un magique)
    const allStatusChecked=statusItems.length>0 && checkedStatuses.size===statusItems.length;

    const startAfterVal   =$id('wct-src-start-after')?.value||'';
    const startBeforeVal  =$id('wct-src-start-before')?.value||'';
    const endAfterVal     =$id('wct-src-end-after')?.value||'';
    const endBeforeVal    =$id('wct-src-end-before')?.value||'';
    const descKw          =($id('wct-src-desc')?.value||'').trim().toLowerCase();
    const mteKw           =($id('wct-src-mte')?.value||'').trim().toLowerCase();
    const useAnd          =$id('wct-src-and')?.classList.contains('on');

    const toTs=str=>str?new Date(str).getTime():null;
    const startAfter =toTs(startAfterVal);
    const startBefore=toTs(startBeforeVal);
    const endAfter   =toTs(endAfterVal);
    const endBefore  =toTs(endBeforeVal);

    let allClosures=[];
    try{ allClosures=sdk.DataModel.RoadClosures.getAll(); }catch(e){}
    if(!allClosures.length){
        resEl.innerHTML=`<p style="color:var(--wct-text2);font-size:0.833em;margin-top:6px">${t('srcNoClosures')}</p>`;
        return;
    }

    const parseClDate=str=>{ if(!str)return null; try{return new Date(str).getTime();}catch(e){return null;} };
    // Cache des noms MTE (lookup SDK coûteux). Retourne {name, resolved}.
    // resolved=false => MTE non chargé en mémoire, seul l'ID est disponible.
    const _mteCache=new Map();
    const getMte=id=>{
        if(!id) return {name:'',resolved:true};
        if(_mteCache.has(id)) return _mteCache.get(id);
        let res={name:id,resolved:false};
        try{
            const ev=sdk.DataModel.MajorTrafficEvents.getById({majorTrafficEventId:id});
            const nm=ev?.names?.[0]?.value;
            if(nm) res={name:nm,resolved:true};
        }catch(e){}
        _mteCache.set(id,res);
        return res;
    };
    const statusLabel=s=>{ const l=t('srcStatusLabels'); return l[s]||s||'—'; };

    const matchedClosures=allClosures.filter(cl=>{
        if(!allStatusChecked && !checkedStatuses.has(cl.status)) return false;
        const clStart=parseClDate(cl.startDate), clEnd=parseClDate(cl.endDate);
        if(startAfter  && clStart!==null && clStart<startAfter)  return false;
        if(startBefore && clStart!==null && clStart>startBefore) return false;
        if(endAfter    && clEnd!==null   && clEnd<endAfter)      return false;
        if(endBefore   && clEnd!==null   && clEnd>endBefore)     return false;
        if(descKw||mteKw){
            const descMatch=descKw?(cl.description||'').toLowerCase().includes(descKw):false;
            const mteName=getMte(cl.trafficEventId).name.toLowerCase();
            const mteMatch=mteKw?mteName.includes(mteKw):false;
            if(useAnd){ if(descKw&&!descMatch)return false; if(mteKw&&!mteMatch)return false; }
            else{ if(descKw||mteKw){ if(!(descMatch||mteMatch))return false; } }
        }
        return true;
    });

    if(!matchedClosures.length){
        resEl.innerHTML=`<p style="color:var(--wct-text2);font-size:0.833em;margin-top:6px">${t('srcNoResults')}</p>`;
        return;
    }

    const bySegId=new Map();
    matchedClosures.forEach(cl=>{
        const sid=cl.segmentId;
        // Option A : ne garder que les segments réellement chargés dans la vue courante.
        if(bySegId.has(sid)){
            // déjà validé
        } else {
            if(!getSegById(sid)) return; // segment absent du data model → ignorer
            bySegId.set(sid,{closures:[],mtes:new Map(),statuses:new Set(),descriptions:new Set()});
        }
        const entry=bySegId.get(sid);
        entry.closures.push(cl);
        if(cl.trafficEventId){
            const m=getMte(cl.trafficEventId);
            // clé = libellé affiché ; on retient l'état resolved pour l'infobulle
            if(!entry.mtes.has(m.name)) entry.mtes.set(m.name,m.resolved);
        }
        if(cl.status) entry.statuses.add(cl.status);
        const d=(cl.description||'').trim();
        if(d) entry.descriptions.add(d);
    });

    if(!bySegId.size){
        resEl.innerHTML=`<p style="color:var(--wct-text2);font-size:0.833em;margin-top:6px">${t('srcNoResults')}</p>`;
        return;
    }

    // Construction du tableau avec tri
    const hdr=document.createElement('div');
    hdr.className='wct-src-results-hdr';
    hdr.textContent=t('srcResults',bySegId.size);
    resEl.innerHTML='';
    resEl.appendChild(hdr);

    // Données lignes (tableau trié)
    const rows=[...bySegId.entries()].map(([sid,entry])=>({
        sid,
        name:getSegName(sid),
        count:entry.closures.length,
        statuses:[...entry.statuses].sort(), // tri stable pour rendu et tri colonne déterministes
        descriptions:[...entry.descriptions].sort(),
        // [{label, resolved}] triés par label
        mtes:[...entry.mtes.entries()].map(([label,resolved])=>({label,resolved})).sort((a,b)=>a.label.localeCompare(b.label)),
    }));

    let sortKey='sid', sortDir=1; // par défaut : ID croissant

    const COLS=[
        {key:'sid',    tip:t('srcTipColId'),       label:t('srcColId')},
        {key:'name',   tip:t('srcTipColName'),      label:t('srcColName')},
        {key:'count',  tip:t('srcTipColClosures'),  label:t('srcColClosures'), center:true},
        {key:'status', tip:t('srcTipColStatus'),    label:t('srcColStatus')},
        {key:'desc',   tip:t('srcTipColDesc'),      label:t('srcColDesc')},
        {key:'mte',    tip:t('srcTipColMte'),       label:t('srcColMte')},
    ];

    const table=document.createElement('table');
    table.className='wct-src-table';

    const buildTable=()=>{
        table.innerHTML='';
        // Tri
        const sorted=[...rows].sort((a,b)=>{
            let va,vb;
            if(sortKey==='sid')    { va=a.sid;     vb=b.sid; }
            else if(sortKey==='name')  { va=a.name.toLowerCase(); vb=b.name.toLowerCase(); }
            else if(sortKey==='count') { va=a.count; vb=b.count; }
            else if(sortKey==='status'){ va=a.statuses[0]||''; vb=b.statuses[0]||''; }
            else if(sortKey==='desc')  { va=(a.descriptions[0]||'').toLowerCase(); vb=(b.descriptions[0]||'').toLowerCase(); }
            else if(sortKey==='mte')   { va=(a.mtes[0]?.label||'').toLowerCase(); vb=(b.mtes[0]?.label||'').toLowerCase(); }
            if(va<vb) return -sortDir; if(va>vb) return sortDir; return 0;
        });

        // Thead
        const thead=document.createElement('thead');
        const trh=document.createElement('tr');
        // Colonne centrage (pas triable)
        const thCenter=document.createElement('th');
        trh.appendChild(thCenter);
        COLS.forEach(col=>{
            const th=document.createElement('th');
            if(col.center) th.style.textAlign='center';
            th.title=col.tip;
            th.innerHTML=`${col.label}<span class="wct-sort-icon"></span>`;
            if(sortKey===col.key) th.classList.add(sortDir===1?'sort-asc':'sort-desc');
            th.addEventListener('click',()=>{
                if(sortKey===col.key) sortDir*=-1; else { sortKey=col.key; sortDir=1; }
                buildTable();
            });
            trh.appendChild(th);
        });
        thead.appendChild(trh);
        table.appendChild(thead);

        // Tbody
        const tbody=document.createElement('tbody');
        sorted.forEach(row=>{
            const statusBadges=row.statuses.map(s=>
                `<span class="wct-cl-status wct-cl-status-${escHtml(s)}" title="${escHtml(statusLabel(s))}">${escHtml(statusLabel(s))}</span>`
            ).join(' ');
            // Descriptions : une ligne par description distincte
            const descHtml=row.descriptions.length
                ? row.descriptions.map(d=>`<div class="wct-src-desc-item" title="${escHtml(d)}">${escHtml(d)}</div>`).join('')
                : '—';
            // MTE : nom si résolu, sinon ID avec infobulle explicative
            const mteHtml=row.mtes.length
                ? row.mtes.map(m=>m.resolved
                    ? `<div class="wct-src-mte-item" title="${escHtml(m.label)}">${escHtml(m.label)}</div>`
                    : `<div class="wct-src-mte-item wct-src-mte-unresolved" title="${escHtml(t('srcTipMteId'))}">${escHtml(m.label)}</div>`
                  ).join('')
                : '—';
            const nameEsc=escHtml(row.name);
            const tr=document.createElement('tr');
            tr.innerHTML=`
                <td><button class="wct-src-center" data-sid="${row.sid}" title="${escHtml(t('srcTipCenterRow'))}">&#x1F3AF;</button></td>
                <td style="font-family:monospace" title="${row.sid}">${row.sid}</td>
                <td><span class="wct-src-name" title="${nameEsc}">${nameEsc}</span></td>
                <td style="text-align:center">${row.count}</td>
                <td>${statusBadges||'—'}</td>
                <td><div class="wct-src-desc-cell">${descHtml}</div></td>
                <td><div class="wct-src-mte-cell">${mteHtml}</div></td>`;
            tr.querySelector('.wct-src-center').addEventListener('click',e=>{
                e.stopPropagation();
                const s=getSegById(Number(e.currentTarget.dataset.sid));
                const coords=_getSegCoords(s);
                if(coords) centerOnSegmentBbox(coords);
                else console.warn('WCT: geometry introuvable pour sid',e.currentTarget.dataset.sid);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
    };

    buildTable();
    resEl.appendChild(table);

    // Sélection des segments sur la carte (tous validés présents dans le data model)
    try{
        const segIds=[...bySegId.keys()].map(Number).filter(id=>!isNaN(id));
        if(segIds.length) sdk.Editing.setSelection({selection:{ids:segIds,objectType:'segment'}});
    }catch(e){ console.warn('WCT search select:',e); }
};

// ═══════════════════════════════════════════════════════════════════════════
//  SMALL PREVIEW
// ═══════════════════════════════════════════════════════════════════════════
const PREVIEW_MAX_ROWS=200; // plafond d'affichage des occurrences en live preview
const refreshSmallPreview=async()=>{
    const el=$id('wct-small-prev');if(!el)return;
    const rc=await buildClosureList();
    if(rc.error){el.innerHTML=`<span style="color:var(--wct-red)">${rc.error}</span>`;return;}
    const n=rc.list.length;
    if(!n){ el.innerHTML=`<div class="wct-prev-head">${t('previewHead',0)}</div>`; return; }
    // Métadonnées communes à toutes les occurrences (config globale), façon AC
    const reason=($id('wct-reason')?.value||'').trim();
    const dir=$id('wct-direction')?.value||'3';
    const dirIcon=dir==='1'?'\u21D2':dir==='2'?'\u21D0':'\u21C4';
    const shown=rc.list.slice(0,PREVIEW_MAX_ROWS);
    const rows=shown.map(cl=>{
        const s=formatDateDisplay(cl.start), e=formatDateDisplay(cl.end);
        const pre=reason?`${reason}: `:'';
        return `<div class="wct-prev-row">${pre}${s} \u2192 ${e} (${dirIcon})</div>`;
    }).join('');
    const more=n>PREVIEW_MAX_ROWS?`<div class="wct-prev-more">${t('previewMore',n-PREVIEW_MAX_ROWS)}</div>`:'';
    el.innerHTML=`<div class="wct-prev-head">${t('previewHead',n)}</div>${rows}${more}`;
};

// ═══════════════════════════════════════════════════════════════════════════
//  FULL PREVIEW TABLE
// ═══════════════════════════════════════════════════════════════════════════
const nodeIcon=()=>closeNodes===NODE_CL.all?t('nodeIconAll'):closeNodes===NODE_CL.inside?t('nodeIconInner'):t('nodeIconNone');
const showPreview=()=>{
    if(!queue.length){alert(t('queueEmpty'));return;}
    // Les cartes de la file d'attente SONT l'aperçu — on les déplie toutes et on scrolle
    document.querySelectorAll('.wct-qcard-body').forEach(b=>b.style.display='');
    document.querySelectorAll('.wct-qcard-chevron').forEach(c=>c.innerHTML='&#x25BC;');
    $id('wct-queue-body')?.scrollIntoView({behavior:'smooth',block:'start'});
    // Ouvrir la section file si repliée
    const qb=$id('wct-queue-body');
    if(qb&&qb.style.display==='none'){
        qb.style.display='';
        const chev=$id('wct-queue-chevron');
        if(chev) chev.innerHTML='&#x25BC;';
    }
};

// ═══════════════════════════════════════════════════════════════════════════
//  ADD CLOSURE + APPLY QUEUE
// ═══════════════════════════════════════════════════════════════════════════
const addClosure=(options,okCb,koCb)=>{
    const{segments,reason,direction,startDate,endDate,permanent,eventId}=options;
    // startDate/endDate sont des Date locaux (depuis buildClosureList) ou des chaînes UTC (depuis CSV import)
    // Dans les deux cas, new Date() produit le bon timestamp absolu.
    const sd=new Date(startDate),ed=new Date(endDate);
    const sdoff=sd.getTimezoneOffset()*60000;
    const edoff=ed.getTimezoneOffset()*60000;
    let fromClosed=false,toClosed=false,nodeInfo=null;
    if(closeNodes===NODE_CL.all){fromClosed=toClosed=true;}
    if(closeNodes===NODE_CL.inside){nodeInfo=getNodeList(segments);}
    let revSegs=[];
    try{revSegs=sdk.DataModel.Segments.getReversedSegments({segmentIds:segments.map(Number)});}catch(e){log('getReversedSegments failed: '+e.message);}
    const args={description:reason,endDate:ed.valueOf()-edoff,fromNodeClosed:false,isForward:false,isPermanent:permanent,segmentId:0,startDate:sd.valueOf()-sdoff,trafficEventId:eventId||null};
    const loopErrors=[];
    for(const sid of segments){
        args.segmentId=Number(sid);const seg=getSegById(sid);if(!seg)continue;
        if(nodeInfo){fromClosed=nodeInfo[seg.fromNodeId]>1;toClosed=nodeInfo[seg.toNodeId]>1;}
        let dir=direction;
        for(const r of revSegs){if(r.id===args.segmentId){if(dir!==DIR.TWO)dir=dir===DIR.AtoB?DIR.BtoA:DIR.AtoB;break;}}
        try{
            // En mode TWO sur un segment sens unique : ne tenter que le sens autorisé
            const canFwd=seg.isTwoWay||seg.isAtoB;
            const canRev=seg.isTwoWay||seg.isBtoA;
            if((dir===DIR.AtoB||dir===DIR.TWO)&&canFwd){
                try{args.isForward=true;args.fromNodeClosed=fromClosed;sdk.DataModel.RoadClosures.addClosure(args);}
                catch(e){loopErrors.push(`seg ${sid} fwd: ${e.message}`);}
            }
            if((dir===DIR.BtoA||dir===DIR.TWO)&&canRev){
                try{args.isForward=false;args.fromNodeClosed=toClosed;sdk.DataModel.RoadClosures.addClosure(args);}
                catch(e){loopErrors.push(`seg ${sid} rev: ${e.message}`);}
            }
        }catch(e){loopErrors.push(`seg ${sid}: ${e.message}`);}
    }
    if(loopErrors.length>0){log('addClosure errors: '+loopErrors.join(' | '));}
    sdk.Editing.save().then(v=>{
        const er=document.querySelector('.error-list');
        if(er){const msg=er.querySelector('.description')?.textContent||'error';er.querySelector('.close-button')?.click();sdk.Editing.undoAll();koCb&&koCb([msg]);}
        else{okCb&&okCb(v);}
    },r=>koCb&&koCb([r]));
};
// Interruption demandée par l'utilisateur (bouton Stop ou touche Échap).
// Le retour visuel est immédiat : sans lui, le clic n'avait aucun effet perceptible
// avant la fin de la fermeture en cours, et le bouton passait pour inopérant.
const requestApplyAbort=()=>{
    if(!_applyRunning||_applyAborted) return;
    _applyAborted=true;
    const b=$id('wct-btn-stop');
    if(b){b.disabled=true;b.classList.add('wct-btn-dis');b.textContent=t('btnStopping');}
    const lg=$id('wct-apply-log');
    if(lg){const line=document.createElement('div');line.style.color='#f57c00';line.textContent=t('applyStopping');lg.appendChild(line);lg.scrollTop=lg.scrollHeight;}
};
// Pause assistée entre deux lots : affiche « lot k/N appliqué » + bouton Continuer
// dans le log, et attend le clic. Résout false si l'utilisateur a cliqué Stop entre-temps.
const _applyLotPause = (lotNo, total) => new Promise(resolve => {
    const log = $id('wct-apply-log');
    if(!log){ resolve(true); return; }
    const box = document.createElement('div');
    box.style.cssText = 'display:flex;align-items:center;gap:8px;margin:5px 0;padding:5px 6px;background:rgba(142,36,170,.12);border-left:3px solid #8e24aa;border-radius:3px';
    const txt = document.createElement('span');
    txt.style.cssText = 'flex:1;color:#8e24aa;font-weight:600;font-size:0.917em';
    txt.textContent = t('applyLotDone', lotNo, total);
    const btn = document.createElement('button');
    btn.className = 'wct-btn wct-btn-primary wct-btn-sm';
    btn.textContent = t('applyLotNext');
    box.appendChild(txt); box.appendChild(btn);
    log.appendChild(box); log.scrollTop = log.scrollHeight;
    const chk = setInterval(() => { if(_applyAborted){ clearInterval(chk); box.remove(); resolve(false); } }, 200);
    btn.addEventListener('click', () => { clearInterval(chk); box.remove(); resolve(true); });
});
const applyQueue=async()=>{
    _applyAborted=false;
    let total=0,done=0,failed=0;
    queue.forEach(e=>{
        const excl=e.excludedRows||new Set();
        const skip=sid=>e.nullSegs?.has(Number(sid))||e.recentSegs?.has(Number(sid));
        e.segIds.forEach(sid=>{
            if(skip(sid)) return;
            e.closures.forEach((_,ci)=>{if(!excl.has(`${sid}:${ci}`))total++;});
        });
    });
    // Replier tous les lots pour libérer de la place pour le log
    document.querySelectorAll('.wct-qcard-body').forEach(b=>b.style.display='none');
    document.querySelectorAll('.wct-qcard-chevron').forEach(c=>c.innerHTML='&#x25B6;');
    const pbw=$id('wct-pb-wrap'),pbf=$id('wct-pb-fill'),pbt=$id('wct-pb-text');
    const stopBtn=$id('wct-btn-stop');
    if(pbw)pbw.style.display='block';
    // Réarmer le bouton : il reste grisé et renommé après une interruption précédente
    if(stopBtn){stopBtn.disabled=false;stopBtn.classList.remove('wct-btn-dis');stopBtn.textContent=t('btnStop');stopBtn.style.display='inline-flex';}
    _applyRunning=true;
    const upd=n=>{const p=Math.round(n*100/total);if(pbf)pbf.style.width=p+'%';if(pbt)pbt.textContent=`${n}/${total} (${p}%)`;};
    const applyLog=$id('wct-apply-log');
    if(applyLog){
        applyLog.style.display='block';
        applyLog.innerHTML='';
        // Scroll vers le log
        setTimeout(()=>applyLog.scrollIntoView({behavior:'smooth',block:'end'}),100);
    }
    const logApply=(msg,color)=>{
        if(!applyLog) return;
        const line=document.createElement('div');
        line.style.color=color||'inherit';
        line.textContent=msg;
        applyLog.appendChild(line);
        applyLog.scrollTop=applyLog.scrollHeight;
    };
    // Lots issus du mode balayage : recadrage de la carte + pause assistée entre chaque.
    let lotNo=0;
    const totalLots=queue.filter(e=>e.source==='sweep'&&e.lotBbox).length;
    try{
        for(const e of queue){
            if(_applyAborted) break;
            const isLot=e.source==='sweep'&&e.lotBbox;
            // Recadrer sur le lot pour recharger ses segments avant de les fermer
            if(isLot){
                lotNo++;
                logApply(t('applyLotFocus',lotNo,totalLots),'#8e24aa');
                const b=e.lotBbox;
                try{sdk.Map.setMapCenter({lonLat:{lon:(b.minLon+b.maxLon)/2,lat:(b.minLat+b.maxLat)/2},zoomLevel:SWEEP_ZOOM});}catch(err){}
                await _sweepSleep(SWEEP_SETTLE_MS);
                await waitMapLoaded();
                await _sweepSleep(150);
                if(_applyAborted) break;
            }
            const dir=parseInt(e.config.direction);
            const excl=e.excludedRows||new Set();
            const skip=sid=>e.nullSegs?.has(Number(sid))||e.recentSegs?.has(Number(sid));
            for(let closureIdx=0;closureIdx<e.closures.length;closureIdx++){
                if(_applyAborted) break;
                const cl=e.closures[closureIdx];
                // Segments actifs pour cette occurrence (hors lignes supprimées + segments défaillants)
                const activeSegs=e.segIds.filter(sid=>!excl.has(`${sid}:${closureIdx}`)&&!skip(sid));
                if(!activeSegs.length) continue;
                await waitMapLoaded();
                // Relire le drapeau : l'attente ci-dessus dure jusqu'à 10 s, et un Stop cliqué
                // pendant celle-ci laissait partir une fermeture de plus.
                if(_applyAborted) break;
                await new Promise(res=>{
                    addClosure({segments:activeSegs,reason:e.config.reason,direction:dir,startDate:cl.start,endDate:cl.end,permanent:e.config.ignoretraffic,eventId:e.config.mteId||null},
                        ()=>{done+=activeSegs.length;upd(done+failed);const ls=cl.start instanceof Date?formatDateDisplay(cl.start):cl.start;logApply(t('applyOk',e.config.reason,ls),'#43a047');res();},
                        (errs)=>{failed+=activeSegs.length;upd(done+failed);const ls=cl.start instanceof Date?formatDateDisplay(cl.start):cl.start;logApply(t('applyErr',e.config.reason,ls,errs[0]||'error'),'#e53935');res();});
                });
            }
            // Pause assistée entre les lots (sauf après le dernier)
            if(isLot && lotNo<totalLots && !_applyAborted){
                const cont=await _applyLotPause(lotNo,totalLots);
                if(!cont) break;
            }
        }
    }finally{
        // Toujours réarmer, y compris si addClosure lève : sinon le Stop reste grisé pour de bon.
        _applyRunning=false;
        if(stopBtn){stopBtn.style.display='none';stopBtn.disabled=false;stopBtn.classList.remove('wct-btn-dis');stopBtn.textContent=t('btnStop');}
    }
    setTimeout(()=>{if(pbw)pbw.style.display='none';if(pbt)pbt.textContent='';},2000);
    showToast(_applyAborted?t('applyStopped',done,failed):t('applyDone',done,failed,total),4000,failed||_applyAborted?'#f57c00':'#43a047');
};
// Génère un CSV au format WME Advanced Closures à partir d'un jeu d'entrées de file.
const _queueToCSV=(entries)=>{
    const center=sdk.Map.getMapCenter(),zoom=sdk.Map.getZoomLevel();
    let csv='header,reason,start date (yyyy-mm-dd hh:mm),end date (yyyy-mm-dd hh:mm),direction (A to B|B to A|TWO WAY),ignore trafic (Yes|No),segment IDs (id1;id2;...),lon/lat (like in a permalink: lon=xxx&lat=yyy),zoom (14 to 22),MTE id (empty cell if not),comment (optional)\n';
    entries.forEach(e=>{
        const dir=DIR_CSV[parseInt(e.config.direction)],it=e.config.ignoretraffic?'Yes':'No';
        e.closures.forEach(cl=>{
            const cs=cl.start instanceof Date?dateToUTCStr(cl.start):cl.start;
            const ce=cl.end instanceof Date?dateToUTCStr(cl.end):cl.end;
            csv+=`add,"${e.config.reason}","${cs}","${ce}","${dir}",${it},"${e.segIds.join(';')}","lon=${center.lon}&lat=${center.lat}",${zoom},${e.config.mteId||''},"WME Closures Toolkit"\n`;
        });
    });
    return csv;
};
const exportCSV=()=>{ if(!queue.length)return; download(_queueToCSV(queue),`closures_${todayStr()}.csv`); };
// Export CSV des lots configurés d'une trace donnée (entrées 'sweep' de ce fichier).
const exportLotsCSV=(fileId)=>{
    const lots=queue.filter(e=>e.source==='sweep'&&e.fileId===fileId);
    if(!lots.length){ showToast(t('lotCsvNone'),3000,'#f57c00'); return; }
    const fname=(_traceFiles.find(f=>f.fileId===fileId)?.filename||'lots').replace(/\.[^.]+$/,'');
    download(_queueToCSV(lots),`${fname}_lots_${todayStr()}.csv`);
    showToast(t('lotCsvDone',lots.length),3000,'#43a047');
};

// ═══════════════════════════════════════════════════════════════════════════
//  PRESETS
// ═══════════════════════════════════════════════════════════════════════════
const reloadPresets=()=>{const sel=$id('wct-presets-list');if(!sel)return;sel.innerHTML=presets.map((p,i)=>`<option value="${i}">${escHtml(p.name)}</option>`).join('');};

// ═══════════════════════════════════════════════════════════════════════════
//  DRAGGABLE (borné à l'écran)
// ═══════════════════════════════════════════════════════════════════════════
const makeDraggable=(el,handle)=>{
    handle.addEventListener('mousedown',e=>{
        if(e.target.closest('.wct-hdr-btn'))return;
        const r=el.getBoundingClientRect();
        const ox=e.clientX-r.left,oy=e.clientY-r.top;
        const mv=ev=>{
            let x=ev.clientX-ox,y=ev.clientY-oy;
            x=Math.max(0,Math.min(x,window.innerWidth-el.offsetWidth));
            y=Math.max(0,Math.min(y,window.innerHeight-30));
            el.style.left=x+'px';el.style.top=y+'px';el.style.right='auto';
        };
        const up=()=>{document.removeEventListener('mousemove',mv);document.removeEventListener('mouseup',up);};
        document.addEventListener('mousemove',mv);document.addEventListener('mouseup',up);
    });
};

// ═══════════════════════════════════════════════════════════════════════════
//  BUILD OVERLAY
// ═══════════════════════════════════════════════════════════════════════════
// ─── Toast notification ────────────────────────────────────────────────────
let toastTimer=null;
const showToast=(msg,duration=2500,color='#323232')=>{
    const el=$id('wct-toast');
    if(!el) return;
    clearTimeout(toastTimer);
    el.textContent=msg;
    el.style.background=color;
    el.classList.add('show');
    toastTimer=setTimeout(()=>el.classList.remove('show'),duration);
};

// ─── updateCountryInfo (global) ────────────────────────────────────────────
const updateCountryInfo=()=>{
    const sel=getSelection();
    const holidaysWarn=$id('wct-holidays-warn');
    const holSkip=$id('wct-hol-skip'),holOnly=$id('wct-hol-only');
    if(!sel||!sel.ids.length)return;
    const cc=checkSelectionCountry(sel.ids);
    if(!cc.ok&&cc.countries.length>1){
        if(holidaysWarn){holidaysWarn.style.display='block';holidaysWarn.innerHTML=t('multiCountry',cc.countries.join(', '));}
        if(holSkip)holSkip.disabled=true;if(holOnly)holOnly.disabled=true;const holAddEl=$id('wct-hol-add');if(holAddEl)holAddEl.disabled=true;
    } else {
        if(holSkip)holSkip.disabled=false;if(holOnly)holOnly.disabled=false;const holAddEl=$id('wct-hol-add');if(holAddEl)holAddEl.disabled=false;
        if(holidaysWarn&&(holidaysWarn.innerHTML.includes('multi-pays')||holidaysWarn.innerHTML.includes('Multi-country')))holidaysWarn.style.display='none';
    }
};


// ─── TRACÉS (GPX / KML / KMZ / GeoJSON) ────────────────────────────────────
//
// Modèle de données :
//   _traceFiles  : [{ fileId, filename, type, datetime }]   — un par fichier chargé
//   _traceTracks : [{ trackId, fileId, name, type,          — un par track linéaire
//                     sampledPts, total, sampled,
//                     color, olLayer, errors, visible }]
//
// "type" vaut 'GPX' | 'KML' | 'KMZ' | 'GeoJSON'

const TRACE_PALETTE = [
    '#e53935','#d81b60','#8e24aa','#3949ab',
    '#1e88e5','#00897b','#43a047','#c0ca33',
    '#f57c00','#6d4c41','#546e7a','#000000',
    '#ffffff','#fdd835','#ff7043','#00acc1'
];
const TRACE_COLORS = ['#e53935','#1e88e5','#43a047','#f57c00','#8e24aa','#00897b','#d81b60','#6d4c41'];

let _traceFiles  = [];
let _traceTracks = [];
let _traceColorIdx = 0;

const _traceNewId = (prefix) => prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2,6);
const _traceNextColor = () => TRACE_COLORS[_traceColorIdx++ % TRACE_COLORS.length];

// Subsample : garde au max maxPts points régulièrement espacés
const traceSubsample = (pts, maxPts) => {
    if(pts.length <= maxPts) return pts;
    const step = pts.length / maxPts;
    const out = [];
    for(let i = 0; i < maxPts; i++) out.push(pts[Math.round(i * step)]);
    return out;
};

// ── Parsers ──────────────────────────────────────────────────────────────────

// Helper multilingue pour les messages d'erreur des parsers.
// deStr omis ⇒ repli sur l'anglais (pas de message vide).
const _pe = (frStr, enStr, deStr) => (_lang === 'fr' ? frStr : _lang === 'de' ? (deStr ?? enStr) : enStr);

// GPX → [{ name, points[], errors[] }]  — un objet par <trk>
const parseGpx = (filename, xmlText) => {
    const tracks = [];
    try {
        const doc = new DOMParser().parseFromString(xmlText, 'application/xml');
        if(doc.querySelector('parsererror')) return [{ name: filename, points: [], errors: [_pe('XML invalide','Invalid XML','Ungültiges XML')] }];
        const trkEls = doc.querySelectorAll('trk');
        if(trkEls.length === 0) return [{ name: filename, points: [], errors: [_pe('Aucun track <trk> trouvé','No <trk> track found','Kein <trk>-Track gefunden')] }];
        const total = trkEls.length;
        trkEls.forEach((trk, idx) => {
            const errors = [];
            const nameEl = trk.querySelector(':scope > name');
            let name = nameEl ? nameEl.textContent.trim() : '';
            if(!name) name = filename.replace(/\.gpx$/i, '');
            if(total > 1) name = `${name} (${idx+1}/${total})`;
            const points = [];
            trk.querySelectorAll('trkpt').forEach(pt => {
                const lat = parseFloat(pt.getAttribute('lat'));
                const lon = parseFloat(pt.getAttribute('lon'));
                if(isNaN(lat) || isNaN(lon)) errors.push(_pe('Point invalide ignoré','Invalid point ignored','Ungültiger Punkt ignoriert'));
                else points.push([lat, lon]);
            });
            if(points.length === 0) errors.push(_pe('Aucun point de trace','No track points found','Keine Trackpunkte gefunden'));
            tracks.push({ name, points, errors });
        });
    } catch(e) {
        tracks.push({ name: filename, points: [], errors: [_pe('Erreur parsing : ','Parse error: ','Parsing-Fehler: ') + e.message] });
    }
    return tracks;
};

// KML (texte) → [{ name, points[], errors[] }]  — un objet par Placemark LineString
// Gère les deux namespaces : OGC 2.2 et ancien Google 2.1
const parseKml = (filename, xmlText) => {
    const tracks = [];
    try {
        const doc = new DOMParser().parseFromString(xmlText, 'application/xml');
        if(doc.querySelector('parsererror')) return [{ name: filename, points: [], errors: [_pe('XML invalide','Invalid XML','Ungültiges XML')] }];

        // Détection namespace
        const rootEl = doc.documentElement;
        const nsUri = rootEl.namespaceURI || 'http://www.opengis.net/kml/2.2';

        // Récupère tous les Placemark contenant une LineString
        const allPM = Array.from(doc.getElementsByTagNameNS(nsUri, 'Placemark'));
        const linePM = allPM.filter(pm => pm.getElementsByTagNameNS(nsUri, 'LineString').length > 0);

        if(linePM.length === 0) return [{ name: filename, points: [], errors: [_pe('Aucun Placemark LineString trouvé','No LineString Placemark found','Kein LineString-Placemark gefunden')] }];

        const total = linePM.length;
        // Détecter doublons de noms pour suffixage
        const nameCount = {};
        linePM.forEach(pm => {
            const nameEl = pm.getElementsByTagNameNS(nsUri, 'name')[0];
            const n = (nameEl ? nameEl.textContent.trim() : '') || filename.replace(/\.(kml|kmz)$/i, '');
            nameCount[n] = (nameCount[n] || 0) + 1;
        });
        const nameIdx = {};

        linePM.forEach((pm, idx) => {
            const errors = [];
            const nameEl = pm.getElementsByTagNameNS(nsUri, 'name')[0];
            let name = (nameEl ? nameEl.textContent.trim() : '') || filename.replace(/\.(kml|kmz)$/i, '');
            // Suffixage si multi-tracks ou noms dupliqués
            if(total > 1) {
                if(nameCount[name] > 1) {
                    nameIdx[name] = (nameIdx[name] || 0) + 1;
                    name = `${name} (${nameIdx[name]}/${nameCount[name]})`;
                } else {
                    name = `${name} (${idx+1}/${total})`;
                }
            }
            const points = [];
            const lsEls = pm.getElementsByTagNameNS(nsUri, 'LineString');
            Array.from(lsEls).forEach(ls => {
                const coordEl = ls.getElementsByTagNameNS(nsUri, 'coordinates')[0];
                if(!coordEl) return;
                coordEl.textContent.trim().split(/\s+/).forEach(token => {
                    const parts = token.split(',');
                    if(parts.length < 2) return;
                    const lon = parseFloat(parts[0]);
                    const lat = parseFloat(parts[1]);
                    if(!isNaN(lat) && !isNaN(lon)) points.push([lat, lon]);
                });
            });
            if(points.length === 0) errors.push(_pe('LineString vide ou coordonnées invalides','Empty LineString or invalid coordinates','Leerer LineString oder ungültige Koordinaten'));
            tracks.push({ name, points, errors });
        });
    } catch(e) {
        tracks.push({ name: filename, points: [], errors: [_pe('Erreur parsing KML : ','KML parse error: ','KML-Parsing-Fehler: ') + e.message] });
    }
    return tracks;
};

// KMZ (ArrayBuffer) → [{ name, points[], errors[] }]
// Décompression via fflate (@require CDN)
const parseKmz = async (filename, arrayBuffer) => {
    try {
        if(typeof fflate === 'undefined') return [{ name: filename, points: [], errors: [_pe('fflate non disponible','fflate library unavailable','fflate-Bibliothek nicht verfügbar')] }];
        const uint8 = new Uint8Array(arrayBuffer);
        const unzipped = fflate.unzipSync(uint8);
        // Chercher le fichier .kml principal (doc.kml ou premier .kml trouvé)
        const kmlKeys = Object.keys(unzipped).filter(k => k.endsWith('.kml'));
        const mainKey = kmlKeys.includes('doc.kml') ? 'doc.kml' : kmlKeys[0];
        if(!mainKey) return [{ name: filename, points: [], errors: [_pe('Aucun fichier KML dans le KMZ','No KML file found in KMZ','Keine KML-Datei im KMZ gefunden')] }];
        const kmlText = new TextDecoder('utf-8').decode(unzipped[mainKey]);
        return parseKml(filename, kmlText);
    } catch(e) {
        return [{ name: filename, points: [], errors: [_pe('Erreur décompression KMZ : ','KMZ decompression error: ','KMZ-Entpackfehler: ') + e.message] }];
    }
};

// GeoJSON → [{ name, points[], errors[] }]  — un objet par Feature LineString/MultiLineString
const parseGeoJSON = (filename, jsonText) => {
    const tracks = [];
    try {
        const gj = JSON.parse(jsonText);
        const features = (gj.type === 'FeatureCollection') ? gj.features
                       : (gj.type === 'Feature')           ? [gj]
                       : [];
        const lineFeatures = features.filter(f =>
            f.geometry && (f.geometry.type === 'LineString' || f.geometry.type === 'MultiLineString')
        );
        if(lineFeatures.length === 0) return [{ name: filename, points: [], errors: [_pe('Aucune géométrie linéaire (LineString/MultiLineString) trouvée','No linear geometry (LineString/MultiLineString) found','Keine Liniengeometrie (LineString/MultiLineString) gefunden')] }];
        const total = lineFeatures.length;
        lineFeatures.forEach((feat, idx) => {
            const errors = [];
            const props = feat.properties || {};
            let name = props.name || props.Name || props.nom || props.title || props.label || '';
            if(!name) name = filename.replace(/\.geojson$/i, '');
            if(total > 1) name = `${name} (${idx+1}/${total})`;
            const points = [];
            const coords = feat.geometry.coordinates;
            if(!Array.isArray(coords)) {
                errors.push(_pe('Coordonnées absentes ou malformées','Missing or malformed coordinates','Fehlende oder fehlerhafte Koordinaten'));
            } else if(feat.geometry.type === 'LineString') {
                coords.forEach(c => {
                    if(!Array.isArray(c) || c.length < 2) return;
                    const lon = c[0], lat = c[1];
                    if(!isNaN(lat) && !isNaN(lon)) points.push([lat, lon]);
                });
            } else { // MultiLineString
                coords.forEach(ring => {
                    if(!Array.isArray(ring)) return;
                    ring.forEach(c => {
                        if(!Array.isArray(c) || c.length < 2) return;
                        const lon = c[0], lat = c[1];
                        if(!isNaN(lat) && !isNaN(lon)) points.push([lat, lon]);
                    });
                });
            }
            if(points.length === 0 && errors.length === 0) errors.push(_pe('Coordonnées invalides ou géométrie vide','Invalid coordinates or empty geometry','Ungültige Koordinaten oder leere Geometrie'));
            tracks.push({ name, points, errors });
        });
    } catch(e) {
        tracks.push({ name: filename, points: [], errors: [_pe('Erreur parsing GeoJSON : ','GeoJSON parse error: ','GeoJSON-Parsing-Fehler: ') + e.message] });
    }
    return tracks;
};

// ── Shapefile ────────────────────────────────────────────────────────────────
// Définitions proj4 statiques — projections françaises + WGS84 + WebMercator
const EPSG_DEFS = {
    4326:  '+proj=longlat +datum=WGS84 +no_defs',
    3857:  '+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs',
    2154:  '+proj=lcc +lat_0=46.5 +lon_0=3 +lat_1=49 +lat_2=44 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    27572: '+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=2200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs',
    27571: '+proj=lcc +lat_1=49.5 +lat_0=49.5 +lon_0=0 +k_0=0.999877341 +x_0=600000 +y_0=1200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs',
    27573: '+proj=lcc +lat_1=44.1 +lat_0=44.1 +lon_0=0 +k_0=0.999877499 +x_0=600000 +y_0=3200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs',
    27574: '+proj=lcc +lat_1=42.165 +lat_0=42.165 +lon_0=0 +k_0=0.99994471 +x_0=234.358 +y_0=4185861.369 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs',
    32630: '+proj=utm +zone=30 +datum=WGS84 +units=m +no_defs',
    32631: '+proj=utm +zone=31 +datum=WGS84 +units=m +no_defs',
    32632: '+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs',
};

// Extrait le code EPSG depuis un WKT .prj
// Extrait le code EPSG depuis un WKT .prj (si AUTHORITY présente)
const _epsgFromPrj = (prjText) => {
    const m = prjText.match(/AUTHORITY\s*\[\s*["']EPSG["']\s*,\s*["']?(\d+)["']?\s*\]/i);
    return m ? parseInt(m[1], 10) : null;
};

// Construit une chaîne proj4 depuis un WKT ESRI .prj (sans AUTHORITY)
// Gère LCC, Transverse Mercator, Mercator — avec conversion grades→degrés
const _wktToDef = (wkt) => {
    try {
        const param = (name) => {
            const m = wkt.match(new RegExp('PARAMETER\\s*\\[\\s*"' + name + '"\\s*,\\s*([\\d.eE+\\-]+)', 'i'));
            return m ? parseFloat(m[1]) : null;
        };
        // Unité angulaire : Grad ≈ 0.01570796, degré ≈ 0.01745329
        const uMatch = wkt.match(/GEOGCS[\s\S]*?UNIT\s*\[\s*"[^"]*"\s*,\s*([\d.eE+\-]+)/i);
        const angUnit = uMatch ? parseFloat(uMatch[1]) : Math.PI/180;
        const isGrad  = Math.abs(angUnit - 0.0157079632679489) < 1e-7;
        const toD = isGrad ? (g => g * 0.9) : (d => d);

        const fe  = param('False_Easting')  || 0;
        const fn  = param('False_Northing') || 0;
        const lat0 = toD(param('Latitude_Of_Origin') ?? param('Standard_Parallel_1') ?? 0);
        const lat1 = toD(param('Standard_Parallel_1') ?? lat0);
        const lat2 = toD(param('Standard_Parallel_2') ?? lat1);
        const lon0 = toD(param('Central_Meridian') ?? 0);
        const k0   = param('Scale_Factor') ?? 1;

        // Primem
        const pmMatch = wkt.match(/PRIMEM\s*\[\s*"([^"]+)"\s*,\s*([\d.eE+\-]+)/i);
        const pmName  = pmMatch ? pmMatch[1].toLowerCase() : 'greenwich';
        const pm = pmName === 'paris' ? '+pm=paris' : (pmName !== 'greenwich' ? `+pm=${pmMatch[2]}` : '');

        // Sphéroïde
        const sphMatch = wkt.match(/SPHEROID\s*\[\s*"[^"]*"\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
        const a   = sphMatch ? parseFloat(sphMatch[1]) : 6378137;
        const invf = sphMatch ? parseFloat(sphMatch[2]) : 298.257223563;
        const b   = a * (1 - 1/invf);

        // Towgs84
        const twMatch = wkt.match(/TOWGS84\s*\[\s*([\d.,\-\s]+)\]/i);
        const towgs84 = twMatch ? `+towgs84=${twMatch[1].trim().replace(/\s/g,'')}` : '';

        // Projection
        const projMatch = wkt.match(/PROJECTION\s*\[\s*"([^"]+)"/i);
        const projName  = projMatch ? projMatch[1].toLowerCase().replace(/_/g,' ') : '';
        let projStr = '';
        if(projName.includes('lambert conformal') || projName.includes('lcc')) {
            projStr = `+proj=lcc +lat_1=${lat1} +lat_2=${lat2} +lat_0=${lat0} +lon_0=${lon0} +x_0=${fe} +y_0=${fn} +k_0=${k0}`;
        } else if(projName.includes('transverse mercator')) {
            projStr = `+proj=tmerc +lat_0=${lat0} +lon_0=${lon0} +k=${k0} +x_0=${fe} +y_0=${fn}`;
        } else if(projName.includes('mercator')) {
            projStr = `+proj=merc +lat_ts=${lat1} +lon_0=${lon0} +x_0=${fe} +y_0=${fn}`;
        } else {
            return null; // projection non supportée
        }
        return `${projStr} +a=${a} +b=${b.toFixed(3)} ${towgs84} ${pm} +units=m +no_defs`.replace(/\s+/g,' ').trim();
    } catch(e) { return null; }
};

// Shapefile (ZIP ArrayBuffer) → [{ name, points[], errors[], isDataset }]
// Reprojection manuelle via proj4 (notre table EPSG_DEFS) — évite le bug +pm=paris de shpjs
const parseShapefile = async (filename, arrayBuffer) => {
    const baseName = filename.replace(/\.zip$/i, '');
    const errors = [];
    try {
        // 1. Vérifier les librairies
        if(typeof fflate === 'undefined') return [{ name: baseName, points: [], errors: [_pe('fflate non disponible','fflate library unavailable','fflate-Bibliothek nicht verfügbar')], isDataset: true }];
        if(typeof shp   === 'undefined') return [{ name: baseName, points: [], errors: [_pe('shpjs non disponible','shpjs library unavailable','shpjs-Bibliothek nicht verfügbar')], isDataset: true }];
        if(typeof proj4 === 'undefined') return [{ name: baseName, points: [], errors: [_pe('proj4 non disponible','proj4 library unavailable','proj4-Bibliothek nicht verfügbar')], isDataset: true }];

        // 2. Dézipper + validation des fichiers obligatoires
        const uint8 = new Uint8Array(arrayBuffer);
        let unzipped;
        try { unzipped = fflate.unzipSync(uint8); }
        catch(e) { return [{ name: baseName, points: [], errors: [_pe('Erreur décompression ZIP : ','ZIP decompression error: ','ZIP-Entpackfehler: ') + e.message], isDataset: true }]; }

        const keys = Object.keys(unzipped);
        const findExt = (ext) => keys.find(k => k.toLowerCase().endsWith('.' + ext));
        const shpKey = findExt('shp');
        const dbfKey = findExt('dbf');
        const shxKey = findExt('shx');
        const prjKey = findExt('prj');

        const missing = [];
        if(!shpKey) missing.push('.shp');
        if(!dbfKey) missing.push('.dbf');
        if(!shxKey) missing.push('.shx');
        if(missing.length > 0) {
            return [{ name: baseName, points: [], errors: [
                _pe(
                    `Fichiers manquants dans le ZIP : ${missing.join(', ')}. Un shapefile requiert au minimum .shp, .dbf et .shx.`,
                    `Missing files in ZIP: ${missing.join(', ')}. A shapefile requires at least .shp, .dbf and .shx.`,
                    `Fehlende Dateien im ZIP: ${missing.join(', ')}. Ein Shapefile benötigt mindestens .shp, .dbf und .shx.`
                )
            ], isDataset: true }];
        }

        // 3. Identifier la projection depuis le .prj
        // Priorité : 1) parser WKT complet (_wktToDef) 2) EPSG_DEFS via code 3) WGS84 par défaut
        let projSrcDef = null; // chaîne proj4 source, null = WGS84
        if(prjKey) {
            const prjText = new TextDecoder('utf-8').decode(unzipped[prjKey]);
            // Essai 1 : parser le WKT directement (gère les grades, tous les paramètres)
            const wktDef = _wktToDef(prjText);
            if(wktDef) {
                projSrcDef = wktDef;
            } else {
                // Essai 2 : code EPSG via AUTHORITY → table EPSG_DEFS
                const code = _epsgFromPrj(prjText);
                if(code && EPSG_DEFS[code]) {
                    projSrcDef = EPSG_DEFS[code];
                } else if(code) {
                    return [{ name: baseName, points: [], errors: [
                        _pe(
                            `Projection EPSG:${code} non reconnue. Demandez un export en WGS84 (EPSG:4326) ou Lambert 93 (EPSG:2154).`,
                            `Projection EPSG:${code} not recognised. Request an export in WGS84 (EPSG:4326) or Lambert 93 (EPSG:2154).`,
                            `Projektion EPSG:${code} nicht erkannt. Fordern Sie einen Export in WGS84 (EPSG:4326) oder Lambert 93 (EPSG:2154) an.`
                        )
                    ], isDataset: true }];
                } else {
                    errors.push(_pe('.prj présent mais projection non reconnue — WGS84 supposé (risque de décalage).','.prj found but projection not recognised — WGS84 assumed (possible offset).','.prj vorhanden, aber Projektion nicht erkannt — WGS84 angenommen (Versatz möglich).'));
                }
            }
        } else {
            errors.push(_pe('.prj absent — WGS84 supposé (risque de décalage si autre projection).','.prj missing — WGS84 assumed (possible offset if another projection is used).','.prj fehlt — WGS84 angenommen (Versatz möglich, falls eine andere Projektion verwendet wird).'));
        }

        // 4. Parser .shp + .dbf via shpjs SANS reprojection interne (prj=false)
        const toAB = (u8) => u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength);
        let geojson;
        try {
            const shpRows = shp.parseShp(toAB(unzipped[shpKey]), false);
            const dbfRows = shp.parseDbf(toAB(unzipped[dbfKey]));
            geojson = shp.combine([shpRows, dbfRows]);
        } catch(e) {
            return [{ name: baseName, points: [], errors: [_pe('Erreur parsing shapefile : ','Shapefile parse error: ','Shapefile-Parsing-Fehler: ') + e.message], isDataset: true }];
        }

        // 5. Filtrer géométries linéaires/surfaciques
        const allFeats = (geojson.features || []).filter(f =>
            f.geometry && ['LineString','MultiLineString','Polygon','MultiPolygon'].includes(f.geometry.type)
        );
        if(allFeats.length === 0) {
            return [{ name: baseName, points: [], errors: [_pe('Aucune géométrie linéaire ou surfacique dans ce shapefile.','No linear or surface geometry found in this shapefile.','Keine Linien- oder Flächengeometrie in diesem Shapefile.')], isDataset: true }];
        }

        // 6. Reprojection manuelle vers WGS84 avec proj4
        // On conserve la structure GeoJSON par feature pour le rendu intelligent (line vs polygon)
        const needsReproj = (projSrcDef !== null);
        const projWGS = EPSG_DEFS[4326];

        const reprojectCoords = (coords) => {
            if(!Array.isArray(coords[0])) {
                // point terminal [x, y]
                if(needsReproj) {
                    try { const r = proj4(projSrcDef, projWGS, coords); return [r[0], r[1]]; }
                    catch(e) { return coords; }
                }
                return coords;
            }
            return coords.map(reprojectCoords);
        };

        // Features reprojetées avec leur type de géométrie intact
        const reprojFeats = allFeats.map(feat => ({
            type: feat.geometry.type,
            coordinates: reprojectCoords(feat.geometry.coordinates)
        }));

        // Points aplatis pour focus/bbox (conservé pour compatibilité)
        const allPoints = [];
        reprojFeats.forEach(f => {
            const flat = (c) => { if(!Array.isArray(c[0])) { allPoints.push([c[1], c[0]]); } else c.forEach(flat); };
            flat(f.coordinates);
        });

        if(allPoints.length === 0) {
            return [{ name: baseName, points: [], errors: [_pe('Aucun point valide après reprojection.','No valid points after reprojection.','Keine gültigen Punkte nach der Umprojektion.')], isDataset: true }];
        }

        // 7. Nom : champ texte le plus probable dans les attributs
        const nameFields = ['name','Name','NOM','nom','LIBELLE','libelle','TWG_LIBELL','label','LABEL','title','TITLE'];
        const fields = Object.keys((allFeats[0].properties) || {});
        const nameField = nameFields.find(f => fields.includes(f)) || fields.find(f => typeof allFeats[0].properties[f] === 'string');
        const trackName = nameField ? `${baseName} (${nameField})` : baseName;

        return [{ name: trackName, points: allPoints, errors, isDataset: true, featureCount: allFeats.length, geoFeatures: reprojFeats }];

    } catch(e) {
        return [{ name: baseName, points: [], errors: [_pe('Erreur inattendue : ','Unexpected error: ','Unerwarteter Fehler: ') + e.message], isDataset: true }];
    }
};

// ── Gestion OL par track ──────────────────────────────────────────────────────

const _traceBuildOL = (trackId, sampledPts, color) => {
    if(!sampledPts || sampledPts.length === 0) return null;
    try {
        const proj4326 = new OpenLayers.Projection('EPSG:4326');
        const projMap  = W.map.getProjectionObject();
        const olPts    = sampledPts.map(([lat, lon]) => {
            const pt = new OpenLayers.Geometry.Point(lon, lat);
            pt.transform(proj4326, projMap);
            return pt;
        });
        const line    = new OpenLayers.Geometry.LineString(olPts);
        const style   = { strokeColor: color, strokeWidth: 4, strokeOpacity: 0.85 };
        const feature = new OpenLayers.Feature.Vector(line, null, style);
        const layer   = new OpenLayers.Layer.Vector('WCT_TRACE_' + trackId, { displayInLayerSwitcher: false });
        layer.addFeatures([feature]);
        W.map.addLayer(layer);
        return layer;
    } catch(e) {
        return null;
    }
};

// Construit un layer OL depuis des features GeoJSON reprojetées (WGS84 [lon,lat])
// Style intelligent : LineString → trait plein, Polygon → contour seul sans remplissage
const _traceBuildOLFromFeatures = (trackId, geoFeatures, color, maxFeatures) => {
    if(!geoFeatures || geoFeatures.length === 0) return null;
    try {
        const proj4326 = new OpenLayers.Projection('EPSG:4326');
        const projMap  = W.map.getProjectionObject();
        const olFeatures = [];

        // Subsampler les features si trop nombreuses (performance)
        const step = geoFeatures.length > maxFeatures ? Math.ceil(geoFeatures.length / maxFeatures) : 1;

        const toOLPt = ([lon, lat]) => {
            const pt = new OpenLayers.Geometry.Point(lon, lat);
            pt.transform(proj4326, projMap);
            return pt;
        };

        const buildRing = (coordArr) => new OpenLayers.Geometry.LinearRing(coordArr.map(toOLPt));
        const buildLine = (coordArr) => new OpenLayers.Geometry.LineString(coordArr.map(toOLPt));

        geoFeatures.forEach((feat, idx) => {
            if(idx % step !== 0) return;
            const type   = feat.type;
            const coords = feat.coordinates;
            const isPolygon = type === 'Polygon' || type === 'MultiPolygon';
            const styleFeature = isPolygon
                ? { strokeColor: color, strokeWidth: 1.5, strokeOpacity: 0.8, fillColor: color, fillOpacity: 0.12 }
                : { strokeColor: color, strokeWidth: 3,   strokeOpacity: 0.85, fillOpacity: 0 };

            try {
                let geom = null;
                if(type === 'LineString') {
                    geom = buildLine(coords);
                } else if(type === 'MultiLineString') {
                    const lines = coords.map(buildLine);
                    geom = new OpenLayers.Geometry.Collection(lines);
                } else if(type === 'Polygon') {
                    const rings = coords.map(buildRing);
                    geom = new OpenLayers.Geometry.Polygon(rings);
                } else if(type === 'MultiPolygon') {
                    const polys = coords.map(rings => new OpenLayers.Geometry.Polygon(rings.map(buildRing)));
                    geom = new OpenLayers.Geometry.Collection(polys);
                }
                if(geom) olFeatures.push(new OpenLayers.Feature.Vector(geom, null, styleFeature));
            } catch(e) {}
        });

        if(olFeatures.length === 0) return null;
        const layer = new OpenLayers.Layer.Vector('WCT_TRACE_' + trackId, { displayInLayerSwitcher: false });
        layer.addFeatures(olFeatures);
        W.map.addLayer(layer);
        return layer;
    } catch(e) {
        return null;
    }
};

// ── Ajout d'un fichier (entrée commune) ──────────────────────────────────────

const _traceRegisterFile = (filename, type, parsedTracks) => {
    const fileId = _traceNewId('file');
    const datetime = new Date();
    _traceFiles.push({ fileId, filename, type, datetime, color: null, collapsed: false });

    parsedTracks.forEach(({ name, points, errors, isDataset, featureCount, geoFeatures }) => {
        const trackId  = _traceNewId('trk');
        const color    = _traceNextColor();
        // Shapefile : subsampling plus généreux (dataset dense)
        const maxPts   = isDataset ? 8000 : 3000;
        const sampled  = traceSubsample(points, maxPts);
        // Rendu OL : par features (shapefile) ou par points (autres formats)
        let olLayer = null;
        if(geoFeatures && geoFeatures.length > 0) {
            olLayer = _traceBuildOLFromFeatures(trackId, geoFeatures, color, maxPts);
        } else if(sampled.length > 0) {
            olLayer = _traceBuildOL(trackId, sampled, color);
        }
        if((sampled.length > 0 || (geoFeatures && geoFeatures.length > 0)) && !olLayer)
            errors.push(_pe('Erreur OpenLayers : layer non créé','OpenLayers error: layer not created','OpenLayers-Fehler: Layer nicht erstellt'));
        // Pour un dataset SHP : afficher le nombre de features dans le nom
        const displayName = (isDataset && featureCount) ? `${name} — ${featureCount} tronçons` : name;
        // Découpe automatique en lots si la trace dépasse une vue (bbox > seuil) : au-delà,
        // elle ne tient pas en mémoire d'un bloc et doit être traitée lot par lot.
        // ⚠️ Exclu : un shapefile MULTI-features (réseau) — ses points sont la concaténation
        // de tronçons non ordonnés géographiquement, le découpage séquentiel n'aurait aucun sens
        // (ex. « grand lyon » : 2463 tronçons → 1388 lots incohérents). Le mode lots est pour
        // les ITINÉRAIRES linéaires (GPX/KML/KMZ/GeoJSON, ou shapefile mono-tracé).
        let lots = null;
        if(sampled.length >= 2 && !(isDataset && featureCount > 1)){
            const bb = _covBBox(sampled);
            const mLon = Math.cos((bb.minLat+bb.maxLat)/2*Math.PI/180)*111320;
            const wKm = ((bb.maxLon-bb.minLon)*mLon)/1000, hKm = ((bb.maxLat-bb.minLat)*110540)/1000;
            if(wKm > SWEEP_LOT_KM || hKm > SWEEP_LOT_KM){
                lots = _sweepLots(sampled).map((L,i) => ({ idx:i+1, pts:L.pts, bbox:L.bbox, status:'todo' }));
            }
        }
        _traceTracks.push({
            trackId, fileId, name: displayName, type,
            sampledPts: sampled, total: points.length, sampled: sampled.length,
            color, olLayer, errors, visible: true, lots,
            geoFeatures: geoFeatures || null  // conservé pour recolor
        });
    });

    traceRenderTable();
    traceUpdateStripCtrl();
};

// Entrées publiques par format
const traceAddGpx = (filename, xmlText) => {
    _traceRegisterFile(filename, 'GPX', parseGpx(filename, xmlText));
};
const traceAddKml = (filename, xmlText) => {
    _traceRegisterFile(filename, 'KML', parseKml(filename, xmlText));
};
const traceAddKmz = async (filename, arrayBuffer) => {
    const parsed = await parseKmz(filename, arrayBuffer);
    _traceRegisterFile(filename, 'KMZ', parsed);
};
const traceAddGeoJSON = (filename, jsonText) => {
    _traceRegisterFile(filename, 'GeoJSON', parseGeoJSON(filename, jsonText));
};
const traceAddShapefile = async (filename, arrayBuffer) => {
    const parsed = await parseShapefile(filename, arrayBuffer);
    _traceRegisterFile(filename, 'SHP', parsed);
};

// ── Actions sur les tracks/fichiers ──────────────────────────────────────────

const traceSetTrackVisible = (trackId, visible) => {
    const trk = _traceTracks.find(t => t.trackId === trackId);
    if(!trk) return;
    trk.visible = visible;
    if(trk.olLayer) trk.olLayer.setVisibility(visible);
    traceUpdateStripCtrl();
    // Sync checkbox parent (fichier)
    const fileId = trk.fileId;
    const siblings = _traceTracks.filter(t => t.fileId === fileId);
    const allChecked  = siblings.every(t => t.visible);
    const someChecked = siblings.some(t => t.visible);
    const parentChk = document.querySelector(`.wct-trace-file-chk[data-fid="${fileId}"]`);
    if(parentChk) { parentChk.checked = someChecked; parentChk.indeterminate = someChecked && !allChecked; }
};

const traceSetFileVisible = (fileId, visible) => {
    _traceTracks.filter(t => t.fileId === fileId).forEach(t => {
        t.visible = visible;
        if(t.olLayer) t.olLayer.setVisibility(visible);
        const chk = document.querySelector(`.wct-trace-trk-chk[data-tid="${t.trackId}"]`);
        if(chk) { chk.checked = visible; chk.indeterminate = false; }
    });
    const parentChk = document.querySelector(`.wct-trace-file-chk[data-fid="${fileId}"]`);
    if(parentChk) { parentChk.checked = visible; parentChk.indeterminate = false; }
    traceUpdateStripCtrl();
};

const traceRemoveTrack = (trackId) => {
    const idx = _traceTracks.findIndex(t => t.trackId === trackId);
    if(idx === -1) return;
    const trk = _traceTracks[idx];
    if(trk.olLayer) { W.map.removeLayer(trk.olLayer); trk.olLayer.destroy(); }
    _traceTracks.splice(idx, 1);
    // Supprimer le fichier parent s'il n'a plus de tracks
    const fileId = trk.fileId;
    if(!_traceTracks.some(t => t.fileId === fileId)) {
        _traceFiles = _traceFiles.filter(f => f.fileId !== fileId);
    }
    _covClearGaps(); // un trou affiché peut devenir obsolète
    traceRenderTable();
    traceUpdateStripCtrl();
};

const traceRemoveFile = (fileId) => {
    const toRemove = _traceTracks.filter(t => t.fileId === fileId);
    toRemove.forEach(trk => {
        if(trk.olLayer) { W.map.removeLayer(trk.olLayer); trk.olLayer.destroy(); }
    });
    _traceTracks = _traceTracks.filter(t => t.fileId !== fileId);
    _traceFiles  = _traceFiles.filter(f => f.fileId !== fileId);
    _covClearGaps(); // un trou affiché peut devenir obsolète
    traceRenderTable();
    traceUpdateStripCtrl();
};

const traceSetColor = (trackId, color) => {
    const trk = _traceTracks.find(t => t.trackId === trackId);
    if(!trk) return;
    trk.color = color;
    if(trk.olLayer) {
        trk.olLayer.features.forEach(ft => {
            const isPolygon = ft.geometry && (
                ft.geometry.CLASS_NAME === 'OpenLayers.Geometry.Polygon' ||
                ft.geometry.CLASS_NAME === 'OpenLayers.Geometry.Collection'
            );
            ft.style = isPolygon
                ? { strokeColor: color, strokeWidth: 1.5, strokeOpacity: 0.8, fillColor: color, fillOpacity: 0.12 }
                : { strokeColor: color, strokeWidth: trk.geoFeatures ? 3 : 4, strokeOpacity: 0.85, fillOpacity: 0 };
        });
        trk.olLayer.redraw();
    }
    // Le swatch fichier repasse en "vide" si les tracks divergent
    const fileId = trk.fileId;
    const file = _traceFiles.find(f => f.fileId === fileId);
    if(file) file.color = null;
    traceRenderTable();
    document.querySelectorAll('.wct-gpx-palette').forEach(p => p.remove());
};

// Applique une couleur uniforme à tous les tracks d'un fichier
const traceSetFileColor = (fileId, color) => {
    const file = _traceFiles.find(f => f.fileId === fileId);
    if(!file) return;
    file.color = color;
    _traceTracks.filter(t => t.fileId === fileId).forEach(trk => {
        trk.color = color;
        if(trk.olLayer) {
            trk.olLayer.features.forEach(ft => {
                const isPolygon = ft.geometry && (
                    ft.geometry.CLASS_NAME === 'OpenLayers.Geometry.Polygon' ||
                    ft.geometry.CLASS_NAME === 'OpenLayers.Geometry.Collection'
                );
                ft.style = isPolygon
                    ? { strokeColor: color, strokeWidth: 1.5, strokeOpacity: 0.8, fillColor: color, fillOpacity: 0.12 }
                    : { strokeColor: color, strokeWidth: trk.geoFeatures ? 3 : 4, strokeOpacity: 0.85, fillOpacity: 0 };
            });
            trk.olLayer.redraw();
        }
    });
    traceRenderTable();
    document.querySelectorAll('.wct-gpx-palette').forEach(p => p.remove());
};


const traceFocus = (trackId) => {
    const trk = _traceTracks.find(t => t.trackId === trackId);
    if(!trk || !trk.sampledPts || trk.sampledPts.length === 0) return;
    try {
        const proj4326 = new OpenLayers.Projection('EPSG:4326');
        const proj3857 = new OpenLayers.Projection('EPSG:3857');
        let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
        trk.sampledPts.forEach(([lat, lon]) => {
            if(lon < minLon) minLon = lon; if(lon > maxLon) maxLon = lon;
            if(lat < minLat) minLat = lat; if(lat > maxLat) maxLat = lat;
        });
        const dLon = maxLon - minLon, dLat = maxLat - minLat;
        const mapDiv = W.map.div || document.getElementById('map');
        const mapW = mapDiv ? mapDiv.offsetWidth  : 800;
        const mapH = mapDiv ? mapDiv.offsetHeight : 600;
        const overlayW = 620;
        const zoomLon = Math.log2((mapW * 360) / (dLon * 256));
        const zoomLat = Math.log2((mapH * 360) / (dLat * 256));
        const zoom = Math.max(1, Math.min(17, Math.floor(Math.min(zoomLon, zoomLat)) - 1));
        const degPerPx = 360 / (256 * Math.pow(2, zoom));
        const adjustedLon = (minLon + maxLon) / 2 + (overlayW / 2) * degPerPx;
        const center = new OpenLayers.LonLat(adjustedLon, (minLat + maxLat) / 2).transform(proj4326, proj3857);
        W.map.moveTo(center, zoom);
    } catch(e) { console.error('WCT trace focus:', e); }
};

// ── Vérification de couverture ────────────────────────────────────────────────
// Identifie les segments WME empruntés par le tracé mais NON sélectionnés.
// Lecture pure : ne crée/modifie aucune fermeture.
// Méthode : pour chaque point du tracé (densifié à 3 m, restreint à la zone chargée),
// on rattache le segment WME le plus proche ; un segment est "emprunté" s'il est le
// plus proche d'au moins 2 points. Empruntés non sélectionnés = à fermer (surlignés).

const COVERAGE_SNAP_M    = 35;   // distance max point↔segment pour rattachement
const COVERAGE_DENSIFY_M = 3;    // pas de densification du tracé (capte les segments courts)
const COVERAGE_MIN_PTS   = 2;    // points min pour qu'un segment soit "emprunté" (anti-bruit)
const COVERAGE_SPAN_FRAC = 0.3;  // étendue min couverte du segment (anti-accrochage de carrefour)
const COVERAGE_MAX_EVAL  = 6000; // plafond de points évalués (perf)

let _coverageLayer = null; // calque OL distinct des calques de tracés

// Distance (m) d'un point [lat,lon] au segment de droite [a,b] (chacun [lat,lon])
// Projection en repère plan local équirectangulaire — suffisant à l'échelle de 30 m.
const _covDistPtToEdge = (p, a, b) => {
    const lat0 = p[0] * Math.PI / 180;
    const mLon = Math.cos(lat0) * 111320; // m par degré de longitude à cette latitude
    const mLat = 110540;                  // m par degré de latitude
    const px = p[1]*mLon, py = p[0]*mLat;
    const ax = a[1]*mLon, ay = a[0]*mLat;
    const bx = b[1]*mLon, by = b[0]*mLat;
    const dx = bx-ax, dy = by-ay;
    const len2 = dx*dx + dy*dy;
    let tt = len2 > 0 ? ((px-ax)*dx + (py-ay)*dy)/len2 : 0;
    tt = Math.max(0, Math.min(1, tt));
    const cx = ax + tt*dx, cy = ay + tt*dy;
    return Math.hypot(px-cx, py-cy);
};

// Projection d'un point sur une arête : renvoie { tt (∈[0,1]), dist (m) }
const _covProjEdge = (p, a, b) => {
    const lat0 = p[0] * Math.PI / 180;
    const mLon = Math.cos(lat0) * 111320, mLat = 110540;
    const px = p[1]*mLon, py = p[0]*mLat;
    const ax = a[1]*mLon, ay = a[0]*mLat;
    const bx = b[1]*mLon, by = b[0]*mLat;
    const dx = bx-ax, dy = by-ay;
    const len2 = dx*dx + dy*dy;
    let tt = len2 > 0 ? ((px-ax)*dx + (py-ay)*dy)/len2 : 0;
    tt = Math.max(0, Math.min(1, tt));
    return { tt, dist: Math.hypot(px-(ax+tt*dx), py-(ay+tt*dy)) };
};

// Boîte englobante d'un ensemble de points [lat,lon]
const _covBBox = (pts) => {
    let minLat=Infinity, maxLat=-Infinity, minLon=Infinity, maxLon=-Infinity;
    for(const p of pts){ const la=p[0], lo=p[1];
        if(la<minLat)minLat=la; if(la>maxLat)maxLat=la;
        if(lo<minLon)minLon=lo; if(lo>maxLon)maxLon=lo; }
    return { minLat, maxLat, minLon, maxLon };
};

// Segments WME chargés dont l'emprise recoupe la bbox du tracé (+marge).
// Lit la géométrie sur attributes.geoJSONGeometry (WGS84 [lon,lat]) — confirmé terrain.
// Renvoie [{ id, edges:[[[lat,lon],[lat,lon]]], lonlat:[[lon,lat]], length, fromNode, toNode }]
const _covCandidateSegments = (tb, marginDeg) => {
    let segs = [];
    try { segs = W.model.segments.getObjectArray(); } catch(e){ return []; }
    const bMinLat=tb.minLat-marginDeg, bMaxLat=tb.maxLat+marginDeg,
          bMinLon=tb.minLon-marginDeg, bMaxLon=tb.maxLon+marginDeg;
    const out = [];
    for(const s of segs){
        const a = s.attributes;
        const g = a && a.geoJSONGeometry;
        if(!g || g.type !== 'LineString' || !Array.isArray(g.coordinates) || g.coordinates.length < 2) continue;
        // bbox du segment + test d'intersection rapide
        let sMinLat=Infinity,sMaxLat=-Infinity,sMinLon=Infinity,sMaxLon=-Infinity;
        for(const c of g.coordinates){ const lo=c[0], la=c[1];
            if(la<sMinLat)sMinLat=la; if(la>sMaxLat)sMaxLat=la;
            if(lo<sMinLon)sMinLon=lo; if(lo>sMaxLon)sMaxLon=lo; }
        if(sMaxLat<bMinLat || sMinLat>bMaxLat || sMaxLon<bMinLon || sMinLon>bMaxLon) continue; // disjoint
        const edges = [];
        for(let i=0;i<g.coordinates.length-1;i++){
            const c1=g.coordinates[i], c2=g.coordinates[i+1];
            if(!Array.isArray(c1)||!Array.isArray(c2)) continue;
            edges.push([[c1[1],c1[0]],[c2[1],c2[0]]]); // [lon,lat] → [lat,lon]
        }
        if(!edges.length) continue;
        // longueur réelle (préférer l'attribut length s'il existe)
        const len = (typeof a.length === 'number' && a.length > 0) ? a.length
            : edges.reduce((s2,e)=>{ const lat0=e[0][0]*Math.PI/180, mLon=Math.cos(lat0)*111320;
                return s2 + Math.hypot((e[1][1]-e[0][1])*mLon, (e[1][0]-e[0][0])*110540); }, 0);
        out.push({ id: Number(a.id), edges, lonlat: g.coordinates, length: len,
                   fromNode: a.fromNodeID ?? null, toNode: a.toNodeID ?? null });
    }
    return out;
};

// Densifie un tracé [lat,lon] à un pas donné en mètres (capte les segments courts)
const _covDensify = (pts, stepM) => {
    if(pts.length < 2) return pts.slice();
    const out = [pts[0]];
    for(let i=1;i<pts.length;i++){
        const a=pts[i-1], b=pts[i];
        const lat0=a[0]*Math.PI/180, mLon=Math.cos(lat0)*111320;
        const dist=Math.hypot((b[1]-a[1])*mLon, (b[0]-a[0])*110540);
        if(dist>stepM){ const n=Math.floor(dist/stepM);
            for(let k=1;k<=n;k++){ const f=k/(n+1); out.push([a[0]+(b[0]-a[0])*f, a[1]+(b[1]-a[1])*f]); } }
        out.push(b);
    }
    return out;
};

// Regroupe des segments en zones connexes (partage de nœud) — union-find
const _covGroupByNode = (segObjs) => {
    const parent = {};
    const find = x => { while(parent[x]!==x){ parent[x]=parent[parent[x]]; x=parent[x]; } return x; };
    segObjs.forEach(s => { parent[s.id]=s.id; });
    const byNode = {};
    segObjs.forEach(s => { [s.fromNode, s.toNode].forEach(n => {
        if(n==null) return; (byNode[n]=byNode[n]||[]).push(s.id); }); });
    Object.values(byNode).forEach(ids => {
        for(let i=1;i<ids.length;i++){ const ra=find(ids[0]), rb=find(ids[i]); if(ra!==rb) parent[ra]=rb; } });
    const groups = {};
    segObjs.forEach(s => { const r=find(s.id); (groups[r]=groups[r]||[]).push(s); });
    return Object.values(groups);
};

// Efface le calque de trous
const _covClearGaps = () => {
    if(_coverageLayer){
        try { W.map.removeLayer(_coverageLayer); _coverageLayer.destroy(); } catch(e){}
        _coverageLayer = null;
    }
    const res = document.getElementById('wct-coverage-result');
    if(res){ res.style.display = 'none'; res.innerHTML = ''; }
};

// Dessine les SEGMENTS empruntés non sélectionnés (suit la géométrie réelle des routes)
// magenta pointillé + halo blanc — calque dédié WCT_COVERAGE_GAPS
const _covDrawGaps = (segObjs) => {
    if(_coverageLayer){ try { W.map.removeLayer(_coverageLayer); _coverageLayer.destroy(); } catch(e){} _coverageLayer = null; }
    if(!segObjs || !segObjs.length) return;
    try {
        const proj4326 = new OpenLayers.Projection('EPSG:4326');
        const projMap  = W.map.getProjectionObject();
        const feats = [];
        segObjs.forEach(s => {
            // s.lonlat : [[lon,lat],...] — géométrie réelle du segment
            if(!Array.isArray(s.lonlat) || s.lonlat.length < 2) return;
            const olPts = s.lonlat.map(([lon,lat]) => {
                const pt = new OpenLayers.Geometry.Point(lon, lat); pt.transform(proj4326, projMap); return pt;
            });
            const line = new OpenLayers.Geometry.LineString(olPts);
            feats.push(new OpenLayers.Feature.Vector(line.clone(), null,
                { strokeColor:'#ffffff', strokeWidth:11, strokeOpacity:0.9, strokeLinecap:'round' }));
            feats.push(new OpenLayers.Feature.Vector(line, null,
                { strokeColor:'#d500f9', strokeWidth:5, strokeOpacity:1, strokeDashstyle:'dash', strokeLinecap:'round' }));
        });
        const layer = new OpenLayers.Layer.Vector('WCT_COVERAGE_GAPS', { displayInLayerSwitcher:false });
        layer.addFeatures(feats);
        W.map.addLayer(layer);
        _coverageLayer = layer;
    } catch(e){ console.error('WCT coverage draw:', e); }
};

// Calcule la zone libre de la carte (hors overlay droit et sidebar gauche)
// et retourne {freeLeft, freeRight, freeWidth, mapW, mapH} en pixels dans le div carte
// Zone libre de la carte = du bord gauche du div carte au bord gauche de l'overlay.
// Position PAR DÉFAUT de l'overlay (right:60px, width:620px).
const _getMapFreeZone=()=>{
    const mapDiv=W.map?.div||document.getElementById('map');
    const mapW=mapDiv?mapDiv.offsetWidth:800;
    const mapH=mapDiv?mapDiv.offsetHeight:600;
    const OVERLAY_W=620, OVERLAY_RIGHT=60;
    const freeRight=mapW-OVERLAY_W-OVERLAY_RIGHT; // bord gauche de l'overlay
    return {freeLeft:0, freeRight, freeWidth:freeRight, mapW, mapH};
};

// Recentre la carte pour qu'un point WGS84 apparaisse au centre de la zone libre
// (à gauche de l'overlay). Utilise les conversions pixel SDK — aucune approximation projection.
const _shiftCenterToFreeZone=(targetLon,targetLat)=>{
    try{
        const {freeWidth,mapH}=_getMapFreeZone();
        // Pixel-cible (centre de la zone libre), relatif au div carte
        const targetPxX=freeWidth/2;
        const targetPxY=mapH/2;
        // Coordonnées actuellement affichées à ce pixel
        const atTarget=sdk.Map.getLonLatFromMapPixel({x:targetPxX,y:targetPxY});
        // Centre actuel de la carte
        const center=sdk.Map.getMapCenter();
        // Pour que le segment (targetLon/Lat) se retrouve au pixel-cible,
        // on déplace le centre du même vecteur (différence centre ↔ point au pixel-cible)
        const newLon=center.lon+(targetLon-atTarget.lon);
        const newLat=center.lat+(targetLat-atTarget.lat);
        sdk.Map.setMapCenter({lonLat:{lon:newLon,lat:newLat}});
    }catch(e){ console.warn('[WCT] _shiftCenterToFreeZone:',e); }
};

// Extrait les coordonnées WGS84 [[lon,lat],...] d'un objet segment (SDK ou legacy)
const _getSegCoords=(seg)=>{
    if(!seg) return null;
    if(seg.geometry?.coordinates?.length>=2) return seg.geometry.coordinates;
    if(seg.attributes?.geoJSONGeometry?.coordinates?.length>=2) return seg.attributes.geoJSONGeometry.coordinates;
    return null;
};

// Centre la carte sur un segment au zoom voulu, décalé dans la zone libre.
const centerOnSegmentBbox=(coords,zoomLevel=17)=>{
    if(!coords||!coords.length) return;
    try{
        let minLon=Infinity,maxLon=-Infinity,minLat=Infinity,maxLat=-Infinity;
        coords.forEach(([lon,lat])=>{
            if(lon<minLon)minLon=lon; if(lon>maxLon)maxLon=lon;
            if(lat<minLat)minLat=lat; if(lat>maxLat)maxLat=lat;
        });
        const cLon=(minLon+maxLon)/2, cLat=(minLat+maxLat)/2;
        // 1) Fixer le zoom et centrer brutalement (le SDK met le point au centre du viewport)
        sdk.Map.setMapCenter({lonLat:{lon:cLon,lat:cLat},zoomLevel});
        // 2) Une fois le zoom appliqué, recentrer dans la zone libre via conversion pixel réelle
        setTimeout(()=>_shiftCenterToFreeZone(cLon,cLat),150);
    }catch(e){
        console.warn('WCT centerOnSegmentBbox:',e);
        try{
            const mid=coords[Math.floor(coords.length/2)];
            sdk.Map.setMapCenter({lonLat:{lon:mid[0],lat:mid[1]},zoomLevel:15});
        }catch(e2){}
    }
};

// Conservée pour compat : centre un point unique dans la zone libre
const centerWithOverlayOffset=(lon,lat,zoomLevel=17)=>{
    try{
        sdk.Map.setMapCenter({lonLat:{lon,lat},zoomLevel});
        setTimeout(()=>_shiftCenterToFreeZone(lon,lat),150);
    }catch(e){
        try{ sdk.Map.setMapCenter({lonLat:{lon,lat},zoomLevel}); }catch(e2){}
    }
};

// Centre la carte sur une zone (cadre la bbox de ses segments), comme traceFocus
const _covFocusGap = (zone) => {
    if(!zone || !zone.segs || zone.segs.length === 0) return;
    try {
        const proj4326 = new OpenLayers.Projection('EPSG:4326');
        const proj3857 = new OpenLayers.Projection('EPSG:3857');
        let minLon=Infinity, maxLon=-Infinity, minLat=Infinity, maxLat=-Infinity;
        zone.segs.forEach(s => s.lonlat.forEach(([lon,lat]) => {
            if(lon < minLon) minLon = lon; if(lon > maxLon) maxLon = lon;
            if(lat < minLat) minLat = lat; if(lat > maxLat) maxLat = lat;
        }));
        const dLon = Math.max(maxLon - minLon, 0.0005);
        const dLat = Math.max(maxLat - minLat, 0.0005);
        const mapDiv = W.map.div || document.getElementById('map');
        const mapW = mapDiv ? mapDiv.offsetWidth  : 800;
        const mapH = mapDiv ? mapDiv.offsetHeight : 600;
        const overlayW = 620;
        const zoomLon = Math.log2((mapW * 360) / (dLon * 256));
        const zoomLat = Math.log2((mapH * 360) / (dLat * 256));
        const zoom = Math.max(1, Math.min(18, Math.floor(Math.min(zoomLon, zoomLat)) - 1));
        const degPerPx = 360 / (256 * Math.pow(2, zoom));
        const adjustedLon = (minLon + maxLon) / 2 + (overlayW / 2) * degPerPx;
        const center = new OpenLayers.LonLat(adjustedLon, (minLat + maxLat) / 2).transform(proj4326, proj3857);
        W.map.moveTo(center, zoom);
    } catch(e){ console.error('WCT coverage focus:', e); }
};

// ── Briques de matching tracé→segments, réutilisées par la couverture ET le balayage ──
// Construit l'index géométrique d'une liste de candidats : arêtes à plat (avec offset
// cumulé), grille spatiale, et longueur polyligne par segment.
const _covBuildIndex = (candList) => {
    const edges = [];
    const segPolyLen = {};
    for(const c of candList){
        let cum = 0;
        for(const e of c.edges){
            const lat0 = e[0][0]*Math.PI/180, mLon = Math.cos(lat0)*111320;
            const len = Math.hypot((e[1][1]-e[0][1])*mLon, (e[1][0]-e[0][0])*110540);
            edges.push({ a:e[0], b:e[1], id:c.id, cum, L:len });
            cum += len;
        }
        segPolyLen[c.id] = cum;
    }
    const cellDeg = 0.0006; // ~40 m : garantit le voisinage 3×3 ≥ snap en lat et lon (France)
    const grid = new Map();
    for(let idx=0; idx<edges.length; idx++){
        const e = edges[idx];
        const iMin=Math.floor(Math.min(e.a[0],e.b[0])/cellDeg), iMax=Math.floor(Math.max(e.a[0],e.b[0])/cellDeg);
        const jMin=Math.floor(Math.min(e.a[1],e.b[1])/cellDeg), jMax=Math.floor(Math.max(e.a[1],e.b[1])/cellDeg);
        for(let i=iMin;i<=iMax;i++) for(let j=jMin;j<=jMax;j++){
            const k=i+'|'+j; let arr=grid.get(k); if(!arr){ arr=[]; grid.set(k,arr); } arr.push(idx);
        }
    }
    return { edges, grid, segPolyLen, cellDeg };
};

// Accumulateur vide : compteurs de points et étendue longée, cumulés sur un ou plusieurs
// appels (le balayage accumule à travers les tronçons ; la couverture fait un seul appel).
const _covNewAcc = () => ({ cnt:{}, spanMin:{}, spanMax:{}, segLen:{} });

// Rattache chaque point au segment le plus proche (≤ snap) via la grille, et met à jour
// l'accumulateur (nombre de points + étendue min/max le long du segment).
const _covAccumulate = (evalPts, index, acc) => {
    const { edges, grid, cellDeg, segPolyLen } = index;
    for(const id in segPolyLen){ if(acc.segLen[id] === undefined) acc.segLen[id] = segPolyLen[id]; }
    for(let i=0;i<evalPts.length;i++){
        const p = evalPts[i];
        const ci=Math.floor(p[0]/cellDeg), cj=Math.floor(p[1]/cellDeg);
        let dmin = Infinity, best = null, bestT = 0;
        for(let di=-1; di<=1; di++) for(let dj=-1; dj<=1; dj++){
            const arr = grid.get((ci+di)+'|'+(cj+dj));
            if(!arr) continue;
            for(let a2=0;a2<arr.length;a2++){
                const e = edges[arr[a2]];
                const pr = _covProjEdge(p, e.a, e.b);
                if(pr.dist < dmin){ dmin = pr.dist; best = e; bestT = pr.tt; }
            }
        }
        if(dmin <= COVERAGE_SNAP_M && best){
            const id = best.id;
            const d = best.cum + bestT * best.L; // distance le long du segment
            acc.cnt[id] = (acc.cnt[id]||0) + 1;
            if(acc.spanMin[id] === undefined || d < acc.spanMin[id]) acc.spanMin[id] = d;
            if(acc.spanMax[id] === undefined || d > acc.spanMax[id]) acc.spanMax[id] = d;
        }
    }
};

// Segment "emprunté" = ≥ MIN_PTS points ET étendue couverte ≥ SPAN_FRAC de sa longueur.
const _covFinalizeUsed = (acc) => Object.keys(acc.cnt).filter(id => {
    if(acc.cnt[id] < COVERAGE_MIN_PTS) return false;
    const len = acc.segLen[id] || 0;
    const span = acc.spanMax[id] - acc.spanMin[id];
    return len > 0 && (span / len) >= COVERAGE_SPAN_FRAC;
}).map(Number);

// Cœur : segments empruntés par le tracé mais non sélectionnés.
// Retourne { pct, zones:[{segs}], uncov:[seg], nUncov, outsideFrac } ou { error }.
const traceCoverage = (fileId) => {
    const sel = getSelection();
    if(!(sel.ids.length > 0 && sel.objectType === 'segment')) return { error: t('covNoSel') };
    const selSet = new Set(sel.ids.map(Number));

    // Points cumulés de tous les tracés du fichier
    let pts = [];
    _traceTracks.filter(tk => tk.fileId === fileId).forEach(tk => {
        if(tk.sampledPts && tk.sampledPts.length) pts = pts.concat(tk.sampledPts);
    });
    if(pts.length === 0) return { error: t('covNoPts') };

    // Segments candidats (préfiltrage spatial par bbox + marge ~60 m)
    const tb = _covBBox(pts);
    const cand = _covCandidateSegments(tb, 0.0006);
    if(cand.length === 0) return { error: t('covNoSeg') };
    const candById = new Map(cand.map(c => [c.id, c]));

    // Restreindre les points du tracé à la zone réellement chargée (bbox des candidats)
    const lb = _covBBox(cand.flatMap(c => c.edges.flatMap(e => e)));
    const m = 0.0006;
    const inZone = pts.filter(p => p[0]>=lb.minLat-m && p[0]<=lb.maxLat+m && p[1]>=lb.minLon-m && p[1]<=lb.maxLon+m);
    const outsideFrac = pts.length ? (pts.length - inZone.length) / pts.length : 0;
    if(inZone.length < 2) return { error: t('covNoOverlap') };

    // Densifier à 3 m (capte les segments courts), plafonner pour la perf
    let evalPts = _covDensify(inZone, COVERAGE_DENSIFY_M);
    if(evalPts.length > COVERAGE_MAX_EVAL) evalPts = traceSubsample(evalPts, COVERAGE_MAX_EVAL);

    // Rattachement points→segments via les briques mutualisées (un seul appel ici)
    const index = _covBuildIndex(cand);
    const acc = _covNewAcc();
    _covAccumulate(evalPts, index, acc);
    const usedIds = _covFinalizeUsed(acc);
    const coveredIds   = usedIds.filter(id => selSet.has(id));
    const uncoveredIds = usedIds.filter(id => !selSet.has(id));

    // Couverture pondérée par longueur (plancher si trou subsiste → jamais de faux 100 %)
    const lenOf = id => { const c = candById.get(id); return c ? c.length : 0; };
    const covLen  = coveredIds.reduce((s,id)=>s+lenOf(id), 0);
    const usedLen = usedIds.reduce((s,id)=>s+lenOf(id), 0);
    let pct = usedLen > 0 ? (covLen * 100 / usedLen) : 0;
    pct = uncoveredIds.length > 0 ? Math.floor(pct) : Math.round(pct);

    // Zones = composantes connexes des segments non sélectionnés (partage de nœud)
    const uncov = uncoveredIds.map(id => candById.get(id)).filter(Boolean);
    const groups = _covGroupByNode(uncov);
    const zones = groups.map(segs => ({ segs }));

    return { pct, zones, uncov, nUncov: uncoveredIds.length, nUsed: usedIds.length, outsideFrac };
};

// Lance la vérif pour un fichier et restitue résultat texte + visuel
const traceRunCoverage = (fileId) => {
    const res = traceCoverage(fileId);
    const panel = document.getElementById('wct-coverage-result');
    if(!panel) return;
    panel.style.display = 'block';
    if(res.error){
        _covDrawGaps([]);
        panel.innerHTML = `<span style="color:var(--wct-red)">${escHtml(res.error)}</span>`;
        return;
    }
    // Surligne les segments empruntés non sélectionnés (suit les routes)
    _covDrawGaps(res.uncov);

    const head = `<div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
        <b style="flex:1">${escHtml(t('covResult', res.pct, res.nUncov))}</b>
        <button class="wct-cov-clear wct-btn wct-btn-sm" title="${t('covClear')}">\u2715 ${t('covClear')}</button>
    </div>`;
    // Légende explicite : magenta = à fermer
    const legend = res.nUncov > 0
        ? `<div style="font-size:0.833em;color:var(--wct-text2);margin-bottom:4px">${escHtml(t('covLegend'))}</div>`
        : `<div style="font-size:0.875em;color:var(--wct-green,#2e7d32);margin-bottom:4px">${escHtml(t('covAllOk'))}</div>`;
    const list = res.zones.map((z,i) => {
        const nSeg = z.segs.length;
        return `<div style="display:flex;align-items:center;gap:6px;font-size:0.917em;padding:2px 0">
            <span style="flex:1;color:var(--wct-text2)">\uD83D\uDFE3 ${escHtml(t('covZone', i+1, nSeg))}</span>
            <button class="wct-cov-focus wct-btn wct-btn-sm" data-gi="${i}" title="${t('covFocus')}">\uD83C\uDFAF</button>
        </div>`;
    }).join('');
    const outNote = (res.outsideFrac >= 0.05)
        ? `<div style="font-size:0.833em;color:var(--wct-text2);margin-top:4px;font-style:italic">${escHtml(t('covOutside', Math.round(res.outsideFrac*100)))}</div>`
        : '';
    panel.innerHTML = head + legend + list + outNote;
    panel.querySelector('.wct-cov-clear')?.addEventListener('click', _covClearGaps);
    panel.querySelectorAll('.wct-cov-focus').forEach(btn => {
        btn.addEventListener('click', e => {
            const gi = parseInt(e.currentTarget.dataset.gi, 10);
            if(res.zones[gi]) _covFocusGap(res.zones[gi]);
        });
    });
};

// Affiche/masque les boutons couverture selon l'état de sélection (appelé depuis updateFab)
const traceUpdateCoverageBtns = () => {
    const show = hasSel();
    document.querySelectorAll('.wct-trace-file-cov').forEach(b => { b.style.display = show ? '' : 'none'; });
};

// Strip globale
// ═══════════════════════════════════════════════════════════════════════════
//  BALAYAGE : sélectionner les segments d'un tracé en déplaçant la carte
// ═══════════════════════════════════════════════════════════════════════════
// WME ne garde en mémoire que ce qui est chargé autour de la vue — MAIS il retient
// les objets SÉLECTIONNÉS même hors écran (vérifié en live jusqu'à ~5 km). On exploite
// ça : on longe le tracé par tronçons, on matche les segments locaux, et on re-sélectionne
// le cumul à chaque étape — ce qui maintient en mémoire les segments déjà captés.
const SWEEP_STEP_M    = 1000; // longueur de tracé traitée par tronçon (balayage trace courte)
const SWEEP_ZOOM      = 15;   // zoom de chargement : mesuré, WME charge bien les segments
                             // sur ~7,4×5,7 km à z15 (4× z16) ; z14 sous-échantillonne, à éviter
const SWEEP_SETTLE_MS = 350;  // délai après recentrage avant d'attendre le chargement
const SWEEP_WARN_ANCHORS = 60;// au-delà de ce nombre de sauts, on demande confirmation

let _sweepRunning = false, _sweepAborted = false;
const requestSweepAbort = () => { if(_sweepRunning) _sweepAborted = true; };
const _sweepSleep = ms => new Promise(r => setTimeout(r, ms));

// Découpe le tracé en tronçons d'environ stepM mètres → [[i0,i1], ...]
const _sweepSlices = (pts, stepM) => {
    const slices = [];
    let i0 = 0, acc = 0;
    for(let i=1;i<pts.length;i++){
        const a=pts[i-1], b=pts[i];
        const lat0=a[0]*Math.PI/180, mLon=Math.cos(lat0)*111320;
        acc += Math.hypot((b[1]-a[1])*mLon, (b[0]-a[0])*110540);
        if(acc >= stepM){ slices.push([i0, i]); i0 = i; acc = 0; }
    }
    if(i0 < pts.length-1) slices.push([i0, pts.length-1]);
    return slices;
};
const _trackLenM = (pts) => {
    let L=0;
    for(let i=1;i<pts.length;i++){ const a=pts[i-1],b=pts[i];
        const lat0=a[0]*Math.PI/180, mLon=Math.cos(lat0)*111320;
        L += Math.hypot((b[1]-a[1])*mLon, (b[0]-a[0])*110540); }
    return L;
};

const _sweepPanel = () => document.getElementById('wct-coverage-result');
const _sweepShowText = (html) => { const p=_sweepPanel(); if(p){ p.style.display='block'; p.innerHTML=html; } };
const _sweepShowProgress = (done, total, nSel) => {
    const p = _sweepPanel(); if(!p) return;
    p.style.display = 'block';
    const pct = total ? Math.round(done*100/total) : 0;
    p.innerHTML = `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
        <b style="flex:1">${escHtml(t('sweepProgress', done, total, nSel))}</b>
        <button class="wct-sweep-stop wct-btn wct-btn-danger wct-btn-sm">${t('btnStop')}</button>
      </div>
      <div class="wct-pb-wrap" style="display:block"><div class="wct-pb-fill" style="width:${pct}%"></div></div>`;
    p.querySelector('.wct-sweep-stop')?.addEventListener('click', requestSweepAbort);
};

// Balaie tous les tracés d'un fichier et sélectionne les segments empruntés.
const traceSweepSelect = async (fileId) => {
    if(_sweepRunning) return;
    let pts = [];
    _traceTracks.filter(tk => tk.fileId === fileId).forEach(tk => { if(tk.sampledPts?.length) pts = pts.concat(tk.sampledPts); });
    if(pts.length < 2){ _sweepShowText(`<span style="color:var(--wct-red)">${escHtml(t('covNoPts'))}</span>`); return; }

    const slices = _sweepSlices(pts, SWEEP_STEP_M);
    if(slices.length > SWEEP_WARN_ANCHORS && !confirm(t('sweepConfirm', slices.length, (_trackLenM(pts)/1000).toFixed(1)))) return;

    _sweepRunning = true; _sweepAborted = false;
    _covClearGaps();
    const savedCenter = sdk.Map.getMapCenter();
    const savedZoom   = sdk.Map.getZoomLevel();
    _sweepShowProgress(0, slices.length, 0);

    const acc = _covNewAcc();
    let selIds = [];
    try {
        for(let k=0;k<slices.length;k++){
            if(_sweepAborted) break;
            const slice = pts.slice(slices[k][0], slices[k][1]+1);
            const mid = slice[Math.floor(slice.length/2)];
            sdk.Map.setMapCenter({lonLat:{lon:mid[1], lat:mid[0]}, zoomLevel:SWEEP_ZOOM});
            await _sweepSleep(SWEEP_SETTLE_MS);
            await waitMapLoaded();
            await _sweepSleep(120);
            if(_sweepAborted) break;
            const cand = _covCandidateSegments(_covBBox(slice), 0.0008);
            if(cand.length){
                const index = _covBuildIndex(cand);
                _covAccumulate(_covDensify(slice, COVERAGE_DENSIFY_M), index, acc);
                selIds = _covFinalizeUsed(acc);
                // Re-sélectionner le cumul : garde en mémoire les segments déjà captés (hors vue)
                try { sdk.Editing.setSelection({selection:{ids:selIds, objectType:'segment'}}); } catch(e){ log('sweep setSelection: '+e.message); }
            }
            _sweepShowProgress(k+1, slices.length, selIds.length);
        }
    } catch(e){ log('sweep error: '+e.message); }

    // Rendre la carte de départ (la sélection persiste indépendamment de la vue)
    try { sdk.Map.setMapCenter({lonLat:{lon:savedCenter.lon, lat:savedCenter.lat}, zoomLevel:savedZoom}); } catch(e){}
    const aborted = _sweepAborted;
    _sweepRunning = false;
    const color = aborted ? '#f57c00' : 'var(--wct-green,#2e7d32)';
    _sweepShowText(`<div style="color:${color};font-weight:600">${escHtml(t(aborted?'sweepStopped':'sweepDone', selIds.length))}</div>`);
    updateFab(); updateCountryInfo();
};

// ═══════════════════════════════════════════════════════════════════════════
//  MODE LOTS : tracé trop long pour tenir en mémoire → découpe en lots
// ═══════════════════════════════════════════════════════════════════════════
// WME n'expose qu'une vue à la fois (~3×2 km à zoom 16, mesuré). Un long tracé est
// donc découpé en LOTS dont la bbox tient dans une vue : chacun devient une entrée de
// file autonome, applicable en une fois une fois la carte recadrée dessus (brique 2).
const SWEEP_LOT_KM = 4.5; // bbox maximale d'un lot : tient dans une vue zoom 15 (~7,4×5,7 km
                          // mesuré) avec marge pour charger les segments accrochés aux bords

// Découpe les points en lots dont la bbox reste sous SWEEP_LOT_KM → [{pts, bbox}]
const _sweepLots = (pts) => {
    const lots = [];
    const mLat = 110540;
    let cur = [pts[0]], minLat=pts[0][0], maxLat=pts[0][0], minLon=pts[0][1], maxLon=pts[0][1];
    const kmOf = (a,b,c,d) => {
        const mLon = Math.cos(((a+b)/2)*Math.PI/180)*111320;
        return { w:((d-c)*mLon)/1000, h:((b-a)*mLat)/1000 };
    };
    for(let i=1;i<pts.length;i++){
        const p = pts[i];
        const nMinLat=Math.min(minLat,p[0]), nMaxLat=Math.max(maxLat,p[0]);
        const nMinLon=Math.min(minLon,p[1]), nMaxLon=Math.max(maxLon,p[1]);
        const {w,h} = kmOf(nMinLat,nMaxLat,nMinLon,nMaxLon);
        if((w>SWEEP_LOT_KM || h>SWEEP_LOT_KM) && cur.length>=2){
            lots.push({ pts:cur, bbox:{minLat,maxLat,minLon,maxLon} });
            // Nouveau lot amorcé sur le dernier segment (continuité du tracé)
            cur = [pts[i-1], p];
            minLat=Math.min(pts[i-1][0],p[0]); maxLat=Math.max(pts[i-1][0],p[0]);
            minLon=Math.min(pts[i-1][1],p[1]); maxLon=Math.max(pts[i-1][1],p[1]);
        } else {
            cur.push(p);
            minLat=nMinLat; maxLat=nMaxLat; minLon=nMinLon; maxLon=nMaxLon;
        }
    }
    if(cur.length>=2) lots.push({ pts:cur, bbox:{minLat,maxLat,minLon,maxLon} });
    return lots;
};

const _sweepShowLotProgress = (done, total, added, seg) => {
    const p = _sweepPanel(); if(!p) return;
    p.style.display = 'block';
    const pct = total ? Math.round(done*100/total) : 0;
    p.innerHTML = `<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
        <b style="flex:1">${escHtml(t('lotsProgress', done, total, added, seg))}</b>
        <button class="wct-sweep-stop wct-btn wct-btn-danger wct-btn-sm">${t('btnStop')}</button>
      </div>
      <div style="font-size:0.833em;color:var(--wct-text2);margin-bottom:4px">${escHtml(t('lotsWhyMoving'))}</div>
      <div class="wct-pb-wrap" style="display:block"><div class="wct-pb-fill" style="width:${pct}%"></div></div>`;
    p.querySelector('.wct-sweep-stop')?.addEventListener('click', requestSweepAbort);
};

// Découpe le tracé en lots et crée une entrée de file par lot, avec la config
// courante de l'onglet Configurer. La carte se déplace lot par lot pour charger
// les segments à capter. N'applique RIEN (les fermetures sont posées en brique 2).
const traceGenerateLots = async (fileId) => {
    if(_sweepRunning) return;
    // 1) La config doit être réglée dans l'onglet Configurer (période/horaires…)
    const rc = await buildClosureList();
    if(rc.error || !rc.list.length){
        _sweepShowText(`<span style="color:var(--wct-red)">${escHtml(t('lotsNeedConfig'))}</span>`);
        // Amener l'utilisateur au bon endroit
        document.querySelector('#wct-main-tabs .wct-main-tab[data-tab="cfg"]')?.click();
        return;
    }
    const cfg = readConfig();

    // 2) Points du tracé → lots
    let pts = [];
    _traceTracks.filter(tk => tk.fileId === fileId).forEach(tk => { if(tk.sampledPts?.length) pts = pts.concat(tk.sampledPts); });
    if(pts.length < 2){ _sweepShowText(`<span style="color:var(--wct-red)">${escHtml(t('covNoPts'))}</span>`); return; }
    const lots = _sweepLots(pts);
    if(!confirm(t('lotsConfirm', lots.length))) return;

    // 3) Balayage lot par lot : un recadrage par lot suffit (le lot tient dans la vue)
    _sweepRunning = true; _sweepAborted = false;
    _covClearGaps();
    const savedCenter = sdk.Map.getMapCenter();
    const savedZoom   = sdk.Map.getZoomLevel();
    _sweepShowLotProgress(0, lots.length, 0, 0);

    let added = 0, totalSeg = 0;
    try {
        for(let k=0;k<lots.length;k++){
            if(_sweepAborted) break;
            const lot = lots[k];
            sdk.Map.setMapCenter({lonLat:{lon:(lot.bbox.minLon+lot.bbox.maxLon)/2, lat:(lot.bbox.minLat+lot.bbox.maxLat)/2}, zoomLevel:SWEEP_ZOOM});
            await _sweepSleep(SWEEP_SETTLE_MS);
            await waitMapLoaded();
            await _sweepSleep(120);
            if(_sweepAborted) break;
            // Matcher les segments empruntés dans ce lot
            const cand = _covCandidateSegments(_covBBox(lot.pts), 0.0008);
            const acc = _covNewAcc();
            if(cand.length){
                const index = _covBuildIndex(cand);
                _covAccumulate(_covDensify(lot.pts, COVERAGE_DENSIFY_M), index, acc);
            }
            const lotSegIds = _covFinalizeUsed(acc);
            if(lotSegIds.length){
                const dirConflicts = getSegDirConflicts(lotSegIds, parseInt(cfg.direction));
                const validIds = lotSegIds.filter(id => !dirConflicts.find(c => c.sid === Number(id)));
                if(validIds.length){
                    const entry = {...makeEntry(validIds, cfg, rc.list), source:'sweep', lotBbox:lot.bbox, lotIndex:added+1, label:`📦 ${cfg.reason||t('defaultClosure')} · #${added+1}`};
                    if(dirConflicts.length) entry.excludedSegs = dirConflicts;
                    // Les segments viennent d'être chargés (carte centrée) → sains à cet instant
                    entry.nullSegs = new Set(); entry.recentSegs = new Set();
                    queue.push(entry);
                    added++; totalSeg += validIds.length;
                    renderQueue();
                }
            }
            _sweepShowLotProgress(k+1, lots.length, added, totalSeg);
        }
    } catch(e){ log('lots error: '+e.message); }

    // 4) Rendre la vue de départ + bilan
    try { sdk.Map.setMapCenter({lonLat:{lon:savedCenter.lon, lat:savedCenter.lat}, zoomLevel:savedZoom}); } catch(e){}
    const aborted = _sweepAborted;
    _sweepRunning = false;
    const color = aborted ? '#f57c00' : 'var(--wct-green,#2e7d32)';
    _sweepShowText(`<div style="color:${color};font-weight:600">${escHtml(t(aborted?'lotsStopped':'lotsDone', added, totalSeg))}</div>`);
    showToast(t(aborted?'lotsStopped':'lotsDone', added, totalSeg), 4000, aborted?'#f57c00':'#43a047');
    updateFab(); updateCountryInfo();
};

// Lot en cours de traitement : {trackId, lotIdx}. Mémorisé quand on sélectionne un
// lot, lu par le bouton Valider (pont Tracés → Configurer → file).
let _currentLot = null;

// Cadre la carte sur la bbox d'un lot, DANS la zone libre (hors overlay) et sans
// descendre sous le zoom 15 : en dessous, WME décharge segments ET fermetures — ce qui
// rendait le lot invisible sous le panneau et cassait la détection de chevauchement.
const _lotFocus = (lot) => {
    const b = lot.bbox;
    const cLon = (b.minLon+b.maxLon)/2, cLat = (b.minLat+b.maxLat)/2;
    const dLon = Math.max(b.maxLon-b.minLon, 0.001), dLat = Math.max(b.maxLat-b.minLat, 0.001);
    const { freeWidth, mapH } = _getMapFreeZone();      // largeur utile = hors overlay
    const w = Math.max(freeWidth, 200), h = Math.max(mapH, 200);
    const zoom = Math.max(15, Math.min(17, Math.floor(Math.min(
        Math.log2((w*360)/(dLon*256)), Math.log2((h*360)/(dLat*256))))));
    try{
        sdk.Map.setMapCenter({lonLat:{lon:cLon, lat:cLat}, zoomLevel:zoom});
        setTimeout(() => _shiftCenterToFreeZone(cLon, cLat), 160); // décale dans la zone visible
    }catch(e){}
};

// Sélectionne les segments d'un lot : recadre à zoom 16 (le lot tient dans la vue →
// tous ses segments chargés), matche, sélectionne, puis bascule vers Configurer.
const _lotSelect = async (trackId, lotIdx) => {
    if(_sweepRunning) return;
    const trk = _traceTracks.find(tk => tk.trackId === trackId);
    const lot = trk?.lots?.[lotIdx-1];
    if(!lot) return;
    _sweepRunning = true; _sweepAborted = false;
    _sweepShowText(escHtml(t('lotSelecting', lotIdx, trk.lots.length)));
    try {
        sdk.Map.setMapCenter({lonLat:{lon:(lot.bbox.minLon+lot.bbox.maxLon)/2, lat:(lot.bbox.minLat+lot.bbox.maxLat)/2}, zoomLevel:SWEEP_ZOOM});
        await _sweepSleep(SWEEP_SETTLE_MS);
        await waitMapLoaded();
        await _sweepSleep(150);
        const cand = _covCandidateSegments(_covBBox(lot.pts), 0.0008);
        const acc = _covNewAcc();
        if(cand.length){ const index = _covBuildIndex(cand); _covAccumulate(_covDensify(lot.pts, COVERAGE_DENSIFY_M), index, acc); }
        const ids = _covFinalizeUsed(acc);
        _sweepRunning = false;
        if(!ids.length){ _sweepShowText(`<span style="color:var(--wct-red)">${escHtml(t('lotNone'))}</span>`); return; }
        sdk.Editing.setSelection({selection:{ids, objectType:'segment'}});
        _currentLot = { trackId, lotIdx };
        lot.segIds = ids;            // mémoriser : débloque le bouton permalien du lot
        traceRenderTable();          // rafraîchir la ligne du lot (affiche 🔗)
        _lotFocus(lot); // zoom auto pour voir tout le lot
        // Basculer sur Configurer pour régler la fermeture
        document.querySelector('#wct-main-tabs .wct-main-tab[data-tab="cfg"]')?.click();
        _sweepShowText(`<div style="color:var(--wct-green,#2e7d32);font-weight:600">${escHtml(t('lotSelected', ids.length))}</div>`);
        updateFab(); updateCountryInfo();
    } catch(e){ _sweepRunning = false; log('lotSelect error: '+e.message); }
};

// Permalien WME d'un lot (segments captés + vue cadrée). Copié dans le presse-papiers.
// Proposé seulement une fois le lot parcouru (lot.segIds présent) : un lot tient dans une
// vue, donc l'ouverture du permalien resélectionne l'intégralité de ses segments (testé).
const _lotPermalink = (lot) => {
    if(!lot?.segIds?.length) return;
    const b=lot.bbox, cLon=(b.minLon+b.maxLon)/2, cLat=(b.minLat+b.maxLat)/2;
    const dLon=Math.max(b.maxLon-b.minLon,0.001), dLat=Math.max(b.maxLat-b.minLat,0.001);
    const {freeWidth,mapH}=_getMapFreeZone();
    const zoom=Math.max(15,Math.min(17,Math.floor(Math.min(
        Math.log2((Math.max(freeWidth,200)*360)/(dLon*256)),
        Math.log2((Math.max(mapH,200)*360)/(dLat*256))))));
    const env=new URLSearchParams(location.search).get('env')||'row';
    const url=`https://www.waze.com/editor?env=${env}&lat=${cLat}&lon=${cLon}&zoomLevel=${zoom}&segments=${lot.segIds.join(',')}`;
    const ok=()=>showToast(t('lotPermaCopied',lot.segIds.length),3000,'#43a047');
    if(navigator.clipboard?.writeText) navigator.clipboard.writeText(url).then(ok,()=>prompt(t('lotPermaCopy'),url));
    else prompt(t('lotPermaCopy'),url);
};

const traceUpdateStripCtrl = () => {
    const ctrl = document.getElementById('wct-gpx-layer-ctrl');
    const chk  = document.getElementById('wct-gpx-layer-chk');
    if(!ctrl || !chk) return;
    if(_traceTracks.length === 0) { ctrl.style.display = 'none'; return; }
    ctrl.style.display = '';
    chk.checked = _traceTracks.some(t => t.visible);
};

const traceStripToggle = (visible) => {
    _traceTracks.forEach(t => {
        t.visible = visible;
        if(t.olLayer) t.olLayer.setVisibility(visible);
    });
    _traceFiles.forEach(f => {
        const fChk = document.querySelector(`.wct-trace-file-chk[data-fid="${f.fileId}"]`);
        if(fChk) { fChk.checked = visible; fChk.indeterminate = false; }
    });
    document.querySelectorAll('.wct-trace-trk-chk').forEach(c => { c.checked = visible; });
    traceUpdateStripCtrl();
};

// ── Rendu du tableau hiérarchique ─────────────────────────────────────────────

const traceRenderTable = () => {
    const container = document.getElementById('wct-gpx-list');
    if(!container) return;
    if(_traceFiles.length === 0) { container.style.display = 'none'; container.innerHTML = ''; return; }
    container.style.display = '';

    // Colonnes (11) : chev | chk | nom(×2 colspan) | heure | type | pts | swatch | err | pos | del
    // thead global figé — une seule <table> — repli par masquage des <tr> enfants

    let tbody = '';
    _traceFiles.forEach(file => {
        const fileTracks = _traceTracks.filter(t => t.fileId === file.fileId);
        const hh = String(file.datetime.getHours()).padStart(2,'0');
        const mm = String(file.datetime.getMinutes()).padStart(2,'0');
        const timeStr = `${hh}:${mm}`;
        const allVis  = fileTracks.every(t => t.visible);
        const someVis = fileTracks.some(t => t.visible);
        const typeLabel = file.type;
        const fileErrCount = fileTracks.reduce((s,t) => s + t.errors.length, 0);
        const isCollapsed  = file.collapsed;
        const chev = isCollapsed ? '&#x25B6;' : '&#x25BC;';
        const fileSwatchStyle = file.color
            ? `background:${file.color};box-shadow:0 0 0 1px rgba(0,0,0,.2)`
            : `background:transparent;border:2px dashed #999`;
        const fileSwatchTitle = t('trkTipFileColor');

        // Ligne père
        tbody += `<tr class="wct-trace-file-row" data-fid="${file.fileId}" style="background:var(--wct-bg2,#f5f7fa);border-top:1px solid var(--wct-border)">
            <td style="width:14px;padding:0 2px;cursor:pointer;text-align:center" class="wct-trace-file-chev" data-fid="${file.fileId}" title="${isCollapsed?t('trkExpand'):t('trkCollapse')}"><span style="font-size:10px;color:var(--wct-text2)">${chev}</span></td>
            <td style="width:16px"><input type="checkbox" class="wct-trace-file-chk" data-fid="${file.fileId}" ${allVis?'checked':''}></td>
            <td class="wct-gpx-name" colspan="2" title="${escHtml(file.filename)}" style="font-weight:700;padding-left:2px">📄 ${escHtml(file.filename)}</td>
            <td class="wct-gpx-time">${timeStr}</td>
            <td class="wct-trace-col-type">${typeLabel}</td>
            <td style="text-align:right;color:#2e7d32">${fileTracks.reduce((s,t)=>s+(t.olLayer?t.sampled:0),0)||'—'}</td>
            <td class="wct-gpx-swatch-cell"><span class="wct-trace-file-swatch wct-gpx-swatch" data-fid="${file.fileId}" style="${fileSwatchStyle}" title="${fileSwatchTitle}"></span></td>
            <td class="wct-gpx-err ${fileErrCount>0?'wct-gpx-has-err':''}">${fileErrCount>0?'⚠️':'✅'}</td>
            <td style="white-space:nowrap"><button class="wct-trace-file-sel wct-ico" data-fid="${file.fileId}" title="${t('sweepTitle')}">🧲</button><button class="wct-trace-file-cov wct-ico" data-fid="${file.fileId}" title="${t('covTitle')}" style="${hasSel()?'':'display:none'}">📐</button><button class="wct-trace-file-csv wct-ico" data-fid="${file.fileId}" title="${t('lotCsvTitle')}">📥</button></td>
            <td><button class="wct-trace-file-del wct-ico" data-fid="${file.fileId}" title="${t('trkTipDelFile')}">🗑</button></td>
        </tr>`;

        // Lignes enfants — masquées si replié
        fileTracks.forEach(trk => {
            const errCount = trk.errors.length;
            const errTip   = errCount > 0 ? trk.errors.join('\n') : '';
            const okCount  = trk.olLayer ? trk.sampled : 0;
            tbody += `<tr class="wct-trace-trk-row" data-tid="${trk.trackId}" data-fid="${file.fileId}" style="${isCollapsed?'display:none':''}">
                <td></td>
                <td><input type="checkbox" class="wct-trace-trk-chk" data-tid="${trk.trackId}" data-fid="${trk.fileId}" ${trk.visible?'checked':''}></td>
                <td class="wct-gpx-name" colspan="2" title="${escHtml(trk.name)}" style="padding-left:1.2em">↳ ${escHtml(trk.name)}</td>
                <td class="wct-gpx-time"></td>
                <td class="wct-trace-col-type" style="color:var(--wct-text2)">${typeLabel}</td>
                <td style="text-align:right;color:#2e7d32">${okCount>0?okCount:'—'}</td>
                <td class="wct-gpx-swatch-cell"><span class="wct-gpx-swatch" data-tid="${trk.trackId}" style="background:${trk.color}" title="${t('trkTipColor')}"></span></td>
                <td class="wct-gpx-err ${errCount>0?'wct-gpx-has-err':''}" title="${escHtml(errTip)}">${errCount>0?'⚠️ '+errCount:'✅'}</td>
                <td><button class="wct-trace-trk-pos wct-ico" data-tid="${trk.trackId}" title="${t('trkTipFocus')}">🎯</button></td>
                <td><button class="wct-trace-trk-del wct-ico" data-tid="${trk.trackId}" title="${t('trkTipDel')}">🗑</button></td>
            </tr>`;
            // Lignes de lot : trace trop longue découpée automatiquement
            if(trk.lots && trk.lots.length){
                trk.lots.forEach(lot => {
                    const done = lot.status === 'configured';
                    tbody += `<tr class="wct-trace-lot-row" data-tid="${trk.trackId}" data-lot="${lot.idx}" data-fid="${file.fileId}" style="${isCollapsed?'display:none':''}${done?'opacity:.75':''}">
                        <td></td>
                        <td style="text-align:center">${done?'✅':'⬜'}</td>
                        <td class="wct-gpx-name" colspan="2" style="padding-left:2.4em;font-size:0.9em" title="${t('lotShowTitle')}">📦 ${escHtml(t('lotRowLabel', lot.idx, trk.lots.length))}</td>
                        <td class="wct-gpx-time"></td>
                        <td class="wct-trace-col-type" style="color:var(--wct-text2);font-size:0.8em">${done?t('lotStatusDone'):t('lotStatusTodo')}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td style="white-space:nowrap"><button class="wct-trace-lot-show wct-ico" data-tid="${trk.trackId}" data-lot="${lot.idx}" title="${t('lotShowTitle')}">👁</button><button class="wct-trace-lot-sel wct-ico" data-tid="${trk.trackId}" data-lot="${lot.idx}" title="${t('lotSelTitle')}">🧲</button></td>
                        <td>${lot.segIds&&lot.segIds.length?`<button class="wct-trace-lot-perma wct-ico" data-tid="${trk.trackId}" data-lot="${lot.idx}" title="${t('lotPermaTitle')}">🔗</button>`:''}</td>
                    </tr>`;
                });
            }
        });
    });

    container.innerHTML = `<table class="wct-gpx-table">
        <colgroup>
            <col style="width:14px">
            <col style="width:16px">
            <col>
            <col style="width:0">
            <col style="width:44px">
            <col style="width:48px">
            <col style="width:32px">
            <col style="width:20px">
            <col style="width:20px">
            <col style="width:74px">
            <col style="width:28px">
        </colgroup>
        <thead style="position:sticky;top:0;z-index:2;background:var(--wct-bg)">
            <tr>
                <th></th>
                <th></th>
                <th colspan="2" style="text-align:left">${t('trkColTrack')}</th>
                <th title="${t('trkTipLoadTime')}">${t('trkColTime')}</th>
                <th style="text-align:left" title="${t('trkTipFormat')}">Type</th>
                <th style="text-align:right" title="${t('trkTipPts')}">pts</th>
                <th title="${t('trkTipColorCol')}">🎨</th>
                <th title="${t('trkTipStatus')}">⚡</th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody>${tbody}</tbody>
    </table>`;

    // ── Listeners ──

    // Chevron repli/dépli
    container.querySelectorAll('.wct-trace-file-chev').forEach(cell => {
        cell.addEventListener('click', e => {
            e.stopPropagation();
            const fid  = cell.dataset.fid;
            const file = _traceFiles.find(f => f.fileId === fid);
            if(!file) return;
            file.collapsed = !file.collapsed;
            // Masquer/afficher les lignes enfants de ce fichier
            container.querySelectorAll(`.wct-trace-trk-row[data-fid="${fid}"]`).forEach(row => {
                row.style.display = file.collapsed ? 'none' : '';
            });
            const span = cell.querySelector('span');
            if(span) span.innerHTML = file.collapsed ? '&#x25B6;' : '&#x25BC;';
        });
    });

    // Checkbox fichier
    container.querySelectorAll('.wct-trace-file-chk').forEach(chk => {
        chk.addEventListener('change', e => traceSetFileVisible(e.target.dataset.fid, e.target.checked));
    });
    // Rétablir indeterminate
    _traceFiles.forEach(file => {
        const fileTracks = _traceTracks.filter(t => t.fileId === file.fileId);
        const allVis  = fileTracks.every(t => t.visible);
        const someVis = fileTracks.some(t => t.visible);
        const chk = container.querySelector(`.wct-trace-file-chk[data-fid="${file.fileId}"]`);
        if(chk) chk.indeterminate = someVis && !allVis;
    });
    // Checkbox track
    container.querySelectorAll('.wct-trace-trk-chk').forEach(chk => {
        chk.addEventListener('change', e => traceSetTrackVisible(e.target.dataset.tid, e.target.checked));
    });
    // Suppression fichier
    container.querySelectorAll('.wct-trace-file-del').forEach(btn => {
        btn.addEventListener('click', e => { e.stopPropagation(); traceRemoveFile(e.currentTarget.dataset.fid); });
    });
    // Vérification de couverture (niveau fichier)
    container.querySelectorAll('.wct-trace-file-cov').forEach(btn => {
        btn.addEventListener('click', e => { e.stopPropagation(); traceRunCoverage(e.currentTarget.dataset.fid); });
    });
    // Balayage : sélectionner les segments du tracé (niveau fichier)
    container.querySelectorAll('.wct-trace-file-sel').forEach(btn => {
        btn.addEventListener('click', e => { e.stopPropagation(); traceSweepSelect(e.currentTarget.dataset.fid); });
    });
    // Export CSV (WME Advanced Closures) des lots configurés de cette trace
    container.querySelectorAll('.wct-trace-file-csv').forEach(btn => {
        btn.addEventListener('click', e => { e.stopPropagation(); exportLotsCSV(e.currentTarget.dataset.fid); });
    });
    // Afficher un lot (cadrer la carte dessus)
    container.querySelectorAll('.wct-trace-lot-show').forEach(btn => {
        btn.addEventListener('click', e => { e.stopPropagation();
            const trk = _traceTracks.find(tk => tk.trackId === e.currentTarget.dataset.tid);
            const lot = trk?.lots?.[parseInt(e.currentTarget.dataset.lot,10)-1];
            if(lot) _lotFocus(lot);
        });
    });
    // Permalien d'un lot (copié dans le presse-papiers)
    container.querySelectorAll('.wct-trace-lot-perma').forEach(btn => {
        btn.addEventListener('click', e => { e.stopPropagation();
            const trk = _traceTracks.find(tk => tk.trackId === e.currentTarget.dataset.tid);
            const lot = trk?.lots?.[parseInt(e.currentTarget.dataset.lot,10)-1];
            if(lot) _lotPermalink(lot);
        });
    });
    // Sélectionner les segments d'un lot (→ bascule Configurer)
    container.querySelectorAll('.wct-trace-lot-sel').forEach(btn => {
        btn.addEventListener('click', e => { e.stopPropagation();
            _lotSelect(e.currentTarget.dataset.tid, parseInt(e.currentTarget.dataset.lot,10));
        });
    });
    // Suppression track
    container.querySelectorAll('.wct-trace-trk-del').forEach(btn => {
        btn.addEventListener('click', e => traceRemoveTrack(e.currentTarget.dataset.tid));
    });
    // Focus track
    container.querySelectorAll('.wct-trace-trk-pos').forEach(btn => {
        btn.addEventListener('click', e => traceFocus(e.currentTarget.dataset.tid));
    });

    // Palette couleur — helper commun
    const openPalette = (anchor, onPick) => {
        document.querySelectorAll('.wct-gpx-palette').forEach(p => p.remove());
        const pal = document.createElement('div');
        pal.className = 'wct-gpx-palette';
        TRACE_PALETTE.forEach(c => {
            const chip = document.createElement('span');
            chip.className = 'wct-gpx-pal-chip';
            chip.style.background = c;
            if(c === '#ffffff') chip.style.border = '1px solid #ccc';
            chip.title = c;
            chip.addEventListener('click', ev => { ev.stopPropagation(); onPick(c); });
            pal.appendChild(chip);
        });
        const rect   = anchor.getBoundingClientRect();
        const ovRect = document.getElementById('wct-overlay')?.getBoundingClientRect() || {left:0,top:0};
        pal.style.left = (rect.left - ovRect.left) + 'px';
        pal.style.top  = (rect.bottom - ovRect.top + 2) + 'px';
        document.getElementById('wct-overlay').appendChild(pal);
    };
    // Swatch fichier
    container.querySelectorAll('.wct-trace-file-swatch').forEach(sw => {
        sw.addEventListener('click', e => { e.stopPropagation(); openPalette(sw, c => traceSetFileColor(sw.dataset.fid, c)); });
    });
    // Swatch track
    container.querySelectorAll('.wct-gpx-swatch[data-tid]').forEach(sw => {
        sw.addEventListener('click', e => { e.stopPropagation(); openPalette(sw, c => traceSetColor(sw.dataset.tid, c)); });
    });
};

// ── Gestionnaire de fichiers entrants (dropzone) ──────────────────────────────

const traceHandleFiles = (files) => {
    for(const f of files) {
        const ext = f.name.toLowerCase().split('.').pop();
        if(ext === 'gpx') {
            const r = new FileReader();
            r.onload = e => traceAddGpx(f.name, e.target.result);
            r.readAsText(f, 'UTF-8');
        } else if(ext === 'kml') {
            const r = new FileReader();
            r.onload = e => traceAddKml(f.name, e.target.result);
            r.readAsText(f, 'UTF-8');
        } else if(ext === 'kmz') {
            const r = new FileReader();
            r.onload = e => traceAddKmz(f.name, e.target.result);
            r.readAsArrayBuffer(f);
        } else if(ext === 'geojson' || ext === 'json') {
            const r = new FileReader();
            r.onload = e => traceAddGeoJSON(f.name, e.target.result);
            r.readAsText(f, 'UTF-8');
        } else if(ext === 'zip') {
            const r = new FileReader();
            r.onload = e => traceAddShapefile(f.name, e.target.result);
            r.readAsArrayBuffer(f);
        }
    }
};
const buildOverlay=()=>{
    const today=todayStr();
    const days=t('days');
    const chips=[1,2,3,4,5,6,0].map(dow=>`<span class="wct-chip${[1,2,3,4,5].includes(dow)?' on':''}" data-dow="${dow}">${days[dow]}</span>`).join('');
    const ov=make('div',{id:'wct-overlay'});
    ov.innerHTML=`
    <div id="wct-hdr">
        <div class="wct-hdr-title">&#x1F6A7; WME Closures Toolkit <span class="wct-hdr-version">v${VERSION}</span>
            <span id="wct-hdr-badge" style="font-size:0.917em;opacity:.75;margin-left:4px"></span>
        </div>
        <div class="wct-hdr-btns">
            <button class="wct-hdr-btn" id="wct-btn-collapse" title="${t('btnCollapse')}">&#x2014;</button>
            <button class="wct-hdr-btn" id="wct-btn-close" title="${t('btnClose')}">&#x2715;</button>
        </div>
    </div>
    <div id="wct-sel-strip">
        <div class="wct-sel-dot"></div>
        <span class="wct-sel-text" id="wct-sel-text">${t('noSel')}</span>
        <label id="wct-gpx-layer-ctrl" class="wct-gpx-layer-ctrl" style="display:none">
            <input type="checkbox" id="wct-gpx-layer-chk" checked>
            <span id="wct-gpx-layer-lbl"></span>
        </label>
    </div>
    <div id="wct-main-tabs">
        <button class="wct-main-tab on" data-tab="cfg" style="--tc:#2196f3">${t('tabCfg')}</button>
        <button class="wct-main-tab" data-tab="csv" style="--tc:#43a047">${t('tabCsv')}</button>
        <button class="wct-main-tab" data-tab="gpx" style="--tc:#00897b">${t('tabGpx')}</button>
        <button class="wct-main-tab" data-tab="pre" style="--tc:#f57c00">${t('tabPre')}</button>
        <button class="wct-main-tab" data-tab="src" style="--tc:#e91e63">${t('tabSrc')}</button>
        <button class="wct-main-tab wct-tab-icon-only" data-tab="help" style="--tc:#9c27b0" title="${t('tabHelpTitle')}">${t('tabHelp')}</button>
    </div>
    <div id="wct-body">

      <!-- ONGLET CONFIGURER -->
      <div id="wct-pane-cfg" class="wct-main-pane on">
        <div class="wct-cfg-grid">
          <div>
            <div class="wct-section" style="margin-top:0">${t('sectionPeriod')}</div>
            <div class="wct-row">
              <div class="wct-col"><label class="wct-label">${t('lblStart')}</label>
                <input id="wct-rangestart" class="wct-input" type="date" value="${today}" min="${today}"></div>
              <div class="wct-col"><label class="wct-label">${t('lblEnd')}</label>
                <input id="wct-rangeend" class="wct-input" type="date" value="${today}" min="${today}"></div>
            </div>
            <div id="wct-date-warn" style="display:none;font-size:0.917em;color:var(--wct-red);margin-top:3px;padding:0.25em 0.583em;background:#fce4ec;border-radius:var(--wct-radius);border:1px solid var(--wct-red)"></div>
            <!-- Toggle + grille 3 colonnes -->
            <div style="display:flex;gap:6px;align-items:flex-end;margin-bottom:6px">
              <!-- Toggle indépendant, centré verticalement sur les inputs -->
              <div style="display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:0">
                <button id="wct-time-toggle" class="wct-vtoggle" title="${t('tipToggle')}">
                  <div class="wct-vtoggle-knob"></div>
                </button>
              </div>
              <!-- Grille 3 colonnes : starttime | dur/end | +days -->
              <div style="flex:1;display:grid;grid-template-columns:1fr 1fr 56px;gap:4px 6px">
                <!-- Ligne labels -->
                <label class="wct-label">${t('lblStartTime')}</label>
                <div id="wct-lbl-dur" style="display:flex;align-items:center;gap:4px">
                  <label class="wct-label" style="margin:0">${t('lblDuration')}</label>
                  <span id="wct-dur-jpn" style="display:none;background:#f57c00;color:#fff;
                    border-radius:50px;font-size:9px;font-weight:700;padding:1px 4px;white-space:nowrap"></span>
                </div>
                <div id="wct-lbl-end" style="display:none;align-items:center;gap:4px">
                  <label class="wct-label" style="margin:0">${t('lblEndTime')}</label>
                  <span id="wct-endtime-jpn" style="display:none;background:#f57c00;color:#fff;
                    border-radius:50px;font-size:9px;font-weight:700;padding:1px 4px;white-space:nowrap"></span>
                </div>
                <label class="wct-label">${t('lblDurDay')}</label>
                <!-- Ligne inputs -->
                <input id="wct-starttime" class="wct-input" type="time" value="21:00">
                <div id="wct-mode-dur" style="display:flex">
                  <input id="wct-dur-time" class="wct-input" type="time" value="08:00" style="width:100%"></div>
                <div id="wct-mode-end" style="display:none">
                  <input id="wct-endtime" class="wct-input" type="time" value="05:00" style="width:100%"></div>
                <input id="wct-dur-day" class="wct-input" type="number" min="0" value="0">
              </div>
            </div>
            <div class="wct-tabs">
              <button class="wct-tab on" data-target="wct-tab-each">${t('tabEachDay')}</button>
              <button class="wct-tab" data-target="wct-tab-repeat">${t('tabRepeat')}</button>
            </div>
            <div id="wct-tab-each" class="wct-pane on">
              <div class="wct-days">${chips}</div>
              <div class="wct-shortcuts">
                <span class="wct-sc" id="wct-sc-all">${t('scAll')}</span>
                <span class="wct-sc" id="wct-sc-wth">${t('scWth')}</span>
                <span class="wct-sc" id="wct-sc-wd">${t('scWd')}</span>
                <span class="wct-sc" id="wct-sc-we">${t('scWe')}</span>
                <span class="wct-sc" id="wct-sc-none">${t('scNone')}</span>
              </div>
              <label class="wct-check" style="margin-top:6px" title="${t('tipHolSkip')}"><input type="checkbox" id="wct-hol-skip"> ${t('holidayModeSkip')}</label>
              <label class="wct-check" title="${t('tipHolOnly')}"><input type="checkbox" id="wct-hol-only"> ${t('holidayModeOnly')}</label>
              <label class="wct-check" title="${t('tipHolAdd')}"><input type="checkbox" id="wct-hol-add"> ${t('holidayModeAdd')}</label>
              <div id="wct-holidays-warn" style="display:none;font-size:0.917em;color:var(--wct-orange);margin-top:0.333em;padding:0.333em 0.583em;background:#fff8e1;border-radius:var(--wct-radius);border:1px solid var(--wct-warn)"></div>
            </div>
            <div id="wct-tab-repeat" class="wct-pane">
              <div class="wct-row" style="align-items:flex-end">
                <div class="wct-col">
                  <label class="wct-label">${t('lblNtimes')}</label>
                  <input id="wct-rep-ntimes" class="wct-input" type="number" min="1" value="5" placeholder="Ex: 5">
                </div>
              </div>
              <div class="wct-row" style="align-items:flex-end;margin-top:4px">
                <div class="wct-col" style="max-width:72px">
                  <label class="wct-label">${t('lblEvery')}</label>
                  <input id="wct-rep-every" class="wct-input" type="number" min="1" value="1" placeholder="1">
                </div>
                <div class="wct-col">
                  <label class="wct-label">&nbsp;</label>
                  <select id="wct-rep-unit" class="wct-select">
                    <option value="day">${t('unitDay')}</option>
                    <option value="hour">${t('unitHour')}</option>
                    <option value="min">${t('unitMin')}</option>
                  </select>
                </div>
              </div>
              <div id="wct-rep-warn" style="display:none;font-size:0.917em;color:var(--wct-orange);margin-top:0.417em;padding:0.333em 0.583em;background:#fff8e1;border-radius:var(--wct-radius);border:1px solid var(--wct-warn)"></div>
            </div>
          </div>
          <div>
            <div class="wct-section" style="margin-top:0">${t('sectionParams')}</div>
            <div style="margin-bottom:4px"><label class="wct-label">${t('lblDesc')}</label>
              <div style="position:relative;display:flex;gap:4px;align-items:center">
                <input id="wct-reason" class="wct-input" type="text" value="&#x1F6A7;Travaux&#x1F6A7;" style="flex:1;min-width:0">
                <button id="wct-emoji-btn" type="button" title="${t('emojiPickerTip')}" style="flex-shrink:0;width:28px;height:28px;border:1px solid var(--wct-border);border-radius:var(--wct-radius);background:var(--wct-bg);cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;padding:0">&#x1F4CC;</button>
                <div id="wct-emoji-picker" style="display:none;position:absolute;top:100%;right:0;z-index:10010;background:var(--wct-surface);border:1px solid var(--wct-border);border-radius:var(--wct-radius);box-shadow:0 4px 16px rgba(0,0,0,.18);padding:6px;width:232px;margin-top:3px"></div>
              </div></div>
            <div style="margin-bottom:4px"><label class="wct-label">${t('lblDir')}</label>
              <select id="wct-direction" class="wct-select">
                <option value="3">${t('dirBoth')}</option>
                <option value="1">${t('dirAtoB')}</option>
                <option value="2">${t('dirBtoA')}</option>
              </select></div>
            <div style="margin-bottom:4px">
              <label class="wct-label">${t('lblMte')}
                <span style="font-weight:400;color:var(--wct-text2);font-size:0.833em" id="wct-mte-hint">${t('lblMteHint')}</span>
              </label>
              <div style="display:flex;gap:4px;align-items:center">
                <select id="wct-mtesel" class="wct-select" style="flex:1">
                  <option value="">${t('mteEmpty')}</option>
                </select>
                <button id="wct-mte-refresh" class="wct-btn wct-btn-neutral wct-btn-sm" title="${t('mteRefreshTip')}" style="flex-shrink:0;font-size:14px;padding:4px 8px">${t('mteRefresh')}</button>
              </div>
            </div>
            <div style="margin-bottom:4px"><label class="wct-label">${t('lblNodes')}</label>
              <select id="wct-nodesel" class="wct-select">
                <option value="1">${t('nodeNone')}</option>
                <option value="2">${t('nodeInner')}</option>
                <option value="3">${t('nodeAll')}</option>
              </select></div>
            <label class="wct-check" title="${t('tipIT')}"><input id="wct-ignoretraffic" type="checkbox"> ${t('lblIT')}</label>
            <div class="wct-alert" style="margin-top:8px">${t('alertDir')}</div>
          </div>
        </div>
        <div id="wct-small-prev" class="wct-prev-box">${t('fillForm')}</div>
      </div>

      <!-- ONGLET CSV -->
      <div id="wct-pane-csv" class="wct-main-pane">
        <div class="wct-dropzone" id="wct-dropzone">
          ${t('dropText')}<br>
          <small style="color:var(--wct-text2)">${t('dropHint')}</small>
          <input type="file" id="wct-file-input" accept=".csv,.txt" style="display:none">
        </div>
        <div id="wct-csv-log" class="wct-log"></div>
      </div>

      <!-- ONGLET PREREGLAGES -->
      <div id="wct-pane-pre" class="wct-main-pane">
        <div id="wct-presets-empty" class="wct-queue-empty" style="display:none">${t('queueEmpty')}</div>
        <table id="wct-presets-table" style="width:100%;border-collapse:collapse;font-size:1em">
          <thead><tr>
            <th style="text-align:left;padding:0.417em 0.583em;font-size:0.917em;font-weight:700;text-transform:uppercase;border-bottom:2px solid var(--wct-border);color:var(--wct-text2)">${t('presetColName')}</th>
            <th style="text-align:left;padding:0.417em 0.583em;font-size:0.917em;font-weight:700;text-transform:uppercase;border-bottom:2px solid var(--wct-border);color:var(--wct-text2)">${t('presetColDesc')}</th>
            <th style="text-align:left;padding:0.417em 0.583em;font-size:0.917em;font-weight:700;text-transform:uppercase;border-bottom:2px solid var(--wct-border);color:var(--wct-text2)">${t('presetColTime')}</th>
            <th style="text-align:left;padding:0.417em 0.583em;font-size:0.917em;font-weight:700;text-transform:uppercase;border-bottom:2px solid var(--wct-border);color:var(--wct-text2)">${t('presetColDir')}</th>
            <th style="padding:5px 7px;border-bottom:2px solid var(--wct-border)"></th>
          </tr></thead>
          <tbody id="wct-presets-tbody"></tbody>
        </table>
      </div>


      <!-- ONGLET GPX -->
      <div id="wct-pane-gpx" class="wct-main-pane">
        <div class="wct-dropzone" id="wct-gpx-drop">
          ${t('gpxDropText')}<br>
          <small style="color:var(--wct-text2)">${t('gpxDropHint')}</small>
          <input type="file" id="wct-gpx-file" accept=".gpx,.kml,.kmz,.geojson,.json,.zip" multiple style="display:none">
        </div>
        <div id="wct-gpx-list" style="display:none;margin-top:6px;"></div>
        <div id="wct-coverage-result" style="display:none;margin-top:6px;padding:6px 8px;border:1px solid var(--wct-border);border-radius:var(--wct-radius);background:var(--wct-bg)"></div>
      </div>

      <!-- ONGLET RECHERCHE -->
      <div id="wct-pane-src" class="wct-main-pane">
        <p class="wct-src-hint">${t('srcHint')}</p>

        <div class="wct-src-section" title="${t('srcTipStatus')}">${t('srcSectionStatus')}</div>
        <div class="wct-src-status-grid" id="wct-src-status-grid">
          <label class="wct-src-status-cb" title="${t('srcTipStatus')}">
            <input type="checkbox" id="wct-src-status-all" checked> <span>${t('srcStatusAll')}</span>
          </label>
        </div>

        <div class="wct-src-section">${t('srcSectionTime')}</div>
        <div class="wct-src-grid2">
          <div>
            <label class="wct-label" title="${t('srcTipStartAfter')}">${t('srcLblStartAfter')}</label>
            <input id="wct-src-start-after" class="wct-input" type="date" title="${t('srcTipStartAfter')}">
          </div>
          <div>
            <label class="wct-label" title="${t('srcTipStartBefore')}">${t('srcLblStartBefore')}</label>
            <input id="wct-src-start-before" class="wct-input" type="date" title="${t('srcTipStartBefore')}">
          </div>
          <div>
            <label class="wct-label" title="${t('srcTipEndAfter')}">${t('srcLblEndAfter')}</label>
            <input id="wct-src-end-after" class="wct-input" type="date" title="${t('srcTipEndAfter')}">
          </div>
          <div>
            <label class="wct-label" title="${t('srcTipEndBefore')}">${t('srcLblEndBefore')}</label>
            <input id="wct-src-end-before" class="wct-input" type="date" title="${t('srcTipEndBefore')}">
          </div>
        </div>

        <div class="wct-src-section">${t('srcSectionKeywords')}</div>
        <div>
          <label class="wct-label" title="${t('srcTipDesc')}">${t('srcLblDesc')}</label>
          <input id="wct-src-desc" class="wct-input" type="text" placeholder="…" style="width:100%" title="${t('srcTipDesc')}">
        </div>
        <div style="margin:5px 0 3px">
          <div class="wct-src-andor-wrap" style="margin-bottom:3px" title="${t('srcTipAndOr')}">
            <div class="wct-src-andor-toggle">
              <button class="wct-src-andor-btn on" id="wct-src-and" title="${t('srcTipAndOr')}">${t('srcBtnAnd')}</button>
              <button class="wct-src-andor-btn" id="wct-src-or" title="${t('srcTipAndOr')}">${t('srcBtnOr')}</button>
            </div>
            <span class="wct-src-andor-lbl" style="font-size:0.75em;color:var(--wct-text2)">${t('srcTipAndOrLbl')}</span>
          </div>
          <label class="wct-label" title="${t('srcTipMte')}">${t('srcLblMte')}</label>
          <input id="wct-src-mte" class="wct-input" type="text" placeholder="…" style="width:100%" title="${t('srcTipMte')}">
        </div>

        <div class="wct-btn-row" style="margin-top:8px">
          <button id="wct-src-run"   class="wct-btn wct-btn-primary" style="flex:3;justify-content:center" title="${t('srcTipSearch')}">${t('srcBtnSearch')}</button>
          <button id="wct-src-clear" class="wct-btn wct-btn-neutral" style="flex:1;justify-content:center" title="${t('srcTipClear')}">${t('srcBtnClear')}</button>
          <button id="wct-src-go-cfg" class="wct-btn" style="flex:1;justify-content:center;background:#64b5f6;color:#fff;border-color:#42a5f5;font-size:0.8em" title="${t('srcTipGoCfg')}">${t('srcBtnGoCfg')}</button>
        </div>

        <div id="wct-src-results"></div>
      </div>

      <!-- ONGLET AIDE -->
      <!-- ONGLET AIDE -->
      <div id="wct-pane-help" class="wct-main-pane">
        <div id="wct-help-dynamic" class="wct-help-wrap"></div>
      </div>

      <!-- FILE D'ATTENTE -->
      <div class="wct-section" style="margin-top:12px;cursor:pointer" id="wct-queue-section-hdr">
        ${t('sectionQueue')}
        <span id="wct-queue-chevron" style="float:right;font-size:1.083em">&#x25BC;</span>
      </div>
      <div id="wct-queue-body">
        <hr style="border:none;border-top:1px solid var(--wct-border);margin:6px 0 0"><div id="wct-queue-ul"></div>
        <div id="wct-queue-empty" class="wct-queue-empty">${t('queueEmpty')}</div>
      </div>
      <!-- Progression + Stop : collés en bas de la zone défilante, sinon le bouton
           reste sous le pli pendant l'application (petit écran / mode compact). -->
      <div class="wct-progress-dock">
        <div class="wct-pb-wrap" id="wct-pb-wrap"><div class="wct-pb-fill" id="wct-pb-fill"></div></div>
        <div style="display:flex;align-items:center;gap:6px;margin-top:2px">
          <div class="wct-pb-text" id="wct-pb-text" style="flex:1"></div>
          <button id="wct-btn-stop" type="button" class="wct-btn wct-btn-danger wct-btn-sm" style="display:none;flex-shrink:0">${t('btnStop')}</button>
        </div>
      </div>
      <div id="wct-preview-section"></div>
    </div>
    <!-- Log application -->
    <div id="wct-apply-log" class="wct-log" style="display:none;margin:0 10px 4px"></div>
    <!-- Pied fixe : Valider (hors défilement, visible seulement sur l'onglet Configurer via :has) -->
    <div class="wct-validate-footer" style="display:flex;gap:8px;align-items:center">
      <button class="wct-btn wct-btn-success" style="flex:1" id="wct-btn-validate">${t('btnValidate')}</button>
      <button class="wct-btn wct-btn-neutral wct-btn-sm" id="wct-preset-save-btn" title="${t('tipPresetSaveBtn')}">&#x1F4BE;</button>
    </div>
    <!-- Boutons fixes hors scroll -->
    <div id="wct-action-bar-wrap">
        <button class="wct-btn wct-btn-success wct-btn-dis" id="wct-btn-apply">${t('btnApply')}</button>
        <button class="wct-btn wct-btn-neutral wct-btn-dis" id="wct-btn-export">${t('btnCsv')}</button>
        <button class="wct-btn wct-btn-danger wct-btn-dis" id="wct-btn-clear">${t('btnClear')}</button>
    </div>

    <!-- TOAST -->
    <div id="wct-toast"></div>

    <!-- POPUP SAVE PRESET -->
    <div id="wct-preset-popup" style="display:none;position:absolute;bottom:60px;right:14px;
        background:#fff;border:2px solid var(--wct-blue);border-radius:8px;padding:12px;
        box-shadow:var(--wct-shadow);z-index:100;min-width:240px">
        <div style="font-size:1em;font-weight:700;margin-bottom:0.667em;color:var(--wct-blue)">${t('presetPopupTitle')}</div>
        <input id="wct-preset-name-input" class="wct-input" placeholder="${t('presetNamePh')}" style="margin-bottom:4px">
        <div id="wct-preset-name-err" style="font-size:0.917em;color:var(--wct-red);display:none;margin-bottom:0.5em"></div>
        <div style="display:flex;gap:6px">
            <button class="wct-btn wct-btn-primary" style="flex:1" id="wct-preset-confirm">${t('btnSave')}</button>
            <button class="wct-btn wct-btn-neutral" id="wct-preset-cancel">${t('btnCancel')}</button>
        </div>
    </div>
    `;
    document.body.appendChild(ov);
    return ov;
};

const renderPresetsTable=()=>{
    const tbody=$id('wct-presets-tbody');
    const empty=$id('wct-presets-empty');
    if(!tbody) return;
    tbody.innerHTML='';
    if(!presets.length){if(empty)empty.style.display='block';return;}
    if(empty)empty.style.display='none';
    presets.forEach((p,i)=>{
        const v=p.values||{};
        const dirStr=v.direction==='1'?'A \u21D2 B':v.direction==='2'?'B \u21D2 A':'Double sens';
        const tr=document.createElement('tr');
        tr.innerHTML=`
            <td style="padding:6px 7px;border-bottom:1px solid var(--wct-border);font-weight:700">${escHtml(p.name)}</td>
            <td style="padding:6px 7px;border-bottom:1px solid var(--wct-border);max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${escHtml(v.reason||'')}">${escHtml(v.reason||'-')}</td>
            <td style="padding:0.5em 0.583em;border-bottom:1px solid var(--wct-border);white-space:nowrap;font-size:0.917em">${v.starttime||'-'}<br>+${v.durtime||'-'}</td>
            <td style="padding:6px 7px;border-bottom:1px solid var(--wct-border)">${dirStr}</td>
            <td style="padding:6px 7px;border-bottom:1px solid var(--wct-border);white-space:nowrap">
                <button style="color:var(--wct-blue);cursor:pointer;font-size:14px;background:none;border:none;padding:2px 4px;border-radius:4px" class="wct-pre-load" data-i="${i}" title="${t('tipPresetLoad')}">&#x21A9;&#xFE0F;</button>
                <button style="color:var(--wct-red);cursor:pointer;font-size:14px;background:none;border:none;padding:2px 4px;border-radius:4px" class="wct-pre-del" data-i="${i}" title="${t('tipPresetDel')}">&#x1F5D1;</button>
            </td>`;
        tr.querySelector('.wct-pre-load').addEventListener('click',()=>{
            applyConfig(presets[i].values);
            ['cfg','csv','pre','gpx','src','help'].forEach(id=>$id('wct-pane-'+id)?.classList.toggle('on',id==='cfg'));
            document.querySelectorAll('.wct-main-tab').forEach(t=>t.classList.toggle('on',t.dataset.tab==='cfg'));
        });
        tr.querySelector('.wct-pre-del').addEventListener('click',()=>{
            if(!confirm(t('confirmDel',p.name))) return;
            presets.splice(i,1); save(); renderPresetsTable();
        });
        tbody.appendChild(tr);
    });
};

// Queue entry card avec poubelles par ligne
const buildQueueCard=(entry,idx)=>{
    // Initialiser le set des lignes supprimées si absent
    if(!entry.excludedRows) entry.excludedRows=new Set();
    // État plié/déplié mémorisé sur l'entrée (persistant entre les re-render).
    // Premier affichage : suit la préférence "cartes pliées par défaut".
    if(entry.collapsed===undefined) entry.collapsed=_cardsCollapsedDefault;
    const SRC_COLOR={cfg:'#2196f3',csv:'#43a047',pre:'#f57c00',sweep:'#8e24aa'};
    const color=SRC_COLOR[entry.source]||'#2196f3';
    const dir=dirStr(parseInt(entry.config.direction));
    const it=entry.config.ignoretraffic;
    const mteId=entry.config.mteId;
    let mteName=t('noMte');
    if(mteId){try{mteName=sdk.DataModel.MajorTrafficEvents.getById({majorTrafficEventId:mteId})?.names?.[0]?.value||mteId;}catch(e){}}

    // ── Compte net occurrences × segments (hors lignes supprimées + conflits de direction) ──
    // excludedRows contient des clés "sid:closureIdx". On déduit le nombre de
    // segments et d'occurrences réellement appliquables (état statique connu à l'affichage).
    let nbOcc=entry.closures.length, nbSeg=entry.segIds.length;
    try{
        const dirConflictIds=new Set(
            getSegDirConflicts(entry.segIds,parseInt(entry.config.direction)).map(c=>c.sid)
        );
        const liveSegs=new Set(), liveOccs=new Set();
        entry.segIds.forEach(sid=>{
            if(dirConflictIds.has(Number(sid))) return; // segment écarté pour conflit de sens
            if(entry.nullSegs?.has(Number(sid))) return; // segment absent du data model
            if(entry.recentSegs?.has(Number(sid))) return; // segment modifié après dernier assemblage
            entry.closures.forEach((cl,ci)=>{
                if(entry.excludedRows.has(`${sid}:${ci}`)) return; // ligne supprimée manuellement
                liveSegs.add(sid); liveOccs.add(ci);
            });
        });
        nbSeg=liveSegs.size; nbOcc=liveOccs.size;
    }catch(e){}
    // Couleur du badge count selon état des segments
    const badSegCount=(entry.nullSegs?.size||0)+(entry.recentSegs?.size||0);
    const countBadgeClass=nbSeg===0&&badSegCount>0?'wct-badge-count-error':badSegCount>0?'wct-badge-count-warn':'wct-badge-count';

    const card=document.createElement('div');
    card.className='wct-qcard';
    card.style.cssText='border-radius:var(--wct-radius);margin-bottom:6px;overflow:hidden;border:1px solid var(--wct-border);border-left:3px solid '+color+';';

    // ── Header du lot ──
    const hdr=document.createElement('div');
    hdr.className='wct-qcard-hdr';
    hdr.style.cssText='display:flex;align-items:center;gap:5px;padding:6px 8px;background:var(--wct-bg);';
    hdr.innerHTML=`
        <span class="wct-qcard-chevron" style="font-size:12px;color:var(--wct-text2);cursor:pointer;flex-shrink:0;width:14px">&#x25BC;</span>
        <span class="wct-qcard-label" style="flex:1;font-size:1em;font-weight:700;color:var(--wct-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escHtml(entry.label)}</span>
        <button class="wct-qcard-edit" title="${t('tipEditLabel')}" style="background:none;border:none;cursor:pointer;font-size:13px;padding:0 2px;line-height:1;flex-shrink:0;color:var(--wct-text2);opacity:.7">&#x270F;&#xFE0F;</button>
        <span class="wct-badge ${countBadgeClass}" title="${t('tipCount',nbOcc,nbSeg)}">${t('countBadge',nbOcc,nbSeg)}</span>
        ${entry.nullSegs?.size?`<span class="wct-badge wct-badge-null" title="${t('nullSegBadgeTip',entry.nullSegs.size)}">\u26A0\uFE0F ${entry.nullSegs.size}</span>`:''}
        ${entry.recentSegs?.size?`<span class="wct-badge wct-badge-recent" title="${t('recentSegBadgeTip',entry.recentSegs.size)}">\uD83D\uDD52 ${entry.recentSegs.size}</span>`:''}
        ${entry.excludedSegs&&entry.excludedSegs.length?`<span class="wct-badge wct-badge-warn wct-excl-warn" title="${t('exclWarnTitle',entry.excludedSegs.length)}">\u26A0\uFE0F ${entry.excludedSegs.length}</span>`:''}
        <span class="wct-badge wct-badge-dir" title="${t('tipDir')}">${dir}</span>
        <span class="wct-badge" style="background:#fce4ec;color:#880e4f" title="${it?t('tipITon'):t('tipIToff')}">${it?'&#x1F6AB;IT':'&#x2705;IT'}</span>
        <span class="wct-badge wct-badge-node" title="${t('tipNodes',entry.config.nodesClosed||t('nodeNone'))}">${entry.config.nodesClosed||t('nodeIconNone')}</span>
        <span class="wct-badge" style="background:#f3e5f5;color:#6a1b9a" title="${escHtml(t('tipMte',mteName))}">${escHtml(mteName)}</span>
        <button class="wct-qcard-del" title="${t('tipDelBatch')}" style="color:var(--wct-red);background:none;border:none;cursor:pointer;font-size:16px;padding:0 2px;line-height:1;flex-shrink:0">&#x2715;</button>
    `;

    // ── Logique édition inline du libellé ──
    hdr.querySelector('.wct-qcard-edit').addEventListener('click', e => {
        e.stopPropagation();
        const labelSpan = hdr.querySelector('.wct-qcard-label');
        const current = entry.label;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = current;
        input.style.cssText = 'flex:1;font-size:1em;font-weight:700;color:var(--wct-text);border:1px solid var(--wct-blue);border-radius:3px;padding:0 4px;min-width:0;background:var(--wct-bg);';
        labelSpan.replaceWith(input);
        input.focus();
        input.select();
        const confirm = () => {
            const val = input.value.trim() || current;
            entry.label = val;
            entry.config.reason = val;
            const newSpan = document.createElement('span');
            newSpan.className = 'wct-qcard-label';
            newSpan.style.cssText = 'flex:1;font-size:1em;font-weight:700;color:var(--wct-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
            newSpan.textContent = val;
            input.replaceWith(newSpan);
        };
        const cancel = () => {
            const newSpan = document.createElement('span');
            newSpan.className = 'wct-qcard-label';
            newSpan.style.cssText = 'flex:1;font-size:1em;font-weight:700;color:var(--wct-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
            newSpan.textContent = current;
            input.replaceWith(newSpan);
        };
        input.addEventListener('keydown', e => {
            if(e.key === 'Enter'){ e.preventDefault(); confirm(); }
            if(e.key === 'Escape'){ e.preventDefault(); cancel(); }
        });
        input.addEventListener('blur', confirm);
    });

    // ── Body = tableau des lignes ──
    const body=document.createElement('div');
    body.className='wct-qcard-body';

    // État tri
    let sortCol=null, sortAsc=true;

    const COLS=[
        {key:'del',   label:'',        title:'',                          w:'28px',  sortable:false},
        {key:'id',    label:t('colId'), title:t('colIdTip'), w:'110px', sortable:true},
        {key:'name',  label:t('colName'), title:t('colNameTip'), w:'90px', sortable:true},
        {key:'start', label:t('colStart'), title:t('colStartTip'), w:'72px', sortable:true},
        {key:'end',   label:t('colEnd'), title:t('colEndTip'), w:'72px', sortable:true},
        {key:'state', label:t('colState'), title:t('colStateTip'), w:'36px', sortable:true},
    ];

    const buildRows=()=>{
        const now=new Date();
        const existCl=getExistingClosures(entry.segIds);
        // Calculer les conflits directionnels une seule fois pour ce lot
        const dirConflictIds=new Set(
            getSegDirConflicts(entry.segIds,parseInt(entry.config.direction)).map(c=>c.sid)
        );
        let rows=[];
        entry.segIds.forEach(sid=>{
            entry.closures.forEach((cl,closureIdx)=>{
                const rowKey=`${sid}:${closureIdx}`;
                if(entry.excludedRows.has(rowKey)) return; // ligne supprimée
                // cl.start / cl.end sont des Date (config manuelle) ou des chaînes UTC (import CSV)
                const s=cl.start instanceof Date ? cl.start : new Date(cl.start.replace(' ','T')+'Z');
                const e=cl.end instanceof Date ? cl.end : new Date(cl.end.replace(' ','T')+'Z');
                const overlap=existCl.some(c=>dateTimeOverlaps({startDate:s,endDate:e},{startDate:new Date(c.startDate),endDate:new Date(c.endDate)}));
                const nullSeg=entry.nullSegs?.has(Number(sid));
                const recentSeg=!nullSeg&&entry.recentSegs?.has(Number(sid));
                let stateIcon='&#x1F7E2;',stateTip=t('stateOk'),stateBg='',stateVal=0;
                if(nullSeg){
                    stateIcon='\u26A0\uFE0F';stateTip=t('stateNull');stateBg='#fff9c4';stateVal=6;
                } else if(recentSeg){
                    stateIcon='\uD83D\uDD52';stateTip=t('stateRecent');stateBg='#fff3e0';stateVal=5;
                } else if(dirConflictIds.has(Number(sid))){
                    stateIcon='\u26D4';stateTip=t('dirConflictTip');stateBg='#fce4ec';stateVal=4;
                } else if(overlap){stateIcon='&#x1F534;';stateTip=t('stateOv');stateBg='#fff0f0';stateVal=3;}
                else if(e<now){stateIcon='&#x26AB;';stateTip=t('statePast');stateBg='#fafafa';stateVal=1;}
                else if(s<now){stateIcon='&#x1F7E0;';stateTip=t('stateOn');stateBg='#fff8e1';stateVal=2;}
                rows.push({sid,cl,closureIdx,rowKey,s,e,stateIcon,stateTip,stateBg,stateVal,name:getSegName(sid),isDirConflict:dirConflictIds.has(Number(sid))});
            });
        });
        if(sortCol){
            rows.sort((a,b)=>{
                let va,vb;
                if(sortCol==='id'){va=a.sid;vb=b.sid;}
                else if(sortCol==='name'){va=a.name;vb=b.name;}
                else if(sortCol==='start'){va=a.s;vb=b.s;}
                else if(sortCol==='end'){va=a.e;vb=b.e;}
                else if(sortCol==='state'){va=a.stateVal;vb=b.stateVal;}
                else return 0;
                if(va<vb)return sortAsc?-1:1;
                if(va>vb)return sortAsc?1:-1;
                return 0;
            });
        }
        return rows;
    };

    const renderTable=()=>{
        body.innerHTML='';
        const table=document.createElement('table');
        table.style.cssText='width:100%;border-collapse:collapse;font-size:0.917em;table-layout:fixed;';

        // Thead
        const thead=document.createElement('thead');
        const trh=document.createElement('tr');
        trh.style.background='var(--wct-bg)';
        COLS.forEach(col=>{
            const th=document.createElement('th');
            th.style.cssText='padding:4px 5px;text-align:left;border-bottom:1px solid var(--wct-border);width:'+col.w+';white-space:nowrap;overflow:hidden;';
            th.title=col.title;
            if(col.key==='del'){
                // Cellule vide — pas de contrôle global
            } else if(col.sortable){
                th.style.cursor='pointer';
                const arrow=sortCol===col.key?(sortAsc?' ▲':' ▼'):'';
                th.innerHTML=`<span style="font-weight:700;text-transform:uppercase;font-size:0.833em;letter-spacing:.04em;color:var(--wct-text2)">${col.label}${arrow}</span>`;
                th.addEventListener('click',()=>{
                    if(sortCol===col.key) sortAsc=!sortAsc; else{sortCol=col.key;sortAsc=true;}
                    renderTable();
                });
            } else {
                th.innerHTML=`<span style="font-weight:700;text-transform:uppercase;font-size:0.833em;letter-spacing:.04em;color:var(--wct-text2)">${col.label}</span>`;
            }
            trh.appendChild(th);
        });
        thead.appendChild(trh);
        table.appendChild(thead);

        // Tbody
        const tbody=document.createElement('tbody');
        buildRows().forEach(row=>{
            const tr=document.createElement('tr');
            tr.style.background=row.stateBg;
            tr.innerHTML=`
                <td style="padding:3px 5px;border-bottom:1px solid var(--wct-border);text-align:center">
                    <span class="wct-row-del" data-key="${row.rowKey}" title="${t('tipRowDel')}" style="cursor:pointer;font-size:13px;line-height:1;color:var(--wct-red);${row.isDirConflict?'opacity:.4;pointer-events:none':''}">&#x1F5D1;</span></td>
                <td style="padding:3px 5px;border-bottom:1px solid var(--wct-border);font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${row.sid}">
                    <span class="wct-center-seg" data-sid="${row.sid}" title="${t('tipCenter')}" style="cursor:pointer;margin-right:3px;font-size:13px">&#x1F3AF;</span>${row.sid}</td>
                <td style="padding:3px 5px;border-bottom:1px solid var(--wct-border);overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${row.name}">${row.name}</td>
                <td style="padding:3px 5px;border-bottom:1px solid var(--wct-border);white-space:nowrap;font-size:0.833em">${formatDateDisplay(row.s)}</td>
                <td style="padding:3px 5px;border-bottom:1px solid var(--wct-border);white-space:nowrap;font-size:0.833em">${formatDateDisplay(row.e)}</td>
                <td style="padding:3px 5px;border-bottom:1px solid var(--wct-border);text-align:center" title="${row.stateTip}">${row.stateIcon}</td>`;
            // Centrer sur le segment
            tr.querySelector('.wct-center-seg')?.addEventListener('click',e=>{
                e.stopPropagation();
                const sid=Number(e.target.dataset.sid);
                const seg=getSegById(sid);
                const coords=_getSegCoords(seg);
                if(coords) centerOnSegmentBbox(coords);
            });
            // Supprimer la ligne (poubelle)
            tr.querySelector('.wct-row-del')?.addEventListener('click',e=>{
                e.stopPropagation();
                const key=e.target.dataset.key;
                entry.excludedRows.add(key);
                // Si toutes les lignes sont supprimées, retirer le lot entier
                const totalRows=entry.segIds.length*entry.closures.length;
                if(entry.excludedRows.size>=totalRows){
                    queue.splice(idx,1);renderQueue();
                } else {
                    renderTable();
                }
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        body.appendChild(table);
    };

    renderTable();
    card.appendChild(hdr);
    card.appendChild(body);

    // Collapse toggle sur le chevron uniquement
    let open=!entry.collapsed;
    const chev=hdr.querySelector('.wct-qcard-chevron');
    // Appliquer l'état initial (plié/déplié)
    body.style.display=open?'':'none';
    chev.innerHTML=open?'&#x25BC;':'&#x25B6;';
    chev.addEventListener('click',e=>{
        e.stopPropagation();
        open=!open;
        entry.collapsed=!open;
        body.style.display=open?'':'none';
        chev.innerHTML=open?'&#x25BC;':'&#x25B6;';
    });

    // Clic sur le badge ⚠️ → télécharger le .txt des segments écartés
    const warnBadge=hdr.querySelector('.wct-excl-warn');
    if(warnBadge&&entry.excludedSegs&&entry.excludedSegs.length){
        warnBadge.addEventListener('click',e=>{
            e.stopPropagation();
            const dirLabel=entry.config.direction==='1'?'A \u21D2 B':entry.config.direction==='2'?'B \u21D2 A':'Double sens';
            const lines=entry.excludedSegs.map(c=>{
                const pl=getSegPermalink(c.sid);
                return `- ${c.name} (id\u00A0: ${c.sid}, ${t('exclTxtDir')}\u00A0: ${c.segDirLabel})${pl?'\n  '+pl:''}`;
            }).join('\n');
            const txt=
                t('exclTxtHeader',dirLabel)+'\n'+
                t('exclTxtBatch')+entry.label+'\n'+
                new Date().toLocaleString()+'\n\n'+
                lines+'\n\n'+
                t('exclTxtFooter1')+'\n'+
                t('exclTxtFooter2');
            download(txt,t('exclTxtFilename')+'_'+todayStr()+'.txt');
        });
    }

    // Supprimer lot
    hdr.querySelector('.wct-qcard-del').addEventListener('click',e=>{
        e.stopPropagation();
        queue.splice(idx,1); renderQueue();
    });

    return card;
};


// Les écouteurs posés sur `document` (et non sur l'overlay) survivraient à la destruction
// de l'overlay lors d'un changement de langue et s'empileraient à chaque bascule. On les
// rattache à un AbortController renouvelé ici : la construction suivante détache les précédents.
let _ovAbort = null;
const connectOverlay=ov=>{
    _ovAbort?.abort();
    _ovAbort = new AbortController();
    const sig = _ovAbort.signal;
    makeDraggable(ov,$id('wct-hdr'));
    $id('wct-btn-collapse')?.addEventListener('click',()=>{
        collapsed=!collapsed;ov.classList.toggle('collapsed',collapsed);
        $id('wct-btn-collapse').textContent=collapsed?'\u25A1':'\u2014';
    });
    $id('wct-btn-close')?.addEventListener('click',()=>{ ov.classList.remove('open'); restoreClosuresLayer(); });

    // Fermer la palette couleur GPX si clic ailleurs
    document.addEventListener('click', () => {
        document.querySelectorAll('.wct-gpx-palette').forEach(p => p.remove());
    }, {signal:sig});

    // Contrôle calque GPX dans la strip
    const gpxLbl=$id('wct-gpx-layer-lbl');
    if(gpxLbl) gpxLbl.textContent=t('gpxLayerCtrl');

    // Onglets principaux
    ov.querySelectorAll('.wct-main-tab').forEach(tab=>{
        tab.addEventListener('click',()=>{
            ov.querySelectorAll('.wct-main-tab').forEach(t=>t.classList.remove('on'));
            ['cfg','csv','pre','gpx','src','help'].forEach(id=>$id('wct-pane-'+id)?.classList.remove('on'));
            tab.classList.add('on');
            $id('wct-pane-'+tab.dataset.tab)?.classList.add('on');
            if(tab.dataset.tab==='pre') renderPresetsTable();
        });
    });

    // Sous-onglets
    ov.querySelectorAll('.wct-tab').forEach(tab=>{
        tab.addEventListener('click',()=>{
            ov.querySelectorAll('.wct-tab').forEach(t=>t.classList.remove('on'));
            ov.querySelectorAll('.wct-pane').forEach(p=>p.classList.remove('on'));
            tab.classList.add('on');$id(tab.dataset.target)?.classList.add('on');
            refreshSmallPreview();
        });
    });

    // Day chips
    ov.querySelectorAll('.wct-chip').forEach(c=>c.addEventListener('click',()=>{c.classList.toggle('on');refreshSmallPreview();}));
    const setDays=(...dows)=>{ov.querySelectorAll('.wct-chip').forEach(c=>c.classList.toggle('on',dows.includes(Number(c.dataset.dow))));refreshSmallPreview();};
    $id('wct-sc-all')?.addEventListener('click',()=>setDays(0,1,2,3,4,5,6));
    $id('wct-sc-wth')?.addEventListener('click',()=>setDays(1,2,3,4));
    $id('wct-sc-wd')?.addEventListener('click',()=>setDays(1,2,3,4,5));
    $id('wct-sc-we')?.addEventListener('click',()=>setDays(0,6));
    $id('wct-sc-none')?.addEventListener('click',()=>setDays());
    // Toggle durée / heure de fin
    let timeMode=localStorage.WCT_timeMode||'end'; // 'dur' ou 'end' — 'end' par défaut
    const applyTimeMode=()=>{
        const isEnd=timeMode==='end';
        $id('wct-mode-dur').style.display=isEnd?'none':'flex';
        $id('wct-mode-end').style.display=isEnd?'flex':'none';
        const lblEnd=$id('wct-lbl-end'); if(lblEnd) lblEnd.style.display=isEnd?'flex':'none';
        const lblDur=$id('wct-lbl-dur'); if(lblDur) lblDur.style.display=isEnd?'none':'flex';
        const btn=$id('wct-time-toggle');
        if(btn){ btn.classList.toggle('end',isEnd); }
        refreshSmallPreview();
    };
    $id('wct-time-toggle')?.addEventListener('click',()=>{
        setTimeout(checkJpN,0); // recalc badge après switch mode
        timeMode=timeMode==='dur'?'end':'dur';
        localStorage.WCT_timeMode=timeMode;
        applyTimeMode();
    });
    applyTimeMode(); // Appliquer le mode mémorisé (ou 'end' par défaut) au rendu initial

    // ── Emoji picker ──
    const EMOJIS=[
        '🚧','🦺','🏗️','⛏️','🪵','🔨',
        '⛔','❌','🔴','🟥','🚫','☢️','☣️','🔒','🚸',
        '⚠️','❗','🚨','🚑','🚓','🚁',
        '🏁','🚩','🏎️','🚴‍♂️','🏃‍♀️‍➡️','⚽','⚾','🏀','🏈',
        '⛈️','🌪️','❄️','🔥','🌊','🌋',
        '🎶','🎪','🎡','🎠','🎭','🎉',
        '📣','🗣️','✊','🏛️','🪧',
        '🦌','🐄',
        '🚂','📅','⌛','🕓',
    ];
    const emojiBtn=$id('wct-emoji-btn');
    const emojiPicker=$id('wct-emoji-picker');
    if(emojiBtn&&emojiPicker){
        EMOJIS.forEach(em=>{
            const sp=document.createElement('button');
            sp.type='button';sp.textContent=em;sp.title=em;
            sp.style.cssText='background:none;border:none;cursor:pointer;font-size:16px;padding:2px 3px;border-radius:4px;line-height:1;transition:background .1s';
            sp.addEventListener('mouseenter',()=>{sp.style.background=isWin95()?'#000080':'var(--wct-bg)';sp.style.color=isWin95()?'#fff':'';});
            sp.addEventListener('mouseleave',()=>{sp.style.background='none';sp.style.color='';});
            sp.addEventListener('click',()=>{
                const inp=$id('wct-reason');
                if(inp){
                    const s=inp.selectionStart??inp.value.length;
                    const e=inp.selectionEnd??inp.value.length;
                    inp.value=inp.value.slice(0,s)+em+inp.value.slice(e);
                    const pos=s+[...em].length;
                    inp.focus();inp.setSelectionRange(pos,pos);
                }
                emojiPicker.style.display='none';
            });
            emojiPicker.appendChild(sp);
        });
        const isWin95=()=>!!$id('wct-overlay')?.classList.contains('wct-compact');
        const applyBtnStyle=()=>{
            const w=isWin95();
            emojiBtn.style.borderRadius=w?'0':'var(--wct-radius)';
            emojiBtn.style.border=w?'2px outset #fff':'1px solid var(--wct-border)';
            emojiBtn.style.background=w?'#c0c0c0':'var(--wct-bg)';
            emojiBtn.style.width=w?'22px':'28px';
            emojiBtn.style.height=w?'22px':'28px';
        };
        const applyPickerStyle=()=>{
            const w=isWin95();
            emojiPicker.style.borderRadius=w?'0':'var(--wct-radius)';
            emojiPicker.style.border=w?'2px inset #808080':'1px solid var(--wct-border)';
            emojiPicker.style.boxShadow=w?'2px 2px 0 #000':'0 4px 16px rgba(0,0,0,.18)';
            emojiPicker.style.background=w?'#c0c0c0':'var(--wct-surface)';
            emojiPicker.style.padding=w?'4px':'6px';
            emojiPicker.querySelectorAll('button').forEach(b=>{
                b.style.fontSize=w?'14px':'16px';
                b.style.padding=w?'1px 2px':'2px 3px';
                b.style.borderRadius=w?'0':'4px';
            });
        };
        applyBtnStyle(); // style initial au chargement
        emojiBtn.addEventListener('click',e=>{
            e.stopPropagation();
            const opening=emojiPicker.style.display==='none';
            if(opening) applyPickerStyle();
            emojiPicker.style.display=opening?'block':'none';
        });
        document.addEventListener('click',e=>{
            if(!emojiPicker.contains(e.target)&&e.target!==emojiBtn)
                emojiPicker.style.display='none';
        }, {signal:sig});
    }

    // Badge J+N sur l'heure de fin (dynamique selon +Jours et heure de fin vs heure de début)
    const checkJpN=()=>{
        const extra=parseInt($id('wct-dur-day')?.value)||0;
        const modeEnd=$id('wct-mode-end')?.style.display!=='none';
        let n=0;
        if(modeEnd){
            const st=$id('wct-starttime')?.value||'00:00';
            const et=$id('wct-endtime')?.value||'00:00';
            n=extra+(et<=st?1:0);
        } else {
            // mode dur : overnight si heure début + durée h:mm dépasse minuit
            const[stH,stM]=($id('wct-starttime')?.value||'00:00').split(':').map(Number);
            const[dH,dM]=($id('wct-dur-time')?.value||'00:00').split(':').map(Number);
            const endMin=(stH*60+stM)+(dH*60+dM);
            const overnightDur=endMin>=1440;
            n=extra+(overnightDur?1:0);
        }
        const badgeEnd=$id('wct-endtime-jpn');
        const badgeDur=$id('wct-dur-jpn');
        if(modeEnd){
            if(badgeEnd){badgeEnd.style.display=n>0?'inline':'none';badgeEnd.textContent=t('jpnPrefix')+n;}
            if(badgeDur){badgeDur.style.display='none';}
        } else {
            if(badgeDur){badgeDur.style.display=n>0?'inline':'none';badgeDur.textContent=t('jpnPrefix')+n;}
            if(badgeEnd){badgeEnd.style.display='none';}
        }
        refreshSmallPreview();
    };
    $id('wct-endtime')?.addEventListener('change',checkJpN);
    $id('wct-dur-time')?.addEventListener('change',checkJpN);
    $id('wct-starttime')?.addEventListener('change',checkJpN);
    $id('wct-dur-day')?.addEventListener('input',checkJpN);
    $id('wct-dur-day')?.addEventListener('change',checkJpN);
    checkJpN(); // Init badge J+N

    ov.querySelectorAll('input,select').forEach(el=>el.addEventListener('change',refreshSmallPreview));
    $id('wct-rangestart')?.addEventListener('change',refreshMTE);
    $id('wct-rangeend')?.addEventListener('change',refreshMTE);
    $id('wct-mte-refresh')?.addEventListener('click',()=>{ refreshMTE(); refreshSmallPreview(); });
    $id('wct-mtesel')?.addEventListener('change',refreshSmallPreview);

    // Onglet Recherche — checkboxes statut
    // Statuts proposés en filtre : uniquement ceux qu'un éditeur rencontre réellement.
    // Les autres (chevauchement, non vérifiée, erreur, inconnu) restent gérés en interne
    // mais ne sont pas proposés comme cases à cocher.
    const STATUS_KEYS=['ACTIVE','NOT_STARTED','SUSPENDED','FINISHED'];
    const statusGrid=$id('wct-src-status-grid');
    if(statusGrid){
        const labels=t('srcStatusLabels');
        STATUS_KEYS.forEach(key=>{
            const lbl=document.createElement('label');
            lbl.className='wct-src-status-cb';
            lbl.title=labels[key]||key;
            const cb=document.createElement('input');
            cb.type='checkbox'; cb.checked=true; cb.dataset.status=key;
            cb.className='wct-src-status-item';
            const sp=document.createElement('span');
            sp.textContent=labels[key]||key;
            lbl.appendChild(cb); lbl.appendChild(sp);
            statusGrid.appendChild(lbl);
        });
        // Logique "Tous"
        const cbAll=$id('wct-src-status-all');
        const getCbItems=()=>[...statusGrid.querySelectorAll('.wct-src-status-item')];
        cbAll?.addEventListener('change',()=>{
            const chk=cbAll.checked;
            getCbItems().forEach(cb=>cb.checked=chk);
        });
        statusGrid.addEventListener('change',e=>{
            if(e.target===cbAll) return;
            const items=getCbItems();
            const allChecked=items.every(cb=>cb.checked);
            if(cbAll) cbAll.checked=allChecked;
        });
    }
    $id('wct-src-run')?.addEventListener('click',runSearch);
    $id('wct-src-clear')?.addEventListener('click',()=>{
        ['wct-src-start-after','wct-src-start-before','wct-src-end-after','wct-src-end-before'].forEach(id=>{const el=$id(id);if(el)el.value='';});
        ['wct-src-desc','wct-src-mte'].forEach(id=>{const el=$id(id);if(el)el.value='';});
        // Remettre toutes les checkboxes à coché
        const cbAll=$id('wct-src-status-all');
        if(cbAll){cbAll.checked=true;cbAll.dispatchEvent(new Event('change'));}
        const res=$id('wct-src-results');if(res)res.innerHTML='';
    });
    $id('wct-src-go-cfg')?.addEventListener('click',()=>{
        // Délai pour laisser WME traiter la sélection avant de switcher l'onglet
        setTimeout(()=>document.querySelector('.wct-main-tab[data-tab="cfg"]')?.click(),80);
    });
    // Toggle AND/OR
    $id('wct-src-and')?.addEventListener('click',()=>{
        $id('wct-src-and')?.classList.add('on');
        $id('wct-src-or')?.classList.remove('on');
    });
    $id('wct-src-or')?.addEventListener('click',()=>{
        $id('wct-src-or')?.classList.add('on');
        $id('wct-src-and')?.classList.remove('on');
    });
    // Validation des dates au blur — warning visuel uniquement, pas de correction forcée
    const validateDates=()=>{
        const warn=$id('wct-date-warn');if(!warn)return;
        const startEl=$id('wct-rangestart'),endEl=$id('wct-rangeend');
        const rs=new Date(startEl?.value||''),re=new Date(endEl?.value||'');
        const todayD=new Date();todayD.setHours(0,0,0,0);
        const msgs=[];
        if(!isNaN(rs.getTime())&&startEl.value<todayStr()) msgs.push(t('warnDatePast'));
        if(!isNaN(rs.getTime())&&!isNaN(re.getTime())&&re<rs) msgs.push(t('warnDateEnd'));
        if(!isNaN(rs.getTime())&&!isNaN(re.getTime())&&re>=rs){
            // Estimation rapide du nombre de jours (pire cas : tous les jours cochés)
            const days=Math.ceil((re-rs)/86400000)+1;
            if(days>MAX_CLOSURES) msgs.push(t('warnDateMax',MAX_CLOSURES));
        }
        if(msgs.length){warn.style.display='block';warn.innerHTML=msgs.join('<br>');}
        else{warn.style.display='none';warn.innerHTML='';}
        refreshSmallPreview();
    };
    $id('wct-rangestart')?.addEventListener('blur',validateDates);
    $id('wct-rangeend')?.addEventListener('blur',validateDates);
    // Si l'on repousse la date de début au-delà de la date de fin (clic dans le calendrier
    // ou sortie du champ), la date de fin se cale automatiquement dessus : jamais de plage
    // inversée. (Comparaison lexicographique OK : les inputs date sont au format AAAA-MM-JJ.)
    $id('wct-rangestart')?.addEventListener('change',()=>{
        const s=$id('wct-rangestart'),e=$id('wct-rangeend');
        if(s&&e&&s.value&&e.value&&s.value>e.value){ e.value=s.value; validateDates(); refreshSmallPreview(); }
    });
    // Validation répéter en temps réel
    const validateRepeat=()=>{
        const warn=$id('wct-rep-warn');if(!warn)return;
        const every=parseInt($id('wct-rep-every')?.value)||1;
        const unit=$id('wct-rep-unit')?.value||'day';
        const evMin=unit==='day'?every*1440:unit==='hour'?every*60:every;
        const ntimes=parseInt($id('wct-rep-ntimes')?.value)||1;
        // Calculer durée courante
        const modeEnd=$id('wct-mode-end')?.style.display!=='none';
        let dur=0;
        const xDays=parseInt($id('wct-dur-day')?.value)||0;
        if(modeEnd){
            const st=($id('wct-starttime')?.value||'00:00').split(':').map(Number);
            const et=($id('wct-endtime')?.value||'00:00').split(':').map(Number);
            const stMin=st[0]*60+st[1],etMin=et[0]*60+et[1];
            const base=etMin>stMin?etMin-stMin:(1440-stMin+etMin);
            dur=base+xDays*1440;
        } else {
            const dt=($id('wct-dur-time')?.value||'00:00').split(':').map(Number);
            dur=xDays*1440+dt[0]*60+dt[1];
        }
        const msgs=[];
        if(evMin<dur) msgs.push(t('warnInt',evMin,dur));
        if(evMin===0) msgs.push(t('warnZero'));
        // Vérifier nb occurrences dans la plage
        const rs=new Date($id('wct-rangestart')?.value||'');
        const re=new Date($id('wct-rangeend')?.value||'');
        if(!isNaN(rs)&&!isNaN(re)){
            const plageMin=Math.ceil((re-rs)/60000)+1440;
            const maxOcc=Math.floor(plageMin/evMin);
            if(ntimes>maxOcc) msgs.push(t('warnOcc',maxOcc,ntimes));
        }
        warn.style.display=msgs.length?'block':'none';
        warn.innerHTML=msgs.join('<br>');
    };
    ['wct-rep-every','wct-rep-unit','wct-rep-ntimes','wct-dur-time','wct-dur-day','wct-endtime','wct-starttime'].forEach(id=>{
        $id(id)?.addEventListener('change',validateRepeat);
        $id(id)?.addEventListener('input',validateRepeat);
    });
    $id('wct-nodesel')?.addEventListener('change',()=>{closeNodes=parseInt($id('wct-nodesel').value);save();});
    $id('wct-nodesel').value=String(closeNodes);

    // Checkboxes jours fériés — exclusivité mutuelle
    const holSkip=$id('wct-hol-skip'),holOnly=$id('wct-hol-only');
    if(holSkip&&holOnly){
        const holAdd=$id('wct-hol-add');
        holSkip.addEventListener('change',()=>{if(holSkip.checked){holOnly.checked=false;if(holAdd)holAdd.checked=false;}refreshSmallPreview();});
        holOnly.addEventListener('change',()=>{if(holOnly.checked){holSkip.checked=false;if(holAdd)holAdd.checked=false;}refreshSmallPreview();});
        if(holAdd)holAdd.addEventListener('change',()=>{if(holAdd.checked){holSkip.checked=false;holOnly.checked=false;}refreshSmallPreview();});
    }

    // Valider
    $id('wct-btn-validate')?.addEventListener('click',async()=>{
        const sel=getSelection();
        if(!sel.ids.length||sel.objectType!=='segment'){showToast('\u26A0\uFE0F Aucun segment s\u00E9lectionn\u00E9','2500','#e53935');return;}
        // Vérif multipays
        const cc=checkSelectionCountry(sel.ids);
        if(!cc.ok&&cc.countries.length>1){
            alert(t('multiCountryAlert',cc.countries.join(', ')));
            return;
        }
        const rc=await buildClosureList();
        if(rc.error){showToast('\u274C '+rc.error,2500,'#e53935');return;}
        if(!rc.list.length){showToast(t('errNone'),2500,'#e53935');return;}
        const cfg=readConfig();lastConfig=cfg;
        // Vérif compatibilité sens de circulation / direction de fermeture
        const dirConflicts=getSegDirConflicts(sel.ids,parseInt(cfg.direction));
        const validIds=sel.ids.filter(id=>!dirConflicts.find(c=>c.sid===Number(id)));
        if(!validIds.length){
            const dirLabel=cfg.direction==='1'?'A \u21D2 B':'B \u21D2 A';
            showToast(t('toastNoCompatible',dirLabel),3500,'#f57c00');
            return;
        }
        const entry={...makeEntry(validIds,cfg,rc.list),source:'cfg'};
        // Pont Tracés → Configurer → file : si la sélection vient d'un lot, l'entrée
        // porte la bbox du lot (pour le recadrage à l'application) et devient 'sweep'.
        const _lotCtx=(()=>{ if(!_currentLot) return null; const trk=_traceTracks.find(t=>t.trackId===_currentLot.trackId); const lot=trk?.lots?.[_currentLot.lotIdx-1]; return (trk&&lot)?{trk,lot}:null; })();
        if(_lotCtx){
            entry.source='sweep';
            entry.lotBbox=_lotCtx.lot.bbox;
            entry.fileId=_lotCtx.trk.fileId;   // rattache le lot à sa trace (export CSV par trace)
            entry.label=`📦 ${cfg.reason||t('defaultClosure')} · ${t('lotRowLabel',_lotCtx.lot.idx,_lotCtx.trk.lots.length)}`;
        }
        if(dirConflicts.length) entry.excludedSegs=dirConflicts;
        // Détecter les segments absents du data model (ex. modif récente non propagée)
        entry.nullSegs=new Set(validIds.map(Number).filter(id=>getSegById(id)===null));
        // Détecter les segments modifiés après le dernier assemblage de tiles
        const lastTileBuild=await fetchLastTileBuild();
        entry.recentSegs=new Set();
        if(lastTileBuild>0){
            validIds.map(Number).forEach(id=>{
                if(entry.nullSegs.has(id)) return; // déjà signalé comme absent
                const seg=getSegById(id);
                if(seg&&seg.modificationData?.updatedOn>lastTileBuild) entry.recentSegs.add(id);
            });
        }
        queue.push(entry);
        renderQueue();
        const badSegs=entry.nullSegs.size+entry.recentSegs.size;
        const goodSegs=validIds.length-badSegs;
        const toastColor=goodSegs===0?'#e53935':badSegs>0?'#f57c00':'#43a047';
        showToast(t('toastOk',rc.list.length,goodSegs,badSegs),3000,toastColor);
        // Lot validé : le marquer configuré, revenir aux Tracés, pointer le lot suivant
        if(_lotCtx){
            _lotCtx.lot.status='configured';
            _currentLot=null;
            traceRenderTable();
            document.querySelector('#wct-main-tabs .wct-main-tab[data-tab="gpx"]')?.click();
            const next=_lotCtx.trk.lots.find(l=>l.status==='todo');
            if(next){ _lotFocus(next); showToast(t('lotNextHint',next.idx,_lotCtx.trk.lots.length),3500,'#8e24aa'); }
            else showToast(t('lotsAllDone'),4000,'#43a047');
        }
    });

    // Popup preset
    const popup=$id('wct-preset-popup'),nameInp=$id('wct-preset-name-input'),nameErr=$id('wct-preset-name-err');
    $id('wct-preset-save-btn')?.addEventListener('click',()=>{
        if(popup.style.display==='block'){popup.style.display='none';return;}
        nameInp.value='';nameErr.style.display='none';
        popup.style.display='block';setTimeout(()=>nameInp.focus(),50);
    });
    $id('wct-preset-cancel')?.addEventListener('click',()=>{popup.style.display='none';});
    $id('wct-preset-confirm')?.addEventListener('click',()=>{
        const name=(nameInp.value||'').trim();
        if(!name){nameErr.textContent=t('presetErrEmpty');nameErr.style.display='block';return;}
        if(presets.find(p=>p.name===name)){nameErr.textContent=t('presetErrDup');nameErr.style.display='block';return;}
        presets.push({name,values:readConfig()});save();renderPresetsTable();
        popup.style.display='none';nameInp.value='';
        showToast(t('presetSaved',name),2500,'#43a047');
    });

    // File d'attente repliable
    $id('wct-queue-section-hdr')?.addEventListener('click',()=>{
        const body=$id('wct-queue-body');
        const chev=$id('wct-queue-chevron');
        const open=body.style.display!=='none';
        body.style.display=open?'none':'';
        if(chev) chev.innerHTML=open?'&#x25B6;':'&#x25BC;';
    });

    // Actions
    $id('wct-btn-clear')?.addEventListener('click',()=>{if(!confirm(t('confirmClear')))return;queue=[];renderQueue();$id('wct-preview-section').innerHTML='';});
    $id('wct-btn-apply')?.addEventListener('click',async()=>{if(!confirm(t('confirmApply',queue.length)))return;await applyQueue();});
    $id('wct-btn-stop')?.addEventListener('click',()=>{ requestApplyAbort(); });
    // Échap = secours clavier : atteint l'interruption même si un masque WME (« Enregistrement… »)
    // recouvre le bouton pendant les sauvegardes en chaîne.
    document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ if(_applyRunning) requestApplyAbort(); if(_sweepRunning) requestSweepAbort(); } },{capture:true,signal:sig});
    $id('wct-btn-export')?.addEventListener('click',exportCSV);

    // Drop zone CSV
    const dz=$id('wct-dropzone'),fi=$id('wct-file-input');
    dz?.addEventListener('click',e=>{if(e.target!==fi)fi?.click();});
    fi?.addEventListener('click',e=>e.stopPropagation());
    fi?.addEventListener('change',()=>{handleCSV(fi.files);fi.value='';});
    dz?.addEventListener('dragover',e=>{e.preventDefault();dz.style.borderColor='var(--wct-green)';});
    dz?.addEventListener('dragleave',()=>{dz.style.borderColor='';});
    dz?.addEventListener('drop',e=>{e.preventDefault();dz.style.borderColor='';handleCSV(e.dataTransfer.files);});

    // Drop zone GPX
    const gpxDz=$id('wct-gpx-drop'),gpxFi=$id('wct-gpx-file');
    gpxDz?.addEventListener('click',e=>{if(e.target!==gpxFi)gpxFi?.click();});
    gpxFi?.addEventListener('click',e=>e.stopPropagation());
    gpxFi?.addEventListener('change',()=>{traceHandleFiles(gpxFi.files);gpxFi.value='';});
    gpxDz?.addEventListener('dragover',e=>{e.preventDefault();gpxDz.classList.add('wct-drop-hover');});
    gpxDz?.addEventListener('dragleave',()=>{gpxDz.classList.remove('wct-drop-hover');});
    gpxDz?.addEventListener('drop',e=>{e.preventDefault();gpxDz.classList.remove('wct-drop-hover');traceHandleFiles(e.dataTransfer.files);});

    // Checkbox strip calque GPX
    $id('wct-gpx-layer-chk')?.addEventListener('change',e=>traceStripToggle(e.target.checked));

    const helpDiv=$id('wct-help-dynamic');if(helpDiv)helpDiv.innerHTML=buildHelpHTML();
    // Onglet aide — toujours accessible
    document.querySelector('.wct-main-tab[data-tab="help"]')?.classList.remove('disabled');

    // Accordéon aide
    document.querySelectorAll('.wct-help-hdr').forEach(hdr=>{
        hdr.addEventListener('click',()=>{
            const body=$id(hdr.dataset.help);
            if(!body) return;
            const open=body.style.display!=='none';
            body.style.display=open?'none':'';
            hdr.classList.toggle('on',!open);
            hdr.querySelector('span').innerHTML=open?'&#x25B6;':'&#x25BC;';
        });
    });

    renderPresetsTable();refreshMTE();refreshSmallPreview();renderQueue();
};

// Au-delà de ce total de segments cumulés, l'import CSV demande confirmation : le
// parsing + la détection de conflits de sens sont synchrones (thread principal), donc
// un très gros fichier peut figer l'onglet. Seuil volontairement haut : ~1000 segments
// par import est un usage courant (fermetures de marché hebdomadaires) à ne pas gêner.
const CSV_WARN_SEGMENTS=2500;
const CSV_RE=[/.*/,/.*/,/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/,/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/,
    /(^A to B$)|(^B to A$)|(^TWO WAY$)/,/(Yes)|(No)/,/^(\d+(;|$))+/,
    /(lon=(-?\d+\.?\d*)&lat=(-?\d+\.?\d*))|(lat=(-?\d+\.?\d*)&lon=(-?\d+\.?\d*))/,/^\d+$/,/.*/];
const csvLog=t=>{const el=$id('wct-csv-log');if(el){el.style.display='block';el.innerHTML+=t.replace(/\n/g,'<br>');}};
const csvClearLog=()=>{const el=$id('wct-csv-log');if(el)el.innerHTML='';};
class CsvClosure{
    constructor(r,i){
        this.id=i;this.reason=r[1];this.startDate=r[2];this.endDate=r[3];
        this.direction=r[4];this.permanent=r[5];this.segIDs=r[6].split(';').map(Number);
        this.zoom=parseInt(r[8]);this.eventId=(r[9]&&r[9]!=='')?r[9]:null;this.comment=r[10]||'';
        this.isValid=false;
        let m=r[7].match(/lon=(-?\d+\.?\d*)&lat=(-?\d+\.?\d*)/);
        if(!m)m=r[7].match(/lat=(-?\d+\.?\d*)&lon=(-?\d+\.?\d*)/);
        if(!m){this.err='lonlat invalide';return;}
        this.lonlat={lon:parseFloat(m[1]),lat:parseFloat(m[2])};
        if(!['A to B','B to A','TWO WAY'].includes(this.direction)){this.err='direction invalide';return;}
        if(this.zoom<14||this.zoom>22){this.err='zoom invalide';return;}
        this.isValid=true;
    }
    apply(ok,ko){
        const dir=this.direction==='A to B'?DIR.AtoB:this.direction==='B to A'?DIR.BtoA:DIR.TWO;
        addClosure({segments:this.segIDs,reason:this.reason,direction:dir,startDate:this.startDate,endDate:this.endDate,permanent:this.permanent==='Yes',eventId:this.eventId},ok,e=>ko&&ko({errors:[{attributes:{details:String(e)}}]}));
    }
}
const parseCSV=text=>{
    const rows=CSVtoArray(text).filter(r=>r.length>=1&&['add','remove'].includes(r[0]));
    let fb='';
    rows.forEach((r,l)=>r.forEach((cell,i)=>{if(i<CSV_RE.length&&!CSV_RE[i].test(cell))fb+=`L${l} c${i}: "${cell}"\n`;}));
    if(fb){csvLog(fb);return null;}
    return rows.map((r,i)=>({action:r[0],closure:new CsvClosure(r,i)}));
};

const handleCSV=files=>{
    for(const f of files){
        const r=new FileReader();
        r.onload=e=>{
            const logEl=$id('wct-csv-log');
            if(logEl) logEl.style.display='block';
            const items=parseCSV(e.target.result);
            if(!items){if(logEl)logEl.innerHTML='❌ CSV invalide.';return;}
            // Garde-fou volume : avertir avant d'ajouter un très gros lot (freeze possible).
            const valid=items.filter(it=>it.closure.isValid);
            const totalSeg=valid.reduce((s,it)=>s+it.closure.segIDs.length,0);
            if(totalSeg>CSV_WARN_SEGMENTS && !confirm(t('csvBigConfirm',totalSeg,valid.length))){
                if(logEl)logEl.innerHTML=t('csvImportCancelled');
                return;
            }
            let added=0,errors=0;
            items.forEach(it=>{
                if(!it.closure.isValid){errors++;return;}
                const cl=it.closure;
                const dir=cl.direction==='A to B'?1:cl.direction==='B to A'?2:3;
                const cfg={reason:cl.reason,direction:String(dir),ignoretraffic:cl.permanent==='Yes',mteId:cl.eventId||''};
                const csvEntry={segIds:cl.segIDs,config:cfg,closures:[{start:cl.startDate,end:cl.endDate}],
                    label:cl.reason||'CSV',
                    detail:dirStr(dir)+' · '+cl.startDate.slice(0,16)+' → '+cl.endDate.slice(0,16),
                    source:'csv'};
                // Vérif compatibilité sens de circulation pour les lots CSV
                const csvConflicts=getSegDirConflicts(cl.segIDs,dir);
                if(csvConflicts.length) csvEntry.excludedSegs=csvConflicts;
                queue.push(csvEntry);
                added++;
            });
            renderQueue();
            if(logEl) logEl.innerHTML=t('csvAdded',added,errors||0);
        };
        r.readAsText(f);
    }
};

// ═══════════════════════════════════════════════════════════════════════════
//  FAB — bouton docké dans le container natif WME (4e bouton)
// ═══════════════════════════════════════════════════════════════════════════
// Ancré comme 4e bouton du container natif : suit automatiquement le zoom /
// la résolution, et partage le contexte d'empilement des boutons natifs
// (donc passe derrière le panneau des calques comme eux, sans bidouille de z-index).

const _findOverlayContainer=()=>document.querySelector('.overlay-buttons-container.top')
                             ||document.querySelector('.overlay-buttons-container');

// ── Calque « Fermetures » de WME ─────────────────────────────────────────────
// La détection de chevauchement (getExistingClosures) et l'affichage des fermetures
// existantes n'ont de données QUE si le calque WME « Fermetures » est actif. Ni
// setVisibility ni l'API SDK ne déclenchent le chargement : seul un clic sur la
// case du sélecteur de calques (#layer-switcher-item_closures) le fait — même
// mécanisme que le calque Lieux dans WME POI Event Updater.
// On l'active à l'ouverture de l'overlay ; s'il était éteint, on le restaure à la
// fermeture ; s'il était déjà allumé, on n'y touche pas.
let _closuresLayerForced = false;
const _closuresCheckbox = () => document.querySelector('#layer-switcher-item_closures');
const ensureClosuresLayer = () => {
    const cb = _closuresCheckbox();
    if(cb && !cb.checked){ cb.click(); _closuresLayerForced = true; }
};
const restoreClosuresLayer = () => {
    if(!_closuresLayerForced) return;
    const cb = _closuresCheckbox();
    if(cb && cb.checked) cb.click();
    _closuresLayerForced = false;
};

const doInjectFab=()=>{
    if($id('wct-fab-btn')) return;

    const wrap=document.createElement('div');
    wrap.id='wct-fab-wrap';

    const wzBtn=document.createElement('button');
    wzBtn.id='wct-fab-btn';
    wzBtn.setAttribute('type','button');
    wzBtn.setAttribute('title','WME Closures Toolkit');
    wzBtn.innerHTML=`<svg width="22" height="22" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="wct-bar"><rect x="0" y="13" width="68" height="14" rx="5"/></clipPath></defs>
  <rect x="0" y="13" width="68" height="14" rx="5" fill="#222"/>
  <g clip-path="url(#wct-bar)">
    <line x1="10" y1="13" x2="0"  y2="27" stroke="#e53935" stroke-width="5"/>
    <line x1="24" y1="13" x2="14" y2="27" stroke="#e53935" stroke-width="5"/>
    <line x1="38" y1="13" x2="28" y2="27" stroke="#e53935" stroke-width="5"/>
    <line x1="52" y1="13" x2="42" y2="27" stroke="#e53935" stroke-width="5"/>
    <line x1="66" y1="13" x2="56" y2="27" stroke="#e53935" stroke-width="5"/>
  </g>
  <rect x="8"  y="27" width="8" height="18" rx="4" fill="#222"/>
  <rect x="52" y="27" width="8" height="18" rx="4" fill="#222"/>
  <rect x="2"  y="43" width="20" height="7" rx="3.5" fill="#222"/>
  <rect x="46" y="43" width="20" height="7" rx="3.5" fill="#222"/>
</svg>`;

    const badge=document.createElement('div');
    badge.id='wct-fab-badge';
    badge.className='wct-fab-badge';
    badge.textContent='0';
    wzBtn.appendChild(badge);

    wrap.appendChild(wzBtn);
    // Docker le FAB dans le container natif WME (body en secours si pas encore prêt au boot)
    (_findOverlayContainer()||document.body).appendChild(wrap);
    log('FAB injecté (docké container natif)');

    // Clic : ouvrir / fermer l'overlay
    wzBtn.addEventListener('click', e=>{
        e.stopPropagation();
        if(!enabled) return;
        const ov=$id('wct-overlay');
        const isOpen=ov.classList.contains('open');
        if(!isOpen){
            ensureClosuresLayer();   // activer le calque Fermetures (détection de chevauchement)
            const sel=getSelection();
            const hasSeg=sel.ids.length>0&&sel.objectType==='segment';
            if(!hasSeg){
                setTimeout(()=>document.querySelector('.wct-main-tab[data-tab="csv"]')?.click(),50);
            } else {
                if(lastConfig) applyConfig(lastConfig);
                refreshMTE(); refreshSmallPreview();
            }
            renderQueue();
        } else {
            restoreClosuresLayer();  // rendre le calque à son état d'avant l'ouverture
        }
        ov.classList.toggle('open',!isOpen);
    });
};

// Garantit que le FAB reste le DERNIER bouton du container natif. WME recrée certains
// boutons à leur clic (ex. « partager la position ») et les ré-ajoute EN FIN, ce qui
// faisait passer le FAB en avant-dernière position. On le remet donc toujours en fin —
// appendChild d'un élément déjà présent le déplace, sans le dupliquer.
let _fabObserver=null, _fabObservedCont=null;
const ensureFabDocked=()=>{
    const wrap=$id('wct-fab-wrap');
    if(!wrap) return;
    const cont=_findOverlayContainer();
    if(!cont) return;
    if(cont.lastElementChild!==wrap) cont.appendChild(wrap);
    // Réactivité immédiate : observer les ajouts de boutons dans le container courant.
    // (Le re-append remet lastElementChild===wrap → la condition redevient fausse, pas de boucle.)
    if(_fabObservedCont!==cont){
        _fabObserver?.disconnect();
        _fabObserver=new MutationObserver(()=>{
            const w=$id('wct-fab-wrap'), c=_findOverlayContainer();
            if(w && c && c.lastElementChild!==w) c.appendChild(w);
        });
        _fabObserver.observe(cont,{childList:true});
        _fabObservedCont=cont;
    }
};

const injectFab=()=>{
    if(!document.body){ setTimeout(injectFab,200); return; }
    doInjectFab();
    ensureFabDocked();
};




// ─── Met à jour le FAB selon la sélection ──────────────────────────────────
let _lastSelIds=[];
const updateFab=()=>{
    const sel=getSelection();
    const hasSeg=sel.ids.length>0&&sel.objectType==='segment';
    const btn=$id('wct-fab-btn');
    const badge=$id('wct-fab-badge');
    if(btn)btn.classList.toggle('has-sel',hasSeg);
    if(badge)badge.textContent=sel.ids.length;
    // Strip
    const strip=$id('wct-sel-strip'),text=$id('wct-sel-text');
    if(strip&&text){
        strip.classList.toggle('has-sel',hasSeg);
        text.textContent=hasSeg?t('hasSel',sel.ids.length):t('noSel');
    }
    // Onglets : griser Configurer et Préréglages si pas de sélection
    const cfgTab=document.querySelector('.wct-main-tab[data-tab="cfg"]');
    const preTab=document.querySelector('.wct-main-tab[data-tab="pre"]');
    if(cfgTab) cfgTab.classList.toggle('disabled',!hasSeg);
    if(preTab) preTab.classList.toggle('disabled',!hasSeg);
    // Aide toujours accessible
    document.querySelector('.wct-main-tab[data-tab="help"]')?.classList.remove('disabled');

    // Boutons couverture (onglet Tracés) : visibles seulement si segments sélectionnés
    if(typeof traceUpdateCoverageBtns === 'function') traceUpdateCoverageBtns();

    // Si sélection change (nouveaux segments) → proposer de vider la file
    const newIds=JSON.stringify([...sel.ids].sort());
    const oldIds=JSON.stringify([..._lastSelIds].sort());
    if(hasSeg && newIds!==oldIds && _lastSelIds.length>0 && queue.length>0){
        // Nouvelle sélection différente avec file non vide
        const ov=$id('wct-overlay');
        if(ov&&ov.classList.contains('open')){
            showToast(t('newSel'),3000,'#f57c00');
        }
    }
    // Si sélection arrive alors qu'overlay ouvert sur CSV → basculer sur Configurer
    if(hasSeg && _lastSelIds.length===0){
        const ov=$id('wct-overlay');
        if(ov&&ov.classList.contains('open')){
            const csvPane=$id('wct-pane-csv');
            if(csvPane&&csvPane.classList.contains('on')){
                document.querySelector('.wct-main-tab[data-tab="cfg"]')?.click();
            }
        }
    }
    // Si pas de sélection et overlay ouvert → basculer sur CSV
    if(!hasSeg){
        const ov=$id('wct-overlay');
        if(ov&&ov.classList.contains('open')){
            const cfgPane=$id('wct-pane-cfg');
            if(cfgPane&&cfgPane.classList.contains('on')){
                document.querySelector('.wct-main-tab[data-tab="csv"]')?.click();
            }
        }
    }
    _lastSelIds=[...sel.ids];
};

// ═══════════════════════════════════════════════════════════════════════════
//  DISPLAY MODE
// ═══════════════════════════════════════════════════════════════════════════
const applyDisplayMode=(mode)=>{
    _displayMode=mode==='compact'?'compact':'normal';
    const el=$id('wct-overlay');
    if(el){
        el.style.setProperty('--wct-fs-base',_displayMode==='compact'?'11px':'12px');
        el.classList.toggle('wct-compact',_displayMode==='compact');
    }
    // Restyler le bouton emoji si présent
    const btn=$id('wct-emoji-btn');
    if(btn){
        const w=_displayMode==='compact';
        btn.style.borderRadius=w?'0':'var(--wct-radius)';
        btn.style.border=w?'2px outset #fff':'1px solid var(--wct-border)';
        btn.style.background=w?'#c0c0c0':'var(--wct-bg)';
        btn.style.width=w?'22px':'28px';
        btn.style.height=w?'22px':'28px';
    }
    save();
};

// ═══════════════════════════════════════════════════════════════════════════
//  LANGUE — bascule à chaud
// ═══════════════════════════════════════════════════════════════════════════
// Tout le HTML de l'overlay est traduit au moment de sa construction : changer de langue
// impose donc de le reconstruire. Ce qui vit dans des variables (file d'attente, préréglages)
// ou dans des couches OpenLayers (tracés) survit ; ce qui vit dans le DOM (formulaire en cours,
// position du panneau, onglet actif, état ouvert/replié) est relu avant destruction et restauré.
const setLang=pref=>{
    _langPref = (pref==='auto'||LANGS.some(x=>x.code===pref)) ? pref : 'auto';
    save();
    const next=resolveLang();
    if(next===_lang){ renderSidebar(); return; }   // ex. 'auto' qui retombe sur la langue courante
    _lang=next;

    const old=$id('wct-overlay');
    const wasOpen=old?.classList.contains('open');
    const wasCollapsed=collapsed;
    const cfg=old?readConfig():null;
    const tab=old?.querySelector('.wct-main-tab.on')?.dataset.tab||'cfg';
    const pos=old?{left:old.style.left,top:old.style.top,right:old.style.right,bottom:old.style.bottom}:null;
    old?.remove();

    const ov=buildOverlay();
    connectOverlay(ov);
    if(pos){ov.style.left=pos.left;ov.style.top=pos.top;ov.style.right=pos.right;ov.style.bottom=pos.bottom;}
    applyDisplayMode(_displayMode);
    if(cfg)applyConfig(cfg);
    if(tab!=='cfg')ov.querySelector(`.wct-main-tab[data-tab="${tab}"]`)?.click();
    if(wasCollapsed){collapsed=true;ov.classList.add('collapsed');const b=$id('wct-btn-collapse');if(b)b.textContent='□';}
    if(wasOpen)ov.classList.add('open');

    // Ré-alimenter tout ce qui n'est rendu qu'à la demande
    reloadPresets(); renderPresetsTable(); renderQueue();
    traceRenderTable(); traceUpdateStripCtrl();
    updateFab(); updateCountryInfo();
    renderSidebar();
};

// ═══════════════════════════════════════════════════════════════════════════
//  SIDEBAR (onglet Scripts — simple toggle)
// ═══════════════════════════════════════════════════════════════════════════
let _sbPane=null;   // pane WME de la sidebar, conservé pour la re-rendre au changement de langue

const renderSidebar=()=>{
    if(!_sbPane) return;
    _sbPane.innerHTML=buildSidebar();
    connectSidebar();
};

const connectSidebar=()=>{
    $id('wct-enable-toggle')?.addEventListener('change',e=>{
        enabled=e.target.checked;save();
        const wrap=$id('wct-fab-wrap');if(wrap)wrap.style.opacity=enabled?'1':'0.4';
        if(!enabled){$id('wct-overlay')?.classList.remove('open'); restoreClosuresLayer();}
    });
    document.querySelectorAll('input[name="wct-display"]').forEach(r=>{
        r.addEventListener('change',e=>{ if(e.target.checked) applyDisplayMode(e.target.value); });
    });
    document.querySelectorAll('input[name="wct-dateformat"]').forEach(r=>{
        r.addEventListener('change',e=>{ if(e.target.checked){ _dateFormat=e.target.value; save(); renderQueue(); } });
    });
    $id('wct-cards-collapsed')?.addEventListener('change',e=>{
        _cardsCollapsedDefault=e.target.checked; save();
    });
    $id('wct-lang-select')?.addEventListener('change',e=>setLang(e.target.value));
};

const buildSidebar=()=>`
<div id="wct-sidebar">
    <h2>&#x1F6A7; WME Closures Toolkit <span style="font-size:11px;font-weight:400;color:var(--wct-grey)">v${VERSION}</span></h2>
    <p class="wct-sb-hint">${t('sbHint')}</p>
    <div class="wct-toggle-row">
        <span style="font-size:13px;font-weight:600">${t('sbToggle')}</span>
        <label class="wct-toggle">
            <input type="checkbox" id="wct-enable-toggle" ${enabled?'checked':''}>
            <span class="wct-toggle-slider"></span>
        </label>
    </div>
    <div style="margin-top:14px">
        <div style="font-size:11px;font-weight:700;color:var(--wct-blue);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">&#x1F4FA; ${t('sbDisplayMode')}</div>
        <label style="display:flex;align-items:center;gap:7px;font-size:12px;cursor:pointer;margin-bottom:4px">
            <input type="radio" name="wct-display" value="normal" ${_displayMode==='normal'?'checked':''}> ${t('sbModeNormal')}
        </label>
        <label style="display:flex;align-items:center;gap:7px;font-size:12px;cursor:pointer;margin-bottom:4px">
            <input type="radio" name="wct-display" value="compact" ${_displayMode==='compact'?'checked':''}> ${t('sbModeCompact')}
        </label>
        <label style="display:flex;align-items:center;gap:7px;font-size:12px;cursor:pointer;margin-top:8px">
            <input type="checkbox" id="wct-cards-collapsed" ${_cardsCollapsedDefault?'checked':''}> ${t('sbCardsCollapsed')}
        </label>

    </div>
    <div style="margin-top:14px">
        <div style="font-size:11px;font-weight:700;color:var(--wct-blue);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">&#x1F310; ${t('sbLanguage')}</div>
        <select id="wct-lang-select" class="wct-input" style="width:100%;font-size:12px">
            <option value="auto" ${_langPref==='auto'?'selected':''}>${t('sbLangAuto',LANGS.find(x=>x.code===detectLang())?.label||'English')}</option>
            ${LANGS.map(l=>`<option value="${l.code}" ${_langPref===l.code?'selected':''}>${l.label}</option>`).join('')}
        </select>
    </div>
    <div style="margin-top:14px">
        <div style="font-size:11px;font-weight:700;color:var(--wct-blue);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">&#x1F4C5; ${t('sbDateFormat')}</div>
        <label style="display:flex;align-items:center;gap:7px;font-size:12px;cursor:pointer;margin-bottom:4px">
            <input type="radio" name="wct-dateformat" value="dmy" ${_dateFormat==='dmy'?'checked':''}> ${t('sbDateDmy')}
        </label>
        <label style="display:flex;align-items:center;gap:7px;font-size:12px;cursor:pointer;margin-bottom:4px">
            <input type="radio" name="wct-dateformat" value="mdy" ${_dateFormat==='mdy'?'checked':''}> ${t('sbDateMdy')}
        </label>
        <label style="display:flex;align-items:center;gap:7px;font-size:12px;cursor:pointer;margin-bottom:4px">
            <input type="radio" name="wct-dateformat" value="iso" ${_dateFormat==='iso'?'checked':''}> ${t('sbDateIso')}
        </label>
        <p style="font-size:10px;color:var(--wct-grey);margin-top:2px">${t('sbDateAuto')}</p>
    </div>
    <p style="margin-top:12px;font-size:11px;color:var(--wct-grey);line-height:1.6">
        ${t('sbDesc')}
    </p>
</div>`;


// ===========================================================================
//  INIT
// ===========================================================================
const init=async()=>{
    sdk=getWmeSdk({scriptId:SCRIPT_ID,scriptName:SCRIPT_NAME});
    load();                 // charge _langPref…
    _lang=resolveLang();    // …qui décide si on suit WME ou une langue forcée

    // Sidebar
    try {
        const res=await sdk.Sidebar.registerScriptTab();
        const tabLabel=res.tabLabel;
        _sbPane=res.tabPane;
        tabLabel.innerHTML='<span title="WME Closures Toolkit" style="font-size:16px">&#x1F6A7;</span>';
        _sbPane.innerHTML=buildSidebar();
        await new Promise(r=>setTimeout(r,200));
        connectSidebar();
    } catch(e) { log('Sidebar: '+e.message); }

    // Overlay
    const ov=buildOverlay();
    connectOverlay(ov);
    // Appliquer le mode d'affichage sauvegardé
    applyDisplayMode(_displayMode);

    // FAB
    injectFab();

    // Selection listeners (+ on garantit que le FAB reste docké au container natif)
    const onSel=()=>{updateFab();updateCountryInfo();ensureFabDocked();};
    try{sdk.Events.on({eventName:'wme-selection-changed',eventHandler:onSel});}catch(e){}
    try{W.selectionManager.events.register('selectionchanged',null,onSel);}catch(e){}
    setInterval(onSel,500);
    onSel();

    // Note : plus besoin de gérer le z-index à l'ouverture des Calques —
    // le FAB étant docké dans le container natif, il suit le même empilement que les boutons WME.

    log('v'+VERSION+' pret');
};

if(W?.userscripts?.state.isReady){init();}
else{document.addEventListener('wme-ready',init,{once:true});}

})();
