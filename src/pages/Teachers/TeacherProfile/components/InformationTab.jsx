import React, { useState } from "react";
import { Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Badge } from "reactstrap";
import { teacherData } from "./data";

const InformationTab = () => {
  const [formData, setFormData] = useState({
    name: teacherData.name || "",
    email: teacherData.email || "",
    phone: teacherData.phone || "",
    birthDate: teacherData.birthDate ? new Date(teacherData.birthDate).toISOString().split('T')[0] : "",
    cpf: teacherData.cpf || "",
    registration: teacherData.registration || "",
    specialty: teacherData.specialty || "",
    education: teacherData.education || "",
    startDate: teacherData.startDate ? new Date(teacherData.startDate).toISOString().split('T')[0] : "",
    department: teacherData.department || "",
    status: teacherData.status || "active",
    address: "Rua dos Professores, 456, Aracaju - SE",
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
                <h4 className="card-title mb-4">Dados Profissionais</h4>
                <FormGroup>
                  <Label for="registration">Registro</Label>
                  <Input
                    type="text"
                    id="registration"
                    name="registration"
                    value={formData.registration}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="specialty">Especialidade</Label>
                  <Input
                    type="text"
                    id="specialty"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="education">Formação</Label>
                  <Input
                    type="text"
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="startDate">Data de Admissão</Label>
                  <Input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="department">Departamento</Label>
                  <Input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
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
                <h4 className="card-title mb-4">Endereço</h4>
                <Row>
                  <Col md={8}>
                    <FormGroup>
                      <Label for="address">Endereço Completo</Label>
                      <Input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
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
