import { navLinks } from '@/lib/data'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-container footer-inner">
        <a className="wordmark" href="#home">Shubham Singh<span>.</span></a>
        <nav aria-label="Footer navigation">
          {navLinks.filter((link) => link.label !== 'AI Demo').map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
        </nav>
        <p>© {new Date().getFullYear()} Shubham Singh</p>
      </div>
    </footer>
  )
}
