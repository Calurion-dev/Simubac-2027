const Calculator = {
  calculate(filiere, notes) {
    const data = BAC_COEFFICIENTS[filiere];
    if (!data) return null;

    let points = 0;
    let totalCoefs = 0;

    for (const m of data.controleContinu) {
      const n = notes[m.id];
      if (n && n.note1ere != null && !isNaN(n.note1ere)) {
        points += n.note1ere * m.coef1ere;
        totalCoefs += m.coef1ere;
      }
      if (n && n.noteTerm != null && !isNaN(n.noteTerm)) {
        points += n.noteTerm * m.coefTerm;
        totalCoefs += m.coefTerm;
      }
    }

    for (const ep of data.epreuvesAnticipees) {
      if (notes[ep.id] && notes[ep.id].note != null && !isNaN(notes[ep.id].note)) {
        points += notes[ep.id].note * ep.coef;
        totalCoefs += ep.coef;
      }
    }

    for (const ep of data.epreuvesTerminales) {
      if (notes[ep.id] && notes[ep.id].note != null && !isNaN(notes[ep.id].note)) {
        points += notes[ep.id].note * ep.coef;
        totalCoefs += ep.coef;
      }
    }

    for (const opt of data.options) {
      const n = notes[opt.id];
      if (n && n.note1ere != null && !isNaN(n.note1ere)) {
        points += n.note1ere * opt.coef1ere;
        totalCoefs += opt.coef1ere;
      }
      if (n && n.noteTerm != null && !isNaN(n.noteTerm)) {
        points += n.noteTerm * opt.coefTerm;
        totalCoefs += opt.coefTerm;
      }
    }

    const effectiveCoefs = totalCoefs > 0 ? totalCoefs : 1;
    const rawMoyenne = points / effectiveCoefs;
    const moyenne = Math.ceil(rawMoyenne * 10) / 10;
    const maxPoints = totalCoefs > 0 ? totalCoefs * 20 : 0;

    const mention = this.getMention(moyenne);

    return {
      moyenne,
      rawMoyenne: Math.round(rawMoyenne * 100) / 100,
      points: Math.round(points * 10) / 10,
      totalCoefs,
      maxPoints,
      mention
    };
  },

  getMention(moyenne) {
    if (moyenne >= 18) return { label: 'Très Bien (félicitations)', color: '#FFD700', key: 'TBF' };
    if (moyenne >= 16) return { label: 'Très Bien', color: '#26A69A', key: 'TB' };
    if (moyenne >= 14) return { label: 'Bien', color: '#42A5F5', key: 'Bien' };
    if (moyenne >= 12) return { label: 'Assez Bien', color: '#66BB6A', key: 'AB' };
    if (moyenne >= 10) return { label: 'Admis', color: '#FFA726', key: 'Admis' };
    if (moyenne >= 8) return { label: 'Rattrapage', color: '#EF5350', key: 'Ratt' };
    return { label: 'Non admis', color: '#EF5350', key: 'NA' };
  }
};
