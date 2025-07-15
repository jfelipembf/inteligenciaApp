import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import useUser from "./useUser";

export function useSendDoubtMessage(doubtId, destinatario) {
  const { userDetails } = useUser();

  async function sendMessage(messageText) {
    if (!doubtId || !userDetails) return;
    const db = getFirestore();
    const messagesRef = collection(
      db,
      `schools/${userDetails.schoolId}/doubts/${doubtId}/messages`
    );
    await addDoc(messagesRef, {
      remetente: {
        label: userDetails.displayName || userDetails.name || "Usuário",
        value: userDetails.uid,
      },
      destinatario,
      message: messageText,
      createdAt: serverTimestamp(),
    });
  }

  return { sendMessage };
}
