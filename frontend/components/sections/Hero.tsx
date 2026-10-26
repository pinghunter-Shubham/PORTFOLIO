'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'

const HeroScene = dynamic(() => import('@/components/ui/HeroScene'), { ssr: false })

export default function Hero() {
  return (
    <section id="home" className="hero section-container">
      <div className="hero-copy">
        <p className="eyebrow">Machine learning · Applied AI · Data</p>
        <h1>I build machine learning systems for problems that matter.</h1>
        <p className="hero-summary">
          I’m Shubham Singh, an ML engineer focused on computer vision, practical AI, and turning research into useful software.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" href="#projects">View selected work</Link>
          <Link className="button button-secondary" href="#contact">Get in touch</Link>
        </div>
        <p className="hero-location">Based in West Bengal, India <span aria-hidden="true">·</span> Open to meaningful opportunities</p>
      </div>
      <div className="hero-art-column">
        <div className="hero-visual" aria-hidden="true">
          <HeroScene />
          <span className="hero-scene-label">FIG. 01 <span>·</span> MODEL SYSTEMS</span>
        </div>
        <aside className="hero-note" aria-label="Areas of focus">
          <span className="hero-note-label">CURRENT FOCUS</span>
          <div className="hero-note-items">
            <p>Computer vision</p>
            <p>Machine learning</p>
            <p>Production-minded AI</p>
          </div>
        </aside>
      </div>
    </section>
  )
}
