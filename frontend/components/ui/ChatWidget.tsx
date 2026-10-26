'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, Bot, User, AlertCircle } from 'lucide-react'
import { streamChatMessage } from '@/lib/api'
import { generateSessionId } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

const SUGGESTED = [
  "What's your experience with LLMs?",
  'Walk me through one of your AI projects',
  "What's your tech stack?",
  'Are you open to new opportunities?',
]

const MAX_MESSAGES = 10 // 5 exchanges before soft limit

/**
 * ChatWidget — full streaming SSE chat interface for the AI clone.
 */
export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      content:
        "Hi! I can answer questions about Shubham's background, projects, and skills. What would you like to know?",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => generateSessionId())
  const [rateLimited, setRateLimited] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const userMessageCount = messages.filter((m) => m.role === 'user').length

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isLoading || rateLimited) return
      if (userMessageCount >= MAX_MESSAGES) {
        setRateLimited(true)
        return
      }

      const userMsg: Message = {
        id: `u_${Date.now()}`,
        role: 'user',
        content: trimmed,
      }
      const assistantMsg: Message = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: '',
        isStreaming: true,
      }

      setMessages((prev) => [...prev, userMsg, assistantMsg])
      setInput('')
      setIsLoading(true)
      setError(null)

      try {
        const stream = streamChatMessage(trimmed, sessionId)
        for await (const event of stream) {
          if (event.type === 'token' && event.content) {
            setMessages((prev) => {
              const updated = [...prev]
              const last = updated[updated.length - 1]
              if (last && last.id === assistantMsg.id) {
                updated[updated.length - 1] = {
                  ...last,
                  content: last.content + event.content,
                }
              }
              return updated
            })
          }
          if (event.type === 'error') {
            setError(event.message ?? 'Something went wrong.')
            break
          }
          if (event.type === 'done') break
        }
      } catch {
        setError('Could not reach the AI server. Make sure the backend is running.')
      } finally {
        setMessages((prev) => {
          const updated = [...prev]
          const last = updated[updated.length - 1]
          if (last?.id === assistantMsg.id) {
            updated[updated.length - 1] = { ...last, isStreaming: false }
          }
          return updated
        })
        setIsLoading(false)
        inputRef.current?.focus()
      }
    },
    [isLoading, rateLimited, sessionId, userMessageCount]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        height: 520,
        boxShadow: '0 0 60px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{
          background: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'var(--accent-glow)', border: '1px solid var(--border-accent)' }}
        >
          <Bot size={16} style={{ color: 'var(--accent-primary)' }} />
        </div>
        <div>
          <p
            className="text-sm font-semibold"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-syne, sans-serif)' }}
          >
            Portfolio assistant
          </p>
          <p
            className="text-xs"
            style={{
              color: isLoading ? 'var(--accent-primary)' : 'var(--success)',
              fontFamily: 'var(--font-jetbrains-mono, monospace)',
            }}
          >
            {isLoading ? 'typing...' : '● online'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {msg.role === 'assistant' && (
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mb-1"
                  style={{
                    background: 'var(--accent-glow)',
                    border: '1px solid var(--border-accent)',
                  }}
                >
                  <Bot size={12} style={{ color: 'var(--accent-primary)' }} />
                </div>
              )}

              <div
                className="max-w-[80%] px-4 py-3 rounded-2xl text-sm"
                style={{
                  fontFamily: 'var(--font-dm-sans, sans-serif)',
                  lineHeight: 1.65,
                  ...(msg.role === 'user'
                    ? {
                        background: 'var(--accent-secondary)',
                        color: '#F0F4FF',
                        borderBottomRightRadius: 4,
                      }
                    : {
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-secondary)',
                        borderLeft: '2px solid var(--accent-primary)',
                        borderBottomLeftRadius: 4,
                      }),
                }}
              >
                {msg.content}
                {msg.isStreaming && msg.content === '' && (
                  <span className="inline-flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                )}
                {msg.isStreaming && msg.content !== '' && (
                  <span className="cursor-blink ml-0.5" style={{ color: 'var(--accent-primary)' }}>▋</span>
                )}
              </div>

              {msg.role === 'user' && (
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mb-1"
                  style={{ background: 'var(--accent-secondary)' }}
                >
                  <User size={12} style={{ color: '#F0F4FF' }} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <motion.div
            className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl"
            style={{
              background: 'rgba(255,87,87,0.1)',
              border: '1px solid rgba(255,87,87,0.25)',
              color: 'var(--error)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertCircle size={14} />
            {error}
          </motion.div>
        )}

        {/* Rate limit */}
        {rateLimited && (
          <motion.div
            className="text-center text-sm py-4 px-4 rounded-xl"
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            You&apos;ve reached the demo limit.{' '}
            <a
              href="#contact"
              style={{ color: 'var(--accent-primary)' }}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Request a full conversation via email →
            </a>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      {messages.length <= 2 && !rateLimited && (
        <div className="px-5 pb-3 flex flex-wrap gap-2">
          {SUGGESTED.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 rounded-full transition-colors"
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-dm-sans, sans-serif)',
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        className="p-4 flex items-end gap-3"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          disabled={isLoading || rateLimited}
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:opacity-40"
          style={{
            fontFamily: 'var(--font-jetbrains-mono, monospace)',
            color: 'var(--text-primary)',
            caretColor: 'var(--accent-primary)',
            maxHeight: 96,
          }}
        />
        <motion.button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isLoading || rateLimited}
          className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
          style={{
            background: input.trim() && !isLoading ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
            color: input.trim() && !isLoading ? '#080B0F' : 'var(--text-tertiary)',
            transition: 'background 0.2s',
          }}
          whileHover={input.trim() && !isLoading ? { scale: 1.08 } : {}}
          whileTap={input.trim() && !isLoading ? { scale: 0.94 } : {}}
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={15} />
          )}
        </motion.button>
      </div>
    </div>
  )
}
