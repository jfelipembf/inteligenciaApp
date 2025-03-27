import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import useClassData from "../../../hooks/useClassData";

const ViewClass = () => {
  const { id } = useParams();
  const { classData, students, setStudents, loading, error } = useClassData(id);

  const [addStudentModal, setAddStudentModal] = useState(false);

  const toggleAddStudentModal = () => {
    setAddStudentModal(!addStudentModal);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Turmas" breadcrumbItem="Detalhes da Turma" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Informações da Turma</h4>
                  <div className="table-responsive">
                    <table className="table table-nowrap mb-4">
                      <tbody>
                        <tr>
                          <th scope="row">Nome da Turma:</th>
                          <td>{classData.className}</td>
                          <th scope="row">Período:</th>
                          <td>{classData.period}</td>
                        </tr>
                        <tr>
                          <th scope="row">Professor:</th>
                          <td>{classData.teacher?.label || "N/A"}</td>
                          <th scope="row">Sala:</th>
                          <td>{classData.room?.label || "N/A"}</td>
                        </tr>
                        <tr>
                          <th scope="row">Data de Início:</th>
                          <td>{classData.startDate}</td>
                          <th scope="row">Data de Término:</th>
                          <td>{classData.endDate}</td>
                        </tr>
                        <tr>
                          <th scope="row">Descrição:</th>
                          <td colSpan="3">{classData.description}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title mb-0">Alunos Matriculados</h4>
                    <Button color="primary" onClick={toggleAddStudentModal}>
                      Adicionar Alunos
                    </Button>
                  </div>

                  <div className="table-responsive">
                    <Table className="table-centered table-nowrap mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Nome do Aluno</th>
                          <th>Matrícula</th>
                          <th>Status</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.name}</td>
                            <td>{student.enrollment}</td>
                            <td>
                              <span
                                className={`badge bg-${
                                  student.status === "Ativo"
                                    ? "success"
                                    : "danger"
                                }`}
                              >
                                {student.status}
                              </span>
                            </td>
                            <td>
                              <Button
                                color="info"
                                size="sm"
                                onClick={() =>
                                  (window.location.href = `/student-profile/${student.id}`)
                                }
                              >
                                Ver Perfil
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ViewClass;
