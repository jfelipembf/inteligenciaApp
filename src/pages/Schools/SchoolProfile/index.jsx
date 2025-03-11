import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
} from "reactstrap";
import { useParams, Routes, Route } from "react-router-dom";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import classnames from "classnames";
import profileImg from "../../../assets/images/profile-img.png";
import StudentProfile from "./StudentProfile";

// Componentes das abas
import SchoolInfo from "./SchoolInfo";
import Students from "./Students";
import Staff from "./Staff";
import Settings from "./Settings";
import Messages from "./Messages";
import Financeiro from "./Financeiro";

const SchoolProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("1");

  // Dados fictícios da escola
  const schoolData = {
    name: "Colégio Exemplo",
    email: "contato@colegioexemplo.com.br",
    phone: "(79) 3241-1234",
    whatsapp: "(79) 99999-8888",
    logo: null,
    // ... outros dados da escola
  };

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Routes>
            <Route path="/students/:id" element={<StudentProfile />} />
            <Route path="/" element={
              <>
                <Breadcrumb title="Escolas" breadcrumbItem={schoolData.name} />
                
                <Row>
                  <Col lg={12}>
                    <Card className="overflow-hidden">
                      <div className="bg-primary-subtle">
                        <Row>
                          <Col xs="7">
                            <div className="text-primary p-3">
                              <h5 className="text-primary">{schoolData.name}</h5>
                              <p className="mb-1">{schoolData.email}</p>
                            </div>
                          </Col>
                          <Col xs="5" className="align-self-end">
                            <img src={profileImg} alt="" className="img-fluid" />
                          </Col>
                        </Row>
                      </div>
                      <CardBody className="pt-0">
                        <Row className="align-items-center">
                          <Col sm="2">
                            <div className="avatar-xl profile-user-wid mb-4">
                              {schoolData.logo ? (
                                <img
                                  src={schoolData.logo}
                                  alt=""
                                  className="img-thumbnail rounded-circle"
                                />
                              ) : (
                                <div className="avatar-xl rounded-circle bg-light d-flex align-items-center justify-content-center">
                                  <i className="bx bx-camera font-size-24 text-body"></i>
                                </div>
                              )}
                            </div>
                          </Col>

                          <Col sm="6" className="ms-n12 ps-0">
                            <div style={{ marginLeft: "-40px" }}>
                              <h5 className="font-size-16">{schoolData.name}</h5>
                              <p className="text-muted mb-0">{schoolData.email}</p>
                            </div>
                          </Col>

                          <Col sm="4" className="text-end pe-1">
                            <div>
                              <div className="d-flex gap-2 justify-content-end">
                                <Button
                                  color="success"
                                  className="rounded-circle d-flex align-items-center justify-content-center"
                                  title="WhatsApp"
                                  style={{ width: '38px', height: '38px' }}
                                  onClick={() => {
                                    window.open(`https://wa.me/55${schoolData.whatsapp.replace(/\D/g, '')}`, '_blank');
                                  }}
                                >
                                  <i className="bx bxl-whatsapp font-size-16"></i>
                                </Button>
                                <Button
                                  color="info"
                                  className="rounded-circle d-flex align-items-center justify-content-center"
                                  title="Email"
                                  style={{ width: '38px', height: '38px' }}
                                  onClick={() => {
                                    window.location.href = `mailto:${schoolData.email}`;
                                  }}
                                >
                                  <i className="bx bx-envelope font-size-16"></i>
                                </Button>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>

                <Row>
                  <Col lg={12}>
                    <Card>
                      <CardBody>
                        <Nav tabs className="nav-tabs-custom nav-justified">
                          <NavItem>
                            <NavLink
                              className={classnames({ active: activeTab === "1" })}
                              onClick={() => toggleTab("1")}
                            >
                              <span className="d-block d-sm-none"><i className="fas fa-info-circle"></i></span>
                              <span className="d-none d-sm-block">
                                <i className="bx bx-info-circle me-1"></i> Informações
                              </span>
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames({ active: activeTab === "2" })}
                              onClick={() => toggleTab("2")}
                            >
                              <span className="d-block d-sm-none"><i className="fas fa-users"></i></span>
                              <span className="d-none d-sm-block">
                                <i className="bx bx-user-circle me-1"></i> Alunos
                              </span>
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames({ active: activeTab === "3" })}
                              onClick={() => toggleTab("3")}
                            >
                              <span className="d-block d-sm-none"><i className="fas fa-user-tie"></i></span>
                              <span className="d-none d-sm-block">
                                <i className="bx bx-briefcase me-1"></i> Colaboradores
                              </span>
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames({ active: activeTab === "4" })}
                              onClick={() => toggleTab("4")}
                            >
                              <span className="d-block d-sm-none"><i className="fas fa-cog"></i></span>
                              <span className="d-none d-sm-block">
                                <i className="bx bx-cog me-1"></i> Configurações
                              </span>
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames({ active: activeTab === "5" })}
                              onClick={() => toggleTab("5")}
                            >
                              <span className="d-block d-sm-none"><i className="fas fa-envelope"></i></span>
                              <span className="d-none d-sm-block">
                                <i className="bx bx-message-dots me-1"></i> Mensagens
                              </span>
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames({ active: activeTab === "6" })}
                              onClick={() => toggleTab("6")}
                            >
                              <span className="d-block d-sm-none"><i className="fas fa-dollar-sign"></i></span>
                              <span className="d-none d-sm-block">
                                <i className="bx bx-money me-1"></i> Financeiro
                              </span>
                            </NavLink>
                          </NavItem>
                        </Nav>

                        <TabContent activeTab={activeTab} className="p-3">
                          <TabPane tabId="1">
                            <SchoolInfo school={schoolData} />
                          </TabPane>
                          <TabPane tabId="2">
                            <Students />
                          </TabPane>
                          <TabPane tabId="3">
                            <Staff />
                          </TabPane>
                          <TabPane tabId="4">
                            <Settings school={schoolData} />
                          </TabPane>
                          <TabPane tabId="5">
                            <Messages />
                          </TabPane>
                          <TabPane tabId="6">
                            <Financeiro />
                          </TabPane>
                        </TabContent>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </>
            } />
          </Routes>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default SchoolProfile; 