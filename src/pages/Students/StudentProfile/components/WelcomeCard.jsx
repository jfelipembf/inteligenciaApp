import React from "react";
import { Card, CardBody, Row, Col, Badge } from "reactstrap";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useStudentsContext } from "../../../../contexts/StudentsContext";
import { useClassContext } from "../../../../contexts/ClassContext";
import useUser from "../../../../hooks/useUser";

// Import images
import profileImg from "../../../../assets/images/profile-img.png";
import avatar1 from "../../../../assets/images/users/avatar-1.jpg";
import avatar2 from "../../../../assets/images/users/avatar-2.jpg";
import avatar3 from "../../../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../../../assets/images/users/avatar-4.jpg";
import avatar5 from "../../../../assets/images/users/avatar-5.jpg";
import avatar6 from "../../../../assets/images/users/avatar-6.jpg";
import avatar7 from "../../../../assets/images/users/avatar-7.jpg";
import avatar8 from "../../../../assets/images/users/avatar-8.jpg";

const WelcomeCard = () => {
  const { id } = useParams();
  const { students, loading } = useStudentsContext();
  const { classes } = useClassContext();
  const { userDetails } = useUser();

  if (!userDetails?.schoolId) {
    throw new Error("schoolId não encontrado no usuário.");
  }

  const schoolId = userDetails.schoolId;

  const studentData = students.find((s) => s.id === id);

  console.log("classes card", classes);

  // Função para obter o avatar com base no ID do aluno
  const getAvatarByStudentId = (studentId) => {
    if (!studentId) return avatar1;

    const avatars = [
      avatar1,
      avatar2,
      avatar3,
      avatar4,
      avatar5,
      avatar6,
      avatar7,
      avatar8,
    ];
    const lastChar = studentId.slice(-1);
    const index = isNaN(parseInt(lastChar, 10))
      ? 0
      : parseInt(lastChar, 10) % avatars.length;
    return avatars[index];
  };

  // Formatar a data no formato dd/mm/aaaa
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    // Se já estiver no formato dd/mm/aaaa, retornar como está
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      return dateString;
    }

    // Tentar converter para o formato correto
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Se não for uma data válida, retornar como está

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    } catch (error) {
      return dateString;
    }
  };

  // Determinar se o aluno está ativo ou inativo (baseado no ID para demonstração)
  const isActive = studentData?.id
    ? studentData.id.charCodeAt(0) % 2 === 0
    : true;

  // Extrair informações do aluno
  const studentName = studentData?.personalInfo?.name || "Nome do Aluno";
  const registration = studentData?.academicInfo?.registration || "Não possui";
  const className = studentData?.academicInfo?.className || "Não possui";
  const birthDate = formatDate(studentData?.personalInfo?.birthDate);

  const avatar_cacheKey = `avatar_${schoolId}_${studentData?.personalInfo?.avatar}`;
  const avatar_cached = localStorage.getItem(avatar_cacheKey);

  let avatarUrl = null;
  if (avatar_cached) {
    try {
      avatarUrl = JSON.parse(avatar_cached).url;
    } catch {
      avatarUrl = null;
    }
  }

  return (
    <React.Fragment>
      <Card className="overflow-hidden">
        <div className="bg-primary-subtle">
          <Row>
            <Col xs="7">
              <div className="text-primary p-3">
                <h5 className="text-primary">Bem-vindo!</h5>
                <p>Painel do Aluno</p>
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
                  src={avatarUrl || getAvatarByStudentId(studentData?.id)}
                  alt=""
                  className="img-thumbnail rounded-circle"
                />
              </div>
              <h5 className="font-size-15 text-truncate">{studentName}</h5>
              <p className="text-muted mb-0 text-truncate">
                Matrícula: {registration}
              </p>
            </Col>
            <Col sm="8">
              <div className="pt-4">
                <Row>
                  <Col xs="6">
                    <h5 className="font-size-15">Data de Nascimento</h5>
                    <p className="text-muted mb-0">{birthDate}</p>
                    <h5 className="font-size-15 mt-3">Turma</h5>
                    <p className="text-muted mb-0">
                      {className || "Não possui"}
                    </p>
                  </Col>
                  {/*<Col xs="6">
                    <div className="d-flex align-items-start justify-content-between">
                      <div className="text-center" style={{ minWidth: "80px" }}>
                        <Badge
                          color={isActive ? "success" : "danger"}
                          className="font-size-14 p-2 d-block mb-2"
                        >
                          {isActive ? "Ativo" : "Inativo"}
                        </Badge>
                        <p className="text-muted mb-0">Status</p>
                      </div>
                      <div className="d-flex flex-column gap-2 ms-2">
                        <Link
                          to="#"
                          className="btn btn-success waves-effect waves-light"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0",
                          }}
                        >
                          <i className="bx bxl-whatsapp font-size-16"></i>
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-warning waves-effect waves-light"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0",
                          }}
                        >
                          <i className="bx bx-bell font-size-16"></i>
                        </Link>
                      </div>
                    </div>
                  </Col>*/}
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
