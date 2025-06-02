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
        sentBy: {
          label: userDetails.personalInfo?.name,
          value: userDetails.uid,
        },
        createdAt: brTime,
        status: "created",
      };

      const notificationRef = await firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .collection("notifications")
        .add(notification);

      const maxDescriptionLength = 60;

      let recipients = [];
      let description = "";
      if (
        notificationData.type === "individual" &&
        notificationData.individual?.value
      ) {
        recipients = [notificationData.individual.value];
        description = `Você recebeu uma notificação de ${userDetails.personalInfo?.name}`;
      } else if (
        notificationData.type === "class" &&
        notificationData.class?.value
      ) {
        const studentsSnapshot = await firebase
          .firestore()
          .collection("schools")
          .doc(schoolId)
          .collection("classes")
          .doc(notificationData.class.value)
          .collection("students")
          .get();

        recipients = studentsSnapshot.docs.map((doc) => doc.id);

        if (notificationData.lesson?.label) {
          description = `${userDetails.personalInfo?.name} enviou uma notificação relativa a matéria de ${notificationData.lesson.label}`;
        } else {
          description = `${userDetails.personalInfo?.name} enviou uma notificação para a turma ${notificationData.class.label}`;
        }
      } else if (notificationData.type === "school") {
        recipients = userDetails.schoolId;
        description = `${userDetails.personalInfo?.name} enviou uma notificação para toda a escola`;
      }

      const alert = {
        title: notificationData.title,
        message: notificationData.description
          ? notificationData.description.slice(0, maxDescriptionLength) +
            (notificationData.description.length > maxDescriptionLength
              ? "..."
              : "")
          : "",
        description: description,
        type: "notification",
        sentBy: {
          label: userDetails.personalInfo?.name,
          value: userDetails.uid,
        },
        referenceId: notificationRef.id,
        createdAt: brTime,
        recipients: recipients || [],
        schedule: notificationData.schedule || null,
      };

      await firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .collection("alerts")
        .add(alert);

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
