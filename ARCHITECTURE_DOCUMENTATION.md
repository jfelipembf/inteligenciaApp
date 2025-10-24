# 🏗️ ARQUITETURA DO SISTEMA - CONTROLE DE ACESSO E HIERARQUIA

## 📋 VISÃO GERAL

Sistema multi-escolas com isolamento total de dados, onde cada escola opera independentemente com sua própria hierarquia de usuários e permissões.

## 🎯 PRINCÍPIOS FUNDAMENTAIS

### 1. **Isolamento Total de Dados**

- Cada escola só acessa seus próprios dados
- Escolas concorrentes não podem ver informações umas das outras
- CEO tem apenas gestão administrativa, sem acesso a dados empresariais

### 2. **Hierarquia Clara**

```
CEO (Conta Master)
├── Escolas (Contas)
    ├── Diretor (poder total na escola)
    ├── Coordenador (responsabilidades definidas)
    ├── Professor (responsabilidades definidas)
    └── Roles Customizados (criados pelo Diretor)
```

### 3. **Sistema de Permissões Granular**

- Permissões por módulo/funcionalidade
- Roles padrão + roles customizáveis
- Cache inteligente para performance

## 🗄️ ESTRUTURA DE DADOS (FIRESTORE)

### **Collections Principais**

```javascript
collections/
├── accounts/                    // CEOs (Contas Master)
├── schools/                     // Escolas
├── users/                       // Usuários
├── roles/                       // Roles (padrão + customizados)
├── permissions/                 // Permissões globais (normalizadas)
└── user_permissions_cache/      // Cache de permissões por usuário
```

### **1. ACCOUNTS (CEOs)**

```javascript
// Coleção: accounts/{ceoId}
{
  id: "ceo_123",
  email: "ceo@empresa.com",
  name: "Empresa ABC",
  type: "master",
  managedSchools: ["school_1", "school_2"], // Apenas IDs para referência
  metadata: {
    createdAt: timestamp,
    status: "active"
  }
}
```

**Características:**

- Apenas gestão administrativa
- Não tem acesso a dados empresariais das escolas
- Pode criar/gerenciar escolas
- Lista de escolas gerenciadas

### **2. SCHOOLS (Escolas)**

```javascript
// Coleção: schools/{schoolId}
{
  id: "school_1",
  name: "Escola Municipal ABC",
  ceoId: "ceo_123", // Referência ao CEO
  directorId: "director_456", // Referência ao diretor
  status: "active", // active, suspended, inactive
  settings: {
    academicYear: "2024",
    gradingSystem: "numeric", // numeric, conceptual
    passingGrade: 7.0,
    timezone: "America/Sao_Paulo"
  },
  metadata: {
    createdAt: timestamp,
    createdBy: "ceo_123"
  }
}
```

**Características:**

- Dados completamente isolados
- Configurações específicas da escola
- Referência ao CEO e Diretor

### **3. USERS (Usuários Multi-Escola)**

```javascript
// Coleção: users/{userId}
{
  id: "user_789",
  email: "prof@escola.com", // Email único globalmente
  personalInfo: {
    name: "João Silva",
    cpf: "123.456.789-00",
    phone: "(11) 99999-9999",
    avatar: "avatar_url"
  },
  professionalInfo: {
    registration: "PROF001",
    hireDate: "2024-01-15"
  },
  schools: [ // Array de escolas que o usuário acessa
    {
      schoolId: "school_1",
      schoolName: "Escola Municipal ABC",
      roleId: "role_professor_school_1",
      roleName: "Professor",
      subjects: ["Matemática", "Física"],
      status: "active", // active, suspended, inactive
      joinedAt: timestamp,
      invitedBy: "director_456"
    },
    {
      schoolId: "school_2",
      schoolName: "Escola Estadual XYZ",
      roleId: "role_coordinator_school_2",
      roleName: "Coordenador",
      subjects: ["Matemática"],
      status: "active",
      joinedAt: timestamp,
      invitedBy: "director_789"
    }
  ],
  currentSchoolId: "school_1", // Escola atualmente selecionada
  metadata: {
    createdAt: timestamp,
    lastLogin: timestamp
  }
}
```

**Características:**

- **Multi-escola:** Um usuário pode ter acesso a múltiplas escolas
- **Email único:** Mesmo email pode ser usado em diferentes escolas
- **Roles por escola:** Cada escola tem seu próprio role/permissões
- **Troca de contexto:** Usuário pode trocar entre escolas durante a sessão
- **Isolamento mantido:** Dados de cada escola permanecem isolados

### **4. ROLES (Roles Padrão + Customizados)**

```javascript
// Coleção: roles/{roleId}
{
  id: "role_professor_school_1",
  schoolId: "school_1",
  name: "Professor",
  type: "default", // default, custom
  description: "Professor responsável por disciplinas específicas",
  permissionIds: [
    "perm_view_my_classes",
    "perm_create_lessons",
    "perm_create_activities",
    "perm_view_my_grades",
    "perm_manage_attendance"
  ],
  metadata: {
    createdAt: timestamp,
    createdBy: "system", // ou director_456 se for custom
    isSystem: true // true para roles padrão
  }
}

// Exemplo de role customizado
{
  id: "role_coord_pedagogico_school_1",
  schoolId: "school_1",
  name: "Coordenador Pedagógico",
  type: "custom",
  description: "Responsável pela coordenação pedagógica",
  permissionIds: [
    "perm_view_all_classes",
    "perm_create_activities",
    "perm_view_all_grades",
    "perm_manage_teachers"
  ],
  metadata: {
    createdAt: timestamp,
    createdBy: "director_456",
    isSystem: false
  }
}
```

**Características:**

- Roles padrão criados automaticamente
- Roles customizados criados pelo Diretor
- Referências às permissões (não duplica dados)

### **5. PERMISSIONS (Permissões Normalizadas)**

```javascript
// Coleção: permissions/{permissionId}
{
  id: "perm_view_classes",
  name: "view_classes",
  module: "classes",
  description: "Visualizar turmas",
  category: "read", // read, write, delete, manage
  isActive: true
}

{
  id: "perm_create_activities",
  name: "create_activities",
  module: "activities",
  description: "Criar atividades",
  category: "write",
  isActive: true
}
```

**Características:**

- Zero duplicação de permissões
- Organizadas por módulo
- Facilita manutenção e auditoria

### **6. USER_PERMISSIONS_CACHE (Cache de Performance)**

```javascript
// Coleção: user_permissions_cache/{userId}
{
  userId: "user_789",
  schoolId: "school_1",
  permissions: [
    "view_my_classes",
    "create_lessons",
    "create_activities"
  ],
  roleId: "role_professor",
  lastUpdated: timestamp,
  expiresAt: timestamp // TTL para invalidação automática
}
```

**Características:**

- Cache inteligente para performance
- TTL para invalidação automática
- Reduz queries complexas

## 🔐 SISTEMA DE PERMISSÕES

### **Módulos de Permissões**

```javascript
const PERMISSION_MODULES = {
  // Gestão de Usuários
  users: {
    view: "view_users",
    create: "create_users",
    edit: "edit_users",
    delete: "delete_users",
  },

  // Gestão de Turmas
  classes: {
    view: "view_classes",
    view_all: "view_all_classes", // Ver todas as turmas
    view_my: "view_my_classes", // Apenas suas turmas
    create: "create_classes",
    edit: "edit_classes",
    delete: "delete_classes",
  },

  // Gestão de Aulas
  lessons: {
    view: "view_lessons",
    create: "create_lessons",
    edit: "edit_lessons",
    delete: "delete_lessons",
  },

  // Atividades
  activities: {
    view: "view_activities",
    create: "create_activities",
    edit: "edit_activities",
    delete: "delete_activities",
  },

  // Notas e Avaliações
  grades: {
    view: "view_grades",
    view_all: "view_all_grades",
    view_my: "view_my_grades", // Apenas suas disciplinas
    create: "create_grades",
    edit: "edit_grades",
  },

  // Presença
  attendance: {
    view: "view_attendance",
    manage: "manage_attendance",
  },

  // Relatórios
  reports: {
    view: "view_reports",
    generate: "generate_reports",
  },

  // Configurações
  settings: {
    view: "view_settings",
    edit: "edit_settings",
  },
};
```

### **Roles Padrão**

```javascript
const DEFAULT_ROLES = {
  director: [
    "view_users",
    "create_users",
    "edit_users",
    "delete_users",
    "view_all_classes",
    "create_classes",
    "edit_classes",
    "delete_classes",
    "view_lessons",
    "create_lessons",
    "edit_lessons",
    "delete_lessons",
    "view_activities",
    "create_activities",
    "edit_activities",
    "delete_activities",
    "view_all_grades",
    "create_grades",
    "edit_grades",
    "view_attendance",
    "manage_attendance",
    "view_reports",
    "generate_reports",
    "view_settings",
    "edit_settings",
  ],

  coordinator: [
    "view_users",
    "create_users",
    "edit_users",
    "view_all_classes",
    "create_classes",
    "edit_classes",
    "view_lessons",
    "create_lessons",
    "edit_lessons",
    "view_activities",
    "create_activities",
    "edit_activities",
    "view_all_grades",
    "create_grades",
    "edit_grades",
    "view_attendance",
    "manage_attendance",
    "view_reports",
    "generate_reports",
  ],

  professor: [
    "view_my_classes",
    "view_lessons",
    "create_lessons",
    "edit_lessons",
    "view_activities",
    "create_activities",
    "edit_activities",
    "view_my_grades",
    "create_grades",
    "edit_grades",
    "view_attendance",
    "manage_attendance",
  ],
};
```

## 🚀 IMPLEMENTAÇÃO

### **1. Hooks Principais**

```javascript
// Hook para gerenciar roles
const useRoleManagement = (schoolId) => {
  const createDefaultRoles = async () => {
    // Criar roles padrão quando escola é criada
  };

  const createCustomRole = async (roleData) => {
    // Criar role customizado pelo Diretor
  };

  const updateRolePermissions = async (roleId, permissionIds) => {
    // Atualizar permissões de um role
  };
};

// Hook para verificar permissões
const usePermissions = (userId) => {
  const checkPermission = async (permission) => {
    // Verificar permissão com cache inteligente
  };

  const getUserPermissions = async () => {
    // Buscar todas as permissões do usuário
  };
};

// Hook para isolamento de dados
const useSchoolIsolation = (schoolId) => {
  const getIsolatedQuery = (collection) => {
    // Retornar query filtrada por schoolId
  };
};

// Hook para login multi-escola
const useMultiSchoolAuth = () => {
  const loginWithEmail = async (email, password) => {
    // 1. Autenticar no Firebase Auth
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);

    // 2. Buscar dados do usuário
    const userDoc = await firebase
      .firestore()
      .collection("users")
      .where("email", "==", email)
      .get();

    if (userDoc.empty) {
      throw new Error("Usuário não encontrado");
    }

    const userData = userDoc.docs[0].data();

    // 3. Verificar se tem múltiplas escolas
    if (userData.schools.length > 1) {
      // Mostrar tela de seleção de escola
      return {
        needsSchoolSelection: true,
        schools: userData.schools.filter(
          (school) => school.status === "active"
        ),
        userData,
      };
    } else {
      // Login direto na única escola
      return {
        needsSchoolSelection: false,
        schoolId: userData.schools[0].schoolId,
        userData,
      };
    }
  };

  const selectSchool = async (userId, schoolId) => {
    // Atualizar escola atual do usuário
    await firebase.firestore().collection("users").doc(userId).update({
      currentSchoolId: schoolId,
      lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
    });

    return schoolId;
  };
};

// Hook para trocar de escola durante a sessão
const useSchoolSwitcher = () => {
  const switchSchool = async (newSchoolId) => {
    const currentUser = firebase.auth().currentUser;

    // 1. Verificar se usuário tem acesso à nova escola
    const userDoc = await firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid)
      .get();

    const userData = userDoc.data();
    const schoolAccess = userData.schools.find(
      (s) => s.schoolId === newSchoolId
    );

    if (!schoolAccess || schoolAccess.status !== "active") {
      throw new Error("Acesso negado a esta escola");
    }

    // 2. Atualizar escola atual
    await firebase.firestore().collection("users").doc(currentUser.uid).update({
      currentSchoolId: newSchoolId,
    });

    // 3. Recarregar dados da nova escola
    window.location.reload(); // Ou usar contexto para atualizar
  };

  return { switchSchool };
};

// Hook para criar usuário (com verificação de email existente)
const useUserCreation = () => {
  const createUser = async (userData, schoolId, roleId) => {
    // 1. Verificar se email já existe
    const existingUserQuery = await firebase
      .firestore()
      .collection("users")
      .where("email", "==", userData.email)
      .get();

    if (!existingUserQuery.empty) {
      // Usuário já existe - adicionar nova escola
      const existingUser = existingUserQuery.docs[0];
      const existingUserData = existingUser.data();

      // Verificar se já tem acesso à escola
      const hasAccess = existingUserData.schools.some(
        (s) => s.schoolId === schoolId
      );
      if (hasAccess) {
        throw new Error("Usuário já tem acesso a esta escola");
      }

      // Adicionar nova escola ao usuário existente
      await firebase
        .firestore()
        .collection("users")
        .doc(existingUser.id)
        .update({
          schools: firebase.firestore.FieldValue.arrayUnion({
            schoolId,
            schoolName: userData.schoolName,
            roleId,
            roleName: userData.roleName,
            subjects: userData.subjects || [],
            status: "active",
            joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
            invitedBy: firebase.auth().currentUser.uid,
          }),
        });

      return {
        success: true,
        message: "Usuário existente adicionado à escola",
        userId: existingUser.id,
      };
    } else {
      // Criar novo usuário
      const newUser = {
        email: userData.email,
        personalInfo: userData.personalInfo,
        professionalInfo: userData.professionalInfo,
        schools: [
          {
            schoolId,
            schoolName: userData.schoolName,
            roleId,
            roleName: userData.roleName,
            subjects: userData.subjects || [],
            status: "active",
            joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
            invitedBy: firebase.auth().currentUser.uid,
          },
        ],
        currentSchoolId: schoolId,
        metadata: {
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        },
      };

      const userRef = await firebase
        .firestore()
        .collection("users")
        .add(newUser);

      return {
        success: true,
        message: "Usuário criado com sucesso",
        userId: userRef.id,
      };
    }
  };

  return { createUser };
};
```

### **2. Middleware de Autenticação**

```javascript
// Middleware para verificar permissões
const requirePermission = (permission) => {
  return async (req, res, next) => {
    const userId = req.user.uid;
    const hasPermission = await checkUserPermission(userId, permission);

    if (!hasPermission) {
      return res.status(403).json({ error: "Permissão negada" });
    }

    next();
  };
};

// Middleware para isolamento de escola
const requireSchoolIsolation = (req, res, next) => {
  const userSchoolId = req.user.schoolId;
  req.schoolId = userSchoolId; // Adicionar schoolId ao request
  next();
};
```

### **3. Índices Necessários (Firestore)**

```javascript
// Índices compostos necessários
[
  { collection: "users", fields: ["schoolId", "roleId"] },
  { collection: "roles", fields: ["schoolId", "type"] },
  { collection: "user_permissions_cache", fields: ["schoolId", "lastUpdated"] },
  { collection: "permissions", fields: ["module", "category"] },
];
```

## 🔄 FLUXOS PRINCIPAIS

### **1. Criação de Escola**

1. CEO cria escola
2. Sistema cria roles padrão automaticamente
3. CEO define Diretor da escola
4. Diretor recebe acesso total

### **2. Criação de Usuário**

1. Diretor cria usuário
2. Sistema verifica se email já existe
3. Se existe: adiciona nova escola ao usuário
4. Se não existe: cria novo usuário
5. Sistema associa permissões do role
6. Cache de permissões é criado

### **3. Login Multi-Escola**

1. Usuário faz login com email/senha
2. Sistema busca dados do usuário
3. Se tem múltiplas escolas: mostra seleção
4. Se tem uma escola: login direto
5. Usuário seleciona escola desejada
6. Sistema atualiza escola atual

### **4. Verificação de Permissão**

1. Verificar cache primeiro
2. Se não estiver em cache, buscar do role
3. Buscar permissões reais
4. Atualizar cache
5. Retornar resultado

### **5. Troca de Escola**

1. Usuário solicita troca de escola
2. Sistema verifica se tem acesso
3. Atualiza escola atual
4. Recarrega dados da nova escola

### **6. Criação de Role Customizado**

1. Diretor define nome e descrição
2. Seleciona permissões desejadas
3. Sistema cria role com referências
4. Cache é invalidado para usuários afetados

## 📊 VANTAGENS DA ARQUITETURA

### **Performance**

- ✅ Cache inteligente reduz queries
- ✅ Índices otimizados para consultas frequentes
- ✅ Estrutura normalizada evita duplicação

### **Segurança**

- ✅ Isolamento total entre escolas
- ✅ Permissões granulares por módulo
- ✅ Auditoria completa de ações

### **Manutenibilidade**

- ✅ Permissões centralizadas e reutilizáveis
- ✅ Roles flexíveis (padrão + customizados)
- ✅ Estrutura escalável

### **Flexibilidade**

- ✅ Diretor pode criar roles customizados
- ✅ Permissões podem ser combinadas livremente
- ✅ Sistema adaptável a diferentes necessidades
- ✅ Usuários podem ter acesso a múltiplas escolas
- ✅ Troca de contexto sem logout

## 🎯 PRÓXIMOS PASSOS

1. **Implementar estrutura de dados**
2. **Criar hooks de gerenciamento**
3. **Implementar middleware de autenticação**
4. **Configurar índices do Firestore**
5. **Testar fluxos principais**
6. **Implementar cache de permissões**

---

---

# 🎯 SISTEMA DE DISCIPLINAS E VALIDAÇÃO PROFESSOR-DISCIPLINA

## 📋 VISÃO GERAL

Sistema robusto de disciplinas com validação de competência professor-disciplina, permitindo disciplinas globais (CEO) e específicas por escola (Coordenador/Diretor).

## 🎯 PRINCÍPIOS FUNDAMENTAIS

### 1. **Hierarquia de Criação de Disciplinas**

- **CEO:** Cria disciplinas globais (disponíveis para todas as escolas)
- **Coordenador/Diretor:** Cria disciplinas específicas da escola
- **Validação:** Não permite disciplinas duplicadas na mesma escola

### 2. **Associação Professor-Disciplina**

- Professor só pode lecionar disciplinas associadas a ele
- Diretor define quais disciplinas o professor leciona
- Validação automática na criação de aulas e atividades

### 3. **Isolamento por Escola**

- Cada escola gerencia suas próprias disciplinas
- Disciplinas globais são compartilhadas
- Professores só veem suas disciplinas

## 🗄️ ESTRUTURA DE DADOS (FIRESTORE)

### **Collections Adicionais**

```javascript
collections/
├── subjects/                    // Disciplinas globais (CEO)
├── school_subjects/            // Disciplinas por escola
└── teacher_subjects/           // Associação professor-disciplina
```

### **1. SUBJECTS (Disciplinas Globais)**

```javascript
// Coleção: subjects/{subjectId}
{
  id: "subj_mathematics",
  name: "Matemática",
  code: "MAT",
  category: "exact_sciences", // exact_sciences, languages, humanities, technology
  description: "Disciplina de Matemática",
  isGlobal: true,
  isActive: true,
  metadata: {
    createdAt: timestamp,
    createdBy: "ceo_123"
  }
}
```

**Características:**

- Criadas pelo CEO
- Disponíveis para todas as escolas
- Padronizadas globalmente
- Códigos únicos

### **2. SCHOOL_SUBJECTS (Disciplinas por Escola)**

```javascript
// Coleção: school_subjects/{subjectId}
{
  id: "subj_robotics_school_1",
  schoolId: "school_1",
  name: "Robótica Educacional",
  code: "ROB",
  category: "technology",
  description: "Disciplina de Robótica para Educação",
  isGlobal: false,
  isActive: true,
  metadata: {
    createdAt: timestamp,
    createdBy: "coordinator_456"
  }
}
```

**Características:**

- Criadas por Coordenador/Diretor
- Específicas da escola
- Validação de duplicação por nome
- Integração com disciplinas globais

### **3. TEACHER_SUBJECTS (Associação Professor-Disciplina)**

```javascript
// Coleção: teacher_subjects/{userId}_{schoolId}
{
  id: "user_789_school_1",
  userId: "user_789",
  schoolId: "school_1",
  subjects: [
    {
      subjectId: "subj_mathematics",
      subjectName: "Matemática",
      competency: "expert", // expert, intermediate, beginner
      verified: true,
      verifiedBy: "director_456",
      verifiedAt: timestamp
    },
    {
      subjectId: "subj_robotics_school_1",
      subjectName: "Robótica Educacional",
      competency: "intermediate",
      verified: true,
      verifiedBy: "director_456",
      verifiedAt: timestamp
    }
  ],
  metadata: {
    createdAt: timestamp,
    updatedAt: timestamp,
    updatedBy: "director_456"
  }
}
```

**Características:**

- Associação única por usuário-escola
- Múltiplas disciplinas por professor
- Níveis de competência
- Auditoria de verificação

## 🔐 PERMISSÕES PARA DISCIPLINAS

### **Módulo de Permissões Adicionado**

```javascript
const SUBJECT_PERMISSIONS = {
  // Gestão de Disciplinas
  subjects: {
    view: "view_subjects",
    view_my: "view_my_subjects", // Apenas disciplinas que leciona
    create: "create_subjects",
    edit: "edit_subjects",
    delete: "delete_subjects",
    assign: "assign_subjects", // Associar disciplinas a professores
  },
};
```

### **Roles Atualizados**

```javascript
const DEFAULT_ROLES = {
  director: [
    // ... permissões existentes
    "view_subjects",
    "create_subjects",
    "edit_subjects",
    "delete_subjects",
    "assign_subjects",
  ],

  coordinator: [
    // ... permissões existentes
    "view_subjects",
    "create_subjects",
    "edit_subjects",
    "assign_subjects",
  ],

  professor: [
    // ... permissões existentes
    "view_my_subjects", // Apenas suas disciplinas
  ],
};
```

## 🚀 IMPLEMENTAÇÃO

### **1. Hooks de Gerenciamento**

```javascript
// Hook para gerenciar disciplinas
const useSubjectManagement = (schoolId) => {
  const createSubject = async (subjectData) => {
    // 1. Verificar se disciplina já existe na escola
    const existingSubject = await firebase
      .firestore()
      .collection("school_subjects")
      .where("schoolId", "==", schoolId)
      .where("name", "==", subjectData.name)
      .get();

    if (!existingSubject.empty) {
      throw new Error("Disciplina já existe nesta escola");
    }

    // 2. Criar disciplina
    const newSubject = {
      schoolId,
      name: subjectData.name,
      code: subjectData.code,
      category: subjectData.category,
      description: subjectData.description,
      isGlobal: false,
      isActive: true,
      metadata: {
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: firebase.auth().currentUser.uid,
      },
    };

    return firebase.firestore().collection("school_subjects").add(newSubject);
  };

  const getSchoolSubjects = async () => {
    // Buscar disciplinas globais + da escola
    const [globalSubjects, schoolSubjects] = await Promise.all([
      firebase
        .firestore()
        .collection("subjects")
        .where("isActive", "==", true)
        .get(),
      firebase
        .firestore()
        .collection("school_subjects")
        .where("schoolId", "==", schoolId)
        .where("isActive", "==", true)
        .get(),
    ]);

    const allSubjects = [
      ...globalSubjects.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        isGlobal: true,
      })),
      ...schoolSubjects.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        isGlobal: false,
      })),
    ];

    return allSubjects;
  };

  return { createSubject, getSchoolSubjects };
};

// Hook para associar disciplinas a professores
const useTeacherSubjectAssignment = (schoolId) => {
  const assignSubjectsToTeacher = async (userId, subjectIds) => {
    // 1. Buscar disciplinas selecionadas
    const subjectsSnapshot = await firebase
      .firestore()
      .collection("school_subjects")
      .where("schoolId", "==", schoolId)
      .where("id", "in", subjectIds)
      .get();

    const subjects = subjectsSnapshot.docs.map((doc) => ({
      subjectId: doc.id,
      subjectName: doc.data().name,
      competency: "intermediate", // Padrão
      verified: true,
      verifiedBy: firebase.auth().currentUser.uid,
      verifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
    }));

    // 2. Criar/atualizar associação professor-disciplina
    const teacherSubjectRef = firebase
      .firestore()
      .collection("teacher_subjects")
      .doc(`${userId}_${schoolId}`);

    await teacherSubjectRef.set({
      userId,
      schoolId,
      subjects,
      metadata: {
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedBy: firebase.auth().currentUser.uid,
      },
    });
  };

  const getTeacherSubjects = async (userId) => {
    const teacherSubjectDoc = await firebase
      .firestore()
      .collection("teacher_subjects")
      .doc(`${userId}_${schoolId}`)
      .get();

    return teacherSubjectDoc.exists ? teacherSubjectDoc.data().subjects : [];
  };

  return { assignSubjectsToTeacher, getTeacherSubjects };
};
```

### **2. Componentes de Interface**

```javascript
// Componente para cadastrar disciplina
const CreateSubjectForm = ({ schoolId }) => {
  const { createSubject } = useSubjectManagement(schoolId);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSubject(formData);
      toast.success("Disciplina criada com sucesso!");
      // Reset form ou fechar modal
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>Nome da Disciplina</Label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label>Código</Label>
        <Input
          type="text"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label>Categoria</Label>
        <Input
          type="select"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        >
          <option value="">Selecione...</option>
          <option value="exact_sciences">Ciências Exatas</option>
          <option value="languages">Linguagens</option>
          <option value="humanities">Ciências Humanas</option>
          <option value="technology">Tecnologia</option>
        </Input>
      </FormGroup>
      <Button type="submit" color="primary">
        Criar Disciplina
      </Button>
    </Form>
  );
};

// Componente para associar disciplinas a professor
const TeacherSubjectAssignment = ({ userId, schoolId }) => {
  const { assignSubjectsToTeacher } = useTeacherSubjectAssignment(schoolId);
  const { getSchoolSubjects } = useSubjectManagement(schoolId);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  useEffect(() => {
    const loadSubjects = async () => {
      const subjects = await getSchoolSubjects();
      setAvailableSubjects(subjects);
    };
    loadSubjects();
  }, []);

  const handleSubmit = async () => {
    try {
      await assignSubjectsToTeacher(userId, selectedSubjects);
      toast.success("Disciplinas associadas com sucesso!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h5>Associar Disciplinas ao Professor</h5>
      {availableSubjects.map((subject) => (
        <FormGroup check key={subject.id}>
          <Input
            type="checkbox"
            id={subject.id}
            checked={selectedSubjects.includes(subject.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedSubjects([...selectedSubjects, subject.id]);
              } else {
                setSelectedSubjects(
                  selectedSubjects.filter((id) => id !== subject.id)
                );
              }
            }}
          />
          <Label check for={subject.id}>
            {subject.name} ({subject.code})
            {subject.isGlobal && (
              <Badge color="info" className="ms-2">
                Global
              </Badge>
            )}
          </Label>
        </FormGroup>
      ))}
      <Button onClick={handleSubmit} color="primary" className="mt-3">
        Associar Disciplinas
      </Button>
    </div>
  );
};
```

## 🔄 FLUXOS PRINCIPAIS

### **1. Criação de Disciplina Global (CEO)**

1. CEO acessa painel de disciplinas globais
2. Preenche dados da disciplina
3. Sistema valida unicidade global
4. Disciplina fica disponível para todas as escolas

### **2. Criação de Disciplina da Escola**

1. Coordenador/Diretor acessa disciplinas da escola
2. Preenche dados da disciplina
3. Sistema valida unicidade na escola
4. Disciplina fica disponível apenas para a escola

### **3. Cadastro de Professor com Disciplinas**

1. Diretor cadastra professor
2. Sistema mostra disciplinas disponíveis (globais + escola)
3. Diretor seleciona disciplinas que o professor leciona
4. Sistema cria associação professor-disciplina

### **4. Criação de Aula**

1. Professor acessa criação de aula
2. Sistema mostra apenas suas disciplinas
3. Professor seleciona disciplina
4. Sistema valida permissão automaticamente

### **5. Criação de Atividade**

1. Professor acessa criação de atividade
2. Sistema mostra apenas suas disciplinas
3. Professor seleciona disciplina
4. Sistema valida permissão automaticamente

## 📊 VANTAGENS DO SISTEMA

### **Controle e Validação**

- ✅ Disciplinas padronizadas e validadas
- ✅ Professor só leciona disciplinas autorizadas
- ✅ Validação automática em aulas e atividades
- ✅ Auditoria completa de associações

### **Flexibilidade**

- ✅ Disciplinas globais + específicas por escola
- ✅ Múltiplas disciplinas por professor
- ✅ Níveis de competência
- ✅ CRUD completo de disciplinas

### **Isolamento e Segurança**

- ✅ Cada escola gerencia suas disciplinas
- ✅ Professores só veem suas disciplinas
- ✅ Permissões granulares por role
- ✅ Validação de duplicação

### **Escalabilidade**

- ✅ Sistema suporta múltiplas escolas
- ✅ Disciplinas globais compartilhadas
- ✅ Estrutura normalizada
- ✅ Performance otimizada

## 🎯 PRÓXIMOS PASSOS

1. **Implementar estrutura de dados**
2. **Criar hooks de gerenciamento**
3. **Implementar componentes de interface**
4. **Integrar com sistema de aulas e atividades**
5. **Configurar índices do Firestore**
6. **Testar fluxos principais**

---

# 🎯 SISTEMA DE TURMAS E RELACIONAMENTOS

## 📋 VISÃO GERAL

Sistema otimizado de turmas com relacionamentos claros, validação de integridade e performance otimizada para banco NoSQL, integrado com sistema de anos letivos.

## 🎯 PRINCÍPIOS FUNDAMENTAIS

### 1. **Estrutura Simplificada**

- Alunos apenas na coleção `users` com referência à turma
- Collection `class_enrollments` para relacionamentos
- Sem duplicação de dados
- Contadores para performance

### 2. **Validação de Integridade**

- Aluno só pode estar em uma turma por ano letivo
- Validação automática na matrícula
- Consistência garantida por transações

### 3. **Ano Letivo como Base**

- Tudo vinculado ao ano letivo
- Turmas específicas por ano
- Histórico preparado para futuro

## 🗄️ ESTRUTURA DE DADOS (FIRESTORE)

### **Collections Adicionais**

```javascript
collections/
├── academic_years/              // Anos letivos
├── classes/                     // Turmas
├── class_enrollments/          // Matrículas (relacionamentos)
└── class_teachers/             // Professores da turma
```

### **1. ACADEMIC_YEARS (Anos Letivos)**

```javascript
// Coleção: academic_years/{yearId}
{
  id: "year_2024",
  schoolId: "school_1",
  year: 2024,
  name: "Ano Letivo 2024",
  startDate: "2024-01-15",
  endDate: "2024-12-15",
  status: "active", // active, closed, planning
  metadata: {
    createdAt: timestamp,
    createdBy: "director_456"
  }
}
```

**Características:**

- Base para todas as operações acadêmicas
- Controle de períodos letivos
- Status para controle de ciclo

### **2. CLASSES (Turmas)**

```javascript
// Coleção: classes/{classId}
{
  id: "class_1",
  schoolId: "school_1",
  academicYearId: "year_2024",
  name: "1º Ano A - Manhã",
  period: "morning", // morning, afternoon, night
  educationLevel: "elementary",
  series: "1",
  identifier: "A",
  capacity: null, // Sem limite conforme solicitado
  currentStudents: 25, // Contador para performance
  status: "active",
  metadata: {
    createdAt: timestamp,
    createdBy: "director_456"
  }
}
```

**Características:**

- Vinculadas ao ano letivo
- Contador de alunos para performance
- Sem limite de capacidade
- Status para controle

### **3. USERS (Alunos - Atualizada)**

```javascript
// Coleção: users/{userId} (estrutura atualizada)
{
  id: "student_123",
  schoolId: "school_1",
  email: "aluno@escola.com",
  role: "student",
  personalInfo: {
    name: "João Silva",
    cpf: "123.456.789-00",
    birthDate: "2010-05-15"
  },
  academicInfo: {
    registration: "2024001",
    currentClassId: "class_1", // Turma atual
    currentClassName: "1º Ano A - Manhã",
    academicYearId: "year_2024", // Ano letivo atual
    enrollmentDate: "2024-01-15",
    status: "active" // active, transferred, graduated, dropped
  },
  metadata: {
    createdAt: timestamp,
    createdBy: "director_456"
  }
}
```

**Características:**

- Referência única à turma atual
- Vinculado ao ano letivo
- Status acadêmico controlado
- Sem duplicação de dados

### **4. CLASS_ENROLLMENTS (Matrículas)**

```javascript
// Coleção: class_enrollments/{enrollmentId}
{
  id: "enrollment_123",
  userId: "student_123",
  schoolId: "school_1",
  classId: "class_1",
  academicYearId: "year_2024",
  status: "active", // active, transferred, graduated, dropped
  enrollmentDate: "2024-01-15",
  transferDate: null,
  metadata: {
    createdAt: timestamp,
    createdBy: "director_456",
    updatedAt: timestamp,
    updatedBy: "director_456"
  }
}
```

**Características:**

- Relacionamento aluno-turma-ano
- Controle de status da matrícula
- Auditoria completa
- Validação de unicidade

### **5. CLASS_TEACHERS (Professores da Turma)**

```javascript
// Coleção: class_teachers/{classTeacherId}
{
  id: "class_teacher_123",
  classId: "class_1",
  schoolId: "school_1",
  academicYearId: "year_2024",
  teachers: [
    {
      userId: "teacher_456",
      userName: "Maria Santos",
      subjects: [
        {
          subjectId: "subj_mathematics",
          subjectName: "Matemática"
        }
      ],
      assignedAt: timestamp,
      assignedBy: "director_456"
    }
  ],
  metadata: {
    createdAt: timestamp,
    createdBy: "director_456"
  }
}
```

**Características:**

- Professores associados à turma
- Disciplinas por professor
- Controle por ano letivo
- Auditoria de atribuições

## 🔐 PERMISSÕES PARA TURMAS

### **Módulo de Permissões Adicionado**

```javascript
const CLASS_PERMISSIONS = {
  classes: {
    view: "view_classes",
    view_my: "view_my_classes", // Apenas turmas que leciona
    create: "create_classes",
    edit: "edit_classes",
    delete: "delete_classes",
    manage_students: "manage_class_students", // Adicionar/remover alunos
    view_students: "view_class_students",
  },

  academic_years: {
    view: "view_academic_years",
    create: "create_academic_years",
    edit: "edit_academic_years",
    close: "close_academic_years",
  },
};
```

### **Roles Atualizados**

```javascript
const DEFAULT_ROLES = {
  director: [
    // ... permissões existentes
    "view_classes",
    "create_classes",
    "edit_classes",
    "delete_classes",
    "manage_class_students",
    "view_class_students",
    "view_academic_years",
    "create_academic_years",
    "edit_academic_years",
    "close_academic_years",
  ],

  coordinator: [
    // ... permissões existentes
    "view_classes",
    "create_classes",
    "edit_classes",
    "view_class_students",
    "view_academic_years",
    "create_academic_years",
    "edit_academic_years",
  ],

  professor: [
    // ... permissões existentes
    "view_my_classes",
    "view_class_students", // Apenas suas turmas
  ],
};
```

## 🚀 IMPLEMENTAÇÃO

### **1. Hooks de Gerenciamento**

```javascript
// Hook para gerenciar turmas
const useClassManagement = (schoolId, academicYearId) => {
  const createClass = async (classData) => {
    // 1. Verificar se turma já existe no ano letivo
    const existingClass = await firebase
      .firestore()
      .collection("classes")
      .where("schoolId", "==", schoolId)
      .where("academicYearId", "==", academicYearId)
      .where("name", "==", classData.name)
      .get();

    if (!existingClass.empty) {
      throw new Error("Turma já existe neste ano letivo");
    }

    // 2. Criar turma
    const newClass = {
      schoolId,
      academicYearId,
      name: classData.name,
      period: classData.period,
      educationLevel: classData.educationLevel,
      series: classData.series,
      identifier: classData.identifier,
      currentStudents: 0,
      status: "active",
      metadata: {
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: firebase.auth().currentUser.uid,
      },
    };

    return firebase.firestore().collection("classes").add(newClass);
  };

  const getClassesByYear = async () => {
    const classesSnapshot = await firebase
      .firestore()
      .collection("classes")
      .where("schoolId", "==", schoolId)
      .where("academicYearId", "==", academicYearId)
      .where("status", "==", "active")
      .get();

    return classesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  return { createClass, getClassesByYear };
};

// Hook para gerenciar matrículas
const useEnrollmentManagement = (schoolId, academicYearId) => {
  const enrollStudent = async (userId, classId) => {
    // 1. Verificar se aluno já está matriculado em outra turma
    const existingEnrollment = await firebase
      .firestore()
      .collection("class_enrollments")
      .where("userId", "==", userId)
      .where("schoolId", "==", schoolId)
      .where("academicYearId", "==", academicYearId)
      .where("status", "==", "active")
      .get();

    if (!existingEnrollment.empty) {
      throw new Error("Aluno já está matriculado em outra turma");
    }

    // 2. Buscar dados do aluno
    const studentDoc = await firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .get();

    if (!studentDoc.exists) {
      throw new Error("Aluno não encontrado");
    }

    const studentData = studentDoc.data();

    // 3. Buscar dados da turma
    const classDoc = await firebase
      .firestore()
      .collection("classes")
      .doc(classId)
      .get();

    if (!classDoc.exists) {
      throw new Error("Turma não encontrada");
    }

    const classData = classDoc.data();

    // 4. Criar matrícula
    const enrollment = {
      userId,
      schoolId,
      classId,
      academicYearId,
      status: "active",
      enrollmentDate: firebase.firestore.FieldValue.serverTimestamp(),
      metadata: {
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: firebase.auth().currentUser.uid,
      },
    };

    // 5. Atualizar aluno e turma em batch
    const batch = firebase.firestore().batch();

    // Criar matrícula
    const enrollmentRef = firebase
      .firestore()
      .collection("class_enrollments")
      .doc();
    batch.set(enrollmentRef, enrollment);

    // Atualizar aluno
    const studentRef = firebase.firestore().collection("users").doc(userId);
    batch.update(studentRef, {
      "academicInfo.currentClassId": classId,
      "academicInfo.currentClassName": classData.name,
      "academicInfo.academicYearId": academicYearId,
      "academicInfo.enrollmentDate":
        firebase.firestore.FieldValue.serverTimestamp(),
    });

    // Atualizar contador da turma
    const classRef = firebase.firestore().collection("classes").doc(classId);
    batch.update(classRef, {
      currentStudents: firebase.firestore.FieldValue.increment(1),
    });

    await batch.commit();
    return enrollmentRef.id;
  };

  const getClassStudents = async (classId) => {
    const enrollmentsSnapshot = await firebase
      .firestore()
      .collection("class_enrollments")
      .where("classId", "==", classId)
      .where("status", "==", "active")
      .get();

    const studentIds = enrollmentsSnapshot.docs.map((doc) => doc.data().userId);

    if (studentIds.length === 0) return [];

    const studentsSnapshot = await firebase
      .firestore()
      .collection("users")
      .where("id", "in", studentIds)
      .get();

    return studentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  return { enrollStudent, getClassStudents };
};

// Hook para gerenciar anos letivos
const useAcademicYearManagement = (schoolId) => {
  const createAcademicYear = async (yearData) => {
    // Verificar se ano já existe
    const existingYear = await firebase
      .firestore()
      .collection("academic_years")
      .where("schoolId", "==", schoolId)
      .where("year", "==", yearData.year)
      .get();

    if (!existingYear.empty) {
      throw new Error("Ano letivo já existe");
    }

    const newYear = {
      schoolId,
      year: yearData.year,
      name: yearData.name,
      startDate: yearData.startDate,
      endDate: yearData.endDate,
      status: "planning",
      metadata: {
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: firebase.auth().currentUser.uid,
      },
    };

    return firebase.firestore().collection("academic_years").add(newYear);
  };

  const getActiveAcademicYear = async () => {
    const yearSnapshot = await firebase
      .firestore()
      .collection("academic_years")
      .where("schoolId", "==", schoolId)
      .where("status", "==", "active")
      .get();

    return yearSnapshot.docs[0]?.data() || null;
  };

  return { createAcademicYear, getActiveAcademicYear };
};
```

## 🔄 FLUXOS PRINCIPAIS

### **1. Criação de Ano Letivo**

1. Diretor acessa gestão de anos letivos
2. Preenche dados do ano letivo
3. Sistema valida unicidade do ano
4. Ano letivo fica em status "planning"

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

### **4. Transferência de Aluno**

1. Diretor solicita transferência
2. Sistema finaliza matrícula atual
3. Sistema cria nova matrícula
4. Contadores são atualizados automaticamente

### **5. Fechamento de Ano Letivo**

1. Diretor fecha ano letivo
2. Sistema atualiza status para "closed"
3. Turmas ficam inativas
4. Preparação para novo ano

## 📊 VANTAGENS DO SISTEMA

### **Performance e Escalabilidade**

- ✅ Sem duplicação de dados
- ✅ Contadores para queries rápidas
- ✅ Estrutura otimizada para NoSQL
- ✅ Transações para consistência

### **Integridade e Validação**

- ✅ Aluno só pode estar em uma turma
- ✅ Validação automática na matrícula
- ✅ Consistência garantida por batch
- ✅ Auditoria completa

### **Flexibilidade e Controle**

- ✅ Anos letivos como base
- ✅ Histórico preparado para futuro
- ✅ Sem limite de capacidade
- ✅ Status controlados

### **Manutenibilidade**

- ✅ Relacionamentos claros
- ✅ Estrutura normalizada
- ✅ Hooks reutilizáveis
- ✅ Permissões granulares

## 🎯 PRÓXIMOS PASSOS

1. **Implementar estrutura de dados**
2. **Criar hooks de gerenciamento**
3. **Implementar componentes de interface**
4. **Integrar com sistema de aulas e atividades**
5. **Configurar índices do Firestore**
6. **Testar fluxos principais**

---

## 🎯 **SISTEMA DE AULAS E ATIVIDADES**

### 📋 **ESTRUTURA DE DADOS:**

```javascript
// Coleção: academic_units (Unidades Acadêmicas)
{
  id: "unit_1",
  schoolId: "school_1",
  academicYearId: "year_2024",
  name: "1ª Unidade",
  description: "Primeira unidade do ano letivo",
  order: 1, // Ordem da unidade (1, 2, 3, 4...)
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
  dayOfWeek: "monday", // monday, tuesday, wednesday, thursday, friday
  room: "Sala 101",
  status: "active", // active, cancelled, completed
  metadata: {
    createdAt: timestamp,
    createdBy: "teacher_456",
    updatedAt: timestamp
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
  unitId: "unit_1", // Relacionamento com unidade
  unitName: "1ª Unidade", // Cache para performance
  lessonId: "lesson_1", // Opcional - pode ser atividade independente
  name: "Exercícios de Adição",
  description: "Lista de exercícios para prática",
  startDate: "2024-01-20",
  endDate: "2024-01-25",
  score: 10, // Pontuação máxima
  type: "homework", // homework, exam, project, quiz
  isGraded: true, // Se vale nota
  status: "active", // active, completed, cancelled
  metadata: {
    createdAt: timestamp,
    createdBy: "teacher_456"
  }
}

// Coleção: activity_submissions (Submissões de Atividades)
{
  id: "submission_1",
  activityId: "activity_1",
  studentId: "student_123",
  schoolId: "school_1",
  academicYearId: "year_2024",
  classId: "class_1",
  subjectId: "subj_mathematics",
  teacherId: "teacher_456",
  unitId: "unit_1", // Relacionamento com unidade
  unitName: "1ª Unidade", // Cache para performance
  submittedAt: timestamp,
  score: 8.5, // Nota obtida
  feedback: "Muito bom trabalho!",
  status: "submitted", // submitted, graded, late
  metadata: {
    createdAt: timestamp,
    gradedAt: timestamp,
    gradedBy: "teacher_456"
  }
}

// Coleção: lesson_schedule (Cronograma de Aulas - Cache)
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

### 🔐 **PERMISSÕES:**

```javascript
const LESSON_ACTIVITY_PERMISSIONS = {
  lessons: {
    view: "view_lessons",
    create: "create_lessons",
    edit: "edit_lessons",
    delete: "delete_lessons",
    schedule: "schedule_lessons",
  },
  activities: {
    view: "view_activities",
    create: "create_activities",
    edit: "edit_activities",
    delete: "delete_activities",
    grade: "grade_activities",
  },
  academic_units: {
    view: "view_academic_units",
    create: "create_academic_units",
    edit: "edit_academic_units",
    delete: "delete_academic_units",
    close: "close_academic_units",
  },
};

// Roles atualizados
const DEFAULT_ROLES = {
  director: [
    // ... permissões existentes
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
  ],

  coordinator: [
    // ... permissões existentes
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
  ],

  professor: [
    // ... permissões existentes
    "view_lessons",
    "create_lessons",
    "edit_lessons",
    "view_activities",
    "create_activities",
    "edit_activities",
    "grade_activities",
    "view_academic_units", // Apenas visualizar unidades
  ],
};
```

### 🏗️ **HOOKS DE IMPLEMENTAÇÃO:**

- **useAcademicUnitManagement**: Criar, listar e gerenciar unidades acadêmicas
- **useLessonManagement**: Criar aulas, validar conflitos de horário e listar por turma
- **useActivityManagement**: Criar atividades, validar professor-disciplina e listar por unidade
- **useSubmissionManagement**: Submeter atividades, validar matrícula e gerenciar correções

### 🔄 **FLUXOS PRINCIPAIS:**

#### **1. Criação de Unidade Acadêmica**

1. Coordenador/Diretor acessa gestão de unidades
2. Preenche dados da unidade (nome, ordem, datas)
3. Sistema valida unicidade da ordem
4. Unidade é criada com status "planning"

#### **2. Criação de Aula**

1. Professor seleciona turma e disciplina
2. Sistema valida competência do professor
3. Professor define horário e sala
4. Sistema verifica conflitos de horário
5. Aula é criada e cache de cronograma atualizado

#### **3. Criação de Atividade**

1. Professor seleciona turma, disciplina e unidade
2. Sistema valida competência do professor
3. Professor define detalhes da atividade
4. Atividade é criada vinculada à unidade

#### **4. Submissão de Atividade**

1. Aluno acessa atividade
2. Sistema verifica matrícula na turma
3. Aluno submete resposta
4. Sistema registra submissão

#### **5. Correção de Atividade**

1. Professor acessa submissões
2. Professor atribui nota e feedback
3. Sistema atualiza status para "graded"

### 📊 **VANTAGENS DO SISTEMA:**

#### **Performance e Escalabilidade**

- ✅ Collections separadas para queries otimizadas
- ✅ Cache de cronograma para consultas rápidas
- ✅ Cache de nomes para evitar joins
- ✅ Estrutura preparada para índices

#### **Integridade e Validação**

- ✅ Validação professor-disciplina
- ✅ Verificação de conflitos de horário
- ✅ Validação de matrícula para submissões
- ✅ Controle de unidades acadêmicas

#### **Flexibilidade e Organização**

- ✅ Unidades acadêmicas personalizáveis
- ✅ Atividades independentes ou vinculadas a aulas
- ✅ Sistema de tipos de atividade
- ✅ Controle de pontuação e feedback

#### **Manutenibilidade**

- ✅ Hooks especializados por funcionalidade
- ✅ Validações centralizadas
- ✅ Estrutura normalizada
- ✅ Auditoria completa

---

## 🎯 **SISTEMA DE COMUNICAÇÃO E NOTIFICAÇÕES**

### 📋 **ESTRUTURA DE DADOS:**

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
  schedule: null, // Para envios agendados
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
  referenceId: "message_1", // ID da mensagem/notificação original
  recipients: ["teacher_456"], // Array de UIDs
  readBy: {
    "teacher_456": false,
    "student_123": true
  },
  schedule: null, // Para envios agendados
  sent: null, // Timestamp quando foi enviado
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
  isGlobal: false, // Se pode ser usado por outros professores
  usageCount: 15, // Quantas vezes foi usado
  status: "active", // active, inactive
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

### 🔐 **PERMISSÕES:**

```javascript
const COMMUNICATION_PERMISSIONS = {
  doubts: {
    view: "view_doubts",
    create: "create_doubts",
    respond: "respond_doubts",
    resolve: "resolve_doubts",
    delete: "delete_doubts",
  },
  notifications: {
    view: "view_notifications",
    create: "create_notifications",
    edit: "edit_notifications",
    delete: "delete_notifications",
    schedule: "schedule_notifications",
  },
  templates: {
    view: "view_templates",
    create: "create_templates",
    edit: "edit_templates",
    delete: "delete_templates",
    use: "use_templates",
  },
  alerts: {
    view: "view_alerts",
    create: "create_alerts",
    mark_read: "mark_alerts_read",
  },
};

// Roles atualizados
const DEFAULT_ROLES = {
  director: [
    // ... permissões existentes
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
    // ... permissões existentes
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
    // ... permissões existentes
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
    // ... permissões existentes
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

### 🏗️ **HOOKS DE IMPLEMENTAÇÃO:**

- **useDoubtManagement**: Gerenciar criação, listagem e resolução de dúvidas
- **useDoubtMessages**: Enviar mensagens, listar conversas e marcar como lida
- **useNotificationManagement**: Criar notificações e determinar destinatários
- **useTemplateManagement**: Criar, listar e usar templates de mensagens
- **useAlertManagement**: Gerenciar alertas não lidos e marcar como lidos

### 🔄 **FLUXOS PRINCIPAIS:**

#### **1. Criação de Dúvida**

1. Aluno acessa sistema de dúvidas
2. Seleciona disciplina e turma
3. Digite sua dúvida
4. Sistema encontra professor da disciplina
5. Dúvida é criada e professor é notificado

#### **2. Troca de Mensagens**

1. Usuário acessa dúvida específica
2. Digite mensagem no chat
3. Sistema envia mensagem e cria alerta
4. Destinatário recebe notificação push
5. Mensagem aparece no chat em tempo real

#### **3. Criação de Notificação**

1. Usuário acessa criação de notificação
2. Seleciona tipo (individual, turma, escola)
3. Preenche título e mensagem
4. Sistema determina destinatários
5. Notificação é criada e alertas são enviados

#### **4. Uso de Template**

1. Usuário acessa criação de mensagem
2. Seleciona categoria de template
3. Escolhe template desejado
4. Personaliza variáveis (nome, data, etc.)
5. Template é processado e usado

#### **5. Resolução de Dúvida**

1. Professor marca dúvida como resolvida
2. Sistema atualiza status da dúvida
3. Aluno é notificado da resolução
4. Chat fica arquivado para consulta

### 📊 **VANTAGENS DO SISTEMA:**

#### **Performance e Escalabilidade**

- ✅ Collections separadas para queries otimizadas
- ✅ Sistema de alertas eficiente
- ✅ Templates para acelerar comunicação
- ✅ Log de comunicações para auditoria

#### **Integridade e Validação**

- ✅ Validação de matrícula para dúvidas
- ✅ Verificação de professor-disciplina
- ✅ Sistema de leitura de mensagens
- ✅ Controle de status de dúvidas

#### **Flexibilidade e Organização**

- ✅ Templates personalizáveis por escola
- ✅ Categorização de templates
- ✅ Sistema de variáveis dinâmicas
- ✅ Múltiplos tipos de notificação

#### **Manutenibilidade**

- ✅ Hooks especializados por funcionalidade
- ✅ Sistema de logs centralizado
- ✅ Estrutura normalizada
- ✅ Auditoria completa

---

**Status:** ✅ SISTEMA DE COMUNICAÇÃO E NOTIFICAÇÕES DEFINIDO E DOCUMENTADO
**Próximo Problema:** Sistema de Relatórios e Analytics
