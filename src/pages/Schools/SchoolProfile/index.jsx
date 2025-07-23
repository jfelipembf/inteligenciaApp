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
import useSchools from "../../../hooks/useSchools";
import { useEffect } from "react";

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
  const [schoolData, setSchoolData] = useState({});
  const [error, setError] = useState(null); // Estado para erros
  const [loading, setLoading] = useState(true); // Estado para indicar carregamento
  const { fetchSchoolById, fetchSchoolLogo } = useSchools();
  const [logoUrl, setLogoUrl] = useState(null);
  const [loadingLogo, setLoadingLogo] = useState(true);

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const url = await fetchSchoolLogo(id);
        setLogoUrl(url);
      } catch (err) {
        console.error("Erro ao carregar a logo:", err);
      } finally {
        setLoadingLogo(false);
      }
    };

    loadLogo();
  }, [id, fetchSchoolLogo]);

  const getSchoolDetails = async (id) => {
    try {
      const schoolData = await fetchSchoolById(id);
      setSchoolData(schoolData); // Armazena os dados no estado
    } catch (err) {
      setError("Erro ao carregar os dados da escola.");
      console.error(err);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  useEffect(() => {
    if (id) {
      console.log("Chamando getSchoolDetails com ID:", id);
      getSchoolDetails(id);
    }
  }, [id]);

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  if (loadingLogo) {
    return <p>Carregando logo...</p>;
  }
  if (loading) {
    return <p>Carregando dados da escola...</p>;
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Routes>
            <Route path="/students/:id" element={<StudentProfile />} />
            <Route
              path="/"
              element={
                <>
                  <Breadcrumb
                    title="Escolas"
                    breadcrumbItem={schoolData.name}
                  />

                  <Row>
                    <Col lg={12}>
                      <Card className="overflow-hidden">
                        <div className="bg-primary-subtle">
                          <Row>
                            <Col xs="7">
                              <div className="text-primary p-3">
                                <h5 className="text-primary">
                                  {schoolData.name}
                                </h5>
                              </div>
                            </Col>
                            <Col xs="5" className="align-self-end">
                              <img
                                src={profileImg}
                                alt=""
                                className="img-fluid"
                              />
                            </Col>
                          </Row>
                        </div>
                        <CardBody className="pt-0">
                          <Row className="align-items-center">
                            <Col sm="2">
                              <div className="avatar-xl profile-user-wid mb-4">
                                {logoUrl ? (
                                  <img
                                    src={logoUrl}
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
                                <h5 className="font-size-16">
                                  {schoolData.name}
                                </h5>
                              </div>
                            </Col>

                            <Col sm="4" className="text-end pe-1">
                              <div>
                                <div className="d-flex gap-2 justify-content-end">
                                  <Button
                                    color="info"
                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                    title="Email"
                                    style={{ width: "38px", height: "38px" }}
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
                          <TabContent activeTab={activeTab} className="p-3">
                            <TabPane tabId="1">
                              <SchoolInfo schoolData={schoolData} />
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
              }
            />
          </Routes>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default SchoolProfile;
