import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useAuthContext } from "../contexts/AuthContext";

const useFetchStudentsByClass = (selectedClassId) => {
  const { userDetails } = useAuthContext();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClassId || !userDetails?.schoolId) {
        setStudents([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const schoolId = userDetails.schoolId;

        const studentsSnapshot = await firebase
          .firestore()
          .collection("schools")
          .doc(schoolId)
          .collection("classes")
          .doc(selectedClassId)
          .collection("students")
          .get();

        const fetchedStudents = studentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setStudents(fetchedStudents);
      } catch (err) {
        console.error("Erro ao buscar estudantes:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedClassId, userDetails?.schoolId]);

  return { students, loading, error };
};

export default useFetchStudentsByClass;
