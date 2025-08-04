import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import useUser from "./useUser"; // Importar o hook useUser

const useFetchUserById = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userDetails } = useUser(); // Obter os detalhes do usuário logado
  console.log("usefecth by id")

  useEffect(() => {
    console.log("chmando o hook");
    // Função para buscar o usuário
    const fetchUser = async () => {
      if (!userId) {
        setError("ID do usuário não fornecido.");
        setLoading(false);
        return;
      }

      if (!userDetails?.schoolId) {
        setError("schoolId não encontrado no usuário autenticado.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log(
          `Buscando usuário com ID: ${userId} e schoolId: ${userDetails.schoolId}`
        );
        const userDoc = await firebase
          .firestore()
          .collection("users")
          .doc(userId)
          .get();

        if (userDoc.exists) {
          const userData = userDoc.data();

          // Verificar se o usuário pertence à mesma escola
          if (userData.schoolId === userDetails.schoolId) {
            setUser({ id: userDoc.id, ...userData });
          } else {
            setError("Usuário não pertence à mesma escola.");
          }
        } else {
          setError("Usuário não encontrado.");
        }
      } catch (err) {
        console.error("Erro ao buscar usuário:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser(); // Chamar a função ao montar o componente
  }, [userId, userDetails?.schoolId]); // Dependências para refazer o fetch

  return { user, loading, error };
};

export default useFetchUserById;
