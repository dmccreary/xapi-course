// Learning Standards Timeline — vis-timeline implementation
// CANVAS_HEIGHT: 580
//
// Renders a horizontally scrollable timeline of major learning-interoperability
// standards from 1988 to 2026, with family filtering, click-to-reveal infobox,
// keyboard navigation, and an xAPI `interacted` emit hook.

(function () {
    'use strict';

    const FAMILY_COLORS = {
        ADL:   '#4b3f9c',
        AICC:  '#6a737d',
        IMS:   '#1f8a8a',
        I2IDL: '#7a3fa3'
    };

    let timeline = null;
    let timelineData = null;
    let allItems = [];
    let eventsById = {};
    let currentFamily = 'all';

    // --- Load data ---
    fetch('timeline.json')
        .then(r => r.json())
        .then(data => initTimeline(data))
        .catch(err => {
            document.getElementById('infobox').textContent =
                'Failed to load timeline.json: ' + err.message;
        });

    function initTimeline(data) {
        // Build vis-timeline items from the events array.
        allItems = data.events.map(ev => {
            eventsById[ev.id] = ev;
            return {
                id: ev.id,
                content: escapeHtml(ev.headline),
                start: new Date(ev.year, 0, 1),
                title: `<strong>${escapeHtml(ev.headline)}</strong> (${ev.year})<br>${escapeHtml(ev.short)}`,
                className: 'family-' + ev.family,
                family: ev.family
            };
        });

        timelineData = new vis.DataSet(allItems);

        const minYear = Math.min(...data.events.map(e => e.year));
        const maxYear = Math.max(...data.events.map(e => e.year));

        const options = {
            width: '100%',
            height: '280px',
            margin: { item: { horizontal: 30, vertical: 3 }, axis: 18 },
            orientation: 'top',
            zoomMin: 1000 * 60 * 60 * 24 * 365 * 5,
            zoomMax: 1000 * 60 * 60 * 24 * 365 * 80,
            min: new Date(minYear - 5, 0, 1),
            max: new Date(maxYear + 5, 0, 1),
            tooltip: { followMouse: true },
            stack: true,
            selectable: true,
            showCurrentTime: false,
            moveable: true,
            zoomable: false,
            align: 'center'
        };

        const container = document.getElementById('timeline');
        timeline = new vis.Timeline(container, timelineData, options);

        // Keep page scroll usable; treat horizontal wheel as a pan gesture.
        container.addEventListener('wheel', function (e) {
            const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
            if (!isHorizontal) {
                e.stopImmediatePropagation();
                return;
            }
            e.preventDefault();
            const win = timeline.getWindow();
            const interval = win.end - win.start;
            const shift = (e.deltaX / container.clientWidth) * interval;
            timeline.setWindow(
                new Date(win.start.valueOf() + shift),
                new Date(win.end.valueOf() + shift),
                { animation: false }
            );
        }, true);

        // Initial window with padding so first/last events aren't clipped.
        fitToVisibleItems();

        // Click an event → show infobox; clicks on empty timeline are no-ops.
        timeline.on('select', function (props) {
            if (props.items && props.items.length > 0) {
                showInfobox(props.items[0]);
                emitXapiInteracted(props.items[0]);
            }
            // else: do NOT clear; user must use the close affordance
        });

        wireFilterButtons();
        wireNavButtons();
        wireKeyboardNav(container);
        wireCloseButton();
    }

    // --- Filtering ---
    function wireFilterButtons() {
        const buttons = document.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const family = btn.getAttribute('data-family');
                currentFamily = family;
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filtered = (family === 'all')
                    ? allItems
                    : allItems.filter(i => i.family === family);

                timelineData.clear();
                timelineData.add(filtered);
                fitToVisibleItems();
            });
        });
    }

    // --- Navigation buttons ---
    function wireNavButtons() {
        document.getElementById('pan-left').addEventListener('click',  () => panBy(-0.30));
        document.getElementById('pan-right').addEventListener('click', () => panBy( 0.30));
        document.getElementById('zoom-in').addEventListener('click',   () => zoomBy(0.5));
        document.getElementById('zoom-out').addEventListener('click',  () => zoomBy(2.0));
        document.getElementById('fit-all').addEventListener('click',   fitToVisibleItems);
    }

    function panBy(fraction) {
        const win = timeline.getWindow();
        const interval = win.end - win.start;
        const shift = interval * fraction;
        timeline.setWindow(
            new Date(win.start.valueOf() + shift),
            new Date(win.end.valueOf() + shift),
            { animation: true }
        );
    }

    function zoomBy(factor) {
        const win = timeline.getWindow();
        const center = (win.start.valueOf() + win.end.valueOf()) / 2;
        const half = ((win.end - win.start) * factor) / 2;
        timeline.setWindow(
            new Date(center - half),
            new Date(center + half),
            { animation: true }
        );
    }

    function fitToVisibleItems() {
        const items = timelineData.get();
        if (items.length === 0) return;
        const dates = items.map(i => i.start.getTime());
        const minDate = Math.min(...dates);
        const maxDate = Math.max(...dates);
        const padding = 6 * 365 * 24 * 60 * 60 * 1000; // 6 years
        timeline.setWindow(
            new Date(minDate - padding),
            new Date(maxDate + padding),
            { animation: false }
        );
    }

    // --- Keyboard navigation ---
    function wireKeyboardNav(container) {
        container.addEventListener('keydown', function (e) {
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
            e.preventDefault();
            const visible = timelineData.get().sort((a, b) => a.start - b.start);
            if (visible.length === 0) return;

            const sel = timeline.getSelection();
            let idx = -1;
            if (sel.length > 0) {
                idx = visible.findIndex(i => i.id === sel[0]);
            }
            if (e.key === 'ArrowLeft')  idx = (idx <= 0) ? visible.length - 1 : idx - 1;
            if (e.key === 'ArrowRight') idx = (idx === -1 || idx >= visible.length - 1) ? 0 : idx + 1;

            const target = visible[idx];
            timeline.setSelection([target.id], { focus: true });
            showInfobox(target.id);
            emitXapiInteracted(target.id);
        });
    }

    // --- Infobox rendering ---
    function showInfobox(eventId) {
        const ev = eventsById[eventId];
        if (!ev) return;
        const box = document.getElementById('infobox');
        box.classList.remove('empty');

        const succession = (ev.successor_of || ev.succeeded_by)
            ? `<div class="succession">
                ${ev.successor_of ? `<div><span>Succeeded:</span> ${escapeHtml(ev.successor_of)}</div>` : ''}
                ${ev.succeeded_by ? `<div><span>Succeeded by:</span> ${escapeHtml(ev.succeeded_by)}</div>` : ''}
              </div>`
            : '';

        const specLink = ev.spec_url
            ? `<a class="spec-link" href="${escapeAttr(ev.spec_url)}" target="_blank" rel="noopener">Read the spec &rarr;</a>`
            : '';

        box.innerHTML = `
            <button class="close-btn" id="close-btn" aria-label="Close details">&times;</button>
            <h2>${escapeHtml(ev.headline)} <span style="color:#5a6f87;font-weight:400;">(${ev.year})</span></h2>
            <div class="meta-row">
                <span class="pill family-${ev.family}">${escapeHtml(ev.family)}</span>
                <strong>Sponsor:</strong> ${escapeHtml(ev.sponsor)}
            </div>
            <div class="description"><strong>Problem solved:</strong> ${escapeHtml(ev.problem)}</div>
            ${succession}
            <div class="description">${escapeHtml(ev.description)}</div>
            ${specLink}
        `;

        document.getElementById('close-btn').addEventListener('click', closeInfobox);
    }

    function wireCloseButton() {
        // Close button is inside infobox; rebound after each render.
        // This wires an Escape-key fallback for accessibility.
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeInfobox();
        });
    }

    function closeInfobox() {
        const box = document.getElementById('infobox');
        box.classList.add('empty');
        box.innerHTML = 'Select an event on the timeline above to see full details — sponsoring organization, the problem it solved, what it succeeded, and a link to the official spec.';
        timeline.setSelection([]);
    }

    // --- xAPI emit hook ---
    // Emits an `interacted` statement when the learner explores an event.
    // The host page (the chapter) is expected to provide window.xapiSend(); if
    // it isn't present, we just log to console — the sim still works.
    function emitXapiInteracted(eventId) {
        const ev = eventsById[eventId];
        if (!ev) return;
        const statement = {
            verb: {
                id: 'http://adlnet.gov/expapi/verbs/interacted',
                display: { 'en-US': 'interacted' }
            },
            object: {
                id: 'https://dmccreary.github.io/xapi-course/sims/learning-standards-timeline#' + ev.id,
                definition: {
                    name: { 'en-US': ev.headline },
                    description: { 'en-US': ev.short },
                    type: 'http://adlnet.gov/expapi/activities/interaction'
                }
            },
            result: {
                extensions: {
                    'https://dmccreary.github.io/xapi-course/extensions/family': ev.family,
                    'https://dmccreary.github.io/xapi-course/extensions/year':   ev.year
                }
            }
        };
        if (typeof window.xapiSend === 'function') {
            try { window.xapiSend(statement); } catch (e) { console.warn('xapiSend failed', e); }
        } else {
            console.log('[xAPI interacted]', statement);
        }
    }

    // --- Helpers ---
    function escapeHtml(s) {
        if (s === null || s === undefined) return '';
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function escapeAttr(s) {
        return escapeHtml(s);
    }
})();
