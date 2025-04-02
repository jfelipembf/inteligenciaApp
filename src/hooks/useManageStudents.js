import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const useManageStudents = (classId, schoolId) => {
  const [availableStudents, setAvailableStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Buscar alunos com a role "student" e o mesmo schoolId
  const fetchAvailableStudents = async () => {
    setLoading(true);
    setError(null);

    try {
      const studentsSnapshot = await firebase
        .firestore()
        .collection("users")
        .where("role", "==", "aluno") // Certifique-se de que o valor "aluno" está correto
        .where("schoolId", "==", schoolId) // Filtrar pelo mesmo schoolId
        .get();

      const fetchedStudents = studentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAvailableStudents(fetchedStudents);
    } catch (err) {
      console.error("Erro ao buscar alunos disponíveis:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Adicionar alunos à subcoleção "students" da turma
  const addStudentsToClass = async (selectedStudents) => {
    setLoading(true);
    setError(null);

    try {
      const batch = firebase.firestore().batch();
      const classRef = firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .collection("classes")
        .doc(classId);

      selectedStudents.forEach((student) => {
        // Adicionar o estudante à subcoleção "students" da turma
        const studentRef = classRef.collection("students").doc(student.id);
        batch.set(studentRef, {
          id: student.id,
          name: student.personalInfo.name,
          registration: student.academicInfo.registration,
        });

        // Atualizar o campo "classId" no documento do estudante na coleção "users"
        const userRef = firebase
          .firestore()
          .collection("users")
          .doc(student.id);
        batch.update(userRef, {
          "academicInfo.classId": classId,
        });
      });

      await batch.commit();
    } catch (err) {
      console.error("Erro ao adicionar alunos à turma:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    availableStudents,
    fetchAvailableStudents,
    addStudentsToClass,
    loading,
    error,
  };
};

export default useManageStudents;
