import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';

/**
 * Hook personalizado para gerenciar dados do usuário
 * Este hook consome o AuthContext e fornece funcionalidades relacionadas aos dados do usuário
 * @param {boolean} skipInitialFetch - Se true, não buscará os dados do usuário automaticamente
 * @returns {Object} Objeto contendo estado e funções relacionadas ao usuário
 */
const useUser = (skipInitialFetch = false) => {
  const { 
    currentUser, 
    userDetails, 
    loading: authLoading, 
    isAuthenticated,
    fetchUserDetails,
    updateUserDetails,
    fetchSchoolDetails
  } = useAuthContext();
  
  const [schoolDetails, setSchoolDetails] = useState(null);
  const [loading, setLoading] = useState(!skipInitialFetch);
  const [error, setError] = useState(null);

  // Função para buscar detalhes da escola do usuário
  const loadSchoolDetails = async () => {
    if (!userDetails || !userDetails.schoolId) {
      setSchoolDetails(null);
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      
      const schoolData = await fetchSchoolDetails(userDetails.schoolId);
      setSchoolDetails(schoolData);
      
      setLoading(false);
      return schoolData;
    } catch (err) {
      console.error('Erro ao buscar detalhes da escola:', err);
      setError(err.message || 'Erro ao buscar detalhes da escola');
      setLoading(false);
      return null;
    }
  };

  // Função para atualizar o perfil do usuário
  const updateProfile = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      await updateUserDetails(data);
      
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Erro ao atualizar perfil do usuário:', err);
      setError(err.message || 'Erro ao atualizar perfil do usuário');
      setLoading(false);
      throw err;
    }
  };

  // Função para recarregar os dados do usuário
  const refreshUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!currentUser) {
        setLoading(false);
        return null;
      }
      
      const userData = await fetchUserDetails(currentUser.uid);
      if (userData && userData.schoolId) {
        await loadSchoolDetails();
      }
      
      setLoading(false);
      return userData;
    } catch (err) {
      console.error('Erro ao recarregar dados do usuário:', err);
      setError(err.message || 'Erro ao recarregar dados do usuário');
      setLoading(false);
      return null;
    }
  };

  // Efeito para buscar detalhes da escola quando os detalhes do usuário mudarem
  useEffect(() => {
    if (!skipInitialFetch && userDetails && userDetails.schoolId && !schoolDetails) {
      loadSchoolDetails();
    }
  }, [userDetails, skipInitialFetch]);

  // Efeito para resetar o estado quando o usuário fizer logout
  useEffect(() => {
    if (!isAuthenticated) {
      setSchoolDetails(null);
    }
  }, [isAuthenticated]);

  return {
    currentUser,
    userDetails,
    schoolDetails,
    loading: loading || authLoading,
    error,
    isAuthenticated,
    refreshUserData,
    updateProfile,
    loadSchoolDetails
  };
};

export default useUser;
