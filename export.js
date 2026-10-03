const Export = {
  CSV() {
    const data = BAC_COEFFICIENTS[currentFiliere];
    if (!data) return;

    const lines = ['Matière;Note;Coefficient'];
    const addSubjects = (subjects) => {
      for (const s of subjects) {
        const n = currentNotes[s.id];
        let note = '';
        if (s.coef1ere != null) {
          const parts = [];
          if (n && n.note1ere != null) parts.push('1ère:' + n.note1ere);
          if (n && n.noteTerm != null) parts.push('Term:' + n.noteTerm);
          note = parts.join(' / ');
        } else {
          note = n?.note ?? '';
        }
        const coef = s.coef ?? s.coefTotal ?? '';
        if (note) lines.push(`${s.label};${note};${coef}`);
      }
    };

    addSubjects(data.controleContinu);
    addSubjects(data.epreuvesAnticipees);
    addSubjects(data.epreuvesTerminales);
    addSubjects(data.options);

    const result = Calculator.calculate(currentFiliere, currentNotes);
    if (result) {
      lines.push('');
      lines.push(`Moyenne;${result.moyenne.toFixed(2)};`);
      lines.push(`Mention;${result.mention.label};`);
      lines.push(`Points;${result.points}/${result.maxPoints};`);
    }

    const csv = lines.join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bac-simulateur.csv';
    a.click();
    URL.revokeObjectURL(url);
  },

  PDF() {
    const data = BAC_COEFFICIENTS[currentFiliere];
    if (!data) return;

    const result = Calculator.calculate(currentFiliere, currentNotes);

    let tableRows = '';
    const addRow = (label, note, coef) => {
      tableRows += `<tr><td>${label}</td><td style="text-align:center">${note ?? '-'}</td><td style="text-align:center">${coef}</td></tr>`;
    };

    for (const s of data.controleContinu) {
      const n = currentNotes[s.id];
      let note = '-';
      if (s.coef1ere > 0 && s.coefTerm > 0 && n) {
        const p1 = n.note1ere != null ? n.note1ere : '-';
        const p2 = n.noteTerm != null ? n.noteTerm : '-';
        note = `${p1} / ${p2}`;
      } else if (n) {
        note = n.note1ere ?? n.noteTerm ?? '-';
      }
      addRow(s.label, note, s.coefTotal);
    }

    for (const s of data.epreuvesAnticipees) {
      const n = currentNotes[s.id];
      addRow(s.label, n?.note ?? '-', s.coef);
    }

    for (const s of data.epreuvesTerminales) {
      const n = currentNotes[s.id];
      addRow(s.label, n?.note ?? '-', s.coef);
    }

    for (const s of data.options) {
      const n = currentNotes[s.id];
      let note = '-';
      if (s.coef1ere > 0 && s.coefTerm > 0 && n) {
        const p1 = n.note1ere != null ? n.note1ere : '-';
        const p2 = n.noteTerm != null ? n.noteTerm : '-';
        note = `${p1} / ${p2}`;
      } else if (n) {
        note = n.note1ere ?? n.noteTerm ?? '-';
      }
      addRow(s.label, note, s.coefTotal);
    }

    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Simulateur Bac 2026</title>
<style>
  body { font-family: sans-serif; padding: 2rem; color: #333; }
  h1 { font-size: 1.4rem; margin-bottom: 0.25rem; }
  .subtitle { color: #666; margin-bottom: 1.5rem; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
  th, td { border: 1px solid #ccc; padding: 0.5rem; text-align: left; font-size: 0.85rem; }
  th { background: #f5f5f5; }
  .result-box { text-align: center; padding: 1.5rem; border: 2px solid ${result?.mention.color || '#ccc'}; border-radius: 8px; }
  .moyenne { font-size: 2rem; font-weight: bold; color: ${result?.mention.color || '#333'}; }
  .mention { font-size: 1.1rem; margin-top: 0.5rem; }
</style>
</head>
<body>
  <h1>📊 Simulateur Bac 2026</h1>
  <p class="subtitle">${data.label}</p>
  <table>
    <thead><tr><th>Matière</th><th style="width:120px">Note</th><th style="width:80px">Coef.</th></tr></thead>
    <tbody>${tableRows}</tbody>
  </table>
  <div class="result-box">
    <div style="font-size:0.9rem;color:#666;">Moyenne finale</div>
    <div class="moyenne">${result ? result.moyenne.toFixed(2) : '-'}/20</div>
    <div class="mention" style="color:${result?.mention.color || '#333'}">${result?.mention.label || '-'}</div>
    <div style="margin-top:0.5rem;font-size:0.85rem;color:#888;">${result ? result.points + ' points / ' + result.maxPoints : ''}</div>
  </div>
  <p style="margin-top:2rem;text-align:center;font-size:0.75rem;color:#999;">Généré par Simulateur Bac 2026</p>
  <script>window.onload = function() { window.print(); }; <\\/script>
</body>
</html>`);
    win.document.close();
  }
};
