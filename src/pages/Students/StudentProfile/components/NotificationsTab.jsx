import React from "react";
import { Row, Col, Card, CardBody, Badge } from "reactstrap";
import { Link } from "react-router-dom";

const NotificationsTab = () => {
  const notifications = [
    {
      id: 1,
      title: "Nova Tarefa",
      description: "Tarefa de Matemática para a próxima segunda-feira",
      date: "2 horas atrás",
      type: "assignment",
    },
    {
      id: 2,
      title: "Cronograma de Provas",
      description: "O cronograma de provas finais foi publicado",
      date: "Ontem",
      type: "exam",
    },
    {
      id: 3,
      title: "Nota Publicada",
      description: "Sua nota do projeto de Ciências foi publicada",
      date: "2 dias atrás",
      type: "grade",
    },
    {
      id: 4,
      title: "Evento Escolar",
      description: "Dia Esportivo Anual na próxima sexta-feira",
      date: "1 semana atrás",
      type: "event",
    },
    {
      id: 5,
      title: "Reunião de Pais",
      description: "Reunião de Pais e Professores agendada para o próximo mês",
      date: "2 semanas atrás",
      type: "meeting",
    },
  ];

  const getBadgeColor = (type) => {
    switch (type) {
      case "assignment":
        return "primary";
      case "exam":
        return "danger";
      case "grade":
        return "success";
      case "event":
        return "info";
      case "meeting":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getBadgeText = (type) => {
    switch (type) {
      case 'assignment':
        return 'Tarefa';
      case 'exam':
        return 'Prova';
      case 'grade':
        return 'Nota';
      case 'event':
        return 'Evento';
      case 'meeting':
        return 'Reunião';
      default:
        return 'Outro';
    }
  };

  return (
    <Row>
      <Col lg={12}>
        <Card>
          <CardBody>
            <h4 className="card-title mb-4">Notificações Recentes</h4>
            <div className="p-2">
              {notifications.map((notification) => (
                <div key={notification.id} className="border-bottom pb-3 mb-3">
                  <div className="d-flex align-items-start">
                    <div className="flex-grow-1">
                      <h5 className="font-size-15 mb-1">
                        <Link to="#" className="text-dark">
                          {notification.title}{" "}
                          <Badge color={getBadgeColor(notification.type)} className="font-size-12">
                            {getBadgeText(notification.type)}
                          </Badge>
                        </Link>
                      </h5>
                      <p className="text-muted mb-2">{notification.description}</p>
                      <div className="font-size-12 text-muted">
                        <i className="mdi mdi-calendar me-1"></i> {notification.date}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <Link to="#" className="btn btn-primary waves-effect waves-light btn-sm">
                Ver Todas <i className="mdi mdi-arrow-right ms-1"></i>
              </Link>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default NotificationsTab;
