import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody, Table, Button } from "reactstrap";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";

const ViewClass = () => {
  const { id } = useParams();

  // Estado para armazenar os dados da turma
  const [classData, setClassData] = useState({
    id: 1,
    name: "Turma A",
    period: "Manhã",
    teacher: "João Silva",
    students: 25,
    description: "Turma do período matutino focada em matemática avançada",
    schedule: "Segunda a Sexta, 07:00 - 12:00",
    room: "Sala 101",
    startDate: "01/02/2025",
    endDate: "15/12/2025"
  });

  // Estado para armazenar a lista de alunos
  const [students, setStudents] = useState([
    { id: 1, name: "Ana Silva", age: 15, enrollment: "2025001", status: "Ativo" },
    { id: 2, name: "Pedro Santos", age: 16, enrollment: "2025002", status: "Ativo" },
    { id: 3, name: "Maria Oliveira", age: 15, enrollment: "2025003", status: "Ativo" },
    // Dados de exemplo - substituir por dados reais da API
  ]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Turmas" breadcrumbItem="Detalhes da Turma" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Informações da Turma</h4>
                  
                  <div className="table-responsive">
                    <table className="table table-nowrap mb-4">
                      <tbody>
                        <tr>
                          <th scope="row">Nome da Turma:</th>
                          <td>{classData.name}</td>
                          <th scope="row">Período:</th>
                          <td>{classData.period}</td>
                        </tr>
                        <tr>
                          <th scope="row">Professor:</th>
                          <td>{classData.teacher}</td>
                          <th scope="row">Sala:</th>
                          <td>{classData.room}</td>
                        </tr>
                        <tr>
                          <th scope="row">Data de Início:</th>
                          <td>{classData.startDate}</td>
                          <th scope="row">Data de Término:</th>
                          <td>{classData.endDate}</td>
                        </tr>
                        <tr>
                          <th scope="row">Horário:</th>
                          <td colSpan="3">{classData.schedule}</td>
                        </tr>
                        <tr>
                          <th scope="row">Descrição:</th>
                          <td colSpan="3">{classData.description}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h4 className="card-title mb-4">Alunos Matriculados</h4>
                  <div className="table-responsive">
                    <Table className="table-centered table-nowrap mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Nome do Aluno</th>
                          <th>Idade</th>
                          <th>Matrícula</th>
                          <th>Status</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.name}</td>
                            <td>{student.age}</td>
                            <td>{student.enrollment}</td>
                            <td>
                              <span className={`badge bg-${student.status === 'Ativo' ? 'success' : 'danger'}`}>
                                {student.status}
                              </span>
                            </td>
                            <td>
                              <Button
                                color="info"
                                size="sm"
                                className="me-2"
                                onClick={() => {
                                  window.location.href = `/student-profile/${student.id}`;
                                }}
                              >
                                Ver Perfil
                              </Button>
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

export default ViewClass;
