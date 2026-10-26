/**
 * SectionLabel — displays the terminal-style section marker like "// 01  HELLO WORLD"
 */

interface SectionLabelProps {
  number: string
  label: string
  className?: string
}

export default function SectionLabel({ number, label, className = '' }: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-3 mb-4 ${className}`}>
      <span
        className="text-xs tracking-widest uppercase"
        style={{ fontFamily: 'var(--font-jetbrains-mono, monospace)', color: 'var(--accent-primary)' }}
      >
        {'//'} {number}
      </span>
      <span
        className="text-xs tracking-widest uppercase"
        style={{ fontFamily: 'var(--font-jetbrains-mono, monospace)', color: 'var(--text-tertiary)' }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-px"
        style={{ background: 'linear-gradient(to right, var(--border-accent), transparent)' }}
      />
    </div>
  )
}
