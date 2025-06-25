import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import useUser from "./useUser";
import useClassesByTeacher from "./useClassesByTeacher";

const useTeacherProfileStatistics = (teacherId) => {
  const [classAverages, setClassAverages] = useState({});
  const [attendancePerClass, setAttendancePerClass] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userDetails } = useUser();
  const { classes: teacherClasses, loading: loadingClasses } =
    useClassesByTeacher(teacherId);

  useEffect(() => {
    if (!teacherId || !userDetails?.schoolId || loadingClasses) return;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const db = firebase.firestore();
        const schoolId = userDetails.schoolId;
        let classAveragesTemp = {};
        let attendancePerClassTemp = [];

        for (const classId in teacherClasses) {
          const classData = teacherClasses[classId];
          const className = classData.className;

          // Buscar apenas as lessons do professor
          const lessonsSnapshot = await db
            .collection("schools")
            .doc(schoolId)
            .collection("classes")
            .doc(classId)
            .collection("lessons")
            .where("teacher.value", "==", teacherId)
            .get();

          let classGradesSum = 0;
          let classGradesCount = 0;
          let studentsPerClass = 0;
          let exams = 0;
          let totalPresentes = 0;
          let totalEsperado = 0;

          // Buscar alunos da turma
          const studentsSnapshot = await db
            .collection("schools")
            .doc(schoolId)
            .collection("classes")
            .doc(classId)
            .collection("students")
            .get();
          studentsPerClass = studentsSnapshot.size;

          for (const lessonDoc of lessonsSnapshot.docs) {
            const lessonId = lessonDoc.id;

            // Attendance
            const attendanceSnapshot = await db
              .collection("schools")
              .doc(schoolId)
              .collection("classes")
              .doc(classId)
              .collection("lessons")
              .doc(lessonId)
              .collection("attendance")
              .get();

            for (const attendanceDoc of attendanceSnapshot.docs) {
              const attendanceData = attendanceDoc.data();
              if (Array.isArray(attendanceData.records)) {
                totalPresentes += attendanceData.records.filter(
                  (rec) => rec.status === "present"
                ).length;
                totalEsperado += attendanceData.records.length;
              }
            }

            // Grades
            const gradesSnapshot = await db
              .collection("schools")
              .doc(schoolId)
              .collection("classes")
              .doc(classId)
              .collection("lessons")
              .doc(lessonId)
              .collection("grades")
              .get();

            exams =
              studentsPerClass > 0 ? gradesSnapshot.size / studentsPerClass : 0;

            for (const gradeDoc of gradesSnapshot.docs) {
              const gradeData = gradeDoc.data();
              const gradeValues = Object.values(gradeData.grades || {}).map(
                Number
              );
              const gradeSum = gradeValues.reduce((acc, val) => acc + val, 0);
              const gradeCount = gradeValues.length;

              classGradesSum += gradeSum;
              classGradesCount += gradeCount;
            }
          }

          // Média da turma
          classAveragesTemp[className] =
            exams * studentsPerClass > 0
              ? classGradesSum / (exams * studentsPerClass)
              : 0;

          // Frequência da turma
          const frequencia =
            totalEsperado > 0 ? (totalPresentes / totalEsperado) * 100 : 0;

          attendancePerClassTemp.push({
            label: className,
            value: totalPresentes,
            frequencia: frequencia,
          });
        }

        setClassAverages(classAveragesTemp);
        setAttendancePerClass(attendancePerClassTemp);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [teacherId, userDetails?.schoolId, teacherClasses, loadingClasses]);

  return { classAverages, attendancePerClass, loading, error };
};

export default useTeacherProfileStatistics;
