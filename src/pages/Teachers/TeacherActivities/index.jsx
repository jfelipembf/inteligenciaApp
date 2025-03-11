import React from "react";
import { Container, Row, Col, Card, CardBody, Table, Badge } from "reactstrap";
import { Link, useParams } from "react-router-dom";
import Breadcrumb from "../../../components/Common/Breadcrumb";

const TeacherActivities = () => {
  const { id } = useParams();

  // Dados fictícios de atividades
  const activities = [
    {
      id: 1,
      type: "Aula",
      title: "Matemática - Álgebra Linear",
      class: "9º Ano A",
      date: "2025-03-11",
      time: "07:30 - 08:20",
      status: "completed"
    },
    {
      id: 2,
      type: "Prova",
      title: "Avaliação Bimestral",
      class: "8º Ano B",
      date: "2025-03-11",
      time: "09:30 - 10:20",
      status: "pending"
    },
    {
      id: 3,
      type: "Reunião",
      title: "Conselho de Classe",
      class: "Todos",
      date: "2025-03-12",
      time: "14:00 - 15:30",
      status: "pending"
    },
    {
      id: 4,
      type: "Aula",
      title: "Matemática - Geometria",
      class: "7º Ano C",
      date: "2025-03-11",
      time: "10:30 - 11:20",
      status: "completed"
    },
    {
      id: 5,
      type: "Trabalho",
      title: "Entrega de Notas",
      class: "Todos",
      date: "2025-03-13",
      time: "23:59",
      status: "pending"
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge color="success">Concluído</Badge>;
      case "pending":
        return <Badge color="warning">Pendente</Badge>;
      default:
        return <Badge color="secondary">-</Badge>;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Aula":
        return "bx bx-book-open";
      case "Prova":
        return "bx bx-clipboard";
      case "Reunião":
        return "bx bx-group";
      case "Trabalho":
        return "bx bx-task";
      default:
        return "bx bx-calendar";
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Professores" breadcrumbItem="Atividades do Professor" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title">Atividades Recentes</h4>
                    <Link to={`/teachers/${id}`} className="btn btn-primary btn-sm">
                      Voltar ao Perfil
                    </Link>
                  </div>
                  <div className="table-responsive">
                    <Table className="table table-centered table-nowrap mb-0">
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: "40px" }}></th>
                          <th>Atividade</th>
                          <th>Turma</th>
                          <th>Data</th>
                          <th>Horário</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activities.map((activity) => (
                          <tr key={activity.id}>
                            <td>
                              <i className={`${getTypeIcon(activity.type)} font-size-18 text-primary`}></i>
                            </td>
                            <td>
                              <h5 className="font-size-14 mb-1">{activity.title}</h5>
                              <small className="text-muted">{activity.type}</small>
                            </td>
                            <td>{activity.class}</td>
                            <td>{new Date(activity.date).toLocaleDateString()}</td>
                            <td>{activity.time}</td>
                            <td>{getStatusBadge(activity.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
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

export default TeacherActivities;
