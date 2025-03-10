import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody, Table, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";

const ListClasses = () => {
  const navigate = useNavigate();
  
  // Estado para armazenar as turmas
  const [classes, setClasses] = useState([
    { id: 1, name: "Turma A", period: "Manhã", teacher: "João Silva", students: 25 },
    { id: 2, name: "Turma B", period: "Tarde", teacher: "Maria Santos", students: 30 },
    // Dados de exemplo - substituir por dados reais da API
  ]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb */}
          <Breadcrumbs title="Turmas" breadcrumbItem="Visualizar Turmas" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title mb-0">Lista de Turmas</h4>
                    <Button
                      color="primary"
                      onClick={() => navigate("/create-class")}
                    >
                      Nova Turma
                    </Button>
                  </div>

                  <div className="table-responsive">
                    <Table className="table-centered table-nowrap mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Nome da Turma</th>
                          <th>Período</th>
                          <th>Professor</th>
                          <th>Alunos</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classes.map((classItem) => (
                          <tr key={classItem.id}>
                            <td>{classItem.id}</td>
                            <td>{classItem.name}</td>
                            <td>{classItem.period}</td>
                            <td>{classItem.teacher}</td>
                            <td>{classItem.students}</td>
                            <td>
                              <Button
                                color="info"
                                size="sm"
                                className="me-2"
                                onClick={() => navigate(`/classes/${classItem.id}`)}
                              >
                                Ver
                              </Button>
                              <Button
                                color="warning"
                                size="sm"
                                className="me-2"
                                onClick={() => {
                                  // Implementar edição
                                }}
                              >
                                Editar
                              </Button>
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() => {
                                  // Implementar exclusão
                                }}
                              >
                                Excluir
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

export default ListClasses;
