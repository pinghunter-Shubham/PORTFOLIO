import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import type { Metadata } from 'next'
import { blogPosts } from '@/lib/data'
import { getBlogPost } from '@/lib/blog'

// Render at request-time so rehype-pretty-code doesn't run in the static worker
export const dynamic = 'force-dynamic'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = blogPosts.find((p) => p.slug === params.slug)
  if (!meta) return {}
  return { title: meta.title, description: meta.excerpt }
}

const CATEGORY_COLORS: Record<string, string> = {
  'LLM Engineering': '#00D4FF',
  'AI Engineering':  '#7B61FF',
  'Full Stack':      '#00D48C',
}

/**
 * Blog post page — renders MDX with syntax highlighting on demand (force-dynamic).
 */
export default async function BlogPostPage({ params }: Props) {
  const meta = blogPosts.find((p) => p.slug === params.slug)
  if (!meta) notFound()

  const content = await getBlogPost(params.slug)
  const color = CATEGORY_COLORS[meta.category] ?? '#8892A4'

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: 'var(--bg-primary)' }}>
      <div className="section-container max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm mb-10"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <ArrowLeft size={14} />
          All posts
        </Link>

        {/* Article header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span
              className="text-xs px-2.5 py-1 rounded-full"
              style={{
                fontFamily: 'var(--font-jetbrains-mono, monospace)',
                color,
                background: `${color}15`,
                border: `1px solid ${color}30`,
              }}
            >
              {meta.category}
            </span>
            <span
              className="flex items-center gap-1.5 text-xs"
              style={{
                color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-jetbrains-mono, monospace)',
              }}
            >
              <Calendar size={10} />
              {new Date(meta.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span
              className="flex items-center gap-1.5 text-xs"
              style={{
                color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-jetbrains-mono, monospace)',
              }}
            >
              <Clock size={10} />
              {meta.readingTime}
            </span>
          </div>

          <h1
            className="font-display font-bold mb-4"
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              color: 'var(--text-primary)',
              lineHeight: 1.15,
            }}
          >
            {meta.title}
          </h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {meta.excerpt}
          </p>
        </header>

        <hr style={{ borderColor: 'var(--border-subtle)', marginBottom: '2.5rem' }} />

        {/* MDX content */}
        <article className="prose-dark">{content}</article>
      </div>
    </div>
  )
}
