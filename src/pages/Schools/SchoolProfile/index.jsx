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
import uploadToFirebase from "../../../utils/uploadToFirebase";

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
  const [logoUrl, setLogoUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { fetchSchoolById, fetchSchoolLogo, updateSchoolLogo } = useSchools();

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const url = await fetchSchoolLogo(id);
        setLogoUrl(url);
      } catch (err) {
        console.error("Erro ao carregar a logo:", err);
      }
    };

    loadLogo();
  }, [id, fetchSchoolLogo]);

  const getSchoolDetails = async (id) => {
    try {
      const schoolData = await fetchSchoolById(id);
      setSchoolData(schoolData);
    } catch (err) {
      console.error("Erro ao carregar os dados da escola:", err);
    }
  };

  useEffect(() => {
    if (id) {
      getSchoolDetails(id);
    }
  }, [id]);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);

      // Envia a imagem para o Firebase Storage
      await uploadToFirebase(file, "logos", id);

      // Atualiza o campo `logo` no Firestore
      await updateSchoolLogo(id, file.name);

      // Atualiza a URL da logo no estado local e no cache
      const url = await fetchSchoolLogo(id);

      // Atualiza o cache no localStorage
      const cacheKey = `school_logo_${id}`;
      localStorage.setItem(
        cacheKey,
        JSON.stringify({ url, timestamp: Date.now() })
      );

      // Atualiza o estado local com a nova URL
      setLogoUrl(url);

      alert("Logo atualizada com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar a logo:", err);
      alert("Erro ao atualizar a logo.");
    } finally {
      setUploading(false);
    }
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Routes>
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
                              <div
                                className="avatar-xl profile-user-wid mb-4 position-relative"
                                onMouseEnter={() => setHovered(true)}
                                onMouseLeave={() => setHovered(false)}
                                style={{
                                  width: "120px",
                                  height: "120px",
                                  borderRadius: "50%",
                                  overflow: "hidden",
                                  position: "relative",
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                {logoUrl ? (
                                  <img
                                    src={logoUrl}
                                    alt="Logo da Escola"
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                ) : (
                                  <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      backgroundColor: "#e9ecef",
                                    }}
                                  >
                                    <i className="bx bx-camera font-size-24 text-body"></i>
                                  </div>
                                )}
                                {hovered && (
                                  <div
                                    className="position-absolute"
                                    style={{
                                      bottom: "10px",
                                      right: "10px",
                                      backgroundColor: "#556ee6",
                                      borderRadius: "50%",
                                      width: "32px",
                                      height: "32px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      document
                                        .getElementById("logo-upload-input")
                                        .click()
                                    }
                                  >
                                    <i
                                      className="bx bx-pencil text-white"
                                      style={{ fontSize: "18px" }}
                                    ></i>
                                  </div>
                                )}
                                <input
                                  type="file"
                                  id="logo-upload-input"
                                  accept="image/*"
                                  onChange={handleLogoUpload}
                                  style={{ display: "none" }}
                                />
                              </div>
                              {uploading && (
                                <p className="text-muted mt-2">
                                  Enviando logo...
                                </p>
                              )}
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
                                      window.location.href = `mailto:${schoolData.contactInfo.email}`;
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
