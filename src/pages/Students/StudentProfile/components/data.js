// Dados fictícios do aluno
export const studentData = {
  name: "João Silva",
  registration: "2024001",
  class: "9º Ano A",
  status: "active",
  birthDate: "2009-05-15",
  cpf: "123.456.789-00",
  email: "joao.silva@email.com",
  phone: "(79) 99999-1111",
  grade: "9º Ano",
  hasApp: true,
  lastAccess: "2024-03-15T10:30:00",
  grades: [
    { subject: "Matemática", b1: 8.5, b2: 7.5, b3: 9.0, b4: 8.0, rec1: 0, rec2: 0, recFinal: 0 },
    { subject: "Português", b1: 7.0, b2: 8.0, b3: 7.5, b4: 8.5, rec1: 0, rec2: 0, recFinal: 0 },
    { subject: "História", b1: 9.0, b2: 8.5, b3: 9.0, b4: 9.5, rec1: 0, rec2: 0, recFinal: 0 },
  ],
  activities: [
    {
      date: "2024-03-15T10:30:00",
      type: "Mensagem",
      description: "Visualizou comunicado sobre a reunião de pais",
      status: "read"
    },
    {
      date: "2024-03-14T15:45:00",
      type: "Atividade",
      description: "Entregou trabalho de matemática",
      status: "completed"
    }
  ]
};

// Dados para os gráficos
export const gradeChartData = {
  labels: ["Matemática", "Português", "História", "Geografia", "Ciências", "Inglês"],
  datasets: [
    {
      label: "Média",
      backgroundColor: "rgba(52, 195, 143, 0.8)",
      borderColor: "rgba(52, 195, 143, 0.8)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(52, 195, 143, 0.9)",
      hoverBorderColor: "rgba(52, 195, 143, 0.9)",
      data: [8.0, 7.5, 9.0, 8.5, 7.0, 9.5],
    },
  ],
};

export const studyProgressData = {
  labels: ["Matemática", "Português", "História", "Geografia", "Ciências", "Inglês"],
  datasets: [
    {
      label: "Desempenho",
      data: [85, 75, 90, 80, 70, 95],
      backgroundColor: [
        "rgba(75, 192, 192, 0.6)",
        "rgba(255, 159, 64, 0.6)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(153, 102, 255, 0.6)",
        "rgba(255, 99, 132, 0.6)",
        "rgba(255, 206, 86, 0.6)"
      ],
      borderColor: [
        "rgba(75, 192, 192, 1)",
        "rgba(255, 159, 64, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 99, 132, 1)",
        "rgba(255, 206, 86, 1)"
      ],
      borderWidth: 1
    }
  ]
};

// Dados fictícios para pagamentos
export const payments = [
  { month: "Janeiro/2024", status: "paid", dueDate: "10/01/2024", value: 850.00 },
  { month: "Fevereiro/2024", status: "paid", dueDate: "10/02/2024", value: 850.00 },
  { month: "Março/2024", status: "paid", dueDate: "10/03/2024", value: 850.00 },
  { month: "Abril/2024", status: "pending", dueDate: "10/04/2024", value: 850.00 },
  { month: "Maio/2024", status: "pending", dueDate: "10/05/2024", value: 850.00 },
];

// Dados fictícios para tarefas
export const tasks = [
  { 
    id: 1, 
    title: "Trabalho de Matemática", 
    dueDate: "22/03/2024", 
    status: "completed", 
    type: "school",
    description: "Resolver os exercícios das páginas 45-50 do livro de matemática."
  },
  { 
    id: 2, 
    title: "Redação sobre Meio Ambiente", 
    dueDate: "25/03/2024", 
    status: "pending", 
    type: "home",
    description: "Escrever uma redação de 30 linhas sobre a importância da preservação do meio ambiente."
  },
  { 
    id: 3, 
    title: "Projeto de Ciências", 
    dueDate: "30/03/2024", 
    status: "pending", 
    type: "school",
    description: "Desenvolver um projeto sobre fontes de energia renovável."
  },
  { 
    id: 4, 
    title: "Leitura do Livro", 
    dueDate: "15/04/2024", 
    status: "pending", 
    type: "home",
    description: "Ler o livro 'O Pequeno Príncipe' e fazer um resumo."
  },
];

// Dados fictícios para notificações
export const notifications = [
  { 
    id: 1, 
    title: "Reunião de Pais", 
    date: "15/03/2024", 
    status: "read", 
    content: "Prezados pais, informamos que haverá reunião no dia 20/03/2024 às 19h." 
  },
  { 
    id: 2, 
    title: "Prova de Matemática", 
    date: "14/03/2024", 
    status: "read", 
    content: "A prova de matemática será realizada no dia 22/03/2024." 
  },
  { 
    id: 3, 
    title: "Trabalho de História", 
    date: "10/03/2024", 
    status: "unread", 
    content: "O trabalho de história deverá ser entregue até o dia 25/03/2024." 
  },
  { 
    id: 4, 
    title: "Passeio Escolar", 
    date: "05/03/2024", 
    status: "unread", 
    content: "Haverá um passeio escolar no dia 30/03/2024. Por favor, enviar autorização." 
  },
];

// Dados fictícios para estudos
export const studyStats = {
  questionsAnswered: 250,
  correctAnswers: 200,
  incorrectAnswers: 50,
  accuracy: 80,
  challengesCompleted: 15,
  totalChallenges: 20,
};
