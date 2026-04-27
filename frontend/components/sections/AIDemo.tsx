'use client'

import { motion } from 'framer-motion'
import SectionLabel from '@/components/ui/SectionLabel'
import ChatWidget from '@/components/ui/ChatWidget'

/**
 * AIDemo — section wrapping the ChatWidget with intro copy and layout.
 */
export default function AIDemo() {
  return (
    <section id="ai-demo" className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div className="section-container">
        <SectionLabel number="06" label="Talk to My AI Clone" />

        <div className="grid md:grid-cols-2 gap-12 items-center mt-10">
          {/* Left — intro */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2
              className="font-display font-bold mb-6"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-primary)' }}
            >
              Ask me anything.{' '}
              <span className="gradient-text">Literally.</span>
            </h2>

            <p className="mb-6" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              I&apos;ve built a RAG-powered AI trained on my resume, projects, and writing. It
              uses Claude claude-sonnet-4-20250514 with retrieval over my personal knowledge base to
              answer questions about my background, skills, and work — accurately and in real time.
            </p>

            <p className="mb-8" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              This isn&apos;t a simple chatbot — it&apos;s a demonstration of the RAG pipeline
              architecture I use in production. Streaming responses, vector retrieval, session
              memory, and rate limiting all running live.
            </p>

            {/* Architecture callouts */}
            <div className="space-y-3">
              {[
                { label: 'Model', value: 'Claude claude-sonnet-4-20250514 via Anthropic API' },
                { label: 'Retrieval', value: 'Chroma vector store · MMR search · top-5 chunks' },
                { label: 'Context', value: 'Resume + projects + writing (personal KB)' },
                { label: 'Streaming', value: 'SSE · token-by-token · <200ms TTFT' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 text-sm"
                >
                  <span
                    className="shrink-0 pt-0.5"
                    style={{
                      fontFamily: 'var(--font-jetbrains-mono, monospace)',
                      color: 'var(--accent-primary)',
                      minWidth: 80,
                    }}
                  >
                    {item.label}:
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — chat widget */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <ChatWidget />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
