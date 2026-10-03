const WhatIf = {
  calculateTarget(filiere, notes, targetKey) {
    const current = Calculator.calculate(filiere, notes);
    const target = Calculator.getMention(0);

    const mentionThresholds = [
      { key: 'TBF', seuil: 18 },
      { key: 'TB', seuil: 16 },
      { key: 'Bien', seuil: 14 },
      { key: 'AB', seuil: 12 },
      { key: 'Admis', seuil: 10 },
    ];

    const targetThreshold = mentionThresholds.find(t => t.key === targetKey);
    if (!targetThreshold || !current) return null;

    const diff = targetThreshold.seuil - current.moyenne;
    if (diff <= 0) {
      return { achievable: true, message: 'Objectif déjà atteint !' };
    }

    const neededMoyenne = targetThreshold.seuil;
    const data = BAC_COEFFICIENTS[filiere];
    const suggestions = [];

    const allSubjects = [
      ...data.epreuvesTerminales.map(s => ({ ...s, note: notes[s.id]?.note || 0 })),
      ...data.epreuvesAnticipees.map(s => ({ ...s, note: notes[s.id]?.note || 0 })),
    ];

    for (const s of allSubjects) {
      const currentNote = s.note || 0;
      if (currentNote >= 20) continue;
      const needed = Math.min(20, Math.round((currentNote + (diff * 20) / s.coef) * 10) / 10);
      if (needed > currentNote && needed <= 20) {
        suggestions.push({
          subject: s.label,
          coef: s.coef,
          current: currentNote,
          needed: Math.max(needed, currentNote + 0.5)
        });
      }
    }

    suggestions.sort((a, b) => b.coef - a.coef);

    return {
      achievable: suggestions.length > 0,
      targetMention: targetKey,
      neededMoyenne,
      currentMoyenne: current.moyenne,
      diff: Math.round(diff * 100) / 100,
      suggestions: suggestions.slice(0, 5)
    };
  }
};
