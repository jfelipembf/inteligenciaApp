import { permissionsCacheClient } from "../../infrastructure/firebase/clients/cache/permissionsCacheClient";

class PermissionsCacheRepository {
  async getCacheByUserAndSchool(userId, schoolId) {
    try {
      return await permissionsCacheClient.getCacheByUserAndSchool(
        userId,
        schoolId
      );
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao buscar cache",
      };
    }
  }

  async createOrUpdateCache(userId, schoolId, permissions) {
    try {
      return await permissionsCacheClient.createOrUpdateCache(
        userId,
        schoolId,
        permissions
      );
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao criar/atualizar cache",
      };
    }
  }

  async deleteCache(cacheId) {
    try {
      return await permissionsCacheClient.deleteCache(cacheId);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao deletar cache",
      };
    }
  }

  async invalidateCache(userId, schoolId) {
    try {
      return await permissionsCacheClient.invalidateCache(userId, schoolId);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao invalidar cache",
      };
    }
  }

  async invalidateCacheBySchool(schoolId) {
    try {
      return await permissionsCacheClient.invalidateCacheBySchool(schoolId);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao invalidar cache da escola",
      };
    }
  }
}

export const permissionsCacheRepository = new PermissionsCacheRepository();
