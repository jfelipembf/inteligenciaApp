import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const useCreateAlert = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Cria um alerta na coleção alerts.
   * @param {Object} params
   * @param {Object} params.notificationData - Dados da notificação (inclui type, recipients, description, etc)
   * @param {Object} params.userDetails - Usuário logado (com personalInfo, uid, schoolId)
   * @param {string} params.referenceId - ID de referência (ex: notificationRef.id)
   * @param {string} params.type - Tipo do alerta ("notification", "event", etc)
   */
  const sendAlert = async ({
    notificationData,
    userDetails,
    referenceId,
    type,
  }) => {
    setLoading(true);
    setError(null);

    try {
      if (!userDetails?.schoolId) throw new Error("schoolId não encontrado.");
      const schoolId = userDetails.schoolId;

      // Data/hora no horário de Brasília
      const now = new Date();
      const brTime = new Date(
        now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
      );

      const maxDescriptionLength = 60;
      let recipients = [];
      let description = "";

      if (type === "notification") {
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
          recipients = [userDetails.schoolId];
          description = `${userDetails.personalInfo?.name} enviou uma notificação para toda a escola`;
        } else if (notificationData.type === "turn") {
          let turn = "";
          if (notificationData.turn === "manha") {
            turn = "Manhã";
          } else if (notificationData.turn === "tarde") {
            turn = "Tarde";
          } else if (notificationData.turn === "noite") {
            turn = "Noite";
          }

          const classesSnapshot = await firebase
            .firestore()
            .collection("schools")
            .doc(schoolId)
            .collection("classes")
            .where("period", "==", turn)
            .get();

          let allStudentIds = [];
          for (const classDoc of classesSnapshot.docs) {
            const studentsSnapshot = await firebase
              .firestore()
              .collection("schools")
              .doc(schoolId)
              .collection("classes")
              .doc(classDoc.id)
              .collection("students")
              .get();
            const studentIds = studentsSnapshot.docs.map((doc) => doc.id);
            allStudentIds = allStudentIds.concat(studentIds);
          }
          recipients = Array.from(new Set(allStudentIds));
          description = `${userDetails.personalInfo?.name} enviou uma notificação para as turmas do turno da ${notificationData.turn}`;
        }
      }

      const alert = {
        title: notificationData.title,
        message: notificationData.message
          ? notificationData.message.slice(0, maxDescriptionLength) +
            (notificationData.message.length > maxDescriptionLength
              ? "..."
              : "")
          : "",
        description,
        type,
        sentBy: {
          label: userDetails.personalInfo?.name,
          value: userDetails.uid,
        },
        referenceId,
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
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  return { sendAlert, loading, error };
};

export default useCreateAlert;
