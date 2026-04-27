/**
 * Typed API client for communicating with the FastAPI backend.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  message: string
  session_id: string
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
}

// ─── Chat streaming ───────────────────────────────────────────────────────────

/**
 * Stream chat tokens from the AI clone endpoint via SSE.
 * Yields individual token strings; caller handles display.
 */
export async function* streamChatMessage(
  message: string,
  sessionId: string
): AsyncGenerator<{ type: 'token' | 'done' | 'error'; content?: string; message?: string }> {
  const response = await fetch(`${BASE_URL}/chat/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, session_id: sessionId } satisfies ChatMessage),
  })

  if (!response.ok) {
    yield { type: 'error', message: `Request failed: ${response.statusText}` }
    return
  }

  const reader = response.body?.getReader()
  if (!reader) {
    yield { type: 'error', message: 'No response body' }
    return
  }

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const rawData = line.slice(6).trim()
          if (!rawData || rawData === '[DONE]') continue
          try {
            const parsed = JSON.parse(rawData) as {
              type: 'token' | 'done' | 'error'
              content?: string
              message?: string
            }
            yield parsed
          } catch {
            // Skip malformed SSE lines
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

// ─── Contact form ─────────────────────────────────────────────────────────────

/**
 * Submit the contact form to the backend.
 */
export async function submitContact(
  data: ContactFormData
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  try {
    const response = await fetch(`${BASE_URL}/contact/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const json = await response.json() as { success: boolean; message: string }

    if (!response.ok) {
      return { error: json.message ?? 'Something went wrong.' }
    }

    return { data: json }
  } catch {
    return { error: 'Network error. Please try again.' }
  }
}

// ─── Health check ─────────────────────────────────────────────────────────────

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/health`, { cache: 'no-store' })
    return res.ok
  } catch {
    return false
  }
}
