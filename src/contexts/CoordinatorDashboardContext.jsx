import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
} from "react";
import { useStudentsContext } from "./StudentsContext";
import { useClassContext } from "./ClassContext";
import useFetchUsers from "../hooks/useFetchUsers";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const CoordinatorContext = createContext();

export const useCoordinatorContext = () => {
  const context = useContext(CoordinatorContext);
  if (!context) {
    throw new Error(
      "useCoordinatorContext deve ser usado dentro de um CoordinatorProvider"
    );
  }
  return context;
};

export const CoordinatorDashboardProvider = ({ children }) => {
  const { students, loading: loadingStudents } = useStudentsContext();
  const { classes, loading: loadingClasses } = useClassContext();
  const { users, loading: loadingUsers } = useFetchUsers();

  const [classAverages, setClassAverages] = useState({});
  const [unitAverages, setUnitAverages] = useState({});
  const [studentAverages, setStudentAverages] = useState({});
  const [studentsByClass, setStudentsByClass] = useState({});
  const [gradeDistribution, setGradeDistribution] = useState([0, 0, 0, 0, 0]);
  const [unitAveragesByClass, setUnitAveragesByClass] = useState({});
  const [gradeDistributionByClass, setGradeDistributionByClass] = useState({});
  const [loadingExtra, setLoadingExtra] = useState(true);
  const [error, setError] = useState(null);

  // Professores
  const teachers = useMemo(
    () => users.filter((user) => user.role === "professor"),
    [users]
  );

  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalClasses = classes.length;
  let studentsPerClass = 0;

  // Média geral dos alunos
  const averageGrade = useMemo(
    () =>
      students.reduce((acc, student) => acc + (student.average || 0), 0) /
      (totalStudents || 1),
    [students, totalStudents]
  );

  // Taxa de aprovação
  const approvedStudents = students.filter(
    (student) => (student.average || 0) >= 7
  ).length;
  const approvalRate = (approvedStudents / (totalStudents || 1)) * 100;

  // Top alunos
  const topStudents = useMemo(
    () =>
      [...students]
        .sort((a, b) => (b.average || 0) - (a.average || 0))
        .slice(0, 5),
    [students]
  );

  // Top professores
  const topTeachers = useMemo(() => teachers.slice(0, 5), [teachers]);

  // Buscar e processar todas as aulas e notas de todas as turmas
  useEffect(() => {
    const fetchAllLessonsAndGrades = async () => {
      setLoadingExtra(true);
      setError(null);

      try {
        const db = firebase.firestore();
        let classAveragesTemp = {};
        let studentAveragesTemp = {};
        let studentsByClassTemp = {};
        let unitAveragesTemp = {};
        let unitAveragesByClassTemp = {};
        let gradeDistributionTemp = [0, 0, 0, 0, 0];
        let gradeDistributionByClassTemp = {};
        let exams = 0;

        for (const classItem of classes) {
          // Buscar alunos da turma
          const studentsSnapshot = await db
            .collection("schools")
            .doc(classItem.schoolId)
            .collection("classes")
            .doc(classItem.id)
            .collection("students")
            .get();

          studentsPerClass = studentsSnapshot.size;

          const studentsList = studentsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          studentsByClassTemp[classItem.className] = studentsList;

          // Buscar todas as lessons da turma
          const lessonsSnapshot = await db
            .collection("schools")
            .doc(classItem.schoolId)
            .collection("classes")
            .doc(classItem.id)
            .collection("lessons")
            .get();

          let classGradesSum = 0;
          let classGradesCount = 0;
          let unitGrades = {};
          let unitGradesByClass = {};

          for (const lessonDoc of lessonsSnapshot.docs) {
            const lessonId = lessonDoc.id;
            // Buscar grades da lesson
            const gradesSnapshot = await db
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
              const gradeValues = Object.values(gradeData.grades || {}).map(
                Number
              );
              const gradeSum = gradeValues.reduce((acc, val) => acc + val, 0);
              const gradeCount = gradeValues.length;

              classGradesSum += gradeSum;
              classGradesCount += gradeCount;

              // Média por unidade
              const unit = gradeData.unit || "Sem Unidade";
              if (!unitGrades[unit]) unitGrades[unit] = { sum: 0, count: 0 };
              unitGrades[unit].sum += gradeSum;
              unitGrades[unit].count += gradeCount;

              // Média por unidade por turma
              if (!unitGradesByClass[unit])
                unitGradesByClass[unit] = { sum: 0, count: 0 };
              unitGradesByClass[unit].sum += gradeSum;
              unitGradesByClass[unit].count += gradeCount;

              // Média por aluno
              const studentId = gradeData.studentId;
              if (!studentAveragesTemp[studentId])
                studentAveragesTemp[studentId] = { sum: 0, count: 0 };
              studentAveragesTemp[studentId].sum += gradeSum;
              studentAveragesTemp[studentId].count += gradeCount;

              // Distribuição de notas geral
              const avg = gradeCount > 0 ? gradeSum / gradeCount : 0;
              if (avg >= 0 && avg < 2) gradeDistributionTemp[0]++;
              else if (avg >= 2 && avg < 4) gradeDistributionTemp[1]++;
              else if (avg >= 4 && avg < 6) gradeDistributionTemp[2]++;
              else if (avg >= 6 && avg < 8) gradeDistributionTemp[3]++;
              else if (avg >= 8 && avg <= 10) gradeDistributionTemp[4]++;

              // Distribuição de notas por turma
              if (!gradeDistributionByClassTemp[classItem.id])
                gradeDistributionByClassTemp[classItem.id] = [0, 0, 0, 0, 0];
              if (avg >= 0 && avg < 2)
                gradeDistributionByClassTemp[classItem.id][0]++;
              else if (avg >= 2 && avg < 4)
                gradeDistributionByClassTemp[classItem.id][1]++;
              else if (avg >= 4 && avg < 6)
                gradeDistributionByClassTemp[classItem.id][2]++;
              else if (avg >= 6 && avg < 8)
                gradeDistributionByClassTemp[classItem.id][3]++;
              else if (avg >= 8 && avg <= 10)
                gradeDistributionByClassTemp[classItem.id][4]++;
            }
          }

          // Média da turma
          classAveragesTemp[classItem.className] =
            exams * studentsPerClass > 0
              ? classGradesSum / (exams * studentsPerClass)
              : 0;

          // Média por unidade geral
          for (const [unit, { sum, count }] of Object.entries(unitGrades)) {
            if (!unitAveragesTemp[unit])
              unitAveragesTemp[unit] = { sum: 0, count: 0 };
            unitAveragesTemp[unit].sum += sum;
            unitAveragesTemp[unit].count += count;
          }

          // Média por unidade por turma
          unitAveragesByClassTemp[classItem.id] = {};
          for (const [unit, { sum, count }] of Object.entries(
            unitGradesByClass
          )) {
            unitAveragesByClassTemp[classItem.id][unit] =
              count > 0 ? sum / count : 0;
          }
        }

        // Média por unidade geral
        const unitAveragesFinal = {};
        for (const [unit, { sum, count }] of Object.entries(unitAveragesTemp)) {
          unitAveragesFinal[unit] = count > 0 ? sum / count : 0;
        }

        // Média por aluno
        const studentAveragesFinal = {};
        for (const [studentId, { sum, count }] of Object.entries(
          studentAveragesTemp
        )) {
          studentAveragesFinal[studentId] = count > 0 ? sum / count : 0;
        }

        setClassAverages(classAveragesTemp);
        setUnitAverages(unitAveragesFinal);
        setStudentAverages(studentAveragesFinal);
        setStudentsByClass(studentsByClassTemp);
        setGradeDistribution(gradeDistributionTemp);
        setUnitAveragesByClass(unitAveragesByClassTemp);
        setGradeDistributionByClass(gradeDistributionByClassTemp);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingExtra(false);
      }
    };

    if (classes.length > 0) {
      fetchAllLessonsAndGrades();
    }
  }, [classes]);

  const loading =
    loadingStudents || loadingClasses || loadingUsers || loadingExtra;

  const value = {
    students,
    classes,
    teachers,
    users,
    loading,
    totalStudents,
    totalTeachers,
    totalClasses,
    averageGrade,
    approvalRate,
    classAverages,
    unitAverages,
    studentAverages,
    studentsByClass,
    gradeDistribution,
    unitAveragesByClass,
    gradeDistributionByClass,
    topStudents,
    topTeachers,
    error,
  };

  return (
    <CoordinatorContext.Provider value={value}>
      {children}
    </CoordinatorContext.Provider>
  );
};
