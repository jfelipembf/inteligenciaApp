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
import { useLessonsContext } from "../../../contexts/LessonContext";
import useUpdateLesson from "../../../hooks/useUpdateLesson";
import { useTeachersContext } from "../../../contexts/TeachersContext";
import CreatableSelect from "react-select/creatable"; // Importar o componente
import { label } from "yet-another-react-lightbox";
import useUser from "../../../hooks/useUser";

const ViewClass = () => {
  const { id: classId } = useParams(); // Pega o ID da turma da URL
  const { userDetails } = useUser();
  const { lessons, loading, error, selectedClassId, setSelectedClassId } =
    useLessonsContext();
  useEffect(() => {
    if (classId) {
      setSelectedClassId(classId); // Atualiza o contexto com o classId
    }
  }, [classId, setSelectedClassId]);
  const navigate = useNavigate(); // Hook para navegação
  const [localLessons, setLocalLessons] = useState([]);
  const [editLessonModal, setEditLessonModal] = useState(false);
  const [lessonToEdit, setLessonToEdit] = useState(null);
  const {
    teachers,
    loading: loadingTeachers,
    error: fetchTeachersError,
  } = useTeachersContext();
  const [removeLessonModal, setRemoveLessonModal] = useState(false);
  const [lessonToRemove, setLessonToRemove] = useState(null);

  const toggleRemoveLessonModal = (lesson) => {
    setLessonToRemove(lesson);
    setRemoveLessonModal(!removeLessonModal);
  };
  const toggleEditLessonModal = (lesson) => {
    setLessonToEdit(lesson);
    setEditLessonModal(!editLessonModal);
  };
  useEffect(() => {
    if (!loading && lessons) {
      setLocalLessons(lessons);
    }
  }, [loading, lessons]);

  const handleConfirmRemoveLesson = async () => {
    if (!lessonToRemove) return;

    try {
      // Remover a aula do Firestore
      const lessonRef = firebase
        .firestore()
        .collection("schools")
        .doc(classData.schoolId)
        .collection("classes")
        .doc(classId)
        .collection("lessons")
        .doc(lessonToRemove.id);

      await lessonRef.delete();

      // Atualizar a lista local de aulas
      setLocalLessons((prev) =>
        prev.filter((lesson) => lesson.id !== lessonToRemove.id)
      );

      toggleRemoveLessonModal(null);
      alert("Aula removida com sucesso!");
    } catch (error) {
      console.error("Erro ao remover aula:", error);
      alert("Erro ao remover aula: " + error.message);
    }
  };
  const handleSaveLesson = async () => {
    if (!lessonToEdit) return;

    const success = await updateLesson(lessonToEdit.id, {
      teacher: {
        label: lessonToEdit.teacher.label,
        value: lessonToEdit.teacher.value,
      },
      room: {
        label: lessonToEdit.room.label,
        value: lessonToEdit.room.value,
      },
    });

    if (success) {
      // Atualizar a cópia local das aulas
      setLocalLessons((prev) =>
        prev.map((lesson) =>
          lesson.id === lessonToEdit.id
            ? { ...lesson, ...lessonToEdit }
            : lesson
        )
      );

      toggleEditLessonModal(null);
      alert("Aula atualizada com sucesso!");
    } else {
      alert("Erro ao atualizar a aula.");
    }
  };

  const { id } = useParams();
  const {
    classData,
    students,
    setStudents,
    loading: classLoading,
    error: classError,
  } = useClassData(id);
  const {
    updateLesson,
    loading: updatingLesson,
    error: updateError,
  } = useUpdateLesson(classId, classData?.schoolId);
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
                          <th scope="row">Data de Início:</th>
                          <td>{classData.startDate}</td>
                          <th scope="row">Data de Término:</th>
                          <td>{classData.endDate}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title mb-0">Alunos Matriculados </h4>
                    {userDetails?.role !== "professor" && (
                      <Button color="primary" onClick={toggleAddStudentModal}>
                        Adicionar Alunos
                      </Button>
                    )}
                  </div>

                  <div className="table-responsive mb-4">
                    <Table className="table-centered table-nowrap table-striped mb-0">
                      <thead className="table-light">
                        <tr>
                          {/*<th>ID</th>*/}
                          <th style={{ width: "40%" }}>Nome do Aluno</th>
                          <th style={{ width: "30%" }}>Matrícula</th>
                          <th style={{ width: "30%" }}>
                            <div
                              className="d-flex justify-content-end"
                              style={{ marginRight: "5rem" }}
                            >
                              Ações
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.id}>
                            {/*<td>{student.id}</td>*/}
                            <td>{student.name}</td>
                            <td>{student.registration}</td>
                            <td>
                              <div className="d-flex justify-content-end">
                                <Button
                                  color="info"
                                  size="sm"
                                  className="me-1"
                                  onClick={() =>
                                    navigate(`students/${student.id}`)
                                  }
                                >
                                  Ver Perfil
                                </Button>
                                {userDetails?.role !== "professor" && (
                                  <Button
                                    color="danger"
                                    size="sm"
                                    onClick={() =>
                                      toggleRemoveStudentModal(student)
                                    }
                                  >
                                    Remover
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  {/**********************************************/}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title mb-0">Aulas</h4>
                    {userDetails?.role !== "professor" && (
                      <Button
                        color="primary"
                        onClick={() =>
                          navigate(`/classes/${classId}/create-classroom`)
                        }
                      >
                        Adicionar Aula
                      </Button>
                    )}
                  </div>

                  <div className="table-responsive">
                    <Table className="table-centered table-nowrap table-striped mb-0">
                      <thead className="table-light">
                        <tr>
                          {/*<th>ID</th>*/}
                          <th style={{ width: "40%" }}>Disciplina</th>
                          <th style={{ width: "30%" }}>Professor</th>
                          {userDetails?.role !== "professor" && (
                            <th style={{ width: "30%" }}>
                              <div
                                className="d-flex justify-content-end"
                                style={{ marginRight: "5rem" }}
                              >
                                Ações
                              </div>
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {localLessons.map((lesson) => (
                          <tr key={lesson.id}>
                            {/*<td>{student.id}</td>*/}
                            <td>{lesson.subject}</td>
                            <td>{lesson.teacher.label}</td>
                            {userDetails?.role !== "professor" && (
                              <td>
                                <div className="d-flex justify-content-end">
                                  <Button
                                    color="info"
                                    size="sm"
                                    className="me-1"
                                    onClick={() =>
                                      toggleEditLessonModal(lesson)
                                    }
                                  >
                                    Editar
                                  </Button>
                                  <Button
                                    color="danger"
                                    size="sm"
                                    onClick={() =>
                                      toggleRemoveLessonModal(lesson)
                                    }
                                  >
                                    Remover
                                  </Button>
                                </div>
                              </td>
                            )}
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

          {/* Modal para editar aula */}
          <Modal
            isOpen={editLessonModal}
            toggle={() => toggleEditLessonModal(null)}
          >
            <ModalHeader toggle={() => toggleEditLessonModal(null)}>
              Editar Aula
            </ModalHeader>
            <ModalBody>
              {lessonToEdit && (
                <Form>
                  <FormGroup>
                    <Label for="teacher">Professor</Label>
                    {loadingTeachers ? (
                      <div>Carregando professores...</div>
                    ) : fetchTeachersError ? (
                      <div>
                        Erro ao carregar professores: {fetchTeachersError}
                      </div>
                    ) : (
                      <Input
                        type="select"
                        id="teacher"
                        value={lessonToEdit.teacher?.value || ""}
                        onChange={(e) => {
                          const selectedTeacher = teachers.find(
                            (teacher) => teacher.value === e.target.value
                          );
                          setLessonToEdit((prev) => ({
                            ...prev,
                            teacher: {
                              label: selectedTeacher.label,
                              value: selectedTeacher.value,
                            },
                          }));
                        }}
                      >
                        <option value="" disabled>
                          Selecione um professor
                        </option>
                        {teachers.map((teacher) => (
                          <option key={teacher.value} value={teacher.value}>
                            {teacher.label}
                          </option>
                        ))}
                      </Input>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="room">Sala</Label>
                    <CreatableSelect
                      id="room"
                      isClearable
                      formatCreateLabel={(inputValue) =>
                        `Criar "${inputValue}"`
                      }
                      options={[
                        { value: "Sala 1", label: "Sala 1" },
                        { value: "Sala 2", label: "Sala 2" },
                        { value: "Sala 3", label: "Sala 3" },
                        { value: "Sala 4", label: "Sala 4" },
                        { value: "Sala 5", label: "Sala 5" },
                      ]}
                      value={
                        lessonToEdit.room
                          ? {
                              value: lessonToEdit.room.value,
                              label: lessonToEdit.room.label,
                            }
                          : null
                      }
                      onChange={(selectedOption) =>
                        setLessonToEdit((prev) => ({
                          ...prev,
                          room: selectedOption
                            ? {
                                label: selectedOption.label,
                                value: selectedOption.value,
                              }
                            : null,
                        }))
                      }
                      placeholder="Selecione ou digite uma sala"
                    />
                  </FormGroup>
                </Form>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color="secondary"
                onClick={() => toggleEditLessonModal(null)}
              >
                Cancelar
              </Button>
              <Button color="primary" onClick={handleSaveLesson}>
                Salvar
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

          {/* Modal para confirmar remoção de aula */}
          <Modal
            isOpen={removeLessonModal}
            toggle={() => toggleRemoveLessonModal(null)}
          >
            <ModalHeader toggle={() => toggleRemoveLessonModal(null)}>
              Confirmar Remoção
            </ModalHeader>
            <ModalBody>
              Tem certeza de que deseja remover a aula de{" "}
              <strong>{lessonToRemove?.subject}</strong>?
            </ModalBody>
            <ModalFooter>
              <Button
                color="secondary"
                onClick={() => toggleRemoveLessonModal(null)}
              >
                Cancelar
              </Button>
              <Button color="danger" onClick={handleConfirmRemoveLesson}>
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
