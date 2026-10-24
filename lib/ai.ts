import { GoogleGenerativeAI } from '@google/generative-ai';

export type ChatTaskType =
  | 'TRANSLATE_TO_URDU'
  | 'TRANSLATE_TO_ENGLISH'
  | 'CHECK_SENTENCE'
  | 'EXPLAIN_WORD'
  | 'WRITE'
  | 'GENERAL'
  | 'LESSON_HELP';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type AssistantRequest = {
  systemPrompt: string;
  taskType: ChatTaskType;
  recentMessages: ChatMessage[];
  lessonContext?: string;
};

const MAX_OUTPUT_TOKENS = 500;

function hasUsableKey(value: string | undefined) {
  return Boolean(value && value.trim() && !value.includes('your_api_key_here'));
}

function buildPrompt({ taskType, recentMessages, lessonContext }: Pick<AssistantRequest, 'taskType' | 'recentMessages' | 'lessonContext'>) {
  return [
    `Task type: ${taskType}`,
    lessonContext ? `Lesson context: ${lessonContext}` : 'Lesson context: none',
    '',
    'Recent conversation history:',
    ...recentMessages.map((msg) => `${msg.role}: ${msg.content}`),
    '',
    'Answer the user request using the rules from the system prompt. Keep it simple, clear, and beginner-friendly.',
  ].join('\n');
}

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_api_key_here')) {
    throw new Error('Missing GEMINI_API_KEY');
  }

  return new GoogleGenerativeAI(apiKey);
}

async function generateGroqReply(request: AssistantRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!hasUsableKey(apiKey)) {
    throw new Error('Missing GROQ_API_KEY');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL ?? 'openai/gpt-oss-120b',
      temperature: 0.4,
      max_tokens: MAX_OUTPUT_TOKENS,
      messages: [
        { role: 'system', content: request.systemPrompt },
        ...request.recentMessages,
        { role: 'user', content: buildPrompt(request) },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq request failed with status ${response.status}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const reply = data.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    throw new Error('Groq returned an empty response');
  }

  return reply;
}

async function generateGeminiReply(request: AssistantRequest) {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? 'gemini-3.8-flash',
    systemInstruction: request.systemPrompt,
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
    },
  });

  const result = await model.generateContent(buildPrompt(request));
  const text = result.response.text();

  return text.trim();
}

export async function generateAssistantReply(request: AssistantRequest) {
  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;

  if (hasUsableKey(groqKey)) {
    try {
      return await generateGroqReply(request);
    } catch (error) {
      console.error('Groq provider error:', error instanceof Error ? error.message : 'Unknown Groq error');
      if (!hasUsableKey(geminiKey)) {
        throw error;
      }
    }
  }

  if (hasUsableKey(geminiKey)) {
    return generateGeminiReply(request);
  }

  throw new Error('Missing GROQ_API_KEY and GEMINI_API_KEY');
}
