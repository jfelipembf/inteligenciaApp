import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  Button,
} from "reactstrap";
import { toast } from "react-toastify";

const LessonsList = ({
  lessons,
  setLocalLessons,
  updateLesson,
  removeLesson,
  toggleEditLessonModal,
  toggleRemoveLessonModal,
}) => {
  // Função para confirmar a remoção de uma aula
  const handleConfirmRemoveLesson = async (lessonToRemove) => {
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
  const handleUpdateLesson = async (lessonToEdit) => {
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

  return (
    <Card className="mb-4">
      <CardHeader className="bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="bx bx-book-open me-2"></i>
          Aulas
        </h5>
        <Button color="primary" size="sm">
          <i className="bx bx-plus me-1"></i>
          Adicionar Aula
        </Button>
      </CardHeader>
      <CardBody>
        {lessons.length === 0 ? (
          <div className="text-center p-4">
            <i className="bx bx-book-alt text-muted" style={{ fontSize: "3rem" }}></i>
            <p className="mt-2">Nenhuma aula cadastrada para esta turma.</p>
            <Button color="primary" size="sm">
              Adicionar Aula
            </Button>
          </div>
        ) : (
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th>Professor</th>
                <th>Sala</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr key={lesson.id}>
                  <td>{lesson.teacher?.label || "Não definido"}</td>
                  <td>{lesson.room?.label || "Não definida"}</td>
                  <td>
                    <Button
                      color="info"
                      size="sm"
                      className="me-1"
                      onClick={() => toggleEditLessonModal(lesson)}
                    >
                      <i className="bx bx-edit"></i>
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => toggleRemoveLessonModal(lesson)}
                    >
                      <i className="bx bx-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
};

export default LessonsList;
