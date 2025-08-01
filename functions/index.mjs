import admin from "firebase-admin";
import * as functions from "firebase-functions";
import { onSchedule } from "firebase-functions/v2/scheduler";
import cors from "cors";

admin.initializeApp();

const corsHandler = cors({ origin: true });

export const createUserWithDetails = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      // Verificar o método HTTP
      if (req.method !== "POST") {
        return res.status(405).send({ error: "Método não permitido" });
      }

      // Obter os dados do corpo da requisição
      const {
        email,
        password,
        userData,
        role,
        schoolId,
        createdBy,
        avatarImage,
      } = req.body;

      console.log("Dados recebidos na função:", {
        email,
        role,
        schoolId,
        createdBy,
        avatarImage,
      });

      if (!email || !password || !role || !schoolId || !createdBy) {
        return res
          .status(400)
          .send({ error: "Parâmetros inválidos fornecidos." });
      }

      // Criar o usuário no Firebase Authentication
      const userRecord = await admin.auth().createUser({
        email,
        password,
      });

      console.log("Usuário criado no Firebase Auth:", userRecord.uid);

      // Preparar os dados para o Firestore
      const finalUserData = {
        uid: userRecord.uid,
        role,
        schoolId,
        ...userData,
        personalInfo: {
          ...userData.personalInfo,
          email,
          avatar: avatarImage,
        },
        metadata: {
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          createdBy,
        },
      };

      // Salvar os dados no Firestore
      await admin
        .firestore()
        .collection("users")
        .doc(userRecord.uid)
        .set(finalUserData);

      console.log("Usuário salvo no Firestore com sucesso.");

      return res.status(200).send({ success: true, uid: userRecord.uid });
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return res.status(500).send({ error: "Erro ao criar usuário." });
    }
  });
});

export const createUserWithEmail = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      // Verificar o método HTTP
      if (req.method !== "POST") {
        return res.status(405).send({ error: "Método não permitido" });
      }

      // Obter os dados do corpo da requisição
      const { email, role, schoolId } = req.body;

      console.log("Dados recebidos na função:", { email, role, schoolId });

      if (!email || !role || !schoolId) {
        return res
          .status(400)
          .send({ error: "Parâmetros inválidos fornecidos." });
      }

      // Gerar uma senha aleatória
      const generatedPassword = Math.random().toString(36).slice(-8);

      // Criar o usuário no Firebase Authentication
      const userRecord = await admin.auth().createUser({
        email,
        password: generatedPassword,
      });

      // Adicionar o usuário ao Firestore
      await admin
        .firestore()
        .collection("users")
        .doc(userRecord.uid)
        .set({
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          personalInfo: { name: "Novo Colaborador", email },
          professionalInfo: {},
          address: {},
          role,
          schoolId,
          uid: userRecord.uid,
        });

      return res
        .status(200)
        .send({ success: true, message: "Usuário criado com sucesso!" });
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return res.status(500).send({ error: "Erro ao criar usuário." });
    }
  });
});

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
      let message;
      if (alert.type === "notification") {
        message = {
          notification: {
            title: alert.description || alert.title || "Notificação",
            body: `${alert.title ? alert.title + ": " : ""}${
              alert.message || ""
            }`,
          },
          tokens,
        };
      } else {
        message = {
          notification: {
            title: alert.title || "Notificação",
            body: `${alert.message || ""}${
              alert.description ? " - " + alert.description : ""
            }`,
          },
          tokens,
        };
      }
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

export const updateEventStatuses = onSchedule("every 1 hours", async () => {
  const db = admin.firestore();
  const schoolsSnapshot = await db.collection("schools").get();

  const now = new Date();

  const batch = db.batch();

  for (const schoolDoc of schoolsSnapshot.docs) {
    const eventsSnapshot = await schoolDoc.ref.collection("events").get();

    eventsSnapshot.docs.forEach((eventDoc) => {
      const eventData = eventDoc.data();

      // Combina a data de início com o horário de início
      const startDateTime = new Date(
        `${eventData.startDate}T${eventData.startTime}`
      );
      // Combina a data de término com o horário de término
      const endDateTime = new Date(`${eventData.endDate}T${eventData.endTime}`);

      let newStatus = eventData.status;

      if (now >= startDateTime && now <= endDateTime) {
        newStatus = "Em andamento";
      } else if (now > endDateTime) {
        newStatus = "Concluído";
      }

      if (newStatus !== eventData.status) {
        batch.update(eventDoc.ref, { status: newStatus });
      }
    });
  }

  await batch.commit();
  console.log("Status dos eventos atualizados com sucesso.");
});

export const cleanOldAlerts = onSchedule("every day 00:00", async () => {
  const now = new Date();
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(now.getMonth() - 1);

  const alertsSnap = await admin
    .firestore()
    .collectionGroup("alerts")
    .where("sent", "==", true)
    .where("createdAt", "<=", admin.firestore.Timestamp.fromDate(oneMonthAgo))
    .get();

  const batch = admin.firestore().batch();

  for (const doc of alertsSnap.docs) {
    const alert = doc.data();

    // Se for notification, tenta apagar a notification referenciada
    if (
      alert.type === "notification" &&
      alert.referenceId &&
      doc.ref.parent &&
      doc.ref.parent.parent
    ) {
      const schoolRef = doc.ref.parent.parent;
      const notificationRef = schoolRef
        .collection("notifications")
        .doc(alert.referenceId);
      batch.delete(notificationRef);
    }

    // Apaga o alert
    batch.delete(doc.ref);
  }

  if (!alertsSnap.empty) {
    await batch.commit();
    console.log(
      `Apagados ${alertsSnap.size} alerts antigos e notificações relacionadas.`
    );
  } else {
    console.log("Nenhum alert antigo para apagar.");
  }
  return null;
});
