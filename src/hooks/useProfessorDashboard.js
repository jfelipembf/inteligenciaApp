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
  const [unitAverages, setUnitAverages] = useState({}); // Novo estado para médias por unidade
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
        const unitGrades = {}; // Objeto para armazenar as notas por unidade

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
                studentAveragesTemp[studentId].sum += gradeSum;
                studentAveragesTemp[studentId].count += gradeCount;

                // Agrupar as notas por unidade
                const unit = gradeData.unit || "Sem Unidade"; // Usar "Sem Unidade" como fallback
                if (!unitGrades[unit]) {
                  unitGrades[unit] = { sum: 0, count: 0 };
                }
                unitGrades[unit].sum += gradeSum;
                unitGrades[unit].count += gradeCount;
              }
            }

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

        // Salvar as médias ordenadas por unidade
        setUnitAverages(sortedUnitAverages);
        console.log("Média por unidade (ordenada):", sortedUnitAverages);

        setTeacherClassCount(count);
        setStudentsLength(totalStudents);
        setOverallAverage(overallAvg);
        setClassAverages(classAveragesTemp);
        setStudentAverages(studentAveragesFinal);

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
    loading,
    error,
  };
};

export default useProfessorDashboard;
