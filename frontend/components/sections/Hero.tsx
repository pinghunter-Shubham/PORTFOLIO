'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import dynamic from 'next/dynamic'
import GlowButton from '@/components/ui/GlowButton'

// Load Three.js canvas only on client to avoid SSR issues
const ParticleCanvas = dynamic(() => import('@/components/ui/ParticleCanvas'), { ssr: false })

const TYPED_WORDS = ['AI Engineer', 'React Developer', 'Python Architect', 'LLM Builder']

/**
 * Hero — full-viewport section with Three.js neural network bg, animated headline,
 * typewriter subheadline, and dual CTAs.
 */
export default function Hero() {
  const [typedText, setTypedText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Typewriter effect
  useEffect(() => {
    const currentWord = TYPED_WORDS[wordIndex]

    const tick = () => {
      if (!isDeleting) {
        setTypedText(currentWord.slice(0, charIndex + 1))
        if (charIndex + 1 === currentWord.length) {
          timeoutRef.current = setTimeout(() => setIsDeleting(true), 1800)
        } else {
          setCharIndex((c) => c + 1)
        }
      } else {
        setTypedText(currentWord.slice(0, charIndex - 1))
        if (charIndex - 1 === 0) {
          setIsDeleting(false)
          setWordIndex((w) => (w + 1) % TYPED_WORDS.length)
          setCharIndex(0)
        } else {
          setCharIndex((c) => c - 1)
        }
      }
    }

    timeoutRef.current = setTimeout(tick, isDeleting ? 50 : 80)
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [charIndex, isDeleting, wordIndex])

  const scrollToWork = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }
  const scrollToChat = () => {
    document.getElementById('ai-demo')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      className="relative flex items-center justify-center"
      style={{ minHeight: '100vh', overflow: 'hidden' }}
    >
      {/* Three.js background */}
      <div className="absolute inset-0 z-0">
        <ParticleCanvas />
      </div>

      {/* Dot-grid overlay */}
      <div className="absolute inset-0 z-0 dot-grid-bg opacity-30" />

      {/* Radial gradient vignette */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 20%, var(--bg-primary) 100%)',
        }}
      />

      {/* Foreground content */}
      <div className="relative z-10 section-container text-center px-6">
        {/* Section marker */}
        <motion.p
          className="mb-6 tracking-widest text-xs uppercase"
          style={{
            fontFamily: 'var(--font-jetbrains-mono, monospace)',
            color: 'var(--accent-primary)',
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          // 01&nbsp;&nbsp;HELLO WORLD
        </motion.p>

        {/* Main headline — word-by-word reveal */}
        <h1
          className="font-display font-extrabold leading-none mb-6"
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
        >
          {['Building', 'the'].map((word, i) => (
            <motion.span
              key={word}
              className="inline-block mr-[0.25em]"
              style={{ color: 'var(--text-primary)' }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}
            </motion.span>
          ))}
          <br />
          <motion.span
            className="inline-block gradient-text-animated"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'inline-block' }}
          >
            Intelligence
          </motion.span>
          <br />
          <motion.span
            className="inline-block"
            style={{ color: 'var(--text-primary)' }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            Layer.
          </motion.span>
        </h1>

        {/* Typewriter subheadline */}
        <motion.p
          className="mb-10 text-base md:text-lg"
          style={{
            fontFamily: 'var(--font-jetbrains-mono, monospace)',
            color: 'var(--text-secondary)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          {typedText}
          <span
            className="cursor-blink ml-0.5"
            style={{ color: 'var(--accent-primary)' }}
          >
            ▋
          </span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.5 }}
        >
          <GlowButton variant="solid" color="cyan" onClick={scrollToWork}>
            View My Work
          </GlowButton>
          <GlowButton variant="outline" color="violet" onClick={scrollToChat}>
            Chat with My AI Clone →
          </GlowButton>
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: 'var(--text-tertiary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          aria-label="Scroll down"
        >
          <span
            className="text-xs tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-jetbrains-mono, monospace)' }}
          >
            scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown size={16} />
          </motion.div>
        </motion.button>
      </div>
    </section>
  )
}
