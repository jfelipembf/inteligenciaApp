import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const useAttendanceManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Inicializar dados de presença para os alunos
  const initializeAttendance = (students) => {
    const attendance = {};
    students.forEach((student) => {
      attendance[student.id] = {
        studentId: student.id,
        studentName: student.name,
        registration: student.registration,
        status: "absent", // Padrão é ausente (X)
        justification: "",
      };
    });
    return attendance;
  };

  // Salvar dados de presença no Firestore
  const saveAttendance = async (classId, lessonId, attendanceData) => {
    setLoading(true);
    setError(null);

    try {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        throw new Error("Usuário não autenticado");
      }

      const userDoc = await firebase
        .firestore()
        .collection("users")
        .doc(currentUser.uid)
        .get();
      const schoolId = userDoc.data().schoolId;

      if (!schoolId) {
        throw new Error("schoolId não encontrado para o usuário");
      }

      const attendanceForStorage = {
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: currentUser.uid,
        attendanceRecords: Object.values(attendanceData),
      };

      await firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .collection("classes")
        .doc(classId)
        .collection("lessons")
        .doc(lessonId)
        .collection("attendance")
        .add(attendanceForStorage);

      return { success: true };
    } catch (err) {
      console.error("Erro ao salvar presença:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { initializeAttendance, saveAttendance, loading, error };
};

export default useAttendanceManagement;
