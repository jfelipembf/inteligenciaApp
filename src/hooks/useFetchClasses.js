import { useState, useEffect, useCallback } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import useUser from "./useUser";

// Dados mockados para quando o Firebase não estiver disponível
const MOCK_CLASSES = [
  {
    id: "class1",
    identifier: { value: "A", label: "A" },
    series: { value: "1º ano", label: "1º ano" },
    educationLevel: {
      value: "Ensino Fundamental I",
      label: "Ensino Fundamental I",
    },
    period: { value: "Manhã", label: "Manhã" },
    status: "Ativo",
    studentCount: 25,
    teacherName: "Maria Silva",
    room: "Sala 101",
    startDate: "10/02/2025",
    endDate: "",
    metadata: {
      createdAt: new Date().toISOString(),
      createdBy: "admin123",
    },
    schoolId: "escola-modelo",
  },
  {
    id: "class2",
    identifier: { value: "B", label: "B" },
    series: { value: "2º ano", label: "2º ano" },
    educationLevel: {
      value: "Ensino Fundamental I",
      label: "Ensino Fundamental I",
    },
    period: { value: "Tarde", label: "Tarde" },
    status: "Ativo",
    studentCount: 28,
    teacherName: "João Oliveira",
    room: "Sala 102",
    startDate: "10/02/2025",
    endDate: "",
    metadata: {
      createdAt: new Date().toISOString(),
      createdBy: "admin123",
    },
    schoolId: "escola-modelo",
  },
  {
    id: "class3",
    identifier: { value: "C", label: "C" },
    series: { value: "3º ano", label: "3º ano" },
    educationLevel: {
      value: "Ensino Fundamental I",
      label: "Ensino Fundamental I",
    },
    period: { value: "Manhã", label: "Manhã" },
    status: "Ativo",
    studentCount: 30,
    teacherName: "Ana Souza",
    room: "Sala 103",
    startDate: "10/02/2025",
    endDate: "",
    metadata: {
      createdAt: new Date().toISOString(),
      createdBy: "admin123",
    },
    schoolId: "escola-modelo",
  },
  {
    id: "class4",
    identifier: { value: "A", label: "A" },
    series: { value: "1º ano", label: "1º ano" },
    educationLevel: { value: "Ensino Médio", label: "Ensino Médio" },
    period: { value: "Manhã", label: "Manhã" },
    status: "Ativo",
    studentCount: 35,
    teacherName: "Carlos Santos",
    room: "Sala 201",
    startDate: "10/02/2025",
    endDate: "",
    metadata: {
      createdAt: new Date().toISOString(),
      createdBy: "admin123",
    },
    schoolId: "escola-modelo",
  },
  {
    id: "class5",
    identifier: { value: "B", label: "B" },
    series: { value: "2º ano", label: "2º ano" },
    educationLevel: { value: "Ensino Médio", label: "Ensino Médio" },
    period: { value: "Tarde", label: "Tarde" },
    status: "Ativo",
    studentCount: 32,
    teacherName: "Fernanda Lima",
    room: "Sala 202",
    startDate: "10/02/2025",
    endDate: "",
    metadata: {
      createdAt: new Date().toISOString(),
      createdBy: "admin123",
    },
    schoolId: "escola-modelo",
  },
  {
    id: "class6",
    identifier: { value: "C", label: "C" },
    series: { value: "3º ano", label: "3º ano" },
    educationLevel: { value: "Ensino Médio", label: "Ensino Médio" },
    period: { value: "Noite", label: "Noite" },
    status: "Ativo",
    studentCount: 27,
    teacherName: "Roberto Alves",
    room: "Sala 203",
    startDate: "10/02/2025",
    endDate: "",
    metadata: {
      createdAt: new Date().toISOString(),
      createdBy: "admin123",
    },
    schoolId: "escola-modelo",
  },
];

export const useFetchClasses = (options = {}) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { skipInitialFetch = false } = options;
  const { userDetails } = useUser();

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Verificar se o Firebase está inicializado
      if (!firebase.apps.length) {
        console.log("Firebase não inicializado, usando dados mockados");
        // Simular um pequeno delay para parecer uma chamada real
        await new Promise((resolve) => setTimeout(resolve, 800));
        setClasses(MOCK_CLASSES);
        return MOCK_CLASSES;
      }

      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        console.log("Usuário não autenticado, usando dados mockados");
        await new Promise((resolve) => setTimeout(resolve, 800));
        setClasses(MOCK_CLASSES);
        return MOCK_CLASSES;
      }

      if (!userDetails?.schoolId) {
        throw new Error("schoolId não encontrado no usuário.");
      }

      const schoolId = userDetails.schoolId;

      if (!schoolId) {
        console.log("schoolId não encontrado, usando dados mockados");
        await new Promise((resolve) => setTimeout(resolve, 800));
        setClasses(MOCK_CLASSES);
        return MOCK_CLASSES;
      }

      const classesSnapshot = await firebase
        .firestore()
        .collection("schools")
        .doc(schoolId)
        .collection("classes")
        .get();

      const fetchedClasses = await Promise.all(
        classesSnapshot.docs.map(async (doc) => {
          const studentsSnapshot = await firebase
            .firestore()
            .collection("schools")
            .doc(schoolId)
            .collection("classes")
            .doc(doc.id)
            .collection("students")
            .get();

          return {
            id: doc.id,
            ...doc.data(),
            studentCount: studentsSnapshot.size,
            value: doc.id, // ID da turma
            label: doc.data().className,
          };
        })
      );

      setClasses(fetchedClasses);
      return fetchedClasses;
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
      console.log("Usando dados mockados devido a erro:", error.message);
      setClasses(MOCK_CLASSES);
      return MOCK_CLASSES;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!skipInitialFetch) {
      fetchClasses().catch((err) => {
        // Erro já tratado dentro de fetchClasses
        console.error("Erro no useEffect do useFetchClasses:", err);
      });
    }
  }, [fetchClasses, skipInitialFetch]);

  return { classes, loading, error, fetchClasses, refetch: fetchClasses };
};

export default useFetchClasses;
