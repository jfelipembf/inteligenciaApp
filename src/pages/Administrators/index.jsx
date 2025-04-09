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
import useFetchAdministrators from "../../hooks/useFetchAdministrators"; // Importação do hook

const Administrators = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { administrators, loading, error } = useFetchAdministrators(); // Uso do hook

  // Filtrar administradores com base no termo de pesquisa
  const filteredAdministrators = administrators.filter(
    (administrator) =>
      administrator.personalInfo?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      administrator.registration?.includes(searchTerm) ||
      administrator.department
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      administrator.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Dashboard" breadcrumbItem="Administradores" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title">Lista de Administradores</h4>
                    <div className="d-flex gap-2">
                      <Input
                        type="search"
                        className="form-control"
                        placeholder="Pesquisar administradores..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: "250px" }}
                      />
                      <Button
                        color="primary"
                        tag={Link}
                        to="/add-administrator"
                      >
                        <i className="bx bx-plus me-1"></i> Novo Administrador
                      </Button>
                    </div>
                  </div>

                  {loading ? (
                    <p>Carregando administradores...</p>
                  ) : error ? (
                    <p className="text-danger">
                      Erro ao carregar administradores: {error}
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
                          {filteredAdministrators.map((administrator) => (
                            <tr key={administrator.id}>
                              <td width="50%">
                                <Link
                                  to={`/administrators/${administrator.id}`}
                                  className="text-body fw-bold"
                                >
                                  {administrator.personalInfo?.name || "N/A"}
                                </Link>
                              </td>
                              <td width="50%">
                                {administrator.professionalInfo.registration ||
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

export default Administrators;
