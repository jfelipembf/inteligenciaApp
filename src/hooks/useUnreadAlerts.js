import { useState, useCallback, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import useUser from "./useUser";

const useUserUnreadAlerts = () => {
  const { userDetails } = useUser();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    if (!userDetails?.schoolId || !userDetails?.uid) return;
    const snapshot = await firebase
      .firestore()
      .collection("schools")
      .doc(userDetails.schoolId)
      .collection("alerts")
      .where("recipients", "array-contains", userDetails.uid)
      .orderBy("createdAt", "desc")
      .get();

    const unreadAlerts = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter(
        (alert) => !alert.readBy || alert.readBy[userDetails.uid] === false
      );

    setAlerts(unreadAlerts);
    setLoading(false);
  }, [userDetails]);

  const markAlertAsRead = async (alertId) => {
    if (!userDetails?.schoolId || !userDetails?.uid) return;
    await firebase
      .firestore()
      .collection("schools")
      .doc(userDetails.schoolId)
      .collection("alerts")
      .doc(alertId)
      .update({ [`readBy.${userDetails.uid}`]: true });

    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return { alerts, loading, markAlertAsRead, fetchAlerts };
};

export default useUserUnreadAlerts;
