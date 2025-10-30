/**
 * Repository de Roles
 * Abstração de dados para roles
 */

import { rolesClient } from "../../infrastructure/firebase/clients/roles/rolesClient";

class RolesRepository {
  /**
   * Buscar role por ID
   */
  async getRoleById(roleId) {
    try {
      return await rolesClient.getRoleById(roleId);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao buscar role",
      };
    }
  }

  /**
   * Buscar roles por escola
   */
  async getRolesBySchool(schoolId) {
    try {
      return await rolesClient.getRolesBySchool(schoolId);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao buscar roles por escola",
      };
    }
  }

  /**
   * Buscar roles padrão
   */
  async getDefaultRoles(schoolId) {
    try {
      return await rolesClient.getDefaultRoles(schoolId);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao buscar roles padrão",
      };
    }
  }

  /**
   * Buscar roles customizados
   */
  async getCustomRoles(schoolId) {
    try {
      return await rolesClient.getCustomRoles(schoolId);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao buscar roles customizados",
      };
    }
  }

  /**
   * Buscar role por nome
   */
  async getRoleByName(schoolId, roleName) {
    try {
      return await rolesClient.getRoleByName(schoolId, roleName);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao buscar role por nome",
      };
    }
  }

  /**
   * Criar novo role
   */
  async createRole(roleData) {
    try {
      return await rolesClient.createRole(roleData);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao criar role",
      };
    }
  }

  /**
   * Atualizar role
   */
  async updateRole(roleId, roleData) {
    try {
      return await rolesClient.updateRole(roleId, roleData);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao atualizar role",
      };
    }
  }

  /**
   * Deletar role
   */
  async deleteRole(roleId) {
    try {
      return await rolesClient.deleteRole(roleId);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao deletar role",
      };
    }
  }
}

export const rolesRepository = new RolesRepository();
