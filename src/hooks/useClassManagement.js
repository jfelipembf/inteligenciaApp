import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

export const useClassManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createClass = async (classData) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Iniciando criação da turma...");

      // Verificar se há um usuário autenticado
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

      // Gerar o className com base na série e na letra da turma
      const seriesLabel = classData.series?.label || "";
      const identifierLabel = classData.identifier?.label || "";
      const className = `${seriesLabel} - ${identifierLabel}`;

      // Preparar dados da turma
      const finalClassData = {
        ...classData,
        className, // Adiciona o className gerado
        schoolId,
        metadata: {
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          createdBy: currentUser.uid,
        },
      };

      console.log("Salvando dados da turma na escola:", schoolId);

      // Salvar a turma na subcoleção "classes" dentro da escola
      const classRef = await firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .collection("classes")
        .add(finalClassData);

      console.log("Turma criada com sucesso na escola:", classRef.id);

      setLoading(false);
      return { success: true, id: classRef.id };
    } catch (error) {
      console.error("Erro na criação da turma:", error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  return {
    createClass,
    loading,
    error,
  };
};
