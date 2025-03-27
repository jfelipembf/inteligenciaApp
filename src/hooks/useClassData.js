import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const useClassData = (classId) => {
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassData = async () => {
      setLoading(true);
      setError(null);

      try {
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

        // Buscar dados da turma específica
        const classDoc = await firebase
          .firestore()
          .collection("schools")
          .doc(schoolId)
          .collection("classes")
          .doc(classId)
          .get();

        if (!classDoc.exists) {
          throw new Error("Turma não encontrada");
        }

        const classData = classDoc.data();

        // Buscar alunos da turma (se houver uma subcoleção "students")
        const studentsSnapshot = await firebase
          .firestore()
          .collection("schools")
          .doc(schoolId)
          .collection("classes")
          .doc(classId)
          .collection("students")
          .get();

        const fetchedStudents = studentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setClassData(classData);
        setStudents(fetchedStudents);
      } catch (error) {
        console.error("Erro ao buscar dados da turma:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchClassData();
    }
  }, [classId]);

  return { classData, students, setStudents, loading, error };
};

export default useClassData;
