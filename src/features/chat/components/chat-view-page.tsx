'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Icons } from '@/components/icons';
import {
  TRIPS_STORAGE_KEY,
  readStoredTrips,
  type StoredCustomTrip
} from '@/features/trips/lib/custom-trips-storage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

const CHATBOT_HISTORY_KEY = 'dashboard.chatbot.history.v1';
const MAX_CONTEXT_TOURS = 12;
const MAX_CONTEXT_PLACES_PER_TOUR = 8;

const PROMPT_DATA = `
You are the in-app travel chatbot for this dashboard.

Behavior rules:
- Let the user ask anything, with special strength in trip planning.
- Always respond in GitHub-flavored Markdown.
- Be concise, practical, and accurate.
- Prefer actionable suggestions, checklists, and clear next steps.
- If details are missing, ask a short clarifying question before over-assuming.

Planning quality requirements:
- When asked for a plan, provide a structured answer with:
  1. A short recommended plan summary
  2. Day-by-day or step-by-step breakdown
  3. Budget guidance in ETB when budget is relevant
  4. Optional alternatives (budget/comfort/premium)
- Use the app context and tour context below when relevant.
- If no saved tours exist, still provide complete planning guidance from first principles.
- For time-sensitive planning, mention assumptions explicitly.

Trip-planning defaults (when user gives little detail):
- Assume 2-4 days for short itineraries.
- Provide morning/afternoon/evening activity pacing.
- Keep travel flow realistic (avoid unnecessary backtracking).
- Suggest what to book first (transport, stay, key activities).

In-app concierge flow reference:
- Steps: Dates & Duration, Travel Party, Basecamp, Arrival & Departure, Daily Spending, Primary Goal, Culinary Boundaries, Final Notes.
- Daily spending selector options in-app are ETB-based: <10,000 ETB, 10,000-25,000 ETB, 25,000-50,000 ETB, 50,000-100,000 ETB, 100,000+ ETB.
`;

function nowStamp(): string {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatTourContext(customTrips: StoredCustomTrip[]): string {
  const allTours = customTrips.map((item) => item.trip).slice(0, MAX_CONTEXT_TOURS);

  const toursBlock = allTours
    .map((tour, index) => {
      const places = tour.places
        .slice(0, MAX_CONTEXT_PLACES_PER_TOUR)
        .map((place) => {
          const date = place.date || 'N/A';
          const day = place.day || 'N/A';
          const start = place.startTime || 'N/A';
          const end = place.endTime || 'N/A';
          const category = place.category || 'General';
          const city = place.city || tour.city;
          return `  - ${place.name} (${category}, ${city}) on ${day} ${date} from ${start} to ${end}`;
        })
        .join('\n');

      return `${index + 1}. ${tour.name}\n- id: ${tour.id}\n- summary: ${tour.summary}\n- city: ${tour.city}\n- theme: ${tour.theme}\n- period: ${tour.period}\n- places:\n${places || '  - No places listed'}`;
    })
    .join('\n\n');

  const customMetadata = customTrips
    .slice(0, MAX_CONTEXT_TOURS)
    .map((item, index) => {
      const answers = Object.entries(item.answers)
        .map(([step, values]) => `  - ${step}: ${values.join(', ')}`)
        .join('\n');
      return `${index + 1}. ${item.trip.name}\n- createdAt: ${item.createdAt}\n- notes: ${item.notes || 'None'}\n- answers:\n${answers || '  - No answers stored'}`;
    })
    .join('\n\n');

  return `
## App context
- This dashboard includes a Trips section where users can create custom journeys.
- Custom tours are stored in browser localStorage under key: ${TRIPS_STORAGE_KEY}.
- The Assistant should help with itinerary planning, sequencing, budgeting, and refinement.

## How to create a new tour in this app
1. Open Trips page.
2. Click Create Trip.
3. Complete concierge steps:
   - Dates & Duration
   - The Travel Party
   - The Basecamp
   - Arrival & Departure
   - Daily Spending
   - The Primary Goal
   - Culinary Boundaries
4. Add optional Final Notes.
5. Submit to generate via Gemini through /api/trips/generate.
6. Generated trip is saved locally and appears in the tour list.

## Budget semantics used by the app
- <10,000 ETB
- 10,000 - 25,000 ETB
- 25,000 - 50,000 ETB
- 50,000 - 100,000 ETB
- 100,000+ ETB

## Available tours snapshot
${toursBlock || '- No tours found'}

## Custom tour metadata
${customMetadata || '- No custom tours found'}
`.trim();
}

export default function ChatViewPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tourContext, setTourContext] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const canSubmit = input.trim().length > 0 && !isLoading;
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHATBOT_HISTORY_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as ChatMessage[];
      if (!Array.isArray(parsed)) return;

      const safeMessages = parsed
        .filter((item) => item?.content && (item.role === 'user' || item.role === 'assistant'))
        .slice(-80);

      setMessages(safeMessages);
    } catch {
      // Ignore malformed local history and start fresh.
    }
  }, []);

  useEffect(() => {
    const customTrips = readStoredTrips();
    setTourContext(formatTourContext(customTrips));
  }, []);

  useEffect(() => {
    localStorage.setItem(CHATBOT_HISTORY_KEY, JSON.stringify(messages));
  }, [messages]);

  const emptyState = useMemo(() => messages.length === 0, [messages.length]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    const text = input.trim();
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: nowStamp()
    };

    const nextMessages = [...messages, userMessage];
    const assistantId = `assistant-${Date.now()}`;
    setMessages([
      ...nextMessages,
      {
        id: assistantId,
        role: 'assistant',
        content: '',
        createdAt: nowStamp()
      }
    ]);
    setInput('');
    setIsLoading(true);

    try {
      const contextForRequest = tourContext || formatTourContext(readStoredTrips());

      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          history: nextMessages.map((item) => ({ role: item.role, content: item.content })),
          promptData: PROMPT_DATA,
          tourContext: contextForRequest
        })
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error || 'Unable to get a response right now.');
      }

      if (!response.body) {
        throw new Error('Streaming response was not available.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullReply = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        fullReply += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((item) =>
            item.id === assistantId
              ? {
                  ...item,
                  content: fullReply
                }
              : item
          )
        );
      }

      fullReply += decoder.decode();

      if (!fullReply.trim()) {
        setMessages((prev) =>
          prev.map((item) =>
            item.id === assistantId
              ? {
                  ...item,
                  content: 'I could not generate a response right now.'
                }
              : item
          )
        );
      }
    } catch (error) {
      setMessages((prev) =>
        prev.map((item) =>
          item.id === assistantId
            ? {
                ...item,
                content:
                  error instanceof Error
                    ? error.message
                    : 'Something went wrong while contacting our model.'
              }
            : item
        )
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleClearHistory() {
    setMessages([]);
    localStorage.removeItem(CHATBOT_HISTORY_KEY);
  }

  return (
    <div className='flex min-h-0 flex-1 px-4 py-2 md:px-6'>
      <div className='mx-auto flex h-[calc(100dvh-5.5rem)] w-full max-w-4xl flex-col'>
        <div className='mb-2 flex items-center justify-end'>
          <button
            type='button'
            onClick={handleClearHistory}
            className='text-muted-foreground text-xs transition hover:text-foreground'
          >
            Clear history
          </button>
        </div>

        <div className='min-h-0 flex-1'>
          <ScrollArea className='h-full py-2'>
            {emptyState ? (
              <div className='text-muted-foreground flex h-full min-h-56 items-center justify-center text-center text-sm'>
                Start the conversation by asking anything.
              </div>
            ) : (
              <div className='mx-auto flex w-full max-w-3xl flex-col gap-4'>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex w-full',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      )}
                    >
                      {message.role === 'assistant' ? (
                        <div className='prose prose-sm max-w-none break-words dark:prose-invert'>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content || '...'}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className='whitespace-pre-wrap'>{message.content}</p>
                      )}
                      <p
                        className={cn(
                          'mt-2 text-[11px]',
                          message.role === 'user'
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        )}
                      >
                        {message.createdAt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className='mx-auto mt-3 flex w-full max-w-3xl gap-2 pb-2'
        >
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder='Ask anything...'
            className='min-h-12 resize-none rounded-2xl'
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
          />
          <button
            type='submit'
            disabled={!canSubmit}
            aria-label='Send message'
            className='bg-primary text-primary-foreground flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40'
          >
            {isLoading ? (
              <Icons.spinner className='size-4 animate-spin' />
            ) : (
              <Icons.send className='size-4' />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
