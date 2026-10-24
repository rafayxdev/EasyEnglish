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
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const taskType = body.taskType ?? 'GENERAL';

    const sanitized = messages
      .filter((msg) => msg && typeof msg.content === 'string')
      .slice(-6)
      .map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content.slice(0, MAX_MESSAGE_LENGTH),
      }));

    const response = await generateAssistantReply({
      systemPrompt: easyEnglishSystemPrompt,
      taskType,
      recentMessages: sanitized,
    });

    return NextResponse.json({ reply: response });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
