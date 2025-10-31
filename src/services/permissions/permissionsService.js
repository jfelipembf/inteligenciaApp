import { permissionsRepository } from "../../repositories/permissions/permissionsRepository";
import { PERMISSIONS } from "../../constants/permissions";

class PermissionsService {
  async resolvePermissions(permissionIds) {
    try {
      if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
        return {
          success: true,
          data: [],
        };
      }

      const result = await permissionsRepository.getPermissionsByIds(
        permissionIds
      );

      if (!result.success) {
        return result;
      }

      return {
        success: true,
        data: result.data || [],
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao resolver permissões",
      };
    }
  }

  async getPermission(permissionId) {
    try {
      return await permissionsRepository.getPermissionById(permissionId);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao buscar permissão",
      };
    }
  }

  async getAllPermissions() {
    try {
      return await permissionsRepository.getAllPermissions();
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao buscar todas as permissões",
      };
    }
  }

  async getPermissionsByModule(module) {
    try {
      return await permissionsRepository.getPermissionsByModule(module);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao buscar permissões por módulo",
      };
    }
  }

  async initializeDefaultPermissions() {
    try {
      const allPermissions = [];

      Object.keys(PERMISSIONS).forEach((module) => {
        Object.keys(PERMISSIONS[module]).forEach((action) => {
          const permissionName = PERMISSIONS[module][action];
          allPermissions.push({
            name: permissionName,
            module: module,
            action: action,
            description: this._getPermissionDescription(module, action),
          });
        });
      });

      const existingResult = await permissionsRepository.getAllPermissions();
      const existingPermissions =
        existingResult.success && existingResult.data
          ? existingResult.data.map((p) => p.name)
          : [];

      const permissionsToCreate = allPermissions.filter(
        (p) => !existingPermissions.includes(p.name)
      );

      if (permissionsToCreate.length === 0) {
        return {
          success: true,
          data: { message: "Todas as permissões já existem" },
        };
      }

      const results = await Promise.all(
        permissionsToCreate.map((permission) =>
          permissionsRepository.createPermission(permission)
        )
      );

      const created = results.filter((r) => r.success).length;
      const errors = results.filter((r) => !r.success).length;

      return {
        success: true,
        data: {
          created,
          errors,
          total: permissionsToCreate.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao inicializar permissões",
      };
    }
  }

  _getPermissionDescription(module, action) {
    const descriptions = {
      access_control: {
        view_users: "Visualizar usuários",
        create_users: "Criar usuários",
        edit_users: "Editar usuários",
        delete_users: "Excluir usuários",
        manage_roles: "Gerenciar roles",
        manage_permissions: "Gerenciar permissões",
      },
      subjects: {
        view_subjects: "Visualizar disciplinas",
        create_subjects: "Criar disciplinas",
        edit_subjects: "Editar disciplinas",
        delete_subjects: "Excluir disciplinas",
        assign_teacher_subjects: "Associar professores a disciplinas",
      },
      classes: {
        view_classes: "Visualizar turmas",
        create_classes: "Criar turmas",
        edit_classes: "Editar turmas",
        delete_classes: "Excluir turmas",
        manage_enrollments: "Gerenciar matrículas",
        view_students: "Visualizar alunos",
      },
      lessons_activities: {
        view_lessons: "Visualizar aulas",
        create_lessons: "Criar aulas",
        edit_lessons: "Editar aulas",
        delete_lessons: "Excluir aulas",
        schedule_lessons: "Agendar aulas",
        view_activities: "Visualizar atividades",
        create_activities: "Criar atividades",
        edit_activities: "Editar atividades",
        delete_activities: "Excluir atividades",
        grade_activities: "Corrigir atividades",
        view_academic_units: "Visualizar unidades acadêmicas",
        create_academic_units: "Criar unidades acadêmicas",
        edit_academic_units: "Editar unidades acadêmicas",
        delete_academic_units: "Excluir unidades acadêmicas",
        close_academic_units: "Fechar unidades acadêmicas",
      },
      communication: {
        view_doubts: "Visualizar dúvidas",
        create_doubts: "Criar dúvidas",
        respond_doubts: "Responder dúvidas",
        resolve_doubts: "Resolver dúvidas",
        delete_doubts: "Excluir dúvidas",
        view_notifications: "Visualizar notificações",
        create_notifications: "Criar notificações",
        edit_notifications: "Editar notificações",
        delete_notifications: "Excluir notificações",
        schedule_notifications: "Agendar notificações",
        view_templates: "Visualizar templates",
        create_templates: "Criar templates",
        edit_templates: "Editar templates",
        delete_templates: "Excluir templates",
        use_templates: "Usar templates",
        view_alerts: "Visualizar alertas",
        create_alerts: "Criar alertas",
        mark_alerts_read: "Marcar alertas como lidos",
      },
      reports_analytics: {
        view_reports: "Visualizar relatórios",
        create_reports: "Criar relatórios",
        edit_reports: "Editar relatórios",
        delete_reports: "Excluir relatórios",
        schedule_reports: "Agendar relatórios",
        export_reports: "Exportar relatórios",
        view_analytics: "Visualizar analytics",
        view_kpis: "Visualizar KPIs",
        manage_dashboard: "Gerenciar dashboard",
        view_report_templates: "Visualizar templates de relatórios",
        create_report_templates: "Criar templates de relatórios",
        edit_report_templates: "Editar templates de relatórios",
        delete_report_templates: "Excluir templates de relatórios",
      },
    };

    return (
      descriptions[module]?.[action] ||
      `${action} em ${module}`.replace(/_/g, " ")
    );
  }
}

export const permissionsService = new PermissionsService();
