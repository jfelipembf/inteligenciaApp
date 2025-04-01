import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const useFetchTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
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

        // Buscar professores com o mesmo schoolId
        const professorsSnapshot = await firebase
          .firestore()
          .collection("users")
          .where("schoolId", "==", schoolId) // Filtrar pelo schoolId
          .where("role", "==", "professor") // Filtrar pelo role de professor
          .get();

        const fetchedTeachers = professorsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            value: doc.id, // ID do professor
            label: data.personalInfo?.name || "Nome não disponível", // Nome do professor
            registatrion: data.registration || "Registro não disponível", // Registro do professor
          };
        });

        setTeachers(fetchedTeachers);
      } catch (err) {
        console.error("Erro ao buscar professores:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  return { teachers, loading, error };
};

export default useFetchTeachers;
