import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Table,
  Button,
  Input,
  Badge,
} from "reactstrap";
import { Link } from "react-router-dom";
import Breadcrumb from "../../components/Common/Breadcrumb";
import useFetchTeachers from "../../hooks/useFetchTeachers"; // Importação do hook

const Teachers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { teachers, loading, error } = useFetchTeachers(); // Uso do hook

  // Filtrar professores com base no termo de pesquisa
  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.personalInfo?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      teacher.registration?.includes(searchTerm) ||
      teacher.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Dashboard" breadcrumbItem="Professores" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title">Lista de Professores</h4>
                    <div className="d-flex gap-2">
                      <Input
                        type="search"
                        className="form-control"
                        placeholder="Pesquisar professores..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: "250px" }}
                      />
                      <Button color="primary" tag={Link} to="/add-teacher">
                        <i className="bx bx-plus me-1"></i> Novo Professor
                      </Button>
                    </div>
                  </div>

                  {loading ? (
                    <p>Carregando professores...</p>
                  ) : error ? (
                    <p className="text-danger">
                      Erro ao carregar professores: {error}
                    </p>
                  ) : (
                    <div className="table-responsive">
                      <Table className="table table-centered table-nowrap mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Registro</th>
                            <th>Departamento</th>
                            <th>Especialidade</th>
                            <th>Status</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTeachers.map((teacher) => (
                            <tr key={teacher.id}>
                              <td>{teacher.id}</td>
                              <td>
                                <Link
                                  to={`/teachers/${teacher.id}`}
                                  className="text-body fw-bold"
                                >
                                  {teacher.personalInfo?.name || "N/A"}
                                </Link>
                              </td>
                              <td>{teacher.registration || "N/A"}</td>
                              <td>{teacher.department || "N/A"}</td>
                              <td>{teacher.specialty || "N/A"}</td>
                              <td>
                                <Badge
                                  className={
                                    "font-size-11 badge-soft-" +
                                    (teacher.status === "active"
                                      ? "success"
                                      : "danger")
                                  }
                                  color={
                                    teacher.status === "active"
                                      ? "success"
                                      : "danger"
                                  }
                                  pill
                                >
                                  {teacher.status === "active"
                                    ? "Ativo"
                                    : "Inativo"}
                                </Badge>
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <Link
                                    to={`/teachers/${teacher.id}`}
                                    className="text-primary"
                                  >
                                    <i className="bx bx-user-circle font-size-18"></i>
                                  </Link>
                                  <a
                                    href={`mailto:${teacher.email}`}
                                    className="text-info"
                                  >
                                    <i className="bx bx-envelope font-size-18"></i>
                                  </a>
                                  <a
                                    href={`https://wa.me/55${teacher.phone?.replace(
                                      /\D/g,
                                      ""
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-success"
                                  >
                                    <i className="bx bxl-whatsapp font-size-18"></i>
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Teachers;
