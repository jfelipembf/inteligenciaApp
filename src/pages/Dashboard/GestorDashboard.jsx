import React, { useState, useEffect } from "react";
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
} from "reactstrap";
import { Link } from "react-router-dom";
import classnames from "classnames";

// Hooks

import { useStudentsContext } from "../../contexts/StudentsContext";
import useFetchUsers from "../../hooks/useFetchUsers";
import { useClassContext } from "../../contexts/ClassContext";

// Componentes
import Breadcrumbs from "../../components/Common/Breadcrumb";

// Gráficos
import ReactApexChart from "react-apexcharts";

// i18n
import { withTranslation } from "react-i18next";

const GestorDashboard = (props) => {
  const [activeTab, setActiveTab] = useState("1");
  const [financialData, setFinancialData] = useState({
    receitas: 125000,
    despesas: 98500,
    inadimplencia: 15,
    mensalidadeMedia: 850,
  });

  // Dados dos hooks
  const { students, loading: loadingStudents } = useStudentsContext("gestor");
  const { users, loading: loadingUsers } = useFetchUsers();
  const { classes, loading: loadingClasses } = useClassContext();

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
  const totalStudents = students.length;
  const activeStudents = students.filter(
    (student) => student.status !== "inactive"
  ).length;
  const inactiveStudents = totalStudents - activeStudents;
  const totalTeachers = users.filter(
    (user) => user.role === "professor"
  ).length;
  const totalStaff = users.filter((user) => user.role === "funcionario").length;
  const totalClasses = classes.length;

  // Calcular média geral de todos os alunos
  const averageGrade =
    students.reduce((acc, student) => acc + (student.average || 0), 0) /
    (totalStudents || 1);

  // Calcular taxa de aprovação
  const approvedStudents = students.filter(
    (student) => (student.average || 0) >= 7
  ).length;
  const approvalRate = (approvedStudents / (totalStudents || 1)) * 100;

  // Cards principais
  const mainCards = [
    {
      title: "Alunos Ativos",
      value: activeStudents,
      icon: "bx-user-check",
      color: "success",
      change: "+8",
      period: "desde o mês passado",
    },
    {
      title: "Alunos Inativos",
      value: inactiveStudents,
      icon: "bx-user-x",
      color: "danger",
      change: "-3",
      period: "desde o mês passado",
    },
    {
      title: "Receita Mensal",
      value: `R$ ${financialData.receitas.toLocaleString("pt-BR")}`,
      icon: "bx-money",
      color: "primary",
      change: "+8%",
      period: "desde o mês passado",
    },
    {
      title: "Inadimplência",
      value: `${financialData.inadimplencia}%`,
      icon: "bx-error-circle",
      color: "warning",
      change: "-2%",
      period: "desde o mês passado",
    },
  ];

  // Configuração do gráfico de receitas x despesas
  const financialChartOptions = {
    series: [
      {
        name: "Receitas",
        data: [
          12500, 13200, 12800, 14500, 15200, 14800, 15500, 16200, 15800, 16500,
          17200, 17800,
        ],
      },
      {
        name: "Despesas",
        data: [
          9500, 9800, 9600, 10200, 10500, 10300, 10800, 11200, 11000, 11500,
          11800, 12000,
        ],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "area",
        toolbar: {
          show: false,
        },
      },
      colors: ["#556ee6", "#f46a6a"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [20, 100, 100, 100],
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Fev",
          "Mar",
          "Abr",
          "Mai",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Out",
          "Nov",
          "Dez",
        ],
      },
      markers: {
        size: 3,
        strokeWidth: 3,
        hover: {
          size: 6,
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "R$ " + val.toLocaleString("pt-BR");
          },
        },
      },
    },
  };

  // Configuração do gráfico de distribuição de alunos por série
  const studentDistributionOptions = {
    series: [25, 30, 22, 18, 15, 10],
    options: {
      chart: {
        type: "donut",
        height: 240,
      },
      labels: ["1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano", "6º Ano"],
      colors: [
        "#556ee6",
        "#34c38f",
        "#f1b44c",
        "#50a5f1",
        "#f46a6a",
        "#74788d",
      ],
      legend: {
        position: "bottom",
      },
      dataLabels: {
        enabled: false,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 200,
            },
          },
        },
      ],
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
      colors: ["#34c38f"],
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

  // Dados para a tabela de turmas com melhor desempenho
  const topClasses = [...classes]
    .sort((a, b) => (b.average || 0) - (a.average || 0))
    .slice(0, 5);

  // Dados para a tabela de inadimplência por turma
  const defaultRateByClass = [
    { className: "1º Ano A", rate: 8, students: 25 },
    { className: "2º Ano B", rate: 12, students: 30 },
    { className: "3º Ano A", rate: 5, students: 28 },
    { className: "4º Ano C", rate: 15, students: 26 },
    { className: "5º Ano B", rate: 10, students: 24 },
  ];

  //meta title
  document.title = "Dashboard do Gestor | Painel Escolar";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumbs */}
          <Breadcrumbs
            title={props.t("Dashboards")}
            breadcrumbItem={props.t("Dashboard do Gestor")}
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
                        <span className="d-none d-sm-block">Financeiro</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "3" })}
                        onClick={() => toggle("3")}
                      >
                        <span className="d-none d-sm-block">Acadêmico</span>
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
                                Receitas x Despesas (Anual)
                              </CardTitle>
                              <ReactApexChart
                                options={financialChartOptions.options}
                                series={financialChartOptions.series}
                                type="area"
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
                                Distribuição de Alunos
                              </CardTitle>
                              <ReactApexChart
                                options={studentDistributionOptions.options}
                                series={studentDistributionOptions.series}
                                type="donut"
                                height={240}
                                className="apex-charts"
                              />
                            </CardBody>
                          </Card>
                          <Card>
                            <CardBody>
                              <CardTitle className="mb-4">
                                Estatísticas Gerais
                              </CardTitle>
                              <div className="mt-3">
                                <p className="font-size-15 mb-1">Professores</p>
                                <h4>{totalTeachers}</h4>
                              </div>
                              <div className="mt-3">
                                <p className="font-size-15 mb-1">
                                  Funcionários
                                </p>
                                <h4>{totalStaff}</h4>
                              </div>
                              <div className="mt-3">
                                <p className="font-size-15 mb-1">Turmas</p>
                                <h4>{totalClasses}</h4>
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
                                Turmas com Melhor Desempenho
                              </CardTitle>
                              <div className="table-responsive">
                                <Table className="table-centered table-nowrap mb-0">
                                  <thead className="table-light">
                                    <tr>
                                      <th>Turma</th>
                                      <th>Alunos</th>
                                      <th>Média</th>
                                      <th>Desempenho</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {topClasses.map((classItem, index) => (
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
                      </Row>
                    </TabPane>

                    {/* Aba Financeira */}
                    <TabPane tabId="2">
                      <Row>
                        <Col xl={6}>
                          <Card>
                            <CardBody>
                              <CardTitle className="mb-4">
                                Resumo Financeiro
                              </CardTitle>
                              <div className="mt-3">
                                <p className="font-size-15 mb-1">
                                  Receita Mensal
                                </p>
                                <h4>
                                  R${" "}
                                  {financialData.receitas.toLocaleString(
                                    "pt-BR"
                                  )}
                                </h4>
                              </div>
                              <div className="mt-3">
                                <p className="font-size-15 mb-1">
                                  Despesas Mensais
                                </p>
                                <h4>
                                  R${" "}
                                  {financialData.despesas.toLocaleString(
                                    "pt-BR"
                                  )}
                                </h4>
                              </div>
                              <div className="mt-3">
                                <p className="font-size-15 mb-1">Lucro</p>
                                <h4>
                                  R${" "}
                                  {(
                                    financialData.receitas -
                                    financialData.despesas
                                  ).toLocaleString("pt-BR")}
                                </h4>
                              </div>
                              <div className="mt-3">
                                <p className="font-size-15 mb-1">
                                  Mensalidade Média
                                </p>
                                <h4>
                                  R${" "}
                                  {financialData.mensalidadeMedia.toLocaleString(
                                    "pt-BR"
                                  )}
                                </h4>
                              </div>
                              <div className="mt-4">
                                <Link
                                  to="/financeiro"
                                  className="btn btn-primary w-md"
                                >
                                  Ver Detalhes
                                </Link>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col xl={6}>
                          <Card>
                            <CardBody>
                              <CardTitle className="mb-4">
                                Inadimplência por Turma
                              </CardTitle>
                              <div className="table-responsive">
                                <Table className="table-centered table-nowrap mb-0">
                                  <thead className="table-light">
                                    <tr>
                                      <th>Turma</th>
                                      <th>Total de Alunos</th>
                                      <th>Taxa de Inadimplência</th>
                                      <th>Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {defaultRateByClass.map((item, index) => (
                                      <tr key={index}>
                                        <td>{item.className}</td>
                                        <td>{item.students}</td>
                                        <td>{item.rate}%</td>
                                        <td>
                                          <Badge
                                            color={
                                              item.rate > 10
                                                ? "danger"
                                                : item.rate > 5
                                                ? "warning"
                                                : "success"
                                            }
                                            pill
                                          >
                                            {item.rate > 10
                                              ? "Alto"
                                              : item.rate > 5
                                              ? "Médio"
                                              : "Baixo"}
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
                        <Col xl={12}>
                          <Card>
                            <CardBody>
                              <CardTitle className="mb-4">
                                Receitas x Despesas (Anual)
                              </CardTitle>
                              <ReactApexChart
                                options={financialChartOptions.options}
                                series={financialChartOptions.series}
                                type="area"
                                height={350}
                                className="apex-charts"
                              />
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>

                    {/* Aba Acadêmica */}
                    <TabPane tabId="3">
                      <Row>
                        <Col xl={4}>
                          <Card>
                            <CardBody>
                              <CardTitle className="mb-4">
                                Estatísticas Acadêmicas
                              </CardTitle>
                              <div className="mt-3">
                                <p className="font-size-15 mb-1">
                                  Total de Alunos
                                </p>
                                <h4>{totalStudents}</h4>
                              </div>
                              <div className="mt-3">
                                <p className="font-size-15 mb-1">
                                  Total de Professores
                                </p>
                                <h4>{totalTeachers}</h4>
                              </div>
                              <div className="mt-3">
                                <p className="font-size-15 mb-1">
                                  Total de Turmas
                                </p>
                                <h4>{totalClasses}</h4>
                              </div>
                              <div className="mt-3">
                                <p className="font-size-15 mb-1">Média Geral</p>
                                <h4>{averageGrade.toFixed(1)}</h4>
                              </div>
                              <div className="mt-3">
                                <p className="font-size-15 mb-1">
                                  Taxa de Aprovação
                                </p>
                                <h4>{approvalRate.toFixed(1)}%</h4>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col xl={8}>
                          <Card>
                            <CardBody>
                              <CardTitle className="mb-4">
                                Distribuição de Alunos
                              </CardTitle>
                              <Row>
                                <Col md={6}>
                                  <ReactApexChart
                                    options={studentDistributionOptions.options}
                                    series={studentDistributionOptions.series}
                                    type="donut"
                                    height={240}
                                    className="apex-charts"
                                  />
                                </Col>
                                <Col md={6}>
                                  <div className="mt-3">
                                    <p className="font-size-15 mb-1">
                                      Alunos por Turma (Média)
                                    </p>
                                    <h4>
                                      {Math.round(
                                        totalStudents / (totalClasses || 1)
                                      )}
                                    </h4>
                                  </div>
                                  <div className="mt-3">
                                    <p className="font-size-15 mb-1">
                                      Alunos por Professor (Média)
                                    </p>
                                    <h4>
                                      {Math.round(
                                        totalStudents / (totalTeachers || 1)
                                      )}
                                    </h4>
                                  </div>
                                  <div className="mt-3">
                                    <p className="font-size-15 mb-1">
                                      Turmas por Professor (Média)
                                    </p>
                                    <h4>
                                      {(
                                        totalClasses / (totalTeachers || 1)
                                      ).toFixed(1)}
                                    </h4>
                                  </div>
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                      <Row>
                        <Col xl={12}>
                          <Card>
                            <CardBody>
                              <CardTitle className="mb-4">
                                Desempenho por Disciplina
                              </CardTitle>
                              <ReactApexChart
                                options={subjectPerformanceOptions.options}
                                series={subjectPerformanceOptions.series}
                                type="bar"
                                height={350}
                                className="apex-charts"
                              />
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

export default withTranslation()(GestorDashboard);
