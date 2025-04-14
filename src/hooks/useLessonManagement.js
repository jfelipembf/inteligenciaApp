import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const useLessonManagement = (classId, schoolId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Adicionar uma nova aula à turma
  const addLesson = async (lessonData) => {
    setLoading(true);
    setError(null);

    try {
      const lessonRef = await firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .collection("classes")
        .doc(classId)
        .collection("lessons")
        .add({
          ...lessonData,
          metadata: {
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdBy: firebase.auth().currentUser?.uid || "unknown",
          },
        });

      setLoading(false);
      return { success: true, id: lessonRef.id };
    } catch (err) {
      console.error("Erro ao adicionar aula:", err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Atualizar uma aula existente
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

      await lessonRef.update({
        ...updatedData,
        metadata: {
          ...updatedData.metadata,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedBy: firebase.auth().currentUser?.uid || "unknown",
        },
      });

      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error("Erro ao atualizar a aula:", err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Remover uma aula
  const removeLesson = async (lessonId) => {
    setLoading(true);
    setError(null);

    try {
      await firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .collection("classes")
        .doc(classId)
        .collection("lessons")
        .doc(lessonId)
        .delete();

      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error("Erro ao remover aula:", err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return {
    addLesson,
    updateLesson,
    removeLesson,
    loading,
    error,
  };
};

export default useLessonManagement;
