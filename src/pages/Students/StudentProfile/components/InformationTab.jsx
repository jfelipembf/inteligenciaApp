import React, { useState, useEffect } from "react";
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

const InformationTab = ({ studentData }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    cpf: "",
    registration: "",
    grade: "",
    class: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",

    address: "",
    cep: "",
  });

  // Atualizar o formulário quando os dados do aluno mudarem
  useEffect(() => {
    if (studentData) {
      setFormData({
        ...formData,
        name: studentData.personalInfo?.name || "",
        email: studentData.personalInfo?.email || "",
        phone: studentData.personalInfo?.phone || "",
        birthDate: studentData.personalInfo?.birthDate || "",
        registration: studentData.academicInfo?.registration || "",
        grade: studentData.academicInfo?.grade || "",
        class: studentData.academicInfo?.className || "Não possui",
        parentName: studentData.guardian?.name || "",
        parentPhone: studentData.guardian?.phone || "",
        parentEmail: studentData.guardian?.email || "",
      });
    }
  }, [studentData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui seria implementada a lógica para salvar os dados
    alert("Dados salvos com sucesso!");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    // Se já estiver no formato dd/mm/aaaa, retornar como está
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      return dateString;
    }

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      return date.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Determinar se o aluno está ativo (baseado no ID para demonstração)
  const isActive = studentData?.id
    ? studentData.id.charCodeAt(0) % 2 === 0
    : true;

  // Determinar se o aluno tem o app instalado (aleatório para demonstração)
  const hasApp = studentData?.id
    ? studentData.id.charCodeAt(0) % 3 !== 0
    : false;

  // Último acesso (data atual para demonstração)
  const lastAccess = new Date().toISOString();

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
                        <h5 className="font-size-15 mb-1">
                          Aplicativo Instalado
                        </h5>
                        {hasApp ? (
                          <Badge color="success" className="px-2 py-1">
                            Sim
                          </Badge>
                        ) : (
                          <Badge color="danger" className="px-2 py-1">
                            Não
                          </Badge>
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
                        <p className="text-muted mb-0">
                          {formatDate(lastAccess)}
                        </p>
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
                    disabled
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
                    disabled
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
                    disabled
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="birthDate">Data de Nascimento</Label>
                  <Input
                    type="text"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    disabled
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
                    disabled
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
                    disabled
                  />
                </FormGroup>
                {/*<FormGroup>
                  <Label for="status">Status</Label>
                  <div>
                    <Badge
                      color={isActive ? "success" : "danger"}
                      className="px-3 py-2"
                    >
                      {isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </FormGroup>*/}
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
                        disabled
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
                        disabled
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
                        disabled
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/*<Row className="mt-4">
          <Col className="text-end">
            <Button color="primary" type="submit">
              Salvar Alterações
            </Button>
          </Col>
        </Row>*/}
      </Form>
    </React.Fragment>
  );
};

export default InformationTab;
