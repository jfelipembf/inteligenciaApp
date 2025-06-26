import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Common/Breadcrumb";
import InputMask from "react-input-mask";
import ImageUploader from "../../components/Common/ImageUploader";
import { useAdministratorManagement } from "../../hooks/useAdministratorManagement";

const AddAdministrator = () => {
  const navigate = useNavigate();
  const { createAdministrator, loading, error } = useAdministratorManagement();
  const [formData, setFormData] = useState({
    // Dados pessoais
    fullName: "",
    email: "",
    phone: "",
    birthDate: "",
    cpf: "",
    rg: "",
    gender: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
    // Dados profissionais
    registration: "",
    // Endereço
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const searchCep = async (cep) => {
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cep.replace(/\D/g, "")}/json/`
      );
      const data = await response.json();
      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  const handleCepBlur = (e) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length === 8) {
      searchCep(cep);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const userData = {
        personalInfo: {
          name: formData.fullName,
          phone: formData.phone,
          birthDate: formData.birthDate,
          cpf: formData.cpf,
          rg: formData.rg,
          gender: formData.gender,
        },
        professionalInfo: {
          registration: formData.registration,
        },
        address: {
          cep: formData.cep,
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
        },
      };

      await createAdministrator({
        email: formData.email,
        password: formData.password,
        userData,
        profileImage: formData.profileImage,
      });

      alert("Administrador cadastrado com sucesso!");
      navigate("/administrators");
    } catch (err) {
      alert("Erro ao criar administrador: " + err.message);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            title="Administradores"
            breadcrumbItem="Novo Administrador"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">
                    Cadastro de Novo Administrador
                  </h4>
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
                              setFormData((prev) => ({
                                ...prev,
                                profileImage: file,
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
                      <Col md={4}>
                        <FormGroup className="mb-3">
                          <Label>RG</Label>
                          <InputMask
                            mask="99.999.999-9"
                            value={formData.rg}
                            onChange={handleInputChange}
                          >
                            {(inputProps) => (
                              <Input
                                {...inputProps}
                                type="text"
                                name="rg"
                                required
                              />
                            )}
                          </InputMask>
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="mb-3">
                          <Label>Gênero</Label>
                          <Input
                            type="select"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Selecione...</option>
                            <option value="masculino">Masculino</option>
                            <option value="feminino">Feminino</option>
                            <option value="outro">Outro</option>
                          </Input>
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
                    </Row>

                    <h5 className="font-size-14 mb-3 mt-4">
                      Dados Profissionais
                    </h5>
                    <Row>
                      <Col md={4}>
                        <FormGroup className="mb-3">
                          <Label>Matrícula</Label>
                          <Input
                            type="text"
                            name="registration"
                            value={formData.registration}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <h5 className="font-size-14 mb-3 mt-4">Endereço</h5>
                    <Row>
                      <Col md={3}>
                        <FormGroup className="mb-3">
                          <Label>CEP</Label>
                          <InputMask
                            mask="99999-999"
                            value={formData.cep}
                            onChange={handleInputChange}
                            onBlur={handleCepBlur}
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
                      <Col md={7}>
                        <FormGroup className="mb-3">
                          <Label>Rua</Label>
                          <Input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup className="mb-3">
                          <Label>Número</Label>
                          <Input
                            type="text"
                            name="number"
                            value={formData.number}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="mb-3">
                          <Label>Complemento</Label>
                          <Input
                            type="text"
                            name="complement"
                            value={formData.complement}
                            onChange={handleInputChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="mb-3">
                          <Label>Bairro</Label>
                          <Input
                            type="text"
                            name="neighborhood"
                            value={formData.neighborhood}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup className="mb-3">
                          <Label>Cidade</Label>
                          <Input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup className="mb-3">
                          <Label>Estado</Label>
                          <Input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <h5 className="font-size-14 mb-3 mt-4">Dados de Acesso</h5>
                    <Row>
                      <Col md={6}>
                        <FormGroup className="mb-3">
                          <Label>Senha</Label>
                          <Input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup className="mb-3">
                          <Label>Confirmar Senha</Label>
                          <Input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <div className="d-flex flex-wrap gap-2">
                      <Button type="submit" color="primary" disabled={loading}>
                        {loading ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Salvando...
                          </>
                        ) : (
                          "Salvar"
                        )}
                      </Button>
                      <Button
                        type="button"
                        color="secondary"
                        onClick={() => navigate("/administrators")}
                        disabled={loading}
                      >
                        Cancelar
                      </Button>
                    </div>

                    {error && (
                      <div className="alert alert-danger mt-3">{error}</div>
                    )}
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

export default AddAdministrator;
