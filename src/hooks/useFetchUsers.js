import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const useFetchUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const currentUser = firebase.auth().currentUser;
        if (!currentUser) {
          throw new Error("Usuário não autenticado");
        }

        // Buscar o schoolId do usuário autenticado
        const userDoc = await firebase
          .firestore()
          .collection("users")
          .doc(currentUser.uid)
          .get();
        const schoolId = userDoc.data().schoolId;

        if (!schoolId) {
          throw new Error("schoolId não encontrado para o usuário");
        }

        // Buscar usuários com o mesmo schoolId
        const usersSnapshot = await firebase
          .firestore()
          .collection("users")
          .where("schoolId", "==", schoolId) // Filtrar pelo schoolId
          .get();

        const fetchedUsers = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(fetchedUsers);
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};

export default useFetchUsers;
