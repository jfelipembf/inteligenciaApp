import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody, Table, Button, Input, Badge } from "reactstrap";
import { Link } from "react-router-dom";
import Breadcrumb from "../../components/Common/Breadcrumb";

const Students = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Dados fictícios de alunos
  const studentsData = [
    {
      id: 1,
      name: "João Silva",
      registration: "2024001",
      grade: "9º Ano",
      class: "A",
      status: "active",
      email: "joao.silva@email.com",
      phone: "(79) 99999-1111"
    },
    {
      id: 2,
      name: "Maria Oliveira",
      registration: "2024002",
      grade: "8º Ano",
      class: "B",
      status: "active",
      email: "maria.oliveira@email.com",
      phone: "(79) 99999-2222"
    },
    {
      id: 3,
      name: "Pedro Santos",
      registration: "2024003",
      grade: "7º Ano",
      class: "C",
      status: "inactive",
      email: "pedro.santos@email.com",
      phone: "(79) 99999-3333"
    },
    {
      id: 4,
      name: "Ana Costa",
      registration: "2024004",
      grade: "6º Ano",
      class: "A",
      status: "active",
      email: "ana.costa@email.com",
      phone: "(79) 99999-4444"
    },
    {
      id: 5,
      name: "Lucas Pereira",
      registration: "2024005",
      grade: "5º Ano",
      class: "B",
      status: "active",
      email: "lucas.pereira@email.com",
      phone: "(79) 99999-5555"
    },
  ];

  // Filtrar alunos com base no termo de pesquisa
  const filteredStudents = studentsData.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.registration.includes(searchTerm) ||
    student.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Dashboard" breadcrumbItem="Alunos" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title">Lista de Alunos</h4>
                    <div className="d-flex gap-2">
                      <Input
                        type="search"
                        className="form-control"
                        placeholder="Pesquisar alunos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: "250px" }}
                      />
                      <Button color="primary">
                        <i className="bx bx-plus me-1"></i> Novo Aluno
                      </Button>
                    </div>
                  </div>
                  
                  <div className="table-responsive">
                    <Table className="table table-centered table-nowrap mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Nome</th>
                          <th>Matrícula</th>
                          <th>Série</th>
                          <th>Turma</th>
                          <th>Status</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((student) => (
                          <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>
                              <Link to={`/students/${student.id}`} className="text-body fw-bold">
                                {student.name}
                              </Link>
                            </td>
                            <td>{student.registration}</td>
                            <td>{student.grade}</td>
                            <td>{student.class}</td>
                            <td>
                              <Badge
                                className={"font-size-11 badge-soft-" + 
                                  (student.status === "active" ? "success" : "danger")}
                                color={student.status === "active" ? "success" : "danger"}
                                pill
                              >
                                {student.status === "active" ? "Ativo" : "Inativo"}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <Link to={`/students/${student.id}`} className="text-primary">
                                  <i className="bx bx-user-circle font-size-18"></i>
                                </Link>
                                <a href={`mailto:${student.email}`} className="text-info">
                                  <i className="bx bx-envelope font-size-18"></i>
                                </a>
                                <a 
                                  href={`https://wa.me/55${student.phone.replace(/\D/g, '')}`} 
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