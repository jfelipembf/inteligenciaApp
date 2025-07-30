import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import useUser from "./useUser";

const useSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userDetails } = useUser();

  // Função para buscar todas as escolas
  const fetchSchools = async () => {
    setLoading(true);
    setError(null);

    try {
      const firestore = firebase.firestore();

      // Verificar se o usuário é um `ceo`
      if (userDetails?.role === "ceo") {
        if (!userDetails.schoolIds || userDetails.schoolIds.length === 0) {
          throw new Error("schoolIds não encontrados para o usuário ceo.");
        }

        // Buscar apenas as escolas cujo ID está no array schoolIds do CEO
        const schoolsSnapshot = await firestore
          .collection("schools")
          .where(
            firebase.firestore.FieldPath.documentId(),
            "in",
            userDetails.schoolIds
          )
          .get();

        const fetchedSchools = schoolsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSchools(fetchedSchools);
      } else {
        // Buscar todas as escolas para outros papéis
        const schoolsSnapshot = await firestore.collection("schools").get();
        const fetchedSchools = schoolsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSchools(fetchedSchools);
      }
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

  const fetchSchoolLogo = async (schoolId) => {
    if (!schoolId) {
      throw new Error("schoolId não fornecido.");
    }

    const cacheKey = `school_logo_${schoolId}`;
    const cached = localStorage.getItem(cacheKey);

    // Verifica se há um cache válido
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
      // Busca o documento da escola no Firestore
      const schoolDoc = await firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .get();

      if (!schoolDoc.exists) {
        console.warn("Escola não encontrada.");
        return null; // Retorna null se a escola não existir
      }

      const schoolData = schoolDoc.data();
      const logoName = schoolData.logo; // Obtém o nome do logo do campo `logo`

      if (!logoName) {
        console.warn("Logo não encontrado para esta escola.");
        return null; // Retorna null se o campo `logo` não existir ou estiver vazio
      }

      // Busca a URL do logo no Firebase Storage
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
      return null; // Retorna null em caso de erro
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
    fetchSchoolLogo,
    createSchool,
    updateSchoolLogo,
    updateSchool,
  };
};

export default useSchools;
