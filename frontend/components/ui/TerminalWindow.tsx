'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

interface TerminalLine {
  type: 'command' | 'output' | 'blank'
  content: string
  delay?: number // ms before this line starts typing
}

interface TerminalWindowProps {
  lines: TerminalLine[]
  className?: string
  autoPlay?: boolean
}

/**
 * TerminalWindow — animated terminal that types out lines with realistic delays.
 */
export default function TerminalWindow({
  lines,
  className = '',
  autoPlay = true,
}: TerminalWindowProps) {
  const [visibleLines, setVisibleLines] = useState<
    { line: TerminalLine; text: string; done: boolean }[]
  >([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!autoPlay) {
      setVisibleLines(lines.map((l) => ({ line: l, text: l.content, done: true })))
      return
    }
    setVisibleLines([])
    setCurrentLine(0)
    setCurrentChar(0)
  }, [lines, autoPlay])

  useEffect(() => {
    if (!autoPlay) return
    if (currentLine >= lines.length) return

    const line = lines[currentLine]

    if (line.type === 'blank') {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, { line, text: '', done: true }])
        setCurrentLine((l) => l + 1)
        setCurrentChar(0)
      }, line.delay ?? 200)
      return () => clearTimeout(t)
    }

    if (currentChar === 0) {
      const startDelay = line.delay ?? (line.type === 'output' ? 150 : 400)
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, { line, text: '', done: false }])
        setCurrentChar(1)
      }, startDelay)
      return () => clearTimeout(t)
    }

    if (currentChar <= line.content.length) {
      const charDelay = line.type === 'command' ? 40 : 12
      const t = setTimeout(() => {
        setVisibleLines((prev) => {
          const updated = [...prev]
          const last = updated[updated.length - 1]
          if (last) {
            updated[updated.length - 1] = {
              ...last,
              text: line.content.slice(0, currentChar),
              done: currentChar === line.content.length,
            }
          }
          return updated
        })
        if (currentChar === line.content.length) {
          setCurrentLine((l) => l + 1)
          setCurrentChar(0)
        } else {
          setCurrentChar((c) => c + 1)
        }
      }, charDelay)
      return () => clearTimeout(t)
    }
  }, [autoPlay, currentLine, currentChar, lines])

  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [visibleLines])

  return (
    <motion.div
      className={`rounded-xl overflow-hidden ${className}`}
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 0 40px rgba(0,0,0,0.4)',
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{
          background: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <span className="w-3 h-3 rounded-full" style={{ background: '#FF5757' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: '#FFB340' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: '#00D48C' }} />
        <span
          className="ml-3 text-xs"
          style={{
            fontFamily: 'var(--font-jetbrains-mono, monospace)',
            color: 'var(--text-tertiary)',
          }}
        >
          terminal
        </span>
      </div>

      {/* Terminal body */}
      <div ref={bodyRef} className="p-6 min-h-[280px] overflow-auto max-h-[420px]">
        {visibleLines.map((entry, i) => (
          <div key={i} className="mb-1">
            {entry.line.type === 'blank' ? (
              <div className="h-4" />
            ) : (
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: 'var(--font-jetbrains-mono, monospace)' }}
              >
                {entry.line.type === 'command' && (
                  <span style={{ color: 'var(--accent-primary)' }}>$ </span>
                )}
                {entry.line.type === 'output' && (
                  <span style={{ color: 'var(--text-tertiary)' }}>&gt; </span>
                )}
                <span
                  style={{
                    color:
                      entry.line.type === 'command'
                        ? 'var(--text-primary)'
                        : 'var(--text-secondary)',
                  }}
                >
                  {entry.text}
                </span>
                {/* Blinking cursor on the active line */}
                {!entry.done && i === visibleLines.length - 1 && (
                  <span
                    className="cursor-blink ml-0.5"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    ▋
                  </span>
                )}
              </p>
            )}
          </div>
        ))}
        {/* Idle cursor after all lines done */}
        {currentLine >= lines.length && (
          <p
            className="text-sm mt-1"
            style={{ fontFamily: 'var(--font-jetbrains-mono, monospace)' }}
          >
            <span style={{ color: 'var(--accent-primary)' }}>$ </span>
            <span className="cursor-blink" style={{ color: 'var(--accent-primary)' }}>
              ▋
            </span>
          </p>
        )}
      </div>
    </motion.div>
  )
}
