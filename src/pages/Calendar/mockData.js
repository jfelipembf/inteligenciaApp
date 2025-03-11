// Dados fictícios para eventos de aulas de todos os anos e séries
export const initialEvents = [
  // 1º Ano - Ensino Fundamental
  {
    id: 1,
    title: "Português",
    start: new Date(),
    className: "bg-light border",
    professor: "Maria Silva",
    serie: "Fundamental",
    ano: "1º Ano",
    turma: "A",
    categoria: "Ensino Fundamental - 1º Ano"
  },
  {
    id: 2,
    title: "Matemática",
    start: new Date(new Date().setHours(new Date().getHours() + 2)),
    className: "bg-light border",
    professor: "João Santos",
    serie: "Fundamental",
    ano: "1º Ano",
    turma: "A",
    categoria: "Ensino Fundamental - 1º Ano"
  },
  {
    id: 3,
    title: "Ciências",
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    className: "bg-light border",
    professor: "Ana Oliveira",
    serie: "Fundamental",
    ano: "1º Ano",
    turma: "B",
    categoria: "Ensino Fundamental - 1º Ano"
  },
  {
    id: 4,
    title: "História",
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    className: "bg-light border",
    professor: "Carlos Mendes",
    serie: "Fundamental",
    ano: "1º Ano",
    turma: "B",
    end: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(new Date().getHours() + 2),
    categoria: "Ensino Fundamental - 1º Ano"
  },
  {
    id: 20,
    title: "Geografia",
    start: new Date(new Date().setDate(new Date().getDate() + 2)),
    className: "bg-light border",
    professor: "Roberta Lima",
    serie: "Fundamental",
    ano: "1º Ano",
    turma: "C",
    categoria: "Ensino Fundamental - 1º Ano"
  },
  
  // 2º Ano - Ensino Fundamental
  {
    id: 5,
    title: "Português",
    start: new Date(new Date().setDate(new Date().getDate() + 2)),
    className: "bg-light border",
    professor: "Fernanda Costa",
    serie: "Fundamental",
    ano: "2º Ano",
    turma: "A",
    categoria: "Ensino Fundamental - 2º Ano"
  },
  {
    id: 6,
    title: "Matemática",
    start: new Date(new Date().setDate(new Date().getDate() + 2)).setHours(new Date().getHours() + 2),
    className: "bg-light border",
    professor: "Ricardo Souza",
    serie: "Fundamental",
    ano: "2º Ano",
    turma: "A",
    categoria: "Ensino Fundamental - 2º Ano"
  },
  {
    id: 7,
    title: "Geografia",
    start: new Date(new Date().setDate(new Date().getDate() + 3)),
    className: "bg-light border",
    professor: "Marcos Pereira",
    serie: "Fundamental",
    ano: "2º Ano",
    turma: "B",
    categoria: "Ensino Fundamental - 2º Ano"
  },
  
  // 3º Ano - Ensino Fundamental
  {
    id: 8,
    title: "Artes",
    start: new Date(new Date().setDate(new Date().getDate() + 4)),
    className: "bg-light border",
    professor: "Juliana Alves",
    serie: "Fundamental",
    ano: "3º Ano",
    turma: "A",
    categoria: "Ensino Fundamental - 3º Ano"
  },
  {
    id: 9,
    title: "Educação Física",
    start: new Date(new Date().setDate(new Date().getDate() + 5)),
    className: "bg-light border",
    professor: "Paulo Ferreira",
    serie: "Fundamental",
    ano: "3º Ano",
    turma: "B",
    categoria: "Ensino Fundamental - 3º Ano"
  },
  
  // 1º Ano - Ensino Médio
  {
    id: 10,
    title: "Física",
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    className: "bg-light border",
    professor: "Roberto Dias",
    serie: "Médio",
    ano: "1º Ano",
    turma: "A",
    categoria: "Ensino Médio - 1º Ano"
  },
  {
    id: 11,
    title: "Química",
    start: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(new Date().getHours() + 3),
    className: "bg-light border",
    professor: "Camila Rocha",
    serie: "Médio",
    ano: "1º Ano",
    turma: "A",
    categoria: "Ensino Médio - 1º Ano"
  },
  
  // 2º Ano - Ensino Médio
  {
    id: 12,
    title: "Biologia",
    start: new Date(new Date().setDate(new Date().getDate() + 2)),
    className: "bg-light border",
    professor: "Luciana Martins",
    serie: "Médio",
    ano: "2º Ano",
    turma: "A",
    categoria: "Ensino Médio - 2º Ano"
  },
  {
    id: 13,
    title: "Literatura",
    start: new Date(new Date().setDate(new Date().getDate() + 3)),
    className: "bg-light border",
    professor: "Marcelo Gomes",
    serie: "Médio",
    ano: "2º Ano",
    turma: "A",
    categoria: "Ensino Médio - 2º Ano"
  },
  
  // 3º Ano - Ensino Médio
  {
    id: 14,
    title: "Redação",
    start: new Date(new Date().setDate(new Date().getDate() + 4)),
    className: "bg-light border",
    professor: "Daniela Castro",
    serie: "Médio",
    ano: "3º Ano",
    turma: "A",
    categoria: "Ensino Médio - 3º Ano"
  },
  {
    id: 15,
    title: "Matemática",
    start: new Date(new Date().setDate(new Date().getDate() + 5)),
    className: "bg-light border",
    professor: "André Moreira",
    serie: "Médio",
    ano: "3º Ano",
    turma: "A",
    categoria: "Ensino Médio - 3º Ano"
  },
];

// Dados fictícios para categorias
export const initialCategories = [
  {
    id: 1,
    title: "Ensino Fundamental - 1º Ano",
    type: "bg-primary",
  },
  {
    id: 2,
    title: "Ensino Fundamental - 2º Ano",
    type: "bg-success",
  },
  {
    id: 3,
    title: "Ensino Fundamental - 3º Ano",
    type: "bg-info",
  },
  {
    id: 4,
    title: "Ensino Médio - 1º Ano",
    type: "bg-warning",
  },
  {
    id: 5,
    title: "Ensino Médio - 2º Ano",
    type: "bg-danger",
  },
  {
    id: 6,
    title: "Ensino Médio - 3º Ano",
    type: "bg-dark",
  },
];

// Dados para os turnos
export const turnos = ["Manhã", "Tarde", "Noite"];

// Dados para os horários de aula
export const horariosAula = {
  "Manhã": [
    "07:00 - 07:50",
    "07:50 - 08:40",
    "08:40 - 09:30",
    "09:50 - 10:40",
    "10:40 - 11:30"
  ],
  "Tarde": [
    "13:00 - 13:50",
    "13:50 - 14:40",
    "14:40 - 15:30",
    "15:50 - 16:40",
    "16:40 - 17:30"
  ],
  "Noite": [
    "18:30 - 19:20",
    "19:20 - 20:10",
    "20:10 - 21:00",
    "21:10 - 22:00"
  ]
};

// Dados para os dias da semana
export const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
