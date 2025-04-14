/**
 * Constantes para os dias da semana
 */

// Dias da semana (formato curto)
export const WEEK_DAYS_SHORT = [
  "Dom",
  "Seg",
  "Ter",
  "Qua",
  "Qui",
  "Sex",
  "Sáb",
];

// Dias da semana (formato completo)
export const WEEK_DAYS_FULL = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

// Dias úteis (formato curto)
export const BUSINESS_DAYS_SHORT = [
  "Seg",
  "Ter",
  "Qua",
  "Qui",
  "Sex",
];

// Dias úteis (formato completo)
export const BUSINESS_DAYS_FULL = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
];

// Objeto com índices numéricos
export const WEEK_DAYS_MAP = {
  0: "Domingo",
  1: "Segunda-feira",
  2: "Terça-feira",
  3: "Quarta-feira",
  4: "Quinta-feira",
  5: "Sexta-feira",
  6: "Sábado",
};

// Função auxiliar para obter o nome do dia da semana a partir de uma data
export const getWeekDayName = (date) => {
  const dayIndex = date.getDay();
  return WEEK_DAYS_FULL[dayIndex];
};
