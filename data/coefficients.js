const BAC_COEFFICIENTS = {
  general: {
    id: 'general',
    label: 'Bac Général',
    controleContinu: [
      { id: 'hg', label: 'Histoire-Géographie', coefTotal: 6, coef1ere: 3, coefTerm: 3 },
      { id: 'lva', label: 'Langue vivante A', coefTotal: 6, coef1ere: 3, coefTerm: 3 },
      { id: 'lvb', label: 'Langue vivante B', coefTotal: 6, coef1ere: 3, coefTerm: 3 },
      { id: 'ensSci', label: 'Enseignement scientifique', coefTotal: 6, coef1ere: 3, coefTerm: 3 },
      { id: 'eps', label: 'EPS', coefTotal: 6, coef1ere: 0, coefTerm: 6 },
      { id: 'emc', label: 'EMC', coefTotal: 2, coef1ere: 1, coefTerm: 1 },
      { id: 'speAbandon', label: 'Spécialité abandonnée (1ère)', coefTotal: 8, coef1ere: 8, coefTerm: 0 },
    ],
    epreuvesAnticipees: [
      { id: 'francaisEcrit', label: 'Français écrit', coef: 5 },
      { id: 'francaisOral', label: 'Français oral', coef: 5 },
    ],
    epreuvesTerminales: [
      { id: 'philo', label: 'Philosophie', coef: 8 },
      { id: 'grandOral', label: 'Grand oral', coef: 10 },
      { id: 'spe1', label: 'Spécialité 1', coef: 16 },
      { id: 'spe2', label: 'Spécialité 2', coef: 16 },
    ],
    options: [
      { id: 'optMathComp', label: 'Maths complémentaires', coefTotal: 2, coef1ere: 0, coefTerm: 2 },
      { id: 'optMathExp', label: 'Maths expertes', coefTotal: 2, coef1ere: 0, coefTerm: 2 },
      { id: 'optLCA', label: 'LCA Latin/Grec', coefTotal: 12, coef1ere: 6, coefTerm: 6 },
      { id: 'optDGEMC', label: 'DGEMC / option 2 ans', coefTotal: 4, coef1ere: 2, coefTerm: 2 },
    ]
  },

  technologique: {
    id: 'technologique',
    label: 'Bac Technologique',
    controleContinu: [
      { id: 'hg', label: 'Histoire-Géographie', coefTotal: 6, coef1ere: 3, coefTerm: 3 },
      { id: 'lva', label: 'Langue vivante A', coefTotal: 6, coef1ere: 3, coefTerm: 3 },
      { id: 'lvb', label: 'Langue vivante B', coefTotal: 6, coef1ere: 3, coefTerm: 3 },
      { id: 'maths', label: 'Mathématiques', coefTotal: 6, coef1ere: 3, coefTerm: 3 },
      { id: 'eps', label: 'EPS', coefTotal: 6, coef1ere: 0, coefTerm: 6 },
      { id: 'emc', label: 'EMC', coefTotal: 2, coef1ere: 1, coefTerm: 1 },
      { id: 'speAbandon', label: 'Spécialité abandonnée (1ère)', coefTotal: 8, coef1ere: 8, coefTerm: 0 },
    ],
    epreuvesAnticipees: [
      { id: 'francaisEcrit', label: 'Français écrit', coef: 5 },
      { id: 'francaisOral', label: 'Français oral', coef: 5 },
      { id: 'mathsAnticipees', label: 'Mathématiques anticipées', coef: 2 },
    ],
    epreuvesTerminales: [
      { id: 'philo', label: 'Philosophie', coef: 4 },
      { id: 'grandOral', label: 'Grand oral', coef: 14 },
      { id: 'spe1', label: 'Spécialité 1', coef: 16 },
      { id: 'spe2', label: 'Spécialité 2', coef: 16 },
    ],
    options: [
      { id: 'optSupp', label: 'Option 1 an (Terminale)', coefTotal: 2, coef1ere: 0, coefTerm: 2 },
      { id: 'opt2ans', label: 'Option 2 ans', coefTotal: 4, coef1ere: 2, coefTerm: 2 },
    ]
  },

  professionnel: {
    id: 'professionnel',
    label: 'Bac Professionnel',
    controleContinu: [
      { id: 'francais', label: 'Français', coefTotal: 2.5, coef1ere: 1.25, coefTerm: 1.25 },
      { id: 'hgEmc', label: 'Histoire-Géo / EMC', coefTotal: 2.5, coef1ere: 1.25, coefTerm: 1.25 },
      { id: 'mathsSci', label: 'Mathématiques / Sciences', coefTotal: 2, coef1ere: 1, coefTerm: 1 },
      { id: 'lvaPro', label: 'Langue vivante', coefTotal: 2, coef1ere: 1, coefTerm: 1 },
      { id: 'epsPro', label: 'EPS', coefTotal: 2, coef1ere: 0, coefTerm: 2 },
      { id: 'pse', label: 'Prévention Santé Environnement', coefTotal: 1, coef1ere: 0.5, coefTerm: 0.5 },
    ],
    epreuvesAnticipees: [],
    epreuvesTerminales: [
      { id: 'ecoDroit', label: 'Économie-Droit / Gestion', coef: 2 },
      { id: 'artsApp', label: 'Arts appliqués', coef: 1 },
      { id: 'epreuvePro', label: 'Épreuve professionnelle', coef: 12 },
      { id: 'chefOeuvre', label: "Chef-d'œuvre", coef: 4 },
      { id: 'grandOralPro', label: 'Grand oral', coef: 4 },
    ],
    options: []
  }
};
