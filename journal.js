/* ══════════════════════════════════════════
   EREBUS STATION — Lore Journal
   Accumulates discovered logs in localStorage
   and renders them in the hub sidebar.
══════════════════════════════════════════ */

const JOURNAL_ENTRIES = {
  A: {
    id:     'A',
    module: 'O2 CONTROL',
    color:  'var(--accent)',
    title:  'Dr. Petrov — Day 81',
    text:   'The O2 recyclers are failing faster than projected. Yuen says it\'s the algae — something in the bio-cultures mutated. I\'ve had to override the pressure sequence manually three times this week. Whatever it is, it\'s spreading to the water supply too.',
  },
  B: {
    id:     'B',
    module: 'REACTOR BAY',
    color:  'var(--orange)',
    title:  'Vasquez Maintenance Log — Day 88',
    text:   'Reactor went into emergency shutdown at 03:00. No fault in the core — someone manually rerouted the conduits to isolate Lab 7 from the grid. I\'ve re-checked three times. This wasn\'t a system fault. Someone did this deliberately. Petrov won\'t answer my messages. I\'m filing an incident report.',
    subTitle: 'Automated Incident Report — Day 88',
    subText:  'Filed by: Vasquez, E. Reviewed by: Station Commander Okafor. Disposition: NO ACTION REQUIRED. DO NOT ESCALATE.',
  },
  C: {
    id:     'C',
    module: 'COMMS ARRAY',
    color:  'var(--purple)',
    title:  'Partial Transmission — Source Unknown — Day 89',
    text:   '...do not enter Lab Seven. Spores are airborne in that section — containment held for six days but Yuen broke protocol trying to retrieve his notes. We are moving to Pod Bay Three now. Commander Okafor has the full research package. If anyone receives this — the relay authentication is LAB SEVEN. Do not trust Helix Corp\'s official account of what happened here. They knew. They approved it. [SIGNAL LOST]',
  },
  D: {
    id:     'D',
    module: 'MED BAY',
    color:  'var(--green)',
    title:  'Dr. Petrov — Personal Log — Day 91',
    text:   'Yuen is symptomatic. Fever, disorientation, the lesions Helix Corp said were impossible outside a controlled exposure. The samples in cabinet D7 are the only proof of what strain they were engineering. I\'ve locked them behind the sequencer. Okafor came to the med bay this morning. He didn\'t ask about Yuen. He asked if the samples were still viable. That\'s when I understood — they don\'t want this stopped. They want to collect it.',
  },
};

/* ── READ / WRITE ── */
function getDiscovered() {
  try {
    return JSON.parse(localStorage.getItem('erebus-journal') || '[]');
  } catch { return []; }
}

function discoverEntry(id) {
  const discovered = getDiscovered();
  if (!discovered.includes(id)) {
    discovered.push(id);
    localStorage.setItem('erebus-journal', JSON.stringify(discovered));
  }
}

/* Called by hub.html after checking game state */
function syncJournalFromGame() {
  const state = JSON.parse(localStorage.getItem('erebus') || '{}');
  ['A','B','C','D'].forEach(id => {
    if (state[id]) discoverEntry(id);
  });
}

/* ── RENDER ── */
function renderJournal(containerId) {
  const container  = document.getElementById(containerId);
  if (!container) return;

  const discovered = getDiscovered();

  if (discovered.length === 0) {
    container.innerHTML = `
      <div class="journal-empty">
        <div class="journal-empty-icon">◈</div>
        <div class="journal-empty-text">No logs recovered yet.<br>Complete modules to unlock entries.</div>
      </div>`;
    return;
  }

  container.innerHTML = '';

  // show undiscovered count
  const total   = Object.keys(JOURNAL_ENTRIES).length;
  const missing = total - discovered.length;
  if (missing > 0) {
    const pill = document.createElement('div');
    pill.className = 'journal-missing';
    pill.textContent = `${missing} log${missing > 1 ? 's' : ''} remaining — complete modules to unlock`;
    container.appendChild(pill);
  }

  // render discovered entries newest first
  [...discovered].reverse().forEach(id => {
    const entry = JOURNAL_ENTRIES[id];
    if (!entry) return;

    const card = document.createElement('div');
    card.className = 'journal-card';
    card.style.setProperty('--entry-color', entry.color);

    card.innerHTML = `
      <div class="journal-card-header">
        <div class="journal-module" style="color:${entry.color}">${entry.module}</div>
        <div class="journal-frag">FRAG ${entry.id}</div>
      </div>
      <div class="journal-title">${entry.title}</div>
      <div class="journal-body">${entry.text}</div>
      ${entry.subTitle ? `
        <div class="journal-sub-title">${entry.subTitle}</div>
        <div class="journal-sub-body">${entry.subText}</div>
      ` : ''}
    `;
    container.appendChild(card);
  });
}
