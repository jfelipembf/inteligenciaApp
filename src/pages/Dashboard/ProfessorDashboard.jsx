import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Table,
  Progress,
  Badge,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link } from "react-router-dom";
import classnames from "classnames";

// Hooks
import { useStudentsContext } from "../../contexts/StudentsContext";
import useFetchUsers from "../../hooks/useFetchUsers";

import { useClassContext } from "../../contexts/ClassContext";
import { useProfessorDashboardContext } from "../../contexts/ProfessorDashboardContext";

// Componentes
import Breadcrumbs from "../../components/Common/Breadcrumb";

// Gráficos
import ReactApexChart from "react-apexcharts";

// i18n
import { withTranslation } from "react-i18next";

const ProfessorDashboard = (props) => {
  const {
    teacherClassCount,
    studentsLength,
    overallAverage,
    classAverages,
    studentAverages,
    teacherClasses: classes,
    loading,
    error,
  } = useProfessorDashboardContext();
  const [activeTab, setActiveTab] = useState("1");
  const [selectedClass, setSelectedClass] = useState(null);
  // Dados dos hooks
  const { students, loading: loadingStudents } =
    useStudentsContext("professor");
  const { users, loading: loadingUsers } = useFetchUsers();
  //const { classes, loading: loadingClasses } = useClassContext();

  // Função para alternar entre as abas
  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

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

  // Simular turmas do professor atual
  const teacherClasses = classes.slice(0, 4);

  // Filtrar alunos por turma selecionada
  const filteredStudents = selectedClass
    ? students.filter((student) => student.class === selectedClass)
    : students.filter((student) =>
        teacherClasses.some((cls) => cls.className === student.class)
      );

  // Calcular estatísticas
  const totalStudents = studentsLength;
  const averageGrade =
    filteredStudents.reduce((acc, student) => acc + (student.average || 0), 0) /
    (totalStudents || 1);
  const approvedStudents = filteredStudents.filter(
    (student) => (student.average || 0) >= 7
  ).length;
  const approvalRate = (approvedStudents / (totalStudents || 1)) * 100;

  // Cards principais
  const mainCards = [
    {
      title: "Minhas Turmas",
      value: teacherClassCount,
      icon: "bx-group",
      color: "primary",
    },
    {
      title: "Total de Alunos",
      value: totalStudents,
      icon: "bx-user-circle",
      color: "success",
    },
    {
      title: "Média Geral",
      value: overallAverage.toFixed(1),
      icon: "bx-bar-chart-alt-2",
      color: "info",
    },
  ];

  // Dados para o gráfico de desempenho por turma
  const classPerformanceOptions = {
    series: [
      {
        name: "Média",
        data: Object.values(classAverages),
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "45%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val.toFixed(1);
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      colors: ["#34c38f"],
      xaxis: {
        categories: Object.keys(classAverages),
        labels: {
          style: {
            fontSize: `${Math.min(
              Math.max(5, 100 / Object.keys(classAverages).length),
              9
            )}px`,
          },
        },
      },
      yaxis: {
        min: 0,
        max: 10,
        title: {
          text: "Média",
        },
        labels: {
          formatter: function (val) {
            return val.toFixed(1);
          },
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val.toFixed(1);
          },
        },
      },
    },
  };

  // Configuração do gráfico de distribuição de notas
  const gradeDistributionOptions = {
    series: [
      {
        name: "Alunos",
        data: [3, 7, 12, 15, 8, 5],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 240,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "45%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      colors: ["#556ee6"],
      xaxis: {
        categories: ["0-2", "2-4", "4-6", "6-8", "8-9", "9-10"],
      },
      yaxis: {
        title: {
          text: "Número de Alunos",
        },
      },
      fill: {
        opacity: 1,
      },
    },
  };

  // Configuração do gráfico de evolução das notas
  const gradeEvolutionOptions = {
    series: [
      {
        name: "Média da Turma",
        data: [6.8, 7.2, 7.5, 7.8],
      },
    ],
    options: {
      chart: {
        height: 240,
        type: "line",
        toolbar: {
          show: false,
        },
      },
      colors: ["#34c38f"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
        width: 3,
      },
      markers: {
        size: 4,
      },
      xaxis: {
        categories: [
          "1º Bimestre",
          "2º Bimestre",
          "3º Bimestre",
          "4º Bimestre",
        ],
      },
      yaxis: {
        min: 5,
        max: 10,
      },
    },
  };

  // Dados para a tabela de alunos com melhor desempenho
  const topStudents = [...filteredStudents]
    .sort((a, b) => (b.average || 0) - (a.average || 0))
    .slice(0, 5);

  // Dados para a tabela de alunos com pior desempenho
  const lowPerformingStudents = [...filteredStudents]
    .sort((a, b) => (a.average || 0) - (b.average || 0))
    .slice(0, 5);

  //meta title
  document.title = "Dashboard do Professor | Painel Escolar";

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p>Carregando dados do dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-danger">Erro ao carregar dados: {error}</p>;
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumbs */}
          <Breadcrumbs
            title={props.t("Dashboards")}
            breadcrumbItem={props.t("Dashboard do Professor")}
          />

          {/* Cards Principais */}
          <Row>
            {mainCards.map((card, index) => (
              <Col xl={3} md={6} key={index}>
                <Card className="card-h-100">
                  <CardBody>
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1">
                        <span className="text-muted mb-3 lh-1 d-block text-truncate">
                          {card.title}
                        </span>
                        <h4 className="mb-3">{card.value}</h4>
                      </div>
                      <div className="avatar-sm">
                        <span
                          className={`avatar-title bg-light text-${card.color} rounded-3`}
                        >
                          <i className={`bx ${card.icon} font-size-24`}></i>
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Navegação por abas */}
          <Row>
            <Col xs={12}>
              <Card>
                <CardBody>
                  <Nav tabs className="nav-tabs-custom">
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "1" })}
                        onClick={() => toggle("1")}
                      >
                        <span className="d-none d-sm-block">Visão Geral</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "2" })}
                        onClick={() => toggle("2")}
                      >
                        <span className="d-none d-sm-block">Minhas Turmas</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "3" })}
                        onClick={() => toggle("3")}
                      >
                        <span className="d-none d-sm-block">Meus Alunos</span>
                      </NavLink>
                    </NavItem>
                  </Nav>

                  <TabContent activeTab={activeTab} className="p-3">
                    {/* Aba de Visão Geral */}
                    <TabPane tabId="1">
                      <Row>
                        <Col xl={6}>
                          <Card>
                            <CardBody>
                              <CardTitle className="mb-4">
                                Desempenho por Turma
                              </CardTitle>
                              <ReactApexChart
                                options={classPerformanceOptions.options}
                                series={classPerformanceOptions.series}
                                type="bar"
                                height={240}
                                className="apex-charts"
                              />
                            </CardBody>
                          </Card>
                        </Col>
                        <Col xl={6}>
                          <Card>
                            <CardBody>
                              <CardTitle className="mb-4">
                                Evolução das Notas
                              </CardTitle>
                              <ReactApexChart
                                options={gradeEvolutionOptions.options}
                                series={gradeEvolutionOptions.series}
                                type="line"
                                height={240}
                                className="apex-charts"
                              />
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                      <Row>
                        <Col xl={6}>
                          <Card>
                            <CardBody>
                              <CardTitle className="mb-4">
                                Alunos com Melhor Desempenho
                              </CardTitle>
                              <div className="table-responsive">
                                <Table className="table-centered table-nowrap mb-0">
                                  <thead className="table-light">
                                    <tr>
                                      <th>Aluno</th>
                                      <th>Turma</th>
                                      <th>Média</th>
                                      <th>Desempenho</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {topStudents.map((student, index) => (
                                      <tr key={index}>
                                        <td>
                                          <div className="d-flex align-items-center">
                                            <div className="avatar-xs me-2">
                                              <span className="avatar-title rounded-circle bg-primary text-white">
                                                {student.name
                                                  ? student.name.charAt(0)
                                                  : "A"}
                                              </span>
                                            </div>
                                            {student.name ||
                                              `Aluno ${index + 1}`}
                                          </div>
                                        </td>
                                        <td>{student.class}</td>
                                        <td>
                                          <Badge
                                            color={getBadgeColor(
                                              student.average
                                            )}
                                            pill
                                          >
                                            {student.average?.toFixed(1) ||
                                              "N/A"}
                                          </Badge>
                                        </td>
                                        <td style={{ width: "30%" }}>
                                          <Progress
                                            value={getProgressPercentage(
                                              student.average || 0
                                            )}
                                            color={getProgressColor(
                                              student.average || 0
                                            )}
                                            style={{ height: "6px" }}
                                          />
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col xl={6}>
                          <Card>
                            <CardBody>
                              <CardTitle className="mb-4">
                                Alunos com Baixo Desempenho
                              </CardTitle>
                              <div className="table-responsive">
                                <Table className="table-centered table-nowrap mb-0">
                                  <thead className="table-light">
                                    <tr>
                                      <th>Aluno</th>
                                      <th>Turma</th>
                                      <th>Média</th>
                                      <th>Desempenho</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {lowPerformingStudents.map(
                                      (student, index) => (
                                        <tr key={index}>
                                          <td>
                                            <div className="d-flex align-items-center">
                                              <div className="avatar-xs me-2">
                                                <span className="avatar-title rounded-circle bg-danger text-white">
                                                  {student.name
                                                    ? student.name.charAt(0)
                                                    : "A"}
                                                </span>
                                              </div>
                                              {student.name ||
                                                `Aluno ${index + 1}`}
                                            </div>
                                          </td>
                                          <td>{student.class}</td>
                                          <td>
                                            <Badge
                                              color={getBadgeColor(
                                                student.average
                                              )}
                                              pill
                                            >
                                              {student.average?.toFixed(1) ||
                                                "N/A"}
                                            </Badge>
                                          </td>
                                          <td style={{ width: "30%" }}>
                                            <Progress
                                              value={getProgressPercentage(
                                                student.average || 0
                                              )}
                                              color={getProgressColor(
                                                student.average || 0
                                              )}
                                              style={{ height: "6px" }}
                                            />
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </Table>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>

                    {/* Aba de Turmas */}
                    <TabPane tabId="2">
                      <Row>
                        <Col xl={12}>
                          <Card>
                            <CardBody>
                              <div className="d-flex justify-content-between align-items-center mb-4">
                                <CardTitle className="mb-0">
                                  Minhas Turmas
                                </CardTitle>
                                <Link to="/classes" className="btn btn-primary">
                                  Gerenciar Turmas
                                </Link>
                              </div>
                              <div className="table-responsive">
                                <Table className="table-centered table-nowrap mb-0">
                                  <thead className="table-light">
                                    <tr>
                                      <th>Turma</th>
                                      <th>Alunos</th>
                                      <th>Média Geral</th>
                                      <th>Ações</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {teacherClasses.map((classItem, index) => (
                                      <tr key={index}>
                                        <td>{classItem.className}</td>
                                        <td>{classItem.studentCount}</td>
                                        <td>
                                          <Badge
                                            color={getBadgeColor(
                                              classAverages[
                                                classItem.className
                                              ] || 0
                                            )}
                                            pill
                                          >
                                            {classAverages[
                                              classItem.className
                                            ]?.toFixed(1) || "N/A"}
                                          </Badge>
                                        </td>
                                        <td>
                                          <UncontrolledDropdown>
                                            <DropdownToggle
                                              href="#"
                                              className="card-drop"
                                              tag="a"
                                            >
                                              <i className="mdi mdi-dots-horizontal font-size-18"></i>
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-menu-end">
                                              <DropdownItem
                                                href={`/class-details/${classItem.id}`}
                                              >
                                                <i className="mdi mdi-eye-outline font-size-16 text-primary me-1"></i>{" "}
                                                Ver Detalhes
                                              </DropdownItem>
                                              <DropdownItem href="#">
                                                <i className="mdi mdi-pencil-outline font-size-16 text-success me-1"></i>{" "}
                                                Lançar Notas
                                              </DropdownItem>
                                              <DropdownItem href="#">
                                                <i className="mdi mdi-file-document-outline font-size-16 text-info me-1"></i>{" "}
                                                Relatório
                                              </DropdownItem>
                                            </DropdownMenu>
                                          </UncontrolledDropdown>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                      <Row>
                        <Col xl={6}>
                          <Card>
                            <CardBody>
                              <CardTitle className="mb-4">
                                Distribuição de Notas
                              </CardTitle>
                              <ReactApexChart
                                options={gradeDistributionOptions.options}
                                series={gradeDistributionOptions.series}
                                type="bar"
                                height={240}
                                className="apex-charts"
                              />
                            </CardBody>
                          </Card>
                        </Col>
                        <Col xl={6}>
                          <Card>
                            <CardBody>
                              <CardTitle className="mb-4">
                                Evolução das Notas
                              </CardTitle>
                              <ReactApexChart
                                options={gradeEvolutionOptions.options}
                                series={gradeEvolutionOptions.series}
                                type="line"
                                height={240}
                                className="apex-charts"
                              />
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>

                    {/* Aba de Alunos */}
                    <TabPane tabId="3">
                      <Row className="mb-4">
                        <Col xl={12}>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h5 className="mb-0">Meus Alunos</h5>
                              <p className="text-muted mb-0">
                                {selectedClass
                                  ? `Mostrando alunos da turma ${selectedClass}`
                                  : "Mostrando todos os alunos das minhas turmas"}
                              </p>
                            </div>
                            <div className="d-flex align-items-center">
                              <UncontrolledDropdown className="me-2">
                                <DropdownToggle
                                  tag="button"
                                  className="btn btn-outline-secondary"
                                >
                                  {selectedClass || "Todas as Turmas"}{" "}
                                  <i className="mdi mdi-chevron-down ms-1"></i>
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem
                                    onClick={() => setSelectedClass(null)}
                                  >
                                    Todas as Turmas
                                  </DropdownItem>
                                  {teacherClasses.map((classItem, index) => (
                                    <DropdownItem
                                      key={index}
                                      onClick={() =>
                                        setSelectedClass(classItem.className)
                                      }
                                    >
                                      {classItem.className}
                                    </DropdownItem>
                                  ))}
                                </DropdownMenu>
                              </UncontrolledDropdown>
                              <Button color="primary">
                                <i className="mdi mdi-export me-1"></i> Exportar
                                Lista
                              </Button>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col xl={12}>
                          <Card>
                            <CardBody>
                              <div className="table-responsive">
                                <Table className="table-centered table-nowrap mb-0">
                                  <thead className="table-light">
                                    <tr>
                                      <th>Aluno</th>
                                      <th>Matrícula</th>
                                      <th>Turma</th>
                                      <th>Média</th>
                                      <th>Ações</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredStudents
                                      .slice(0, 10)
                                      .map((student, index) => (
                                        <tr key={index}>
                                          <td>
                                            <div className="d-flex align-items-center">
                                              <div className="avatar-xs me-2">
                                                <span className="avatar-title rounded-circle bg-primary text-white">
                                                  {student.name
                                                    ? student.name.charAt(0)
                                                    : "A"}
                                                </span>
                                              </div>
                                              {student.name ||
                                                `Aluno ${index + 1}`}
                                            </div>
                                          </td>
                                          <td>
                                            {student.id ||
                                              `${2023}${index + 1}`.padStart(
                                                8,
                                                "0"
                                              )}
                                          </td>
                                          <td>{student.class || "1º Ano A"}</td>
                                          <td>
                                            <Badge
                                              color={getBadgeColor(
                                                student.average
                                              )}
                                              pill
                                            >
                                              {student.average?.toFixed(1) ||
                                                "N/A"}
                                            </Badge>
                                          </td>
                                          <td>
                                            <UncontrolledDropdown>
                                              <DropdownToggle
                                                href="#"
                                                className="card-drop"
                                                tag="a"
                                              >
                                                <i className="mdi mdi-dots-horizontal font-size-18"></i>
                                              </DropdownToggle>
                                              <DropdownMenu className="dropdown-menu-end">
                                                <DropdownItem
                                                  href={`/student-details/${student.id}`}
                                                >
                                                  <i className="mdi mdi-eye-outline font-size-16 text-primary me-1"></i>{" "}
                                                  Ver Perfil
                                                </DropdownItem>
                                                <DropdownItem href="#">
                                                  <i className="mdi mdi-pencil-outline font-size-16 text-success me-1"></i>{" "}
                                                  Lançar Notas
                                                </DropdownItem>
                                                <DropdownItem href="#">
                                                  <i className="mdi mdi-file-document-outline font-size-16 text-info me-1"></i>{" "}
                                                  Boletim
                                                </DropdownItem>
                                              </DropdownMenu>
                                            </UncontrolledDropdown>
                                          </td>
                                        </tr>
                                      ))}
                                  </tbody>
                                </Table>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
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

export default withTranslation()(ProfessorDashboard);
