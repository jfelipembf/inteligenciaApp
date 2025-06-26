import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const useStudentGrades = (schoolId, classId, studentId) => {
  const [gradesByUnit, setGradesByUnit] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!schoolId || !classId || !studentId) return;

    const cacheKey = `grades_${schoolId}_${classId}_${studentId}`;

    const fetchGrades = async () => {
      setLoading(true);

      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setGradesByUnit(JSON.parse(cached));
        setLoading(false);
        return;
      }

      const db = firebase.firestore();
      const lessonsRef = db
        .collection("schools")
        .doc(schoolId)
        .collection("classes")
        .doc(classId)
        .collection("lessons");

      const lessonsSnap = await lessonsRef.get();
      const result = [];

      for (const lessonDoc of lessonsSnap.docs) {
        const lessonData = lessonDoc.data();

        const subject = lessonData.subject || "";

        // Buscar todas as grades do aluno nesta unidade
        const gradesSnap = await firebase
          .firestore()
          .collection("schools")
          .doc(schoolId)
          .collection("classes")
          .doc(classId)
          .collection("lessons")
          .doc(lessonDoc.id)
          .collection("grades")
          .where("studentId", "==", studentId)
          .get();

        gradesSnap.forEach((gradeDoc) => {
          const gradeData = gradeDoc.data();
          const unit = gradeData.unit;
          const gradesDict = gradeData.grades || {};
          // Somatório dos valores do dicionário de notas
          const gradeSum = Object.values(gradesDict).reduce(
            (acc, val) => acc + (isNaN(val) ? 0 : Number(val)),
            0
          );
          result.push({
            unit,
            subject,
            gradeSum,
          });
        });
      }

      localStorage.setItem(cacheKey, JSON.stringify(result));

      setGradesByUnit(result);
      setLoading(false);
    };

    fetchGrades();
  }, [schoolId, classId, studentId]);

  return { gradesByUnit, loading };
};

export default useStudentGrades;
