import React, { useState } from "react";
import { Table, Button, Input } from "reactstrap";
import useClassData from "../../hooks/useClassData";
import useSaveGrades from "../../hooks/useSaveGrades";

const StudentsGrades = ({ lesson, classId }) => {
  const { students, loading: loadingStudents } = useClassData(classId);
  const { saveGrades, loading: savingGrades } = useSaveGrades();

  const [grades, setGrades] = useState({});

  const handleGradeChange = (studentId, value) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await saveGrades(lesson.id, grades);
      alert("Notas salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar notas:", error);
      alert("Erro ao salvar notas.");
    }
  };

  if (loadingStudents) {
    return <p>Carregando alunos...</p>;
  }

  return (
    <div>
      <h5 className="mb-4">Adicionar Notas para {lesson.subject}</h5>
      <Table responsive bordered>
        <thead>
          <tr>
            <th>Aluno</th>
            <th>Nota</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>
                <Input
                  type="number"
                  value={grades[student.id] || ""}
                  onChange={(e) =>
                    handleGradeChange(student.id, e.target.value)
                  }
                  placeholder="Digite a nota"
                  min="0"
                  max="10"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button color="primary" onClick={handleSave} disabled={savingGrades}>
        {savingGrades ? "Salvando..." : "Salvar Notas"}
      </Button>
    </div>
  );
};

export default StudentsGrades;
