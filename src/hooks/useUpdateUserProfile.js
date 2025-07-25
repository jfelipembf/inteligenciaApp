import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import useUser from "./useUser";
import uploadToFirebase from "../utils/uploadToFirebase";

const useUpdateUserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userDetails, refreshUserData } = useUser();
  const userUid = userDetails?.uid;
  const schoolId = userDetails?.schoolId;

  const updateUserProfile = async (data, profileImage) => {
    setLoading(true);
    setError(null);
    try {
      let avatarImage = null;
      if (profileImage) {
        const ext = profileImage.name.split(".").pop();
        const fileName = `${userUid}.${ext}`;
        await uploadToFirebase(
          profileImage,
          `profileImages`,
          schoolId,
          fileName
        );
        avatarImage = fileName;
      }

      if (!userDetails?.uid) throw new Error("Usuário não autenticado.");
      await firebase
        .firestore()
        .collection("users")
        .doc(userDetails.uid)
        .update({
          ...data,
          "personalInfo.avatar": avatarImage, // Adiciona avatarImage ao personalInfo
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
