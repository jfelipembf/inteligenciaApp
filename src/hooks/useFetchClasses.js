import { useState, useEffect, useCallback } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

export const useFetchClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
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

      const classesSnapshot = await firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .collection("classes")
        .get();

      const fetchedClasses = await Promise.all(
        classesSnapshot.docs.map(async (doc) => {
          const studentsSnapshot = await firebase
            .firestore()
            .collection("schools")
            .doc(schoolId)
            .collection("classes")
            .doc(doc.id)
            .collection("students")
            .get();

          return {
            id: doc.id,
            ...doc.data(),
            studentCount: studentsSnapshot.size,
          };
        })
      );

      setClasses(fetchedClasses);
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return { classes, loading, error, refetch: fetchClasses };
};

export default useFetchClasses;
