import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useAuthContext } from "../contexts/AuthContext";

const useSaveAttendance = () => {
  const { userDetails } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveAttendance = async (classId, lessonId, date, attendanceRecords) => {
    setLoading(true);
    setError(null);

    try {
      if (!userDetails?.schoolId) {
        throw new Error("schoolId não encontrado no usuário.");
      }

      const schoolId = userDetails.schoolId;

      const attendanceRef = firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .collection("classes")
        .doc(classId)
        .collection("lessons")
        .doc(lessonId)
        .collection("attendance");

      const attendanceDoc = {
        date: date,
        records: attendanceRecords.map((record) => ({
          studentId: record.studentId,
          studentName: record.studentName,
          status: record.status,
        })),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      await attendanceRef.add(attendanceDoc);

      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error("Erro ao salvar frequência:", err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return { saveAttendance, loading, error };
};

export default useSaveAttendance;
