import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const useFetchLessons = (classId) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      setError(null);

      try {
        const currentUser = firebase.auth().currentUser;

        if (!currentUser) {
          throw new Error("Usuário não autenticado");
        }

        // Buscar o schoolId do usuário
        const userDoc = await firebase
          .firestore()
          .collection("users")
          .doc(currentUser.uid)
          .get();

        const schoolId = userDoc.data().schoolId;

        if (!schoolId) {
          throw new Error("schoolId não encontrado para o usuário");
        }

        // Buscar as aulas da turma
        const lessonsSnapshot = await firebase
          .firestore()
          .collection("schools")
          .doc(schoolId)
          .collection("classes")
          .doc(classId)
          .collection("lessons")
          .get();

        const lessonsData = lessonsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLessons(lessonsData);
      } catch (err) {
        console.error("Erro ao buscar as aulas:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchLessons();
    }
  }, [classId]);

  return { lessons, loading, error };
};

export default useFetchLessons;
