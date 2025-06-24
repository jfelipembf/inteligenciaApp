import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Badge,
} from "reactstrap";
import { useTeachersContext } from "../../../../contexts/TeachersContext";
import { useParams } from "react-router-dom";

const InformationTab = () => {
  const { id } = useParams();
  const { teachers } = useTeachersContext();

  const teacherData = teachers.find((t) => t.uid === id);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui seria implementada a lógica para salvar os dados
    alert("Dados salvos com sucesso!");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <React.Fragment>
      {/*
      <Row className="mb-4">
        <Col lg={12}>
          <Card>
            <CardBody className="p-4">
              <h4 className="card-title mb-4">Status do Sistema</h4>
              <Row className="g-3">
                <Col md={6}>
                  <div className="p-3 border-start border-primary border-3 h-100">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <i className="mdi mdi-account-check font-size-24 text-primary me-3"></i>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="font-size-15 mb-1">Status</h5>
                        {teacherData.status === "active" ? (
                          <Badge color="success" className="px-2 py-1">Ativo</Badge>
                        ) : (
                          <Badge color="warning" className="px-2 py-1">Inativo</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="p-3 border-start border-info border-3 h-100">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <i className="mdi mdi-clock-outline font-size-24 text-info me-3"></i>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="font-size-15 mb-1">Último Acesso</h5>
                        <p className="text-muted mb-0">{formatDate(teacherData.lastAccess || new Date())}</p>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
      */}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={6}>
            <Card>
              <CardBody>
                <h4 className="card-title mb-4">Dados Pessoais</h4>
                <FormGroup>
                  <Label for="name">Nome Completo</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={teacherData.personalInfo.name || "N/A"}
                    readOnly
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="email">E-mail</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={teacherData.personalInfo.email || "N/A"}
                    readOnly
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="phone">Telefone</Label>
                  <Input
                    type="text"
                    id="phone"
                    name="phone"
                    value={teacherData.personalInfo.phone || "N/A"}
                    readOnly
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="birthDate">Data de Nascimento</Label>
                  <Input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={teacherData.personalInfo.birthDate || "N/A"}
                    readOnly
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="cpf">CPF</Label>
                  <Input
                    type="text"
                    id="cpf"
                    name="cpf"
                    value={teacherData.personalInfo.cpf || "N/A"}
                    readOnly
                  />
                </FormGroup>
              </CardBody>
            </Card>
          </Col>

          <Col lg={6}>
            <Card>
              <CardBody>
                <h4 className="card-title mb-4">Dados Profissionais</h4>
                <FormGroup>
                  <Label for="registration">Registro</Label>
                  <Input
                    type="text"
                    id="registration"
                    name="registration"
                    value={teacherData.professionalInfo.registration || "N/A"}
                    readOnly
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="education">Formação</Label>
                  <Input
                    type="text"
                    id="education"
                    name="education"
                    value={teacherData.professionalInfo.specialization || "N/A"}
                    readOnly
                  />
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <h4 className="card-title mb-4">Endereço</h4>
                <Row>
                  <Col md={8}>
                    <FormGroup>
                      <Label for="address">Cidade</Label>
                      <Input
                        type="text"
                        id="city"
                        name="city"
                        value={teacherData.address.city || "N/A"}
                        readOnly
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="address">Bairro</Label>
                      <Input
                        type="text"
                        id="neighborhood"
                        name="neighborhood"
                        value={teacherData.address.neighborhood || "N/A"}
                        readOnly
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="address">Rua</Label>
                      <Input
                        type="text"
                        id="street"
                        name="street"
                        value={teacherData.address.street || "N/A"}
                        readOnly
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="cep">Estado</Label>
                      <Input
                        type="text"
                        id="state"
                        name="state"
                        value={teacherData.address.state || "N/A"}
                        readOnly
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="cep">Número</Label>
                      <Input
                        type="text"
                        id="number"
                        name="number"
                        value={teacherData.address.number || "N/A"}
                        readOnly
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="cep">CEP</Label>
                      <Input
                        type="text"
                        id="cep"
                        name="cep"
                        value={teacherData.address.cep || "N/A"}
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
