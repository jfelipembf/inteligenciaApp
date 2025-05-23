import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import useUser from "./useUser";

const useCreateNotification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userDetails } = useUser();

  const sendNotification = async (notificationData) => {
    setLoading(true);
    setError(null);
    console.log("sendnotification chamada");

    try {
      if (!userDetails?.schoolId) throw new Error("schoolId não encontrado.");
      const schoolId = userDetails.schoolId;

      // Data/hora no horário de Brasília
      const now = new Date();
      const brTime = new Date(
        now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
      );

      // Adiciona remetente e data de criação
      const notification = {
        ...notificationData,
        sentBy: {label: userDetails.personalInfo?.name,
          value: userDetails.uid
        },
        createdAt: brTime,
        status: "created",
      };

      console.log("schoolId", schoolId);
      await firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .collection("notifications")
        .add(notification);

      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error("Erro ao salvar notificação:", err);

      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  return { sendNotification, loading, error };
};

export default useCreateNotification;
