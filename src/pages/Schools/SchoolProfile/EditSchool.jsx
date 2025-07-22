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
import useSchools from "../../../hooks/useSchools";

const EditSchool = ({ schoolData, onCancel, schoolId }) => {
  const [formData, setFormData] = useState(schoolData);
  const { updateSchool, loading } = useSchools();

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
  const [newResponsible, setNewResponsible] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    cpf: "",
  });
  const [newGrade, setNewGrade] = useState("");
  const [newSubject, setNewSubject] = useState("");

  const handleAddResponsible = () => {
    if (newResponsible.name && newResponsible.role) {
      setFormData({
        ...formData,
        responsibles: [...formData.responsibles, newResponsible],
      });
      setNewResponsible({ name: "", role: "", email: "", phone: "", cpf: "" });
    }
  };

  const handleRemoveResponsible = (index) => {
    const updatedResponsibles = formData.responsibles.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, responsibles: updatedResponsibles });
  };

  const handleAddGrade = () => {
    if (newGrade) {
      setFormData({
        ...formData,
        grades: { ...(formData.grades || {}), [newGrade]: true },
      });
      setNewGrade("");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await updateSchool(schoolId, formData);

      alert("Escola atualizada com sucesso!");
      onCancel(); // Fechar o formulário ou redirecionar
    } catch (err) {
      alert("Erro ao atualizar a escola: " + err.message);
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col xl={12}>
          <Card>
            <CardBody>
              <div className="d-flex align-items-center mb-4">
                <h4 className="card-title flex-grow-1 mb-0">Editar Escola</h4>
              </div>

              <Form onSubmit={handleSave}>
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

                {/* Endereço Completo */}
                <Row className="border-bottom pb-3 mb-4">
                  <Col lg={12}>
                    <h5 className="font-size-15 mb-3">Endereço</h5>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="address">Logradouro</Label>
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
                  <Col md={2}>
                    <FormGroup>
                      <Label for="state">Estado</Label>
                      <Input
                        type="select"
                        id="state"
                        value={formData.addressInfo.state}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            addressInfo: {
                              ...formData.addressInfo,
                              state: e.target.value,
                            },
                          })
                        }
                      >
                        <option value="">Selecione</option>
                        {estadosBrasileiros.map((estado) => (
                          <option key={estado.value} value={estado.value}>
                            {estado.label}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label for="zipCode">CEP</Label>
                      <Input
                        type="text"
                        id="zipCode"
                        value={formData.addressInfo.zipCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            addressInfo: {
                              ...formData.addressInfo,
                              zipCode: e.target.value,
                            },
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                </Row>

                {/* Informações de Contato */}
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
                      <Label for="website">Website</Label>
                      <Input
                        type="url"
                        id="website"
                        value={formData.contactInfo.website || ""}
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
                </Row>

                {/* Séries Escolares */}
                <Row className="border-bottom pb-3 mb-4">
                  <Col lg={12}>
                    <h5 className="font-size-15 mb-3">Séries Escolares</h5>
                  </Col>
                  <Col lg={12}>
                    <div className="mb-3">
                      {Object.entries(formData.grades || {}).map(
                        ([grade, isActive]) => (
                          <FormGroup check inline key={grade}>
                            <Input
                              type="checkbox"
                              id={grade}
                              checked={isActive}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  grades: {
                                    ...(formData.grades || {}),
                                    [grade]: e.target.checked,
                                  },
                                })
                              }
                            />
                            <Label check for={grade}>
                              {grade}
                            </Label>
                          </FormGroup>
                        )
                      )}
                    </div>
                    <div className="d-flex gap-2 mb-3">
                      <Input
                        type="text"
                        placeholder="Nova série escolar"
                        value={newGrade}
                        onChange={(e) => setNewGrade(e.target.value)}
                      />
                      <Button color="primary" onClick={handleAddGrade}>
                        Adicionar
                      </Button>
                    </div>
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
                                updatedResponsibles[index] = {
                                  ...responsible,
                                  name: e.target.value,
                                };
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
                                updatedResponsibles[index] = {
                                  ...responsible,
                                  role: e.target.value,
                                };
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
                                updatedResponsibles[index] = {
                                  ...responsible,
                                  email: e.target.value,
                                };
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
                                updatedResponsibles[index] = {
                                  ...responsible,
                                  phone: e.target.value,
                                };
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
                                updatedResponsibles[index] = {
                                  ...responsible,
                                  cpf: e.target.value,
                                };
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

                    {/* Adicionar novo responsável */}
                    <Row className="mt-3">
                      <Col md={3}>
                        <FormGroup>
                          <Input
                            type="text"
                            placeholder="Nome"
                            value={newResponsible.name}
                            onChange={(e) =>
                              setNewResponsible({
                                ...newResponsible,
                                name: e.target.value,
                              })
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Input
                            type="text"
                            placeholder="Cargo"
                            value={newResponsible.role}
                            onChange={(e) =>
                              setNewResponsible({
                                ...newResponsible,
                                role: e.target.value,
                              })
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Input
                            type="email"
                            placeholder="Email"
                            value={newResponsible.email}
                            onChange={(e) =>
                              setNewResponsible({
                                ...newResponsible,
                                email: e.target.value,
                              })
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Input
                            type="text"
                            placeholder="Telefone"
                            value={newResponsible.phone}
                            onChange={(e) =>
                              setNewResponsible({
                                ...newResponsible,
                                phone: e.target.value,
                              })
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Input
                            type="text"
                            placeholder="CPF"
                            value={newResponsible.cpf}
                            onChange={(e) =>
                              setNewResponsible({
                                ...newResponsible,
                                cpf: e.target.value,
                              })
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col md={1}>
                        <Button color="success" onClick={handleAddResponsible}>
                          <i className="bx bx-plus"></i>
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                {/* Botões de ação */}
                <div className="text-end mt-4">
                  <Button
                    type="button"
                    color="secondary"
                    className="me-2"
                    onClick={onCancel}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" color="primary" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar Alterações"}
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

export default EditSchool;
