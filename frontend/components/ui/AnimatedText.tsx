'use client'

import { motion } from 'framer-motion'

interface AnimatedTextProps {
  text: string
  className?: string
  /** Animation style */
  variant?: 'words' | 'chars' | 'fade'
  delay?: number
  stagger?: number
}

/**
 * AnimatedText — animates text reveal word-by-word or character-by-character.
 */
export default function AnimatedText({
  text,
  className = '',
  variant = 'words',
  delay = 0,
  stagger = 0.08,
}: AnimatedTextProps) {
  if (variant === 'words') {
    const words = text.split(' ')
    return (
      <span className={`inline-block ${className}`} aria-label={text}>
        {words.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block mr-[0.3em]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: delay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        ))}
      </span>
    )
  }

  if (variant === 'chars') {
    const chars = text.split('')
    return (
      <span className={`inline-block ${className}`} aria-label={text}>
        {chars.map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.05,
              delay: delay + i * 0.04,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </span>
    )
  }

  // fade variant
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {text}
    </motion.span>
  )
}
