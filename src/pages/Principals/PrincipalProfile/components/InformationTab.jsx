import React from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

const InformationTab = ({ user }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (!user) {
    return (
      <p className="text-center text-muted">
        Nenhum dado disponível para exibição.
      </p>
    );
  }

  return (
    <React.Fragment>
      <Form>
        <Row>
          {/* Dados Pessoais */}
          <Col lg={6}>
            <Card>
              <CardBody>
                <h4 className="card-title mb-4">Dados Pessoais</h4>
                <FormGroup>
                  <Label for="name">Nome Completo</Label>
                  <Input
                    type="text"
                    id="name"
                    value={user.personalInfo?.name || "N/A"}
                    readOnly
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="email">E-mail</Label>
                  <Input
                    type="email"
                    id="email"
                    value={user.personalInfo?.email || "N/A"}
                    readOnly
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="phone">Telefone</Label>
                  <Input
                    type="text"
                    id="phone"
                    value={user.personalInfo?.phone || "N/A"}
                    readOnly
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="birthDate">Data de Nascimento</Label>
                  <Input
                    type="text"
                    id="birthDate"
                    value={formatDate(user.personalInfo?.birthDate)}
                    readOnly
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="cpf">CPF</Label>
                  <Input
                    type="text"
                    id="cpf"
                    value={user.personalInfo?.cpf || "N/A"}
                    readOnly
                  />
                </FormGroup>
              </CardBody>
            </Card>
          </Col>

          {/* Dados Profissionais */}
          <Col lg={6}>
            <Card>
              <CardBody>
                <h4 className="card-title mb-4">Dados Profissionais</h4>
                <FormGroup>
                  <Label for="registration">Registro</Label>
                  <Input
                    type="text"
                    id="registration"
                    value={user.professionalInfo?.registration || "N/A"}
                    readOnly
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="education">Especialização</Label>
                  <Input
                    type="text"
                    id="education"
                    value={user.professionalInfo?.specialization || "N/A"}
                    readOnly
                  />
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Endereço */}
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <h4 className="card-title mb-4">Endereço</h4>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="city">Cidade</Label>
                      <Input
                        type="text"
                        id="city"
                        value={user.address?.city || "N/A"}
                        readOnly
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="neighborhood">Bairro</Label>
                      <Input
                        type="text"
                        id="neighborhood"
                        value={user.address?.neighborhood || "N/A"}
                        readOnly
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="street">Rua</Label>
                      <Input
                        type="text"
                        id="street"
                        value={user.address?.street || "N/A"}
                        readOnly
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="state">Estado</Label>
                      <Input
                        type="text"
                        id="state"
                        value={user.address?.state || "N/A"}
                        readOnly
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="number">Número</Label>
                      <Input
                        type="text"
                        id="number"
                        value={user.address?.number || "N/A"}
                        readOnly
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="cep">CEP</Label>
                      <Input
                        type="text"
                        id="cep"
                        value={user.address?.cep || "N/A"}
                        readOnly
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Form>
    </React.Fragment>
  );
};

export default InformationTab;
