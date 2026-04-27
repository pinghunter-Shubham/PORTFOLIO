'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { z } from 'zod'
import SectionLabel from '@/components/ui/SectionLabel'
import GlowButton from '@/components/ui/GlowButton'
import { submitContact } from '@/lib/api'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  subject: z.enum(['Job Opportunity', 'Freelance', 'Collaboration', 'Other'], {
    errorMap: () => ({ message: 'Please select a subject' }),
  }),
  message: z
    .string()
    .min(20, 'Message must be at least 20 characters')
    .max(2000, 'Message is too long'),
})

type FormData = z.infer<typeof schema>

type Status = 'idle' | 'loading' | 'success' | 'error'

const SOCIAL_LINKS = [
  { icon: Github,   href: 'https://github.com/Shubhamking201',       label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/in/shubham-singh',   label: 'LinkedIn' },
  { icon: Twitter,  href: 'https://twitter.com',                      label: 'Twitter / X' },
  { icon: Mail,     href: 'mailto:Shubhamking201@gmail.com',          label: 'Email' },
]

/**
 * Contact — form with Zod validation + FastAPI submission + success/error states.
 */
export default function Contact() {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    subject: 'Job Opportunity',
    message: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [serverError, setServerError] = useState<string | null>(null)

  const validate = (): boolean => {
    const result = schema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {}
      result.error.errors.forEach((e) => {
        const field = e.path[0] as keyof FormData
        fieldErrors[field] = e.message
      })
      setErrors(fieldErrors)
      return false
    }
    setErrors({})
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setStatus('loading')
    setServerError(null)

    const res = await submitContact(form)
    if (res.error) {
      setStatus('error')
      setServerError(res.error)
    } else {
      setStatus('success')
      setForm({ name: '', email: '', subject: 'Job Opportunity', message: '' })
    }
  }

  const fieldStyle = {
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-primary)',
    borderRadius: 10,
    padding: '12px 16px',
    width: '100%',
    fontSize: 14,
    fontFamily: 'var(--font-dm-sans, sans-serif)',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
    <section id="contact" className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div className="section-container">
        <SectionLabel number="08" label="Contact" />

        <div className="grid md:grid-cols-2 gap-14 mt-10 items-start">
          {/* Left — headline + availability */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="font-display font-bold mb-6"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-primary)' }}
            >
              Let&apos;s Build Something{' '}
              <span className="gradient-text">Intelligent.</span>
            </h2>

            <p className="mb-8" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              I&apos;m currently open to full-time AI engineering roles, select freelance
              engagements, and interesting collaborations. If you&apos;re building at the frontier
              of AI and need someone who can ship — let&apos;s talk.
            </p>

            <div className="space-y-3 mb-10">
              {[
                { label: 'Response time', value: 'Within 24 hours' },
                { label: 'Timezone', value: 'IST (UTC+5:30) · West Bengal, India' },
                { label: 'Open to', value: 'Remote · Hybrid · Relocation' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 text-sm">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: 'var(--accent-primary)' }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-jetbrains-mono, monospace)',
                      color: 'var(--text-tertiary)',
                      minWidth: 120,
                    }}
                  >
                    {item.label}:
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-11 h-11 flex items-center justify-center rounded-xl"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                  }}
                  whileHover={{
                    color: 'var(--accent-primary)',
                    borderColor: 'var(--border-accent)',
                    backgroundColor: 'rgba(0,212,255,0.06)',
                  }}
                  transition={{ duration: 0.15 }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {status === 'success' ? (
              <motion.div
                className="flex flex-col items-center text-center py-16 px-8 rounded-2xl"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid rgba(0,212,140,0.3)',
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                >
                  <CheckCircle size={56} style={{ color: 'var(--success)' }} />
                </motion.div>
                <h3
                  className="text-xl font-bold mt-4 mb-2"
                  style={{ fontFamily: 'var(--font-syne, sans-serif)', color: 'var(--text-primary)' }}
                >
                  Message sent!
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  I&apos;ll respond within 24 hours.
                </p>
                <button
                  className="mt-6 text-sm"
                  style={{ color: 'var(--accent-primary)' }}
                  onClick={() => setStatus('idle')}
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl p-8 space-y-5"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {/* Name + Email row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs mb-1.5" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-jetbrains-mono, monospace)' }}>
                      Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Jane Smith"
                      style={{
                        ...fieldStyle,
                        borderColor: errors.name ? 'var(--error)' : 'var(--border-subtle)',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = errors.name ? 'var(--error)' : 'var(--border-subtle)')}
                    />
                    {errors.name && (
                      <p className="text-xs mt-1" style={{ color: 'var(--error)' }}>{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs mb-1.5" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-jetbrains-mono, monospace)' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="jane@company.com"
                      style={{
                        ...fieldStyle,
                        borderColor: errors.email ? 'var(--error)' : 'var(--border-subtle)',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = errors.email ? 'var(--error)' : 'var(--border-subtle)')}
                    />
                    {errors.email && (
                      <p className="text-xs mt-1" style={{ color: 'var(--error)' }}>{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-jetbrains-mono, monospace)' }}>
                    Subject
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value as FormData['subject'] }))}
                    style={{ ...fieldStyle, cursor: 'pointer' }}
                  >
                    {['Job Opportunity', 'Freelance', 'Collaboration', 'Other'].map((s) => (
                      <option key={s} value={s} style={{ background: 'var(--bg-secondary)' }}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-jetbrains-mono, monospace)' }}>
                    Message
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="Tell me about the role, project, or idea..."
                    rows={5}
                    style={{
                      ...fieldStyle,
                      resize: 'vertical',
                      borderColor: errors.message ? 'var(--error)' : 'var(--border-subtle)',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = errors.message ? 'var(--error)' : 'var(--border-subtle)')}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.message ? (
                      <p className="text-xs" style={{ color: 'var(--error)' }}>{errors.message}</p>
                    ) : <span />}
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {form.message.length}/2000
                    </p>
                  </div>
                </div>

                {/* Server error */}
                {status === 'error' && serverError && (
                  <div
                    className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl"
                    style={{
                      background: 'rgba(255,87,87,0.1)',
                      border: '1px solid rgba(255,87,87,0.25)',
                      color: 'var(--error)',
                    }}
                  >
                    <AlertCircle size={14} />
                    {serverError}
                  </div>
                )}

                <GlowButton
                  type="submit"
                  variant="solid"
                  color="cyan"
                  disabled={status === 'loading'}
                  className="w-full justify-center"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </GlowButton>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
