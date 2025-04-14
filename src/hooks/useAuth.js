import { useAuthContext } from '../contexts/AuthContext';

/**
 * Hook personalizado para gerenciar autenticação
 * Este hook simplifica o acesso ao AuthContext
 * @returns {Object} Objeto contendo estado e funções de autenticação
 */
const useAuth = () => {
  // Usar o contexto de autenticação
  const auth = useAuthContext();
  
  // Retornar apenas as propriedades e funções relacionadas à autenticação
  return {
    currentUser: auth.currentUser,
    loading: auth.loading,
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,
    login: auth.login,
    logout: auth.logout,
    signup: auth.signup,
    resetPassword: auth.resetPassword
  };
};

export default useAuth;
