import { useEffect, useState } from 'react';
import axios from 'axios';

const useCountries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const countryNames = response.data
          .map(country => country.name.common)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));
        setCountries(countryNames);
      } catch (err) {
        setError('Failed to fetch countries');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
};

export default useCountries;
