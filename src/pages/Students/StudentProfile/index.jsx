import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane, Spinner } from "reactstrap";
import { useParams, Link, useLocation } from "react-router-dom";
import classnames from "classnames";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import useUser from "../../../hooks/useUser";

// Import Chart.js
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Import Components
import WelcomeCard from "./components/WelcomeCard";
import InformationTab from "./components/InformationTab";
import GradesTab from "./components/GradesTab";
import NotificationsTab from "./components/NotificationsTab";
// import TasksTab from "./components/TasksTab";
// import FinancialTab from "./components/FinancialTab";
import StudiesTab from "./components/StudiesTab";

// Import Data
import { studentData as defaultStudentData } from "./components/data";

const StudentProfile = () => {
  const { id } = useParams();
  const location = useLocation();
  const { isAuthenticated, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState("1");
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se temos dados do aluno passados pela navegação
    if (location.state && location.state.student) {
      setStudentData(location.state.student);
      setLoading(false);
    } else {
      // Se não tiver dados na navegação, usar os dados padrão ou buscar do Firebase
      // Aqui você poderia fazer uma chamada para o Firebase para buscar os dados do aluno pelo ID
      setStudentData(defaultStudentData);
      setLoading(false);
    }
  }, [id, location.state]);

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  // Mostrar loading enquanto verifica autenticação ou carrega dados do aluno
  if (userLoading || loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
            <Spinner color="primary" />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Alunos" breadcrumbItem={studentData?.personalInfo?.name || "Perfil do Aluno"} />
          
          {/* Card de boas-vindas com dados do aluno */}
          <Row>
            <Col lg={12}>
              <WelcomeCard studentData={studentData} />
            </Col>
          </Row>

          {/* Abas com as funcionalidades */}
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
                        <span className="d-block d-sm-none"><i className="fas fa-user"></i></span>
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
                        <span className="d-block d-sm-none"><i className="fas fa-chart-line"></i></span>
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
                        <span className="d-block d-sm-none"><i className="fas fa-bell"></i></span>
                        <span className="d-none d-sm-block">
                          <i className="bx bx-bell me-1"></i> Notificações
                        </span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "4" })}
                        onClick={() => toggleTab("4")}
                      >
                        <span className="d-block d-sm-none"><i className="fas fa-book"></i></span>
                        <span className="d-none d-sm-block">
                          <i className="bx bx-book me-1"></i> Meus Estudos
                        </span>
                      </NavLink>
                    </NavItem>
                  </Nav>

                  <TabContent activeTab={activeTab} className="p-3">
                    {/* Aba de Informações */}
                    <TabPane tabId="1">
                      <InformationTab studentData={studentData} />
                    </TabPane>

                    {/* Aba de Notas */}
                    <TabPane tabId="2">
                      <GradesTab studentData={studentData} />
                    </TabPane>

                    {/* Aba de Notificações */}
                    <TabPane tabId="3">
                      <NotificationsTab studentData={studentData} />
                    </TabPane>

                    {/* Aba Meus Estudos */}
                    <TabPane tabId="4">
                      <StudiesTab studentData={studentData} />
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default StudentProfile;