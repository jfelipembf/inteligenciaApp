import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const useUpdateClass = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateClass = async (classId, schoolId, updatedData) => {
    setLoading(true);
    setError(null);

    try {
      // Atualizar os dados da turma no Firestore
      await firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .collection("classes")
        .doc(classId)
        .update(updatedData);

      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error("Erro ao atualizar a turma:", err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return { updateClass, loading, error };
};

export default useUpdateClass;
