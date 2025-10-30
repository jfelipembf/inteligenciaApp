/**
 * Cliente Firebase para Auth
 * Responsável apenas por comunicação com Firebase Auth
 */

import firebase from "firebase/compat/app";
import "firebase/compat/auth";

class AuthClient {
  constructor() {
    // Firebase Auth já está inicializado via firebase_helper
    this.auth = firebase.auth();
  }

  /**
   * Fazer login com email e senha
   */
  async signInWithEmailPassword(email, password) {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(
        email,
        password
      );
      return {
        success: true,
        data: userCredential.user,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: this._handleError(error),
      };
    }
  }

  /**
   * Fazer logout
   */
  async signOut() {
    try {
      await this.auth.signOut();
      return {
        success: true,
        data: null,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao fazer logout",
      };
    }
  }

  /**
   * Obter usuário atual
   */
  getCurrentUser() {
    try {
      const user = this.auth.currentUser;
      return {
        success: true,
        data: user,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao obter usuário atual",
      };
    }
  }

  /**
   * Observar mudanças no estado de autenticação
   */
  onAuthStateChange(callback) {
    try {
      const unsubscribe = this.auth.onAuthStateChanged((user) => {
        callback(user);
      });
      return unsubscribe;
    } catch (error) {
      console.error("Erro ao observar mudanças de auth:", error);
      return () => {};
    }
  }

  /**
   * Criar usuário com email e senha
   */
  async createUserWithEmailPassword(email, password) {
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      return {
        success: true,
        data: userCredential.user,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: this._handleError(error),
      };
    }
  }

  /**
   * Enviar email de redefinição de senha
   */
  async sendPasswordResetEmail(email) {
    try {
      await this.auth.sendPasswordResetEmail(email);
      return {
        success: true,
        data: null,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: this._handleError(error),
      };
    }
  }

  /**
   * Atualizar perfil do usuário
   */
  async updateProfile(profileData) {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        return {
          success: false,
          data: null,
          error: "Nenhum usuário autenticado",
        };
      }

      await user.updateProfile(profileData);
      return {
        success: true,
        data: this.auth.currentUser,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao atualizar perfil",
      };
    }
  }

  /**
   * Helper para tratar erros do Firebase Auth
   */
  _handleError(error) {
    const errorMap = {
      "auth/user-not-found": "Usuário não encontrado",
      "auth/wrong-password": "Senha incorreta",
      "auth/email-already-in-use": "Email já está em uso",
      "auth/weak-password": "Senha muito fraca",
      "auth/invalid-email": "Email inválido",
      "auth/user-disabled": "Usuário desabilitado",
      "auth/too-many-requests": "Muitas tentativas. Tente mais tarde",
      "auth/network-request-failed": "Erro de conexão",
    };

    return errorMap[error.code] || error.message || "Erro de autenticação";
  }
}

export const authClient = new AuthClient();
