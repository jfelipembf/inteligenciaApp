import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Table,
  Input,
} from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useClassContext } from "../../contexts/ClassContext";
import { useLessonsContext } from "../../contexts/LessonContext";
import { useAuthContext } from "../../contexts/AuthContext";
import useFetchStudentsByClass from "../../hooks/useFetchStudentsByClass";

const NewAttendance = () => {
  const { classes, loading: loadingClasses } = useClassContext();
  const { lessons, setSelectedClassId } = useLessonsContext();
  const { userDetails } = useAuthContext();

  const [selectedClass, setSelectedClass] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [allowedDays, setAllowedDays] = useState([]);

  const {
    students,
    loading: loadingStudents,
    error,
  } = useFetchStudentsByClass(selectedClass);

  // Atualizar o contexto com a turma selecionada
  useEffect(() => {
    if (selectedClass) {
      setSelectedClassId(selectedClass);
    }
  }, [selectedClass, setSelectedClassId]);

  // Filtrar aulas do professor logado e extrair os dias permitidos
  useEffect(() => {
    if (lessons && userDetails?.uid) {
      const teacherLessons = lessons.filter(
        (lesson) => lesson.teacher?.value === userDetails.uid
      );
      setFilteredLessons(teacherLessons);

      // Extrair os dias permitidos (daysOfWeek) das aulas
      const days = teacherLessons.flatMap((lesson) =>
        lesson.daysOfWeek
          ? lesson.daysOfWeek.map((day) => day.label.toLowerCase())
          : []
      );
      setAllowedDays(days);
    }
  }, [lessons, userDetails]);

  // Função para desativar os dias não permitidos
  const isDayDisabled = (date) => {
    const dayOfWeek = date
      .toLocaleDateString("pt-BR", { weekday: "long" })
      .toLowerCase();
    return !allowedDays.includes(dayOfWeek);
  };
  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleSubmit = () => {
    const attendanceData = {
      classId: selectedClass,
      date: selectedDate,
      records: Object.values(attendance),
    };
    console.log("Attendance Data:", attendanceData);
    alert("Frequência criada com sucesso!");
  };

  return (
    <Container fluid style={{ paddingTop: "7%" }}>
      <Row className="mb-4">
        <Col>
          <Card>
            <CardBody>
              <CardTitle className="mb-4">Criar Frequência</CardTitle>
              <Row className="mb-3">
                <Col md={6}>
                  <label>Selecione a Turma</label>
                  <Input
                    type="select"
                    value={selectedClass || ""}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    disabled={loadingClasses}
                  >
                    <option value="">Selecione uma turma</option>
                    {classes.map((classItem) => (
                      <option key={classItem.id} value={classItem.id}>
                        {classItem.className}
                      </option>
                    ))}
                  </Input>
                </Col>
                <Col md={6}>
                  <label>Selecione a Data</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    filterDate={(date) => !isDayDisabled(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Selecione uma data"
                    className="form-control"
                  />
                </Col>
              </Row>
              {selectedClass && (
                <>
                  <Row className="mb-3">
                    <Col>
                      <label>Selecione a Aula</label>
                      <Input type="select">
                        <option value="">Selecione uma aula</option>
                        {filteredLessons.map((lesson) => (
                          <option key={lesson.id} value={lesson.id}>
                            {lesson.subject} -{" "}
                            {lesson.room?.label || "Sem sala"}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      {loadingStudents ? (
                        <p>Carregando estudantes...</p>
                      ) : error ? (
                        <p className="text-danger">
                          Erro ao carregar estudantes: {error}
                        </p>
                      ) : (
                        <Table className="table-centered table-nowrap mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Aluno</th>
                              <th>Presença</th>
                              <th>Falta</th>
                              <th>Falta Justificada</th>
                            </tr>
                          </thead>
                          <tbody>
                            {students.map((student) => (
                              <tr key={student.id}>
                                <td>{student.name}</td>
                                <td>
                                  <Button
                                    color={
                                      attendance[student.id]?.status ===
                                      "present"
                                        ? "success"
                                        : "secondary"
                                    }
                                    onClick={() =>
                                      handleStatusChange(student.id, "present")
                                    }
                                  >
                                    ✔️
                                  </Button>
                                </td>
                                <td>
                                  <Button
                                    color={
                                      attendance[student.id]?.status ===
                                      "absent"
                                        ? "danger"
                                        : "secondary"
                                    }
                                    onClick={() =>
                                      handleStatusChange(student.id, "absent")
                                    }
                                  >
                                    ❌
                                  </Button>
                                </td>
                                <td>
                                  <Button
                                    color={
                                      attendance[student.id]?.status ===
                                      "justified"
                                        ? "warning"
                                        : "secondary"
                                    }
                                    onClick={() =>
                                      handleStatusChange(
                                        student.id,
                                        "justified"
                                      )
                                    }
                                  >
                                    📝
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      )}
                    </Col>
                  </Row>
                </>
              )}
              <Row className="mt-4">
                <Col>
                  <Button
                    color="primary"
                    onClick={handleSubmit}
                    disabled={!selectedClass || !selectedDate}
                  >
                    Criar Frequência
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NewAttendance;
