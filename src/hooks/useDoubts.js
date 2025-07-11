import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import useUser from "./useUser";

export function useDoubts() {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userDetails } = useUser();

  useEffect(() => {
    async function fetchDoubts() {
      setLoading(true);
      const db = getFirestore();
      const schoolId = userDetails?.schoolId;
      const userId = userDetails?.uid;
      if (!schoolId || !userId) {
        setDoubts([]);
        setLoading(false);
        return;
      }
      const doubtsRef = collection(db, `schools/${schoolId}/doubts`);
      const q = query(doubtsRef, where("destinatario.value", "==", userId));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDoubts(items);
      setLoading(false);
    }
    fetchDoubts();
  }, [userDetails?.schoolId, userDetails?.uid]);

  return { doubts, loading };
}
