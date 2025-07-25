import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
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
      // Validar role
      if (!allowedRoles.includes(role)) {
        throw new Error(`Role "${role}" não é permitida.`);
      }

      if (!currentUserSchoolId) {
        throw new Error("schoolId do usuário atual não encontrado.");
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
          (school) =>
            school.schoolId === currentUserSchoolId && school.role === role
        );

        if (!schoolExists) {
          // Adicionar a nova schoolId e role ao campo schools
          const updatedSchools = [
            ...existingSchools,
            { schoolId: currentUserSchoolId, role },
          ];

          const userRef = firebase
            .firestore()
            .collection("users")
            .doc(existingUserDoc.id);
          await userRef.update({
            schools: updatedSchools,
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

      // Gerar uma senha automática
      const generatedPassword = Math.random().toString(36).slice(-8);

      // Criar o usuário no Firebase Authentication
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, generatedPassword);

      const userId = userCredential.user.uid;

      // Criar um objeto vazio na coleção "users" no Firestore
      const userRef = firebase.firestore().collection("users").doc(userId);
      await userRef.set({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        personalInfo: { name: "Novo Colaborador", email }, // Dados pessoais vazios
        professionalInfo: {}, // Dados profissionais vazios
        address: {}, // Endereço vazio
        role, // Papel do usuário
        schoolId: currentUserSchoolId,
        schools: [
          {
            schoolId: currentUserSchoolId,
            role,
          },
        ],
      });

      // Enviar e-mail para redefinir a senha
      await firebase.auth().sendPasswordResetEmail(email);

      return { success: true, message: "Conta criada com sucesso!" };
    } catch (error) {
      console.error("Erro ao criar conta:", error);
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
    createAccountWithEmail,
    fetchColaboratorById,
    updateColaborator,
    fetchColaborators,
  };
};

export default useColaborator;
