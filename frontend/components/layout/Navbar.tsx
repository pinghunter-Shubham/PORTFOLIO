'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { navLinks } from '@/lib/data'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = (href: string) => {
    setMobileOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="site-header">
      <div className="section-container nav-inner">
        <a className="wordmark" href="#home" onClick={(event) => { event.preventDefault(); navigate('#home') }}>Shubham Singh<span>.</span></a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navLinks.filter((link) => link.label !== 'AI Demo').map((link) => (
            <a key={link.href} href={link.href} onClick={(event) => { event.preventDefault(); navigate(link.href) }}>{link.label}</a>
          ))}
        </nav>
        <button className="menu-toggle" type="button" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {mobileOpen && <nav className="mobile-nav" aria-label="Mobile navigation">
        {navLinks.filter((link) => link.label !== 'AI Demo').map((link) => (
          <a key={link.href} href={link.href} onClick={(event) => { event.preventDefault(); navigate(link.href) }}>{link.label}</a>
        ))}
      </nav>}
    </header>
  )
}
