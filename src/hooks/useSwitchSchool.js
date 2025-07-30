import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import useUser from "./useUser";

const useSwitchSchool = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userDetails } = useUser();

  const switchSchool = async (selectedSchoolId) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Cheguei aqui");
      // Verificar se o usuário tem o campo "schools"
      if (!userDetails?.schools || userDetails.schools.length === 0) {
        throw new Error("Nenhuma escola encontrada no objeto do usuário.");
      }

      // Encontrar a escola correspondente ao ID selecionado
      const selectedSchool = userDetails.schools.find(
        (school) => school.schoolId === selectedSchoolId
      );

      if (!selectedSchool) {
        throw new Error(
          "Escola selecionada não encontrada no objeto do usuário."
        );
      }

      // Atualizar os campos "schoolId" e "role" no Firestore
      const userRef = firebase
        .firestore()
        .collection("users")
        .doc(userDetails.uid);
      await userRef.update({
        schoolId: selectedSchool.schoolId,
        role: selectedSchool.role,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      console.log("Escola e role atualizados com sucesso!");
    } catch (err) {
      console.error("Erro ao trocar a escola:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { switchSchool, loading, error };
};

export default useSwitchSchool;
