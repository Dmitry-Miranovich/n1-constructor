import { useState } from "react";
import { api } from "../../../server/app";

export const useUpdate = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async (resource, id, inputData) => {
    try {
      setLoading(true);
      const result = await api.update(resource, id, inputData);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return {
    data,
    loading,
    error,
    fetch: fetchData,
  };
};
