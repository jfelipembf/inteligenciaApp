import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import axios from "axios";
import useUser from "./useUser";
import uploadToFirebase from "../utils/uploadToFirebase";

export const useUserManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userDetails } = useUser();

  const createUser = async ({
    email,
    password,
    userData,
    profileImage,
    role,
  }) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Iniciando criação do usuário...");

      // Verificar se há um usuário admin autenticado
      const currentUser = firebase.auth().currentUser;
      console.log("Usuário autenticado:", currentUser);
      if (!currentUser) {
        throw new Error("Usuário não autenticado");
      }

      // Buscar schoolId do admin atual
      if (!userDetails?.schoolId) {
        throw new Error("schoolId não encontrado no usuário.");
      }

      const schoolId = userDetails.schoolId;

      // Upload da foto de perfil se existir
      let avatarImage = null;
      if (profileImage) {
        const ext = profileImage.name.split(".").pop();
        const fileName = `${email.replace(/[@.]/g, "_")}.${ext}`;
        await uploadToFirebase(
          profileImage,
          `profileImages`,
          schoolId,
          fileName
        );
        avatarImage = fileName;
      }

      // Preparar os dados do usuário
      const finalUserData = {
        ...userData,
        personalInfo: {
          ...userData.personalInfo,
          email,
          avatar: avatarImage,
        },
      };

      // Chamar a Cloud Function para criar o usuário
      const response = await axios.post(
        "https://createuserwithdetails-5pamugswja-uc.a.run.app",
        {
          email,
          password,
          userData: finalUserData,
          role,
          schoolId,
          createdBy: currentUser.uid,
          avatarImage,
        }
      );

      if (response.data.success) {
        console.log("Usuário criado com sucesso:", response.data.uid);
        setLoading(false);
        return { success: true, uid: response.data.uid };
      } else {
        throw new Error(
          response.data.error || "Erro desconhecido ao criar usuário."
        );
      }
    } catch (error) {
      console.error("Erro na criação do usuário:", error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  return {
    createUser,
    loading,
    error,
  };
};

export const useStudentManagement = () => {
  const { createUser, loading, error } = useUserManagement();

  const createStudent = async ({ email, password, userData, profileImage }) => {
    return createUser({
      email,
      password,
      userData,
      profileImage,
      role: "aluno",
    });
  };

  return {
    createStudent,
    loading,
    error,
  };
};
