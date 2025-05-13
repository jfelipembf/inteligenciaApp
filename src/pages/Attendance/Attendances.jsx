import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Input,
  Table,
  Button,
  Collapse,
} from "reactstrap";
import { useClassContext } from "../../contexts/ClassContext";
import { useLessonsContext } from "../../contexts/LessonContext";
import useFetchAttendance from "../../hooks/useFetchAttendance";
import { useAuthContext } from "../../contexts/AuthContext";

const Attendances = () => {
  const { classes, loading: loadingClasses } = useClassContext();
  const { lessons, setSelectedClassId } = useLessonsContext();

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [expandedStudent, setExpandedStudent] = useState(null); // Aluno expandido
  const { userDetails } = useAuthContext();

  const { attendanceData, loading, error } = useFetchAttendance(
    selectedClass,
    selectedLesson
  );

  useEffect(() => {
    if (lessons && userDetails?.uid) {
      // Filtrar apenas as aulas do professor logado
      const teacherLessons = lessons.filter(
        (lesson) => lesson.teacher?.value === userDetails.uid
      );
      setFilteredLessons(teacherLessons);
    }
  }, [lessons, userDetails?.uid]);

  // Calcular presenças por aluno
  const attendanceSummary = attendanceData.reduce((summary, record) => {
    record.records.forEach((studentRecord) => {
      if (!summary[studentRecord.studentId]) {
        summary[studentRecord.studentId] = {
          studentName: studentRecord.studentName,
          presentCount: 0,
          totalCount: 0,
          details: [],
        };
      }
      summary[studentRecord.studentId].totalCount += 1;
      if (studentRecord.status === "present") {
        summary[studentRecord.studentId].presentCount += 1;
      }
      summary[studentRecord.studentId].details.push({
        date: record.date,
        status: studentRecord.status,
      });
    });
    return summary;
  }, {});

  const toggleStudent = (studentId) => {
    setExpandedStudent((prev) => (prev === studentId ? null : studentId));
  };

  return (
    <Container fluid style={{ paddingTop: "7%" }}>
      <Row className="mb-4">
        <Col>
          <Card>
            <CardBody>
              <CardTitle className="mb-4">Relatório de Frequências</CardTitle>
              <Row className="mb-3">
                <Col md={6}>
                  <label>Selecione a Turma</label>
                  <Input
                    type="select"
                    value={selectedClass || ""}
                    onChange={(e) => {
                      setSelectedClass(e.target.value);
                      setSelectedClassId(e.target.value);
                    }}
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
                  <label>Selecione a Aula</label>
                  <Input
                    type="select"
                    value={selectedLesson || ""}
                    onChange={(e) => setSelectedLesson(e.target.value)}
                    disabled={!selectedClass}
                  >
                    <option value="">Selecione uma aula</option>
                    {filteredLessons.map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>
                        {lesson.subject} - {lesson.room?.label || "Sem sala"}
                      </option>
                    ))}
                  </Input>
                </Col>
              </Row>
              {loading ? (
                <p>Carregando frequências...</p>
              ) : error ? (
                <p className="text-danger">
                  Erro ao carregar frequências: {error}
                </p>
              ) : (
                <Table className="table-centered table-nowrap mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "40%" }}>Aluno</th>
                      <th style={{ width: "40%" }}>Presenças</th>
                      <th style={{ width: "20%" }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(attendanceSummary).map(
                      ([studentId, summary]) => (
                        <React.Fragment key={studentId}>
                          <tr>
                            <td>{summary.studentName}</td>
                            <td>
                              {summary.presentCount}/{summary.totalCount}
                            </td>
                            <td>
                              <Button
                                color="primary"
                                onClick={() => toggleStudent(studentId)}
                              >
                                {expandedStudent === studentId
                                  ? "Fechar"
                                  : "Detalhes"}
                              </Button>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="3">
                              <Collapse isOpen={expandedStudent === studentId}>
                                <Table className="table-centered table-nowrap mb-0">
                                  <tbody>
                                    {summary.details.map((detail, index) => (
                                      <tr key={index}>
                                        <td style={{ width: "40%" }}>
                                          {detail.date}
                                        </td>
                                        <td style={{ width: "60%" }}>
                                          {detail.status === "present" && (
                                            <span title="Presente">✔️</span>
                                          )}
                                          {detail.status === "absent" && (
                                            <span title="Falta">❌</span>
                                          )}
                                          {detail.status === "justified" && (
                                            <span title="Falta Justificada">
                                              📝
                                            </span>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              </Collapse>
                            </td>
                          </tr>
                        </React.Fragment>
                      )
                    )}
                  </tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Attendances;
