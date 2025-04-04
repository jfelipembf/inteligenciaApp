import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

export const useClassroomManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createClass = async (classId, classData) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Iniciando criação da aula...");

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

      // Preparar dados da aula
      const finalClassData = {
        ...classData,
        schoolId,
        metadata: {
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          createdBy: currentUser.uid,
        },
      };

      console.log("Salvando aula na subcoleção da turma:", classId);

      // Salvar a aula na subcoleção "lessons" dentro da turma
      const lessonRef = await firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .collection("classes")
        .doc(classId)
        .collection("lessons")
        .add(finalClassData);

      console.log("Aula criada com sucesso:", lessonRef.id);

      setLoading(false);
      return { success: true, id: lessonRef.id };
    } catch (error) {
      console.error("Erro na criação da aula:", error);
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

export default useClassroomManagement;
