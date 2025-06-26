import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Problem = Database['public']['Tables']['problems']['Row'];

export function useProblems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('problems')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setProblems(data || []);
      }
    } catch (err) {
      setError('Failed to fetch problems');
    } finally {
      setLoading(false);
    }
  };

  const createProblem = async (problem: Database['public']['Tables']['problems']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('problems')
        .insert(problem)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setProblems(prev => [...prev, data]);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  const updateProblem = async (id: string, updates: Database['public']['Tables']['problems']['Update']) => {
    try {
      const { data, error } = await supabase
        .from('problems')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setProblems(prev => prev.map(p => p.id === id ? data : p));
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  const deleteProblem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('problems')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setProblems(prev => prev.filter(p => p.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return {
    problems,
    loading,
    error,
    fetchProblems,
    createProblem,
    updateProblem,
    deleteProblem,
  };
}