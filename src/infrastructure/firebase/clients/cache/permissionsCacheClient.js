/**
 * Cliente Firebase para Cache de Permissões
 * Responsável apenas por comunicação com Firestore
 */

import { getFirestoreInstance } from "../../config/firebaseConfig";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

class PermissionsCacheClient {
  constructor() {
    this.db = getFirestoreInstance() || firebase.firestore();
  }

  /**
   * Buscar cache por usuário e escola
   */
  async getCacheByUserAndSchool(userId, schoolId) {
    try {
      const snapshot = await this.db
        .collection("user_permissions_cache")
        .where("userId", "==", userId)
        .where("schoolId", "==", schoolId)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return {
          success: false,
          data: null,
          error: "Cache não encontrado",
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
        error: error.message || "Erro ao buscar cache",
      };
    }
  }

  /**
   * Criar ou atualizar cache
   */
  async createOrUpdateCache(userId, schoolId, permissions) {
    try {
      // Verificar se já existe
      const existingResult = await this.getCacheByUserAndSchool(
        userId,
        schoolId
      );

      const cacheData = {
        userId,
        schoolId,
        permissions: Array.isArray(permissions) ? permissions : [],
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
      };

      if (existingResult.success && existingResult.data) {
        // Atualizar existente
        await this.db
          .collection("user_permissions_cache")
          .doc(existingResult.data.id)
          .update(cacheData);

        return {
          success: true,
          data: {
            id: existingResult.data.id,
            ...cacheData,
          },
          error: null,
        };
      } else {
        // Criar novo
        const docRef = await this.db
          .collection("user_permissions_cache")
          .add(cacheData);

        return {
          success: true,
          data: {
            id: docRef.id,
            ...cacheData,
          },
          error: null,
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao criar/atualizar cache",
      };
    }
  }

  /**
   * Deletar cache
   */
  async deleteCache(cacheId) {
    try {
      await this.db.collection("user_permissions_cache").doc(cacheId).delete();

      return {
        success: true,
        data: { id: cacheId },
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao deletar cache",
      };
    }
  }

  /**
   * Invalidar cache (deletar por userId e schoolId)
   */
  async invalidateCache(userId, schoolId) {
    try {
      const result = await this.getCacheByUserAndSchool(userId, schoolId);

      if (result.success && result.data) {
        return await this.deleteCache(result.data.id);
      }

      return {
        success: true,
        data: { message: "Cache não encontrado para invalidar" },
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao invalidar cache",
      };
    }
  }

  /**
   * Invalidar cache de múltiplos usuários (quando role/permissões mudam)
   */
  async invalidateCacheBySchool(schoolId) {
    try {
      const snapshot = await this.db
        .collection("user_permissions_cache")
        .where("schoolId", "==", schoolId)
        .get();

      if (snapshot.empty) {
        return {
          success: true,
          data: { deleted: 0 },
          error: null,
        };
      }

      const batch = this.db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      return {
        success: true,
        data: { deleted: snapshot.docs.length },
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao invalidar cache da escola",
      };
    }
  }
}

export const permissionsCacheClient = new PermissionsCacheClient();
