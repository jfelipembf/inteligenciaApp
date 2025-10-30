import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { permissionsService } from "../../services/permissions/permissionsService";
import { rolesService } from "../../services/roles/rolesService";

/**
 * Seed de ambiente de desenvolvimento para Controle de Acesso
 *
 * Atenção: Executar apenas em desenvolvimento.
 */

/**
 * 1) Popular a coleção permissions com as permissões padrão
 */
export async function seedPermissions() {
  return await permissionsService.initializeDefaultPermissions();
}

/**
 * 2) Criar roles padrão para uma escola existente
 */
export async function seedDefaultRolesForSchool(schoolId, createdBy) {
  if (!schoolId) {
    return { success: false, error: "schoolId é obrigatório" };
  }
  return await rolesService.initializeDefaultRoles(schoolId, createdBy || null);
}

/**
 * 3) Criar uma conta/usuário CEO master (Auth + Firestore)
 * - Cria usuário no Firebase Auth (email/senha)
 * - Cria documento em users com role "ceo" e sem schools inicialmente
 * - Cria documento em accounts (conta master)
 */
export async function seedCeoAccount({ email, password, accountName }) {
  if (!email || !password || !accountName) {
    return {
      success: false,
      error: "email, password e accountName são obrigatórios",
    };
  }

  try {
    // 3.1 Criar usuário no Firebase Auth
    const userCredential = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);

    const user = userCredential.user;

    // 3.2 Criar conta em accounts
    const accountRef = await firebase
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

    // 3.3 Criar documento em users
    await firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .set({
        email,
        personalInfo: { name: "CEO Master" },
        schools: [],
        currentSchoolId: null,
        role: "ceo", // compatibilidade com código antigo ainda lendo role simples
        accounts: [{ accountId: accountRef.id, role: "ceo", status: "active" }],
        metadata: {
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          lastLogin: null,
        },
      });

    return {
      success: true,
      data: {
        userId: user.uid,
        accountId: accountRef.id,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Erro ao criar CEO",
    };
  }
}

/**
 * 4) Seed completo (executa todos os passos). Opcionalmente recebe schoolId
 */
export async function runFullAccessControlSeed({
  ceoEmail,
  ceoPassword,
  accountName,
  schoolId,
  createdBy,
}) {
  const steps = [];

  // Permissions
  const p = await seedPermissions();
  steps.push({ step: "permissions", result: p });

  // Roles por escola (se for informado schoolId)
  if (schoolId) {
    const r = await seedDefaultRolesForSchool(schoolId, createdBy);
    steps.push({ step: "defaultRoles", result: r });
  }

  // CEO
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
