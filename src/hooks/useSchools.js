import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const useSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para buscar todas as escolas
  const fetchSchools = async () => {
    setLoading(true);
    setError(null);

    try {
      const schoolsSnapshot = await firebase
        .firestore()
        .collection("schools")
        .get();
      const fetchedSchools = schoolsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSchools(fetchedSchools);
    } catch (err) {
      console.error("Erro ao buscar escolas:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar uma escola pelo ID
  const fetchSchoolById = async (schoolId) => {
    setLoading(true);
    setError(null);

    try {
      const schoolDoc = await firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .get();
      if (!schoolDoc.exists) {
        throw new Error("Escola não encontrada");
      }
      return { id: schoolDoc.id, ...schoolDoc.data() };
    } catch (err) {
      console.error("Erro ao buscar escola:", err);
      setError(err.message);
      throw err; // Repassa o erro para o chamador
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar uma escola
  const updateSchool = async (schoolId, updatedData) => {
    setLoading(true);
    setError(null);

    try {
      const schoolRef = firebase
        .firestore()
        .collection("schools")
        .doc(schoolId);

      // Obter os dados atuais da escola
      const schoolSnapshot = await schoolRef.get();
      if (!schoolSnapshot.exists) {
        throw new Error("Escola não encontrada");
      }

      const currentData = schoolSnapshot.data();

      // Atualizar apenas os campos modificados
      const finalData = {
        ...currentData,
        ...updatedData,
        metadata: {
          ...currentData.metadata,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        },
      };

      await schoolRef.update(finalData);

      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error("Erro ao atualizar a escola:", err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Função para criar uma nova escola
  const createSchool = async (schoolData) => {
    setLoading(true);
    setError(null);

    try {
      const schoolRef = firebase.firestore().collection("schools");
      const newSchool = {
        ...schoolData,
        metadata: {
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        },
      };

      const docRef = await schoolRef.add(newSchool);
      setLoading(false);
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error("Erro ao criar escola:", err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const updateSchoolLogo = async (schoolId, imageUrl) => {
    try {
      const schoolRef = firebase
        .firestore()
        .collection("schools")
        .doc(schoolId);
      await schoolRef.update({ logo: imageUrl });
    } catch (err) {
      console.error("Erro ao atualizar o logo da escola:", err);
      throw err;
    }
  };

  const CACHE_EXPIRATION = 1000 * 60 * 60 * 24 * 7; // 7 dias

  const fetchSchoolLogo = async (schoolId, logoName) => {
    if (!schoolId || !logoName) {
      throw new Error("schoolId ou logoName não fornecido.");
    }

    const cacheKey = `school_logo_${schoolId}_${logoName}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const { url, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRATION) {
          return url; // Retorna a URL do cache se ainda for válida
        }
      } catch {
        // Se o cache estiver corrompido, ignora e continua
      }
    }

    try {
      const ref = firebase.storage().ref(`${schoolId}/logos/${logoName}`);
      const url = await ref.getDownloadURL();

      // Armazena a URL no cache
      localStorage.setItem(
        cacheKey,
        JSON.stringify({ url, timestamp: Date.now() })
      );

      return url;
    } catch (err) {
      console.error("Erro ao buscar a logo da escola:", err);
      throw err;
    }
  };

  // Busca inicial de escolas ao montar o componente
  useEffect(() => {
    fetchSchools();
  }, []);

  return {
    schools,
    loading,
    error,
    fetchSchools,
    fetchSchoolById,
    createSchool,
    updateSchoolLogo,
    updateSchool,
  };
};

export default useSchools;
