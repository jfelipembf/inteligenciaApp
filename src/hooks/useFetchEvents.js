import { useState, useEffect, useCallback } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import useUser from "./useUser";

const useFetchEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userDetails } = useUser();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!userDetails?.schoolId) {
        throw new Error("schoolId não encontrado no usuário.");
      }

      const schoolId = userDetails.schoolId;

      const eventsSnapshot = await firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .collection("events")
        .get();

      const fetchedEvents = eventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setEvents(fetchedEvents);
    } catch (err) {
      console.error("Erro ao buscar eventos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userDetails]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
};

export default useFetchEvents;
