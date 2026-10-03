let currentFiliere = null;
let currentNotes = {};

function init() {
  const saved = Storage.load();
  if (saved && saved.filiere && saved.notes) {
    currentFiliere = saved.filiere;
    currentNotes = saved.notes;
    selectFiliere(saved.filiere);
  }

  document.querySelectorAll('.filiere-card').forEach(card => {
    card.addEventListener('click', () => {
      selectFiliere(card.dataset.filiere);
    });
  });
}

function selectFiliere(filiereId) {
  currentFiliere = filiereId;
  $('#step-filiere').classList.add('hidden');
  $('#simulator').classList.remove('hidden');
  renderForm(filiereId);
  renderResults();
  renderProgress();
  updateSave();
}

function backToFiliere() {
  $('#simulator').classList.add('hidden');
  $('#step-filiere').classList.remove('hidden');
  currentFiliere = null;
}

function renderForm(filiereId) {
  const data = BAC_COEFFICIENTS[filiereId];
  const container = $('#form-panel');
  container.innerHTML = '';

  if (data.controleContinu.length) {
    const section = createSection('Contrôle continu', data.controleContinu.map(m => ({
      id: m.id,
      label: m.label,
      fields: [
        m.coef1ere > 0 ? { key: 'note1ere', placeholder: '1ère', coef: m.coef1ere } : null,
        m.coefTerm > 0 ? { key: 'noteTerm', placeholder: 'Term', coef: m.coefTerm } : null,
      ].filter(Boolean),
      coefLabel: 'coef ' + m.coefTotal
    })));
    container.appendChild(section);
  }

  if (data.epreuvesAnticipees.length) {
    const section = createSection('Épreuves anticipées (1ère)', data.epreuvesAnticipees.map(ep => ({
      id: ep.id,
      label: ep.label,
      fields: [{ key: 'note', placeholder: 'Note', coef: ep.coef }],
      coefLabel: 'coef ' + ep.coef
    })));
    container.appendChild(section);
  }

  if (data.epreuvesTerminales.length) {
    const section = createSection('Épreuves terminales (Terminale)', data.epreuvesTerminales.map(ep => ({
      id: ep.id,
      label: ep.label,
      fields: [{ key: 'note', placeholder: 'Note', coef: ep.coef }],
      coefLabel: 'coef ' + ep.coef
    })));
    container.appendChild(section);
  }

  if (data.options.length) {
    const section = createSection('Options facultatives', data.options.map(opt => ({
      id: opt.id,
      label: opt.label,
      fields: [
        opt.coef1ere > 0 ? { key: 'note1ere', placeholder: '1ère', coef: opt.coef1ere } : null,
        opt.coefTerm > 0 ? { key: 'noteTerm', placeholder: 'Term', coef: opt.coefTerm } : null,
      ].filter(Boolean),
      coefLabel: 'coef ' + opt.coefTotal
    })));
    container.appendChild(section);
  }
}

function createSection(title, items) {
  const section = document.createElement('div');
  section.className = 'form-section';
  section.innerHTML = `<h2>${title}</h2>`;

  const maxFields = items.reduce((max, item) => Math.max(max, item.fields.length), 0);

  if (maxFields > 1) {
    const headerRow = document.createElement('div');
    headerRow.className = 'input-row input-row-header';
    headerRow.appendChild(document.createElement('label'));
    const h1 = document.createElement('span');
    h1.className = 'col-header';
    h1.textContent = '1ère';
    headerRow.appendChild(h1);
    const h2 = document.createElement('span');
    h2.className = 'col-header';
    h2.textContent = 'Term';
    headerRow.appendChild(h2);
    const h3 = document.createElement('span');
    h3.className = 'coef-badge';
    headerRow.appendChild(h3);
    section.appendChild(headerRow);
  }

  for (const item of items) {
    const n = currentNotes[item.id] || {};
    const row = document.createElement('div');
    row.className = 'input-row';

    const label = document.createElement('label');
    label.textContent = item.label;
    row.appendChild(label);

    for (const field of item.fields) {
      const input = document.createElement('input');
      input.type = 'number';
      input.min = 0;
      input.max = 20;
      input.step = 0.5;
      input.value = n[field.key] ?? '';
      input.placeholder = field.placeholder;
      input.dataset.id = item.id;
      input.dataset.field = field.key;
      input.addEventListener('input', onNoteChange);
      row.appendChild(input);
    }

    for (let i = item.fields.length; i < maxFields; i++) {
      const spacer = document.createElement('span');
      spacer.className = 'input-spacer';
      row.appendChild(spacer);
    }

    const badge = document.createElement('span');
    badge.className = 'coef-badge';
    badge.textContent = item.coefLabel;
    row.appendChild(badge);

    section.appendChild(row);
  }

  return section;
}

function onNoteChange(e) {
  const id = e.target.dataset.id;
  const field = e.target.dataset.field;
  const val = e.target.value;

  if (!currentNotes[id]) currentNotes[id] = {};
  currentNotes[id][field] = val !== '' ? parseFloat(val) : null;

  updateSave();
  renderResults();
}

function renderResults() {
  if (!currentFiliere) return;
  const result = Calculator.calculate(currentFiliere, currentNotes);
  const panel = $('#results-panel');

  if (!result || result.totalCoefs === 0) {
    panel.innerHTML = `
      <div class="result-card">
        <p style="color:var(--text-light);">Saisis tes notes<br>pour voir le résultat</p>
      </div>
    `;
    return;
  }

  panel.innerHTML = `
    <div class="result-card">
      <div style="font-size:0.9rem;color:var(--text-light);">Moyenne</div>
      <div class="result-moyenne" style="color:${result.mention.color}">${result.moyenne.toFixed(2)}</div>
      <div class="result-mention" style="background:${result.mention.color}">${result.mention.label}</div>
      <div class="jauge">
        <div class="jauge-fill" style="width:${Math.min(100, (result.moyenne / 20) * 100)}%;background:${result.mention.color}"></div>
      </div>
      <div class="result-points">
        ${result.points} pts / ${result.maxPoints} pts
      </div>
    </div>
    <button class="btn btn-outline" onclick="toggleWhatif()" style="width:100%;margin-bottom:0.5rem;">
      🎯 Objectif mention
    </button>
    <div class="result-actions">
      <button class="btn btn-sm btn-outline" onclick="Export.CSV()">📥 CSV</button>
      <button class="btn btn-sm btn-outline" onclick="Export.PDF()">📄 PDF</button>
    </div>
    <div id="whatif-container"></div>
  `;
}

function renderProgress() {
  const bar = $('#progress-bar');
  const data = BAC_COEFFICIENTS[currentFiliere];
  if (!data) return;

  const steps = [];
  if (data.controleContinu.length) steps.push('Contrôle continu');
  if (data.epreuvesAnticipees.length) steps.push('Anticipées');
  if (data.epreuvesTerminales.length) steps.push('Terminales');
  if (data.options.length) steps.push('Options');

  bar.innerHTML = steps.map((s, i) =>
    `<div class="step-dot done" title="${s}"></div>`
  ).join('');
}

function updateSave() {
  Storage.autoSave({ filiere: currentFiliere, notes: currentNotes });
}

function resetAll() {
  if (!confirm('Effacer toutes les notes sauvegardées ?')) return;
  Storage.clear();
  currentFiliere = null;
  currentNotes = {};
  location.reload();
}

function toggleWhatif() {
  const container = $('#whatif-container');
  const existing = container.querySelector('.whatif-card');
  if (existing) {
    container.innerHTML = '';
    return;
  }

  const card = document.createElement('div');
  card.className = 'result-card whatif-card';

  const mentions = [
    { key: 'AB', label: 'Assez Bien (≥12/20)' },
    { key: 'Bien', label: 'Bien (≥14/20)' },
    { key: 'TB', label: 'Très Bien (≥16/20)' },
    { key: 'TBF', label: 'TB Félicitations (≥18/20)' },
  ];

  card.innerHTML = `
    <h3>🎯 Objectif mention</h3>
    <select id="whatif-select" onchange="updateWhatif()">
      <option value="">Choisis une mention cible...</option>
      ${mentions.map(m => `<option value="${m.key}">${m.label}</option>`).join('')}
    </select>
    <div id="whatif-result"></div>
  `;

  container.appendChild(card);
}

function updateWhatif() {
  const target = $('#whatif-select')?.value;
  const resultDiv = $('#whatif-result');
  if (!target) {
    resultDiv.innerHTML = '';
    return;
  }

  const analysis = WhatIf.calculateTarget(currentFiliere, currentNotes, target);
  if (!analysis) {
    resultDiv.innerHTML = '<p style="font-size:0.85rem;color:#999;">Saisis d\'abord des notes</p>';
    return;
  }

  if (analysis.message) {
    resultDiv.innerHTML = `<p style="color:var(--success);font-weight:600;">✅ ${analysis.message}</p>`;
    return;
  }

  if (!analysis.achievable) {
    resultDiv.innerHTML = '<p style="color:var(--danger);">Objectif difficilement atteignable avec les notes actuelles.</p>';
    return;
  }

  let html = `<p style="font-size:0.85rem;margin-bottom:0.5rem;">
    Il te manque <strong>${analysis.diff} points</strong> pour atteindre ${analysis.neededMoyenne}/20.
    Concentre-toi sur ces matières :
  </p>`;

  for (const s of analysis.suggestions) {
    html += `<div class="whatif-item">
      <span>${s.subject}</span>
      <span class="needed">${s.current} → ${s.needed}/20</span>
    </div>`;
  }

  resultDiv.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', init);
