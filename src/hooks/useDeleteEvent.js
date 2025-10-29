import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import useUser from "./useUser";
import { useState } from "react";

const useDeleteEvent = () => {
  const { userDetails } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteEvent = async (eventId) => {
    setLoading(true);
    setError(null);

    try {
      if (!userDetails?.schoolId) {
        throw new Error("schoolId não encontrado.");
      }

      const schoolId = userDetails.schoolId;

      await firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .collection("events")
        .doc(eventId)
        .delete();

      console.log("Evento excluído com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir evento:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { deleteEvent, loading, error };
};

export default useDeleteEvent;
