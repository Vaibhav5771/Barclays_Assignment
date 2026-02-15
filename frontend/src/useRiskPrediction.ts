import { useState } from 'react';
import { predictRisk } from '@/api/riskApi';

export function useRiskPrediction() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const runPrediction = async (data: any) => {
        try {
            setLoading(true);
            const res = await predictRisk(data);
            setResult(res);
        } catch (err: any) {
            setError(err.message || 'Prediction failed');
        } finally {
            setLoading(false);
        }
    };

    return { runPrediction, loading, result, error };
}
