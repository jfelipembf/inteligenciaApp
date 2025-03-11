// Dados fictícios do professor
export const teacherData = {
  name: "Carlos Oliveira",
  registration: "PROF2024001",
  department: "Ciências Exatas",
  status: "active",
  birthDate: "1985-03-10",
  cpf: "987.654.321-00",
  email: "carlos.oliveira@escola.edu.br",
  phone: "(79) 98888-7777",
  specialty: "Matemática",
  education: "Mestrado em Matemática",
  startDate: "2020-02-01",
  classes: ["9º Ano A", "9º Ano B", "8º Ano A", "7º Ano C"],
  schedule: [
    { day: "Segunda", time: "07:30 - 09:10", class: "9º Ano A", subject: "Matemática" },
    { day: "Segunda", time: "09:30 - 11:10", class: "8º Ano A", subject: "Matemática" },
    { day: "Terça", time: "07:30 - 09:10", class: "7º Ano C", subject: "Matemática" },
    { day: "Quarta", time: "09:30 - 11:10", class: "9º Ano B", subject: "Matemática" },
    { day: "Quinta", time: "07:30 - 09:10", class: "9º Ano A", subject: "Matemática" },
    { day: "Sexta", time: "09:30 - 11:10", class: "8º Ano A", subject: "Matemática" },
  ],
  activities: [
    {
      date: "2024-03-15T10:30:00",
      type: "Reunião",
      description: "Participou da reunião pedagógica",
      status: "completed"
    },
    {
      date: "2024-03-14T15:45:00",
      type: "Avaliação",
      description: "Corrigiu provas do 9º Ano A",
      status: "completed"
    }
  ]
};

// Dados para os gráficos
export const performanceChartData = {
  labels: ["9º Ano A", "9º Ano B", "8º Ano A", "7º Ano C"],
  datasets: [
    {
      label: "Média da Turma",
      backgroundColor: "rgba(52, 195, 143, 0.8)",
      borderColor: "rgba(52, 195, 143, 0.8)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(52, 195, 143, 0.9)",
      hoverBorderColor: "rgba(52, 195, 143, 0.9)",
      data: [7.8, 8.2, 7.5, 8.0],
    },
  ],
};

export const attendanceData = {
  labels: ["9º Ano A", "9º Ano B", "8º Ano A", "7º Ano C"],
  datasets: [
    {
      label: "Frequência (%)",
      backgroundColor: "rgba(85, 110, 230, 0.8)",
      borderColor: "rgba(85, 110, 230, 0.8)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(85, 110, 230, 0.9)",
      hoverBorderColor: "rgba(85, 110, 230, 0.9)",
      data: [95, 92, 88, 90],
    },
  ],
};
