import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import useUser from "./useUser";
import useCreatAlert from "./useCreateAlert";

const useSaveEvent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userDetails } = useUser();
  const { sendAlert } = useCreatAlert();

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

      const usersSnap = await firebase
        .firestore()
        .collection("users")
        .where("schoolId", "==", schoolId)
        .get();

      const recipients = usersSnap.docs.map((doc) => doc.id);

      // Enviar alerta para todos da escola
      await sendAlert({
        notificationData: {
          title: `Novo evento: ${eventData.name}`,
          message: `Um novo evento foi criado: ${eventData.name} (${eventData.startDate})`,
          description: `Evento criado por ${userDetails.personalInfo?.name}`,
          type: "event",
          recipients,
        },
        userDetails,
        referenceId: eventRef.id,
        type: "event",
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
