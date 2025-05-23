import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const useFetchAdministrators = () => {
  const [administrators, setAdministrators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdministrators = async () => {
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

        // Buscar administradores com o mesmo schoolId
        const administratorsSnapshot = await firebase
          .firestore()
          .collection("users")
          .where("schoolId", "==", schoolId) // Filtrar pelo schoolId
          .where("role", "==", "administrator") // Filtrar pelo role de administrador
          .get();

        const fetchedAdministrators = administratorsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            value: doc.id, // ID do administrador
            label: data.personalInfo?.name || "Nome não disponível", // Nome do administrador
            ...doc.data(),
          };
        });

        setAdministrators(fetchedAdministrators);
      } catch (err) {
        console.error("Erro ao buscar administradores:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdministrators();
  }, []);

  return { administrators, loading, error };
};

export default useFetchAdministrators;
