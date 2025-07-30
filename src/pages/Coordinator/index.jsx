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
import useFetchCoordinators from "../../hooks/useFetchCoordinators"; // Importação do hook

const Coordinators = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { coordinators, loading, error } = useFetchCoordinators(); // Uso do hook

  // Filtrar coordenadores com base no termo de pesquisa
  const filteredCoordinators = coordinators.filter(
    (coordinator) =>
      coordinator.personalInfo?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      coordinator.registration?.includes(searchTerm) ||
      coordinator.department
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      coordinator.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
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
                    </div>
                  </div>

                  {loading ? (
                    <p>Carregando coordenadores...</p>
                  ) : error ? (
                    <p className="text-danger">
                      Erro ao carregar coordenadores: {error}
                    </p>
                  ) : (
                    <div className="table-responsive">
                      <Table className="table table-centered table-nowrap mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Nome</th>
                            <th>Registro</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCoordinators.map((coordinator) => (
                            <tr key={coordinator.id}>
                              <td width="50%">
                                <Link
                                  to={`/coordinators/${coordinator.id}`}
                                  className="text-body fw-bold"
                                >
                                  {coordinator.personalInfo?.name || "N/A"}
                                </Link>
                              </td>
                              <td width="50%">
                                {coordinator.professionalInfo.registration ||
                                  "N/A"}
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

export default Coordinators;
