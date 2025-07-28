import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import useUser from "./useUser";

const useFetchUsersBySchool = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userDetails } = useUser();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!userDetails?.schoolId) {
          throw new Error("schoolId não encontrado no usuário.");
        }

        const schoolId = userDetails.schoolId;

        const usersSnapshot = await firebase
          .firestore()
          .collection("users")
          .where("schoolId", "==", schoolId) // Usar == para comparar
          .get();

        const fetchedUsers = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(fetchedUsers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userDetails?.schoolId) {
      fetchUsers();
    }
  }, [userDetails?.schoolId]);

  return { users, loading, error };
};

export default useFetchUsersBySchool;
