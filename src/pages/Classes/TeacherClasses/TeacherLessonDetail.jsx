import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, Button, Spinner, Alert, Table } from "reactstrap";
import useClassesByTeacher from "../../../hooks/useClassesByTeacher";
import useUser from "../../../hooks/useUser";
import useClassData from "../../../hooks/useClassData";

import LessonGradestable from "./LessonGradesTable";

const TeacherLessonDetail = () => {
  const { lessonId } = useParams();
  const { currentUser } = useUser();
  const teacherId = currentUser.uid;
  const { lessons, loading, error } = useClassesByTeacher(teacherId);
  const [classId, setClassId] = useState(null);
  const { students, loading: loadingClass } = useClassData(classId);

  const navigate = useNavigate();

  // Encontrar a lesson e pegar o classId
  const lesson = lessons.find((l) => l.id === lessonId);

  useEffect(() => {
    if (lesson) setClassId(lesson.classId);
  }, [lesson]);

  if (loading || loadingClass) {
    return (
      <div className="text-center my-5">
        <Spinner color="primary" />
        <p>Carregando detalhes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert color="danger" className="my-5 text-center">
        Erro ao carregar detalhes: {error}
      </Alert>
    );
  }

  if (!lesson) {
    return (
      <Alert color="warning" className="my-5 text-center">
        Aula não encontrada.
      </Alert>
    );
  }

  return (
    <Card className="mt-4 mx-auto" style={{ maxWidth: 800 }}>
      <CardBody>
        <h3 className="mb-3">{lesson.subject || "Sem disciplina"}</h3>
        <p>
          <strong>Turma:</strong> {lesson.className || lesson.classId}
        </p>
        <p>
          <strong>Horário:</strong> {lesson.startTime} - {lesson.endTime}
        </p>

        <h5 className="mt-4 mb-3">Alunos da Turma</h5>
        <div className="table-responsive">
          <LessonGradestable
            students={students}
            subject={lesson.subject}
            classId={lesson.classId}
          />
        </div>

        <Button color="secondary" onClick={() => window.history.back()}>
          Voltar
        </Button>
      </CardBody>
    </Card>
  );
};

export default TeacherLessonDetail;
