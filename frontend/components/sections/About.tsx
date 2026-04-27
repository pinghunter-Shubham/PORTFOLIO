'use client'

import { motion } from 'framer-motion'
import SectionLabel from '@/components/ui/SectionLabel'
import TerminalWindow from '@/components/ui/TerminalWindow'

const TERMINAL_LINES = [
  { type: 'command' as const, content: 'whoami', delay: 300 },
  { type: 'output' as const, content: 'Shubham Singh · ML Engineer · West Bengal, India', delay: 100 },
  { type: 'blank' as const, content: '', delay: 200 },
  { type: 'command' as const, content: 'cat skills.json', delay: 400 },
  { type: 'output' as const, content: '{ "languages": ["Python", "C++", "SQL"],', delay: 80 },
  { type: 'output' as const, content: '  "ml": ["TensorFlow", "Scikit-learn", "Keras"],', delay: 80 },
  { type: 'output' as const, content: '  "cv": ["OpenCV", "MediaPipe", "U-Net"],', delay: 80 },
  { type: 'output' as const, content: '  "tools": ["Jupyter", "Flask", "AWS"] }', delay: 80 },
  { type: 'blank' as const, content: '', delay: 200 },
  { type: 'command' as const, content: 'echo $mission', delay: 500 },
  { type: 'output' as const, content: '"Turning data into decisions that matter."', delay: 100 },
  { type: 'blank' as const, content: '', delay: 200 },
  { type: 'command' as const, content: 'git log --oneline -3', delay: 400 },
  { type: 'output' as const, content: 'a1b2c3d  brain tumor classifier — 94% accuracy', delay: 60 },
  { type: 'output' as const, content: 'e4f5g6h  ISL real-time sign detection deployed', delay: 60 },
  { type: 'output' as const, content: 'i7j8k9l  legal petition ML model — 91.3% acc', delay: 60 },
]

const stats = [
  { value: '7+',   label: 'ML Projects' },
  { value: '94%',  label: 'Best Model Acc' },
  { value: '3',    label: 'Certifications' },
  { value: '2',    label: 'Industry Roles' },
]

/**
 * About — two-column layout with animated terminal on the left and bio on the right.
 */
export default function About() {
  return (
    <section id="about" className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div className="section-container">
        <SectionLabel number="02" label="About Me" />

        <div className="grid md:grid-cols-2 gap-12 items-center mt-10">
          {/* Terminal window */}
          <TerminalWindow lines={TERMINAL_LINES} className="w-full" />

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2
              className="font-display font-bold mb-6"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: 'var(--text-primary)' }}
            >
              I build at the edge of{' '}
              <span className="gradient-text">data and intelligence.</span>
            </h2>

            <div className="space-y-4" style={{ color: 'var(--text-secondary)' }}>
              <p>
                I&apos;m Shubham Singh — a Computer Science Engineering graduate from Techno India
                University, West Bengal, currently working as a Programmer Analyst Trainee at
                Cognizant. My passion is applying machine learning and AI to solve real, measurable
                problems.
              </p>
              <p>
                From building a brain tumor segmentation model with 94% accuracy to training a
                real-time Indian Sign Language detector — I care about the full journey: clean data,
                well-evaluated models, and results that hold up beyond the notebook.
              </p>
              <p>
                I&apos;ve interned at Celebal Technologies as a Data Science Intern, led a team of 5
                at the Smart India Hackathon, and contributed to faculty-guided research on ML-based
                legal decision prediction. I&apos;m actively growing into LLMs and production AI systems.
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  className="text-center p-4 rounded-xl"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                  whileHover={{ borderColor: 'var(--border-accent)' }}
                >
                  <p
                    className="text-2xl font-bold"
                    style={{
                      fontFamily: 'var(--font-syne, sans-serif)',
                      color: 'var(--accent-primary)',
                    }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-jetbrains-mono, monospace)' }}
                  >
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
