/**
 * Constantes para opções de formulários
 */

// Opções de gênero
export const GENDER_OPTIONS = [
  { value: "masculino", label: "Masculino" },
  { value: "feminino", label: "Feminino" },
  { value: "outro", label: "Outro" },
  { value: "prefiro_nao_informar", label: "Prefiro não informar" },
];

// Opções de estado civil
export const MARITAL_STATUS_OPTIONS = [
  { value: "solteiro", label: "Solteiro(a)" },
  { value: "casado", label: "Casado(a)" },
  { value: "divorciado", label: "Divorciado(a)" },
  { value: "viuvo", label: "Viúvo(a)" },
  { value: "uniao_estavel", label: "União Estável" },
  { value: "separado", label: "Separado(a)" },
];

// Opções de parentesco (para responsáveis)
export const RELATIONSHIP_OPTIONS = [
  { value: "mae", label: "Mãe" },
  { value: "pai", label: "Pai" },
  { value: "avo", label: "Avô/Avó" },
  { value: "tio", label: "Tio/Tia" },
  { value: "irmao", label: "Irmão/Irmã" },
  { value: "tutor_legal", label: "Tutor Legal" },
  { value: "outro", label: "Outro" },
];

// Opções de estados brasileiros
export const BRAZILIAN_STATES = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

// Status do aluno
export const STUDENT_STATUS_OPTIONS = [
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
  { value: "transferido", label: "Transferido" },
  { value: "trancado", label: "Trancado" },
  { value: "formado", label: "Formado" },
];

// Tipos de contato
export const CONTACT_TYPE_OPTIONS = [
  { value: "celular", label: "Celular" },
  { value: "residencial", label: "Telefone Residencial" },
  { value: "trabalho", label: "Telefone Trabalho" },
  { value: "email", label: "E-mail" },
  { value: "whatsapp", label: "WhatsApp" },
];
