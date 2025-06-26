/**
 * Arquivo de exportação centralizada para todas as constantes
 * Facilita a importação em outros arquivos do projeto
 */

// Importação de todas as constantes
import * as weekDays from './weekDays';
import * as months from './months';
import * as schoolYear from './schoolYear';
import * as subjects from './subjects';
import * as formOptions from './formOptions';

// Exportação centralizada
export {
  weekDays,
  months,
  schoolYear,
  subjects,
  formOptions,
};

// Exportação direta das constantes mais utilizadas
export const {
  WEEK_DAYS_SHORT,
  WEEK_DAYS_FULL,
  BUSINESS_DAYS_SHORT,
  BUSINESS_DAYS_FULL,
} = weekDays;

export const {
  MONTHS_SHORT,
  MONTHS_FULL,
} = months;

export const {
  SCHOOL_TERMS,
  SCHOOL_SEMESTERS,
  PRESCHOOL_YEARS,
  ELEMENTARY_SCHOOL_YEARS,
  HIGH_SCHOOL_YEARS,
  ALL_SCHOOL_YEARS,
  EDUCATION_LEVELS,
  YEAR_TO_LEVEL_MAP,
  SCHOOL_YEAR_STATUS,
} = schoolYear;

export const {
  COMMON_SUBJECTS,
  ELEMENTARY_SUBJECTS,
  HIGH_SCHOOL_SUBJECTS,
  SUBJECT_CODES,
  KNOWLEDGE_AREAS,
} = subjects;

export const {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  RELATIONSHIP_OPTIONS,
  BRAZILIAN_STATES,
  STUDENT_STATUS_OPTIONS,
  CONTACT_TYPE_OPTIONS,
} = formOptions;
