import { useRef } from "react";

const useFetchOnce = (fetchFunction) => {
  const cache = useRef({});

  const fetchOnce = async (key, ...args) => {
    if (cache.current[key]) {
      console.log("Retornando do cache:", key);
      return cache.current[key];
    }

    try {
      const result = await fetchFunction(...args);
      cache.current[key] = result;
      return result;
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      throw error;
    }
  };

  return fetchOnce;
};

export default useFetchOnce;
