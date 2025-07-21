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

const SchoolInfo = () => {
  const [isEditing, setIsEditing] = useState(false);

  const schoolData = {
    addressInfo: {
      address: "Av. Beira Mar",
      number: "1500",
      complement: "Próximo ao Shopping Riomar",
      neighborhood: "Jardins",
      city: "Aracaju",
      state: "SE",
      zipCode: "49025-040",
    },
    contactInfo: {
      email: "contato@colegioexemplo.com.br",
      phone: "(79) 3241-1234",
      whatsapp: "(79) 99999-8888",
      website: "www.colegioexemplo.com.br",
    },
    billing: {
      bankInfo: {
        bank: "Banco do Brasil",
        agency: "1234-5",
        account: "12345-6",
      },
      dueDay: 10,
      paymentMethod: "Boleto Bancário",
      pricePerStudent: "150,00",
    },
    segments: {
      "Educação Infantil": true,
      "Ensino Fundamental I": true,
      "Ensino Fundamental II": true,
      "Ensino Médio": true,
    },
    responsibles: [
      {
        name: "Felipe Macedo",
        role: "Diretor",
        email: "felipe.macedo@colegioexemplo.com.br",
        phone: "(79) 99999-1111",
        cpf: "123.456.789-00",
      },
      {
        name: "Amanda Silva",
        role: "Coordenadora Pedagógica",
        email: "amanda.silva@colegioexemplo.com.br",
        phone: "(79) 99999-2222",
        cpf: "987.654.321-00",
      },
      {
        name: "Lucas Oliveira",
        role: "Financeiro",
        email: "lucas.oliveira@colegioexemplo.com.br",
        phone: "(79) 99999-3333",
        cpf: "456.789.123-00",
      },
    ],
    grades: {
      infantil: true,
      fundamental1: true,
      fundamental2: true,
      medio: true,
    },
    subjects: ["matematica", "portugues", "ciencias", "historia", "geografia"],
  };

  if (isEditing) {
    return <EditSchool schoolData={schoolData} />;
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
                      value={`${schoolData.addressInfo.address}, ${schoolData.addressInfo.number}`}
                    />
                    <InfoItem
                      label="Complemento"
                      value={schoolData.addressInfo.complement}
                    />
                    <InfoItem
                      label="Bairro"
                      value={schoolData.addressInfo.neighborhood}
                    />
                    <InfoItem
                      label="Cidade/UF"
                      value={`${schoolData.addressInfo.city} - ${schoolData.addressInfo.state}`}
                    />
                    <InfoItem
                      label="CEP"
                      value={schoolData.addressInfo.zipCode}
                    />
                  </div>
                </Col>

                <Col lg={6}>
                  <div className="pb-3">
                    <h5 className="font-size-15 mb-3">Contato</h5>
                    <InfoItem
                      label="Email"
                      value={schoolData.contactInfo.email}
                    />
                    <InfoItem
                      label="Telefone"
                      value={schoolData.contactInfo.phone}
                    />
                    <InfoItem
                      label="WhatsApp"
                      value={schoolData.contactInfo.whatsapp}
                    />
                    <InfoItem
                      label="Website"
                      value={schoolData.contactInfo.website}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <div className="border-bottom pb-3 mb-4">
                    <h5 className="font-size-15 mb-3">Séries Escolares</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {Object.entries(schoolData.grades).map(([key, value]) => {
                        if (!value) return null;
                        const serieLabel = {
                          infantil: "Educação Infantil",
                          fundamental1: "Ensino Fundamental I",
                          fundamental2: "Ensino Fundamental II",
                          medio: "Ensino Médio",
                        }[key];
                        return (
                          serieLabel && (
                            <span
                              key={key}
                              className="badge bg-primary-subtle text-primary"
                            >
                              {serieLabel}
                            </span>
                          )
                        );
                      })}
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
                      {schoolData.responsibles.map((responsible, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-xs me-3">
                                <span className="avatar-title rounded-circle bg-primary text-white">
                                  {responsible.name.charAt(0)}
                                </span>
                              </div>
                              {responsible.name}
                            </div>
                          </td>
                          <td>{responsible.role}</td>
                          <td>{responsible.email}</td>
                          <td>{responsible.phone}</td>
                          <td>{responsible.cpf}</td>
                        </tr>
                      ))}
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
