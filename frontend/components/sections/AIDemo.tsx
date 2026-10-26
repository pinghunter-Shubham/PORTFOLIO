import SectionLabel from '@/components/ui/SectionLabel'
import ChatWidget from '@/components/ui/ChatWidget'

const details = [
  { label: 'Model', value: 'Gemini 3.8 Flash · free tier' },
  { label: 'Knowledge', value: 'Portfolio background, projects, and skills' },
  { label: 'Responses', value: 'Streamed from the portfolio API' },
]

export default function AIDemo() {
  return (
    <section id="ai-demo" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="section-container">
        <SectionLabel number="06" label="Portfolio assistant" />
        <div className="grid md:grid-cols-2 gap-12 items-center mt-10">
          <div>
            <h2 className="font-display font-bold mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-primary)' }}>
              Ask about my work.
            </h2>
            <p className="mb-8" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              This chat assistant uses the portfolio knowledge base to answer questions about my background, projects, and skills. The backend sends that context to Gemini and streams the response back to the page.
            </p>
            <dl className="space-y-4">
              {details.map((item) => (
                <div className="flex flex-col gap-1 border-t pt-3 sm:flex-row sm:gap-4" style={{ borderColor: 'var(--border-subtle)' }} key={item.label}>
                  <dt className="min-w-24 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.label}</dt>
                  <dd className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <ChatWidget />
        </div>
      </div>
    </section>
  )
}
