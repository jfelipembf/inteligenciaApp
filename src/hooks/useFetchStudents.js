import { useState, useEffect, useCallback } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import useUser from "./useUser";

const useFetchStudents = (options = {}) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { skipInitialFetch = false } = options;
  const { userDetails } = useUser();

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        throw new Error("Usuário não autenticado");
      }

      // Buscar schoolId do usuário atual
      if (!userDetails?.schoolId) {
        throw new Error("schoolId não encontrado no usuário.");
      }

      const schoolId = userDetails.schoolId;

      // Buscar estudantes com o mesmo schoolId
      const studentsSnapshot = await firebase
        .firestore()
        .collection("users")
        .where("schoolId", "==", schoolId) // Filtrar pelo schoolId
        .where("role", "==", "aluno") // Filtrar pelo role de estudante
        .get();

      const fetchedStudents = studentsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id, // ID do estudante
          value: doc.id, // ID do estudante para compatibilidade
          label: data.personalInfo?.name || "Nome não disponível", // Nome do estudante
          ...doc.data(),
        };
      });

      setStudents(fetchedStudents);
      return fetchedStudents;
    } catch (err) {
      console.error("Erro ao buscar estudantes:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!skipInitialFetch) {
      fetchStudents().catch((err) => {
        // Erro já tratado dentro de fetchStudents
      });
    }
  }, [fetchStudents, skipInitialFetch]);

  return { students, loading, error, fetchStudents };
};

export default useFetchStudents;
