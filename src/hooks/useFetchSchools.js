import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const useFetchSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchSchools();
  }, []);

  return { schools, loading, error };
};

export default useFetchSchools;
