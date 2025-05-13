import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useAuthContext } from "../contexts/AuthContext";

const useFetchAttendance = (classId, lessonId) => {
  const { userDetails } = useAuthContext();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!classId || !lessonId || !userDetails?.schoolId) {
        setAttendanceData([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const schoolId = userDetails.schoolId;

        // Buscar os documentos de frequência
        const attendanceSnapshot = await firebase
          .firestore()
          .collection("schools")
          .doc(schoolId)
          .collection("classes")
          .doc(classId)
          .collection("lessons")
          .doc(lessonId)
          .collection("attendance")
          .get();

        const fetchedAttendance = attendanceSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAttendanceData(fetchedAttendance);
      } catch (err) {
        console.error("Erro ao buscar frequências:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [classId, lessonId, userDetails?.schoolId]);

  return { attendanceData, loading, error };
};

export default useFetchAttendance;
