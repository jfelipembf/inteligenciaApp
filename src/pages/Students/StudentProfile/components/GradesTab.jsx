import React from "react";
import { Row, Col, Card, CardBody, Table, Spinner } from "reactstrap";
import useStudentGrades from "../../../../hooks/useStudentGrades";
import useUser from "../../../../hooks/useUser";

const GradesTab = ({ studentData }) => {
  const { userDetails } = useUser();
  if (!userDetails?.schoolId) {
    throw new Error("schoolId não encontrado no usuário.");
  }
  const schoolId = userDetails.schoolId;
  const classId = studentData?.academicInfo?.classId;
  const studentId = studentData?.id;

  const { gradesByUnit, loading } = useStudentGrades(
    schoolId,
    classId,
    studentId
  );

  // Extrair todas as unidades e subjects únicos
  const units = [...new Set(gradesByUnit.map((g) => g.unit))].sort((a, b) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    return numA - numB;
  });
  const subjects = [...new Set(gradesByUnit.map((g) => g.subject))];

  // Função para pegar a nota de um subject em uma unidade
  const getGrade = (subject, unit) => {
    const found = gradesByUnit.find(
      (g) => g.subject === subject && g.unit === unit
    );
    return found ? found.gradeSum : "-";
  };

  // Função para calcular média de um subject
  const getAverage = (subject) => {
    const grades = gradesByUnit
      .filter((g) => g.subject === subject)
      .map((g) => g.gradeSum);
    if (grades.length === 0) return "-";
    return (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1);
  };

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <Card>
            <CardBody>
              <h4 className="card-title mb-4">Boletim Escolar</h4>
              {loading ? (
                <div className="text-center my-4">
                  <Spinner color="primary" />
                </div>
              ) : (
                <div className="table-responsive">
                  <Table className="table-bordered mb-0">
                    <thead>
                      <tr className="bg-light">
                        <th>Disciplina</th>
                        {units.map((unit) => (
                          <th key={unit}>{unit}</th>
                        ))}
                        <th>Média</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((subject) => (
                        <tr key={subject}>
                          <td>{subject}</td>
                          {units.map((unit) => (
                            <td key={unit}>{getGrade(subject, unit)}</td>
                          ))}
                          <td>
                            <strong>{getAverage(subject)}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default GradesTab;
