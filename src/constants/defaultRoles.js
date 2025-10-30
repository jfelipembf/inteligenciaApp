export const DEFAULT_ROLES = [
  {
    name: "director",
    description: "Diretor da escola - Acesso total",
    permissionIds: [
      "view_users",
      "create_users",
      "edit_users",
      "delete_users",
      "manage_roles",
      // Demais permissões podem ser adicionadas conforme necessário
    ],
  },
  {
    name: "coordinator",
    description: "Coordenador - Gerenciamento acadêmico",
    permissionIds: [
      "view_classes",
      "create_classes",
      "edit_classes",
      "view_students",
    ],
  },
  {
    name: "professor",
    description: "Professor - Aulas e atividades",
    permissionIds: [
      "view_lessons",
      "create_lessons",
      "view_activities",
      "create_activities",
      "grade_activities",
    ],
  },
];
