import admin from "firebase-admin";
import * as functions from "firebase-functions";
admin.initializeApp();

export const sendAlertNotification = functions.firestore.onDocumentCreated(
  "schools/{schoolId}/alerts/{alertId}",
  async (event) => {
    const snap = event.data;
    const alert = snap.data();
    // Se existe schedule e ainda não chegou o horário, não envia agora
    if (alert.schedule && alert.schedule.toDate) {
      const scheduleDate = alert.schedule.toDate();
      if (scheduleDate > new Date()) {
        // Opcional: pode agendar para depois usando Cloud Tasks ou outra função agendada
        return null;
      }
    } else if (alert.schedule && alert.schedule._seconds) {
      // Caso schedule seja um Timestamp do Firestore
      const scheduleDate = new Date(alert.schedule._seconds * 1000);
      if (scheduleDate > new Date()) {
        return null;
      }
    }

    // Envia para todos os recipients
    if (Array.isArray(alert.recipients) && alert.recipients.length > 0) {
      const userDocs = await admin
        .firestore()
        .collection("users")
        .where(
          admin.firestore.FieldPath.documentId(),
          "in",
          alert.recipients.slice(0, 10)
        ) // Firestore limita a 10 por consulta
        .get();

      const tokens = userDocs.docs
        .map((doc) => doc.get("fcmToken"))
        .filter(Boolean);

      if (tokens.length > 0) {
        const message = {
          notification: {
            title: alert.title || "Notificação",
            body: alert.message || alert.description || "",
          },
          tokens, // multicast
        };
        await admin.messaging().sendMulticast(message);
      }

      // Se houver mais de 10 recipients, envie em lotes
      if (alert.recipients.length > 10) {
        const batches = [];
        for (let i = 10; i < alert.recipients.length; i += 10) {
          const batchIds = alert.recipients.slice(i, i + 10);
          const batchDocs = await admin
            .firestore()
            .collection("users")
            .where(admin.firestore.FieldPath.documentId(), "in", batchIds)
            .get();
          const batchTokens = batchDocs.docs
            .map((doc) => doc.get("fcmToken"))
            .filter(Boolean);
          if (batchTokens.length > 0) {
            batches.push(
              admin.messaging().sendMulticast({
                notification: {
                  title: alert.title || "Notificação",
                  body: alert.message || alert.description || "",
                },
                tokens: batchTokens,
              })
            );
          }
        }
        await Promise.all(batches);
      }
    }

    return null;
  }
);
