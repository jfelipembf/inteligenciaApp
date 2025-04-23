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
} from "reactstrap";
import useFetchClasses from "../../hooks/useFetchClasses";
import useFetchLessons from "../../hooks/useFetchLessons";
import useUser from "../../hooks/useUser";
import firebase from "firebase/compat/app";

const GradesListPage = () => {
  const { userDetails } = useUser();
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loadingGrades, setLoadingGrades] = useState(false);

  const { classes, loading: loadingClasses } = useFetchClasses();
  const { lessons, loading: loadingLessons } = useFetchLessons(
    selectedClass?.id
  );

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

      setGrades(fetchedGrades);
    } catch (error) {
      console.error("Erro ao buscar notas:", error);
      alert("Erro ao buscar notas.");
    } finally {
      setLoadingGrades(false);
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col lg={12}>
          <Card>
            <CardBody>
              <h4 className="card-title mb-4" style={{ paddingTop: "4rem" }}>
                Visualizar Notas
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
                        (lesson) => lesson.teacher?.value === userDetails?.uid
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
    </Container>
  );
};

export default GradesListPage;
