import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

export const useFetchClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      setError(null);

      try {
        // Verificar se há um usuário autenticado
        const currentUser = firebase.auth().currentUser;
        if (!currentUser) {
          throw new Error("Usuário não autenticado");
        }

        // Buscar schoolId do usuário atual
        const userDoc = await firebase
          .firestore()
          .collection("users")
          .doc(currentUser.uid)
          .get();
        const schoolId = userDoc.data().schoolId;
        if (!schoolId) {
          throw new Error("schoolId não encontrado para o usuário");
        }

        // Buscar turmas da subcoleção "classes" dentro da escola
        const classesSnapshot = await firebase
          .firestore()
          .collection("schools")
          .doc(schoolId)
          .collection("classes")
          .get();

        const fetchedClasses = classesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setClasses(fetchedClasses);
      } catch (error) {
        console.error("Erro ao buscar turmas:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  return { classes, loading, error };
};
