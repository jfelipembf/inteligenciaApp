import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import useUser from "./useUser";

const useClassesByTeacher = (teacherId) => {
  const [lessons, setLessons] = useState([]);
  const [classes, setClasses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userDetails } = useUser();

  useEffect(() => {
    if (!teacherId || !userDetails?.schoolId) {
      setLessons([]);
      setClasses({});
      setLoading(false);
      return;
    }

    const fetchLessons = async () => {
      setLoading(true);
      setError(null);

      try {
        const db = firebase.firestore();
        const schoolId = userDetails.schoolId;
        const classesSnapshot = await db
          .collection("schools")
          .doc(schoolId)
          .collection("classes")
          .get();

        let allLessons = [];
        let classesObj = {};

        for (const classDoc of classesSnapshot.docs) {
          const classData = classDoc.data();
          const classId = classDoc.id;
          const className = classData.className;

          const lessonsSnapshot = await db
            .collection("schools")
            .doc(schoolId)
            .collection("classes")
            .doc(classId)
            .collection("lessons")
            .where("teacher.value", "==", teacherId)
            .get();

          if (!lessonsSnapshot.empty) {
            classesObj[classId] = { classId, className, ...classData };
          }

          lessonsSnapshot.forEach((lessonDoc) => {
            allLessons.push({
              id: lessonDoc.id,
              ...lessonDoc.data(),
              className,
              classId,
            });
          });
        }

        setLessons(allLessons);
        setClasses(classesObj);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [teacherId, userDetails?.schoolId]);

  return { lessons, classes, loading, error };
};

export default useClassesByTeacher;
