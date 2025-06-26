import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane, Badge, Button } from "reactstrap";
import classnames from "classnames";

const StudentDetails = ({ student, onBack }) => {
  const [activeTab, setActiveTab] = useState("1");

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <Card>
            <CardBody>
              <div className="d-flex align-items-center mb-4">
                <Button 
                  color="none" 
                  className="btn btn-link p-0 me-2"
                  onClick={onBack}
                >
                  <i className="bx bx-arrow-back"></i>
                </Button>
                <h4 className="card-title mb-0">Detalhes do Aluno</h4>
              </div>

              <div className="bg-primary-subtle p-3 mb-4">
                <Row>
                  <Col sm="4">
                    <div className="avatar-xl profile-user-wid mb-3">
                      <div className="avatar-title rounded-circle bg-light text-primary">
                        {student.name.charAt(0)}
                      </div>
                    </div>
                    <h5 className="font-size-15">{student.name}</h5>
                    <p className="text-muted mb-0">Matrícula: {student.registration}</p>
                  </Col>

                  <Col sm="8">
                    <div className="pt-4">
                      <Row>
                        <Col xs="6">
                          <h5 className="font-size-15">Série/Turma</h5>
                          <p className="text-muted mb-0">{student.grade} - {student.class}</p>
                        </Col>
                        <Col xs="6">
                          <h5 className="font-size-15">Status</h5>
                          <Badge color={student.status === "active" ? "success" : "danger"}>
                            {student.status === "active" ? "Ativo" : "Inativo"}
                          </Badge>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </div>

              <Nav tabs className="nav-tabs-custom nav-justified">
                {/* ... resto do código das abas igual ao anterior ... */}
              </Nav>

              <TabContent activeTab={activeTab} className="p-3">
                {/* ... resto do código do conteúdo das abas igual ao anterior ... */}
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default StudentDetails; 