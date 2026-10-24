import { NextRequest, NextResponse } from 'next/server';
import { generateAssistantReply } from '@/lib/ai';
import { easyEnglishSystemPrompt } from '@/lib/prompts';
import { checkRateLimit } from '@/lib/rateLimit';

const MAX_MESSAGE_LENGTH = 500;

export async function POST(request: NextRequest) {
  const clientIp = request.headers.get('x-forwarded-for') ?? 'local';

  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const messages: unknown[] = Array.isArray(body.messages) ? body.messages : [];
    const taskType = body.taskType ?? 'GENERAL';
    const lessonContext = typeof body.lessonName === 'string' ? body.lessonName : '';

    const sanitized = messages
      .filter((msg): msg is { role?: string; content: string } => (
        Boolean(msg && typeof msg === 'object' && 'content' in msg && typeof msg.content === 'string')
      ))
      .slice(-6)
      .map((msg) => ({
        role: msg.role === 'assistant' ? ('assistant' as const) : ('user' as const),
        content: msg.content.slice(0, MAX_MESSAGE_LENGTH),
      }));

    try {
      const response = await generateAssistantReply({
        systemPrompt: easyEnglishSystemPrompt,
        taskType,
        recentMessages: sanitized,
        lessonContext: lessonContext || undefined,
      });

      return NextResponse.json({ reply: response });
    } catch (error) {
      console.error('Assistant provider error:', error instanceof Error ? error.message : 'Unknown provider error');
      const message = error instanceof Error && error.message === 'Missing GROQ_API_KEY and GEMINI_API_KEY'
        ? 'The assistant is not configured yet. Please add GROQ_API_KEY or GEMINI_API_KEY in .env.local.'
        : 'Something went wrong. Please try again.';

      return NextResponse.json({ reply: message }, { status: 200 });
    }
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
