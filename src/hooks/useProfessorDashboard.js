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
                console.log("gradeValues", gradeValues);
                const gradeSum = gradeValues.reduce((acc, val) => acc + val, 0);
                console.log("gradeSum", gradeSum);
                const gradeCount = gradeValues.length;
                console.log("gradeCount", gradeCount);

                classGradesSum += gradeSum;
                classGradesCount += gradeCount;

                totalGradesSum += gradeSum;
                console.log("totalgradesSum", totalGradesSum);
                totalGradesCount += gradeCount;
                console.log("totalGradesCount", totalGradesCount);

                // Calcular a média do aluno
                if (!studentAveragesTemp[studentId]) {
                  studentAveragesTemp[studentId] = { sum: 0, count: 0 };
                }
                studentAveragesTemp[studentId].sum += gradeSum;
                studentAveragesTemp[studentId].count += gradeCount;
              }
            }

            // Calcular a média da turma
            console.log("classaveragestemp", classAveragesTemp);
            classAveragesTemp[classItem.className] = classGradesCount
              ? classGradesSum / (studentsPerClass * exams)
              : 0;
          }
        }

        // Calcular a média geral de todas as turmas
        console.log("studantes por class", studentsPerClass);
        console.log("quantidade de unidades", exams);

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

        setTeacherClassCount(count);
        setStudentsLength(totalStudents);
        setOverallAverage(overallAvg);
        setClassAverages(classAveragesTemp);
        setStudentAverages(studentAveragesFinal);
        console.log("Classes do professor:", teacherClassCount);
        console.log("Total de alunos:", studentsLength);
        console.log("Média geral:", overallAverage);
        console.log("Média por turma:", classAverages);
        console.log("Média por aluno:", studentAverages);
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
    teacherClasses,
    loading,
    error,
  };
};

export default useProfessorDashboard;
