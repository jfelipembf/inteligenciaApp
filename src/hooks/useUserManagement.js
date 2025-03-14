import { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

export const useUserManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createUser = async ({
    email,
    password,
    userData,
    profileImage,
    role
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
      const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
      console.log("Dados do usuário admin:", userDoc.data());
      const schoolId = userDoc.data().schoolId;
      if (!schoolId) {
        throw new Error("schoolId não encontrado para o usuário admin");
      }

      // Criar usuário no Auth
      console.log("Criando usuário no Firebase Auth...");
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      console.log("Usuário criado com sucesso:", userCredential);
      const newUserUid = userCredential.user.uid;

      // Upload da foto de perfil se existir
      let profileImageUrl = null;
      if (profileImage) {
        console.log("Fazendo upload da imagem de perfil...");
        const storageRef = firebase.storage().ref();
        const imageRef = storageRef.child(`profile_images/${newUserUid}`);
        await imageRef.put(profileImage);
        profileImageUrl = await imageRef.getDownloadURL();
        console.log("Imagem de perfil carregada com sucesso:", profileImageUrl);
      }

      // Preparar dados do usuário para o Firestore
      const finalUserData = {
        uid: newUserUid,
        role,
        schoolId,
        ...userData,
        personalInfo: {
          ...userData.personalInfo,
          email,
          profileImage: profileImageUrl
        },
        metadata: {
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          createdBy: currentUser.uid
        }
      };

      console.log("Salvando dados do usuário no Firestore:", finalUserData);
      await firebase.firestore().collection('users').doc(newUserUid).set(finalUserData);
      console.log("Usuário salvo no Firestore com sucesso.");

      setLoading(false);
      return { success: true, uid: newUserUid };
    } catch (error) {
      console.error("Erro na criação do usuário:", error);
      setError(error.message);

      // Limpar conta do Auth em caso de erro
      try {
        const user = firebase.auth().currentUser;
        if (user && user.email === email) {
          console.log("Removendo usuário criado no Auth devido a erro...");
          await user.delete();
        }
      } catch (deleteError) {
        console.error("Erro ao limpar conta no Auth:", deleteError);
      }

      setLoading(false);
      throw error;
    }
  };

  return {
    createUser,
    loading,
    error
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
      role: "aluno"
    });
  };

  return {
    createStudent,
    loading,
    error
  };
};
