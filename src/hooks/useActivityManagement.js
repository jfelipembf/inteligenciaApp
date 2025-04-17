import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import useUser from "./useUser";
import { use } from "react";

export const useActivityManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userDetails } = useUser(true);

  const schoolId = userDetails?.schoolId || null;

  const createActivity = async (activityData) => {
    setLoading(true);
    setError(null);

    try {
      const activityWithFlag = {
        ...activityData,
        avaliation:
          activityData.score && Number(activityData.score) > 0 ? true : false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .collection("classes")
        .doc(activityData.class.id)
        .collection("lessons")
        .doc(activityData.subject.id)
        .collection("activities")
        .add(activityWithFlag);

      return { id: docRef.id, ...activityWithFlag };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateActivity = async (activityId, updatedData) => {
    setLoading(true);
    setError(null);

    try {
      const updatedWithFlag = {
        ...updatedData,
        avaliation:
          updatedData.score && Number(updatedData.score) > 0 ? true : false,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      await firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .collection("classes")
        .doc(updatedData.class.id)
        .collection("lessons")
        .doc(updatedData.subject.id)
        .collection("activities")
        .doc(activityId)
        .update(updatedWithFlag);

      return { id: activityId, ...updatedWithFlag };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getActivities = async () => {
    setLoading(true);
    setError(null);

    try {
      const classesSnapshot = await firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .collection("classes")
        .get();

      const allActivities = [];

      for (const classDoc of classesSnapshot.docs) {
        const classId = classDoc.id;

        const lessonsSnapshot = await firebase
          .firestore()
          .collection("schools")
          .doc(schoolId)
          .collection("classes")
          .doc(classId)
          .collection("lessons")
          .get();

        for (const lessonDoc of lessonsSnapshot.docs) {
          const subjectId = lessonDoc.id;

          const activitiesSnapshot = await firebase
            .firestore()
            .collection("schools")
            .doc(schoolId)
            .collection("classes")
            .doc(classId)
            .collection("lessons")
            .doc(subjectId)
            .collection("activities")
            .orderBy("createdAt", "desc")
            .get();

          activitiesSnapshot.forEach((activityDoc) => {
            allActivities.push({
              id: activityDoc.id,
              ...activityDoc.data(),
            });
          });
        }
      }

      return allActivities;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getActivityById = async (classId, subjectId, activityId) => {
    console.log("getActivityById chamado com IDs:", {
      classId,
      subjectId,
      activityId,
    });

    setLoading(true);
    setError(null);

    try {
      const doc = await firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .collection("classes")
        .doc(classId)
        .collection("lessons")
        .doc(subjectId)
        .collection("activities")
        .doc(activityId)
        .get();

      if (!doc.exists) throw new Error("Atividade não encontrada");

      console.log("Atividade encontrada:", doc.data());

      return { id: doc.id, ...doc.data() };
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (classId, subjectId, activityId) => {
    setLoading(true);
    setError(null);

    try {
      await firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .collection("classes")
        .doc(classId)
        .collection("lessons")
        .doc(subjectId)
        .collection("activities")
        .doc(activityId)
        .delete();

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createActivity,
    updateActivity,
    getActivities,
    getActivityById,
    deleteActivity,
    loading,
    error,
  };
};
