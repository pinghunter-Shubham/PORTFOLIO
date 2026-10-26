import SectionLabel from '@/components/ui/SectionLabel'
import { skills, type Skill } from '@/lib/data'

const GROUP_COLORS: Record<Skill['group'], string> = {
  'AI / ML': '#b54832',
  Frontend: '#61795f',
  Backend: '#61795f',
  Tools: '#77756e',
}

export default function Skills() {
  const groups = Array.from(new Set(skills.map((skill) => skill.group)))

  return (
    <section id="skills" className="section-padding">
      <div className="section-container">
        <SectionLabel number="03" label="Skills" />
        <div className="section-heading-row">
          <h2 className="font-display font-bold">The tools I reach for.</h2>
          <p>Practical tools for data, models, and the software around them.</p>
        </div>
        <div className="skills-grid">
          {groups.map((group) => (
            <section className="skill-group" key={group} aria-labelledby={'skill-' + group.replace(/[^a-z0-9]/gi, '')}>
              <h3 id={'skill-' + group.replace(/[^a-z0-9]/gi, '')} style={{ color: GROUP_COLORS[group] }}>{group}</h3>
              <ul>
                {skills.filter((skill) => skill.group === group).map((skill) => (
                  <li key={skill.id}>{skill.name}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}
