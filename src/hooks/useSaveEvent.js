import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import useUser from "./useUser";

const useSaveEvent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userDetails } = useUser();

  const saveEvent = async (eventData) => {
    setLoading(true);
    setError(null);

    try {
      if (!userDetails?.schoolId) {
        throw new Error("schoolId não encontrado no usuário.");
      }

      const schoolId = userDetails.schoolId;

      // Referência para a subcoleção "events" dentro da escola
      const eventsRef = firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .collection("events");

      // Adicionar o evento ao Firestore
      const eventRef = await eventsRef.add({
        ...eventData,
        status: "Agendado",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      setLoading(false);
      return { success: true, id: eventRef.id };
    } catch (err) {
      console.error("Erro ao salvar evento:", err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return { saveEvent, loading, error };
};

export default useSaveEvent;
