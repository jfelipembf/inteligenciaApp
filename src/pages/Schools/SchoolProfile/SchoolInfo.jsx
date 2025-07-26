import React, { useState } from "react";
import { Row, Col, Card, CardBody, Button } from "reactstrap";
import EditSchool from "./EditSchool";

const InfoItem = ({ label, value }) => (
  <div className="d-flex align-items-center mb-3">
    <span className="text-muted" style={{ width: "140px" }}>
      {label}:
    </span>
    <span className="fw-medium">{value || "-"}</span>
  </div>
);

const SchoolInfo = ({ schoolData }) => {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <EditSchool
        schoolData={schoolData}
        schoolId={schoolData.id}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <React.Fragment>
      <Row>
        <Col xl={12}>
          <Card>
            <CardBody>
              <div className="d-flex align-items-center mb-4">
                <h4 className="card-title flex-grow-1 mb-0">
                  Informações Gerais
                </h4>
                <Button
                  color="primary"
                  className="btn-sm"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="bx bx-edit me-1"></i> Editar
                </Button>
              </div>

              <Row>
                <Col lg={6}>
                  <div className="border-bottom pb-3 mb-4">
                    <h5 className="font-size-15 mb-3">Endereço</h5>
                    <InfoItem
                      label="Logradouro"
                      value={`${schoolData.addressInfo?.address || ""}, ${
                        schoolData.addressInfo?.number || ""
                      }`}
                    />
                    <InfoItem
                      label="Complemento"
                      value={schoolData.addressInfo?.complement || ""}
                    />
                    <InfoItem
                      label="Bairro"
                      value={schoolData.addressInfo?.neighborhood || ""}
                    />
                    <InfoItem
                      label="Cidade/UF"
                      value={`${schoolData.addressInfo?.city || ""} - ${
                        schoolData.addressInfo?.state || ""
                      }`}
                    />
                    <InfoItem
                      label="CEP"
                      value={schoolData.addressInfo?.zipCode || ""}
                    />
                  </div>
                </Col>

                <Col lg={6}>
                  <div className="pb-3">
                    <h5 className="font-size-15 mb-3">Contato</h5>
                    <InfoItem
                      label="Email"
                      value={schoolData.contactInfo?.email || ""}
                    />
                    <InfoItem
                      label="Telefone"
                      value={schoolData.contactInfo?.phone || ""}
                    />
                    <InfoItem
                      label="WhatsApp"
                      value={schoolData.contactInfo?.whatsapp || ""}
                    />
                    <InfoItem
                      label="Website"
                      value={schoolData.contactInfo?.website || ""}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <div className="border-bottom pb-3 mb-4">
                    <h5 className="font-size-15 mb-3">Níveis de Ensino</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {schoolData.segments && schoolData.segments.length > 0 ? (
                        schoolData.segments.map((segment, index) => (
                          <span
                            key={index}
                            className="badge bg-primary-subtle text-primary"
                          >
                            {segment}
                          </span>
                        ))
                      ) : (
                        <p>Nenhuma série cadastrada.</p>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
              <div className="mt-4">
                <h5 className="font-size-15 mb-3">Responsáveis</h5>
                <div className="table-responsive">
                  <table className="table align-middle table-nowrap table-hover">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">Nome</th>
                        <th scope="col">Cargo</th>
                        <th scope="col">Email</th>
                        <th scope="col">Telefone</th>
                        <th scope="col">CPF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(schoolData.responsibles) &&
                      schoolData.responsibles.length > 0 ? (
                        schoolData.responsibles.map((responsible, index) => (
                          <tr key={index}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar-xs me-3">
                                  <span className="avatar-title rounded-circle bg-primary text-white">
                                    {responsible.email.charAt(0)}
                                  </span>
                                </div>
                                {responsible.name}
                              </div>
                            </td>
                            <td>{responsible?.role || ""}</td>
                            <td>{responsible?.email || ""}</td>
                            <td>{responsible?.phone || ""}</td>
                            <td>{responsible?.cpf || ""}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
                            Nenhum responsável cadastrado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default SchoolInfo;
