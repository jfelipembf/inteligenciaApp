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
} from "reactstrap";
import { useParams } from "react-router-dom";
import classnames from "classnames";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import useFetchUserById from "../../../hooks/useFetchUserById";

// Import Chart.js
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

// Import Components
import WelcomeCard from "./components/WelcomeCard";
import InformationTab from "./components/InformationTab";

const CoordinatorProfile = () => {
  const { id } = useParams(); // Obter o ID do coordenador da URL
  const [activeTab, setActiveTab] = useState("1"); // Estado para controlar as abas
  const { user, loading, error } = useFetchUserById(id); // Buscar os dados do coordenador

  console.log("user no index", user);
  // Função para alternar entre as abas
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  // Renderizar estado de carregamento ou erro
  if (loading) {
    return (
      <Container fluid>
        <p>Carregando dados do coordenador...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid>
        <p>Erro ao carregar os dados: {error}</p>
      </Container>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb */}
          <Breadcrumb
            title="Coordenadores"
            breadcrumbItem="Perfil do Coordenador"
          />

          {/* Card de boas-vindas */}
          <Row>
            <Col lg={12}>
              <WelcomeCard user={user} schoolId={user.schoolId} />
            </Col>
          </Row>

          {/* Abas com funcionalidades */}
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Nav tabs className="nav-tabs-custom nav-justified">
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({ active: activeTab === "1" })}
                        onClick={() => toggleTab("1")}
                      >
                        <span className="d-block d-sm-none">
                          <i className="fas fa-user"></i>
                        </span>
                        <span className="d-none d-sm-block">Informações</span>
                      </NavLink>
                    </NavItem>
                  </Nav>

                  <TabContent activeTab={activeTab} className="p-3">
                    <TabPane tabId="1">
                      <InformationTab user={user} />
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CoordinatorProfile;
