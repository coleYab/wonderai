import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatbotRequestBody = {
  message?: string;
  history?: ChatMessage[];
  promptData?: string;
  tourContext?: string;
};

const DEFAULT_PROMPT_DATA = `
You are the AI chatbot assistant for a travel dashboard application.

Behavior requirements:
- Let the user ask anything they want.
- Be helpful, concise, and accurate.
- If the user asks travel-related questions, provide practical suggestions.
- If information is missing, ask a short clarifying question.
- Always respond in GitHub-flavored Markdown.
`;

function toTranscript(history: ChatMessage[]): string {
  if (!history.length) return 'No previous chat history.';

  return history
    .map((item) => {
      const speaker = item.role === 'assistant' ? 'Assistant' : 'User';
      return `${speaker}: ${item.content}`;
    })
    .join('\n');
}

export async function POST(request: Request) {
  try {
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENAI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      '';
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    const body = (await request.json()) as ChatbotRequestBody;
    const message = body.message?.trim() || '';
    if (!message) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const safeHistory = Array.isArray(body.history)
      ? body.history
          .filter((item) => item?.content && (item.role === 'user' || item.role === 'assistant'))
          .slice(-20)
      : [];

    const promptData = body.promptData?.trim() || DEFAULT_PROMPT_DATA;
    const tourContext = body.tourContext?.trim() || 'No tour context provided.';

    const prompt = `
System prompt data:
${promptData}

Tour context from the app:
${tourContext}

Conversation so far:
${toTranscript(safeHistory)}

Latest user message:
User: ${message}

Respond as Assistant in Markdown.
`;

    const encoder = new TextEncoder();

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContentStream({
          model: modelName,
          contents: prompt
        });

        const stream = new ReadableStream<Uint8Array>({
          async start(controller) {
            try {
              let hasContent = false;

              for await (const chunk of response) {
                const textChunk = chunk.text || '';
                if (!textChunk) continue;

                hasContent = true;
                controller.enqueue(encoder.encode(textChunk));
              }

              if (!hasContent) {
                controller.enqueue(encoder.encode('I could not generate a response right now.'));
              }

              controller.close();
            } catch (error) {
              console.error('Failed while streaming chatbot response:', error);
              controller.error(error);
            }
          }
        });

        return new Response(stream, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive'
          }
        });
      } catch (geminiError) {
        console.warn(
          'Gemini chatbot streaming failed, falling back to assistant reply:',
          geminiError
        );
      }
    }

    // Fallback stream when API key is missing or call fails
    const fallbackText = `I am your Kuriftu Resort & Spa AI assistant. How can I help you plan your itinerary, explore amenities, or navigate the dashboard?`;
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode(fallbackText));
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive'
      }
    });
  } catch (error) {
    console.error('Failed to generate chatbot response:', error);
    return NextResponse.json({ error: 'Failed to chat with Gemini.' }, { status: 500 });
  }
}
