import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/functions";
import axios from "axios";
import useUser from "./useUser";

const useColaborator = () => {
  const allowedRoles = ["professor", "coordinator", "principal", "ceo"];
  const { userDetails } = useUser(); // Obter detalhes do usuário logado
  const currentUserSchoolId = userDetails?.schoolId;
  const currentUserId = userDetails?.uid;
  console.log(
    "detalhes do usuario",
    userDetails,
    currentUserSchoolId,
    currentUserId
  );
  // Função para criar uma conta com email
  const createAccountWithEmail = async (email, role) => {
    try {
      if (!allowedRoles.includes(role)) {
        throw new Error(`Role "${role}" não é permitida.`);
      }

      if (!currentUserSchoolId) {
        throw new Error("schoolId do usuário atual não encontrado.");
      }

      console.log("Iniciando criação de conta com email...");
      console.log("Dados enviados:", {
        email,
        role,
        schoolId: currentUserSchoolId,
      });

      // Verificar se o e-mail já existe no Firebase Authentication
      const existingUserQuery = await firebase
        .firestore()
        .collection("users")
        .where("personalInfo.email", "==", email)
        .get();

      if (!existingUserQuery.empty) {
        console.log("Usuário já existe no sistema.");
        return {
          success: true,
          message: "Usuário já existe no sistema.",
        };
      }

      // Criar a conta no backend
      const response = await axios.post(
        "https://createuserwithemail-5pamugswja-uc.a.run.app",
        {
          email,
          role,
          schoolId: currentUserSchoolId,
        }
      );

      if (response.data.success) {
        console.log(
          "Conta criada com sucesso. Enviando e-mail de redefinição de senha..."
        );

        // Enviar e-mail para redefinir a senha
        await firebase.auth().sendPasswordResetEmail(email);

        return {
          success: true,
          message:
            "Conta criada com sucesso! E-mail para login enviado ao usuário.",
        };
      } else {
        throw new Error(
          response.data.message || "Erro desconhecido ao criar conta."
        );
      }
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      return {
        success: false,
        message: error.response?.data?.error || error.message,
      };
    }
  };

  const createCeoAccountWithEmail = async (email, newSchoolId) => {
    try {
      const role = "ceo";

      if (!newSchoolId) {
        throw new Error("newSchoolId não fornecido.");
      }

      // Verificar se já existe um usuário com o email fornecido
      const existingUserQuery = await firebase
        .firestore()
        .collection("users")
        .where("personalInfo.email", "==", email)
        .get();

      if (!existingUserQuery.empty) {
        // Usuário já existe
        const existingUserDoc = existingUserQuery.docs[0];
        const existingUserData = existingUserDoc.data();

        // Verificar se a schoolId já existe no campo schools
        const existingSchools = existingUserData.schools || [];
        const schoolExists = existingSchools.some(
          (school) => school.schoolId === newSchoolId && school.role === role
        );

        if (!schoolExists) {
          // Adicionar a nova schoolId e role ao campo schools
          const updatedSchools = [
            ...existingSchools,
            { schoolId: newSchoolId, role },
          ];

          // Atualizar o array de schoolIds
          const updatedSchoolIds = [
            ...(existingUserData.schoolIds || []),
            newSchoolId,
          ];

          const userRef = firebase
            .firestore()
            .collection("users")
            .doc(existingUserDoc.id);
          await userRef.update({
            schools: updatedSchools,
            schoolIds: updatedSchoolIds,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          });

          return {
            success: true,
            message: "Usuário atualizado com a nova escola/role!",
          };
        } else {
          return {
            success: true,
            message: "Usuário já possui acesso com essa escola e role.",
          };
        }
      }

      // Caso o usuário não exista, chamar a função HTTP para criar o usuário
      const response = await axios.post(
        "https://createuserwithemail-5pamugswja-uc.a.run.app",
        {
          email,
          role,
          schoolId: newSchoolId,
        }
      );

      if (response.data.success) {
        console.log(
          "Conta criada com sucesso. Enviando e-mail de redefinição de senha..."
        );

        // Enviar e-mail para redefinir a senha
        await firebase.auth().sendPasswordResetEmail(email);

        return {
          success: true,
          message:
            "Conta criada com sucesso! E-mail para login enviado ao usuário.",
        };
      } else {
        throw new Error(
          response.data.message || "Erro desconhecido ao criar conta."
        );
      }
    } catch (error) {
      console.error("Erro na criação do colaborador:", error);

      // Limpar conta do Auth em caso de erro
      try {
        const user = firebase.auth().currentUser;
        if (user && user.email === email) {
          console.log("Removendo colaborador criado no Auth devido a erro...");
          await user.delete();
        }
      } catch (deleteError) {
        console.error("Erro ao limpar conta no Auth:", deleteError);
      }

      return { success: false, message: error.message };
    }
  };

  // Função para buscar um colaborador pelo ID
  const fetchColaboratorById = async (userId) => {
    try {
      const userRef = firebase.firestore().collection("users").doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        throw new Error("Colaborador não encontrado.");
      }

      return { success: true, data: userDoc.data() };
    } catch (error) {
      console.error("Erro ao buscar colaborador:", error);
      return { success: false, message: error.message };
    }
  };

  // Função para atualizar os dados de um colaborador
  const updateColaborator = async (updatedData, profileImage) => {
    try {
      const userRef = firebase
        .firestore()
        .collection("users")
        .doc(currentUserId);

      // Upload da foto de perfil se existir
      let profileImageUrl = null;
      if (profileImage) {
        console.log("Fazendo upload da imagem de perfil...");
        const storageRef = firebase.storage().ref();
        const imageRef = storageRef.child(`profile_images/${currentUserId}`);
        await imageRef.put(profileImage);
        profileImageUrl = await imageRef.getDownloadURL();
        console.log("Imagem de perfil carregada com sucesso:", profileImageUrl);
      }
      await userRef.update({
        ...updatedData,
        personalInfo: {
          ...updatedData.personalInfo,

          profileImage: profileImageUrl,
        },
        metadata: {
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        },
      });

      return { success: true, message: "Dados atualizados com sucesso!" };
    } catch (error) {
      console.error("Erro ao atualizar colaborador:", error);
      return { success: false, message: error.message };
    }
  };

  // Função para listar todos os colaboradores
  const fetchColaborators = async () => {
    try {
      const userRef = firebase.firestore().collection("users");
      const snapshot = await userRef.get();

      const colaborators = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return { success: true, data: colaborators };
    } catch (error) {
      console.error("Erro ao listar colaboradores:", error);
      return { success: false, message: error.message };
    }
  };

  return {
    createCeoAccountWithEmail,
    createAccountWithEmail,
    fetchColaboratorById,
    updateColaborator,
    fetchColaborators,
  };
};

export default useColaborator;
