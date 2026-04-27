'use client'

import Link from 'next/link'
import { Github, Linkedin, Twitter, Mail } from 'lucide-react'
import { navLinks } from '@/lib/data'

/**
 * Footer — dark minimal footer with logo, nav links, built-with badge, and copyright.
 */
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <div className="section-container py-12">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Logo + tagline */}
          <div>
            <p
              className="text-lg mb-3"
              style={{
                fontFamily: 'var(--font-jetbrains-mono, monospace)',
                color: 'var(--text-primary)',
              }}
            >
              <span style={{ color: 'var(--text-tertiary)' }}>&lt;</span>
              <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Shubham</span>
              <span>/</span>
              <span style={{ color: 'var(--accent-secondary)', fontWeight: 700 }}>Singh</span>
              <span style={{ color: 'var(--text-tertiary)' }}>/&gt;</span>
            </p>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
              ML Engineer · turning data into decisions that matter.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-3 content-start">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="text-sm transition-colors"
                style={{ color: 'var(--text-tertiary)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/blog"
              className="text-sm"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Blog
            </Link>
          </nav>

          {/* Built with + social */}
          <div>
            <p
              className="text-xs mb-4"
              style={{
                fontFamily: 'var(--font-jetbrains-mono, monospace)',
                color: 'var(--text-tertiary)',
                lineHeight: 1.7,
              }}
            >
              Built with{' '}
              <span style={{ color: 'var(--accent-primary)' }}>Next.js</span>,{' '}
              <span style={{ color: 'var(--accent-secondary)' }}>FastAPI</span> &{' '}
              <span style={{ color: 'var(--accent-primary)' }}>Claude</span>
            </p>

            <div className="flex gap-3">
              {[
                { icon: Github,   href: 'https://github.com/Shubhamking201',        label: 'GitHub' },
                { icon: Linkedin, href: 'https://linkedin.com/in/shubham-singh',   label: 'LinkedIn' },
                { icon: Twitter,  href: 'https://twitter.com',                      label: 'Twitter' },
                { icon: Mail,     href: 'mailto:Shubhamking201@gmail.com',          label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
                  style={{
                    color: 'var(--text-tertiary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--accent-primary)'
                    e.currentTarget.style.borderColor = 'var(--border-accent)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-tertiary)'
                    e.currentTarget.style.borderColor = 'var(--border-subtle)'
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 text-xs"
          style={{
            borderTop: '1px solid var(--border-subtle)',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-jetbrains-mono, monospace)',
          }}
        >
          <p>© {year} Shubham Singh. All rights reserved.</p>
          <p>Made in Hyderabad, India 🇮🇳</p>
        </div>
      </div>
    </footer>
  )
}
