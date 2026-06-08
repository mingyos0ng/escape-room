const JOURNAL_ENTRIES = {
  A: {
    id:     'A',
    module: 'O2 CONTROL',
    color:  'var(--accent)',
    title:  'Petrov — Day 81',
    text:   'Something in the bio-cultures mutated. It\'s spreading to the water supply. I don\'t think it\'s accidental.',
  },
  B: {
    id:       'B',
    module:   'REACTOR BAY',
    color:    'var(--orange)',
    title:    'Vasquez — Day 88',
    text:     'Someone rerouted the conduits to isolate Lab 7. Deliberately. Petrov won\'t answer. My incident report was suppressed by Okafor.',
    subTitle: 'Automated Incident Report — Day 88',
    subText:  'Filed by: Vasquez, E. Reviewed by: Okafor. Disposition: NO ACTION REQUIRED. DO NOT ESCALATE.',
  },
  C: {
    id:     'C',
    module: 'COMMS ARRAY',
    color:  'var(--purple)',
    title:  'Transmission — Day 89',
    text:   'Spores are airborne in Lab Seven. Yuen broke containment. We\'re moving to Pod Bay Three. Helix Corp knew. They approved it. [SIGNAL LOST]',
  },
  D: {
    id:     'D',
    module: 'MED BAY',
    color:  'var(--green)',
    title:  'Petrov — Day 91',
    text:   'Okafor came to ask if the samples were still viable. Not about Yuen. The samples. They don\'t want this stopped — they want to collect it.',
  },
};

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

function syncJournalFromGame() {
  const state = JSON.parse(localStorage.getItem('erebus') || '{}');
  ['A','B','C','D'].forEach(id => {
    if (state[id]) discoverEntry(id);
  });
}

function renderJournal(containerId) {
  const container = document.getElementById(containerId);
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

  const total   = Object.keys(JOURNAL_ENTRIES).length;
  const missing = total - discovered.length;
  if (missing > 0) {
    const pill = document.createElement('div');
    pill.className   = 'journal-missing';
    pill.textContent = `${missing} log${missing > 1 ? 's' : ''} remaining`;
    container.appendChild(pill);
  }

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
