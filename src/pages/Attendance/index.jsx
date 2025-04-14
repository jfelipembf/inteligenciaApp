import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Table,
  Button,
  FormGroup,
  Label,
} from "reactstrap";
import Select from "react-select";
import Breadcrumb from "../../components/Common/Breadcrumb";
import useClassData from "../../hooks/useClassData";
import useTeacherLessons from "../../hooks/useTeacherLessons";
import useAttendanceManagement from "../../hooks/useAttendanceManagement";
import firebase from "firebase/compat/app";

const AttendancePage = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const currentUser = firebase.auth().currentUser;
  const teacherId = currentUser ? currentUser.uid : null;

  const { classes = [], loading: loadingClasses } = useClassData();
  const { lessons = [], loading: loadingLessons } = useTeacherLessons(
    selectedClass?.value,
    teacherId
  );
  const {
    initializeAttendance,
    saveAttendance,
    loading: savingAttendance,
  } = useAttendanceManagement();

  useEffect(() => {
    if (selectedLesson) {
      const students = classes.find(
        (classItem) => classItem.id === selectedClass?.value
      )?.students;
      setAttendanceData(initializeAttendance(students || []));
    }
  }, [selectedLesson, selectedClass, classes]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedClass || !selectedLesson) {
      alert("Selecione uma turma e uma aula.");
      return;
    }

    const result = await saveAttendance(
      selectedClass.value,
      selectedLesson.value,
      attendanceData
    );

    if (result.success) {
      alert("Presença salva com sucesso!");
    } else {
      alert(`Erro ao salvar presença: ${result.error}`);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Presença" breadcrumbItem="Registro de Presença" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Registro de Presença</h4>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Turma</Label>
                        <Select
                          options={classes.map((classItem) => ({
                            value: classItem.id,
                            label: classItem.className,
                          }))}
                          value={selectedClass}
                          onChange={setSelectedClass}
                          isDisabled={loadingClasses}
                          placeholder={
                            loadingClasses
                              ? "Carregando turmas..."
                              : "Selecione uma turma"
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Aula</Label>
                        <Select
                          options={lessons.map((lesson) => ({
                            value: lesson.id,
                            label: lesson.subject,
                          }))}
                          value={selectedLesson}
                          onChange={setSelectedLesson}
                          isDisabled={loadingLessons}
                          placeholder={
                            loadingLessons
                              ? "Carregando aulas..."
                              : "Selecione uma aula"
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  {selectedLesson && (
                    <div className="table-responsive mt-4">
                      <Table className="table-centered table-nowrap mb-0">
                        <thead>
                          <tr>
                            <th>Nome</th>
                            <th>Matrícula</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.values(attendanceData).map((student) => (
                            <tr key={student.studentId}>
                              <td>{student.studentName}</td>
                              <td>{student.registration}</td>
                              <td>
                                <Button
                                  color={
                                    student.status === "present"
                                      ? "success"
                                      : "outline-success"
                                  }
                                  onClick={() =>
                                    handleAttendanceChange(
                                      student.studentId,
                                      "present"
                                    )
                                  }
                                >
                                  Presente
                                </Button>
                                <Button
                                  color={
                                    student.status === "absent"
                                      ? "danger"
                                      : "outline-danger"
                                  }
                                  onClick={() =>
                                    handleAttendanceChange(
                                      student.studentId,
                                      "absent"
                                    )
                                  }
                                >
                                  Ausente
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <Button
                        color="primary"
                        className="mt-4"
                        onClick={handleSaveAttendance}
                        disabled={savingAttendance}
                      >
                        Salvar Presença
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AttendancePage;
