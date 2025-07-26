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
      let avatarImage = userDetails?.personalInfo?.avatar || null; // Mantém o avatar atual por padrão

      // Fazer upload da imagem, se fornecida
      if (profileImage instanceof File) {
        const ext = profileImage.name.split(".").pop();
        const fileName = `${userUid}.${ext}`;
        await uploadToFirebase(
          profileImage,
          `profileImages`,
          schoolId,
          fileName
        );
        avatarImage = fileName; // Atualiza o nome do avatar com o novo arquivo
      }

      if (!userDetails?.uid) throw new Error("Usuário não autenticado.");

      // Cria o objeto de atualização
      const updatePayload = {
        ...data,
        "metadata.updatedAt": firebase.firestore.FieldValue.serverTimestamp(),
      };

      // Adiciona o avatar ao payload
      if (avatarImage) {
        updatePayload["personalInfo.avatar"] = avatarImage;
      }

      // Atualiza o Firestore
      await firebase
        .firestore()
        .collection("users")
        .doc(userDetails.uid)
        .update(updatePayload);

      // Atualiza os dados do usuário localmente
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
