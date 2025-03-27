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

const ViewClass = () => {
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Toggle do modal
  const toggleAddStudentModal = () => {
    setAddStudentModal(!addStudentModal);
    if (!addStudentModal) {
      setSearchTerm("");
      setFilteredStudents([]);
      setSelectedStudents([]);
      fetchAvailableStudents();
    }
  };

  // Filtrar alunos com base no termo de pesquisa
  useEffect(() => {
    if (searchTerm) {
      const filtered = availableStudents.filter(
        (student) =>
          student.enrollment
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents([]);
    }
  }, [searchTerm, availableStudents]);

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
                          <strong>{student.name}</strong> - Matrícula:{" "}
                          {student.enrollment}
                        </div>
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() => handleSelectStudent(student)}
                        >
                          Adicionar
                        </Button>
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
                          <strong>{student.name}</strong> - Matrícula:{" "}
                          {student.enrollment}
                        </div>
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
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ViewClass;
