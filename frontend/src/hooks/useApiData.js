import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';

export default function useApiData(endpoint, fallback = []) {
    const [data, setData] = useState(fallback);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_URL}/${endpoint}`);
                if (mounted) {
                    setData(res.data);
                    setError(null);
                }
            } catch (err) {
                if (mounted) {
                    setError(err.message);
                    console.error(`Failed to fetch ${endpoint}:`, err);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchData();
        return () => { mounted = false; };
    }, [endpoint]);

    return { data, loading, error };
}
