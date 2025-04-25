import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import useUser from "./useUser";

const useUpdateEventStatuses = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userDetails } = useUser();

  const updateEventStatuses = async (eventsToUpdate) => {
    setLoading(true);
    setError(null);

    try {
      console.log("chmando firebase");
      const batch = firebase.firestore().batch();
      const schoolId = userDetails.schoolId;

      eventsToUpdate.forEach((event) => {
        const eventRef = firebase
          .firestore()
          .collection("schools")
          .doc(schoolId)
          .collection("events")
          .doc(event.id);

        batch.update(eventRef, { status: event.status });
      });

      await batch.commit();
    } catch (err) {
      console.error("Erro ao atualizar status dos eventos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { updateEventStatuses, loading, error };
};

export default useUpdateEventStatuses;
