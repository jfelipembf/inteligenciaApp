import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  Button,
  Input,
  FormGroup,
  Label,
  FormFeedback,
} from "reactstrap";
import { toast } from "react-toastify";

const StudentsList = ({
  students,
  availableStudents,
  searchTerm,
  setSearchTerm,
  selectedStudents,
  setSelectedStudents,
  addStudentsToClass,
  removeStudentFromClass,
  setStudents,
  toggleAddStudentModal,
  toggleRemoveStudentModal,
  addStudentModal,
  removeStudentModal,
  studentToRemove,
  errors,
  setErrors,
  touched,
  setTouched,
}) => {
  // Validação de campos
  const validateField = (name, value) => {
    let error = "";
    
    if (name === "search" && !value) {
      error = "O termo de pesquisa é obrigatório";
    }
    
    return error;
  };

  // Manipulador de mudança de input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setSearchTerm(value);
    
    // Validar o campo
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Manipulador de blur de input
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Filtrar alunos disponíveis com base no termo de pesquisa
  const filteredStudents = availableStudents.filter((student) => {
    const searchTermLower = searchTerm.toLowerCase();
    const studentName = student.personalInfo?.name?.toLowerCase() || "";
    const studentRegistration = student.academicInfo?.registration?.toLowerCase() || "";
    return (
      studentName.includes(searchTermLower) || studentRegistration.includes(searchTermLower)
    );
  });

  // Adicionar aluno à lista de selecionados
  const handleSelectStudent = (student) => {
    if (!selectedStudents.some((s) => s.id === student.id)) {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  // Remover aluno da lista de selecionados
  const handleRemoveSelectedStudent = (studentId) => {
    setSelectedStudents(selectedStudents.filter((s) => s.id !== studentId));
  };

  // Salvar alunos selecionados na subcoleção "students" da turma
  const handleAddStudentsToClass = async () => {
    await addStudentsToClass(selectedStudents);
    toggleAddStudentModal();
    toast.success("Alunos adicionados com sucesso!");
  };

  // Remover aluno da subcoleção "students" no Firestore
  const handleConfirmRemoveStudent = async () => {
    if (!studentToRemove) return;

    try {
      await removeStudentFromClass(studentToRemove.id);
      
      // Atualizar a lista local de alunos
      setStudents((prev) =>
        prev.filter((student) => student.id !== studentToRemove.id)
      );

      toggleRemoveStudentModal(null);
      toast.success("Aluno removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover aluno:", error);
      toast.error("Erro ao remover aluno: " + error.message);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="bx bx-user-circle me-2"></i>
          Alunos
        </h5>
        <Button color="primary" size="sm" onClick={toggleAddStudentModal}>
          <i className="bx bx-plus me-1"></i>
          Adicionar Alunos
        </Button>
      </CardHeader>
      <CardBody>
        {students.length === 0 ? (
          <div className="text-center p-4">
            <i className="bx bx-user-x text-muted" style={{ fontSize: "3rem" }}></i>
            <p className="mt-2">Nenhum aluno matriculado nesta turma.</p>
            <Button color="primary" size="sm" onClick={toggleAddStudentModal}>
              Adicionar Alunos
            </Button>
          </div>
        ) : (
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th>Matrícula</th>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.registration || "N/A"}</td>
                  <td>{student.name || "N/A"}</td>
                  <td>
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => toggleRemoveStudentModal(student)}
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

export default StudentsList;
