import SectionLabel from '@/components/ui/SectionLabel'

const facts = [
  { value: 'Computer vision', label: 'Focus area' },
  { value: 'Machine learning', label: 'Core discipline' },
  { value: 'Applied AI', label: 'Current direction' },
]

export default function About() {
  return (
    <section id="about" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="section-container">
        <SectionLabel number="02" label="About" />
        <div className="about-layout">
          <h2 className="about-heading">Thoughtful models. Useful outcomes.</h2>
          <div className="about-copy">
            <p>
              I’m Shubham Singh, a computer science graduate interested in machine learning and applied AI. I work across the practical steps that make a model useful: preparing data, choosing an approach, evaluating results, and building software around it.
            </p>
            <p>
              My project work includes computer vision, Indian Sign Language recognition, and machine learning for research. I’m currently growing my experience with production AI systems.
            </p>
            <div className="about-facts">
              {facts.map((fact) => (
                <div className="about-fact" key={fact.label}>
                  <span>{fact.value}</span>
                  <small>{fact.label}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
