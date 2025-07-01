import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import useUser from "./useUser";

const useUpdateUserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userDetails, refreshUserData } = useUser();

  const updateUserProfile = async (data) => {
    setLoading(true);
    setError(null);
    try {
      if (!userDetails?.uid) throw new Error("Usuário não autenticado.");
      await firebase
        .firestore()
        .collection("users")
        .doc(userDetails.uid)
        .update({
          ...data,
          "metadata.updatedAt": firebase.firestore.FieldValue.serverTimestamp(),
        });
      await refreshUserData();
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  return { updateUserProfile, loading, error };
};

export default useUpdateUserProfile;
