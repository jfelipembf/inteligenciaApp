import React from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const quickLinks = [
  { to: "/dashboard", icon: "bx bx-line-chart", label: "Dashboard" },
  { to: "/students", icon: "bx bx-user-circle", label: "Alunos" },
  { to: "/teachers", icon: "bx bx-user-pin", label: "Professores" },
  { to: "/classes", icon: "bx bx-group", label: "Turmas" },
  { to: "/activities", icon: "bx bx-clipboard", label: "Atividades" },
  { to: "/notifications", icon: "bx bx-bell", label: "Notificações" },
  { to: "/messages", icon: "bx bx-message-square-dots", label: "Mensagens" },
  { to: "/calendar", icon: "bx bx-calendar", label: "Calendário" },
  { to: "/settings", icon: "bx bx-cog", label: "Configurações" },
];

const Home = () => (
  <div className="page-content">
    <Container fluid>
      <Breadcrumbs title="Início" breadcrumbItem="Home" />
      <Row className="justify-content-center">
        <Col md={10}>
          <Card>
            <CardBody>
              <h3 className="mb-4 text-center">Bem-vindo ao InteligênciaApp</h3>
              <p className="text-muted text-center mb-4">
                Utilize os atalhos abaixo para navegar rapidamente pelo sistema.
              </p>
              <Row className="g-3">
                {quickLinks.map((item) => (
                  <Col xs={6} md={4} lg={3} key={item.to}>
                    <Link to={item.to} className="text-decoration-none">
                      <Card className="text-center shadow-sm h-100">
                        <CardBody>
                          <i
                            className={`${item.icon} display-4 mb-2 text-primary`}
                          ></i>
                          <div className="fw-semibold">{item.label}</div>
                        </CardBody>
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  </div>
);

export default Home;
