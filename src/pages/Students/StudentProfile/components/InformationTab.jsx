import React, { useState } from "react";
import { Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Badge } from "reactstrap";
import { studentData } from "./data";

const InformationTab = () => {
  const [formData, setFormData] = useState({
    name: studentData.name || "",
    email: studentData.email || "",
    phone: studentData.phone || "",
    birthDate: studentData.birthDate || "",
    cpf: studentData.cpf || "",
    registration: studentData.registration || "",
    grade: studentData.grade || "",
    class: studentData.class || "",
    parentName: "Maria Silva",
    parentPhone: "(79) 99999-2222",
    parentEmail: "maria.silva@email.com",
    parentCpf: "987.654.321-00",
    address: "Rua das Flores, 123, Aracaju - SE",
    cep: "49000-000"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

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
      minute: "2-digit"
    });
  };

  return (
    <React.Fragment>
      <Row className="mb-4">
        <Col lg={12}>
          <Card>
            <CardBody className="p-4">
              <h4 className="card-title mb-4">Status do Aplicativo</h4>
              <Row className="g-3">
                <Col md={6}>
                  <div className="p-3 border-start border-primary border-3 h-100">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <i className="mdi mdi-cellphone-android font-size-24 text-primary me-3"></i>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="font-size-15 mb-1">Aplicativo Instalado</h5>
                        {studentData.hasApp ? (
                          <Badge color="success" className="px-2 py-1">Sim</Badge>
                        ) : (
                          <Badge color="danger" className="px-2 py-1">Não</Badge>
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
                        <p className="text-muted mb-0">{formatDate(studentData.lastAccess)}</p>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

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
                    value={formData.name}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="email">E-mail</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="phone">Telefone</Label>
                  <Input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="birthDate">Data de Nascimento</Label>
                  <Input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="cpf">CPF</Label>
                  <Input
                    type="text"
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                  />
                </FormGroup>
              </CardBody>
            </Card>
          </Col>

          <Col lg={6}>
            <Card>
              <CardBody>
                <h4 className="card-title mb-4">Dados Acadêmicos</h4>
                <FormGroup>
                  <Label for="registration">Matrícula</Label>
                  <Input
                    type="text"
                    id="registration"
                    name="registration"
                    value={formData.registration}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="grade">Série</Label>
                  <Input
                    type="text"
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="class">Turma</Label>
                  <Input
                    type="text"
                    id="class"
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="address">Endereço</Label>
                  <Input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="cep">CEP</Label>
                  <Input
                    type="text"
                    id="cep"
                    name="cep"
                    value={formData.cep}
                    onChange={handleChange}
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
                <h4 className="card-title mb-4">Dados dos Responsáveis</h4>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="parentName">Nome do Responsável</Label>
                      <Input
                        type="text"
                        id="parentName"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="parentPhone">Telefone do Responsável</Label>
                      <Input
                        type="text"
                        id="parentPhone"
                        name="parentPhone"
                        value={formData.parentPhone}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="parentEmail">E-mail do Responsável</Label>
                      <Input
                        type="email"
                        id="parentEmail"
                        name="parentEmail"
                        value={formData.parentEmail}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="parentCpf">CPF do Responsável</Label>
                      <Input
                        type="text"
                        id="parentCpf"
                        name="parentCpf"
                        value={formData.parentCpf}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col className="text-end">
            <Button color="primary" type="submit">
              Salvar Alterações
            </Button>
          </Col>
        </Row>
      </Form>
    </React.Fragment>
  );
};

export default InformationTab;
