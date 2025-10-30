/**
 * Service de Roles
 * Lógica de negócio para roles
 */

import { rolesRepository } from "../../repositories/roles/rolesRepository";
import { permissionsCacheService } from "../cache/permissionsCacheService";
import { DEFAULT_ROLES } from "../../constants/defaultRoles";

class RolesService {
  /**
   * Buscar role por ID
   */
  async getRoleById(roleId) {
    try {
      return await rolesRepository.getRoleById(roleId);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao buscar role",
      };
    }
  }

  /**
   * Buscar todos os roles de uma escola
   */
  async getRolesBySchool(schoolId) {
    try {
      return await rolesRepository.getRolesBySchool(schoolId);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao buscar roles",
      };
    }
  }

  /**
   * Buscar roles padrão
   */
  async getDefaultRoles(schoolId) {
    try {
      return await rolesRepository.getDefaultRoles(schoolId);
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
      return await rolesRepository.getCustomRoles(schoolId);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao buscar roles customizados",
      };
    }
  }

  /**
   * Criar novo role
   */
  async createRole(schoolId, roleData, createdBy) {
    try {
      // Validar permissões antes de criar
      if (!roleData.name || !roleData.permissionIds) {
        return {
          success: false,
          error: "Nome e permissionIds são obrigatórios",
        };
      }

      const roleToCreate = {
        schoolId,
        name: roleData.name,
        type: "custom",
        permissionIds: roleData.permissionIds,
        description: roleData.description || "",
        metadata: {
          createdBy,
        },
      };

      return await rolesRepository.createRole(roleToCreate);
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
      // Ao atualizar role, invalidar cache de todos os usuários com esse role
      const roleResult = await rolesRepository.getRoleById(roleId);

      if (roleResult.success && roleResult.data) {
        const role = roleResult.data;
        // Invalidar cache da escola (todos os usuários serão atualizados na próxima busca)
        await permissionsCacheService.invalidateCacheBySchool(role.schoolId);
      }

      return await rolesRepository.updateRole(roleId, roleData);
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
      // Verificar se role pode ser deletado (não pode deletar roles padrão)
      const roleResult = await rolesRepository.getRoleById(roleId);

      if (roleResult.success && roleResult.data) {
        const role = roleResult.data;

        if (role.type === "default") {
          return {
            success: false,
            error: "Não é possível deletar roles padrão",
          };
        }

        // Invalidar cache
        await permissionsCacheService.invalidateCacheBySchool(role.schoolId);
      }

      return await rolesRepository.deleteRole(roleId);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao deletar role",
      };
    }
  }

  /**
   * Inicializar roles padrão para uma escola
   * Executar quando escola é criada
   */
  async initializeDefaultRoles(schoolId, createdBy) {
    try {
      const existingRoles = await rolesRepository.getDefaultRoles(schoolId);

      if (existingRoles.success && existingRoles.data.length > 0) {
        return {
          success: true,
          data: { message: "Roles padrão já existem" },
        };
      }

      // Criar roles padrão a partir das constantes
      const results = await Promise.all(
        DEFAULT_ROLES.map((role) =>
          rolesRepository.createRole({
            schoolId,
            ...role,
            type: "default",
            metadata: {
              createdBy,
            },
          })
        )
      );

      const created = results.filter((r) => r.success).length;
      const errors = results.filter((r) => !r.success).length;

      return {
        success: true,
        data: {
          created,
          errors,
          total: DEFAULT_ROLES.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao inicializar roles padrão",
      };
    }
  }
}

export const rolesService = new RolesService();
