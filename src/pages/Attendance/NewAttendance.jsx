import React, { useState, useEffect, useRef } from "react";
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
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale"; // Importa a localidade pt-BR
import { useClassContext } from "../../contexts/ClassContext";
import { useLessonsContext } from "../../contexts/LessonContext";
import { useAuthContext } from "../../contexts/AuthContext";
import useFetchStudentsByClass from "../../hooks/useFetchStudentsByClass";
import useSaveAttendance from "../../hooks/useSaveAttendance";

// Registra a localidade pt-BR no React DatePicker
registerLocale("pt-BR", ptBR);

const NewAttendance = () => {
  const [justificationFile, setJustificationFile] = useState({});

  const { classes, loading: loadingClasses } = useClassContext();
  const { lessons, setSelectedClassId } = useLessonsContext();
  const { userDetails } = useAuthContext();
  const { saveAttendance } = useSaveAttendance();

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [allowedDays, setAllowedDays] = useState([]);
  const fileInputRefs = useRef({});

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

  // Verificar se todos os alunos têm um status definido
  const allStudentsHaveStatus = () => {
    return students.every(
      (student) => attendance[student.id]?.status !== undefined
    );
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,

        justificationFileName:
          status === "justified"
            ? prev[studentId]?.justificationFileName
            : null,
      },
    }));
  };

  //Nova função para lidar com a seleção do arquivo//
  const handleFileSelect = (studentId, event) => {
    const file = event.target.files[0];
    if (file) {
      setJustificationFile((prev) => ({
        //Armazena o arquivo no estado local(para posterior upload real quando necessário) )
        ...prev,
        [studentId]: file,
      }));

      setAttendance((prev) => ({
        //Atualiza o estado de frequência com o nome e informação do arquivo
        ...prev,
        [studentId]: {
          ...prev[studentId],
          status: "justified",
          justificationFileName: file.name,
        },
      }));
    }
    event.target.value = null; // Reseta o input para permitir re-seleção do mesmo arquivo
  };

  //Função para acionar o clique no input file
  const triggerFileInput = (studentId) => {
    const fileInput = fileInputRefs.current[studentId];
    if (!fileInput) return;

    if (attendance[studentId]?.status === "justified" && fileInput.value) {
      handleStatusChange(studentId, "absent");
      fileInput.value = null;
    } else {
      fileInput.click();
    }
  };

  const handleSubmit = async () => {
    if (!selectedClass || !selectedLesson || !selectedDate) {
      alert("Por favor, selecione a turma, aula e data.");
      return;
    }

    // Formatar a data selecionada no calendário
    const formattedDate = selectedDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Criar os registros de frequência para os alunos
    const attendanceRecords = students.map((student) => ({
      studentId: student.id,
      studentName: student.name,
      status: attendance[student.id]?.status || "absent", // Padrão: "absent"

      justificationFileName:
        attendance[student.id]?.justificationFileName || null, // Nome do arquivo de justificativa, se houver
    }));
    try {
      // Chamar o hook para salvar a frequência no Firestore
      await saveAttendance(
        selectedClass,
        selectedLesson,
        formattedDate,
        attendanceRecords
      );
      alert("Frequência salva com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar frequência:", err);
      alert("Erro ao salvar frequência: " + err.message);
    }
  };

  return (
    <Container fluid style={{ paddingTop: "7%" }}>
      <Row className="mb-4">
        <Col>
          <Card>
            <CardBody>
              <CardTitle className="mb-4">Registrar Frequência</CardTitle>
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
                  <label>Selecione a Data</label>{" "}
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    filterDate={(date) => !isDayDisabled(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Selecione uma data"
                    className="form-control"
                    locale="pt-BR" // Define a localidade para pt-BR
                  />
                </Col>
              </Row>
              {selectedClass && (
                <>
                  <Row className="mb-3">
                    <Col>
                      <label>Selecione a Aula</label>
                      <Input
                        type="select"
                        value={selectedLesson || ""}
                        onChange={(e) => setSelectedLesson(e.target.value)}
                      >
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
                                    onClick={() => triggerFileInput(student.id)}
                                  >
                                    📝
                                  </Button>
                                  {attendance[student.id]
                                    ?.justificationFileName && (
                                    <span
                                      className="ms-2 text-muted"
                                      style={{ fontSize: "0.8em" }}
                                    >
                                      {
                                        attendance[student.id]
                                          ?.justificationFileName
                                      }
                                    </span>
                                  )}
                                  <input
                                    type="file"
                                    style={{ display: "none" }}
                                    ref={(el) =>
                                      (fileInputRefs.current[student.id] = el)
                                    }
                                    onChange={(e) =>
                                      handleFileSelect(student.id, e)
                                    }
                                    accept=".pdf,image/*"
                                  />
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
                    disabled={
                      !selectedClass ||
                      !selectedDate ||
                      !selectedLesson ||
                      !allStudentsHaveStatus()
                    }
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
