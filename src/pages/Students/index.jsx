import React, { useState, useEffect, useCallback } from "react";
import PersonCircle from "react-bootstrap-icons/dist/icons/person-circle";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Input,
  Collapse,
  Label,
  Badge,
  Alert,
  Spinner,
} from "reactstrap";
import { Link } from "react-router-dom";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { useStudentsContext } from "../../contexts/StudentsContext";
import { useClassContext } from "../../contexts/ClassContext";
import useUser from "../../hooks/useUser";
import useStudentAvatars from "../../hooks/useStudentAvatars";

// Cores para os níveis de ensino
const EDUCATION_LEVEL_COLORS = {
  infantil: "info", // azul bebê
  fundamental: "success", // verde
  medio: "warning", // amarelo
  default: "secondary", // cinza para outros casos
};

const Students = () => {
  const { isAuthenticated, loading: userLoading } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const { userDetails } = useUser();
  const schoolId = userDetails?.schoolId;

  // Estado local para dados
  const [studentsData, setStudentsData] = useState([]);
  const [classesData, setClassesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Busca avatars
  const avatarUrls = useStudentAvatars(studentsData, schoolId);

  // Uso dos hooks para buscar dados com tratamento de erros
  const {
    students,
    loading: studentsLoading,
    error: studentsError,
    fetchStudents,
  } = useStudentsContext({
    skipInitialFetch: true, // Não buscar automaticamente no início
  });

  const {
    classes,
    loading: classesLoading,
    error: classesError,
    fetchClasses,
  } = useClassContext({
    skipInitialFetch: true, // Não buscar automaticamente no início
  });
  console.log(students);
  // Função para buscar dados quando autenticado
  const fetchData = useCallback(async () => {
    if (!isAuthenticated || userLoading) {
      setIsLoading(false);
      setPageLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const studentsResult = await fetchStudents();
      const classesResult = await fetchClasses();

      if (studentsResult && classesResult) {
        setStudentsData(studentsResult);
        setClassesData(classesResult);
      }
    } catch (error) {
      console.log("Erro ao buscar dados:", error);
      setErrorMessage("Erro ao buscar dados. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
      setPageLoading(false);
    }
  }, [isAuthenticated, userLoading, fetchStudents, fetchClasses]);

  // Verificar o estado de autenticação ao inicializar
  useEffect(() => {
    if (!userLoading) {
      if (isAuthenticated) {
        fetchData();
      } else {
        setIsLoading(false);
        setPageLoading(false);
      }
    }
  }, [isAuthenticated, userLoading, fetchData]);

  // Efeito para carregar dados quando o estado de autenticação muda
  useEffect(() => {
    if (isAuthenticated && !userLoading) {
      fetchData();
    } else if (!userLoading) {
      setIsLoading(false);
      setPageLoading(false);
    }
  }, [isAuthenticated, userLoading, fetchData]);

  // Efeito para atualizar os dados locais quando os hooks retornam dados
  useEffect(() => {
    if (!studentsLoading && !classesLoading && !userLoading) {
      if (students && classes) {
        setStudentsData(students);
        setClassesData(classes);
        setErrorMessage(null);
      } else if (studentsError || classesError) {
        setErrorMessage(studentsError || classesError);
      }

      setIsLoading(false);
      setPageLoading(false);
    }
  }, [
    students,
    classes,
    studentsLoading,
    classesLoading,
    studentsError,
    classesError,
    userLoading,
  ]);

  const toggle = () => setIsOpen(!isOpen);

  // Filtrar estudantes com base no termo de pesquisa e na turma selecionada
  const filteredStudents = studentsData.filter(
    (student) =>
      (student.personalInfo?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        student.academicInfo?.registration?.includes(searchTerm)) &&
      (selectedClass === "" || student.academicInfo?.classId === selectedClass)
  );

  // Função para formatar a data no formato dd/mm/aaaa
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    // Se já estiver no formato dd/mm/aaaa, retornar como está
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      return dateString;
    }

    // Tentar converter para o formato correto
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Se não for uma data válida, retornar como está

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    } catch (error) {
      return dateString;
    }
  };

  // Função para determinar a cor do badge com base no nível de ensino
  const getEducationLevelColor = (className) => {
    if (!className) return EDUCATION_LEVEL_COLORS.default;

    const lowerClassName = className.toLowerCase();

    if (lowerClassName.includes("infantil")) {
      return EDUCATION_LEVEL_COLORS.infantil;
    } else if (lowerClassName.includes("fundamental")) {
      return EDUCATION_LEVEL_COLORS.fundamental;
    } else if (
      lowerClassName.includes("médio") ||
      lowerClassName.includes("medio")
    ) {
      return EDUCATION_LEVEL_COLORS.medio;
    }

    return EDUCATION_LEVEL_COLORS.default;
  };

  // Função para tentar fazer login novamente
  const handleRefreshAuth = () => {
    setIsLoading(true);
    setPageLoading(true);

    // Usar o hook useUser para verificar a autenticação
    // O hook já vai atualizar o estado isAuthenticated automaticamente
    setTimeout(() => {
      setIsLoading(false);
      setPageLoading(false);
    }, 1000);
  };

  // Se a página estiver carregando, mostrar o loader de página inteira
  if (pageLoading) {
    return (
      <div className="page-loading">
        <div className="d-flex flex-column align-items-center justify-content-center vh-100">
          <Spinner color="primary" style={{ width: "3rem", height: "3rem" }} />
          <h4 className="mt-3">Carregando...</h4>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Dashboard" breadcrumbItem="Estudantes" />

          {!isAuthenticated && (
            <Alert color="warning" className="mb-4" fade={false}>
              <div className="d-flex align-items-center">
                <i className="bx bx-error-circle me-2 font-size-16"></i>
                <div className="flex-grow-1">
                  <strong>Acesso restrito:</strong> Você precisa estar
                  autenticado para visualizar a lista de alunos.
                </div>
                <Button
                  color="warning"
                  size="sm"
                  className="ms-2"
                  onClick={handleRefreshAuth}
                >
                  <i className="bx bx-refresh me-1"></i> Verificar Autenticação
                </Button>
              </div>
            </Alert>
          )}

          {isAuthenticated && (
            <>
              <Row>
                <Col lg={12}>
                  <Card className="job-filter">
                    <CardBody>
                      <form action="#">
                        <Row className="g-3">
                          <Col xxl={4} lg={4}>
                            <div className="position-relative">
                              <Input
                                type="text"
                                id="searchStudent"
                                autoComplete="off"
                                placeholder="Pesquisar por nome ou matrícula"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="form-control"
                              />
                            </div>
                          </Col>

                          <Col xxl={2} lg={4}>
                            <div className="position-relative">
                              <Input
                                type="select"
                                id="classFilter"
                                value={selectedClass}
                                onChange={(e) =>
                                  setSelectedClass(e.target.value)
                                }
                                className="form-select"
                              >
                                <option value="">Todas as turmas</option>
                                {classesData.map((classItem) => (
                                  <option
                                    key={classItem.id}
                                    value={classItem.id}
                                  >
                                    {classItem.className}
                                  </option>
                                ))}
                              </Input>
                            </div>
                          </Col>

                          <Col xxl={2} lg={4}>
                            <div className="position-relative">
                              <Button
                                color="primary"
                                className="w-100"
                                tag={Link}
                                to="/add-student"
                              >
                                <i className="bx bx-plus me-1"></i> Novo
                                Estudante
                              </Button>
                            </div>
                          </Col>

                          <Col xxl={4} lg={12}>
                            <div className="position-relative">
                              <Button
                                color="light"
                                onClick={toggle}
                                className="w-100"
                              >
                                <i
                                  className={`bx ${
                                    isOpen ? "bx-x" : "bx-filter-alt"
                                  } me-1`}
                                ></i>{" "}
                                Filtros Avançados
                              </Button>
                            </div>
                          </Col>

                          <Collapse isOpen={isOpen} className="w-100">
                            <div className="pt-3">
                              <Row className="g-3">
                                <Col xxl={4} lg={6}>
                                  <div>
                                    <Label
                                      htmlFor="statusFilter"
                                      className="form-label fw-semibold"
                                    >
                                      Status
                                    </Label>
                                  </div>
                                  <div className="form-check form-check-inline">
                                    <Input
                                      className="form-check-input"
                                      type="checkbox"
                                      id="statusActive"
                                      value="active"
                                    />
                                    <Label
                                      className="form-check-label"
                                      htmlFor="statusActive"
                                    >
                                      Ativo
                                    </Label>
                                  </div>
                                  <div className="form-check form-check-inline">
                                    <Input
                                      className="form-check-input"
                                      type="checkbox"
                                      id="statusInactive"
                                      value="inactive"
                                    />
                                    <Label
                                      className="form-check-label"
                                      htmlFor="statusInactive"
                                    >
                                      Inativo
                                    </Label>
                                  </div>
                                </Col>
                                <Col xxl={4} lg={6}>
                                  <div>
                                    <Label
                                      htmlFor="gradeFilter"
                                      className="form-label fw-semibold"
                                    >
                                      Série
                                    </Label>
                                  </div>
                                  <div className="form-check form-check-inline">
                                    <Input
                                      className="form-check-input"
                                      type="checkbox"
                                      id="elementary"
                                      value="elementary"
                                    />
                                    <Label
                                      className="form-check-label"
                                      htmlFor="elementary"
                                    >
                                      Fundamental
                                    </Label>
                                  </div>
                                  <div className="form-check form-check-inline">
                                    <Input
                                      className="form-check-input"
                                      type="checkbox"
                                      id="highSchool"
                                      value="highSchool"
                                    />
                                    <Label
                                      className="form-check-label"
                                      htmlFor="highSchool"
                                    >
                                      Médio
                                    </Label>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          </Collapse>
                        </Row>
                      </form>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {isLoading ? (
                <Row>
                  <Col>
                    <div className="text-center my-4">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                      <p className="mt-2">Carregando estudantes e turmas...</p>
                    </div>
                  </Col>
                </Row>
              ) : errorMessage ? (
                <Row>
                  <Col>
                    <div className="text-center my-4 text-danger">
                      <i className="bx bx-error-circle display-4"></i>
                      <p className="mt-2">
                        Erro ao carregar dados: {errorMessage}
                      </p>
                      <Button
                        color="primary"
                        onClick={fetchData}
                        className="mt-2"
                      >
                        <i className="bx bx-refresh me-1"></i> Tentar Novamente
                      </Button>
                    </div>
                  </Col>
                </Row>
              ) : (
                <Row>
                  {filteredStudents.length === 0 ? (
                    <Col>
                      <div className="text-center my-4 text-muted">
                        <i className="bx bx-search display-4"></i>
                        <p className="mt-2">
                          Nenhum estudante encontrado com os critérios de busca.
                        </p>
                      </div>
                    </Col>
                  ) : (
                    filteredStudents.map((student) => {
                      const turma = classesData.find(
                        (classItem) =>
                          classItem.id === student.academicInfo?.classId
                      );

                      // Determinar a cor do badge com base no nível de ensino
                      const badgeColor = getEducationLevelColor(
                        turma?.className
                      );

                      // Determinar se o aluno está ativo ou inativo (aleatório para demonstração)
                      const isActive = student.id.charCodeAt(0) % 2 === 0; // Exemplo: baseado no primeiro caractere do ID

                      return (
                        <Col xl={3} lg={4} md={6} key={student.id}>
                          <Card>
                            <CardBody>
                              <div className="d-flex align-items-start mb-3">
                                <div className="flex-grow-1">
                                  <Badge
                                    color={badgeColor}
                                    className={`badge-soft-${badgeColor}`}
                                  >
                                    {turma?.className || "Sem turma"}
                                  </Badge>
                                </div>
                                <Button
                                  type="button"
                                  color="light"
                                  size="sm"
                                  className="btn-light btn-sm"
                                >
                                  <i className="bx bx-dots-vertical-rounded"></i>
                                </Button>
                              </div>
                              <div className="text-center mb-3">
                                <div
                                  className="avatar-md profile-user-wid mx-auto mt-1 mb-4 bg-primary-subtle"
                                  style={{
                                    width: "55px",
                                    height: "55px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",

                                    borderRadius: "50%",
                                    border: "1px solid #dee2e6",
                                  }}
                                >
                                  {avatarUrls[student.id] ? (
                                    <img
                                      src={avatarUrls[student.id]}
                                      alt=""
                                      className="img-thumbnail rounded-circle"
                                      style={{
                                        width: "55px",
                                        height: "55px",
                                        objectFit: "cover",
                                      }}
                                    />
                                  ) : (
                                    // Ícone padrão de avatar
                                    <PersonCircle size={55} color="#f7f7fa" />
                                  )}
                                </div>
                                <h6 className="font-size-15 mb-1">
                                  <Link
                                    to={`/students/${student.id}`}
                                    className="text-dark"
                                  >
                                    {student.personalInfo?.name || "N/A"}
                                  </Link>
                                </h6>
                                <p className="text-muted mb-0">
                                  Matrícula:{" "}
                                  {student.academicInfo?.registration || "N/A"}
                                </p>
                              </div>
                              <div className="d-flex mb-3 justify-content-center gap-2 text-muted">
                                <div>
                                  <i className="bx bx-calendar align-middle text-primary"></i>{" "}
                                  {formatDate(
                                    student.personalInfo?.birthDate
                                  ) || "N/A"}
                                </div>
                              </div>
                              <div className="text-center mb-3">
                                {/* <Badge
                                  color={isActive ? "success" : "danger"}
                                  className={`badge-soft-${
                                    isActive ? "success" : "danger"
                                  }`}
                                >
                                  {isActive ? "Ativo" : "Inativo"}
                                </Badge> */}
                              </div>
                              <div className="mt-4 pt-1">
                                <Link
                                  to={`/students/${student.id}`}
                                  state={{ student }}
                                  className="btn btn-soft-primary d-block"
                                >
                                  Ver Perfil
                                </Link>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      );
                    })
                  )}
                </Row>
              )}
            </>
          )}

          {!isAuthenticated && (
            <Row className="mt-4">
              <Col>
                <Card>
                  <CardBody className="text-center">
                    <div className="py-5">
                      <i className="bx bx-lock-alt text-primary display-3 mb-3"></i>
                      <h4>Acesso Restrito</h4>
                      <p className="text-muted">
                        Você precisa estar autenticado para visualizar a lista
                        de alunos. Por favor, faça login para acessar esta
                        página.
                      </p>
                      <div className="mt-4">
                        <Button
                          color="primary"
                          tag={Link}
                          to="/login"
                          className="me-2"
                        >
                          <i className="bx bx-log-in-circle me-1"></i> Fazer
                          Login
                        </Button>
                        <Button color="light" onClick={handleRefreshAuth}>
                          <i className="bx bx-refresh me-1"></i> Verificar
                          Autenticação
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Students;
