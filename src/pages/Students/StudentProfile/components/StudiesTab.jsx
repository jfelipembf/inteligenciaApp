import React from "react";
import { Row, Col, Card, CardBody, Badge, Progress } from "reactstrap";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";

const StudiesTab = () => {
  // Dados de estatísticas de estudo
  const studyStats = [
    { title: "Questões Respondidas", value: "325", color: "primary", icon: "bx bx-list-check" },
    { title: "Acertos", value: "248", color: "success", icon: "bx bx-check-circle" },
    { title: "Erros", value: "77", color: "danger", icon: "bx bx-x-circle" },
    { title: "Horas de Estudo", value: "87", color: "info", icon: "bx bx-time-five" }
  ];

  // Dados de estudo por disciplina
  const studyBySubject = [
    { subject: "Matemática", hours: 24, questions: 95, correct: 72, color: "primary" },
    { subject: "Português", hours: 18, questions: 68, correct: 55, color: "success" },
    { subject: "História", hours: 15, questions: 62, correct: 48, color: "warning" },
    { subject: "Ciências", hours: 20, questions: 75, correct: 54, color: "info" },
    { subject: "Geografia", hours: 10, questions: 25, correct: 19, color: "danger" }
  ];

  // Dados para o gráfico de linha - Horas de estudo por semana
  const lineData = {
    labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4", "Semana 5", "Semana 6"],
    datasets: [
      {
        label: "Horas de Estudo",
        backgroundColor: "rgba(85, 110, 230, 0.2)",
        borderColor: "#556ee6",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        data: [12, 15, 10, 18, 14, 18],
      },
    ],
  };

  const lineOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 25,
        ticks: {
          stepSize: 5,
        },
      },
    },
    plugins: {
      legend: {
        display: false
      }
    },
    maintainAspectRatio: false
  };

  // Dados dos materiais de estudo
  const studyMaterials = [
    {
      id: 1,
      title: "Apostila de Matemática - Equações do 2º Grau",
      subject: "Matemática",
      description: "Material completo sobre equações do segundo grau com exemplos e exercícios",
      date: "10/03/2025",
      type: "apostila"
    },
    {
      id: 2,
      title: "Videoaula - Revolução Francesa",
      subject: "História",
      description: "Aula em vídeo sobre os principais acontecimentos da Revolução Francesa",
      date: "08/03/2025",
      type: "video"
    },
    {
      id: 3,
      title: "Resumo de Literatura - Romantismo",
      subject: "Português",
      description: "Resumo completo sobre o período romântico na literatura brasileira",
      date: "05/03/2025",
      type: "resumo"
    }
  ];

  // Função para obter a cor do badge com base no tipo de material
  const getBadgeColor = (type) => {
    switch (type) {
      case "apostila":
        return "primary";
      case "video":
        return "danger";
      case "resumo":
        return "success";
      case "exercicios":
        return "warning";
      case "slides":
        return "info";
      default:
        return "secondary";
    }
  };

  // Função para obter o texto do badge com base no tipo de material
  const getBadgeText = (type) => {
    switch (type) {
      case 'apostila':
        return 'Apostila';
      case 'video':
        return 'Vídeo';
      case 'resumo':
        return 'Resumo';
      case 'exercicios':
        return 'Exercícios';
      case 'slides':
        return 'Slides';
      default:
        return 'Outro';
    }
  };
  
  // Calcular a taxa de acerto
  const calculateAccuracyRate = (correct, total) => {
    return Math.round((correct / total) * 100);
  };

  return (
    <React.Fragment>
      {/* Cards de Estatísticas */}
      <Row className="mb-4">
        {studyStats.map((stat, index) => (
          <Col md={3} key={index}>
            <Card className="mini-stats-wid h-100">
              <CardBody className="d-flex p-0">
                <div className={`p-3 border-start border-${stat.color} border-3 w-100`}>
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <i className={`${stat.icon} font-size-24 text-${stat.color} me-3`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium mb-1">{stat.title}</p>
                      <h4 className="mb-0">{stat.value}</h4>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Gráfico de Horas de Estudo */}
      <Row className="mb-4">
        <Col lg={12}>
          <Card>
            <CardBody>
              <h4 className="card-title mb-4">Horas de Estudo por Semana</h4>
              <div style={{ height: "250px" }}>
                <Line data={lineData} options={lineOptions} />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Estudo por Disciplina */}
      <Row className="mb-4">
        <Col lg={12}>
          <Card>
            <CardBody>
              <h4 className="card-title mb-4">Estudo por Disciplina</h4>
              <div className="table-responsive">
                <table className="table table-nowrap table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Disciplina</th>
                      <th>Horas</th>
                      <th>Questões</th>
                      <th>Acertos</th>
                      <th>Taxa de Acerto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studyBySubject.map((subject, index) => (
                      <tr key={index}>
                        <td><strong>{subject.subject}</strong></td>
                        <td>{subject.hours}h</td>
                        <td>{subject.questions}</td>
                        <td>{subject.correct}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="w-75 me-2">
                              <Progress value={calculateAccuracyRate(subject.correct, subject.questions)} color={subject.color} className="progress-sm" />
                            </div>
                            <span>{calculateAccuracyRate(subject.correct, subject.questions)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Materiais de Estudo */}
      <Row>
        <Col lg={12}>
          <Card>
            <CardBody>
              <h4 className="card-title mb-4">Materiais de Estudo Recentes</h4>
              <div className="p-2">
                {studyMaterials.map((material) => (
                  <div key={material.id} className="border-bottom pb-3 mb-3">
                    <div className="d-flex align-items-start">
                      <div className="flex-grow-1">
                        <h5 className="font-size-15 mb-1">
                          <Link to="#" className="text-dark">
                            {material.title}{" "}
                            <Badge color={getBadgeColor(material.type)} className="font-size-12">
                              {getBadgeText(material.type)}
                            </Badge>
                          </Link>
                        </h5>
                        <p className="text-muted mb-2">
                          <strong>{material.subject}</strong> - {material.description}
                        </p>
                        <div className="font-size-12 text-muted">
                          Adicionado em: {material.date}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-4">
                <Link to="#" className="btn btn-primary waves-effect waves-light btn-sm">
                  Ver Todos os Materiais
                </Link>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default StudiesTab;
