import { useState, useEffect, useCallback } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import useUser from "./useUser";

export const useFetchClasses = (options = {}) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { skipInitialFetch = false } = options;
  const { userDetails } = useUser();

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Verificar se o Firebase está inicializado

      if (!userDetails?.schoolId) {
        throw new Error("schoolId não encontrado no usuário.");
      }

      const schoolId = userDetails.schoolId;

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
            value: doc.id, // ID da turma
            label: doc.data().className,
          };
        })
      );

      console.log("Dados das turmas encontrados:", fetchedClasses);

      setClasses(fetchedClasses);
      return fetchedClasses;
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
      console.log("Usando dados mockados devido a erro:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("Executando useEffect no useFetchClasses");

    if (!skipInitialFetch) {
      fetchClasses().catch((err) => {
        // Erro já tratado dentro de fetchClasses
        console.error("Erro no useEffect do useFetchClasses:", err);
      });
    }
  }, [fetchClasses, skipInitialFetch]);
  console.log("TURMAS", classes);

  return { classes, loading, error, fetchClasses, refetch: fetchClasses };
};

export default useFetchClasses;
