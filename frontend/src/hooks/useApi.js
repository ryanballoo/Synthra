import { useState, useEffect } from 'react';

export default function useApi(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(endpoint)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, [endpoint]);

  return { data, loading };
}