import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";
import InputMask from "react-input-mask";
import { ALL_SCHOOL_YEARS, SCHOOL_YEAR_STATUS } from "../../../../constants/schoolYear";
import { toast } from 'react-toastify';

const ClassModals = ({
  // Modais de edição de turma
  editClassModal,
  toggleEditClassModal,
  editClassData,
  setEditClassData,
  updateClass,
  classId,
  schoolId,
  
  // Modais de alunos
  addStudentModal,
  toggleAddStudentModal,
  removeStudentModal,
  toggleRemoveStudentModal,
  studentToRemove,
  selectedStudents,
  handleAddStudentsToClass,
  filteredStudents,
  handleSelectStudent,
  handleRemoveSelectedStudent,
  searchTerm,
  handleInputChange,
  handleBlur,
  errors,
  touched,
  
  // Modais de aulas
  editLessonModal,
  toggleEditLessonModal,
  lessonToEdit,
  setLessonToEdit,
  updateLesson,
  removeLessonModal,
  toggleRemoveLessonModal,
  lessonToRemove,
  removeLesson,
  setLocalLessons,
  
  // Dados adicionais
  teachers,
  loadingTeachers,
  periodOptions,
  roomOptions,
}) => {
  // Função para atualizar uma turma
  const handleUpdateClass = async () => {
    if (!editClassData) return;

    try {
      await updateClass(classId, schoolId, editClassData);
      
      toggleEditClassModal();
      toast.success("Turma atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar turma:", error);
      toast.error("Erro ao atualizar turma: " + error.message);
    }
  };

  // Função para confirmar a remoção de uma aula
  const handleConfirmRemoveLesson = async () => {
    if (!lessonToRemove) return;

    try {
      await removeLesson(lessonToRemove.id);
      
      // Atualizar a lista local de aulas
      setLocalLessons((prev) =>
        prev.filter((lesson) => lesson.id !== lessonToRemove.id)
      );

      toggleRemoveLessonModal(null);
      toast.success("Aula removida com sucesso!");
    } catch (error) {
      console.error("Erro ao remover aula:", error);
      toast.error("Erro ao remover aula: " + error.message);
    }
  };
  
  // Função para atualizar uma aula
  const handleUpdateLesson = async () => {
    if (!lessonToEdit) return;

    try {
      const success = await updateLesson(lessonToEdit.id, lessonToEdit);
      
      if (success) {
        // Atualizar a lista local de aulas
        setLocalLessons((prev) =>
          prev.map((lesson) =>
            lesson.id === lessonToEdit.id ? { ...lessonToEdit } : lesson
          )
        );

        toggleEditLessonModal(null);
        toast.success("Aula atualizada com sucesso!");
      } else {
        toast.error("Erro ao atualizar aula.");
      }
    } catch (error) {
      console.error("Erro ao atualizar aula:", error);
      toast.error("Erro ao atualizar aula: " + error.message);
    }
  };

  // Função para confirmar a remoção de um aluno
  const handleConfirmRemoveStudent = async () => {
    if (!studentToRemove) return;

    try {
      await removeStudentFromClass(studentToRemove.id);
      
      toggleRemoveStudentModal(null);
      toast.success("Aluno removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover aluno:", error);
      toast.error("Erro ao remover aluno: " + error.message);
    }
  };

  return (
    <>
      {/* Modal para editar turma */}
      <Modal
        isOpen={editClassModal}
        toggle={toggleEditClassModal}
        centered
        size="lg"
      >
        <ModalHeader toggle={toggleEditClassModal} className="bg-primary text-white">
          <i className="bx bx-edit me-2"></i>
          Editar Turma
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup className="mb-3">
              <Label for="name" className="fw-bold">Nome da Turma</Label>
              <Input
                type="text"
                id="name"
                value={editClassData.className || ""}
                onChange={(e) =>
                  setEditClassData((prev) => ({
                    ...prev,
                    className: e.target.value,
                  }))
                }
                placeholder="Nome da turma"
              />
            </FormGroup>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <Label for="year" className="fw-bold">Ano Escolar</Label>
                  <Input
                    type="select"
                    id="year"
                    name="year"
                    value={editClassData.year || ""}
                    onChange={(e) =>
                      setEditClassData((prev) => ({
                        ...prev,
                        year: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">Selecione o ano escolar</option>
                    {ALL_SCHOOL_YEARS.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <Label for="period" className="fw-bold">Período</Label>
                  <Input
                    type="select"
                    id="period"
                    name="period"
                    value={editClassData.period || ""}
                    onChange={(e) =>
                      setEditClassData((prev) => ({
                        ...prev,
                        period: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">Selecione o período</option>
                    {periodOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <Label for="startDate" className="fw-bold">Data de Início</Label>
                  <InputMask
                    mask="99/99/9999"
                    value={editClassData.startDate || ""}
                    onChange={(e) =>
                      setEditClassData((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                  >
                    {(inputProps) => (
                      <Input
                        {...inputProps}
                        type="text"
                        id="startDate"
                        placeholder="DD/MM/AAAA"
                      />
                    )}
                  </InputMask>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-3">
                  <Label for="endDate" className="fw-bold">Data de Término</Label>
                  <InputMask
                    mask="99/99/9999"
                    value={editClassData.endDate || ""}
                    onChange={(e) =>
                      setEditClassData((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                  >
                    {(inputProps) => (
                      <Input
                        {...inputProps}
                        type="text"
                        id="endDate"
                        placeholder="DD/MM/AAAA"
                      />
                    )}
                  </InputMask>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleEditClassModal}>
            Cancelar
          </Button>
          <Button color="primary" onClick={handleUpdateClass}>
            <i className="bx bx-save me-1"></i>
            Salvar Alterações
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal para adicionar alunos */}
      <Modal
        isOpen={addStudentModal}
        toggle={toggleAddStudentModal}
        centered
        size="lg"
      >
        <ModalHeader toggle={toggleAddStudentModal} className="bg-primary text-white">
          <i className="bx bx-user-plus me-2"></i>
          Adicionar Alunos à Turma
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup className="mb-3">
              <Label for="search" className="fw-bold">Pesquisar Alunos</Label>
              <Input
                type="text"
                id="search"
                name="search"
                value={searchTerm}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Digite a matrícula ou nome do aluno"
              />
              {touched.search && errors.search && (
                <div className="invalid-feedback d-block">{errors.search}</div>
              )}
            </FormGroup>

            <div className="mt-4">
              <h6 className="fw-bold">Alunos Disponíveis</h6>
              {filteredStudents.length === 0 ? (
                <p className="text-muted">Nenhum aluno encontrado.</p>
              ) : (
                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                  <ul className="list-group">
                    {filteredStudents.map((student) => (
                      <li
                        key={student.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <strong>{student.personalInfo?.name}</strong>
                          <br />
                          <small className="text-muted">
                            Matrícula: {student.academicInfo?.registration}
                          </small>
                        </div>
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() => handleSelectStudent(student)}
                          disabled={selectedStudents.some(
                            (s) => s.id === student.id
                          )}
                        >
                          {selectedStudents.some((s) => s.id === student.id)
                            ? "Selecionado"
                            : "Selecionar"}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {selectedStudents.length > 0 && (
              <div className="mt-4">
                <h6 className="fw-bold">Alunos Selecionados</h6>
                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                  <ul className="list-group">
                    {selectedStudents.map((student) => (
                      <li
                        key={student.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <strong>{student.personalInfo?.name}</strong>
                          <br />
                          <small className="text-muted">
                            Matrícula: {student.academicInfo?.registration}
                          </small>
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
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleAddStudentModal}>
            Cancelar
          </Button>
          <Button
            color="primary"
            onClick={handleAddStudentsToClass}
            disabled={selectedStudents.length === 0 || errors.search}
          >
            <i className="bx bx-plus me-1"></i>
            Adicionar {selectedStudents.length > 0 && `(${selectedStudents.length})`}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal para confirmar remoção de aluno */}
      <Modal
        isOpen={removeStudentModal}
        toggle={() => toggleRemoveStudentModal(null)}
        centered
      >
        <ModalHeader toggle={() => toggleRemoveStudentModal(null)}>
          Confirmar Remoção
        </ModalHeader>
        <ModalBody>
          <p>
            Tem certeza que deseja remover o aluno{" "}
            <strong>{studentToRemove?.name}</strong> desta turma?
          </p>
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

      {/* Modal para editar aula */}
      <Modal
        isOpen={editLessonModal}
        toggle={() => toggleEditLessonModal(null)}
        centered
      >
        <ModalHeader toggle={() => toggleEditLessonModal(null)}>
          Editar Aula
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="teacher">Professor</Label>
              {loadingTeachers ? (
                <p>Carregando professores...</p>
              ) : (
                <Input
                  type="select"
                  id="teacher"
                  name="teacher"
                  value={lessonToEdit?.teacher?.value || ""}
                  onChange={(e) => {
                    const selectedTeacher = teachers.find(t => t.value === e.target.value);
                    setLessonToEdit((prev) => ({
                      ...prev,
                      teacher: selectedTeacher || null,
                    }));
                  }}
                  required
                >
                  <option value="">Selecione o professor</option>
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
              <Input
                type="select"
                id="room"
                name="room"
                value={lessonToEdit?.room?.value || ""}
                onChange={(e) => {
                  const selectedRoom = roomOptions.find(r => r.value === e.target.value);
                  setLessonToEdit((prev) => ({
                    ...prev,
                    room: selectedRoom || null,
                  }));
                }}
                required
              >
                <option value="">Selecione a sala</option>
                {roomOptions.map((room) => (
                  <option key={room.value} value={room.value}>
                    {room.label}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => toggleEditLessonModal(null)}
          >
            Cancelar
          </Button>
          <Button color="primary" onClick={handleUpdateLesson}>
            Salvar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal para confirmar remoção de aula */}
      <Modal
        isOpen={removeLessonModal}
        toggle={() => toggleRemoveLessonModal(null)}
        centered
      >
        <ModalHeader toggle={() => toggleRemoveLessonModal(null)}>
          Confirmar Remoção
        </ModalHeader>
        <ModalBody>
          <p>
            Tem certeza que deseja remover esta aula?
          </p>
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
    </>
  );
};

export default ClassModals;
