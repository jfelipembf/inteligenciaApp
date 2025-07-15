import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import useUser from "./useUser";

export function useDoubtMessages(doubtId) {
  const [messages, setMessages] = useState([]);
  const [doubt, setDoubt] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userDetails } = useUser();

  useEffect(() => {
    const db = getFirestore();
    const schoolId = userDetails?.schoolId;
    if (!schoolId || !doubtId) {
      setMessages([]);
      setDoubt(null);
      setLoading(false);
      return;
    }

    const messagesRef = collection(
      db,
      `schools/${schoolId}/doubts/${doubtId}/messages`
    );
    const q = query(messagesRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(items);
      setLoading(false);
    });

    // Busca a dúvida apenas uma vez
    const doubtRef = doc(db, `schools/${schoolId}/doubts/${doubtId}`);
    getDoc(doubtRef).then((doubtSnap) => {
      setDoubt(
        doubtSnap.exists() ? { id: doubtSnap.id, ...doubtSnap.data() } : null
      );
    });

    return () => unsubscribe();
  }, [userDetails?.schoolId, doubtId]);

  return { messages, doubt, loading };
}
