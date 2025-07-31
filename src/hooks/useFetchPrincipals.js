import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import useUser from "./useUser";

const useFetchPrincipals = () => {
  const [principals, setPrincipals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userDetails } = useUser();
  const schoolId = userDetails?.schoolId;

  const fetchPrincipals = async () => {
    setLoading(true);
    setError(null);

    try {
      const principalsSnapshot = await firebase
        .firestore()
        .collection("users")
        .where("schoolId", "==", schoolId) // Filtrar pelo schoolId do usuário
        .where("role", "==", "principal") // Filtrar pelo role "principal"
        .get();

      const fetchedPrincipals = principalsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id, // ID do diretor
          value: doc.id, // ID para compatibilidade
          label: data.personalInfo?.name || "Nome não disponível", // Nome do diretor
          ...data,
        };
      });

      setPrincipals(fetchedPrincipals);
    } catch (err) {
      console.error("Erro ao buscar diretores:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrincipals();
  }, []);

  return { principals, loading, error, refetch: fetchPrincipals };
};

export default useFetchPrincipals;
