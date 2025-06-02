import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

import { useClassContext } from "../../contexts/ClassContext";

import { useLessonsContext } from "../../contexts/LessonContext";
import useUser from "../../hooks/useUser";
import useUpdateGrade from "../../hooks/useUpdateGrade";
import firebase from "firebase/compat/app";

const GradesListPage = () => {
  const { userDetails } = useUser();
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null); // Estado para o modal de edição
  const [updatedGrades, setUpdatedGrades] = useState({});
  const { updateGrade, loading: updatingGrade } = useUpdateGrade();

  const { classes, loading: loadingClasses } = useClassContext();

  const selectedClassId = selectedClass?.id || null;
  const {
    lessons,
    loading: loadingLessons,
    error: er,
    setSelectedClassId,
  } = useLessonsContext();

  useEffect(() => {
    if (selectedClassId) {
      setSelectedClassId(selectedClassId);
    }
  }, [selectedClassId, setSelectedClassId]);

  const handleClassChange = (e) => {
    const classId = e.target.value;
    const selected = classes.find((cls) => cls.id === classId);
    setSelectedClass(selected);
    setSelectedLesson(null); // Reset lesson when class changes
    setGrades([]); // Clear grades when class changes
  };

  const handleLessonChange = (e) => {
    const lessonId = e.target.value;
    const selected = lessons.find((lesson) => lesson.id === lessonId);
    setSelectedLesson(selected);
    fetchGrades(selected.id);
  };

  const fetchGrades = async (lessonId) => {
    setLoadingGrades(true);
    try {
      const gradesSnapshot = await firebase
        .firestore()
        .collection("schools")
        .doc(userDetails?.schoolId)
        .collection("classes")
        .doc(selectedClass.id)
        .collection("lessons")
        .doc(lessonId)
        .collection("grades")
        .get();

      const fetchedGrades = gradesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      fetchedGrades.sort((a, b) => {
        if (a.unit < b.unit) return -1;
        if (a.unit > b.unit) return 1;
        return a.studentName.localeCompare(b.studentName);
      });

      setGrades(fetchedGrades);
    } catch (error) {
      console.error("Erro ao buscar notas:", error);
      alert("Erro ao buscar notas.");
    } finally {
      setLoadingGrades(false);
    }
  };

  const handleEditClick = (grade) => {
    setEditingGrade(grade);
    setUpdatedGrades(grade.grades);
  };

  const handleGradeChange = (field, value) => {
    setUpdatedGrades((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!editingGrade) return;

    try {
      await updateGrade(
        userDetails.schoolId,
        selectedClass.id,
        selectedLesson.id,
        editingGrade.id,
        updatedGrades
      );
      alert("Nota atualizada com sucesso!");
      fetchGrades(selectedLesson.id); // Recarregar as notas
      setEditingGrade(null); // Fechar o modal
    } catch (error) {
      console.error("Erro ao atualizar nota:", error);
      alert("Erro ao atualizar nota.");
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col lg={12}>
          <Card>
            <CardBody>
              <h4 className="card-title mb-4" style={{ paddingTop: "4rem" }}>
                LISTA DE NOTAS
              </h4>

              {/* Seleção de Turma */}
              <FormGroup>
                <Label for="classSelect">Selecione a Turma</Label>
                <Input
                  type="select"
                  id="classSelect"
                  onChange={handleClassChange}
                  disabled={loadingClasses}
                >
                  <option value="">Selecione uma turma</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.className}
                    </option>
                  ))}
                </Input>
              </FormGroup>

              {/* Seleção de Aula */}
              {selectedClass && (
                <FormGroup>
                  <Label for="lessonSelect">Selecione a Aula</Label>
                  <Input
                    type="select"
                    id="lessonSelect"
                    onChange={handleLessonChange}
                    disabled={loadingLessons}
                  >
                    <option value="">Selecione uma aula</option>
                    {lessons
                      .filter(
                        (lesson) =>
                          userDetails?.role !== "professor" ||
                          lesson.teacher?.value === userDetails?.uid
                      )
                      .map((lesson) => (
                        <option key={lesson.id} value={lesson.id}>
                          {lesson.subject} - {lesson.room?.label || "Sem sala"}
                        </option>
                      ))}
                  </Input>
                </FormGroup>
              )}

              {/* Lista de Notas */}
              {selectedLesson && (
                <div className="mt-4">
                  <h5>Notas para {selectedLesson.subject}</h5>
                  {loadingGrades ? (
                    <p>Carregando notas...</p>
                  ) : grades.length === 0 ? (
                    <p>Nenhuma nota encontrada para esta aula.</p>
                  ) : (
                    <Table responsive bordered>
                      <thead>
                        <tr>
                          <th>Aluno</th>
                          <th>Unidade</th>
                          <th>Notas</th>
                          <th>Data</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grades.map((grade) => (
                          <tr key={grade.id}>
                            <td>{grade.studentName}</td>
                            <td>{grade.unit}</td>
                            <td>
                              {Object.entries(grade.grades).map(
                                ([field, value]) => (
                                  <div key={field}>
                                    {field}: {value}
                                  </div>
                                )
                              )}
                            </td>
                            <td>
                              {new Date(
                                grade.timestamp?.toDate()
                              ).toLocaleString()}
                            </td>
                            <td>
                              <Button
                                color="primary"
                                size="sm"
                                onClick={() => handleEditClick(grade)}
                              >
                                Editar
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Modal de Edição */}
      {editingGrade && (
        <Modal isOpen={!!editingGrade} toggle={() => setEditingGrade(null)}>
          <ModalHeader toggle={() => setEditingGrade(null)}>
            Editar Notas - {editingGrade.studentName}
          </ModalHeader>
          <ModalBody>
            {Object.entries(updatedGrades).map(([field, value]) => (
              <FormGroup key={field}>
                <Label>{field}</Label>
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => handleGradeChange(field, e.target.value)}
                  min="0"
                  max="10"
                />
              </FormGroup>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={() => setEditingGrade(null)}
              disabled={updatingGrade}
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              onClick={handleSaveChanges}
              disabled={updatingGrade}
            >
              {updatingGrade ? "Salvando..." : "Salvar"}
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </Container>
  );
};

export default GradesListPage;
