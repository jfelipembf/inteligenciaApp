/**
 * Constantes para o ano escolar
 */

// Períodos escolares
export const SCHOOL_TERMS = [
  "1º Bimestre",
  "2º Bimestre",
  "3º Bimestre",
  "4º Bimestre",
];

// Semestres
export const SCHOOL_SEMESTERS = [
  "1º Semestre",
  "2º Semestre",
];

// Anos escolares (Educação Infantil)
export const PRESCHOOL_YEARS = [
  "Berçário",
  "Maternal I",
  "Maternal II",
  "Jardim I",
  "Jardim II",
  "Pré-escola",
];

// Anos escolares (Ensino Fundamental)
export const ELEMENTARY_SCHOOL_YEARS = [
  "1º ano",
  "2º ano",
  "3º ano",
  "4º ano",
  "5º ano",
  "6º ano",
  "7º ano",
  "8º ano",
  "9º ano",
];

// Anos escolares (Ensino Médio)
export const HIGH_SCHOOL_YEARS = [
  "1º ano EM",
  "2º ano EM",
  "3º ano EM",
];

// Todos os anos escolares
export const ALL_SCHOOL_YEARS = [
  ...PRESCHOOL_YEARS,
  ...ELEMENTARY_SCHOOL_YEARS,
  ...HIGH_SCHOOL_YEARS,
];

// Níveis de ensino
export const EDUCATION_LEVELS = [
  "Educação Infantil",
  "Ensino Fundamental I",
  "Ensino Fundamental II",
  "Ensino Médio",
];

// Mapeamento de anos escolares para níveis de ensino
export const YEAR_TO_LEVEL_MAP = {
  // Educação Infantil
  "Berçário": "Educação Infantil",
  "Maternal I": "Educação Infantil",
  "Maternal II": "Educação Infantil",
  "Jardim I": "Educação Infantil",
  "Jardim II": "Educação Infantil",
  "Pré-escola": "Educação Infantil",
  
  // Ensino Fundamental
  "1º ano": "Ensino Fundamental I",
  "2º ano": "Ensino Fundamental I",
  "3º ano": "Ensino Fundamental I",
  "4º ano": "Ensino Fundamental I",
  "5º ano": "Ensino Fundamental I",
  "6º ano": "Ensino Fundamental II",
  "7º ano": "Ensino Fundamental II",
  "8º ano": "Ensino Fundamental II",
  "9º ano": "Ensino Fundamental II",
  
  // Ensino Médio
  "1º ano EM": "Ensino Médio",
  "2º ano EM": "Ensino Médio",
  "3º ano EM": "Ensino Médio",
};

// Status do ano letivo
export const SCHOOL_YEAR_STATUS = {
  ACTIVE: "Ativo",
  PLANNED: "Planejado",
  FINISHED: "Encerrado",
  CANCELED: "Cancelado",
};
