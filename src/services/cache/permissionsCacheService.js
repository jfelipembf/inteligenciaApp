import { permissionsCacheRepository } from "../../repositories/cache/permissionsCacheRepository";
import { permissionsService } from "../permissions/permissionsService";

class PermissionsCacheService {
  static CACHE_EXPIRATION = 60 * 60 * 1000;

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

      const permissionsResult = await permissionsService.resolvePermissions(
        rolePermissionIds
      );

      if (!permissionsResult.success) {
        return permissionsResult;
      }

      const permissions = permissionsResult.data.map((p) => p.name);

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
