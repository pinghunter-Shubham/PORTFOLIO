'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { navLinks } from '@/lib/data'

/**
 * Navbar — fixed glassmorphism nav with smart hide on scroll-down, mobile overlay menu.
 */
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  // Smart hide on scroll
  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY
      setIsScrolled(current > 20)
      setIsHidden(current > lastScrollY && current > 100)
      setLastScrollY(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lastScrollY])

  // Active section detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    document.querySelectorAll('section[id]').forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        animate={{ y: isHidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div
          className={`nav-blur transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'}`}
        >
          <div className="section-container flex items-center justify-between">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); handleNavClick('#home') }}
              className="flex items-center gap-1 select-none"
              style={{
                fontFamily: 'var(--font-jetbrains-mono, monospace)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                fontWeight: 500,
              }}
            >
              <span style={{ color: 'var(--text-tertiary)' }}>&lt;</span>
              <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>SS</span>
              <span>/</span>
              <span style={{ color: 'var(--accent-secondary)', fontWeight: 700 }}>ML</span>
              <span style={{ color: 'var(--text-tertiary)' }}>/&gt;</span>
              <span
                className="cursor-blink ml-0.5 text-sm"
                style={{ color: 'var(--accent-primary)' }}
              >
                ▋
              </span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const sectionId = link.href.replace('#', '')
                const isActive = activeSection === sectionId
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                    className="relative text-sm transition-colors duration-200"
                    style={{
                      fontFamily: 'var(--font-dm-sans, sans-serif)',
                      color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontWeight: 500,
                    }}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 right-0 h-px"
                        style={{ background: 'var(--accent-primary)' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </a>
                )
              })}
            </nav>

            {/* Hire Me CTA */}
            <motion.a
              href="#contact"
              onClick={(e) => { e.preventDefault(); handleNavClick('#contact') }}
              className="hidden md:inline-flex items-center px-5 py-2 rounded-lg text-sm font-semibold"
              style={{
                fontFamily: 'var(--font-dm-sans, sans-serif)',
                color: 'var(--accent-primary)',
                border: '1px solid var(--border-accent)',
              }}
              whileHover={{
                backgroundColor: 'rgba(0,212,255,0.08)',
                boxShadow: '0 0 20px var(--accent-glow)',
              }}
              transition={{ duration: 0.15 }}
            >
              Hire Me
            </motion.a>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg"
              style={{ color: 'var(--text-primary)', background: 'var(--bg-tertiary)' }}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col"
            style={{ background: 'var(--bg-primary)' }}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between p-6">
              <span
                style={{
                  fontFamily: 'var(--font-jetbrains-mono, monospace)',
                  color: 'var(--accent-primary)',
                  fontSize: '0.875rem',
                }}
              >
                // MENU
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg"
                style={{ color: 'var(--text-primary)', background: 'var(--bg-tertiary)' }}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col items-start gap-2 px-6 mt-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                  className="text-3xl font-bold py-3 w-full"
                  style={{
                    fontFamily: 'var(--font-syne, sans-serif)',
                    color: 'var(--text-primary)',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                  whileTap={{ color: 'var(--accent-primary)' }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <div className="mt-auto p-6">
              <motion.a
                href="#contact"
                onClick={(e) => { e.preventDefault(); handleNavClick('#contact') }}
                className="block w-full text-center py-4 rounded-xl font-semibold text-lg"
                style={{
                  background: 'var(--accent-primary)',
                  color: '#080B0F',
                  fontFamily: 'var(--font-syne, sans-serif)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Hire Me
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
