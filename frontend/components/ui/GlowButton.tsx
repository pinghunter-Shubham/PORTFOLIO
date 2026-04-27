'use client'

import { motion } from 'framer-motion'
import { type ReactNode } from 'react'

interface GlowButtonProps {
  children: ReactNode
  variant?: 'solid' | 'outline'
  color?: 'cyan' | 'violet'
  onClick?: () => void
  href?: string
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

/**
 * GlowButton — primary CTA button with glow and hover animations.
 */
export default function GlowButton({
  children,
  variant = 'solid',
  color = 'cyan',
  onClick,
  href,
  className = '',
  type = 'button',
  disabled = false,
}: GlowButtonProps) {
  const isCyan = color === 'cyan'

  const solidStyles = {
    background: isCyan ? 'var(--accent-primary)' : 'var(--accent-secondary)',
    color: '#080B0F',
    boxShadow: isCyan
      ? '0 0 20px var(--accent-glow), 0 0 40px var(--accent-glow)'
      : '0 0 20px var(--violet-glow), 0 0 40px var(--violet-glow)',
  }

  const outlineStyles = {
    background: 'transparent',
    color: isCyan ? 'var(--accent-primary)' : 'var(--accent-secondary)',
    border: `1px solid ${isCyan ? 'var(--accent-primary)' : 'var(--accent-secondary)'}`,
  }

  const baseStyle = variant === 'solid' ? solidStyles : outlineStyles

  const content = (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all cursor-pointer select-none ${className}`}
      style={{
        fontFamily: 'var(--font-dm-sans, sans-serif)',
        fontWeight: 600,
        letterSpacing: '0.02em',
        ...baseStyle,
        opacity: disabled ? 0.5 : 1,
      }}
      whileHover={
        disabled
          ? {}
          : {
              scale: 1.04,
              boxShadow:
                variant === 'solid'
                  ? isCyan
                    ? '0 0 30px var(--accent-glow-strong), 0 0 60px var(--accent-glow)'
                    : '0 0 30px rgba(123,97,255,0.4), 0 0 60px rgba(123,97,255,0.2)'
                  : 'none',
            }
      }
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.button>
  )

  if (href) {
    return (
      <a href={href} className="inline-block">
        {content}
      </a>
    )
  }

  return content
}
