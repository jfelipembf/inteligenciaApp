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

      if (userDetails?.role === "ceo" || userDetails?.role === "master") {
        const schoolsSnapshot = await firestore.collection("schools").get();
        const fetchedSchools = schoolsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSchools(fetchedSchools);
      } else {
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
      throw err;
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

      const schoolSnapshot = await schoolRef.get();
      if (!schoolSnapshot.exists) {
        throw new Error("Escola não encontrada");
      }

      const currentData = schoolSnapshot.data();

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

    if (cached) {
      try {
        const { url, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRATION) {
          return url;
        }
      } catch {
        // Se o cache estiver corrompido, ignora e continua
      }
    }

    try {
      const schoolDoc = await firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .get();

      if (!schoolDoc.exists) {
        console.warn("Escola não encontrada.");
        return null;
      }

      const schoolData = schoolDoc.data();
      const logoName = schoolData.logo;

      if (!logoName) {
        console.warn("Logo não encontrado para esta escola.");
        return null;
      }

      const ref = firebase.storage().ref(`${schoolId}/logos/${logoName}`);
      const url = await ref.getDownloadURL();

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
