import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const useSaveGrades = () => {
  const [loading, setLoading] = useState(false);

  const saveGrades = async (lessonId, grades) => {
    setLoading(true);
    try {
      const batch = firebase.firestore().batch();
      const gradesRef = firebase
        .firestore()
        .collection("lessons")
        .doc(lessonId)
        .collection("grades");

      Object.entries(grades).forEach(([studentId, grade]) => {
        const gradeRef = gradesRef.doc(studentId);
        batch.set(gradeRef, { grade: parseFloat(grade) });
      });

      await batch.commit();
    } catch (error) {
      console.error("Erro ao salvar notas:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { saveGrades, loading };
};

export default useSaveGrades;
