import React from "react";
import { Card, CardBody, Button, Row, Col, Spinner } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import useClassesByTeacher from "../../../hooks/useClassesByTeacher";
import useUser from "../../../hooks/useUser";

const TeacherClasses = () => {
  const { currentUser } = useUser();
  const teacherId = currentUser.uid;
  const { lessons, loading, error } = useClassesByTeacher(teacherId);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner color="primary" />
        <p>Carregando aulas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center my-5 text-danger">
        <p>Erro ao carregar aulas: {error}</p>
      </div>
    );
  }

  if (!lessons.length) {
    return (
      <div className="text-center my-5 text-muted">
        <p>Nenhuma aula encontrada.</p>
      </div>
    );
  }

  return (
    <Row className="mt-4">
      {lessons.map((lesson) => (
        <Col md={4} key={lesson.id} className="mb-4">
          <Card>
            <CardBody>
              <h5 className="mb-2">{lesson.subject || "Sem disciplina"}</h5>
              <p className="mb-1">
                <strong>Turma:</strong> {lesson.className || lesson.classId}
              </p>
              <p className="mb-1">
                <strong>Horário:</strong> {lesson.startTime} - {lesson.endTime}
              </p>
              <Button
                color="primary"
                onClick={() => navigate(`/classes/${lesson.classId}`)}
              >
                Ver Turma
              </Button>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default TeacherClasses;
