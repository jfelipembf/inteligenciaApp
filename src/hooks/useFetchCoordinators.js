import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const useFetchCoordinators = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoordinators = async () => {
      setLoading(true);
      setError(null);

      try {
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

        // Buscar coordenadores com o mesmo schoolId
        const coordinatorsSnapshot = await firebase
          .firestore()
          .collection("users")
          .where("schoolId", "==", schoolId) // Filtrar pelo schoolId
          .where("role", "==", "coordinator") // Filtrar pelo role de coordenador
          .get();

        const fetchedCoordinators = coordinatorsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            value: doc.id, // ID do coordenador
            label: data.personalInfo?.name || "Nome não disponível", // Nome do coordenador
            ...doc.data(),
          };
        });

        setCoordinators(fetchedCoordinators);
      } catch (err) {
        console.error("Erro ao buscar coordenadores:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinators();
  }, []);

  return { coordinators, loading, error };
};

export default useFetchCoordinators;
