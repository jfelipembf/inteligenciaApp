import * as Yup from "yup";

// Esquema de validação para o formulário de cadastro de alunos
export const studentValidationSchema = Yup.object({
  // Dados do aluno
  fullName: Yup.string().required("Nome é obrigatório"),
  email: Yup.string().email("Email inválido").required("Email é obrigatório"),
  phone: Yup.string().required("Telefone é obrigatório"),
  birthDate: Yup.string().required("Data de nascimento é obrigatória"),
  registration: Yup.string().required("Matrícula é obrigatória"),
  gender: Yup.string().required("Sexo é obrigatório"),
  cpf: Yup.string().required("CPF é obrigatório"),
  
  // Senha
  password: Yup.string().required("Senha é obrigatória"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "As senhas não coincidem")
    .required("Confirmação de senha é obrigatória"),
  
  // Endereço
  cep: Yup.string().required("CEP é obrigatório"),
  street: Yup.string().required("Rua é obrigatória"),
  number: Yup.string().required("Número é obrigatório"),
  neighborhood: Yup.string().required("Bairro é obrigatório"),
  city: Yup.string().required("Cidade é obrigatória"),
  state: Yup.string().required("Estado é obrigatório"),
  
  // Dados do responsável
  guardianName: Yup.string().required("Nome do responsável é obrigatório"),
  guardianCpf: Yup.string().required("CPF do responsável é obrigatório"),
  guardianEmail: Yup.string().email("Email inválido").required("Email do responsável é obrigatório"),
  guardianPhone: Yup.string().required("Telefone do responsável é obrigatório"),
  guardianRelationship: Yup.string().required("Parentesco é obrigatório"),
});

// Valores iniciais para o formulário de cadastro de alunos
export const studentInitialValues = {
  fullName: "",
  email: "",
  phone: "",
  birthDate: "",
  registration: "",
  classId: "",
  gender: "",
  cpf: "",
  password: "",
  confirmPassword: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  guardianName: "",
  guardianCpf: "",
  guardianEmail: "",
  guardianPhone: "",
  guardianRelationship: "",
};
