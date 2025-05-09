import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useAuthContext } from "../contexts/AuthContext";
import { useClassContext } from "../contexts/ClassContext";

const useProfessorDashboard = () => {
  const { currentUser } = useAuthContext();
  const {
    classes,
    loading: loadingClasses,
    error: classError,
  } = useClassContext();
  const [teacherClassCount, setTeacherClassCount] = useState(0);
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [studentsLength, setStudentsLength] = useState(0);
  const [overallAverage, setOverallAverage] = useState(0);
  const [classAverages, setClassAverages] = useState({});
  const [studentAverages, setStudentAverages] = useState({});
  const [unitAverages, setUnitAverages] = useState({});
  const [studentsByClass, setStudentsByClass] = useState({});
  const [gradeDistribution, setGradeDistribution] = useState([0, 0, 0, 0, 0]);
  const [unitAveragesByClass, setUnitAveragesByClass] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherClasses = async () => {
      if (!currentUser?.uid || loadingClasses || !classes) return;

      setLoading(true);
      setError(null);

      try {
        let studentsPerClass = 0;
        let exams = 0;
        let count = 0;
        let totalStudents = 0;
        let totalGradesSum = 0;
        let totalGradesCount = 0;
        const classAveragesTemp = {};
        const studentAveragesTemp = {};
        const unitGrades = {};
        const studentsByClassTemp = {};
        const unitAveragesByClassTemp = {};

        for (const classItem of classes) {
          // Verificar se o professor está associado à classe
          const lessonsSnapshot = await firebase
            .firestore()
            .collection("schools")
            .doc(classItem.schoolId)
            .collection("classes")
            .doc(classItem.id)
            .collection("lessons")
            .where("teacher.value", "==", currentUser.uid)
            .get();

          if (!lessonsSnapshot.empty) {
            count++;
            teacherClasses.push(classItem);

            // Buscar os alunos da turma
            const studentsSnapshot = await firebase
              .firestore()
              .collection("schools")
              .doc(classItem.schoolId)
              .collection("classes")
              .doc(classItem.id)
              .collection("students")
              .get();

            studentsPerClass = studentsSnapshot.size;
            totalStudents += studentsPerClass;

            // Processar as notas
            let classGradesSum = 0;
            let classGradesCount = 0;

            for (const lessonDoc of lessonsSnapshot.docs) {
              const lessonId = lessonDoc.id;

              // Buscar as grades da subcollection
              const gradesSnapshot = await firebase
                .firestore()
                .collection("schools")
                .doc(classItem.schoolId)
                .collection("classes")
                .doc(classItem.id)
                .collection("lessons")
                .doc(lessonId)
                .collection("grades")
                .get();

              exams = gradesSnapshot.size / studentsPerClass;

              for (const gradeDoc of gradesSnapshot.docs) {
                const gradeData = gradeDoc.data();

                // Extrair o ID do aluno do formato do ID do documento
                const gradeDocId = gradeDoc.id;
                const studentId = gradeDocId.split("_")[1]; // Extrair o segundo ID (aluno)

                // Calcular a média das grades
                const gradeValues = Object.values(gradeData.grades || {}).map(
                  Number
                );
                const gradeSum = gradeValues.reduce((acc, val) => acc + val, 0);
                const gradeCount = gradeValues.length;

                classGradesSum += gradeSum;
                classGradesCount += gradeCount;

                totalGradesSum += gradeSum;
                totalGradesCount += gradeCount;

                // Calcular a média do aluno
                if (!studentAveragesTemp[studentId]) {
                  studentAveragesTemp[studentId] = { sum: 0, count: 0 };
                }
                console.log("grade sum: ", gradeDoc.studentName, gradeSum);
                console.log("grade count: ", studentId, gradeCount);
                studentAveragesTemp[studentId].sum += gradeSum;
                studentAveragesTemp[studentId].count += 1;
                console.log(
                  "studentAveragesTemp: ",
                  studentAveragesTemp[studentId]
                );

                // Calcular a média da unidade de uma turma
                const unit = gradeData.unit || "Sem Unidade"; // Usar "Sem Unidade" como fallback

                if (!unitAveragesByClassTemp[classItem.id]) {
                  unitAveragesByClassTemp[classItem.id] = {};
                }

                if (!unitAveragesByClassTemp[classItem.id][unit]) {
                  unitAveragesByClassTemp[classItem.id][unit] = {
                    sum: 0,
                    count: 0,
                  };
                }

                unitAveragesByClassTemp[classItem.id][unit].sum += gradeSum;
                unitAveragesByClassTemp[classItem.id][unit].count =
                  studentsPerClass;

                // Agrupar as notas por unidade
                if (!unitGrades[unit]) {
                  unitGrades[unit] = { sum: 0, count: 0 };
                }
                unitGrades[unit].sum += gradeSum;
                unitGrades[unit].count += gradeCount;
              }
            }

            console.log("unitAveragesByClassTemp: ", unitAveragesByClassTemp);
            // Calcular a média da unidade para cada turma
            for (const [classId, units] of Object.entries(
              unitAveragesByClassTemp
            )) {
              for (const [unit, { sum, count }] of Object.entries(units)) {
                unitAveragesByClassTemp[classId][unit].average =
                  count > 0 ? sum / count : 0;
              }
            }

            // Ordenar as unidades dentro de cada turma
            for (const [classId, units] of Object.entries(
              unitAveragesByClassTemp
            )) {
              const sortedUnits = Object.keys(units)
                .sort((a, b) => {
                  // Tentar ordenar numericamente, caso os nomes das unidades sejam números
                  const numA = parseInt(a.match(/\d+/)?.[0] || 0, 10);
                  const numB = parseInt(b.match(/\d+/)?.[0] || 0, 10);
                  return numA - numB;
                })
                .reduce((acc, key) => {
                  acc[key] = units[key];
                  return acc;
                }, {});

              unitAveragesByClassTemp[classId] = sortedUnits;
            }

            studentsByClassTemp[classItem.className] =
              studentsSnapshot.docs.map((studentDoc) => {
                const studentData = studentDoc.data();
                const studentId = studentDoc.id;

                return {
                  className: classItem.className,
                  name: studentData.name,
                  registration: studentData.registration,
                  average: studentAveragesTemp[studentId]?.sum
                    ? (
                        studentAveragesTemp[studentId].sum /
                        studentAveragesTemp[studentId].count
                      ).toFixed(1)
                    : 0, // Média do aluno
                };
              });

            // Calcular a média da turma
            classAveragesTemp[classItem.className] = classGradesCount
              ? classGradesSum / (studentsPerClass * exams)
              : 0;
          }
        }

        // Calcular a média geral de todas as turmas
        let overallAvg = 0;
        if (totalGradesCount > 0 && totalStudents > 0 && exams > 0) {
          overallAvg = totalGradesSum / (totalStudents * exams);
        }

        // Calcular a média de cada aluno
        const studentAveragesFinal = {};
        for (const [studentId, { sum, count }] of Object.entries(
          studentAveragesTemp
        )) {
          studentAveragesFinal[studentId] = count ? sum / count : 0;
        }

        // Calcular a média de cada unidade
        const unitAveragesFinal = {};

        // Iterar sobre as unidades e calcular a média
        for (const [unit, { sum }] of Object.entries(unitGrades)) {
          // A média é calculada como a soma das notas acumuladas na unidade
          // dividida pelo número total de alunos
          unitAveragesFinal[unit] = totalStudents > 0 ? sum / totalStudents : 0;
        }

        // Ordenar as unidades
        const sortedUnitAverages = Object.keys(unitAveragesFinal)
          .sort((a, b) => {
            // Tentar ordenar numericamente, caso os nomes das unidades sejam números
            const numA = parseInt(a.match(/\d+/)?.[0] || 0, 10);
            const numB = parseInt(b.match(/\d+/)?.[0] || 0, 10);
            return numA - numB;
          })
          .reduce((acc, key) => {
            acc[key] = unitAveragesFinal[key];
            return acc;
          }, {});

        // Calcular a distribuição cumulativa de alunos por faixas de notas na média
        const gradeDistributionTemp = [0, 0, 0, 0, 0];

        for (const student of Object.values(studentsByClassTemp).flat()) {
          const average = student.average || 0;

          if (average >= 0 && average < 2) {
            gradeDistributionTemp[0]++;
          } else if (average >= 2 && average < 4) {
            gradeDistributionTemp[1]++;
          } else if (average >= 4 && average < 6) {
            gradeDistributionTemp[2]++;
          } else if (average >= 6 && average < 8) {
            gradeDistributionTemp[3]++;
          } else if (average >= 8 && average <= 10) {
            gradeDistributionTemp[4]++;
          }
        }

        // Salvar as médias ordenadas por unidade
        setUnitAverages(sortedUnitAverages);
        console.log("Média por unidade (ordenada):", sortedUnitAverages);

        setTeacherClassCount(count);
        setStudentsLength(totalStudents);
        setOverallAverage(overallAvg);
        setClassAverages(classAveragesTemp);
        setStudentAverages(studentAveragesFinal);
        setStudentsByClass(studentsByClassTemp);
        setGradeDistribution(gradeDistributionTemp);
        setUnitAveragesByClass(unitAveragesByClassTemp);
        console.log("studensbyclass", studentsByClassTemp);
        console.log("Média por unidade:", unitAveragesFinal);
      } catch (err) {
        console.error("Erro ao buscar turmas do professor:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherClasses();
  }, [currentUser, classes, loadingClasses]);

  return {
    teacherClassCount,
    studentsLength,
    overallAverage,
    classAverages,
    studentAverages,
    unitAverages, // Retornar as médias por unidade
    teacherClasses,
    studentsByClass,
    gradeDistribution,
    unitAveragesByClass,
    loading,
    error,
  };
};

export default useProfessorDashboard;
