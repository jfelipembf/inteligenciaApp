import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const useTeacherLessons = (classId, teacherId) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherLessons = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!classId || !teacherId) {
          setLessons([]);
          return;
        }

        const currentUser = firebase.auth().currentUser;
        if (!currentUser) {
          throw new Error("Usuário não autenticado");
        }

        const userDoc = await firebase
          .firestore()
          .collection("users")
          .doc(currentUser.uid)
          .get();
        const schoolId = userDoc.data().schoolId;

        if (!schoolId) {
          throw new Error("schoolId não encontrado para o usuário");
        }

        const lessonsSnapshot = await firebase
          .firestore()
          .collection("schools")
          .doc(schoolId)
          .collection("classes")
          .doc(classId)
          .collection("lessons")
          .where("teacher.value", "==", teacherId)
          .get();

        const fetchedLessons = lessonsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLessons(fetchedLessons);
      } catch (err) {
        console.error("Erro ao buscar aulas do professor:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherLessons();
  }, [classId, teacherId]);

  return { lessons, loading, error };
};

export default useTeacherLessons;
