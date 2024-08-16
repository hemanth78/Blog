// hooks/useFetch.js
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useFetch = (url, token = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const config = token ? { headers: { "x-auth-token": token } } : {};
      const res = await axios.get(url, config);
      setData(res.data);
    } catch (err) {
      console.error(err); // Log the error
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [url, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
