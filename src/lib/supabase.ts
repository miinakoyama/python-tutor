import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'student' | 'admin';
          display_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role?: 'student' | 'admin';
          display_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'student' | 'admin';
          display_name?: string | null;
          created_at?: string;
        };
      };
      problems: {
        Row: {
          id: string;
          title: string;
          description: string;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          example_input: string;
          example_output: string;
          test_cases: any;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          difficulty?: 'beginner' | 'intermediate' | 'advanced';
          example_input: string;
          example_output: string;
          test_cases?: any;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          difficulty?: 'beginner' | 'intermediate' | 'advanced';
          example_input?: string;
          example_output?: string;
          test_cases?: any;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
      };
      submissions: {
        Row: {
          id: string;
          problem_id: string;
          user_id: string;
          code: string;
          advice: any;
          status: 'pending' | 'analyzed' | 'error';
          execution_result: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          problem_id: string;
          user_id: string;
          code: string;
          advice?: any;
          status?: 'pending' | 'analyzed' | 'error';
          execution_result?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          problem_id?: string;
          user_id?: string;
          code?: string;
          advice?: any;
          status?: 'pending' | 'analyzed' | 'error';
          execution_result?: any;
          created_at?: string;
        };
      };
      security_logs: {
        Row: {
          id: string;
          user_id: string | null;
          submission_id: string | null;
          event_type: string;
          details: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          submission_id?: string | null;
          event_type: string;
          details?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          submission_id?: string | null;
          event_type?: string;
          details?: any;
          created_at?: string;
        };
      };
    };
  };
};