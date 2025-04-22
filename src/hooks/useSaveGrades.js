import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import useUser from "./useUser";

const useSaveGrades = () => {
  const [loading, setLoading] = useState(false);
  const { userDetails } = useUser();

  const saveGrades = async (lessonId, classId, formattedGrades) => {
    setLoading(true);
    try {
      const { unit, year, subject, teacher, grades } = formattedGrades;

      const batch = firebase.firestore().batch();
      const gradesRef = firebase
        .firestore()
        .collection("schools")
        .doc(userDetails?.schoolId)
        .collection("classes")
        .doc(classId)
        .collection("lessons")
        .doc(lessonId)
        .collection("grades");

      // Gerar um identificador único para o conjunto de notas
      const uniqueId = firebase.firestore().collection("_").doc().id;

      Object.entries(grades).forEach(([studentId, studentData]) => {
        const { name, grades: studentGrades } = studentData; // Extrair nome e notas do aluno
        const gradeRef = gradesRef.doc(`${uniqueId}_${studentId}`); // Documento único para cada aluno
        batch.set(gradeRef, {
          studentId, // ID do aluno
          studentName: name, // Nome do aluno
          unit,
          subject,
          teacher,
          grades: studentGrades, // Notas do aluno
          timestamp: firebase.firestore.FieldValue.serverTimestamp(), // Adicionar timestamp
        });
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
