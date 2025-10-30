/**
 * Repository de Auth
 * Abstração de dados para autenticação
 */

import { authClient } from "../../infrastructure/firebase/clients/auth/authClient";

class AuthRepository {
  /**
   * Fazer login
   */
  async signInWithEmailPassword(email, password) {
    try {
      return await authClient.signInWithEmailPassword(email, password);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao fazer login",
      };
    }
  }

  /**
   * Fazer logout
   */
  async signOut() {
    try {
      return await authClient.signOut();
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao fazer logout",
      };
    }
  }

  /**
   * Obter usuário atual
   */
  getCurrentUser() {
    try {
      return authClient.getCurrentUser();
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao obter usuário atual",
      };
    }
  }

  /**
   * Observar mudanças no estado de autenticação
   */
  onAuthStateChange(callback) {
    try {
      return authClient.onAuthStateChange(callback);
    } catch (error) {
      console.error("Erro ao observar mudanças de auth:", error);
      return () => {};
    }
  }

  /**
   * Criar usuário
   */
  async createUserWithEmailPassword(email, password) {
    try {
      return await authClient.createUserWithEmailPassword(email, password);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao criar usuário",
      };
    }
  }

  /**
   * Enviar email de redefinição de senha
   */
  async sendPasswordResetEmail(email) {
    try {
      return await authClient.sendPasswordResetEmail(email);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao enviar email de redefinição",
      };
    }
  }

  /**
   * Atualizar perfil
   */
  async updateProfile(profileData) {
    try {
      return await authClient.updateProfile(profileData);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao atualizar perfil",
      };
    }
  }
}

export const authRepository = new AuthRepository();
