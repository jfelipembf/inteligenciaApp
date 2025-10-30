/**
 * Cliente Firebase para Permissions
 * Responsável apenas por comunicação com Firestore
 */

import { getFirestoreInstance } from "../../config/firebaseConfig";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

class PermissionsClient {
  constructor() {
    this.db = getFirestoreInstance() || firebase.firestore();
  }

  /**
   * Buscar uma permissão por ID
   */
  async getPermissionById(permissionId) {
    try {
      const docRef = this.db.collection("permissions").doc(permissionId);
      const doc = await docRef.get();

      if (!doc.exists) {
        return {
          success: false,
          data: null,
          error: "Permissão não encontrada",
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
        error: error.message || "Erro ao buscar permissão",
      };
    }
  }

  /**
   * Buscar múltiplas permissões por IDs
   */
  async getPermissionsByIds(permissionIds) {
    try {
      if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
        return {
          success: true,
          data: [],
          error: null,
        };
      }

      // Firestore limita queries "in" a 10 itens, então precisamos fazer em batches
      const batches = [];
      for (let i = 0; i < permissionIds.length; i += 10) {
        const batch = permissionIds.slice(i, i + 10);
        batches.push(batch);
      }

      const promises = batches.map((batch) =>
        this.db
          .collection("permissions")
          .where(firebase.firestore.FieldPath.documentId(), "in", batch)
          .get()
      );

      const snapshots = await Promise.all(promises);
      const permissions = [];

      snapshots.forEach((snapshot) => {
        snapshot.docs.forEach((doc) => {
          permissions.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      });

      return {
        success: true,
        data: permissions,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao buscar permissões",
      };
    }
  }

  /**
   * Buscar todas as permissões
   */
  async getAllPermissions() {
    try {
      const snapshot = await this.db.collection("permissions").get();

      const permissions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        success: true,
        data: permissions,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao buscar todas as permissões",
      };
    }
  }

  /**
   * Buscar permissões por módulo
   */
  async getPermissionsByModule(module) {
    try {
      const snapshot = await this.db
        .collection("permissions")
        .where("module", "==", module)
        .get();

      const permissions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        success: true,
        data: permissions,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao buscar permissões por módulo",
      };
    }
  }

  /**
   * Criar uma nova permissão
   */
  async createPermission(permissionData) {
    try {
      const docRef = await this.db.collection("permissions").add({
        ...permissionData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      return {
        success: true,
        data: {
          id: docRef.id,
          ...permissionData,
        },
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao criar permissão",
      };
    }
  }

  /**
   * Atualizar uma permissão
   */
  async updatePermission(permissionId, permissionData) {
    try {
      await this.db
        .collection("permissions")
        .doc(permissionId)
        .update({
          ...permissionData,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

      return {
        success: true,
        data: {
          id: permissionId,
          ...permissionData,
        },
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao atualizar permissão",
      };
    }
  }
}

export const permissionsClient = new PermissionsClient();
