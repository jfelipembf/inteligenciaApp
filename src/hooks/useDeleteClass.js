import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const useDeleteClass = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteClass = async (classId, schoolId) => {
    setLoading(true);
    setError(null);

    try {
      // Deletar a turma no Firestore
      await firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .collection("classes")
        .doc(classId)
        .delete();

      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error("Erro ao excluir a turma:", err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return { deleteClass, loading, error };
};

export default useDeleteClass;
