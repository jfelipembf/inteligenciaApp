/**
 * Cliente Firebase para Users
 * Responsável apenas por comunicação com Firestore
 */

import { getFirestoreInstance } from "../../config/firebaseConfig";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

class UsersClient {
  constructor() {
    this.db = getFirestoreInstance() || firebase.firestore();
  }

  /**
   * Buscar usuário por ID
   */
  async getUserById(userId) {
    try {
      const doc = await this.db.collection("users").doc(userId).get();

      if (!doc.exists) {
        return {
          success: false,
          data: null,
          error: "Usuário não encontrado",
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
        error: error.message || "Erro ao buscar usuário",
      };
    }
  }

  /**
   * Buscar usuário por email
   */
  async getUserByEmail(email) {
    try {
      const snapshot = await this.db
        .collection("users")
        .where("email", "==", email)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return {
          success: false,
          data: null,
          error: "Usuário não encontrado",
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
        error: error.message || "Erro ao buscar usuário por email",
      };
    }
  }

  /**
   * Criar novo usuário
   */
  async createUser(userData) {
    try {
      const userRef = await this.db.collection("users").add({
        ...userData,
        metadata: {
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          lastLogin: null,
        },
      });

      return {
        success: true,
        data: {
          id: userRef.id,
          ...userData,
        },
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao criar usuário",
      };
    }
  }

  /**
   * Atualizar usuário
   */
  async updateUser(userId, userData) {
    try {
      await this.db
        .collection("users")
        .doc(userId)
        .update({
          ...userData,
          "metadata.updatedAt": firebase.firestore.FieldValue.serverTimestamp(),
        });

      return {
        success: true,
        data: {
          id: userId,
          ...userData,
        },
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao atualizar usuário",
      };
    }
  }

  /**
   * Buscar usuários por escola
   * Note: Firestore não suporta array-contains com objetos complexos
   * Então precisamos buscar todos e filtrar, ou usar um campo separado
   * Por enquanto, vamos buscar todos e filtrar (para otimizar depois)
   */
  async getUsersBySchool(schoolId) {
    try {
      // Buscar todos os usuários e filtrar (não ideal, mas necessário)
      // TODO: Otimizar criando um campo schoolsIds[] para permitir query direta
      const snapshot = await this.db.collection("users").get();

      const users = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((user) => {
          const schools = user.schools || [];
          return schools.some((s) => s.schoolId === schoolId);
        });

      return {
        success: true,
        data: users,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao buscar usuários por escola",
      };
    }
  }

  /**
   * Adicionar escola ao usuário (multi-escola)
   */
  async addSchoolToUser(userId, schoolData) {
    try {
      const userRef = this.db.collection("users").doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return {
          success: false,
          data: null,
          error: "Usuário não encontrado",
        };
      }

      const userData = userDoc.data();
      const schools = userData.schools || [];

      // Verificar se escola já existe
      const schoolExists = schools.some(
        (s) => s.schoolId === schoolData.schoolId
      );

      if (schoolExists) {
        return {
          success: false,
          data: null,
          error: "Usuário já está associado a esta escola",
        };
      }

      // Adicionar nova escola
      schools.push({
        schoolId: schoolData.schoolId,
        role: schoolData.role,
        subjects: schoolData.subjects || [],
        status: schoolData.status || "active",
        assignedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      await userRef.update({
        schools,
        currentSchoolId: schools[0].schoolId, // Se não tinha escola, define como atual
      });

      return {
        success: true,
        data: {
          id: userId,
          schools,
        },
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao adicionar escola ao usuário",
      };
    }
  }

  /**
   * Atualizar escola atual do usuário
   */
  async updateCurrentSchool(userId, schoolId) {
    try {
      const userRef = this.db.collection("users").doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return {
          success: false,
          data: null,
          error: "Usuário não encontrado",
        };
      }

      const userData = userDoc.data();
      const schools = userData.schools || [];

      // Verificar se escola existe no array
      const schoolExists = schools.some((s) => s.schoolId === schoolId);

      if (!schoolExists) {
        return {
          success: false,
          data: null,
          error: "Usuário não está associado a esta escola",
        };
      }

      await userRef.update({
        currentSchoolId: schoolId,
        "metadata.lastLogin": firebase.firestore.FieldValue.serverTimestamp(),
      });

      return {
        success: true,
        data: {
          id: userId,
          currentSchoolId: schoolId,
        },
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao atualizar escola atual",
      };
    }
  }

  /**
   * Buscar múltiplos usuários por IDs
   */
  async getUsersByIds(userIds) {
    try {
      if (!Array.isArray(userIds) || userIds.length === 0) {
        return {
          success: true,
          data: [],
          error: null,
        };
      }

      // Firestore limita queries "in" a 10 itens
      const batches = [];
      for (let i = 0; i < userIds.length; i += 10) {
        batches.push(userIds.slice(i, i + 10));
      }

      const promises = batches.map((batch) =>
        this.db
          .collection("users")
          .where(firebase.firestore.FieldPath.documentId(), "in", batch)
          .get()
      );

      const snapshots = await Promise.all(promises);
      const users = [];

      snapshots.forEach((snapshot) => {
        snapshot.docs.forEach((doc) => {
          users.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      });

      return {
        success: true,
        data: users,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao buscar usuários",
      };
    }
  }
}

export const usersClient = new UsersClient();
