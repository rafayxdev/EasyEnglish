import { GoogleGenerativeAI } from '@google/generative-ai';

export type ChatTaskType =
  | 'TRANSLATE_TO_URDU'
  | 'TRANSLATE_TO_ENGLISH'
  | 'CHECK_SENTENCE'
  | 'EXPLAIN_WORD'
  | 'WRITE'
  | 'GENERAL';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY');
  }

  return new GoogleGenerativeAI(apiKey);
}

export async function generateAssistantReply({
  systemPrompt,
  taskType,
  recentMessages,
}: {
  systemPrompt: string;
  taskType: ChatTaskType;
  recentMessages: ChatMessage[];
}) {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 500,
    },
  });

  const prompt = [
    `Task type: ${taskType}`,
    '',
    'Recent conversation history:',
    ...recentMessages.map((msg) => `${msg.role}: ${msg.content}`),
    '',
    'Answer the user request using the rules from the system prompt.',
  ].join('\n');

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return text.trim();
}
