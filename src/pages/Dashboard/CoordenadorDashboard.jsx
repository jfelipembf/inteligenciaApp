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
import { useCoordinatorContext } from "../../contexts/CoordinatorDashboardContext";

// Componentes
import Breadcrumbs from "../../components/Common/Breadcrumb";

// Gráficos
import ReactApexChart from "react-apexcharts";

// i18n
import { withTranslation } from "react-i18next";

const CoordenadorDashboard = (props) => {
  const [activeTab, setActiveTab] = useState("1");
  const [selectedClass, setSelectedClass] = useState(null);

  // Dados dos hooks
  const {
    students,
    classes,
    teachers,
    loading,
    totalStudents,
    totalTeachers,
    totalClasses,
    averageGrade,
    approvalRate,
    classAverages,
    unitAverages,
    studentAverages,
    studentsByClass,
    gradeDistribution,
    unitAveragesByClass,
    gradeDistributionByClass,
    topStudents,
    topTeachers,
    error,
  } = useCoordinatorContext();

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

  // Calcular estatísticas
  //const totalStudents = students.length;
  //const totalTeachers = users.filter(
  //(user) => user.role === "professor"
  //).length;
  //const totalClasses = classes.length;

  // Calcular média geral de todos os alunos
  //const averageGrade =
  //students.reduce((acc, student) => acc + (student.average || 0), 0) /
  //(totalStudents || 1);

  // Calcular taxa de aprovação
  const approvedStudents = students.filter(
    (student) => (student.average || 0) >= 7
  ).length;
  //const approvalRate = (approvedStudents / (totalStudents || 1)) * 100;

  // Filtrar alunos por turma selecionada
  const filteredStudents = selectedClass
    ? students.filter((student) => student.class === selectedClass)
    : students;

  // Cards principais
  const mainCards = [
    {
      title: "Total de Alunos",
      value: totalStudents,
      icon: "bx-user-circle",
      color: "primary",
      change: "+5%",
      period: "desde o mês passado",
    },
    {
      title: "Total de Professores",
      value: totalTeachers,
      icon: "bx-user-voice",
      color: "success",
      change: "+2",
      period: "novos professores",
    },
    {
      title: "Média Geral",
      value: averageGrade.toFixed(1),
      icon: "bx-bar-chart-alt-2",
      color: "info",
      change: "+0.3",
      period: "desde o último bimestre",
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
        categories: Object.keys(classAverages).map((className) =>
          className.length > 20 ? `${className.slice(0, 20)}...` : className
        ),
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
          custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            const className = Object.keys(classAverages)[dataPointIndex];
            return `<div class="apexcharts-tooltip-title">${className}</div>`;
          },
        },
      },
    },
  };

  // Configuração do gráfico de desempenho por disciplina
  const subjectPerformanceOptions = {
    series: [
      {
        name: "Média",
        data: [8.5, 7.8, 7.2, 8.1, 6.9, 7.5, 8.3],
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
        categories: [
          "Português",
          "Matemática",
          "Ciências",
          "História",
          "Geografia",
          "Inglês",
          "Artes",
        ],
      },
      yaxis: {
        min: 0,
        max: 10,
        title: {
          text: "Média",
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

  // Configuração do gráfico de frequência
  const attendanceChartOptions = {
    series: [
      {
        name: "Frequência",
        data: [95, 92, 88, 96, 90, 93, 97, 94, 91, 89],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        toolbar: {
          show: false,
        },
      },
      colors: ["#556ee6"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
        width: 3,
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: classes
          .slice(0, 10)
          .map((classItem) => classItem.className),
      },
      yaxis: {
        min: 80,
        max: 100,
      },
      markers: {
        size: 4,
      },
    },
  };

  // Dados para a tabela de alunos com melhor desempenho
  //const topStudents = [...students]
  //.sort((a, b) => (b.average || 0) - (a.average || 0))
  //.slice(0, 5);

  // Dados para a tabela de professores
  const teachersList = teachers;
  //.filter((user) => user.role === "professor")
  //.slice(0, 5);

  //meta title
  document.title = "Dashboard do Coordenador | Painel Escolar";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumbs */}
          <Breadcrumbs
            title={props.t("Dashboards")}
            breadcrumbItem={props.t("Dashboard do Coordenador")}
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
                        <div className="text-nowrap">
                          <span
                            className={`badge bg-soft-${card.color} text-${card.color}`}
                          >
                            {card.change}
                          </span>
                          <span className="ms-1 text-muted font-size-13">
                            {card.period}
                          </span>
                        </div>
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
                        <span className="d-none d-sm-block">Turmas</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "3" })}
                        onClick={() => toggle("3")}
                      >
                        <span className="d-none d-sm-block">Professores</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "4" })}
                        onClick={() => toggle("4")}
                      >
                        <span className="d-none d-sm-block">Alunos</span>
                      </NavLink>
                    </NavItem>
                  </Nav>

                  <TabContent activeTab={activeTab} className="p-3">
                    {/* Aba de Visão Geral */}
                    <TabPane tabId="1">
                      <Row>
                        <Col xl={8}>
                          <Card>
                            <CardBody>
                              <CardTitle className="mb-4">
                                Desempenho por Turma
                              </CardTitle>
                              <ReactApexChart
                                options={classPerformanceOptions.options}
                                series={classPerformanceOptions.series}
                                type="bar"
                                height={350}
                                className="apex-charts"
                              />
                            </CardBody>
                          </Card>
                        </Col>
                        <Col xl={4}>
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
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {topStudents.map((student, index) => (
                                      <tr key={index}>
                                        <td>
                                          <div className="d-flex align-items-center">
                                            <div className="avatar-xs me-2">
                                              <span className="avatar-title rounded-circle bg-primary text-white">
                                                {student.personalInfo.name
                                                  ? student.personalInfo.name.charAt(
                                                      0
                                                    )
                                                  : "A"}
                                              </span>
                                            </div>
                                            {student.personalInfo.name}
                                          </div>
                                        </td>
                                        <td>
                                          {classes.find(
                                            (c) =>
                                              c.id ===
                                              student.academicInfo.classId
                                          )?.className || "sem turma"}
                                        </td>
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
                                Desempenho por Disciplina
                              </CardTitle>
                              <ReactApexChart
                                options={subjectPerformanceOptions.options}
                                series={subjectPerformanceOptions.series}
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
                                Frequência por Turma
                              </CardTitle>
                              <ReactApexChart
                                options={attendanceChartOptions.options}
                                series={attendanceChartOptions.series}
                                type="line"
                                height={240}
                                className="apex-charts"
                              />
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
                                  Lista de Turmas
                                </CardTitle>
                                <Link to="/classes" className="btn btn-primary">
                                  Ver Todas as Turmas
                                </Link>
                              </div>
                              <div className="table-responsive">
                                <Table className="table-centered table-nowrap mb-0">
                                  <thead className="table-light">
                                    <tr>
                                      <th>Turma</th>
                                      <th>Alunos</th>
                                      <th>Média Geral</th>
                                      <th>Frequência</th>
                                      <th>Desempenho</th>
                                      <th>Ações</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {classes.map((classItem, index) => (
                                      <tr key={index}>
                                        <td>{classItem.className}</td>
                                        <td>{classItem.studentCount}</td>
                                        <td>
                                          <Badge
                                            color={getBadgeColor(
                                              classItem.average
                                            )}
                                            pill
                                          >
                                            {classItem.average?.toFixed(1) ||
                                              "N/A"}
                                          </Badge>
                                        </td>
                                        <td>
                                          {Math.floor(85 + Math.random() * 15)}%
                                        </td>
                                        <td style={{ width: "15%" }}>
                                          <Progress
                                            value={getProgressPercentage(
                                              classItem.average || 0
                                            )}
                                            color={getProgressColor(
                                              classItem.average || 0
                                            )}
                                            style={{ height: "6px" }}
                                          />
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
                                                Editar
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
                        <Col xl={12}>
                          <Card>
                            <CardBody>
                              <CardTitle className="mb-4">
                                Desempenho por Turma
                              </CardTitle>
                              <ReactApexChart
                                options={classPerformanceOptions.options}
                                series={classPerformanceOptions.series}
                                type="bar"
                                height={350}
                                className="apex-charts"
                              />
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>

                    {/* Aba de Professores */}
                    <TabPane tabId="3">
                      <Row>
                        <Col xl={12}>
                          <Card>
                            <CardBody>
                              <div className="d-flex justify-content-between align-items-center mb-4">
                                <CardTitle className="mb-0">
                                  Lista de Professores
                                </CardTitle>
                                <Link
                                  to="/teachers"
                                  className="btn btn-primary"
                                >
                                  Ver Todos os Professores
                                </Link>
                              </div>
                              <div className="table-responsive">
                                <Table className="table-centered table-nowrap mb-0">
                                  <thead className="table-light">
                                    <tr>
                                      <th>Professor</th>
                                      <th>Disciplina</th>
                                      <th>Turmas</th>
                                      <th>Avaliação</th>
                                      <th>Ações</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {teachersList.map((teacher, index) => (
                                      <tr key={index}>
                                        <td>
                                          <div className="d-flex align-items-center">
                                            <div className="avatar-xs me-2">
                                              <span className="avatar-title rounded-circle bg-primary text-white">
                                                {teacher.name
                                                  ? teacher.name.charAt(0)
                                                  : "P"}
                                              </span>
                                            </div>
                                            {teacher.name ||
                                              `Professor ${index + 1}`}
                                          </div>
                                        </td>
                                        <td>
                                          {teacher.subject || "Múltiplas"}
                                        </td>
                                        <td>
                                          {Math.floor(1 + Math.random() * 5)}
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center">
                                            <div className="me-2">
                                              {(8 + Math.random() * 2).toFixed(
                                                1
                                              )}
                                            </div>
                                            <div style={{ width: "80px" }}>
                                              <Progress
                                                value={
                                                  (8 + Math.random() * 2) * 10
                                                }
                                                color="success"
                                                style={{ height: "6px" }}
                                              />
                                            </div>
                                          </div>
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
                                                href={`/teacher-details/${teacher.id}`}
                                              >
                                                <i className="mdi mdi-eye-outline font-size-16 text-primary me-1"></i>{" "}
                                                Ver Perfil
                                              </DropdownItem>
                                              <DropdownItem href="#">
                                                <i className="mdi mdi-pencil-outline font-size-16 text-success me-1"></i>{" "}
                                                Editar
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
                    </TabPane>

                    {/* Aba de Alunos */}
                    <TabPane tabId="4">
                      <Row className="mb-4">
                        <Col xl={12}>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h5 className="mb-0">Lista de Alunos</h5>
                              <p className="text-muted mb-0">
                                {selectedClass
                                  ? `Mostrando alunos da turma ${selectedClass}`
                                  : "Mostrando todos os alunos"}
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
                                  {classes.map((classItem, index) => (
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
                              <Link to="/students" className="btn btn-primary">
                                Ver Todos os Alunos
                              </Link>
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
                                      <th>Frequência</th>
                                      <th>Status</th>
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
                                            {Math.floor(
                                              85 + Math.random() * 15
                                            )}
                                            %
                                          </td>
                                          <td>
                                            <Badge
                                              color={
                                                (student.average || 0) >= 7
                                                  ? "success"
                                                  : "danger"
                                              }
                                              className="bg-soft-success text-success"
                                            >
                                              {(student.average || 0) >= 7
                                                ? "Aprovado"
                                                : "Em recuperação"}
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
                                                  Editar
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

export default withTranslation()(CoordenadorDashboard);
