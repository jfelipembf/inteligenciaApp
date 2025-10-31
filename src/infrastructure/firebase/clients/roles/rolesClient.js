import { getFirestoreInstance } from "../../config/firebaseConfig";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

class RolesClient {
  constructor() {
    this.db = getFirestoreInstance() || firebase.firestore();
  }

  async getRoleById(roleId) {
    try {
      const doc = await this.db.collection("roles").doc(roleId).get();

      if (!doc.exists) {
        return {
          success: false,
          data: null,
          error: "Role não encontrado",
        };
      }

      return {
        success: true,
        data: {
          id: doc.id,
          ...doc.data(),
        },
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao buscar role",
      };
    }
  }

  async getRolesBySchool(schoolId) {
    try {
      const snapshot = await this.db
        .collection("roles")
        .where("schoolId", "==", schoolId)
        .get();

      const roles = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        success: true,
        data: roles,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao buscar roles por escola",
      };
    }
  }

  async getDefaultRoles(schoolId) {
    try {
      const snapshot = await this.db
        .collection("roles")
        .where("schoolId", "==", schoolId)
        .where("type", "==", "default")
        .get();

      const roles = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        success: true,
        data: roles,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao buscar roles padrão",
      };
    }
  }

  async getCustomRoles(schoolId) {
    try {
      const snapshot = await this.db
        .collection("roles")
        .where("schoolId", "==", schoolId)
        .where("type", "==", "custom")
        .get();

      const roles = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        success: true,
        data: roles,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao buscar roles customizados",
      };
    }
  }

  async getRoleByName(schoolId, roleName) {
    try {
      const snapshot = await this.db
        .collection("roles")
        .where("schoolId", "==", schoolId)
        .where("name", "==", roleName)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return {
          success: false,
          data: null,
          error: "Role não encontrado",
        };
      }

      const doc = snapshot.docs[0];
      return {
        success: true,
        data: {
          id: doc.id,
          ...doc.data(),
        },
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao buscar role por nome",
      };
    }
  }

  async createRole(roleData) {
    try {
      const docRef = await this.db.collection("roles").add({
        ...roleData,
        metadata: {
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        },
      });

      return {
        success: true,
        data: {
          id: docRef.id,
          ...roleData,
        },
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao criar role",
      };
    }
  }

  async updateRole(roleId, roleData) {
    try {
      await this.db
        .collection("roles")
        .doc(roleId)
        .update({
          ...roleData,
          "metadata.updatedAt": firebase.firestore.FieldValue.serverTimestamp(),
        });

      return {
        success: true,
        data: {
          id: roleId,
          ...roleData,
        },
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao atualizar role",
      };
    }
  }

  async deleteRole(roleId) {
    try {
      await this.db.collection("roles").doc(roleId).delete();

      return {
        success: true,
        data: { id: roleId },
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao deletar role",
      };
    }
  }
}

export const rolesClient = new RolesClient();
