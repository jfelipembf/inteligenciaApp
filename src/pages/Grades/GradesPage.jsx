import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { useClassContext } from "../../contexts/ClassContext";
import useFetchLessons from "../../hooks/useFetchLessons";
import StudentsGrades from "./StudentsGrades";
import useUser from "../../hooks/useUser";

const GradesPage = () => {
  const { userDetails } = useUser();
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const { classes, loading: loadingClasses } = useClassContext();
  console.log(selectedClass?.id);
  const { lessons, loading: loadingLessons } = useFetchLessons(
    selectedClass?.id
  );

  console.log(lessons);
  const handleClassChange = (e) => {
    const classId = e.target.value;
    const selected = classes.find((cls) => cls.id === classId);
    setSelectedClass(selected);
    setSelectedLesson(null); // Reset lesson when class changes
  };

  const handleLessonChange = (e) => {
    const lessonId = e.target.value;
    const selected = lessons.find((lesson) => lesson.id === lessonId);
    setSelectedLesson(selected);
  };

  return (
    <Container fluid>
      <Row>
        <Col lg={12}>
          <Card>
            <CardBody>
              <h4 className="card-title mb-4" style={{ paddingTop: "4rem" }}>
                ADICIONAR NOTAS
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
                    {console.log(userDetails?.uid)}

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

              {/* Componente de Notas */}
              {selectedLesson && (
                <StudentsGrades
                  lesson={selectedLesson}
                  classId={selectedClass.id}
                />
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GradesPage;
