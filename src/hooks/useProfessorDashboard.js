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
  const [studentsLength, setStudentsLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherClasses = async () => {
      if (!currentUser?.uid || loadingClasses || !classes) return;

      setLoading(true);
      setError(null);

      try {
        let count = 0;
        let totalStudents = 0;

        for (const classItem of classes) {
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

            const studentsSnapshot = await firebase
              .firestore()
              .collection("schools")
              .doc(classItem.schoolId)
              .collection("classes")
              .collection(classItem.id)
              .collection("students")
              .get();

            totalStudents += studentsSnapshot.size;
          }
        }

        setTeacherClassCount(count);
        setStudentsLength(totalStudents);
      } catch (err) {
        console.error("Erro ao buscar turmas do professor:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherClasses();
  }, [currentUser, classes, loadingClasses]);

  return { teacherClassCount, studentsLength, loading, error };
};

export default useProfessorDashboard;
