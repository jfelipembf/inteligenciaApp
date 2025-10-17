import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Badge,
  Button,
} from "reactstrap";
import { useParams } from "react-router-dom";
import classnames from "classnames";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import profileImg from "../../../assets/images/profile-img.png";

const StudentProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("1");

  // Dados fictícios do aluno
  const student = {
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
      { subject: "Matemática", b1: 8.5, b2: 7.5, b3: 9.0, b4: 8.0 },
      { subject: "Português", b1: 7.0, b2: 8.0, b3: 7.5, b4: 8.5 },
      { subject: "História", b1: 9.0, b2: 8.5, b3: 9.0, b4: 9.5 },
    ],
    activities: [
      {
        date: "2024-03-15T10:30:00",
        type: "Mensagem",
        description: "Visualizou comunicado sobre a reunião de pais",
        status: "read",
      },
      {
        date: "2024-03-14T15:45:00",
        type: "Atividade",
        description: "Entregou trabalho de matemática",
        status: "completed",
      },
    ],
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <React.Fragment>
      <Breadcrumb title="Alunos" breadcrumbItem={student.name} />

      <Row>
        <Col lg={12}>
          <Card className="overflow-hidden">
            <div className="bg-primary-subtle">
              <Row>
                <Col xs="7">
                  <div className="text-primary p-3">
                    <h5 className="text-primary">{student.name}</h5>
                    <p className="mb-1">Matrícula: {student.registration}</p>
                    <p className="mb-0">{student.email}</p>
                  </div>
                </Col>
                <Col xs="5" className="align-self-end">
                  <img src={profileImg} alt="" className="img-fluid" />
                </Col>
              </Row>
            </div>
            <CardBody className="pt-0">
              <Row className="align-items-center">
                <Col sm="2">
                  <div className="avatar-xl profile-user-wid mb-4">
                    <div className="avatar-title rounded-circle bg-light text-primary">
                      {student.name.charAt(0)}
                    </div>
                  </div>
                </Col>

                <Col sm="6" className="ms-n12 ps-0">
                  <div style={{ marginLeft: "-40px" }}>
                    <h5 className="font-size-16">{student.name}</h5>
                    <p className="text-muted mb-1">
                      {student.grade} - {student.class}
                    </p>
                    <p className="text-muted mb-0">{student.email}</p>
                  </div>
                </Col>

                <Col sm="4" className="text-end pe-1">
                  <div>
                    <div className="d-flex gap-2 justify-content-end">
                      <Button
                        color="success"
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        title="WhatsApp"
                        style={{ width: "38px", height: "38px" }}
                        onClick={() => {
                          window.open(
                            `https://wa.me/55${student.phone.replace(
                              /\D/g,
                              ""
                            )}`,
                            "_blank"
                          );
                        }}
                      >
                        <i className="bx bxl-whatsapp font-size-16"></i>
                      </Button>
                      <Button
                        color="info"
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        title="Email"
                        style={{ width: "38px", height: "38px" }}
                        onClick={() => {
                          window.location.href = `mailto:${student.email}`;
                        }}
                      >
                        <i className="bx bx-envelope font-size-16"></i>
                      </Button>
                      <Button
                        color="primary"
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        title="Enviar Notificação"
                        style={{ width: "38px", height: "38px" }}
                        onClick={() => {
                          // TODO: Implementar envio de notificação push
                        }}
                      >
                        <i className="bx bx-bell font-size-16"></i>
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Card>
            <CardBody>
              <Nav tabs className="nav-tabs-custom nav-justified">
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "1" })}
                    onClick={() => toggleTab("1")}
                  >
                    <span className="d-block d-sm-none">
                      <i className="fas fa-user"></i>
                    </span>
                    <span className="d-none d-sm-block">
                      <i className="bx bx-user-circle me-1"></i> Informações
                    </span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "2" })}
                    onClick={() => toggleTab("2")}
                  >
                    <span className="d-block d-sm-none">
                      <i className="fas fa-chart-line"></i>
                    </span>
                    <span className="d-none d-sm-block">
                      <i className="bx bx-chart me-1"></i> Notas
                    </span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "3" })}
                    onClick={() => toggleTab("3")}
                  >
                    <span className="d-block d-sm-none">
                      <i className="fas fa-history"></i>
                    </span>
                    <span className="d-none d-sm-block">
                      <i className="bx bx-history me-1"></i> Atividades
                    </span>
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={activeTab} className="p-3">
                <TabPane tabId="1">{/* Conteúdo da aba Informações */}</TabPane>
                <TabPane tabId="2">{/* Conteúdo da aba Notas */}</TabPane>
                <TabPane tabId="3">{/* Conteúdo da aba Atividades */}</TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default StudentProfile;
