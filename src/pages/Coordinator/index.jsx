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

const Coordinators = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Dados fictícios de coordenadores
  const coordinatorsData = [
    {
      id: 1,
      name: "Carlos Oliveira",
      registration: "COORD2024001",
      status: "active",
      email: "carlos.oliveira@escola.edu.br",
      phone: "(79) 98888-7777",
    },
    {
      id: 2,
      name: "Ana Maria Santos",
      registration: "COORD2024002",
      status: "active",
      email: "ana.santos@escola.edu.br",
      phone: "(79) 98888-8888",
    },
    {
      id: 3,
      name: "Roberto Almeida",
      registration: "COORD2024003",
      status: "active",
      email: "roberto.almeida@escola.edu.br",
      phone: "(79) 98888-9999",
    },
    {
      id: 4,
      name: "Patrícia Lima",
      registration: "COORD2024004",
      status: "inactive",
      email: "patricia.lima@escola.edu.br",
      phone: "(79) 98888-1111",
    },
    {
      id: 5,
      name: "Fernando Costa",
      registration: "COORD2024005",
      status: "active",
      email: "fernando.costa@escola.edu.br",
      phone: "(79) 98888-2222",
    },
  ];

  // Filtrar coordenadores com base no termo de pesquisa
  const filteredCoordinators = coordinatorsData.filter(
    (coordinator) =>
      coordinator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coordinator.registration.includes(searchTerm)
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Dashboard" breadcrumbItem="Coordenadores" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title">Lista de Coordenadores</h4>
                    <div className="d-flex gap-2">
                      <Input
                        type="search"
                        className="form-control"
                        placeholder="Pesquisar coordenadores..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: "250px" }}
                      />
                      <Button color="primary" tag={Link} to="/add-coordinator">
                        <i className="bx bx-plus me-1"></i> Novo Coordenador
                      </Button>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <Table className="table table-centered table-nowrap mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Nome</th>
                          <th>Registro</th>
                          <th>Status</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCoordinators.map((coordinator) => (
                          <tr key={coordinator.id}>
                            <td>{coordinator.id}</td>
                            <td>
                              <Link
                                to={`/coordinators/${coordinator.id}`}
                                className="text-body fw-bold"
                              >
                                {coordinator.name}
                              </Link>
                            </td>
                            <td>{coordinator.registration}</td>
                            <td>
                              <Badge
                                className={
                                  "font-size-11 badge-soft-" +
                                  (coordinator.status === "active"
                                    ? "success"
                                    : "danger")
                                }
                                color={
                                  coordinator.status === "active"
                                    ? "success"
                                    : "danger"
                                }
                                pill
                              >
                                {coordinator.status === "active"
                                  ? "Ativo"
                                  : "Inativo"}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <Link
                                  to={`/coordinators/${coordinator.id}`}
                                  className="text-primary"
                                >
                                  <i className="bx bx-user-circle font-size-18"></i>
                                </Link>
                                <a
                                  href={`mailto:${coordinator.email}`}
                                  className="text-info"
                                >
                                  <i className="bx bx-envelope font-size-18"></i>
                                </a>
                                <a
                                  href={`https://wa.me/55${coordinator.phone.replace(
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
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Coordinators;
