/**
 * Service de Cache de Permissões
 * Lógica de negócio para cache inteligente
 */

import { permissionsCacheRepository } from "../../repositories/cache/permissionsCacheRepository";
import { permissionsService } from "../permissions/permissionsService";

class PermissionsCacheService {
  // Cache válido por 1 hora
  static CACHE_EXPIRATION = 60 * 60 * 1000; // 1 hora em milissegundos

  /**
   * Buscar permissões do cache ou resolver se não existir/expirado
   */
  async getPermissions(
    userId,
    schoolId,
    rolePermissionIds,
    forceRefresh = false
  ) {
    try {
      if (!userId || !schoolId) {
        return {
          success: false,
          error: "userId e schoolId são obrigatórios",
        };
      }

      // Se não forçar refresh, verificar cache
      if (!forceRefresh) {
        const cacheResult =
          await permissionsCacheRepository.getCacheByUserAndSchool(
            userId,
            schoolId
          );

        if (cacheResult.success && cacheResult.data) {
          const cache = cacheResult.data;
          const lastUpdated =
            cache.lastUpdated?.toMillis?.() || cache.lastUpdated;
          const currentTime = Date.now();

          // Verificar se cache ainda é válido
          if (
            lastUpdated &&
            currentTime - lastUpdated < PermissionsCacheService.CACHE_EXPIRATION
          ) {
            return {
              success: true,
              data: cache.permissions || [],
              fromCache: true,
            };
          }
        }
      }

      // Cache não encontrado/expirado, resolver permissões do role
      const permissionsResult = await permissionsService.resolvePermissions(
        rolePermissionIds
      );

      if (!permissionsResult.success) {
        return permissionsResult;
      }

      const permissions = permissionsResult.data.map((p) => p.name);

      // Atualizar cache
      await permissionsCacheRepository.createOrUpdateCache(
        userId,
        schoolId,
        permissions
      );

      return {
        success: true,
        data: permissions,
        fromCache: false,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao buscar permissões",
      };
    }
  }

  /**
   * Buscar permissões apenas do cache (sem resolver)
   */
  async getCachedPermissions(userId, schoolId) {
    try {
      const result = await permissionsCacheRepository.getCacheByUserAndSchool(
        userId,
        schoolId
      );

      if (!result.success || !result.data) {
        return {
          success: false,
          error: "Cache não encontrado",
        };
      }

      return {
        success: true,
        data: result.data.permissions || [],
        fromCache: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao buscar cache",
      };
    }
  }

  /**
   * Invalidar cache (forçar refresh na próxima busca)
   */
  async invalidateCache(userId, schoolId) {
    try {
      return await permissionsCacheRepository.invalidateCache(userId, schoolId);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao invalidar cache",
      };
    }
  }

  /**
   * Invalidar cache de todos os usuários de uma escola
   * Útil quando roles/permissões são alterados
   */
  async invalidateCacheBySchool(schoolId) {
    try {
      return await permissionsCacheRepository.invalidateCacheBySchool(schoolId);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao invalidar cache da escola",
      };
    }
  }

  /**
   * Verificar se usuário tem uma permissão específica
   */
  async hasPermission(userId, schoolId, permissionName, rolePermissionIds) {
    try {
      const result = await this.getPermissions(
        userId,
        schoolId,
        rolePermissionIds
      );

      if (!result.success) {
        return {
          success: false,
          hasPermission: false,
          error: result.error,
        };
      }

      const hasPermission = result.data.includes(permissionName);

      return {
        success: true,
        hasPermission,
      };
    } catch (error) {
      return {
        success: false,
        hasPermission: false,
        error: error.message || "Erro ao verificar permissão",
      };
    }
  }
}

export const permissionsCacheService = new PermissionsCacheService();
