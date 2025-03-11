import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Link } from "react-router-dom";
import Breadcrumb from "../../components/Common/Breadcrumb";
import InputMask from "react-input-mask";
import ImageUploader from "../../components/Common/ImageUploader";

const AddTeacher = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    birthDate: "",
    cpf: "",
    registration: "",
    specialty: "",
    education: "",
    admissionDate: "",
    department: "",
    address: "",
    cep: "",
    profileImage: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement form submission logic here
    console.log(formData);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Professores" breadcrumbItem="Novo Professor" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Cadastro de Novo Professor</h4>
                  <Form onSubmit={handleSubmit}>
                    {/* Foto de Perfil */}
                    <FormGroup className="mb-4">
                      <Label>Foto de Perfil</Label>
                      <div className="d-flex align-items-center">
                        <ImageUploader
                          image={formData.profileImage}
                          onImageChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setFormData(prev => ({
                                ...prev,
                                profileImage: file
                              }));
                            }
                          }}
                        />
                      </div>
                    </FormGroup>

                    <h5 className="font-size-14 mb-3">Dados Pessoais</h5>
                    <Row>
                      <Col md={6}>
                        <FormGroup className="mb-3">
                          <Label>Nome Completo</Label>
                          <Input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup className="mb-3">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="mb-3">
                          <Label>Telefone</Label>
                          <InputMask
                            mask="(99) 99999-9999"
                            value={formData.phone}
                            onChange={handleInputChange}
                          >
                            {(inputProps) => (
                              <Input
                                {...inputProps}
                                type="text"
                                name="phone"
                                required
                              />
                            )}
                          </InputMask>
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="mb-3">
                          <Label>Data de Nascimento</Label>
                          <Input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="mb-3">
                          <Label>CPF</Label>
                          <InputMask
                            mask="999.999.999-99"
                            value={formData.cpf}
                            onChange={handleInputChange}
                          >
                            {(inputProps) => (
                              <Input
                                {...inputProps}
                                type="text"
                                name="cpf"
                                required
                              />
                            )}
                          </InputMask>
                        </FormGroup>
                      </Col>
                    </Row>

                    <h5 className="font-size-14 mb-3 mt-4">Dados Profissionais</h5>
                    <Row>
                      <Col md={3}>
                        <FormGroup className="mb-3">
                          <Label>Registro</Label>
                          <Input
                            type="text"
                            name="registration"
                            value={formData.registration}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup className="mb-3">
                          <Label>Especialidade</Label>
                          <Input
                            type="text"
                            name="specialty"
                            value={formData.specialty}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup className="mb-3">
                          <Label>Formação</Label>
                          <Input
                            type="text"
                            name="education"
                            value={formData.education}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup className="mb-3">
                          <Label>Data de Admissão</Label>
                          <Input
                            type="date"
                            name="admissionDate"
                            value={formData.admissionDate}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={12}>
                        <FormGroup className="mb-3">
                          <Label>Departamento</Label>
                          <Input
                            type="select"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Selecione...</option>
                            <option value="Ciências Exatas">Ciências Exatas</option>
                            <option value="Ciências Humanas">Ciências Humanas</option>
                            <option value="Linguagens">Linguagens</option>
                            <option value="Ciências da Natureza">Ciências da Natureza</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>

                    <h5 className="font-size-14 mb-3 mt-4">Endereço</h5>
                    <Row>
                      <Col md={8}>
                        <FormGroup className="mb-3">
                          <Label>Endereço Completo</Label>
                          <Input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="mb-3">
                          <Label>CEP</Label>
                          <InputMask
                            mask="99999-999"
                            value={formData.cep}
                            onChange={handleInputChange}
                          >
                            {(inputProps) => (
                              <Input
                                {...inputProps}
                                type="text"
                                name="cep"
                                required
                              />
                            )}
                          </InputMask>
                        </FormGroup>
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                      <Button type="button" color="secondary" tag={Link} to="/teachers">
                        Cancelar
                      </Button>
                      <Button type="submit" color="primary">
                        Cadastrar
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddTeacher;
