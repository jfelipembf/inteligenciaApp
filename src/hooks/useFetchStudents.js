import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const useFetchStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
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
            value: doc.id, // ID do estudante
            label: data.personalInfo?.name || "Nome não disponível", // Nome do estudante
            ...doc.data(),
          };
        });

        setStudents(fetchedStudents);
      } catch (err) {
        console.error("Erro ao buscar estudantes:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return { students, loading, error };
};

export default useFetchStudents;
