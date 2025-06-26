import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface AnalyzeRequest {
  code: string;
  problemId: string;
  userId: string;
}

interface AdviceResponse {
  type: 'success' | 'warning' | 'error';
  message: string;
  hints: string[];
  encouragement: string;
  additionalPractice?: string[];
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { code, problemId, userId }: AnalyzeRequest = await req.json();

    // セキュリティチェック - 不適切なコンテンツの検出
    const suspiciousPatterns = [
      '答えを教えて',
      'give me the answer',
      'solution',
      '正解',
      'help me solve',
      'what is the answer',
      'solve this for me',
      'complete this code'
    ];

    const hasSuspiciousContent = suspiciousPatterns.some(pattern => 
      code.toLowerCase().includes(pattern.toLowerCase())
    );

    if (hasSuspiciousContent) {
      // セキュリティログを記録
      await supabase.from('security_logs').insert({
        user_id: userId,
        event_type: 'suspicious_content_detected',
        details: {
          code_snippet: code.substring(0, 200),
          detected_patterns: suspiciousPatterns.filter(pattern => 
            code.toLowerCase().includes(pattern.toLowerCase())
          )
        }
      });

      const advice: AdviceResponse = {
        type: 'warning',
        message: '不適切な内容が検出されました。自分の力でコードを書いて学習しましょう！',
        hints: [],
        encouragement: '学習の近道はありません。一歩ずつ頑張りましょう！'
      };

      return new Response(
        JSON.stringify({ advice }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 問題情報を取得
    const { data: problem } = await supabase
      .from('problems')
      .select('*')
      .eq('id', problemId)
      .single();

    if (!problem) {
      return new Response(
        JSON.stringify({ error: "Problem not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // コード解析とアドバイス生成
    const advice = await analyzeCode(code, problem);

    // 提出記録を保存
    await supabase.from('submissions').insert({
      problem_id: problemId,
      user_id: userId,
      code: code,
      advice: advice,
      status: 'analyzed'
    });

    return new Response(
      JSON.stringify({ advice }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error('Error in analyze-code function:', error);
    
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function analyzeCode(code: string, problem: any): Promise<AdviceResponse> {
  const hints: string[] = [];
  let type: 'success' | 'warning' | 'error' = 'success';
  let message = '';

  // 基本的なコード解析
  const codeAnalysis = {
    hasFunction: code.includes('def '),
    hasReturn: code.includes('return'),
    hasPrint: code.includes('print('),
    hasLoop: code.includes('for ') || code.includes('while '),
    hasIf: code.includes('if '),
    indentationIssues: checkIndentation(code),
    syntaxErrors: await checkSyntax(code)
  };

  // 問題固有の分析
  if (!codeAnalysis.hasFunction) {
    hints.push('関数定義（def）を使用していますか？');
    type = 'error';
  }

  if (!codeAnalysis.hasReturn && codeAnalysis.hasFunction) {
    hints.push('return文で結果を返していますか？');
    type = 'error';
  }

  if (codeAnalysis.hasPrint && problem.title.includes('関数')) {
    hints.push('関数内でprintを使わず、returnで値を返しましょう');
    if (type === 'success') type = 'warning';
  }

  if (!codeAnalysis.hasLoop && problem.title.includes('繰り返し')) {
    hints.push('繰り返し処理（for文またはwhile文）を使ってみましょう');
    if (type === 'success') type = 'warning';
  }

  if (codeAnalysis.indentationIssues.length > 0) {
    hints.push('インデント（字下げ）を確認してください。Pythonではインデントが重要です');
    if (type === 'success') type = 'warning';
  }

  if (codeAnalysis.syntaxErrors.length > 0) {
    hints.push('構文エラーがあります。コロン（:）や括弧の対応を確認してください');
    type = 'error';
  }

  // メッセージ生成
  if (type === 'success') {
    message = '素晴らしいコードです！基本的な構文は正しく使えています。';
  } else if (type === 'warning') {
    message = 'もう少しで完成です！以下のヒントを参考にしてください。';
  } else {
    message = 'いくつか改善できる点があります。一つずつ確認してみましょう。';
  }

  const encouragementMessages = [
    '継続は力なり！少しずつでも確実に上達しています！',
    'プログラミングは試行錯誤が大切です。諦めずに頑張りましょう！',
    '間違いを恐れずにチャレンジする姿勢が素晴らしいです！',
    'コードを書くたびに新しい発見がありますね！',
    '一歩一歩着実に進歩しています。その調子です！'
  ];

  const additionalPractice = type !== 'success' ? [
    '基本的な関数の書き方を復習してみましょう',
    '変数の使い方について練習問題をやってみませんか？',
    'Pythonの基本構文について確認してみましょう'
  ] : [];

  return {
    type,
    message,
    hints,
    encouragement: encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)],
    additionalPractice
  };
}

function checkIndentation(code: string): string[] {
  const issues: string[] = [];
  const lines = code.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') continue;
    
    // 基本的なインデントチェック
    if (line.includes('def ') && line.indexOf('def ') > 0) {
      issues.push(`行 ${i + 1}: 関数定義のインデントを確認してください`);
    }
  }
  
  return issues;
}

async function checkSyntax(code: string): Promise<string[]> {
  const errors: string[] = [];
  
  // 基本的な構文チェック
  const lines = code.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '') continue;
    
    // コロンのチェック
    if ((line.includes('def ') || line.includes('if ') || line.includes('for ') || line.includes('while ')) && !line.endsWith(':')) {
      errors.push(`行 ${i + 1}: コロン（:）が必要です`);
    }
    
    // 括弧の対応チェック
    const openParens = (line.match(/\(/g) || []).length;
    const closeParens = (line.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push(`行 ${i + 1}: 括弧の対応を確認してください`);
    }
  }
  
  return errors;
}