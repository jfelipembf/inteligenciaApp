import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const useUpdateGrade = () => {
  const [loading, setLoading] = useState(false);

  const updateGrade = async (
    schoolId,
    classId,
    lessonId,
    gradeId,
    updatedGrades
  ) => {
    setLoading(true);
    try {
      const gradeRef = firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .collection("classes")
        .doc(classId)
        .collection("lessons")
        .doc(lessonId)
        .collection("grades")
        .doc(gradeId);

      await gradeRef.update({
        grades: updatedGrades,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

      setLoading(false);
    } catch (error) {
      console.error("Erro ao atualizar nota:", error);
      setLoading(false);
      throw error;
    }
  };

  return { updateGrade, loading };
};

export default useUpdateGrade;
