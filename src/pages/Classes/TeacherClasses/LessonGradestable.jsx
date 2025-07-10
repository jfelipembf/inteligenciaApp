import React from "react";
import { Table, Spinner } from "reactstrap";
import useUser from "../../../../hooks/useUser";
import useStudentGrades from "../../../../hooks/useStudentGrades";

const LessonGradesTable = ({ students, subject, classId }) => {
  const { userDetails } = useUser();

  // Função para buscar as notas de cada aluno
  const getStudentGrades = (studentId) => {
    const { gradesByUnit, loading } = useStudentGrades(
      userDetails.schoolId,
      classId,
      studentId
    );
    return { gradesByUnit, loading };
  };

  // Extrair todas as unidades únicas presentes em todos os alunos
  const allUnits = [
    ...new Set(
      students
        .flatMap((student) => {
          const { gradesByUnit } = getStudentGrades(student.id);
          return gradesByUnit
            .filter((g) => g.subject === subject)
            .map((g) => g.unit);
        })
        .filter(Boolean)
    ),
  ].sort((a, b) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    return numA - numB;
  });

  // Função para pegar a nota de um aluno em uma unidade
  const getGrade = (gradesByUnit, unit) => {
    const found = gradesByUnit.find(
      (g) => g.subject === subject && g.unit === unit
    );
    return found ? found.gradeSum : "-";
  };

  // Função para calcular média do aluno
  const getAverage = (gradesByUnit) => {
    const grades = gradesByUnit
      .filter((g) => g.subject === subject)
      .map((g) => g.gradeSum);
    if (grades.length === 0) return "-";
    return (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1);
  };

  return (
    <div className="table-responsive">
      <Table className="table-bordered mb-0">
        <thead>
          <tr className="bg-light">
            <th>Aluno</th>
            <th>Matrícula</th>
            {allUnits.map((unit) => (
              <th key={unit}>{unit}</th>
            ))}
            <th>Média</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            const { gradesByUnit, loading } = getStudentGrades(student.id);
            if (loading) {
              return (
                <tr key={student.id}>
                  <td colSpan={allUnits.length + 3}>
                    <Spinner size="sm" color="primary" /> Carregando...
                  </td>
                </tr>
              );
            }
            return (
              <tr key={student.id}>
                <td>{student.personalInfo?.name || student.name}</td>
                <td>
                  {student.academicInfo?.registration || student.registration}
                </td>
                {allUnits.map((unit) => (
                  <td key={unit}>{getGrade(gradesByUnit, unit)}</td>
                ))}
                <td>
                  <strong>{getAverage(gradesByUnit)}</strong>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default LessonGradesTable;
