/**
 * Repository de Permissions
 * Abstração de dados para permissões
 */

import { permissionsClient } from "../../infrastructure/firebase/clients/permissions/permissionsClient";

class PermissionsRepository {
  /**
   * Buscar permissão por ID
   */
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

  /**
   * Buscar múltiplas permissões por IDs
   */
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

  /**
   * Buscar todas as permissões
   */
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

  /**
   * Buscar permissões por módulo
   */
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

  /**
   * Criar nova permissão
   */
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

  /**
   * Atualizar permissão
   */
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
