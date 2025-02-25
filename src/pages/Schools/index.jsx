import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Spinner,
  Table,
} from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { getFirebaseBackend } from "../../helpers/firebase_helper";
import TableContainer from "../../components/Common/TableContainer";
import { Link, useNavigate, useLocation } from "react-router-dom";
import classnames from "classnames";
import axios from "axios";

// Adicione estes estilos CSS no topo do arquivo
const checkboxStyle = {
  '.form-check-input:checked': {
    backgroundColor: '#556ee6',
    borderColor: '#556ee6'
  },
  '.form-check-input:focus': {
    borderColor: '#556ee6',
    boxShadow: '0 0 0 0.15rem rgba(85, 110, 230, 0.25)'
  }
};

const Schools = () => {
  document.title = "Escolas | InteliTec";
  const location = useLocation();
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newSchool, setNewSchool] = useState({
    logo: null,
    name: "",
    cnpj: "",
    startDate: "",
    plan: "",
    paymentMethod: "",
    zipCode: "",
    address: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    email: "",
    phone: "",
    whatsapp: "",
    website: "",
    responsibles: [
      {
        name: "",
        cpf: "",
        role: "",
      },
    ],
  });
  const [activeTab, setActiveTab] = useState("1");
  const [selectedSchools, setSelectedSchools] = useState([]);

  const isCreatingSchool = location.pathname === "/schools/new";

  useEffect(() => {
    if (!isCreatingSchool) {
      const fetchSchools = async () => {
        setLoading(true);
        try {
          const schoolsRef = await getFirebaseBackend().getSchools();
          console.log("Escolas recebidas:", schoolsRef);
          const schoolsWithIds = schoolsRef.map(school => ({
            ...school,
            id: school.id || school._id
          }));
          setSchools(schoolsWithIds);
        } catch (error) {
          console.error("Erro ao buscar escolas:", error);
        } finally {
          setTimeout(() => setLoading(false), 1000);
        }
      };

      fetchSchools();
    } else {
      setLoading(false);
    }
  }, [isCreatingSchool]);

  const toggle = () => setModal(!modal);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchool((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResponsibleChange = (index, field, value) => {
    const newResponsibles = [...newSchool.responsibles];
    newResponsibles[index] = {
      ...newResponsibles[index],
      [field]: value,
    };
    setNewSchool((prev) => ({
      ...prev,
      responsibles: newResponsibles,
    }));
  };

  const addResponsible = () => {
    setNewSchool((prev) => ({
      ...prev,
      responsibles: [...prev.responsibles, { name: "", cpf: "", role: "" }],
    }));
  };

  const removeResponsible = (index) => {
    setNewSchool((prev) => ({
      ...prev,
      responsibles: prev.responsibles.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Nova escola:", newSchool);
    navigate("/schools");
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const handleCepSearch = async (cep) => {
    if (cep.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (!response.data.erro) {
          setNewSchool((prev) => ({
            ...prev,
            address: response.data.logradouro,
            neighborhood: response.data.bairro,
            city: response.data.localidade,
            state: response.data.uf,
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  const handleSelectSchool = React.useCallback((schoolId) => {
    console.log('Tentando selecionar escola:', schoolId);
    console.log('Estado atual das seleções:', selectedSchools);
    
    setSelectedSchools(prev => {
      const isSelected = prev.includes(schoolId);
      console.log('Escola já está selecionada?', isSelected);
      
      const newSelection = isSelected 
        ? prev.filter(id => id !== schoolId)
        : [...prev, schoolId];
      
      console.log('Nova seleção:', newSelection);
      return newSelection;
    });
  }, []);

  const handleSelectAll = React.useCallback((checked) => {
    console.log('Seleção geral alterada:', checked);
    console.log('Total de escolas:', schools.length);
    
    if (checked) {
      const allIds = schools.map(school => school.id);
      console.log('IDs de todas as escolas:', allIds);
      setSelectedSchools(allIds);
    } else {
      setSelectedSchools([]);
    }
  }, [schools]);

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: () => {
          console.log('Renderizando header do checkbox');
          return (
            <div className="form-check">
              <Input
                type="checkbox"
                className="form-check-input"
                id="checkAll"
                checked={schools.length > 0 && selectedSchools.length === schools.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
              <Label className="form-check-label" htmlFor="checkAll"></Label>
            </div>
          );
        },
        cell: ({ row }) => {
          const schoolId = row.original.id;
          console.log('Renderizando checkbox para escola:', schoolId);
          console.log('Estado atual do checkbox:', selectedSchools.includes(schoolId));
          
          return (
            <div className="form-check">
              <Input
                type="checkbox"
                className="form-check-input"
                id={`check${schoolId}`}
                checked={selectedSchools.includes(schoolId)}
                onChange={() => handleSelectSchool(schoolId)}
              />
              <Label className="form-check-label" htmlFor={`check${schoolId}`}></Label>
            </div>
          );
        },
        size: 50,
      },
      {
        header: "Logo",
        accessorKey: "logo",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cellProps) => {
          const logo = cellProps.row.original.logo;
          return (
            <div className="avatar-xs">
              {logo ? (
                <img
                  src={logo}
                  alt=""
                  className="avatar-title rounded-circle"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.parentNode.innerHTML =
                      '<span class="avatar-title rounded-circle bg-light text-body"><i class="bx bx-camera font-size-16"></i></span>';
                  }}
                />
              ) : (
                <span className="avatar-title rounded-circle bg-light text-body">
                  <i className="bx bx-camera font-size-16"></i>
                </span>
              )}
            </div>
          );
        },
      },
      {
        header: "Nome da Escola",
        accessorKey: "name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          const schoolName = cellProps.row.original.name || "Nome não disponível";
          return (
            <div className="d-flex align-items-center">
              <div className="font-size-14 mb-1">
                <Link to="#" className="text-dark">
                  {schoolName}
                </Link>
              </div>
            </div>
          );
        },
      },
      {
        header: "CNPJ",
        accessorKey: "cnpj",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Cidade/UF",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          const addressInfo = cellProps.row.original.addressInfo;
          if (!addressInfo) return "-";
          return `${addressInfo.city}/${addressInfo.state}`;
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <Badge
              className={
                "font-size-11 badge-soft-" +
                (cellProps.value === "active" ? "success" : "danger")
              }
            >
              {cellProps.value === "active" ? "Ativo" : "Inativo"}
            </Badge>
          );
        },
      },
      {
        header: "Detalhes",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cellProps) => {
          const schoolId = cellProps.row.original.id;
          return (
            <Button
              type="button"
              color="primary"
              className="btn-sm"
              onClick={() => {
                navigate(`/schools/${schoolId}`);
              }}
            >
              Ver Detalhes
            </Button>
          );
        },
      },
    ],
    [schools.length, selectedSchools, handleSelectAll, handleSelectSchool, navigate]
  );

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "70vh",
            }}
          >
            <div className="text-center">
              <Spinner style={{ width: "3rem", height: "3rem" }} color="primary">
                Loading...
              </Spinner>
              <div className="mt-3">
                <p className="text-muted mb-0">Carregando dados...</p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (isCreatingSchool) {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <Breadcrumb title="InteliTec" breadcrumbItem="Nova Escola" />
            <Form>
              <Row>
                <Col lg={12}>
                  <Card>
                    <CardBody>
                      <Nav tabs className="nav-tabs-custom">
                        <NavItem>
                          <NavLink
                            className={classnames({ active: activeTab === "1" })}
                            onClick={() => toggleTab("1")}
                          >
                            <span className="d-block d-sm-none">
                              <i className="fas fa-home"></i>
                            </span>
                            <span className="d-none d-sm-block">Identificação</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({ active: activeTab === "2" })}
                            onClick={() => toggleTab("2")}
                          >
                            <span className="d-block d-sm-none">
                              <i className="far fa-user"></i>
                            </span>
                            <span className="d-none d-sm-block">Documentação</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({ active: activeTab === "3" })}
                            onClick={() => toggleTab("3")}
                          >
                            <span className="d-block d-sm-none">
                              <i className="far fa-envelope"></i>
                            </span>
                            <span className="d-none d-sm-block">Financeiro</span>
                          </NavLink>
                        </NavItem>
                      </Nav>
                      <TabContent activeTab={activeTab} className="p-3">
                        <TabPane tabId="1">
                          <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="card-title mb-0">Identificação</h4>
                          </div>
                          <div className="mb-4" style={{ maxWidth: "150px" }}>
                            <div className="position-relative d-inline-block">
                              <div
                                className="avatar-xl bg-light d-flex align-items-center justify-content-center"
                                style={{
                                  cursor: "pointer",
                                  width: "150px",
                                  height: "150px",
                                  borderRadius: "50%",
                                  border: "2px dashed #ccc",
                                }}
                              >
                                {newSchool.logo ? (
                                  <img
                                    src={newSchool.logo}
                                    alt=""
                                    className="img-fluid"
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      borderRadius: "50%",
                                      objectFit: "cover",
                                    }}
                                  />
                                ) : (
                                  <i className="bx bx-camera font-size-24 text-secondary"></i>
                                )}
                              </div>
                              <div
                                className="position-absolute bottom-0 end-0"
                                style={{ transform: "translate(10px, -10px)" }}
                              >
                                <Label for="logo-input" className="mb-0">
                                  <div
                                    className="avatar-xs rounded-circle bg-primary d-flex align-items-center justify-content-center"
                                    style={{
                                      width: "35px",
                                      height: "35px",
                                      cursor: "pointer",
                                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                    }}
                                  >
                                    <i className="bx bx-image-add font-size-16 text-white"></i>
                                  </div>
                                </Label>
                                <Input
                                  id="logo-input"
                                  type="file"
                                  className="d-none"
                                  accept="image/*"
                                  onChange={(e) => {
                                    // TODO: Implementar upload da logo
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <Row>
                            <Col md={6}>
                              <FormGroup className="mb-4">
                                <Label>Nome da Escola</Label>
                                <Input
                                  type="text"
                                  name="name"
                                  value={newSchool.name}
                                  onChange={handleInputChange}
                                  required
                                />
                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup className="mb-4">
                                <Label>CNPJ</Label>
                                <Input
                                  type="text"
                                  name="cnpj"
                                  value={newSchool.cnpj}
                                  onChange={handleInputChange}
                                  required
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={4}>
                              <FormGroup className="mb-4">
                                <Label>Data de Início</Label>
                                <Input
                                  type="date"
                                  name="startDate"
                                  value={newSchool.startDate}
                                  onChange={handleInputChange}
                                  required
                                />
                              </FormGroup>
                            </Col>
                            <Col md={4}>
                              <FormGroup className="mb-4">
                                <Label>Plano</Label>
                                <Input
                                  type="select"
                                  name="plan"
                                  value={newSchool.plan}
                                  onChange={handleInputChange}
                                  required
                                >
                                  <option value="">Selecione...</option>
                                  <option value="basic">Básico</option>
                                  <option value="standard">Padrão</option>
                                  <option value="premium">Premium</option>
                                </Input>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={3}>
                              <FormGroup className="mb-4">
                                <Label>CEP</Label>
                                <Input
                                  type="text"
                                  name="zipCode"
                                  value={newSchool.zipCode}
                                  onChange={(e) => {
                                    const cep = e.target.value.replace(/\D/g, "");
                                    handleInputChange({
                                      target: { name: "zipCode", value: cep },
                                    });
                                    if (cep.length === 8) {
                                      handleCepSearch(cep);
                                    }
                                  }}
                                  maxLength={8}
                                  required
                                />
                              </FormGroup>
                            </Col>
                            <Col md={7}>
                              <FormGroup className="mb-4">
                                <Label>Endereço</Label>
                                <Input
                                  type="text"
                                  name="address"
                                  value={newSchool.address}
                                  onChange={handleInputChange}
                                  required
                                />
                              </FormGroup>
                            </Col>
                            <Col md={2}>
                              <FormGroup className="mb-4">
                                <Label>Número</Label>
                                <Input
                                  type="text"
                                  name="number"
                                  value={newSchool.number}
                                  onChange={handleInputChange}
                                  required
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={4}>
                              <FormGroup className="mb-4">
                                <Label>Bairro</Label>
                                <Input
                                  type="text"
                                  name="neighborhood"
                                  value={newSchool.neighborhood}
                                  onChange={handleInputChange}
                                  required
                                />
                              </FormGroup>
                            </Col>
                            <Col md={4}>
                              <FormGroup className="mb-4">
                                <Label>Cidade</Label>
                                <Input
                                  type="text"
                                  name="city"
                                  value={newSchool.city}
                                  onChange={handleInputChange}
                                  required
                                />
                              </FormGroup>
                            </Col>
                            <Col md={4}>
                              <FormGroup className="mb-4">
                                <Label>Estado</Label>
                                <Input
                                  type="select"
                                  name="state"
                                  value={newSchool.state}
                                  onChange={handleInputChange}
                                  required
                                >
                                  <option value="">Selecione...</option>
                                  <option value="AC">Acre</option>
                                  <option value="AL">Alagoas</option>
                                  <option value="AP">Amapá</option>
                                  <option value="AM">Amazonas</option>
                                  <option value="BA">Bahia</option>
                                  <option value="CE">Ceará</option>
                                  <option value="DF">Distrito Federal</option>
                                  <option value="ES">Espírito Santo</option>
                                  <option value="GO">Goiás</option>
                                  <option value="MA">Maranhão</option>
                                  <option value="MT">Mato Grosso</option>
                                  <option value="MS">Mato Grosso do Sul</option>
                                  <option value="MG">Minas Gerais</option>
                                  <option value="PA">Pará</option>
                                  <option value="PB">Paraíba</option>
                                  <option value="PR">Paraná</option>
                                  <option value="PE">Pernambuco</option>
                                  <option value="PI">Piauí</option>
                                  <option value="RJ">Rio de Janeiro</option>
                                  <option value="RN">Rio Grande do Norte</option>
                                  <option value="RS">Rio Grande do Sul</option>
                                  <option value="RO">Rondônia</option>
                                  <option value="RR">Roraima</option>
                                  <option value="SC">Santa Catarina</option>
                                  <option value="SP">São Paulo</option>
                                  <option value="SE">Sergipe</option>
                                  <option value="TO">Tocantins</option>
                                </Input>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <FormGroup className="mb-4">
                                <Label>Email</Label>
                                <Input
                                  type="email"
                                  name="email"
                                  value={newSchool.email}
                                  onChange={handleInputChange}
                                  required
                                />
                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup className="mb-4">
                                <Label>Site</Label>
                                <Input
                                  type="url"
                                  name="website"
                                  value={newSchool.website}
                                  onChange={handleInputChange}
                                  placeholder="https://"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <FormGroup className="mb-4">
                                <Label>Telefone</Label>
                                <Input
                                  type="text"
                                  name="phone"
                                  value={newSchool.phone}
                                  onChange={handleInputChange}
                                  required
                                />
                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup className="mb-4">
                                <Label>WhatsApp</Label>
                                <Input
                                  type="text"
                                  name="whatsapp"
                                  value={newSchool.whatsapp}
                                  onChange={handleInputChange}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <div className="border-top pt-4 mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h5 className="font-size-14 mb-0">Responsáveis</h5>
                              <Button
                                type="button"
                                color="primary"
                                outline
                                size="sm"
                                onClick={() => {
                                  setNewSchool((prev) => ({
                                    ...prev,
                                    responsibles: [...prev.responsibles, { name: "", cpf: "", role: "" }],
                                  }));
                                }}
                              >
                                <i className="bx bx-plus me-1"></i> Adicionar Responsável
                              </Button>
                            </div>
                            {newSchool.responsibles.map((responsible, index) => (
                              <Row key={index} className="mb-3">
                                <Col md={4}>
                                  <FormGroup className="mb-0">
                                    <Label>Nome do Responsável {index + 1}</Label>
                                    <Input
                                      type="text"
                                      value={responsible.name}
                                      onChange={(e) => {
                                        const newResponsibles = [...newSchool.responsibles];
                                        newResponsibles[index] = {
                                          ...newResponsibles[index],
                                          name: e.target.value,
                                        };
                                        setNewSchool((prev) => ({
                                          ...prev,
                                          responsibles: newResponsibles,
                                        }));
                                      }}
                                      placeholder="Nome completo"
                                      required
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md={4}>
                                  <FormGroup className="mb-0">
                                    <Label>CPF</Label>
                                    <Input
                                      type="text"
                                      value={responsible.cpf}
                                      onChange={(e) => {
                                        const newResponsibles = [...newSchool.responsibles];
                                        newResponsibles[index] = {
                                          ...newResponsibles[index],
                                          cpf: e.target.value,
                                        };
                                        setNewSchool((prev) => ({
                                          ...prev,
                                          responsibles: newResponsibles,
                                        }));
                                      }}
                                      placeholder="000.000.000-00"
                                      required
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md={3}>
                                  <FormGroup className="mb-0">
                                    <Label>Cargo</Label>
                                    <Input
                                      type="text"
                                      value={responsible.role}
                                      onChange={(e) => {
                                        const newResponsibles = [...newSchool.responsibles];
                                        newResponsibles[index] = {
                                          ...newResponsibles[index],
                                          role: e.target.value,
                                        };
                                        setNewSchool((prev) => ({
                                          ...prev,
                                          responsibles: newResponsibles,
                                        }));
                                      }}
                                      placeholder="Ex: Diretor"
                                      required
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md={1} className="d-flex align-items-end">
                                  {index > 0 && (
                                    <Button
                                      type="button"
                                      color="danger"
                                      outline
                                      size="sm"
                                      onClick={() => {
                                        setNewSchool((prev) => ({
                                          ...prev,
                                          responsibles: prev.responsibles.filter((_, i) => i !== index),
                                        }));
                                      }}
                                      className="w-100"
                                    >
                                      <i className="bx bx-trash"></i>
                                    </Button>
                                  )}
                                </Col>
                              </Row>
                            ))}
                          </div>
                        </TabPane>
                        <TabPane tabId="2">
                          <div className="table-responsive">
                            <table className="table table-hover mb-0">
                              <thead>
                                <tr>
                                  <th>Documento</th>
                                  <th>Obrigatório</th>
                                  <th className="text-end">Ação</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Contrato Social</td>
                                  <td>
                                    <Badge color="danger">Sim</Badge>
                                  </td>
                                  <td className="text-end">
                                    <Button color="secondary" outline className="btn-sm">
                                      <i className="bx bx-upload me-1"></i> Upload
                                      <Input type="file" className="d-none" />
                                    </Button>
                                  </td>
                                </tr>
                                <tr>
                                  <td>Alvará de Funcionamento</td>
                                  <td>
                                    <Badge color="danger">Sim</Badge>
                                  </td>
                                  <td className="text-end">
                                    <Button color="secondary" outline className="btn-sm">
                                      <i className="bx bx-upload me-1"></i> Upload
                                      <Input type="file" className="d-none" />
                                    </Button>
                                  </td>
                                </tr>
                                <tr>
                                  <td>Certificado do Corpo de Bombeiros</td>
                                  <td>
                                    <Badge color="danger">Sim</Badge>
                                  </td>
                                  <td className="text-end">
                                    <Button color="secondary" outline className="btn-sm">
                                      <i className="bx bx-upload me-1"></i> Upload
                                      <Input type="file" className="d-none" />
                                    </Button>
                                  </td>
                                </tr>
                                <tr>
                                  <td>Licença Sanitária</td>
                                  <td>
                                    <Badge color="danger">Sim</Badge>
                                  </td>
                                  <td className="text-end">
                                    <Button color="secondary" outline className="btn-sm">
                                      <i className="bx bx-upload me-1"></i> Upload
                                      <Input type="file" className="d-none" />
                                    </Button>
                                  </td>
                                </tr>
                                <tr>
                                  <td>Outros Documentos</td>
                                  <td>
                                    <Badge color="warning">Não</Badge>
                                  </td>
                                  <td className="text-end">
                                    <Button color="secondary" outline className="btn-sm">
                                      <i className="bx bx-upload me-1"></i> Upload
                                      <Input type="file" className="d-none" multiple />
                                    </Button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </TabPane>
                        <TabPane tabId="3">
                          <h5 className="font-size-14 mb-4">Formas de Pagamento</h5>
                          <Row>
                            <Col md={4}>
                              <div className="form-check mb-3">
                                <Input type="checkbox" className="form-check-input" id="pix" />
                                <Label className="form-check-label" for="pix">
                                  PIX
                                </Label>
                              </div>
                              <FormGroup>
                                <Label>Chave PIX</Label>
                                <Input type="text" placeholder="Digite a chave PIX" />
                              </FormGroup>
                            </Col>
                            <Col md={4}>
                              <div className="form-check mb-3">
                                <Input type="checkbox" className="form-check-input" id="cartao" />
                                <Label className="form-check-label" for="cartao">
                                  Cartão de Crédito
                                </Label>
                              </div>
                              <FormGroup>
                                <Label>Gateway de Pagamento</Label>
                                <Input type="select">
                                  <option>Selecione...</option>
                                  <option>Stripe</option>
                                  <option>PagSeguro</option>
                                  <option>Mercado Pago</option>
                                </Input>
                              </FormGroup>
                            </Col>
                            <Col md={4}>
                              <div className="form-check mb-3">
                                <Input type="checkbox" className="form-check-input" id="boleto" />
                                <Label className="form-check-label" for="boleto">
                                  Boleto Bancário
                                </Label>
                              </div>
                              <FormGroup>
                                <Label>Banco</Label>
                                <Input type="select">
                                  <option>Selecione...</option>
                                  <option>Banco do Brasil</option>
                                  <option>Bradesco</option>
                                  <option>Itaú</option>
                                  <option>Santander</option>
                                </Input>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row className="mt-4">
                            <Col md={12}>
                              <h5 className="font-size-14 mb-3">Configurações de Pagamento</h5>
                            </Col>
                            <Col md={6}>
                              <FormGroup>
                                <Label>Dia de Vencimento</Label>
                                <Input type="number" min="1" max="31" placeholder="Dia do mês" />
                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup>
                                <Label>Multa por Atraso (%)</Label>
                                <Input type="number" step="0.01" placeholder="Ex: 2.00" />
                              </FormGroup>
                            </Col>
                          </Row>
                        </TabPane>
                      </TabContent>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="d-flex justify-content-end gap-2 mt-3 mb-4">
                    <Button color="secondary" onClick={() => setIsCreating(false)}>
                      <i className="bx bx-x me-1"></i> Cancelar
                    </Button>
                    <Button color="primary" onClick={handleSubmit}>
                      <i className="bx bx-check me-1"></i> Salvar
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Container>
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <style>
            {`
              .form-check-input:checked {
                background-color: #556ee6 !important;
                border-color: #556ee6 !important;
              }
              .form-check-input:focus {
                border-color: #556ee6;
                box-shadow: 0 0 0 0.15rem rgba(85, 110, 230, 0.25);
              }
            `}
          </style>
          <Breadcrumb title="InteliTec" breadcrumbItem="Escolas" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
                    <h5 className="card-title me-2">Escolas</h5>
                    {selectedSchools.length > 0 && (
                      <div className="d-flex align-items-center">
                        <span className="me-3">
                          {selectedSchools.length} escola(s) selecionada(s)
                        </span>
                        <Button color="primary" size="sm" className="me-2">
                          <i className="bx bx-export me-1"></i> Exportar
                        </Button>
                        <Button color="danger" size="sm">
                          <i className="bx bx-trash me-1"></i> Excluir
                        </Button>
                      </div>
                    )}
                  </div>
                  <TableContainer
                    columns={columns}
                    data={schools}
                    isGlobalFilter={true}
                    customPageSize={10}
                    className="custom-header-css"
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Schools;
