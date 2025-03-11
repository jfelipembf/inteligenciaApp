import React from "react";
import { Card, CardBody, Row, Col, Badge } from "reactstrap";
import { Link } from "react-router-dom";
import { teacherData } from "./data";

// Import images
import profileImg from "../../../../assets/images/profile-img.png";
import avatar1 from "../../../../assets/images/users/avatar-1.jpg";

const WelcomeCard = () => {
  return (
    <React.Fragment>
      <Card className="overflow-hidden">
        <div className="bg-primary-subtle">
          <Row>
            <Col xs="7">
              <div className="text-primary p-3">
                <h5 className="text-primary">Bem-vindo!</h5>
                <p>Painel do Professor</p>
              </div>
            </Col>
            <Col xs="5" className="align-self-end">
              <img src={profileImg} alt="" className="img-fluid" />
            </Col>
          </Row>
        </div>
        <CardBody className="pt-0">
          <Row>
            <Col sm="4">
              <div className="avatar-md profile-user-wid mb-4">
                <img
                  src={avatar1}
                  alt=""
                  className="img-thumbnail rounded-circle"
                />
              </div>
              <h5 className="font-size-15 text-truncate">{teacherData.name}</h5>
              <p className="text-muted mb-0 text-truncate">Registro: {teacherData.registration}</p>
            </Col>
            <Col sm="8">
              <div className="pt-4">
                <Row>
                  <Col xs="6">
                    <h5 className="font-size-15">{teacherData.specialty}</h5>
                    <p className="text-muted mb-0">Departamento: {teacherData.department}</p>
                  </Col>
                  <Col xs="6">
                    <div className="d-flex align-items-start justify-content-between">
                      <div className="text-center" style={{ minWidth: '80px' }}>
                        <Badge
                          color={teacherData.status === "active" ? "success" : "warning"}
                          className="font-size-14 p-2 d-block mb-2"
                        >
                          {teacherData.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                        <p className="text-muted mb-0">Status</p>
                      </div>
                      <div className="d-flex flex-column gap-2 ms-2">
                        <Link to={`https://wa.me/55${teacherData.phone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn btn-success waves-effect waves-light" style={{ width: '36px', height: '36px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0' }}>
                          <i className="bx bxl-whatsapp font-size-16"></i>
                        </Link>
                        <Link to="#" className="btn btn-warning waves-effect waves-light" style={{ width: '36px', height: '36px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0' }}>
                          <i className="bx bx-bell font-size-16"></i>
                        </Link>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default WelcomeCard;
