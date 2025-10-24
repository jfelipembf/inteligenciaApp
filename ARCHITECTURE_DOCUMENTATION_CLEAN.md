# 🏗️ ARQUITECTURE DOCUMENTATION - CLEAN VERSION

## 📋 **ESTRUTURA DE DADOS PRINCIPAIS**

### **1. CONTROLE DE ACESSO E HIERARQUIA**

```javascript
// Coleção: accounts (Contas Master - CEO)
{
  id: "account_1",
  name: "Grupo Educacional ABC",
  status: "active",
  metadata: {
    createdAt: timestamp,
    createdBy: "ceo_user_id"
  }
}

// Coleção: schools (Escolas)
{
  id: "school_1",
  accountId: "account_1",
  name: "Escola Municipal João Silva",
  address: "Rua das Flores, 123",
  phone: "(11) 99999-9999",
  email: "contato@escola.com",
  status: "active",
  metadata: {
    createdAt: timestamp,
    createdBy: "ceo_user_id"
  }
}

// Coleção: users (Usuários)
{
  id: "user_1",
  email: "professor@escola.com",
  schools: [
    {
      schoolId: "school_1",
      role: "professor",
      subjects: ["subj_mathematics", "subj_physics"],
      status: "active"
    }
  ],
  currentSchoolId: "school_1",
  personalInfo: {
    name: "João Silva",
    phone: "(11) 99999-9999"
  },
  academicInfo: {
    currentClassId: "class_1",
    academicYearId: "year_2024"
  },
  metadata: {
    createdAt: timestamp,
    lastLogin: timestamp
  }
}

// Coleção: roles (Roles Padrão e Customizados)
{
  id: "role_1",
  schoolId: "school_1",
  name: "Professor de Matemática",
  type: "custom", // default, custom
  permissionIds: ["view_lessons", "create_lessons", "grade_activities"],
  metadata: {
    createdAt: timestamp,
    createdBy: "director_user_id"
  }
}

// Coleção: permissions (Permissões)
{
  id: "permission_1",
  module: "lessons",
  action: "view",
  name: "view_lessons",
  description: "Visualizar aulas"
}

// Coleção: user_permissions_cache (Cache de Permissões)
{
  id: "cache_1",
  userId: "user_1",
  schoolId: "school_1",
  permissions: ["view_lessons", "create_lessons"],
  lastUpdated: timestamp
}
```

### **2. SISTEMA DE DISCIPLINAS**

```javascript
// Coleção: subjects (Disciplinas Globais)
{
  id: "subj_mathematics",
  name: "Matemática",
  description: "Disciplina de matemática",
  category: "exact_sciences",
  isGlobal: true,
  metadata: {
    createdAt: timestamp,
    createdBy: "ceo_user_id"
  }
}

// Coleção: school_subjects (Disciplinas da Escola)
{
  id: "school_subj_1",
  schoolId: "school_1",
  subjectId: "subj_mathematics",
  name: "Matemática Básica",
  description: "Matemática adaptada para nossa escola",
  isActive: true,
  metadata: {
    createdAt: timestamp,
    createdBy: "coordinator_user_id"
  }
}

// Coleção: teacher_subjects (Professor-Disciplina)
{
  id: "teacher_456_school_1",
  teacherId: "teacher_456",
  schoolId: "school_1",
  subjects: [
    {
      subjectId: "subj_mathematics",
      subjectName: "Matemática",
      isActive: true,
      assignedAt: timestamp
    }
  ],
  metadata: {
    createdAt: timestamp,
    updatedAt: timestamp
  }
}
```

### **3. SISTEMA DE TURMAS**

```javascript
// Coleção: academic_years (Anos Letivos)
{
  id: "year_2024",
  schoolId: "school_1",
  year: "2024",
  startDate: "2024-01-15",
  endDate: "2024-12-15",
  status: "active", // planning, active, closed
  metadata: {
    createdAt: timestamp,
    createdBy: "director_user_id"
  }
}

// Coleção: classes (Turmas)
{
  id: "class_1",
  schoolId: "school_1",
  academicYearId: "year_2024",
  name: "1º Ano A",
  description: "Primeiro ano do ensino fundamental",
  period: "manhã", // manhã, tarde, noite
  capacity: 30,
  studentCount: 25,
  status: "active",
  metadata: {
    createdAt: timestamp,
    createdBy: "director_user_id"
  }
}

// Coleção: class_enrollments (Matrículas)
{
  id: "enrollment_1",
  schoolId: "school_1",
  academicYearId: "year_2024",
  classId: "class_1",
  studentId: "student_123",
  enrollmentDate: timestamp,
  status: "active", // active, transferred, graduated
  metadata: {
    createdAt: timestamp,
    createdBy: "director_user_id"
  }
}

// Coleção: class_teachers (Professor-Turma-Disciplina)
{
  id: "class_teacher_1",
  schoolId: "school_1",
  academicYearId: "year_2024",
  classId: "class_1",
  teacherId: "teacher_456",
  subjectId: "subj_mathematics",
  status: "active",
  metadata: {
    createdAt: timestamp,
    createdBy: "director_user_id"
  }
}
```

### **4. SISTEMA DE AULAS E ATIVIDADES**

```javascript
// Coleção: academic_units (Unidades Acadêmicas)
{
  id: "unit_1",
  schoolId: "school_1",
  academicYearId: "year_2024",
  name: "1ª Unidade",
  description: "Primeira unidade do ano letivo",
  order: 1,
  startDate: "2024-01-15",
  endDate: "2024-03-15",
  status: "active", // active, closed, planning
  metadata: {
    createdAt: timestamp,
    createdBy: "coordinator_456"
  }
}

// Coleção: lessons (Aulas)
{
  id: "lesson_1",
  schoolId: "school_1",
  academicYearId: "year_2024",
  classId: "class_1",
  subjectId: "subj_mathematics",
  teacherId: "teacher_456",
  name: "Aula de Matemática - Adição",
  description: "Introdução à adição básica",
  startTime: "08:00",
  endTime: "09:00",
  dayOfWeek: "monday",
  room: "Sala 101",
  status: "active", // active, cancelled, completed
  metadata: {
    createdAt: timestamp,
    createdBy: "teacher_456"
  }
}

// Coleção: activities (Atividades)
{
  id: "activity_1",
  schoolId: "school_1",
  academicYearId: "year_2024",
  classId: "class_1",
  subjectId: "subj_mathematics",
  teacherId: "teacher_456",
  unitId: "unit_1",
  unitName: "1ª Unidade",
  lessonId: "lesson_1",
  name: "Exercícios de Adição",
  description: "Lista de exercícios para prática",
  startDate: "2024-01-20",
  endDate: "2024-01-25",
  score: 10,
  type: "homework", // homework, exam, project, quiz
  isGraded: true,
  status: "active",
  metadata: {
    createdAt: timestamp,
    createdBy: "teacher_456"
  }
}

// Coleção: activity_submissions (Submissões)
{
  id: "submission_1",
  activityId: "activity_1",
  studentId: "student_123",
  schoolId: "school_1",
  academicYearId: "year_2024",
  classId: "class_1",
  subjectId: "subj_mathematics",
  teacherId: "teacher_456",
  unitId: "unit_1",
  unitName: "1ª Unidade",
  submittedAt: timestamp,
  score: 8.5,
  feedback: "Muito bom trabalho!",
  status: "submitted", // submitted, graded, late
  metadata: {
    createdAt: timestamp,
    gradedAt: timestamp,
    gradedBy: "teacher_456"
  }
}

// Coleção: lesson_schedule (Cronograma - Cache)
{
  id: "schedule_1",
  schoolId: "school_1",
  academicYearId: "year_2024",
  classId: "class_1",
  dayOfWeek: "monday",
  timeSlot: "08:00-09:00",
  subjectId: "subj_mathematics",
  teacherId: "teacher_456",
  room: "Sala 101",
  lessonId: "lesson_1",
  status: "active",
  metadata: {
    createdAt: timestamp,
    updatedAt: timestamp
  }
}
```

### **5. SISTEMA DE COMUNICAÇÃO E NOTIFICAÇÕES**

```javascript
// Coleção: doubts (Dúvidas - Chat Aluno-Professor)
{
  id: "doubt_1",
  schoolId: "school_1",
  academicYearId: "year_2024",
  classId: "class_1",
  subjectId: "subj_mathematics",
  studentId: "student_123",
  teacherId: "teacher_456",
  doubt: "Como resolver equações de segundo grau?",
  status: "active", // active, resolved, closed
  remetente: {
    label: "João Silva",
    value: "student_123"
  },
  destinatario: {
    label: "Prof. Roberto Santos",
    value: "teacher_456"
  },
  metadata: {
    createdAt: timestamp,
    resolvedAt: null,
    resolvedBy: null
  }
}

// Coleção: doubt_messages (Mensagens das Dúvidas)
{
  id: "message_1",
  doubtId: "doubt_1",
  schoolId: "school_1",
  remetente: {
    label: "João Silva",
    value: "student_123"
  },
  destinatario: {
    label: "Prof. Roberto Santos",
    value: "teacher_456"
  },
  message: "Professor, não entendi como aplicar a fórmula de Bhaskara.",
  createdAt: timestamp,
  readAt: null,
  metadata: {
    messageType: "text", // text, image, file
    attachments: []
  }
}

// Coleção: notifications (Comunicados Gerais)
{
  id: "notification_1",
  schoolId: "school_1",
  academicYearId: "year_2024",
  title: "Reunião de Pais - 1º Bimestre",
  message: "Prezados responsáveis, convidamos para a reunião de pais...",
  description: "Reunião para apresentação dos resultados do 1º bimestre",
  type: "class", // individual, class, turn, school
  recipients: {
    type: "class",
    class: {
      value: "class_1",
      label: "1º Ano A"
    },
    individual: null,
    turn: null
  },
  sentBy: {
    label: "Coordenação Pedagógica",
    value: "coordinator_456"
  },
  status: "sent", // draft, sent, scheduled
  schedule: null,
  createdAt: timestamp,
  metadata: {
    attachments: [],
    priority: "normal" // low, normal, high
  }
}

// Coleção: alerts (Alertas e Notificações Push)
{
  id: "alert_1",
  schoolId: "school_1",
  title: "Nova mensagem no chat da dúvida: Matemática",
  message: "Você recebeu uma nova mensagem de João Silva no chat.",
  description: "Mensagem: 'Professor, não entendi como aplicar a fórmula de Bhaskara.'",
  type: "doubt", // notification, event, activity, doubt, grade
  sentBy: {
    label: "João Silva",
    value: "student_123"
  },
  referenceId: "message_1",
  recipients: ["teacher_456"],
  readBy: {
    "teacher_456": false,
    "student_123": true
  },
  schedule: null,
  sent: null,
  createdAt: timestamp,
  metadata: {
    pushSent: true,
    fcmTokens: ["token1", "token2"]
  }
}

// Coleção: message_templates (Templates de Mensagens)
{
  id: "template_1",
  schoolId: "school_1",
  name: "Boas-vindas à turma",
  content: "Olá alunos! Bem-vindos ao novo ano letivo. Estou muito animado para trabalhar com vocês este ano.",
  category: "turma", // turma, atividades, responsáveis, reuniões, geral
  variables: [], // Variáveis disponíveis no template
  createdBy: {
    label: "Prof. Roberto Santos",
    value: "teacher_456"
  },
  isGlobal: false,
  usageCount: 15,
  status: "active",
  metadata: {
    createdAt: timestamp,
    lastUsed: timestamp
  }
}

// Coleção: communication_logs (Log de Comunicações)
{
  id: "log_1",
  schoolId: "school_1",
  type: "doubt_message", // doubt_message, notification, alert
  senderId: "student_123",
  recipientId: "teacher_456",
  content: "Professor, não entendi como aplicar a fórmula de Bhaskara.",
  status: "sent", // sent, delivered, read, failed
  metadata: {
    timestamp: timestamp,
    channel: "web", // web, mobile, email
    referenceId: "message_1"
  }
}
```

## 🔐 **PERMISSÕES E ROLES**

### **PERMISSÕES POR MÓDULO**

```javascript
const PERMISSIONS = {
  // Controle de Acesso
  access_control: {
    view_users: "view_users",
    create_users: "create_users",
    edit_users: "edit_users",
    delete_users: "delete_users",
    manage_roles: "manage_roles",
    manage_permissions: "manage_permissions",
  },

  // Disciplinas
  subjects: {
    view_subjects: "view_subjects",
    create_subjects: "create_subjects",
    edit_subjects: "edit_subjects",
    delete_subjects: "delete_subjects",
    assign_teacher_subjects: "assign_teacher_subjects",
  },

  // Turmas
  classes: {
    view_classes: "view_classes",
    create_classes: "create_classes",
    edit_classes: "edit_classes",
    delete_classes: "delete_classes",
    manage_enrollments: "manage_enrollments",
    view_students: "view_students",
  },

  // Aulas e Atividades
  lessons_activities: {
    view_lessons: "view_lessons",
    create_lessons: "create_lessons",
    edit_lessons: "edit_lessons",
    delete_lessons: "delete_lessons",
    schedule_lessons: "schedule_lessons",
    view_activities: "view_activities",
    create_activities: "create_activities",
    edit_activities: "edit_activities",
    delete_activities: "delete_activities",
    grade_activities: "grade_activities",
    view_academic_units: "view_academic_units",
    create_academic_units: "create_academic_units",
    edit_academic_units: "edit_academic_units",
    delete_academic_units: "delete_academic_units",
    close_academic_units: "close_academic_units",
  },

  // Comunicação
  communication: {
    view_doubts: "view_doubts",
    create_doubts: "create_doubts",
    respond_doubts: "respond_doubts",
    resolve_doubts: "resolve_doubts",
    delete_doubts: "delete_doubts",
    view_notifications: "view_notifications",
    create_notifications: "create_notifications",
    edit_notifications: "edit_notifications",
    delete_notifications: "delete_notifications",
    schedule_notifications: "schedule_notifications",
    view_templates: "view_templates",
    create_templates: "create_templates",
    edit_templates: "edit_templates",
    delete_templates: "delete_templates",
    use_templates: "use_templates",
    view_alerts: "view_alerts",
    create_alerts: "create_alerts",
    mark_alerts_read: "mark_alerts_read",
  },
};

// Roles Padrão
const DEFAULT_ROLES = {
  director: [
    // Acesso total à escola
    "view_users",
    "create_users",
    "edit_users",
    "delete_users",
    "manage_roles",
    "view_subjects",
    "create_subjects",
    "edit_subjects",
    "delete_subjects",
    "assign_teacher_subjects",
    "view_classes",
    "create_classes",
    "edit_classes",
    "delete_classes",
    "manage_enrollments",
    "view_students",
    "view_lessons",
    "create_lessons",
    "edit_lessons",
    "delete_lessons",
    "schedule_lessons",
    "view_activities",
    "create_activities",
    "edit_activities",
    "delete_activities",
    "grade_activities",
    "view_academic_units",
    "create_academic_units",
    "edit_academic_units",
    "delete_academic_units",
    "close_academic_units",
    "view_doubts",
    "create_doubts",
    "respond_doubts",
    "resolve_doubts",
    "delete_doubts",
    "view_notifications",
    "create_notifications",
    "edit_notifications",
    "delete_notifications",
    "schedule_notifications",
    "view_templates",
    "create_templates",
    "edit_templates",
    "delete_templates",
    "use_templates",
    "view_alerts",
    "create_alerts",
    "mark_alerts_read",
  ],

  coordinator: [
    // Gestão pedagógica
    "view_users",
    "create_users",
    "edit_users",
    "view_subjects",
    "create_subjects",
    "edit_subjects",
    "assign_teacher_subjects",
    "view_classes",
    "create_classes",
    "edit_classes",
    "manage_enrollments",
    "view_students",
    "view_lessons",
    "create_lessons",
    "edit_lessons",
    "schedule_lessons",
    "view_activities",
    "create_activities",
    "edit_activities",
    "grade_activities",
    "view_academic_units",
    "create_academic_units",
    "edit_academic_units",
    "close_academic_units",
    "view_doubts",
    "create_doubts",
    "respond_doubts",
    "resolve_doubts",
    "view_notifications",
    "create_notifications",
    "edit_notifications",
    "schedule_notifications",
    "view_templates",
    "create_templates",
    "edit_templates",
    "use_templates",
    "view_alerts",
    "create_alerts",
    "mark_alerts_read",
  ],

  professor: [
    // Gestão de aulas e atividades
    "view_subjects",
    "view_classes",
    "view_students",
    "view_lessons",
    "create_lessons",
    "edit_lessons",
    "view_activities",
    "create_activities",
    "edit_activities",
    "grade_activities",
    "view_academic_units",
    "view_doubts",
    "create_doubts",
    "respond_doubts",
    "resolve_doubts",
    "view_notifications",
    "create_notifications",
    "view_templates",
    "create_templates",
    "use_templates",
    "view_alerts",
    "mark_alerts_read",
  ],

  student: [
    // Acesso limitado
    "view_classes",
    "view_lessons",
    "view_activities",
    "view_doubts",
    "create_doubts",
    "view_notifications",
    "view_templates",
    "use_templates",
    "view_alerts",
    "mark_alerts_read",
  ],
};
```

## 🏗️ **HOOKS DE IMPLEMENTAÇÃO**

### **1. Controle de Acesso**

- **useRoleManagement**: Gerenciar roles e permissões
- **useSchoolIsolation**: Garantir isolamento de dados por escola
- **useMultiSchoolAuth**: Autenticação multi-escola
- **useSchoolSwitcher**: Trocar contexto de escola
- **useUserCreation**: Criar usuários com validações

### **2. Disciplinas**

- **useSubjectManagement**: CRUD de disciplinas globais e escolares
- **useTeacherSubjectAssignment**: Associar professores a disciplinas

### **3. Turmas**

- **useClassManagement**: Criar turmas e listar por ano letivo
- **useEnrollmentManagement**: Matricular alunos, transferir entre turmas
- **useAcademicYearManagement**: Criar anos letivos e gerenciar status

### **4. Aulas e Atividades**

- **useAcademicUnitManagement**: Criar, listar e gerenciar unidades acadêmicas
- **useLessonManagement**: Criar aulas, validar conflitos de horário
- **useActivityManagement**: Criar atividades, validar professor-disciplina
- **useSubmissionManagement**: Submeter atividades, validar matrícula

### **5. Comunicação**

- **useDoubtManagement**: Gerenciar criação, listagem e resolução de dúvidas
- **useDoubtMessages**: Enviar mensagens, listar conversas e marcar como lida
- **useNotificationManagement**: Criar notificações e determinar destinatários
- **useTemplateManagement**: Criar, listar e usar templates de mensagens
- **useAlertManagement**: Gerenciar alertas não lidos e marcar como lidos

## 🔄 **FLUXOS PRINCIPAIS**

### **1. Autenticação Multi-Escola**

1. Usuário faz login com email
2. Sistema busca escolas associadas ao usuário
3. Usuário seleciona escola e role desejados
4. Sistema atualiza contexto atual
5. Usuário acessa sistema com permissões corretas

### **2. Criação de Turma**

1. Diretor seleciona ano letivo ativo
2. Preenche dados da turma
3. Sistema valida unicidade no ano
4. Turma é criada com contador zerado

### **3. Matrícula de Aluno**

1. Diretor seleciona turma e aluno
2. Sistema verifica se aluno já está matriculado
3. Sistema cria matrícula e atualiza contadores
4. Aluno fica vinculado à turma

### **4. Criação de Atividade**

1. Professor seleciona turma, disciplina e unidade
2. Sistema valida competência do professor
3. Professor define detalhes da atividade
4. Atividade é criada vinculada à unidade

### **5. Troca de Mensagens**

1. Usuário acessa dúvida específica
2. Digite mensagem no chat
3. Sistema envia mensagem e cria alerta
4. Destinatário recebe notificação push
5. Mensagem aparece no chat em tempo real

## 📊 **VANTAGENS DO SISTEMA**

### **Performance e Escalabilidade**

- ✅ Collections separadas para queries otimizadas
- ✅ Cache de permissões para acesso rápido
- ✅ Sistema de alertas eficiente
- ✅ Templates para acelerar comunicação
- ✅ Estrutura preparada para índices

### **Integridade e Validação**

- ✅ Validação professor-disciplina
- ✅ Verificação de conflitos de horário
- ✅ Validação de matrícula para submissões
- ✅ Controle de unidades acadêmicas
- ✅ Sistema de leitura de mensagens

### **Flexibilidade e Organização**

- ✅ Unidades acadêmicas personalizáveis
- ✅ Atividades independentes ou vinculadas a aulas
- ✅ Sistema de tipos de atividade
- ✅ Templates personalizáveis por escola
- ✅ Categorização de templates
- ✅ Sistema de variáveis dinâmicas

### **Manutenibilidade**

- ✅ Hooks especializados por funcionalidade
- ✅ Sistema de logs centralizado
- ✅ Estrutura normalizada
- ✅ Auditoria completa
- ✅ Validações centralizadas

### **6. SISTEMA DE RELATÓRIOS E ANALYTICS**

```javascript
// Coleção: report_templates (Templates de Relatórios)
{
  id: "template_1",
  schoolId: "school_1",
  name: "Relatório de Desempenho por Turma",
  type: "academic_performance", // academic_performance, attendance, grades, communication
  category: "class_report", // class_report, student_report, teacher_report, school_report
  description: "Relatório detalhado de desempenho acadêmico por turma",
  parameters: {
    academicYearId: "required",
    classId: "required",
    unitId: "optional",
    subjectId: "optional",
    dateRange: "optional"
  },
  fields: [
    {
      name: "classAverage",
      label: "Média da Turma",
      type: "number",
      format: "decimal_2"
    },
    {
      name: "studentCount",
      label: "Número de Alunos",
      type: "number"
    },
    {
      name: "approvalRate",
      label: "Taxa de Aprovação",
      type: "percentage"
    }
  ],
  isGlobal: false,
  usageCount: 25,
  status: "active",
  metadata: {
    createdAt: timestamp,
    createdBy: "coordinator_456",
    lastUsed: timestamp
  }
}

// Coleção: report_cache (Cache de Relatórios)
{
  id: "cache_1",
  schoolId: "school_1",
  reportType: "academic_performance",
  parameters: {
    academicYearId: "year_2024",
    classId: "class_1",
    unitId: "unit_1"
  },
  data: {
    classAverage: 8.5,
    studentCount: 25,
    approvalRate: 85.5,
    topStudents: [
      {
        studentId: "student_123",
        name: "João Silva",
        average: 9.2
      }
    ],
    gradeDistribution: {
      "0-2": 0,
      "2-4": 1,
      "4-6": 2,
      "6-8": 8,
      "8-10": 14
    }
  },
  generatedAt: timestamp,
  expiresAt: timestamp, // Cache válido por 1 hora
  metadata: {
    generatedBy: "coordinator_456",
    version: "1.0"
  }
}

// Coleção: analytics_events (Eventos de Analytics)
{
  id: "event_1",
  schoolId: "school_1",
  userId: "teacher_456",
  userRole: "professor",
  eventType: "activity_created", // activity_created, lesson_created, grade_assigned, attendance_taken
  eventData: {
    activityId: "activity_1",
    activityName: "Exercícios de Matemática",
    classId: "class_1",
    subjectId: "subj_mathematics"
  },
  timestamp: timestamp,
  sessionId: "session_123",
  metadata: {
    userAgent: "Mozilla/5.0...",
    ipAddress: "192.168.1.1",
    deviceType: "desktop"
  }
}

// Coleção: kpi_metrics (Métricas de KPI)
{
  id: "kpi_1",
  schoolId: "school_1",
  academicYearId: "year_2024",
  period: "monthly", // daily, weekly, monthly, quarterly, yearly
  periodValue: "2024-01", // Janeiro de 2024
  metrics: {
    academic: {
      overallAverage: 8.2,
      approvalRate: 87.5,
      retentionRate: 95.0,
      gradeDistribution: {
        "0-2": 0.5,
        "2-4": 2.1,
        "4-6": 8.3,
        "6-8": 25.7,
        "8-10": 63.4
      }
    },
    attendance: {
      overallAttendance: 92.3,
      attendanceByClass: {
        "class_1": 94.1,
        "class_2": 90.5
      },
      attendanceBySubject: {
        "subj_mathematics": 95.2,
        "subj_portuguese": 89.8
      }
    },
    engagement: {
      activitiesCreated: 156,
      activitiesCompleted: 142,
      completionRate: 91.0,
      averageCompletionTime: 2.5, // horas
      doubtsCreated: 23,
      doubtsResolved: 21,
      resolutionRate: 91.3
    },
    communication: {
      notificationsSent: 45,
      notificationsRead: 38,
      readRate: 84.4,
      templatesUsed: 12,
      messagesExchanged: 67
    }
  },
  calculatedAt: timestamp,
  metadata: {
    calculatedBy: "system",
    dataPoints: 1250
  }
}

// Coleção: dashboard_widgets (Widgets de Dashboard)
{
  id: "widget_1",
  schoolId: "school_1",
  userId: "coordinator_456",
  widgetType: "chart", // chart, table, metric, progress
  chartType: "bar", // bar, line, pie, donut, area
  title: "Médias por Turma",
  dataSource: {
    type: "kpi_metrics",
    query: {
      academicYearId: "year_2024",
      period: "monthly",
      metric: "academic.overallAverage"
    }
  },
  position: {
    row: 1,
    column: 1,
    width: 6,
    height: 4
  },
  settings: {
    showLegend: true,
    showDataLabels: true,
    colors: ["#556ee6", "#34c38f", "#f1b44c", "#f46a6a"]
  },
  isVisible: true,
  metadata: {
    createdAt: timestamp,
    updatedAt: timestamp
  }
}

// Coleção: report_schedules (Agendamento de Relatórios)
{
  id: "schedule_1",
  schoolId: "school_1",
  reportTemplateId: "template_1",
  name: "Relatório Semanal de Desempenho",
  frequency: "weekly", // daily, weekly, monthly, quarterly
  dayOfWeek: "monday", // Para relatórios semanais
  dayOfMonth: null, // Para relatórios mensais
  time: "08:00",
  recipients: [
    {
      userId: "director_123",
      email: "director@escola.com",
      role: "director"
    },
    {
      userId: "coordinator_456",
      email: "coordinator@escola.com",
      role: "coordinator"
    }
  ],
  parameters: {
    academicYearId: "year_2024",
    classId: "all", // "all" para todas as turmas
    format: "pdf" // pdf, excel, csv
  },
  isActive: true,
  lastGenerated: timestamp,
  nextGeneration: timestamp,
  metadata: {
    createdAt: timestamp,
    createdBy: "director_123"
  }
}

// Coleção: report_logs (Log de Relatórios)
{
  id: "log_1",
  schoolId: "school_1",
  reportTemplateId: "template_1",
  reportType: "academic_performance",
  generatedBy: "coordinator_456",
  parameters: {
    academicYearId: "year_2024",
    classId: "class_1"
  },
  status: "completed", // pending, processing, completed, failed
  generatedAt: timestamp,
  processingTime: 2.5, // segundos
  fileSize: 1024, // bytes
  downloadCount: 3,
  metadata: {
    format: "pdf",
    dataPoints: 150,
    cacheHit: true
  }
}
```

## 🔐 **PERMISSÕES E ROLES**

### **PERMISSÕES POR MÓDULO**

```javascript
const PERMISSIONS = {
  // Controle de Acesso
  access_control: {
    view_users: "view_users",
    create_users: "create_users",
    edit_users: "edit_users",
    delete_users: "delete_users",
    manage_roles: "manage_roles",
    manage_permissions: "manage_permissions",
  },

  // Disciplinas
  subjects: {
    view_subjects: "view_subjects",
    create_subjects: "create_subjects",
    edit_subjects: "edit_subjects",
    delete_subjects: "delete_subjects",
    assign_teacher_subjects: "assign_teacher_subjects",
  },

  // Turmas
  classes: {
    view_classes: "view_classes",
    create_classes: "create_classes",
    edit_classes: "edit_classes",
    delete_classes: "delete_classes",
    manage_enrollments: "manage_enrollments",
    view_students: "view_students",
  },

  // Aulas e Atividades
  lessons_activities: {
    view_lessons: "view_lessons",
    create_lessons: "create_lessons",
    edit_lessons: "edit_lessons",
    delete_lessons: "delete_lessons",
    schedule_lessons: "schedule_lessons",
    view_activities: "view_activities",
    create_activities: "create_activities",
    edit_activities: "edit_activities",
    delete_activities: "delete_activities",
    grade_activities: "grade_activities",
    view_academic_units: "view_academic_units",
    create_academic_units: "create_academic_units",
    edit_academic_units: "edit_academic_units",
    delete_academic_units: "delete_academic_units",
    close_academic_units: "close_academic_units",
  },

  // Comunicação
  communication: {
    view_doubts: "view_doubts",
    create_doubts: "create_doubts",
    respond_doubts: "respond_doubts",
    resolve_doubts: "resolve_doubts",
    delete_doubts: "delete_doubts",
    view_notifications: "view_notifications",
    create_notifications: "create_notifications",
    edit_notifications: "edit_notifications",
    delete_notifications: "delete_notifications",
    schedule_notifications: "schedule_notifications",
    view_templates: "view_templates",
    create_templates: "create_templates",
    edit_templates: "edit_templates",
    delete_templates: "delete_templates",
    use_templates: "use_templates",
    view_alerts: "view_alerts",
    create_alerts: "create_alerts",
    mark_alerts_read: "mark_alerts_read",
  },

  // Relatórios e Analytics
  reports_analytics: {
    view_reports: "view_reports",
    create_reports: "create_reports",
    edit_reports: "edit_reports",
    delete_reports: "delete_reports",
    schedule_reports: "schedule_reports",
    export_reports: "export_reports",
    view_analytics: "view_analytics",
    view_kpis: "view_kpis",
    manage_dashboard: "manage_dashboard",
    view_report_templates: "view_report_templates",
    create_report_templates: "create_report_templates",
    edit_report_templates: "edit_report_templates",
    delete_report_templates: "delete_report_templates",
  },
};

// Roles Padrão
const DEFAULT_ROLES = {
  director: [
    // Acesso total à escola
    "view_users",
    "create_users",
    "edit_users",
    "delete_users",
    "manage_roles",
    "view_subjects",
    "create_subjects",
    "edit_subjects",
    "delete_subjects",
    "assign_teacher_subjects",
    "view_classes",
    "create_classes",
    "edit_classes",
    "delete_classes",
    "manage_enrollments",
    "view_students",
    "view_lessons",
    "create_lessons",
    "edit_lessons",
    "delete_lessons",
    "schedule_lessons",
    "view_activities",
    "create_activities",
    "edit_activities",
    "delete_activities",
    "grade_activities",
    "view_academic_units",
    "create_academic_units",
    "edit_academic_units",
    "delete_academic_units",
    "close_academic_units",
    "view_doubts",
    "create_doubts",
    "respond_doubts",
    "resolve_doubts",
    "delete_doubts",
    "view_notifications",
    "create_notifications",
    "edit_notifications",
    "delete_notifications",
    "schedule_notifications",
    "view_templates",
    "create_templates",
    "edit_templates",
    "delete_templates",
    "use_templates",
    "view_alerts",
    "create_alerts",
    "mark_alerts_read",
    "view_reports",
    "create_reports",
    "edit_reports",
    "delete_reports",
    "schedule_reports",
    "export_reports",
    "view_analytics",
    "view_kpis",
    "manage_dashboard",
    "view_report_templates",
    "create_report_templates",
    "edit_report_templates",
    "delete_report_templates",
  ],

  coordinator: [
    // Gestão pedagógica
    "view_users",
    "create_users",
    "edit_users",
    "view_subjects",
    "create_subjects",
    "edit_subjects",
    "assign_teacher_subjects",
    "view_classes",
    "create_classes",
    "edit_classes",
    "manage_enrollments",
    "view_students",
    "view_lessons",
    "create_lessons",
    "edit_lessons",
    "schedule_lessons",
    "view_activities",
    "create_activities",
    "edit_activities",
    "grade_activities",
    "view_academic_units",
    "create_academic_units",
    "edit_academic_units",
    "close_academic_units",
    "view_doubts",
    "create_doubts",
    "respond_doubts",
    "resolve_doubts",
    "view_notifications",
    "create_notifications",
    "edit_notifications",
    "schedule_notifications",
    "view_templates",
    "create_templates",
    "edit_templates",
    "use_templates",
    "view_alerts",
    "create_alerts",
    "mark_alerts_read",
    "view_reports",
    "create_reports",
    "edit_reports",
    "export_reports",
    "view_analytics",
    "view_kpis",
    "manage_dashboard",
    "view_report_templates",
    "create_report_templates",
    "edit_report_templates",
  ],

  professor: [
    // Gestão de aulas e atividades
    "view_subjects",
    "view_classes",
    "view_students",
    "view_lessons",
    "create_lessons",
    "edit_lessons",
    "view_activities",
    "create_activities",
    "edit_activities",
    "grade_activities",
    "view_academic_units",
    "view_doubts",
    "create_doubts",
    "respond_doubts",
    "resolve_doubts",
    "view_notifications",
    "create_notifications",
    "view_templates",
    "create_templates",
    "use_templates",
    "view_alerts",
    "mark_alerts_read",
    "view_reports",
    "create_reports",
    "export_reports",
    "view_analytics",
    "view_report_templates",
  ],

  student: [
    // Acesso limitado
    "view_classes",
    "view_lessons",
    "view_activities",
    "view_doubts",
    "create_doubts",
    "view_notifications",
    "view_templates",
    "use_templates",
    "view_alerts",
    "mark_alerts_read",
    "view_reports",
  ],
};
```

## 🏗️ **HOOKS DE IMPLEMENTAÇÃO**

### **1. Controle de Acesso**

- **useRoleManagement**: Gerenciar roles e permissões
- **useSchoolIsolation**: Garantir isolamento de dados por escola
- **useMultiSchoolAuth**: Autenticação multi-escola
- **useSchoolSwitcher**: Trocar contexto de escola
- **useUserCreation**: Criar usuários com validações

### **2. Disciplinas**

- **useSubjectManagement**: CRUD de disciplinas globais e escolares
- **useTeacherSubjectAssignment**: Associar professores a disciplinas

### **3. Turmas**

- **useClassManagement**: Criar turmas e listar por ano letivo
- **useEnrollmentManagement**: Matricular alunos, transferir entre turmas
- **useAcademicYearManagement**: Criar anos letivos e gerenciar status

### **4. Aulas e Atividades**

- **useAcademicUnitManagement**: Criar, listar e gerenciar unidades acadêmicas
- **useLessonManagement**: Criar aulas, validar conflitos de horário
- **useActivityManagement**: Criar atividades, validar professor-disciplina
- **useSubmissionManagement**: Submeter atividades, validar matrícula

### **5. Comunicação**

- **useDoubtManagement**: Gerenciar criação, listagem e resolução de dúvidas
- **useDoubtMessages**: Enviar mensagens, listar conversas e marcar como lida
- **useNotificationManagement**: Criar notificações e determinar destinatários
- **useTemplateManagement**: Criar, listar e usar templates de mensagens
- **useAlertManagement**: Gerenciar alertas não lidos e marcar como lidos

### **6. Relatórios e Analytics**

- **useReportManagement**: Criar, listar e gerenciar relatórios
- **useReportTemplates**: Criar e usar templates de relatórios
- **useAnalyticsTracking**: Rastrear eventos e métricas de uso
- **useKPIMetrics**: Calcular e gerenciar KPIs da escola
- **useDashboardManagement**: Gerenciar widgets e dashboards personalizados
- **useReportScheduling**: Agendar geração automática de relatórios
- **useReportCache**: Gerenciar cache de relatórios para performance

## 🔄 **FLUXOS PRINCIPAIS**

### **1. Autenticação Multi-Escola**

1. Usuário faz login com email
2. Sistema busca escolas associadas ao usuário
3. Usuário seleciona escola e role desejados
4. Sistema atualiza contexto atual
5. Usuário acessa sistema com permissões corretas

### **2. Criação de Turma**

1. Diretor seleciona ano letivo ativo
2. Preenche dados da turma
3. Sistema valida unicidade no ano
4. Turma é criada com contador zerado

### **3. Matrícula de Aluno**

1. Diretor seleciona turma e aluno
2. Sistema verifica se aluno já está matriculado
3. Sistema cria matrícula e atualiza contadores
4. Aluno fica vinculado à turma

### **4. Criação de Atividade**

1. Professor seleciona turma, disciplina e unidade
2. Sistema valida competência do professor
3. Professor define detalhes da atividade
4. Atividade é criada vinculada à unidade

### **5. Troca de Mensagens**

1. Usuário acessa dúvida específica
2. Digite mensagem no chat
3. Sistema envia mensagem e cria alerta
4. Destinatário recebe notificação push
5. Mensagem aparece no chat em tempo real

### **6. Geração de Relatório**

1. Usuário seleciona template de relatório
2. Sistema valida parâmetros necessários
3. Sistema verifica cache disponível
4. Se não houver cache, gera dados em tempo real
5. Relatório é exibido e cache é atualizado
6. Usuário pode exportar em diferentes formatos

### **7. Agendamento de Relatórios**

1. Coordenador cria agendamento de relatório
2. Sistema define frequência e destinatários
3. Sistema gera relatório automaticamente
4. Relatório é enviado por email aos destinatários
5. Log de geração é registrado para auditoria

## 📊 **VANTAGENS DO SISTEMA**

### **Performance e Escalabilidade**

- ✅ Collections separadas para queries otimizadas
- ✅ Cache de permissões para acesso rápido
- ✅ Sistema de alertas eficiente
- ✅ Templates para acelerar comunicação
- ✅ Cache de relatórios para performance
- ✅ Sistema de analytics otimizado
- ✅ Estrutura preparada para índices

### **Integridade e Validação**

- ✅ Validação professor-disciplina
- ✅ Verificação de conflitos de horário
- ✅ Validação de matrícula para submissões
- ✅ Controle de unidades acadêmicas
- ✅ Sistema de leitura de mensagens
- ✅ Validação de parâmetros de relatórios
- ✅ Controle de acesso a dados sensíveis

### **Flexibilidade e Organização**

- ✅ Unidades acadêmicas personalizáveis
- ✅ Atividades independentes ou vinculadas a aulas
- ✅ Sistema de tipos de atividade
- ✅ Templates personalizáveis por escola
- ✅ Categorização de templates
- ✅ Sistema de variáveis dinâmicas
- ✅ Relatórios personalizáveis e agendáveis
- ✅ Dashboards configuráveis por usuário

### **Manutenibilidade**

- ✅ Hooks especializados por funcionalidade
- ✅ Sistema de logs centralizado
- ✅ Estrutura normalizada
- ✅ Auditoria completa
- ✅ Validações centralizadas
- ✅ Sistema de cache inteligente
- ✅ Métricas de performance integradas

---

**Status:** ✅ ARQUITETURA COMPLETA DOCUMENTADA
**Próximo:** Implementação por etapas seguindo esta documentação
