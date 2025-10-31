import { usersClient } from "../../infrastructure/firebase/clients/users/usersClient";

class UsersRepository {
  async getUserById(userId) {
    try {
      return await usersClient.getUserById(userId);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao buscar usuário",
      };
    }
  }

  async getUserByEmail(email) {
    try {
      return await usersClient.getUserByEmail(email);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao buscar usuário por email",
      };
    }
  }

  async createUser(userData) {
    try {
      return await usersClient.createUser(userData);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao criar usuário",
      };
    }
  }

  async updateUser(userId, userData) {
    try {
      return await usersClient.updateUser(userId, userData);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao atualizar usuário",
      };
    }
  }

  async getUsersBySchool(schoolId) {
    try {
      return await usersClient.getUsersBySchool(schoolId);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao buscar usuários por escola",
      };
    }
  }

  async addSchoolToUser(userId, schoolData) {
    try {
      return await usersClient.addSchoolToUser(userId, schoolData);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao adicionar escola ao usuário",
      };
    }
  }

  async updateCurrentSchool(userId, schoolId) {
    try {
      return await usersClient.updateCurrentSchool(userId, schoolId);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao atualizar escola atual",
      };
    }
  }

  async getUsersByIds(userIds) {
    try {
      return await usersClient.getUsersByIds(userIds);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao buscar usuários",
      };
    }
  }
}

export const usersRepository = new UsersRepository();
