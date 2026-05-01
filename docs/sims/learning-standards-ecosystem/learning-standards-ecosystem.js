// Learning Standards Ecosystem — vis-network implementation
// CANVAS_HEIGHT: 450
// Bloom: Analyze (L4) — decompose, identify, predict
// Pattern: network explorer with click-to-reveal infobox and family filtering

(function () {
    'use strict';

    const FAMILY_COLORS = {
        content:   '#d97706',
        launch:    '#0d9488',
        analytics: '#4338ca',
        storage:   '#475569'
    };

    const FAMILY_LABELS = {
        content:   'Content / Packaging',
        launch:    'Launch + Identity',
        analytics: 'Behavior / Analytics',
        storage:   'Storage / Infrastructure'
    };

    const nodeData = {
        1:  { label: 'AICC',            family: 'content',
              title: 'AICC (Aviation Industry CBT Committee)',
              body: '<p><b>AICC</b> — Content/Packaging family. Founded 1988. The first cross-vendor CBT interoperability standard, created by airlines to share pilot-training content across simulator vendors. Defined HACP (HTTP-AICC Communication Protocol), a form-encoded POST protocol for course-to-LMS communication.</p><p>Evolved into: SCORM 1.2. Legacy content still found in regulated industries.</p>' },
        2:  { label: 'SCORM 1.2',       family: 'content',
              title: 'SCORM 1.2 (2001)',
              body: '<p><b>SCORM 1.2</b> — Content/Packaging family. Published by ADL in 2001. The version that achieved mass corporate L&D adoption. A ZIP package + JavaScript API in an LMS iframe. Very shallow data model (lesson status, score) but "boring works" — still widely deployed in back catalogs.</p><p>Evolved from: AICC. Succeeded by: SCORM 2004. Launched by: LMS.</p>' },
        3:  { label: 'SCORM 2004',      family: 'content',
              title: 'SCORM 2004 (2004)',
              body: '<p><b>SCORM 2004</b> — Content/Packaging family. Published by ADL in 2004. Added sophisticated sequencing/navigation and a richer data model, but far more complex to author, test, and debug than SCORM 1.2. A cautionary tale about elegance losing to simplicity.</p><p>Succeeded: SCORM 1.2. Launched by: LMS.</p>' },
        4:  { label: 'QTI',             family: 'content',
              title: 'IMS QTI (Question and Test Interoperability)',
              body: '<p><b>QTI</b> — Content/Packaging family. Published by 1EdTech. Portable XML format for assessment items and tests — multiple-choice, drag-and-drop, fill-in, ordering, and more. Defines item types and scoring, not delivery or analytics.</p><p>Imported by: LMSes and authoring tools. xAPI records what happens during QTI-based assessments.</p>' },
        5:  { label: 'LTI 1.1',         family: 'launch',
              title: 'IMS LTI 1.1 (2010)',
              body: '<p><b>LTI 1.1</b> — Launch+Identity family. Published by IMS Global in 2010. OAuth 1.0a-signed POST for launching external tools from an LMS with learner identity pre-populated. Widely deployed but limited: no gradebook write-back, no roster API.</p><p>Succeeded by: LTI 1.3 / LTI Advantage.</p>' },
        6:  { label: 'LTI Advantage',   family: 'launch',
              title: 'LTI 1.3 / LTI Advantage (2019)',
              body: '<p><b>LTI Advantage</b> — Launch+Identity family. Published by 1EdTech in 2019. Modernized onto OpenID Connect + OAuth 2.0. Added Names & Role Provisioning (roster), Assignment & Grade Services (gradebook write-back), and Deep Linking.</p><p>For intelligent textbooks: LTI is how the LMS hands off the learner; xAPI is how the textbook reports back what happened. They are complementary, not competing.</p>' },
        7:  { label: 'xAPI',            family: 'analytics',
              title: 'xAPI / IEEE 9274.1.1 (2013)',
              body: '<p><b>xAPI</b> — Behavior/Analytics family. Published by ADL in 2013; ratified as IEEE 9274.1.1 in October 2023. Actor/Verb/Object statement model for any learning event — online, offline, simulations, physical activities. Very high granularity and portability. Open-source stewardship transitioned to I2IDL in December 2025.</p><p>Cooperates with: CMI5 (profile of xAPI), LTI (complementary). Competes with: IMS Caliper.</p>' },
        8:  { label: 'CMI5',            family: 'analytics',
              title: 'CMI5 / cmi5 (2016)',
              body: '<p><b>CMI5</b> — Behavior/Analytics family. Published by AICC/1EdTech in 2016. A <em>profile on top of xAPI</em> that constrains statements into a strict session lifecycle: launched → initialized → passed/failed → completed → terminated. Lets an LMS track completion while the course emits rich xAPI statements for analytics.</p><p>Is a profile of: xAPI. Launched by: LMS. Best of both worlds: LMS orchestration + fine-grained analytics.</p>' },
        9:  { label: 'IMS Caliper',     family: 'analytics',
              title: 'IMS Caliper (2014)',
              body: '<p><b>IMS Caliper</b> — Behavior/Analytics family. Published by 1EdTech in 2014. Structured learning-event records with a small, fixed set of canonical event types (AssessmentEvent, MediaEvent, NavigationEvent…). More prescriptive than xAPI; stronger native adoption in higher-ed LMSes (Canvas, D2L Brightspace).</p><p>Competes with: xAPI. Stored in: LRS / Analytics platforms.</p>' },
        10: { label: 'LRS',             family: 'storage',
              title: 'LRS (Learning Record Store)',
              body: '<p><b>LRS</b> — Storage/Infrastructure family. A database with opinions: accepts xAPI statements via POST /statements, stores them, and returns them via GET /statements with filtering by actor, verb, activity, date range, and registration. The xAPI spec defines the LRS API precisely.</p><p>Receives from: xAPI Activity Providers, CMI5 courses. Read by: Analytics platforms, dashboards, recommenders.</p>' },
        11: { label: 'LMS',             family: 'storage',
              title: 'LMS (Learning Management System)',
              body: '<p><b>LMS</b> — Storage/Infrastructure family. The platform that enrolls learners, launches courses, and tracks completion. In the xAPI era the LMS is still important for enrollment and roster, but it no longer needs to be the sole analytics system — xAPI statements flow to an LRS independently of what the LMS records.</p><p>Launches: SCORM 1.2, SCORM 2004, CMI5, LTI tools. Imports: QTI.</p>' },
        12: { label: 'Analytics\nPlatform', family: 'storage',
              title: 'Analytics Platform / Dashboard',
              body: '<p><b>Analytics Platform</b> — Storage/Infrastructure family. Dashboards, reporting tools, and AI pipelines that query the LRS to turn learning statements into insights: completion rates, score distributions, engagement heat-maps, personalized recommendations, and early-warning alerts.</p><p>Reads from: LRS (via GET /statements). Examples: Watershed, SCORM Cloud reports, Grafana + xAPI, custom Python pipelines.</p>' }
    };

    const edgeData = [
        { id: 'e1',  from: 1,  to: 2,  label: 'evolved into',
          body: '<p><b>AICC → SCORM 1.2</b>: SCORM 1.2 (2001) inherited AICC\'s basic vocabulary — lesson status, score, LMS launch lifecycle — but standardized it under ADL and tied it to a JavaScript API instead of HTTP form-POST. The first major consolidation of CBT interoperability.</p>' },
        { id: 'e2',  from: 2,  to: 3,  label: 'succeeded by',
          body: '<p><b>SCORM 1.2 → SCORM 2004</b>: SCORM 2004 added sophisticated sequencing/navigation and a richer data model, but the added complexity meant most organizations continued shipping SCORM 1.2 content. A cautionary tale that "boring works" often beats "technically superior."</p>' },
        { id: 'e3',  from: 5,  to: 6,  label: 'succeeded by',
          body: '<p><b>LTI 1.1 → LTI Advantage</b>: LTI 1.3 / LTI Advantage modernized the launch layer onto OIDC/OAuth 2.0 and added Names & Role Provisioning (roster), Assignment & Grade Services (gradebook write-back), and Deep Linking. A clean generational upgrade.</p>' },
        { id: 'e4',  from: 11, to: 2,  label: 'launches',
          body: '<p><b>LMS launches SCORM 1.2</b>: The LMS serves as the SCORM host — it exposes the JavaScript runtime API (LMSInitialize, LMSSetValue) in the parent window frame and receives completion/score from the course via LMSCommit. Entirely browser-locked.</p>' },
        { id: 'e5',  from: 11, to: 3,  label: 'launches',
          body: '<p><b>LMS launches SCORM 2004</b>: Same JavaScript-API launch model as SCORM 1.2, with more sophisticated sequencing rules. Still browser-locked and LMS-dependent — no offline, no mobile, no cross-device.</p>' },
        { id: 'e6',  from: 11, to: 8,  label: 'launches',
          body: '<p><b>LMS launches CMI5</b>: CMI5 is designed specifically for LMS launch — the LMS supplies a session token and endpoint URL; the course uses them to POST xAPI statements. Best of both worlds: LMS orchestration + rich analytics flowing to an LRS.</p>' },
        { id: 'e7',  from: 11, to: 6,  label: 'launches via',
          body: '<p><b>LMS launches tools via LTI Advantage</b>: LTI Advantage lets the LMS launch any external tool (your intelligent textbook, a publisher simulation, a quiz engine) with pre-authenticated learner identity, role, and gradebook line item already wired up. The tool then emits xAPI or Caliper independently.</p>' },
        { id: 'e8',  from: 6,  to: 7,  label: 'can emit',
          body: '<p><b>LTI tool → xAPI</b>: An LTI-launched tool can simultaneously emit xAPI statements to an LRS. LTI handles the launch and identity; xAPI handles the fine-grained learning-event record. They are complementary, not competing. This is the recommended architecture for intelligent textbooks delivered via LMS.</p>' },
        { id: 'e9',  from: 6,  to: 9,  label: 'can emit',
          body: '<p><b>LTI tool → IMS Caliper</b>: An LTI-launched tool in a higher-ed LMS (Canvas, D2L Brightspace) may emit Caliper events to a Caliper endpoint. The tool picks whichever analytics standard its host institution supports — or both, if the institution runs both.</p>' },
        { id: 'e10', from: 8,  to: 7,  label: 'profile of',
          body: '<p><b>CMI5 is a profile of xAPI</b>: CMI5 does not invent a new wire format. It constrains how xAPI statements are used inside an LMS launch flow: specific verb IRIs are required (launched, initialized, passed, failed, completed, terminated), a session UUID ties statements together, and a strict lifecycle governs valid sequences.</p>' },
        { id: 'e11', from: 7,  to: 10, label: 'stored in',
          body: '<p><b>xAPI → LRS</b>: Activity Providers POST statements to the LRS endpoint (POST /statements). The LRS stores them and makes them available for querying via GET /statements with filtering by actor, verb, activity, date range, registration, and more. The xAPI spec defines this HTTP API precisely.</p>' },
        { id: 'e12', from: 9,  to: 10, label: 'stored in',
          body: '<p><b>IMS Caliper → LRS</b>: Some LRS platforms accept Caliper events in addition to xAPI statements. In practice, most xAPI LRSes store xAPI natively; Caliper events may be translated or stored via a separate Caliper-to-xAPI adapter.</p>' },
        { id: 'e13', from: 4,  to: 11, label: 'imported by',
          body: '<p><b>QTI → LMS</b>: LMSes import QTI packages to populate their quiz banks. QTI defines the item content and scoring; the LMS delivery engine runs the items. xAPI then records what happened during the assessment as fine-grained statements in the LRS.</p>' },
        { id: 'e14', from: 10, to: 12, label: 'queried by',
          body: '<p><b>LRS → Analytics Platform</b>: Dashboards and reporting tools query the LRS via GET /statements and aggregate the results into completion metrics, score distributions, engagement heat-maps, and personalized recommendations. The LRS is the single source of truth; the analytics platform is the lens.</p>' },
        { id: 'e15', from: 7,  to: 9,  label: 'competes with', dashes: true,
          body: '<p><b>xAPI ↔ IMS Caliper — competes</b>: Both standards solve the same core problem — structured learning-event records over HTTP. xAPI has stronger corporate L&D and adaptive-content adoption; Caliper has stronger higher-ed LMS adoption (Canvas, D2L). A deployment usually picks one based on its institutional ecosystem, though dual-emission is possible.</p>' }
    ];

    let network = null;
    let allNodes, allEdges;
    let hiddenFamilies = new Set();

    function buildNetwork() {
        const container = document.getElementById('network');

        allNodes = new vis.DataSet(
            Object.entries(nodeData).map(([id, d]) => ({
                id: parseInt(id),
                label: d.label,
                color: {
                    background: FAMILY_COLORS[d.family],
                    border: 'rgba(255,255,255,0.5)',
                    highlight: { background: FAMILY_COLORS[d.family], border: '#fbbf24' },
                    hover:      { background: FAMILY_COLORS[d.family], border: '#fbbf24' }
                },
                font: { color: '#fff', size: 13, bold: true },
                shape: 'box',
                margin: 8,
                borderWidth: 1
            }))
        );

        allEdges = new vis.DataSet(
            edgeData.map(e => ({
                id: e.id,
                from: e.from,
                to: e.to,
                label: e.label,
                font: { size: 10, color: '#475569', align: 'top', strokeWidth: 2, strokeColor: '#f8fafc' },
                color: { color: e.dashes ? '#cbd5e1' : '#94a3b8', highlight: '#4338ca', hover: '#4338ca' },
                dashes: e.dashes || false,
                arrows: { to: { enabled: !e.dashes, scaleFactor: 0.55 } },
                smooth: { type: 'curvedCW', roundness: 0.15 },
                width: e.dashes ? 1 : 1.5
            }))
        );

        const options = {
            layout: { improvedLayout: true },
            physics: {
                enabled: true,
                stabilization: { iterations: 300, fit: true },
                barnesHut: {
                    gravitationalConstant: -4000,
                    springLength: 130,
                    springConstant: 0.04,
                    damping: 0.5
                }
            },
            interaction: {
                hover: true,
                tooltipDelay: 200,
                keyboard: false,
                zoomView: true,
                dragView: true
            }
        };

        network = new vis.Network(container, { nodes: allNodes, edges: allEdges }, options);

        network.on('stabilizationIterationsDone', () => {
            network.setOptions({ physics: { enabled: false } });
        });

        network.on('click', params => {
            if (params.nodes.length > 0) {
                showNodeInfo(params.nodes[0]);
            } else if (params.edges.length > 0) {
                showEdgeInfo(params.edges[0]);
            }
        });
    }

    function showNodeInfo(nodeId) {
        const d = nodeData[nodeId];
        if (!d) return;
        const color = FAMILY_COLORS[d.family];
        const familyLabel = FAMILY_LABELS[d.family];
        document.getElementById('info-display').innerHTML =
            '<div class="info-name">' + d.title + '</div>' +
            '<span class="info-badge" style="background:' + color + '">' + familyLabel + '</span>' +
            '<div class="info-body">' + d.body + '</div>';
    }

    function showEdgeInfo(edgeId) {
        const e = edgeData.find(x => x.id === edgeId);
        if (!e) return;
        document.getElementById('info-display').innerHTML =
            '<div class="info-name">Relationship: <em>' + e.label + '</em></div>' +
            '<div class="info-body">' + e.body + '</div>';
    }

    function toggleFamily(family) {
        if (hiddenFamilies.has(family)) {
            hiddenFamilies.delete(family);
            document.getElementById('legend-' + family).classList.remove('dimmed');
        } else {
            hiddenFamilies.add(family);
            document.getElementById('legend-' + family).classList.add('dimmed');
        }
        applyFamilyFilter();
    }

    function applyFamilyFilter() {
        const updates = Object.entries(nodeData).map(([id, d]) => ({
            id: parseInt(id),
            hidden: hiddenFamilies.has(d.family)
        }));
        allNodes.update(updates);
    }

    document.addEventListener('DOMContentLoaded', () => {
        buildNetwork();

        document.getElementById('reset-btn').addEventListener('click', () => {
            network.fit({ animation: { duration: 600, easingFunction: 'easeInOutQuad' } });
        });

        document.getElementById('show-all-btn').addEventListener('click', () => {
            hiddenFamilies.clear();
            document.querySelectorAll('.legend-item').forEach(el => el.classList.remove('dimmed'));
            applyFamilyFilter();
        });

        document.querySelectorAll('.legend-item[data-family]').forEach(el => {
            el.addEventListener('click', () => toggleFamily(el.dataset.family));
        });
    });
})();
