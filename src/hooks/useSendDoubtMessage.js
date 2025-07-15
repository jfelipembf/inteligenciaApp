import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import useUser from "./useUser";
import useCreatAlert from "./useCreateAlert";

export function useSendDoubtMessage(doubtId, destinatario) {
  const { userDetails } = useUser();
  const { sendAlert } = useCreatAlert();

  async function sendMessage(messageText) {
    if (!doubtId || !userDetails) return;
    const db = getFirestore();

    // Adiciona a mensagem
    const messagesRef = collection(
      db,
      `schools/${userDetails.schoolId}/doubts/${doubtId}/messages`
    );
    const messageRef = await addDoc(messagesRef, {
      remetente: {
        label: userDetails.displayName || userDetails.name || "Usuário",
        value: userDetails.uid,
      },
      destinatario,
      message: messageText,
      createdAt: serverTimestamp(),
    });

    // Busca os dados da dúvida
    const doubtRef = doc(
      db,
      `schools/${userDetails.schoolId}/doubts/${doubtId}`
    );
    const doubtSnap = await getDoc(doubtRef);
    const doubt = doubtSnap.exists()
      ? { id: doubtSnap.id, ...doubtSnap.data() }
      : null;

    // Envia alerta contextualizado para chat
    await sendAlert({
      notificationData: {
        title: `Nova mensagem no chat da dúvida: ${doubt?.doubt || "Dúvida"}`,
        message: `Você recebeu uma nova mensagem de ${
          userDetails.personalInfo.name || "Usuário"
        } no chat.`,
        description: `Mensagem: "${messageText}"`,
        type: "doubt",
        recipients: [destinatario.value],
      },
      userDetails,
      referenceId: messageRef.id,
      type: "doubt",
    });
  }

  return { sendMessage };
}
