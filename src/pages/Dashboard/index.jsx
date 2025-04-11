import PropTypes from "prop-types";
import React from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import useFetchStudents from "../../hooks/useFetchStudents";
import useFetchUsers from "../../hooks/useFetchUsers";
import useFetchClasses from "../../hooks/useFetchClasses";
import { Table, Progress, Badge } from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Import Charts
import ClassAveragesList from "./ClassAveragesList";

//i18n
import { withTranslation } from "react-i18next";

const Dashboard = (props) => {
  // Definindo o perfil como gestor permanentemente
  const userRole = "gestor";
  const {
    students,
    loading: loadingStudents,
    error: errorStudents,
  } = useFetchStudents(userRole);
  const { users, loading: loadingUsers, error: errorUsers } = useFetchUsers();
  const {
    classes,
    loading: loadingClasses,
    error: errorClasses,
  } = useFetchClasses();

  // Função para determinar a cor da badge com base na média
  const getBadgeColor = (average) => {
    if (average >= 9.0) return "success";
    if (average >= 8.0) return "primary";
    if (average >= 7.0) return "info";
    if (average >= 6.0) return "warning";
    return "danger";
  };

  // Função para determinar a porcentagem da barra de progresso
  const getProgressPercentage = (average) => {
    return (average / 10) * 100;
  };

  // Função para determinar a cor da barra de progresso
  const getProgressColor = (average) => {
    if (average >= 9.0) return "success";
    if (average >= 8.0) return "info";
    if (average >= 7.0) return "primary";
    if (average >= 6.0) return "warning";
    return "danger";
  };
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
          <div className="table-responsive">
            <Table className="table-centered table-nowrap mb-0">
              <thead className="table-light">
                <tr>
                  <th>Turma</th>
                  <th>Alunos</th>
                  <th>Média Geral</th>
                  <th>Desempenho</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((classItem) => (
                  <tr key={classItem.id}>
                    <td>{classItem.className || "Sem nome"}</td>

                    <td>{classItem.studentCount || 0}</td>
                    <td>
                      {classItem.average !== undefined ? (
                        <Badge color={getBadgeColor(classItem.average)} pill>
                          {classItem.average.toFixed(1)}
                        </Badge>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td style={{ width: "30%" }}>
                      {classItem.average !== undefined ? (
                        <Progress
                          value={getProgressPercentage(classItem.average)}
                          color={getProgressColor(classItem.average)}
                          style={{ height: "10px" }}
                        />
                      ) : (
                        "Sem dados"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
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
