import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AdviceResponse {
  type: 'success' | 'warning' | 'error';
  message: string;
  hints: string[];
  encouragement: string;
  additionalPractice?: string[];
}

export function useSubmissions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitCode = async (code: string, problemId: string, userId: string): Promise<AdviceResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          code,
          problemId,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze code');
      }

      const result = await response.json();
      return result.advice;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getSubmissionHistory = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          problems (
            title,
            difficulty
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  return {
    loading,
    error,
    submitCode,
    getSubmissionHistory,
  };
}