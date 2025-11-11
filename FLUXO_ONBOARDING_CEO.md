# 🚀 Fluxo de Onboarding do CEO - Primeira Execução

## 📋 **Situação Atual do Sistema**

### **Estado Após Seed:**

1. ✅ **Permissões**: Todas criadas na collection `permissions`
2. ✅ **CEO Criado**:
   - Firebase Auth: usuário autenticável
   - Firestore `users`: documento com `role: "ceo"`, `schools: []`
   - Firestore `accounts`: conta master criada
3. ⚠️ **Roles**: Não criadas ainda (precisa de `schoolId`)
4. ⚠️ **Escola**: Não existe ainda

---

## 🔴 **PROBLEMA IDENTIFICADO**

### **1. CEO não consegue criar primeira escola**

**Rota `/schools/create` está protegida apenas para `master`:**

```javascript
{
  path: "/schools/create",
  component: (
    <RoleProtectedRoute allowedRoles={["master"]}>  // ❌ CEO não tem acesso!
      <CreateSchool />
    </RoleProtectedRoute>
  ),
}
```

**O `RoleProtectedRoute` verifica `currentSchool?.role`:**

- CEO acabou de ser criado → `schools: []` (vazio)
- `currentSchool` = `null` → `currentRole` = `undefined`
- Mesmo que a rota permitisse `ceo`, não funcionaria porque `currentRole` é `undefined`

### **2. CEO não tem escola associada**

- Após criar CEO: `user.schools = []`
- `currentSchoolId = null`
- `currentSchool = null`
- Sistema precisa de `currentSchool?.role` para funcionar

---

## ✅ **SOLUÇÃO PROPOSTA**

### **Fluxo Corrigido de Onboarding:**

#### **ETAPA 1: Seed Inicial** (Já feito)

1. Executar seed: cria permissões + CEO
2. CEO criado com `schools: []`

#### **ETAPA 2: CEO Cria Primeira Escola** (PRECISA AJUSTE)

**Opção A: Permitir CEO criar escola mesmo sem `currentSchool`**

Ajustar `RoleProtectedRoute` para permitir CEO sem escola:

```javascript
// Permitir CEO sem escola acessar criação de escola
if (allowedRoles.includes("ceo") && !currentRole && user?.role === "ceo") {
  // Permitir acesso
}
```

**Opção B: Adicionar rota especial para CEO sem escola**

Criar rota `/onboarding/create-school` acessível apenas para CEO sem escola.

#### **ETAPA 3: Após Criar Escola - Associar CEO Automaticamente**

Quando CEO cria a primeira escola:

1. Criar escola no Firestore
2. **Associar CEO à escola criada:**
   - Adicionar escola no array `schools[]` do CEO
   - Definir `currentSchoolId`
   - Adicionar role `ceo` para essa escola
3. Criar roles padrão para a escola
4. Carregar permissões do CEO baseadas no role

#### **ETAPA 4: Sistema Funciona Normalmente**

Depois disso:

- CEO tem `currentSchool` definido
- `currentSchool?.role = "ceo"`
- Sistema funciona normalmente
- CEO pode criar outras escolas
- CEO pode gerenciar usuários, roles, etc.

---

## 🔧 **IMPLEMENTAÇÃO NECESSÁRIA**

### **1. Ajustar `CreateSchool.jsx` para associar CEO automaticamente:**

```javascript
// Após criar escola (linha ~177)
const schoolId = result.id;

// ASSOCIAR CEO À ESCOLA CRIADA
const currentUser = firebase.auth().currentUser;
if (currentUser) {
  await usersRepository.addSchoolToUser(currentUser.uid, {
    schoolId: schoolId,
    role: "ceo",
    status: "active",
  });

  // Atualizar currentSchoolId
  await usersRepository.updateCurrentSchool(currentUser.uid, schoolId);

  // Criar roles padrão para a escola
  await rolesService.initializeDefaultRoles(schoolId, currentUser.uid);
}
```

### **2. Ajustar `RoleProtectedRoute` para CEO sem escola:**

```javascript
const currentRole = currentSchool?.role;
const userRole = user?.role; // Fallback para role do documento

// Se é CEO sem escola, permitir criar escola
if (
  allowedRoles.includes("ceo") &&
  !currentRole &&
  userRole === "ceo" &&
  location.pathname === "/schools/create"
) {
  return children; // Permitir acesso
}

// Verificação normal...
```

### **3. Ajustar `CreateSchool.jsx` para criar roles após criar escola:**

Verificar se roles já existem, se não, criar roles padrão automaticamente.

---

## 📝 **Fluxo Completo (Corrigido)**

```
1. SEED
   ├── Cria Permissões
   ├── Cria CEO (com schools: [])
   └── Cria Account

2. CEO FAZ LOGIN
   ├── Autenticado ✅
   ├── schools: [] (vazio)
   ├── currentSchool: null
   └── Não tem permissões ainda

3. CEO ACESSA /schools/create
   ├── RoleProtectedRoute verifica
   ├── currentRole = undefined
   ├── userRole = "ceo"
   └── PERMITE ACESSO (com ajuste) ✅

4. CEO CRIA ESCOLA
   ├── Escola criada no Firestore
   ├── ASSOCIAR CEO À ESCOLA (automático)
   │   ├── Adiciona em user.schools[]
   │   ├── Define currentSchoolId
   │   └── Define role: "ceo" para essa escola
   ├── CRIAR ROLES PADRÃO (automático)
   │   └── rolesService.initializeDefaultRoles(schoolId, userId)
   └── Carregar permissões do CEO

5. SISTEMA FUNCIONA
   ├── CEO tem currentSchool ✅
   ├── currentSchool?.role = "ceo" ✅
   ├── Permissões carregadas ✅
   └── Pode gerenciar escola normalmente
```

---

## ⚠️ **PONTOS DE ATENÇÃO**

1. **CEO deve poder criar escola mesmo sem `currentSchool`**
2. **Após criar escola, deve associar automaticamente**
3. **Roles devem ser criadas automaticamente após criar escola**
4. **Sistema deve recarregar permissões após associação**

---

## ✅ **IMPLEMENTAÇÕES REALIZADAS**

### **1. Ajustado `RoleProtectedRoute`** ✅

- Adicionada verificação especial para CEO sem escola
- Permite CEO acessar `/schools/create` mesmo sem `currentSchool`
- Verifica `user?.role === "ceo"` como fallback

### **2. Ajustada rota `/schools/create`** ✅

- Adicionado `"ceo"` aos `allowedRoles`
- Agora permite tanto `master` quanto `ceo`

### **3. Modificado `CreateSchool.jsx`** ✅

- Importados `usersRepository`, `rolesService` e `useAuth`
- Após criar escola, verifica se é CEO sem escola
- Associa CEO automaticamente à escola criada:
  - Adiciona escola em `user.schools[]`
  - Define `currentSchoolId`
  - Define role `"ceo"` para essa escola
- Cria roles padrão automaticamente após criar escola
- Chama `switchSchool()` para atualizar contexto

---

## 🎯 **PRÓXIMOS PASSOS**

1. ✅ Ajustar `RoleProtectedRoute` para permitir CEO criar escola
2. ✅ Modificar `CreateSchool.jsx` para associar CEO automaticamente
3. ✅ Criar roles padrão automaticamente após criar escola
4. ⏳ **Testar fluxo completo**
