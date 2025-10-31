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

export async function seedCeoAccount({ email, password, accountName }) {
  if (!email || !password || !accountName) {
    return {
      success: false,
      error: "email, password e accountName são obrigatórios",
    };
  }

  try {
    const userCredential = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);

    const user = userCredential.user;

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

    await firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .set({
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
