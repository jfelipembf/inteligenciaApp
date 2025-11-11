import { useState } from "react";
import { useAuth } from "./auth/auth.jsx";
import { usersRepository } from "../repositories/users/usersRepository";
import uploadToFirebase from "../utils/uploadToFirebase";

const useUpdateUserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, currentSchoolId } = useAuth();

  const updateUserProfile = async (data, profileImage) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!user || !user.id) {
        throw new Error("Usuário não autenticado.");
      }

      // Verificar se precisa de schoolId (apenas para roles diferentes de CEO e Master)
      const userRole = user.role;
      const needsSchoolId = userRole !== "ceo" && userRole !== "master";
      
      if (needsSchoolId && !currentSchoolId) {
        throw new Error("schoolId é obrigatório para atualizar o perfil.");
      }

      let avatarImage = user.personalInfo?.avatar || null;

      // Fazer upload da imagem, se fornecida
      if (profileImage instanceof File) {
        try {
          const ext = profileImage.name.split(".").pop();
          const fileName = `${user.id}.${ext}`;
          
          // Para CEO/Master sem schoolId, usa "default"; para outros, usa currentSchoolId
          const uploadSchoolId = currentSchoolId || "default";
          
          await uploadToFirebase(
            profileImage,
            `profileImages`,
            uploadSchoolId,
            fileName
          );
          avatarImage = fileName;
        } catch (uploadError) {
          console.error("Erro ao fazer upload da imagem:", uploadError);
          // Continua mesmo se o upload falhar, mas não atualiza o avatar
        }
      }

      // Prepara o objeto de atualização
      const updatePayload = {
        ...data,
      };

      // Adiciona o avatar ao payload se foi atualizado
      if (avatarImage) {
        if (!updatePayload.personalInfo) {
          updatePayload.personalInfo = {};
        }
        updatePayload.personalInfo.avatar = avatarImage;
      }

      // Atualiza o Firestore usando o repository
      const result = await usersRepository.updateUser(user.id, updatePayload);

      if (!result.success) {
        throw new Error(result.error || "Erro ao atualizar perfil");
      }

      setLoading(false);
      return true;
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      setError(err.message || "Erro ao atualizar perfil");
      setLoading(false);
      return false;
    }
  };

  return { updateUserProfile, loading, error };
};

export default useUpdateUserProfile;
