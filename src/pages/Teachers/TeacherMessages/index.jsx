import React from "react";
import { Container, Row, Col, Card, CardBody, Badge } from "reactstrap";
import { Link, useParams } from "react-router-dom";
import Breadcrumb from "../../../components/Common/Breadcrumb";

const TeacherMessages = () => {
  const { id } = useParams();

  // Dados fictícios de mensagens
  const messages = [
    {
      id: 1,
      sender: "Coordenação Pedagógica",
      subject: "Reunião de Planejamento",
      message: "Prezado professor, lembramos que amanhã teremos nossa reunião de planejamento às 14h na sala dos professores.",
      date: "2025-03-11T14:30:00",
      read: true,
      priority: "high"
    },
    {
      id: 2,
      sender: "Sistema",
      subject: "Lançamento de Notas",
      message: "O prazo para lançamento das notas do primeiro bimestre se encerra em 3 dias.",
      date: "2025-03-11T10:15:00",
      read: false,
      priority: "high"
    },
    {
      id: 3,
      sender: "Maria Silva (Responsável)",
      subject: "Dúvida sobre Atividade",
      message: "Professor, gostaria de esclarecer uma dúvida sobre a última atividade de matemática passada para o 9º ano.",
      date: "2025-03-10T16:45:00",
      read: true,
      priority: "medium"
    },
    {
      id: 4,
      sender: "Biblioteca",
      subject: "Material Disponível",
      message: "Os livros didáticos que você solicitou já estão disponíveis para retirada na biblioteca.",
      date: "2025-03-10T09:20:00",
      read: false,
      priority: "low"
    },
    {
      id: 5,
      sender: "Direção",
      subject: "Evento Escolar",
      message: "Contamos com sua participação na feira de ciências que acontecerá no próximo mês.",
      date: "2025-03-09T11:00:00",
      read: true,
      priority: "medium"
    }
  ];

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return <Badge color="danger">Alta</Badge>;
      case "medium":
        return <Badge color="warning">Média</Badge>;
      case "low":
        return <Badge color="info">Baixa</Badge>;
      default:
        return <Badge color="secondary">Normal</Badge>;
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Professores" breadcrumbItem="Mensagens do Professor" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title">Caixa de Mensagens</h4>
                    <Link to={`/teachers/${id}`} className="btn btn-primary btn-sm">
                      Voltar ao Perfil
                    </Link>
                  </div>
                  <div className="message-list">
                    {messages.map((message) => (
                      <Card key={message.id} className={`border mb-3 ${!message.read ? 'bg-light' : ''}`}>
                        <CardBody>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                              <h5 className="font-size-14 mb-1">{message.subject}</h5>
                              <small className="text-muted">De: {message.sender}</small>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              {!message.read && (
                                <Badge color="primary" pill>
                                  Nova
                                </Badge>
                              )}
                              {getPriorityBadge(message.priority)}
                            </div>
                          </div>
                          <p className="text-muted mb-2">{message.message}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              {formatDateTime(message.date)}
                            </small>
                            <div>
                              <button className="btn btn-link p-0 text-primary">
                                <i className="bx bx-reply font-size-16 me-1"></i>
                                Responder
                              </button>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default TeacherMessages;
