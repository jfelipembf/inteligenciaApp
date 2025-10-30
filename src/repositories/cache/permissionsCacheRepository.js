/**
 * Repository de Cache de Permissões
 * Abstração de dados para cache
 */

import { permissionsCacheClient } from "../../infrastructure/firebase/clients/cache/permissionsCacheClient";

class PermissionsCacheRepository {
  /**
   * Buscar cache por usuário e escola
   */
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

  /**
   * Criar ou atualizar cache
   */
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

  /**
   * Deletar cache
   */
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

  /**
   * Invalidar cache
   */
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

  /**
   * Invalidar cache da escola
   */
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
