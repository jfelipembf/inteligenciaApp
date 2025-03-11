import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Import Charts

import ClassAveragesList from "./ClassAveragesList";

//i18n
import { withTranslation } from "react-i18next";

const Dashboard = (props) => {
  const [userRole, setUserRole] = useState("gestor"); // Pode ser "gestor" ou "professor"

  // Dados para o perfil de Gestor/Coordenador
  const gestorReports = [
    { title: "Número de Alunos", iconClass: "bx-user", description: "1,235" },
    { title: "Usuários Ativos", iconClass: "bx-check-circle", description: "980" },
    { title: "Usuários Inativos", iconClass: "bx-x-circle", description: "255" },
  ];

  // Dados para o perfil de Professor
  const professorReports = [
    { title: "Número de Alunos", iconClass: "bx-user", description: "42" },
    { title: "Usuários Ativos", iconClass: "bx-check-circle", description: "38" },
    { title: "Usuários Inativos", iconClass: "bx-x-circle", description: "4" },
  ];
  
  // Seleciona os relatórios com base no perfil do usuário
  const reports = userRole === "gestor" ? gestorReports : professorReports;



  //meta title
  document.title = "Dashboard | Skote - Vite React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title={props.t("Dashboards")} breadcrumbItem={props.t("Dashboard")} />

          {/* Seletor de perfil */}
          <Row className="mb-4">
            <Col xl="12">
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="card-title mb-0">Dashboard</h4>
                    <div>
                      <Button
                        color={userRole === "gestor" ? "primary" : "light"}
                        className="me-2"
                        onClick={() => setUserRole("gestor")}
                      >
                        Gestor/Coordenador
                      </Button>
                      <Button
                        color={userRole === "professor" ? "primary" : "light"}
                        onClick={() => setUserRole("professor")}
                      >
                        Professor
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Título do Dashboard baseado no perfil */}
          <Row className="mb-3">
            <Col xl="12">
              <h4>
                {userRole === "gestor" 
                  ? "Dashboard - Gestor/Coordenador" 
                  : "Dashboard - Professor"}
              </h4>
              <p className="text-muted">
                {userRole === "gestor" 
                  ? "Visão geral de todos os alunos e turmas" 
                  : "Visão geral dos seus alunos e turmas"}
              </p>
            </Col>
          </Row>
          
          {/* Cards */}
          <Row>
            {(reports || [])?.map((report, key) => (
              <Col md="4" key={"_col_" + key}>
                <Card className="mini-stats-wid">
                  <CardBody>
                    <div className="d-flex">
                      <div className="flex-grow-1">
                        <p className="text-muted fw-medium">
                          {report.title}
                        </p>
                        <h4 className="mb-0">{report.description}</h4>
                      </div>
                      <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                        <span className="avatar-title rounded-circle bg-primary">
                          <i className={"bx " + report.iconClass + " font-size-24"}></i>
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
          
          
          
          {/* Lista de Médias por Turma */}
          <Row className="mt-4">
            <Col lg="12">
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">
                    {userRole === "gestor" 
                      ? "Média Geral por Turma" 
                      : "Média Geral das suas Turmas"}
                  </h4>
                  <ClassAveragesList userRole={userRole} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>


    </React.Fragment>
  );
};

Dashboard.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(Dashboard);
