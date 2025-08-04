import React from "react";
import { Card, CardBody, Row, Col } from "reactstrap";
import { PersonCircle } from "react-bootstrap-icons"; // Ícone padrão de avatar
import useTeacherAvatar from "../../../../hooks/useTeacherAvatar";
import profileImg from "../../../../assets/images/profile-img.png";

const WelcomeCard = ({ user, schoolId }) => {
  // Obter o avatar do usuário
  const avatarUrl = useTeacherAvatar(user, schoolId);

  return (
    <React.Fragment>
      <Card className="overflow-hidden">
        <div className="bg-primary-subtle">
          <Row>
            <Col xs="7">
              <div className="text-primary p-3">
                <h5 className="text-primary">Bem-vindo!</h5>
                <p>Painel do Coordenador</p>
              </div>
            </Col>
            <Col xs="5" className="align-self-end">
              <img src={profileImg} alt="Profile" className="img-fluid" />
            </Col>
          </Row>
        </div>
        <CardBody className="pt-0">
          <Row>
            <Col sm="4">
              <div
                className="avatar-md profile-user-wid mb-4 bg-primary-subtle"
                style={{
                  width: "75px",
                  height: "75px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  border: "1px solid #dee2e6",
                }}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="img-thumbnail rounded-circle"
                    style={{
                      width: "75px",
                      height: "75px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <PersonCircle size={75} color="#f7f7fa" />
                )}
              </div>
              <h5 className="font-size-15 text-truncate">
                {user?.personalInfo?.name || "N/A"}
              </h5>
              <p className="text-muted mb-0 text-truncate">
                Registro: {user?.professionalInfo?.registration || "N/A"}
              </p>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default WelcomeCard;
