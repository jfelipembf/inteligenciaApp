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
} from "reactstrap";
import { Link } from "react-router-dom";
import Breadcrumb from "../../components/Common/Breadcrumb";
import useFetchStudents from "../../hooks/useFetchStudents"; // Importação do hook para buscar estudantes
import useFetchClasses from "../../hooks/useFetchClasses"; // Importação do hook para buscar turmas

const Students = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { students, loading, error } = useFetchStudents(); // Uso do hook para buscar estudantes
  const {
    classes,
    loading: loadingClasses,
    error: errorClasses,
  } = useFetchClasses(); // Uso do hook para buscar turmas

  // Filtrar estudantes com base no termo de pesquisa
  const filteredStudents = students.filter(
    (student) =>
      student.personalInfo?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.academicInfo?.registration?.includes(searchTerm)
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Dashboard" breadcrumbItem="Estudantes" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title">Lista de Estudantes</h4>
                    <div className="d-flex gap-2">
                      <Input
                        type="search"
                        className="form-control"
                        placeholder="Pesquisar estudantes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: "250px" }}
                      />
                      <Button color="primary" tag={Link} to="/add-student">
                        <i className="bx bx-plus me-1"></i> Novo Estudante
                      </Button>
                    </div>
                  </div>

                  {loading || loadingClasses ? (
                    <p>Carregando estudantes e turmas...</p>
                  ) : error || errorClasses ? (
                    <p className="text-danger">
                      Erro ao carregar dados: {error || errorClasses}
                    </p>
                  ) : (
                    <div className="table-responsive">
                      <Table className="table table-centered table-nowrap mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Nome</th>
                            <th>Matrícula</th>
                            <th>Turma</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.map((student) => {
                            const turma = classes.find(
                              (classItem) =>
                                classItem.id === student.academicInfo?.classId
                            );

                            return (
                              <tr key={student.id}>
                                <td width="40%">
                                  <Link
                                    to={`/students/${student.id}`}
                                    className="text-body fw-bold"
                                  >
                                    {student.personalInfo?.name || "N/A"}
                                  </Link>
                                </td>
                                <td width="30%">
                                  {student.academicInfo?.registration || "N/A"}
                                </td>
                                <td width="30%">
                                  {turma?.className || "Sem turma"}
                                </td>
                              </tr>
                            );
                          })}
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

export default Students;
