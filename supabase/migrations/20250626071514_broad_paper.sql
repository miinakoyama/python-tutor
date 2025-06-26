/*
  # 初期データベーススキーマ作成

  1. 新しいテーブル
    - `problems` - 問題管理
      - `id` (uuid, primary key)
      - `title` (text) - 問題タイトル
      - `description` (text) - 問題説明
      - `difficulty` (text) - 難易度 (beginner, intermediate, advanced)
      - `example_input` (text) - 入力例
      - `example_output` (text) - 出力例
      - `test_cases` (jsonb) - テストケース
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `created_by` (uuid) - 作成者

    - `submissions` - 提出記録
      - `id` (uuid, primary key)
      - `problem_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `code` (text) - 提出されたコード
      - `advice` (jsonb) - 生成されたアドバイス
      - `status` (text) - 提出ステータス
      - `execution_result` (jsonb) - 実行結果
      - `created_at` (timestamp)

    - `users` - ユーザー管理
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `role` (text) - ユーザーロール (student, admin)
      - `display_name` (text)
      - `created_at` (timestamp)

    - `security_logs` - セキュリティログ
      - `id` (uuid, primary key)
      - `user_id` (uuid)
      - `submission_id` (uuid)
      - `event_type` (text) - イベントタイプ
      - `details` (jsonb) - 詳細情報
      - `created_at` (timestamp)

  2. セキュリティ
    - 全テーブルでRLSを有効化
    - 適切なポリシーを設定
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  display_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Problems table
CREATE TABLE IF NOT EXISTS problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  example_input text NOT NULL,
  example_output text NOT NULL,
  test_cases jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id)
);

ALTER TABLE problems ENABLE ROW LEVEL SECURITY;

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id uuid NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code text NOT NULL,
  advice jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'analyzed', 'error')),
  execution_result jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Security logs table
CREATE TABLE IF NOT EXISTS security_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  submission_id uuid REFERENCES submissions(id),
  event_type text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Problems policies
CREATE POLICY "Anyone can read problems"
  ON problems
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage problems"
  ON problems
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Submissions policies
CREATE POLICY "Users can read own submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own submissions"
  ON submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can read all submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Security logs policies
CREATE POLICY "Admins can read security logs"
  ON security_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can create security logs"
  ON security_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert sample problems
INSERT INTO problems (title, description, difficulty, example_input, example_output, test_cases) VALUES
(
  '基本的な関数作成',
  '二つの数値を受け取って、それらの合計を返す関数 add(a, b) を作成してください。',
  'beginner',
  'add(3, 5)',
  '8',
  '[
    {"input": "add(1, 2)", "expected": "3"},
    {"input": "add(10, -5)", "expected": "5"},
    {"input": "add(0, 0)", "expected": "0"}
  ]'::jsonb
),
(
  'リストの最大値',
  '数値のリストを受け取って、その中の最大値を返す関数 find_max(numbers) を作成してください。',
  'beginner',
  'find_max([1, 5, 3, 9, 2])',
  '9',
  '[
    {"input": "find_max([1, 2, 3])", "expected": "3"},
    {"input": "find_max([10, -5, 7])", "expected": "10"},
    {"input": "find_max([-1, -2, -3])", "expected": "-1"}
  ]'::jsonb
),
(
  '繰り返し処理での合計',
  '1からnまでの数値の合計を計算する関数 sum_range(n) を作成してください。',
  'intermediate',
  'sum_range(5)',
  '15',
  '[
    {"input": "sum_range(3)", "expected": "6"},
    {"input": "sum_range(10)", "expected": "55"},
    {"input": "sum_range(1)", "expected": "1"}
  ]'::jsonb
);