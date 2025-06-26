# GCI 講座 Python 学習支援システム

## 📖 概要

Python プログラミング学習者に対して効果的な学習支援を提供する Web アプリケーションです。学生は Python コードを提出し、AI による自動解析とアドバイスを受けることができ、管理者は学習進捗の把握と問題管理を行うことができます。

## ✨ 主な機能

### 👨‍🎓 学生向け機能

- **Python 課題提出**: コードエディタで Python コードを記述・提出
- **リアルタイムアドバイス**: AI による自動コード解析と改善提案
- **進捗管理**: 学習進捗の可視化（12/20 問完了など）
- **問題選択**: 難易度別の問題選択機能
- **学習履歴**: 過去の提出履歴とアドバイスの確認

### 👨‍💼 管理者向け機能

- **問題管理**: 問題の作成・編集・削除
- **学習分析**: 提出数、成功率、ユーザー統計の分析
- **セキュリティ管理**: 不適切なコンテンツの検出とログ記録
- **コスト分析**: LLM 使用料の試算と最適化提案

## 🛠 技術スタック

### フロントエンド

- **React 18.3.1**
- **TypeScript 5.5.3**
- **Vite 5.4.2**
- **Tailwind CSS 3.4.1**
- **Lucide React**

### バックエンド

- **Supabase** - BaaS（Backend as a Service）
  - PostgreSQL データベース
  - 認証機能（Auth）
  - Edge Functions（Deno）
  - Row Level Security（RLS）

### データベース設計

```sql
-- ユーザー管理
users (id, email, role, display_name, created_at)

-- 問題管理
problems (id, title, description, difficulty, example_input, example_output, test_cases, created_at, updated_at, created_by)

-- 提出履歴
submissions (id, problem_id, user_id, code, advice, status, execution_result, created_at)

-- セキュリティログ
security_logs (id, user_id, submission_id, event_type, details, created_at)
```

## 🚀 セットアップ・起動方法

### 前提条件

- Node.js 18.0.0 以上
- npm または yarn
- Supabase アカウント

### 1. リポジトリのクローン

```bash
git clone https://github.com/miinakoyama/python-tutor.git
cd python-tutor
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env` ファイルをプロジェクトルートに作成し、以下を設定：

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. データベースのセットアップ

```bash
# Supabase CLIを使用してマイグレーションを実行
supabase db push
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

### 6. 本番ビルド

```bash
npm run build
npm run preview
```

## 📁 プロジェクト構造

```
python-tutor/
├── src/
│   ├── components/          # Reactコンポーネント
│   │   ├── StudentPanel.tsx    # 学生用パネル
│   │   ├── AdminPanel.tsx      # 管理者用パネル
│   │   ├── CodeEditor.tsx      # コードエディタ
│   │   ├── AdvicePanel.tsx     # アドバイス表示
│   │   ├── ProblemManagement.tsx # 問題管理
│   │   ├── Analytics.tsx       # 分析・統計
│   │   └── ...
│   ├── hooks/              # カスタムフック
│   │   ├── useAuth.ts         # 認証管理
│   │   ├── useProblems.ts     # 問題管理
│   │   └── useSubmissions.ts  # 提出管理
│   ├── lib/                # ライブラリ設定
│   │   └── supabase.ts        # Supabase設定
│   └── App.tsx             # メインアプリケーション
├── supabase/
│   ├── functions/          # Edge Functions
│   │   └── analyze-code/      # コード解析機能
│   └── migrations/         # データベースマイグレーション
└── ...
```

## 🔧 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# コード品質チェック
npm run lint

# プレビューサーバー起動
npm run preview
```

## 🔒 セキュリティ機能

- **不適切コンテンツ検出**: 提出コード内の不適切な内容を自動検出
- **Row Level Security**: データベースレベルでのアクセス制御
- **セキュリティログ**: セキュリティイベントの記録と監視
- **認証・認可**: Supabase Auth による安全なユーザー管理

## 📊 分析・統計機能

- **提出数統計**: 問題別・期間別の提出数分析
- **成功率分析**: 難易度別の成功率と改善傾向
- **コスト分析**: LLM 使用料の試算と最適化提案
- **ユーザー分析**: アクティブユーザー数と利用パターン
