import React, { useState } from "react";
import { Table, Button, Input, FormGroup, Label } from "reactstrap";
import useClassData from "../../hooks/useClassData";
import useSaveGrades from "../../hooks/useSaveGrades";

const StudentsGrades = ({ lesson, classId }) => {
  const { students, loading: loadingStudents } = useClassData(classId);
  const { saveGrades, loading: savingGrades } = useSaveGrades();

  const [grades, setGrades] = useState({});
  const [unit, setUnit] = useState(""); // Unidade (ex: Unidade 1)
  const [year, setYear] = useState(new Date().getFullYear()); // Ano
  const [fields, setFields] = useState([{ name: "Prova", weight: 10 }]); // Campos personalizados

  const handleGradeChange = (studentId, fieldName, value) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [fieldName]: value,
      },
    }));
  };

  const handleAddField = () => {
    setFields((prev) => [...prev, { name: "", weight: 0 }]);
  };

  const handleFieldChange = (index, key, value) => {
    setFields((prev) =>
      prev.map((field, i) => (i === index ? { ...field, [key]: value } : field))
    );
  };

  const handleSave = async () => {
    try {
      const formattedGrades = {
        unit,
        year,
        subject: lesson.subject,
        teacher: lesson.teacher,
        grades,
      };
      await saveGrades(lesson.id, formattedGrades);
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

      {/* Unidade e Ano */}
      <FormGroup>
        <Label for="unit">Unidade</Label>
        <Input
          type="text"
          id="unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="Digite a unidade (ex: Unidade 1)"
        />
      </FormGroup>
      <FormGroup>
        <Label for="year">Ano</Label>
        <Input
          type="number"
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Digite o ano"
        />
      </FormGroup>

      {/* Campos Personalizados */}
      <h6>Campos de Avaliação</h6>
      <Table bordered>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Peso</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => (
            <tr key={index}>
              <td>
                <Input
                  type="text"
                  value={field.name}
                  onChange={(e) =>
                    handleFieldChange(index, "name", e.target.value)
                  }
                  placeholder="Ex: Trabalho, Prova"
                />
              </td>
              <td>
                <Input
                  type="number"
                  value={field.weight}
                  onChange={(e) =>
                    handleFieldChange(index, "weight", e.target.value)
                  }
                  placeholder="Peso"
                  min="0"
                  max="100"
                />
              </td>
              <td>
                <Button
                  color="danger"
                  size="sm"
                  onClick={() =>
                    setFields((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  Remover
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button color="secondary" onClick={handleAddField}>
        Adicionar Campo
      </Button>

      {/* Notas dos Alunos */}
      <h6 className="mt-4">Notas dos Alunos</h6>
      <Table responsive bordered>
        <thead>
          <tr>
            <th>Aluno</th>
            {fields.map((field, index) => (
              <th key={index}>{field.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              {fields.map((field, index) => (
                <td key={index}>
                  <Input
                    type="number"
                    value={grades[student.id]?.[field.name] || ""}
                    onChange={(e) =>
                      handleGradeChange(student.id, field.name, e.target.value)
                    }
                    placeholder={`Nota (${field.name})`}
                    min="0"
                    max="10"
                  />
                </td>
              ))}
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
