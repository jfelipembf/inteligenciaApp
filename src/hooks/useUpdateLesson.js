import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const useUpdateLesson = (classId, schoolId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateLesson = async (lessonId, updatedData) => {
    setLoading(true);
    setError(null);

    try {
      const lessonRef = firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .collection("classes")
        .doc(classId)
        .collection("lessons")
        .doc(lessonId);

      await lessonRef.update(updatedData);

      setLoading(false);
      return true; // Indica sucesso
    } catch (err) {
      console.error("Erro ao atualizar a aula:", err);
      setError(err.message);
      setLoading(false);
      return false; // Indica falha
    }
  };

  return { updateLesson, loading, error };
};

export default useUpdateLesson;
