import { permissionsClient } from "../../infrastructure/firebase/clients/permissions/permissionsClient";

class PermissionsRepository {
  async getPermissionById(permissionId) {
    try {
      return await permissionsClient.getPermissionById(permissionId);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao buscar permissão",
      };
    }
  }

  async getPermissionsByIds(permissionIds) {
    try {
      return await permissionsClient.getPermissionsByIds(permissionIds);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao buscar permissões",
      };
    }
  }

  async getAllPermissions() {
    try {
      return await permissionsClient.getAllPermissions();
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao buscar todas as permissões",
      };
    }
  }

  async getPermissionsByModule(module) {
    try {
      return await permissionsClient.getPermissionsByModule(module);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao buscar permissões por módulo",
      };
    }
  }

  async createPermission(permissionData) {
    try {
      return await permissionsClient.createPermission(permissionData);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao criar permissão",
      };
    }
  }

  async updatePermission(permissionId, permissionData) {
    try {
      return await permissionsClient.updatePermission(
        permissionId,
        permissionData
      );
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao atualizar permissão",
      };
    }
  }
}

export const permissionsRepository = new PermissionsRepository();
