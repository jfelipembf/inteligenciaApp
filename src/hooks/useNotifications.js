import { useState, useCallback } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import useUser from "./useUser";

const PAGE_SIZE = 10;

const useNotifications = () => {
  const { userDetails } = useUser();
  const [sentNotifications, setSentNotifications] = useState([]);
  const [receivedNotifications, setReceivedNotifications] = useState([]);
  const [lastSentDoc, setLastSentDoc] = useState(null);
  const [lastReceivedDoc, setLastReceivedDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMoreSent, setHasMoreSent] = useState(true);
  const [hasMoreReceived, setHasMoreReceived] = useState(true);
  const [error, setError] = useState(null);

  // Buscar notificações enviadas
  const fetchSentNotifications = useCallback(
    async (reset = false) => {
      if (!userDetails?.schoolId || !userDetails?.uid) return;
      setLoading(true);
      setError(null);

      try {
        let query = firebase
          .firestore()
          .collection("schools")
          .doc(userDetails.schoolId)
          .collection("notifications")
          .where("sentBy.value", "==", userDetails.uid)
          .orderBy("createdAt", "desc")
          .limit(PAGE_SIZE);

        if (!reset && lastSentDoc) {
          query = query.startAfter(lastSentDoc);
        }

        const snapshot = await query.get();
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSentNotifications((prev) =>
          reset ? fetched : [...prev, ...fetched]
        );
        setLastSentDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMoreSent(snapshot.docs.length === PAGE_SIZE);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    },
    [userDetails?.schoolId, userDetails?.uid, lastSentDoc]
  );

  // Buscar notificações recebidas (apenas individuais)
  const fetchReceivedNotifications = useCallback(
    async (reset = false) => {
      if (!userDetails?.schoolId || !userDetails?.uid) return;
      setLoading(true);
      setError(null);

      try {
        let query = firebase
          .firestore()
          .collection("schools")
          .doc(userDetails.schoolId)
          .collection("notifications")
          .where("type", "==", "individual")
          .where("individual.value", "==", userDetails.uid)
          .orderBy("createdAt", "desc")
          .limit(PAGE_SIZE);

        if (!reset && lastReceivedDoc) {
          query = query.startAfter(lastReceivedDoc);
        }

        const snapshot = await query.get();
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setReceivedNotifications((prev) =>
          reset ? fetched : [...prev, ...fetched]
        );
        setLastReceivedDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMoreReceived(snapshot.docs.length === PAGE_SIZE);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    },
    [userDetails?.schoolId, userDetails?.uid, lastReceivedDoc]
  );

  // Buscar notificação por ID (mantém igual)
  const fetchNotificationById = useCallback(
    async (id) => {
      if (!userDetails?.schoolId || !id) return null;
      setLoading(true);
      setError(null);
      try {
        const doc = await firebase
          .firestore()
          .collection("schools")
          .doc(userDetails.schoolId)
          .collection("notifications")
          .doc(id)
          .get();
        setLoading(false);
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
      } catch (err) {
        setError(err.message);
        setLoading(false);
        return null;
      }
    },
    [userDetails?.schoolId]
  );

  const deleteNotificationById = useCallback(
    async (id) => {
      if (!userDetails?.schoolId || !id) return false;
      setLoading(true);
      setError(null);
      try {
        await firebase
          .firestore()
          .collection("schools")
          .doc(userDetails.schoolId)
          .collection("notifications")
          .doc(id)
          .delete();
        setLoading(false);
        return true;
      } catch (err) {
        setError(err.message);
        setLoading(false);
        return false;
      }
    },
    [userDetails?.schoolId]
  );

  const resetSentNotifications = useCallback(() => {
    setSentNotifications([]);
    setLastSentDoc(null);
    setHasMoreSent(true);
  }, []);

  const resetReceivedNotifications = useCallback(() => {
    setReceivedNotifications([]);
    setLastReceivedDoc(null);
    setHasMoreReceived(true);
  }, []);

  return {
    sentNotifications,
    receivedNotifications,
    deleteNotificationById,
    loading,
    error,
    hasMoreSent,
    hasMoreReceived,
    fetchSentNotifications,
    fetchReceivedNotifications,
    resetSentNotifications,
    resetReceivedNotifications,
    fetchNotificationById,
  };
};

export default useNotifications;
