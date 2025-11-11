import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { permissionsService } from "../../services/permissions/permissionsService";
import { rolesService } from "../../services/roles/rolesService";

export async function seedPermissions() {
  return await permissionsService.initializeDefaultPermissions();
}

export async function seedDefaultRolesForSchool(schoolId, createdBy) {
  if (!schoolId) {
    return { success: false, error: "schoolId é obrigatório" };
  }
  return await rolesService.initializeDefaultRoles(schoolId, createdBy || null);
}

export async function seedCeoAccount({
  email,
  password,
  accountName,
  forceReset = false,
}) {
  if (!email || !password || !accountName) {
    return {
      success: false,
      error: "email, password e accountName são obrigatórios",
    };
  }

  try {
    let user;
    let isNewUser = false;

    // Tentar criar o usuário, ou usar se já existir
    try {
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      user = userCredential.user;
      isNewUser = true;
    } catch (authError) {
      if (authError.code === "auth/email-already-in-use") {
        // Usuário já existe no Auth, verificar se a senha está correta
        try {
          // Tentar fazer login para verificar se a senha está correta
          await firebase.auth().signInWithEmailAndPassword(email, password);
          // Login bem-sucedido, buscar dados do usuário
          const currentUser = firebase.auth().currentUser;
          if (currentUser) {
            user = currentUser;
            await firebase.auth().signOut(); // Fazer logout para não interferir
          }
        } catch (loginError) {
          // Senha incorreta ou outro erro de login
          if (
            loginError.code === "auth/wrong-password" ||
            loginError.code === "auth/invalid-credential"
          ) {
            // Senha está incorreta, retornar erro informativo
            return {
              success: false,
              error: `Usuário já existe no Firebase Auth, mas a senha fornecida está incorreta. Use o botão 'Resetar Senha' ou delete o usuário no Firebase Auth Console e execute o seed novamente.`,
            };
          }
          // Outro erro de login
          throw loginError;
        }

        // Usuário existe e senha está correta, buscar no Firestore
        const usersSnapshot = await firebase
          .firestore()
          .collection("users")
          .where("email", "==", email)
          .limit(1)
          .get();

        if (!usersSnapshot.empty) {
          // Usuário já existe no Firestore também
          const userDoc = usersSnapshot.docs[0];
          user = { uid: userDoc.id };

          // Verificar se já tem conta e documento completo
          const accountSnapshot = await firebase
            .firestore()
            .collection("accounts")
            .where("metadata.createdBy", "==", user.uid)
            .limit(1)
            .get();

          if (!accountSnapshot.empty) {
            if (forceReset) {
              // Forçar reset enviando email de redefinição de senha
              await firebase.auth().sendPasswordResetEmail(email);
              return {
                success: true,
                data: {
                  userId: user.uid,
                  accountId: accountSnapshot.docs[0].id,
                  message:
                    "Email de redefinição de senha enviado. Verifique sua caixa de entrada.",
                  existing: true,
                  passwordResetSent: true,
                },
              };
            }

            return {
              success: true,
              data: {
                userId: user.uid,
                accountId: accountSnapshot.docs[0].id,
                message:
                  "Usuário CEO já existe no sistema e a senha está correta.",
                existing: true,
              },
            };
          }
        } else {
          // Usuário existe no Auth mas não no Firestore
          // Não podemos buscar o UID sem fazer sign in, então retornamos erro informativo
          return {
            success: false,
            error: `Email já está em uso no Firebase Auth, mas não foi encontrado no Firestore. Por favor, delete o usuário no Firebase Auth Console ou use um email diferente.`,
          };
        }
      } else {
        throw authError;
      }
    }

    // Verificar se já existe conta associada ao usuário
    const existingAccountSnapshot = await firebase
      .firestore()
      .collection("accounts")
      .where("metadata.createdBy", "==", user.uid)
      .limit(1)
      .get();

    let accountRef;
    if (existingAccountSnapshot.empty) {
      // Criar nova conta
      accountRef = await firebase
        .firestore()
        .collection("accounts")
        .add({
          name: accountName,
          status: "active",
          metadata: {
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdBy: user.uid,
          },
        });
    } else {
      accountRef = existingAccountSnapshot.docs[0].ref;
    }

    // Verificar/criar documento do usuário no Firestore
    const userDocRef = firebase.firestore().collection("users").doc(user.uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      // Criar documento do usuário
      await userDocRef.set({
        email,
        personalInfo: { name: "CEO Master" },
        schools: [],
        currentSchoolId: null,
        role: "ceo",
        accounts: [{ accountId: accountRef.id, role: "ceo", status: "active" }],
        metadata: {
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          lastLogin: null,
        },
      });
    } else {
      // Atualizar documento existente para garantir que tem role CEO
      const userData = userDoc.data();
      const hasAccount = userData.accounts?.some(
        (acc) => acc.accountId === accountRef.id
      );

      if (!hasAccount) {
        const accounts = userData.accounts || [];
        accounts.push({
          accountId: accountRef.id,
          role: "ceo",
          status: "active",
        });

        await userDocRef.update({
          role: "ceo",
          accounts,
          "metadata.updatedAt": firebase.firestore.FieldValue.serverTimestamp(),
        });
      }
    }

    return {
      success: true,
      data: {
        userId: user.uid,
        accountId: accountRef.id,
        isNewUser,
        message: isNewUser
          ? "Usuário CEO criado com sucesso"
          : "Usuário CEO atualizado/criado com sucesso",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Erro ao criar CEO",
    };
  }
}

export async function resetCeoPassword(email) {
  if (!email) {
    return {
      success: false,
      error: "Email é obrigatório",
    };
  }

  try {
    await firebase.auth().sendPasswordResetEmail(email);
    return {
      success: true,
      data: {
        message:
          "Email de redefinição de senha enviado. Verifique sua caixa de entrada.",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Erro ao enviar email de redefinição de senha",
    };
  }
}

export async function runFullAccessControlSeed({
  ceoEmail,
  ceoPassword,
  accountName,
  schoolId,
  createdBy,
}) {
  const steps = [];

  const p = await seedPermissions();
  steps.push({ step: "permissions", result: p });

  if (schoolId) {
    const r = await seedDefaultRolesForSchool(schoolId, createdBy);
    steps.push({ step: "defaultRoles", result: r });
  }

  const c = await seedCeoAccount({
    email: ceoEmail,
    password: ceoPassword,
    accountName,
  });
  steps.push({ step: "ceoAccount", result: c });

  const hasError = steps.some((s) => s.result && s.result.success === false);

  return {
    success: !hasError,
    steps,
  };
}
