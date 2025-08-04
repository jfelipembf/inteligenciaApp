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
import { useParams, Link } from "react-router-dom";
import classnames from "classnames";
import Breadcrumb from "../../../components/Common/Breadcrumb";

// Import Chart.js
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

// Import Components
import WelcomeCard from "./components/WelcomeCard";
import InformationTab from "./components/InformationTab";
import ClassesTab from "./components/ClassesTab";
import PerformanceTab from "./components/PerformanceTab";
import NotificationsTab from "./components/NotificationsTab";


// Import Data
import { teacherData } from "./components/data";

const TeacherProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("1");
  


  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Professores" breadcrumbItem={teacherData.name} />

          {/* Card de boas-vindas com dados do professor */}
          <Row>
            <Col lg={12}>
              <WelcomeCard />
            </Col>
          </Row>

          {/* Abas com as funcionalidades */}
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Nav tabs className="nav-tabs-custom nav-justified">
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTab === "1",
                        })}
                        onClick={() => {
                          toggleTab("1");
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="fas fa-user"></i>
                        </span>
                        <span className="d-none d-sm-block">Informações</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTab === "2",
                        })}
                        onClick={() => {
                          toggleTab("2");
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="fas fa-book"></i>
                        </span>
                        <span className="d-none d-sm-block">Turmas</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTab === "3",
                        })}
                        onClick={() => {
                          toggleTab("3");
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="fas fa-chart-bar"></i>
                        </span>
                        <span className="d-none d-sm-block">Desempenho</span>
                      </NavLink>
                    </NavItem>
                    {/* 
                        Fora do escopo por enquanto
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTab === "4",
                        })}
                        onClick={() => {
                          toggleTab("4");
                        }}
                      >
                        
                        <span className="d-block d-sm-none">
                          <i className="fas fa-bell"></i>
                        </span>
                        <span className="d-none d-sm-block">Notificações</span>
                        *
                      </NavLink>

                    </NavItem>
                    */}
                  </Nav>

                  <TabContent activeTab={activeTab} className="p-3">
                    <TabPane tabId="1">
                      <InformationTab />
                    </TabPane>
                    <TabPane tabId="2">
                      <ClassesTab />
                    </TabPane>
                    <TabPane tabId="3">
                      <PerformanceTab />
                    </TabPane>
                    {/* //fora do escopo por enquanto
                    <TabPane tabId="4">
                      <NotificationsTab />
                    </TabPane>*/}
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

export default TeacherProfile;
