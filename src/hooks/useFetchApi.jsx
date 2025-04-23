import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchApi = (url, params = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          params,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData().then();
  }, [url]);

  return { data, loading, error };
};

export default useFetchApi;
