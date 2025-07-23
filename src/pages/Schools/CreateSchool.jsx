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
} from "reactstrap";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import useSchools from "../../hooks/useSchools";
import axios from "axios";
import InputMask from "react-input-mask";

const CreateSchool = () => {
  const navigate = useNavigate();

  const { createSchool, loading } = useSchools();

  const [formData, setFormData] = useState({
    name: "",
    cnpj: "",
    addressInfo: {
      address: "",
      city: "",
      complement: "",
      neighborhood: "",
      number: "",
      state: "",
      zipCode: "",
    },
    contactInfo: {
      email: "",
      phone: "",
      website: "",
      whatsapp: "",
    },
    responsibles: [],
    segments: [],
    status: "active",
  });

  const educationLevels = [
    { value: "Educação Infantil", label: "Educação Infantil" },
    { value: "Ensino Fundamental I", label: "Ensino Fundamental I" },
    { value: "Ensino Fundamental II", label: "Ensino Fundamental II" },
    { value: "Ensino Médio", label: "Ensino Médio" },
  ];

  const estadosBrasileiros = [
    { value: "AC", label: "Acre (AC)" },
    { value: "AL", label: "Alagoas (AL)" },
    { value: "AP", label: "Amapá (AP)" },
    { value: "AM", label: "Amazonas (AM)" },
    { value: "BA", label: "Bahia (BA)" },
    { value: "CE", label: "Ceará (CE)" },
    { value: "DF", label: "Distrito Federal (DF)" },
    { value: "ES", label: "Espírito Santo (ES)" },
    { value: "GO", label: "Goiás (GO)" },
    { value: "MA", label: "Maranhão (MA)" },
    { value: "MT", label: "Mato Grosso (MT)" },
    { value: "MS", label: "Mato Grosso do Sul (MS)" },
    { value: "MG", label: "Minas Gerais (MG)" },
    { value: "PA", label: "Pará (PA)" },
    { value: "PB", label: "Paraíba (PB)" },
    { value: "PR", label: "Paraná (PR)" },
    { value: "PE", label: "Pernambuco (PE)" },
    { value: "PI", label: "Piauí (PI)" },
    { value: "RJ", label: "Rio de Janeiro (RJ)" },
    { value: "RN", label: "Rio Grande do Norte (RN)" },
    { value: "RS", label: "Rio Grande do Sul (RS)" },
    { value: "RO", label: "Rondônia (RO)" },
    { value: "RR", label: "Roraima (RR)" },
    { value: "SC", label: "Santa Catarina (SC)" },
    { value: "SP", label: "São Paulo (SP)" },
    { value: "SE", label: "Sergipe (SE)" },
    { value: "TO", label: "Tocantins (TO)" },
  ];

  const handleAddResponsible = () => {
    setFormData({
      ...formData,
      responsibles: [
        ...formData.responsibles,
        { name: "", role: "", email: "", phone: "", cpf: "" },
      ],
    });
  };

  const handleRemoveResponsible = (index) => {
    const updatedResponsibles = formData.responsibles.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, responsibles: updatedResponsibles });
  };

  const handleCepChange = async (e) => {
    const cep = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    setFormData({
      ...formData,
      addressInfo: {
        ...formData.addressInfo,
        zipCode: e.target.value,
      },
    });

    if (cep.length === 8) {
      try {
        const response = await axios.get(
          `https://viacep.com.br/ws/${cep}/json/`
        );
        const { logradouro, bairro, localidade, uf } = response.data;

        setFormData({
          ...formData,
          addressInfo: {
            ...formData.addressInfo,
            address: logradouro || "",
            neighborhood: bairro || "",
            city: localidade || "",
            state: uf || "",
            zipCode: cep,
          },
        });
      } catch (error) {
        alert("Erro ao buscar o CEP. Verifique se o CEP é válido.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação básica
    if (!formData.name || !formData.cnpj) {
      alert("Por favor, preencha os campos obrigatórios: Nome e CNPJ.");
      return;
    }

    try {
      const result = await createSchool(formData);
      alert(`Escola criada com sucesso! ID: ${result.id}`);
      navigate("/schools"); // Redireciona para a lista de escolas
    } catch (err) {
      alert(`Erro ao criar escola: ${err.message}`);
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col xl={12}>
          <Card>
            <CardBody>
              <div className="d-flex align-items-center mb-4">
                <h4 className="card-title flex-grow-1 mb-0">Criar Escola</h4>
              </div>

              <Form onSubmit={handleSubmit}>
                {/* Dados Básicos */}
                <Row className="border-bottom pb-3 mb-4">
                  <Col lg={12}>
                    <h5 className="font-size-15 mb-3">Dados Básicos</h5>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="schoolName">Nome da Escola</Label>
                      <Input
                        type="text"
                        id="schoolName"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="cnpj">CNPJ</Label>
                      <Input
                        type="text"
                        id="cnpj"
                        value={formData.cnpj}
                        onChange={(e) =>
                          setFormData({ ...formData, cnpj: e.target.value })
                        }
                      />
                    </FormGroup>
                  </Col>
                </Row>

                {/* Endereço */}
                <Row className="border-bottom pb-3 mb-4">
                  <Col lg={12}>
                    <h5 className="font-size-15 mb-3">Endereço</h5>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label for="zipCode">CEP</Label>
                      <InputMask
                        mask="99999-999"
                        id="zipCode"
                        value={formData.addressInfo.zipCode}
                        onChange={handleCepChange}
                      >
                        {(inputProps) => <Input {...inputProps} type="text" />}
                      </InputMask>
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label for="state">Estado</Label>
                      <Select
                        id="state"
                        options={estadosBrasileiros}
                        value={estadosBrasileiros.find(
                          (estado) =>
                            estado.value === formData.addressInfo.state
                        )}
                        onChange={(selectedOption) =>
                          setFormData({
                            ...formData,
                            addressInfo: {
                              ...formData.addressInfo,
                              state: selectedOption.value,
                            },
                          })
                        }
                        placeholder="Selecione o estado"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="city">Cidade</Label>
                      <Input
                        type="text"
                        id="city"
                        value={formData.addressInfo.city}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            addressInfo: {
                              ...formData.addressInfo,
                              city: e.target.value,
                            },
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="neighborhood">Bairro</Label>
                      <Input
                        type="text"
                        id="neighborhood"
                        value={formData.addressInfo.neighborhood}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            addressInfo: {
                              ...formData.addressInfo,
                              neighborhood: e.target.value,
                            },
                          })
                        }
                      />
                    </FormGroup>
                  </Col>

                  <Col md={6}>
                    <FormGroup>
                      <Label for="address">Rua</Label>
                      <Input
                        type="text"
                        id="address"
                        value={formData.addressInfo.address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            addressInfo: {
                              ...formData.addressInfo,
                              address: e.target.value,
                            },
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label for="number">Número</Label>
                      <Input
                        type="text"
                        id="number"
                        value={formData.addressInfo.number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            addressInfo: {
                              ...formData.addressInfo,
                              number: e.target.value,
                            },
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="complement">Complemento</Label>
                      <Input
                        type="text"
                        id="complement"
                        value={formData.addressInfo.complement}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            addressInfo: {
                              ...formData.addressInfo,
                              complement: e.target.value,
                            },
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                </Row>

                {/* Contato */}
                <Row className="border-bottom pb-3 mb-4">
                  <Col lg={12}>
                    <h5 className="font-size-15 mb-3">Contato</h5>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="email">Email</Label>
                      <Input
                        type="email"
                        id="email"
                        value={formData.contactInfo.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactInfo: {
                              ...formData.contactInfo,
                              email: e.target.value,
                            },
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="phone">Telefone</Label>
                      <Input
                        type="text"
                        id="phone"
                        value={formData.contactInfo.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactInfo: {
                              ...formData.contactInfo,
                              phone: e.target.value,
                            },
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="whatsapp">WhatsApp</Label>
                      <Input
                        type="text"
                        id="whatsapp"
                        value={formData.contactInfo.whatsapp}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactInfo: {
                              ...formData.contactInfo,
                              whatsapp: e.target.value,
                            },
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="website">Website</Label>
                      <Input
                        type="text"
                        id="website"
                        value={formData.contactInfo.website}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactInfo: {
                              ...formData.contactInfo,
                              website: e.target.value,
                            },
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                </Row>

                {/* Níveis de Ensino */}
                <Row className="border-bottom pb-3 mb-4">
                  <Col lg={12}>
                    <h5 className="font-size-15 mb-3">Níveis de Ensino</h5>
                  </Col>
                  <Col lg={12}>
                    <Select
                      isMulti
                      options={educationLevels}
                      value={educationLevels.filter((level) =>
                        formData.segments.includes(level.value)
                      )}
                      onChange={(selectedOptions) => {
                        const updatedSegments = selectedOptions.map(
                          (option) => option.value
                        );
                        setFormData({ ...formData, segments: updatedSegments });
                      }}
                      placeholder="Selecione os níveis de ensino"
                    />
                  </Col>
                </Row>

                {/* Responsáveis */}
                <Row className="border-bottom pb-3 mb-4">
                  <Col lg={12}>
                    <h5 className="font-size-15 mb-3">Responsáveis</h5>
                  </Col>
                  <Col lg={12}>
                    {formData.responsibles.map((responsible, index) => (
                      <Row key={index} className="mb-3">
                        <Col md={3}>
                          <FormGroup>
                            <Label>Nome</Label>
                            <Input
                              type="text"
                              value={responsible.name}
                              onChange={(e) => {
                                const updatedResponsibles = [
                                  ...formData.responsibles,
                                ];
                                updatedResponsibles[index].name =
                                  e.target.value;
                                setFormData({
                                  ...formData,
                                  responsibles: updatedResponsibles,
                                });
                              }}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          <FormGroup>
                            <Label>Cargo</Label>
                            <Input
                              type="text"
                              value={responsible.role}
                              onChange={(e) => {
                                const updatedResponsibles = [
                                  ...formData.responsibles,
                                ];
                                updatedResponsibles[index].role =
                                  e.target.value;
                                setFormData({
                                  ...formData,
                                  responsibles: updatedResponsibles,
                                });
                              }}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          <FormGroup>
                            <Label>Email</Label>
                            <Input
                              type="email"
                              value={responsible.email}
                              onChange={(e) => {
                                const updatedResponsibles = [
                                  ...formData.responsibles,
                                ];
                                updatedResponsibles[index].email =
                                  e.target.value;
                                setFormData({
                                  ...formData,
                                  responsibles: updatedResponsibles,
                                });
                              }}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          <FormGroup>
                            <Label>Telefone</Label>
                            <Input
                              type="text"
                              value={responsible.phone}
                              onChange={(e) => {
                                const updatedResponsibles = [
                                  ...formData.responsibles,
                                ];
                                updatedResponsibles[index].phone =
                                  e.target.value;
                                setFormData({
                                  ...formData,
                                  responsibles: updatedResponsibles,
                                });
                              }}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          <FormGroup>
                            <Label>CPF</Label>
                            <Input
                              type="text"
                              value={responsible.cpf}
                              onChange={(e) => {
                                const updatedResponsibles = [
                                  ...formData.responsibles,
                                ];
                                updatedResponsibles[index].cpf = e.target.value;
                                setFormData({
                                  ...formData,
                                  responsibles: updatedResponsibles,
                                });
                              }}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={1} className="d-flex align-items-end">
                          <Button
                            color="danger"
                            className="mb-3"
                            onClick={() => handleRemoveResponsible(index)}
                          >
                            <i className="bx bx-trash"></i>
                          </Button>
                        </Col>
                      </Row>
                    ))}
                    <Button color="success" onClick={handleAddResponsible}>
                      Adicionar Responsável
                    </Button>
                  </Col>
                </Row>

                <div className="text-end mt-4">
                  <Button
                    type="button"
                    color="secondary"
                    className="me-2"
                    //onClick={navigate(-1)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" color="primary">
                    Criar Escola
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default CreateSchool;
