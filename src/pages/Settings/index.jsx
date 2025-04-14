import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Alert,
  FormText,
  InputGroup,
  Table,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import { Link } from "react-router-dom";
import classnames from "classnames";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Dropzone from "react-dropzone";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Componentes
import SchoolYears from "./components/SchoolYears";
import ClassIdentifiers from "./components/ClassIdentifiers";
import EvaluationUnits from "./components/EvaluationUnits";
import RecoveryTypes from "./components/RecoveryTypes";
import AcademicSettings from "./components/AcademicSettings";
import EducationLevels from "./components/EducationLevels";

// Dados de exemplo para a escola
const SAMPLE_SCHOOL_DATA = {
  name: "Colégio Modelo",
  slogan: "Educando para o futuro",
  cnpj: "12.345.678/0001-90",
  ie: "123456789",
  foundedAt: "2010-03-15",
  address: {
    street: "Av. Principal",
    number: "1500",
    complement: "Bloco A",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zipCode: "01001-000",
  },
  contact: {
    phone: "(11) 3333-4444",
    secondaryPhone: "(11) 99999-8888",
    email: "contato@colegio-modelo.edu.br",
    website: "www.colegio-modelo.edu.br",
  },
  socialMedia: {
    facebook: "facebook.com/colegio-modelo",
    instagram: "instagram.com/colegio_modelo",
    youtube: "youtube.com/colegio-modelo",
    linkedin: "linkedin.com/company/colegio-modelo",
  },
  owners: [
    {
      name: "João Silva",
      role: "Diretor Geral",
      phone: "(11) 99999-1111",
      email: "joao.silva@colegio-modelo.edu.br",
    },
    {
      name: "Maria Oliveira",
      role: "Diretora Pedagógica",
      phone: "(11) 99999-2222",
      email: "maria.oliveira@colegio-modelo.edu.br",
    },
  ],
  logo: null,
  about: "O Colégio Modelo é uma instituição de ensino comprometida com a excelência educacional e a formação integral dos alunos. Fundado em 2010, o colégio oferece educação infantil, ensino fundamental e médio, com uma proposta pedagógica inovadora e professores altamente qualificados.",
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [editingTabs, setEditingTabs] = useState({});
  const [isSaving, setIsSaving] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [schoolData, setSchoolData] = useState(SAMPLE_SCHOOL_DATA);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    // Aqui seria feita a chamada para a API para buscar os dados da escola
    // Por enquanto, usamos os dados de exemplo
    document.title = "Configurações da Escola | " + schoolData.name;
  }, [schoolData.name]);

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const handleInputChange = (e, section = null, subsection = null) => {
    const { name, value } = e.target;
    
    if (section && subsection) {
      // Para campos aninhados como address.street
      setSchoolData({
        ...schoolData,
        [section]: {
          ...schoolData[section],
          [subsection]: {
            ...schoolData[section][subsection],
            [name]: value
          }
        }
      });
    } else if (section) {
      // Para campos aninhados como address.street
      setSchoolData({
        ...schoolData,
        [section]: {
          ...schoolData[section],
          [name]: value
        }
      });
    } else {
      // Para campos simples como name
      setSchoolData({
        ...schoolData,
        [name]: value
      });
    }
  };

  const handleOwnerChange = (index, field, value) => {
    const updatedOwners = [...schoolData.owners];
    updatedOwners[index] = {
      ...updatedOwners[index],
      [field]: value
    };
    
    setSchoolData({
      ...schoolData,
      owners: updatedOwners
    });
  };

  const addOwner = () => {
    const newOwner = {
      name: "",
      role: "",
      phone: "",
      email: ""
    };
    
    setSchoolData({
      ...schoolData,
      owners: [...schoolData.owners, newOwner]
    });
  };

  const removeOwner = (index) => {
    const updatedOwners = [...schoolData.owners];
    updatedOwners.splice(index, 1);
    
    setSchoolData({
      ...schoolData,
      owners: updatedOwners
    });
  };

  const handleLogoUpload = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setLogoFile(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      toast.success("Logo carregado com sucesso!");
    }
  };

  const toggleEditMode = (tabId) => {
    setEditingTabs(prev => ({
      ...prev,
      [tabId]: !prev[tabId]
    }));
  };

  const handleSubmit = (tabId) => {
    setIsSaving(prev => ({
      ...prev,
      [tabId]: true
    }));
    
    // Simulação de envio para a API
    setTimeout(() => {
      setIsSaving(prev => ({
        ...prev,
        [tabId]: false
      }));
      
      setEditingTabs(prev => ({
        ...prev,
        [tabId]: false
      }));
      
      setSuccessMessage(`Configurações da aba ${tabId} salvas com sucesso!`);
      
      // Limpar mensagem de sucesso após 5 segundos
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      
      toast.success("Configurações atualizadas com sucesso!");
    }, 1500);
  };

  const handleCancel = (tabId) => {
    setEditingTabs(prev => ({
      ...prev,
      [tabId]: false
    }));
    
    // Restaurar dados originais (simplificado para este exemplo)
    if (tabId === "5" && logoPreview) {
      setLogoPreview(null);
      setLogoFile(null);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb */}
          <Breadcrumbs
            title="Configurações"
            breadcrumbItem="Configurações da Escola"
          />

          {/* Mensagem de sucesso */}
          {successMessage && (
            <Alert color="success" className="mb-4">
              {successMessage}
            </Alert>
          )}

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="d-flex align-items-center mb-4">
                    <h4 className="card-title mb-0 flex-grow-1">Configurações da Escola</h4>
                  </div>

                  <Nav tabs className="nav-tabs-custom">
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "1" })}
                        onClick={() => toggleTab("1")}
                      >
                        <i className="bx bx-building-house me-1"></i> Dados Gerais
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "2" })}
                        onClick={() => toggleTab("2")}
                      >
                        <i className="bx bx-map me-1"></i> Endereço
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "3" })}
                        onClick={() => toggleTab("3")}
                      >
                        <i className="bx bx-phone me-1"></i> Contatos
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "4" })}
                        onClick={() => toggleTab("4")}
                      >
                        <i className="bx bx-user-pin me-1"></i> Proprietários
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "5" })}
                        onClick={() => toggleTab("5")}
                      >
                        <i className="bx bx-image me-1"></i> Logo
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "6" })}
                        onClick={() => toggleTab("6")}
                      >
                        <i className="bx bx-cog me-1"></i> Acadêmico
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "7" })}
                        onClick={() => toggleTab("7")}
                      >
                        <i className="bx bx-graduation me-1"></i> Níveis de Ensino
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "8" })}
                        onClick={() => toggleTab("8")}
                      >
                        <i className="bx bx-calendar me-1"></i> Anos Escolares
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "9" })}
                        onClick={() => toggleTab("9")}
                      >
                        <i className="bx bx-book me-1"></i> Turmas
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "10" })}
                        onClick={() => toggleTab("10")}
                      >
                        <i className="bx bx-task me-1"></i> Unidades de Avaliação
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "11" })}
                        onClick={() => toggleTab("11")}
                      >
                        <i className="bx bx-refresh me-1"></i> Recuperações
                      </NavLink>
                    </NavItem>
                  </Nav>

                  <TabContent activeTab={activeTab} className="p-3 text-muted">
                    {/* Tab 1: Dados Gerais */}
                    <TabPane tabId="1">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="card-title mb-0">Dados Gerais da Escola</h5>
                        <div>
                          {!editingTabs["1"] ? (
                            <Button
                              color="primary"
                              size="sm"
                              onClick={() => toggleEditMode("1")}
                            >
                              <i className="bx bx-edit-alt me-1"></i> Editar
                            </Button>
                          ) : (
                            <div className="d-flex gap-2">
                              <Button
                                color="light"
                                size="sm"
                                onClick={() => handleCancel("1")}
                              >
                                Cancelar
                              </Button>
                              <Button
                                color="primary"
                                size="sm"
                                onClick={() => handleSubmit("1")}
                                disabled={isSaving["1"]}
                              >
                                {isSaving["1"] ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    Salvando...
                                  </>
                                ) : (
                                  <>
                                    <i className="bx bx-save me-1"></i> Salvar
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      <Form>
                        <Row>
                          <Col md={6}>
                            <FormGroup>
                              <Label for="name">Nome da Escola</Label>
                              <Input
                                type="text"
                                name="name"
                                id="name"
                                value={schoolData.name}
                                onChange={(e) => handleInputChange(e)}
                                disabled={!editingTabs["1"]}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={6}>
                            <FormGroup>
                              <Label for="slogan">Lema da Escola</Label>
                              <Input
                                type="text"
                                name="slogan"
                                id="slogan"
                                value={schoolData.slogan}
                                onChange={(e) => handleInputChange(e)}
                                disabled={!editingTabs["1"]}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={4}>
                            <FormGroup>
                              <Label for="cnpj">CNPJ</Label>
                              <Input
                                type="text"
                                name="cnpj"
                                id="cnpj"
                                value={schoolData.cnpj}
                                onChange={(e) => handleInputChange(e)}
                                disabled={!editingTabs["1"]}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup>
                              <Label for="ie">Inscrição Estadual</Label>
                              <Input
                                type="text"
                                name="ie"
                                id="ie"
                                value={schoolData.ie}
                                onChange={(e) => handleInputChange(e)}
                                disabled={!editingTabs["1"]}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup>
                              <Label for="foundedAt">Data de Fundação</Label>
                              <Input
                                type="date"
                                name="foundedAt"
                                id="foundedAt"
                                value={schoolData.foundedAt}
                                onChange={(e) => handleInputChange(e)}
                                disabled={!editingTabs["1"]}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={12}>
                            <FormGroup>
                              <Label for="about">Sobre a Escola</Label>
                              <Input
                                type="textarea"
                                name="about"
                                id="about"
                                rows="5"
                                value={schoolData.about}
                                onChange={(e) => handleInputChange(e)}
                                disabled={!editingTabs["1"]}
                              />
                              <FormText color="muted">
                                Descreva a história, missão, visão e valores da escola.
                              </FormText>
                            </FormGroup>
                          </Col>
                        </Row>
                      </Form>
                    </TabPane>

                    {/* Tab 2: Endereço */}
                    <TabPane tabId="2">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="card-title mb-0">Endereço da Escola</h5>
                        <div>
                          {!editingTabs["2"] ? (
                            <Button
                              color="primary"
                              size="sm"
                              onClick={() => toggleEditMode("2")}
                            >
                              <i className="bx bx-edit-alt me-1"></i> Editar
                            </Button>
                          ) : (
                            <div className="d-flex gap-2">
                              <Button
                                color="light"
                                size="sm"
                                onClick={() => handleCancel("2")}
                              >
                                Cancelar
                              </Button>
                              <Button
                                color="primary"
                                size="sm"
                                onClick={() => handleSubmit("2")}
                                disabled={isSaving["2"]}
                              >
                                {isSaving["2"] ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    Salvando...
                                  </>
                                ) : (
                                  <>
                                    <i className="bx bx-save me-1"></i> Salvar
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      <Form>
                        <Row>
                          <Col md={6}>
                            <FormGroup>
                              <Label for="street">Rua/Avenida</Label>
                              <Input
                                type="text"
                                name="street"
                                id="street"
                                value={schoolData.address.street}
                                onChange={(e) => handleInputChange(e, "address")}
                                disabled={!editingTabs["2"]}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={2}>
                            <FormGroup>
                              <Label for="number">Número</Label>
                              <Input
                                type="text"
                                name="number"
                                id="number"
                                value={schoolData.address.number}
                                onChange={(e) => handleInputChange(e, "address")}
                                disabled={!editingTabs["2"]}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup>
                              <Label for="complement">Complemento</Label>
                              <Input
                                type="text"
                                name="complement"
                                id="complement"
                                value={schoolData.address.complement}
                                onChange={(e) => handleInputChange(e, "address")}
                                disabled={!editingTabs["2"]}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={4}>
                            <FormGroup>
                              <Label for="neighborhood">Bairro</Label>
                              <Input
                                type="text"
                                name="neighborhood"
                                id="neighborhood"
                                value={schoolData.address.neighborhood}
                                onChange={(e) => handleInputChange(e, "address")}
                                disabled={!editingTabs["2"]}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup>
                              <Label for="city">Cidade</Label>
                              <Input
                                type="text"
                                name="city"
                                id="city"
                                value={schoolData.address.city}
                                onChange={(e) => handleInputChange(e, "address")}
                                disabled={!editingTabs["2"]}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={2}>
                            <FormGroup>
                              <Label for="state">Estado</Label>
                              <Input
                                type="text"
                                name="state"
                                id="state"
                                value={schoolData.address.state}
                                onChange={(e) => handleInputChange(e, "address")}
                                disabled={!editingTabs["2"]}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={2}>
                            <FormGroup>
                              <Label for="zipCode">CEP</Label>
                              <Input
                                type="text"
                                name="zipCode"
                                id="zipCode"
                                value={schoolData.address.zipCode}
                                onChange={(e) => handleInputChange(e, "address")}
                                disabled={!editingTabs["2"]}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </Form>
                    </TabPane>

                    {/* Tab 3: Contatos */}
                    <TabPane tabId="3">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="card-title mb-0">Contatos da Escola</h5>
                        <div>
                          {!editingTabs["3"] ? (
                            <Button
                              color="primary"
                              size="sm"
                              onClick={() => toggleEditMode("3")}
                            >
                              <i className="bx bx-edit-alt me-1"></i> Editar
                            </Button>
                          ) : (
                            <div className="d-flex gap-2">
                              <Button
                                color="light"
                                size="sm"
                                onClick={() => handleCancel("3")}
                              >
                                Cancelar
                              </Button>
                              <Button
                                color="primary"
                                size="sm"
                                onClick={() => handleSubmit("3")}
                                disabled={isSaving["3"]}
                              >
                                {isSaving["3"] ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    Salvando...
                                  </>
                                ) : (
                                  <>
                                    <i className="bx bx-save me-1"></i> Salvar
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      <Form>
                        <Row>
                          <Col md={6}>
                            <FormGroup>
                              <Label for="phone">Telefone Principal</Label>
                              <Input
                                type="text"
                                name="phone"
                                id="phone"
                                value={schoolData.contact.phone}
                                onChange={(e) => handleInputChange(e, "contact")}
                                disabled={!editingTabs["3"]}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={6}>
                            <FormGroup>
                              <Label for="secondaryPhone">Telefone Secundário</Label>
                              <Input
                                type="text"
                                name="secondaryPhone"
                                id="secondaryPhone"
                                value={schoolData.contact.secondaryPhone}
                                onChange={(e) => handleInputChange(e, "contact")}
                                disabled={!editingTabs["3"]}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                            <FormGroup>
                              <Label for="email">E-mail</Label>
                              <Input
                                type="email"
                                name="email"
                                id="email"
                                value={schoolData.contact.email}
                                onChange={(e) => handleInputChange(e, "contact")}
                                disabled={!editingTabs["3"]}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={6}>
                            <FormGroup>
                              <Label for="website">Website</Label>
                              <Input
                                type="text"
                                name="website"
                                id="website"
                                value={schoolData.contact.website}
                                onChange={(e) => handleInputChange(e, "contact")}
                                disabled={!editingTabs["3"]}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <h5 className="mt-4 mb-3">Redes Sociais</h5>
                        <Row>
                          <Col md={6}>
                            <FormGroup>
                              <Label for="facebook">Facebook</Label>
                              <InputGroup>
                                <span className="input-group-text">facebook.com/</span>
                                <Input
                                  type="text"
                                  name="facebook"
                                  id="facebook"
                                  value={schoolData.socialMedia.facebook.replace("facebook.com/", "")}
                                  onChange={(e) => handleInputChange(e, "socialMedia")}
                                  disabled={!editingTabs["3"]}
                                />
                              </InputGroup>
                            </FormGroup>
                          </Col>
                          <Col md={6}>
                            <FormGroup>
                              <Label for="instagram">Instagram</Label>
                              <InputGroup>
                                <span className="input-group-text">instagram.com/</span>
                                <Input
                                  type="text"
                                  name="instagram"
                                  id="instagram"
                                  value={schoolData.socialMedia.instagram.replace("instagram.com/", "")}
                                  onChange={(e) => handleInputChange(e, "socialMedia")}
                                  disabled={!editingTabs["3"]}
                                />
                              </InputGroup>
                            </FormGroup>
                          </Col>
                        </Row>
                      </Form>
                    </TabPane>

                    {/* Tab 4: Proprietários */}
                    <TabPane tabId="4">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="card-title mb-0">Proprietários/Gestores</h5>
                        <div className="d-flex gap-2">
                          {!editingTabs["4"] ? (
                            <Button
                              color="primary"
                              size="sm"
                              onClick={() => toggleEditMode("4")}
                            >
                              <i className="bx bx-edit-alt me-1"></i> Editar
                            </Button>
                          ) : (
                            <>
                              <Button
                                color="primary"
                                size="sm"
                                onClick={addOwner}
                              >
                                <i className="bx bx-plus me-1"></i> Adicionar Proprietário
                              </Button>
                              <Button
                                color="light"
                                size="sm"
                                onClick={() => handleCancel("4")}
                              >
                                Cancelar
                              </Button>
                              <Button
                                color="primary"
                                size="sm"
                                onClick={() => handleSubmit("4")}
                                disabled={isSaving["4"]}
                              >
                                {isSaving["4"] ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    Salvando...
                                  </>
                                ) : (
                                  <>
                                    <i className="bx bx-save me-1"></i> Salvar
                                  </>
                                )}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {schoolData.owners.map((owner, index) => (
                        <Card key={index} className="mb-3 border">
                          <CardBody>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h6 className="mb-0">Proprietário {index + 1}</h6>
                              {editingTabs["4"] && (
                                <Button
                                  color="danger"
                                  size="sm"
                                  onClick={() => removeOwner(index)}
                                >
                                  <i className="bx bx-trash"></i>
                                </Button>
                              )}
                            </div>
                            <Row>
                              <Col md={6}>
                                <FormGroup>
                                  <Label>Nome</Label>
                                  <Input
                                    type="text"
                                    value={owner.name}
                                    onChange={(e) => handleOwnerChange(index, "name", e.target.value)}
                                    disabled={!editingTabs["4"]}
                                  />
                                </FormGroup>
                              </Col>
                              <Col md={6}>
                                <FormGroup>
                                  <Label>Cargo</Label>
                                  <Input
                                    type="text"
                                    value={owner.role}
                                    onChange={(e) => handleOwnerChange(index, "role", e.target.value)}
                                    disabled={!editingTabs["4"]}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col md={6}>
                                <FormGroup>
                                  <Label>Telefone</Label>
                                  <Input
                                    type="text"
                                    value={owner.phone}
                                    onChange={(e) => handleOwnerChange(index, "phone", e.target.value)}
                                    disabled={!editingTabs["4"]}
                                  />
                                </FormGroup>
                              </Col>
                              <Col md={6}>
                                <FormGroup>
                                  <Label>E-mail</Label>
                                  <Input
                                    type="email"
                                    value={owner.email}
                                    onChange={(e) => handleOwnerChange(index, "email", e.target.value)}
                                    disabled={!editingTabs["4"]}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      ))}
                      
                      {schoolData.owners.length === 0 && (
                        <div className="text-center p-4 border rounded">
                          <p className="mb-0 text-muted">Nenhum proprietário cadastrado.</p>
                        </div>
                      )}
                    </TabPane>

                    {/* Tab 5: Logo */}
                    <TabPane tabId="5">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="card-title mb-0">Logo da Escola</h5>
                        <div>
                          {!editingTabs["5"] ? (
                            <Button
                              color="primary"
                              size="sm"
                              onClick={() => toggleEditMode("5")}
                            >
                              <i className="bx bx-edit-alt me-1"></i> Editar
                            </Button>
                          ) : (
                            <div className="d-flex gap-2">
                              <Button
                                color="light"
                                size="sm"
                                onClick={() => handleCancel("5")}
                              >
                                Cancelar
                              </Button>
                              <Button
                                color="primary"
                                size="sm"
                                onClick={() => handleSubmit("5")}
                                disabled={isSaving["5"]}
                              >
                                {isSaving["5"] ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    Salvando...
                                  </>
                                ) : (
                                  <>
                                    <i className="bx bx-save me-1"></i> Salvar
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      <Row>
                        <Col md={6}>
                          <h5 className="mb-3">Logo da Escola</h5>
                          {editingTabs["5"] ? (
                            <Dropzone
                              onDrop={handleLogoUpload}
                              accept={{
                                'image/*': ['.jpeg', '.jpg', '.png', '.svg']
                              }}
                              multiple={false}
                            >
                              {({ getRootProps, getInputProps }) => (
                                <div
                                  {...getRootProps()}
                                  className="dropzone border rounded p-4 text-center cursor-pointer"
                                  style={{ cursor: "pointer" }}
                                >
                                  <input {...getInputProps()} />
                                  <div className="dropzone-content">
                                    <i className="bx bx-cloud-upload text-primary display-4"></i>
                                    <h5 className="mt-2">Arraste e solte o arquivo aqui</h5>
                                    <p className="text-muted">ou clique para selecionar um arquivo</p>
                                    <p className="text-muted small mb-0">
                                      Formatos aceitos: JPG, PNG, SVG. Tamanho máximo: 2MB.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </Dropzone>
                          ) : (
                            <div className="border rounded p-4 text-center">
                              {logoPreview || schoolData.logo ? (
                                <img
                                  src={logoPreview || schoolData.logo}
                                  alt="Logo da Escola"
                                  className="img-fluid"
                                  style={{ maxHeight: "200px" }}
                                />
                              ) : (
                                <div className="text-center p-4">
                                  <i className="bx bx-image-alt text-muted display-4"></i>
                                  <p className="mt-2 text-muted">Nenhuma logo cadastrada</p>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {logoPreview && (
                            <div className="mt-3 text-center">
                              <p className="mb-1">Preview da nova logo:</p>
                              <img
                                src={logoPreview}
                                alt="Preview da Logo"
                                className="img-thumbnail"
                                style={{ maxHeight: "150px" }}
                              />
                              {editingTabs["5"] && (
                                <Button
                                  color="danger"
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => {
                                    setLogoPreview(null);
                                    setLogoFile(null);
                                  }}
                                >
                                  <i className="bx bx-trash me-1"></i> Remover
                                </Button>
                              )}
                            </div>
                          )}
                        </Col>
                        <Col md={6}>
                          <h5 className="mb-3">Cores e Identidade Visual</h5>
                          <FormGroup>
                            <Label for="primaryColor">Cor Primária</Label>
                            <div className="d-flex align-items-center">
                              <Input
                                type="color"
                                id="primaryColor"
                                name="primaryColor"
                                value="#0d6efd"
                                disabled={!editingTabs["5"]}
                                style={{ width: "50px", height: "38px" }}
                              />
                              <Input
                                type="text"
                                value="#0d6efd"
                                disabled={!editingTabs["5"]}
                                className="ms-2"
                              />
                            </div>
                          </FormGroup>
                          <FormGroup>
                            <Label for="secondaryColor">Cor Secundária</Label>
                            <div className="d-flex align-items-center">
                              <Input
                                type="color"
                                id="secondaryColor"
                                name="secondaryColor"
                                value="#6c757d"
                                disabled={!editingTabs["5"]}
                                style={{ width: "50px", height: "38px" }}
                              />
                              <Input
                                type="text"
                                value="#6c757d"
                                disabled={!editingTabs["5"]}
                                className="ms-2"
                              />
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                    </TabPane>

                    {/* Tab 6: Configurações Acadêmicas */}
                    <TabPane tabId="6">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="card-title mb-0">Configurações Acadêmicas</h5>
                        <div>
                          {!editingTabs["6"] ? (
                            <Button
                              color="primary"
                              size="sm"
                              onClick={() => toggleEditMode("6")}
                            >
                              <i className="bx bx-edit-alt me-1"></i> Editar
                            </Button>
                          ) : (
                            <div className="d-flex gap-2">
                              <Button
                                color="light"
                                size="sm"
                                onClick={() => handleCancel("6")}
                              >
                                Cancelar
                              </Button>
                              <Button
                                color="primary"
                                size="sm"
                                onClick={() => handleSubmit("6")}
                                disabled={isSaving["6"]}
                              >
                                {isSaving["6"] ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    Salvando...
                                  </>
                                ) : (
                                  <>
                                    <i className="bx bx-save me-1"></i> Salvar
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      <AcademicSettings isEditing={editingTabs["6"]} />
                    </TabPane>

                    {/* Tab 7: Níveis de Ensino */}
                    <TabPane tabId="7">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="card-title mb-0">Níveis de Ensino</h5>
                        <div>
                          {!editingTabs["7"] ? (
                            <Button
                              color="primary"
                              size="sm"
                              onClick={() => toggleEditMode("7")}
                            >
                              <i className="bx bx-edit-alt me-1"></i> Editar
                            </Button>
                          ) : (
                            <div className="d-flex gap-2">
                              <Button
                                color="light"
                                size="sm"
                                onClick={() => handleCancel("7")}
                              >
                                Cancelar
                              </Button>
                              <Button
                                color="primary"
                                size="sm"
                                onClick={() => handleSubmit("7")}
                                disabled={isSaving["7"]}
                              >
                                {isSaving["7"] ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    Salvando...
                                  </>
                                ) : (
                                  <>
                                    <i className="bx bx-save me-1"></i> Salvar
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      <EducationLevels isEditing={editingTabs["7"]} />
                    </TabPane>

                    {/* Tab 8: Anos Escolares */}
                    <TabPane tabId="8">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="card-title mb-0">Anos Escolares</h5>
                        <div>
                          {!editingTabs["8"] ? (
                            <Button
                              color="primary"
                              size="sm"
                              onClick={() => toggleEditMode("8")}
                            >
                              <i className="bx bx-edit-alt me-1"></i> Editar
                            </Button>
                          ) : (
                            <div className="d-flex gap-2">
                              <Button
                                color="light"
                                size="sm"
                                onClick={() => handleCancel("8")}
                              >
                                Cancelar
                              </Button>
                              <Button
                                color="primary"
                                size="sm"
                                onClick={() => handleSubmit("8")}
                                disabled={isSaving["8"]}
                              >
                                {isSaving["8"] ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    Salvando...
                                  </>
                                ) : (
                                  <>
                                    <i className="bx bx-save me-1"></i> Salvar
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      <SchoolYears isEditing={editingTabs["8"]} />
                    </TabPane>

                    {/* Tab 9: Turmas */}
                    <TabPane tabId="9">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="card-title mb-0">Turmas</h5>
                        <div>
                          {!editingTabs["9"] ? (
                            <Button
                              color="primary"
                              size="sm"
                              onClick={() => toggleEditMode("9")}
                            >
                              <i className="bx bx-edit-alt me-1"></i> Editar
                            </Button>
                          ) : (
                            <div className="d-flex gap-2">
                              <Button
                                color="light"
                                size="sm"
                                onClick={() => handleCancel("9")}
                              >
                                Cancelar
                              </Button>
                              <Button
                                color="primary"
                                size="sm"
                                onClick={() => handleSubmit("9")}
                                disabled={isSaving["9"]}
                              >
                                {isSaving["9"] ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    Salvando...
                                  </>
                                ) : (
                                  <>
                                    <i className="bx bx-save me-1"></i> Salvar
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      <ClassIdentifiers isEditing={editingTabs["9"]} />
                    </TabPane>

                    {/* Tab 10: Unidades de Avaliação */}
                    <TabPane tabId="10">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="card-title mb-0">Unidades de Avaliação</h5>
                        <div>
                          {!editingTabs["10"] ? (
                            <Button
                              color="primary"
                              size="sm"
                              onClick={() => toggleEditMode("10")}
                            >
                              <i className="bx bx-edit-alt me-1"></i> Editar
                            </Button>
                          ) : (
                            <div className="d-flex gap-2">
                              <Button
                                color="light"
                                size="sm"
                                onClick={() => handleCancel("10")}
                              >
                                Cancelar
                              </Button>
                              <Button
                                color="primary"
                                size="sm"
                                onClick={() => handleSubmit("10")}
                                disabled={isSaving["10"]}
                              >
                                {isSaving["10"] ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    Salvando...
                                  </>
                                ) : (
                                  <>
                                    <i className="bx bx-save me-1"></i> Salvar
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      <EvaluationUnits isEditing={editingTabs["10"]} />
                    </TabPane>

                    {/* Tab 11: Recuperações */}
                    <TabPane tabId="11">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="card-title mb-0">Recuperações</h5>
                        <div>
                          {!editingTabs["11"] ? (
                            <Button
                              color="primary"
                              size="sm"
                              onClick={() => toggleEditMode("11")}
                            >
                              <i className="bx bx-edit-alt me-1"></i> Editar
                            </Button>
                          ) : (
                            <div className="d-flex gap-2">
                              <Button
                                color="light"
                                size="sm"
                                onClick={() => handleCancel("11")}
                              >
                                Cancelar
                              </Button>
                              <Button
                                color="primary"
                                size="sm"
                                onClick={() => handleSubmit("11")}
                                disabled={isSaving["11"]}
                              >
                                {isSaving["11"] ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    Salvando...
                                  </>
                                ) : (
                                  <>
                                    <i className="bx bx-save me-1"></i> Salvar
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      <RecoveryTypes isEditing={editingTabs["11"]} />
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Toast Container */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Settings;
