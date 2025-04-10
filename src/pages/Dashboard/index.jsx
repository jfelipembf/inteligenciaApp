import PropTypes from "prop-types";
import React from "react";
import { Container, Row, Col, Button, Card, CardBody } from "reactstrap";
import useFetchStudents from "../../hooks/useFetchStudents";
import useFetchUsers from "../../hooks/useFetchUsers";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Import Charts

import ClassAveragesList from "./ClassAveragesList";

//i18n
import { withTranslation } from "react-i18next";

const Dashboard = (props) => {
  // Definindo o perfil como gestor permanentemente
  const userRole = "gestor";
  const { students, loading, error } = useFetchStudents(userRole);
  const { users } = useFetchUsers();

  // Dados para o perfil de Gestor/Coordenador
  const reports = [
    {
      title: "Número de Alunos",
      iconClass: "bx-user",
      description: students.length,
    },
    {
      title: "Usuários Ativos",
      iconClass: "bx-check-circle",
      description: users.length,
    },
    // { title: "Usuários Inativos", iconClass: "bx-x-circle", description: "255" },
  ];

  //meta title
  document.title = "Dashboard | Painel Escolar";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Dashboards")}
            breadcrumbItem={props.t("Dashboard")}
          />

          {/* Cards */}
          <Row>
            {(reports || [])?.map((report, key) => (
              <Col md="6" key={"_col_" + key}>
                <Card className="mini-stats-wid">
                  <CardBody>
                    <div className="d-flex">
                      <div className="flex-grow-1">
                        <p className="text-muted fw-medium">{report.title}</p>
                        <h4 className="mb-0">{report.description}</h4>
                      </div>
                      <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                        <span className="avatar-title rounded-circle bg-primary">
                          <i
                            className={
                              "bx " + report.iconClass + " font-size-24"
                            }
                          ></i>
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
                  <h4 className="card-title mb-4">Média Geral por Turma</h4>
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
