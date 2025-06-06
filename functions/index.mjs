import admin from "firebase-admin";
import * as functions from "firebase-functions";
import { onSchedule } from "firebase-functions/v2/scheduler";
admin.initializeApp();

// Função utilitária para envio (reutilizável)
async function sendAlert(alert, alertRef) {
  // Busca usuários em lotes de 10
  if (Array.isArray(alert.recipients) && alert.recipients.length > 0) {
    const userDocs = await admin
      .firestore()
      .collection("users")
      .where(
        admin.firestore.FieldPath.documentId(),
        "in",
        alert.recipients.slice(0, 10)
      )
      .get();

    const tokens = userDocs.docs
      .map((doc) => doc.get("fcmToken"))
      .filter(Boolean);

    if (tokens.length > 0) {
      const message = {
        notification: {
          title: alert.description || alert.title || "Notificação", // description como title
          body: `${alert.title ? alert.title + ": " : ""}${
            alert.message || ""
          }`, // title + message como body
        },
        tokens,
      };
      await admin.messaging().sendEachForMulticast(message);
    }

    // Lotes adicionais
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
            admin.messaging().sendEachForMulticast({
              notification: {
                title: alert.description || alert.title || "Notificação",
                body: `${alert.title ? alert.title + ": " : ""}${
                  alert.message || ""
                }`,
              },
              tokens: batchTokens,
            })
          );
        }
      }
      await Promise.all(batches);
    }
  }
  // Marca como enviado
  if (alertRef) {
    await alertRef.update({ sent: true });
  }
}

// Função agendada
export const processScheduledAlerts = onSchedule(
  "every 5 minutes",
  async (event) => {
    const now = admin.firestore.Timestamp.now();
    const alertsSnap = await admin
      .firestore()
      .collectionGroup("alerts")
      .where("schedule", "<=", now)
      .where("sent", "==", null)
      .get();

    for (const doc of alertsSnap.docs) {
      const alert = doc.data();
      await sendAlert(alert, doc.ref);
    }
    return null;
  }
);

// Função onCreate (mantém para envio imediato se não for agendado)
export const sendAlertNotification = functions.firestore.onDocumentCreated(
  "schools/{schoolId}/alerts/{alertId}",
  async (event) => {
    const snap = event.data;
    const alert = snap.data();

    // Se existe schedule e ainda não chegou o horário, não envia agora
    if (alert.schedule && alert.schedule.toDate) {
      const scheduleDate = alert.schedule.toDate();
      if (scheduleDate > new Date()) {
        return null;
      }
    } else if (alert.schedule && alert.schedule._seconds) {
      const scheduleDate = new Date(alert.schedule._seconds * 1000);
      if (scheduleDate > new Date()) {
        return null;
      }
    }

    // Envia e marca como enviado
    await sendAlert(alert, snap.ref);
    return null;
  }
);
