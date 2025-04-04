import React, { useState, useEffect } from "react";
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
import useManageStudents from "../../../hooks/useManageStudents";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";

const ViewClass = () => {
  const { id: classId } = useParams(); // Pega o ID da turma da URL
  const navigate = useNavigate(); // Hook para navegação

  const { id } = useParams();
  const {
    classData,
    students,
    setStudents,
    loading: classLoading,
    error: classError,
  } = useClassData(id);
  const {
    availableStudents,
    fetchAvailableStudents,
    addStudentsToClass,
    loading: studentsLoading,
    error: studentsError,
  } = useManageStudents(id, classData?.schoolId);

  const [addStudentModal, setAddStudentModal] = useState(false);
  const [removeStudentModal, setRemoveStudentModal] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Toggle do modal de adicionar alunos
  const toggleAddStudentModal = () => {
    setAddStudentModal(!addStudentModal);
    if (!addStudentModal) {
      setSearchTerm("");
      setFilteredStudents([]);
      setSelectedStudents([]);
      fetchAvailableStudents();
    }
  };

  // Toggle do modal de remover aluno
  const toggleRemoveStudentModal = (student) => {
    setStudentToRemove(student);
    setRemoveStudentModal(!removeStudentModal);
  };

  // Atualizar lista de alunos filtrados
  useEffect(() => {
    if (searchTerm) {
      const filtered = availableStudents
        .filter(
          (student) =>
            student.academicInfo.registration
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            student.personalInfo.name
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
        .filter(
          (student) => !students.some((s) => s.id === student.id) // Filtrar alunos já matriculados
        );
      setFilteredStudents(filtered);
    } else {
      // Exibir todos os alunos disponíveis, excluindo os já matriculados
      const filtered = availableStudents.filter(
        (student) => !students.some((s) => s.id === student.id)
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, availableStudents, students]);

  // Adicionar aluno à lista de selecionados
  const handleSelectStudent = (student) => {
    if (!selectedStudents.find((s) => s.id === student.id)) {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  // Remover aluno da lista de selecionados
  const handleRemoveSelectedStudent = (studentId) => {
    setSelectedStudents(selectedStudents.filter((s) => s.id !== studentId));
  };

  // Salvar alunos selecionados na subcoleção "students" da turma
  const handleAddStudentsToClass = async () => {
    await addStudentsToClass(selectedStudents);
    setStudents((prev) => [...prev, ...selectedStudents]);
    toggleAddStudentModal();
  };

  // Remover aluno da subcoleção "students" no Firestore
  const handleConfirmRemoveStudent = async () => {
    if (!studentToRemove) return;

    try {
      const batch = firebase.firestore().batch();

      // Remover o aluno da subcoleção "students" no Firestore
      const studentRef = firebase
        .firestore()
        .collection("schools")
        .doc(classData.schoolId)
        .collection("classes")
        .doc(id)
        .collection("students")
        .doc(studentToRemove.id);
      batch.delete(studentRef);

      // Atualizar o campo "classId" no documento do aluno na coleção "users"
      const userRef = firebase
        .firestore()
        .collection("users")
        .doc(studentToRemove.id);
      batch.update(userRef, {
        "academicInfo.classId": null, // Remove o campo "classId"
      });

      // Commit da operação em lote
      await batch.commit();

      // Atualizar a lista de alunos na interface
      setStudents((prev) =>
        prev.filter((student) => student.id !== studentToRemove.id)
      );

      toggleRemoveStudentModal(null);
    } catch (error) {
      console.error("Erro ao remover aluno:", error);
      alert("Erro ao remover aluno: " + error.message);
    }
  };

  if (classLoading) {
    return <div>Carregando...</div>;
  }

  if (classError) {
    return <div>Erro: {classError}</div>;
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
                    <h4 className="card-title mb-0">Alunos Matriculados </h4>
                    <Button color="primary" onClick={toggleAddStudentModal}>
                      Adicionar Alunos
                    </Button>
                  </div>

                  <div className="table-responsive mb-4">
                    <Table className="table-centered table-nowrap mb-0">
                      <thead className="table-light">
                        <tr>
                          {/*<th>ID</th>*/}
                          <th>Nome do Aluno</th>
                          <th>Matrícula</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.id}>
                            {/*<td>{student.id}</td>*/}
                            <td>{student.name}</td>
                            <td>{student.registration}</td>
                            <td>
                              <Button
                                color="info"
                                size="sm"
                                className="me-1"
                                onClick={() =>
                                  (window.location.href = `/student-profile/${student.id}`)
                                }
                              >
                                Ver Perfil
                              </Button>
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() =>
                                  toggleRemoveStudentModal(student)
                                }
                              >
                                Remover
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  {/**********************************************/}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title mb-0">Aulas</h4>
                    <Button
                      color="primary"
                      onClick={() =>
                        navigate(`/classes/${classId}/create-classroom`)
                      }
                    >
                      Adicionar Aula
                    </Button>
                  </div>

                  <div className="table-responsive">
                    <Table className="table-centered table-nowrap mb-0">
                      <thead className="table-light">
                        <tr>
                          {/*<th>ID</th>*/}
                          <th>Nome do Aluno</th>
                          <th>Matrícula</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.id}>
                            {/*<td>{student.id}</td>*/}
                            <td>{student.name}</td>
                            <td>{student.registration}</td>
                            <td>
                              <Button
                                color="info"
                                size="sm"
                                className="me-1"
                                onClick={() =>
                                  (window.location.href = `/student-profile/${student.id}`)
                                }
                              >
                                Ver Perfil
                              </Button>
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() =>
                                  toggleRemoveStudentModal(student)
                                }
                              >
                                Remover
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

          {/* Modal para adicionar alunos */}
          <Modal
            isOpen={addStudentModal}
            toggle={toggleAddStudentModal}
            size="lg"
          >
            <ModalHeader toggle={toggleAddStudentModal}>
              Adicionar Alunos à Turma
            </ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="search">Pesquisar por Matrícula ou Nome</Label>
                  <Input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Digite a matrícula ou nome do aluno"
                  />
                </FormGroup>

                <div className="mt-3">
                  <h5>Alunos Disponíveis:</h5>
                  <div
                    className="border rounded p-2"
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                  >
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className="d-flex justify-content-between align-items-center p-2 border-bottom"
                      >
                        <div>
                          <strong>{student.registration}</strong>Matrícula:{" "}
                          {student.academicInfo.registration}
                        </div>

                        <div>
                          <strong>{student.name}</strong>Nome:{" "}
                          {student.personalInfo.name}
                        </div>
                        {student.academicInfo.classId !== null ? (
                          <div>
                            <span className="badge bg-warning me-1 p-1 fs-6">
                              Já em uma turma
                            </span>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => handleSelectStudent(student)}
                            >
                              Transferir
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <span className="badge bg-success me-1 p-1 fs-6">
                              Disponível
                            </span>
                            <Button
                              color="primary"
                              size="sm"
                              onClick={() => handleSelectStudent(student)}
                            >
                              Adicionar
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <h5>Alunos Selecionados:</h5>
                  <div
                    className="border rounded p-2"
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                  >
                    {selectedStudents.map((student) => (
                      <div
                        key={student.id}
                        className="d-flex justify-content-between align-items-center p-2 border-bottom"
                      >
                        <div>
                          <strong>{student.registration}</strong>Matrícula:{" "}
                          {student.academicInfo.registration}
                        </div>
                        <div>
                          <strong>{student.name}</strong>Nome:{" "}
                          {student.personalInfo.name}
                        </div>
                        {student.academicInfo.classId !== null ? (
                          <div>
                            <span className="badge bg-warning me-1 p-1 fs-6">
                              TRANSFERÊNCIA
                            </span>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() =>
                                handleRemoveSelectedStudent(student.id)
                              }
                            >
                              Remover
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() =>
                                handleRemoveSelectedStudent(student.id)
                              }
                            >
                              Remover
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggleAddStudentModal}>
                Cancelar
              </Button>
              <Button
                color="primary"
                onClick={handleAddStudentsToClass}
                disabled={selectedStudents.length === 0}
              >
                Adicionar {selectedStudents.length} Aluno(s)
              </Button>
            </ModalFooter>
          </Modal>

          {/* Modal para confirmar remoção de aluno */}
          <Modal
            isOpen={removeStudentModal}
            toggle={() => toggleRemoveStudentModal(null)}
          >
            <ModalHeader toggle={() => toggleRemoveStudentModal(null)}>
              Confirmar Remoção
            </ModalHeader>
            <ModalBody>
              Tem certeza de que deseja remover o aluno{" "}
              <strong>{studentToRemove?.name}</strong> da turma?
            </ModalBody>
            <ModalFooter>
              <Button
                color="secondary"
                onClick={() => toggleRemoveStudentModal(null)}
              >
                Cancelar
              </Button>
              <Button color="danger" onClick={handleConfirmRemoveStudent}>
                Remover
              </Button>
            </ModalFooter>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ViewClass;
