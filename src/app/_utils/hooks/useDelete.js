import { useState } from "react";
import { api } from "../../../server/app";

export const useDelete = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async (resource, id) => {
    try {
      setLoading(true);
      await api.delete(resource, id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    error,
    fetch: fetchData,
  };
};
